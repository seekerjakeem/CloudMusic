import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/operators';
import { inArray } from 'src/app/utils/array';
import { getPercent, limitNumberInRange } from 'src/app/utils/number';
import { getElementOffset, sliderEvent } from './wy-slider-helper';
import { SilderValue, SliderEventObserverConfig } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush, 
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WySliderComponent),//允许我们使用尚未定义的类
    multi: true 
  }]
  // onPush这个策略如果在input不发生变化的时候，永远不发生变更检测
})
export class WySliderComponent implements OnInit, OnChanges,OnDestroy, ControlValueAccessor {
  show = true;
  private sliderDom: HTMLDivElement;
  @Input() wyVertical = false ;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @ViewChild('wySlider',{static: true}) private wySlider: ElementRef;
  
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  private dragStart_: Subscription| null;
  private dragMove_: Subscription| null;
  private dragEnd_: Subscription| null;

  isDragging = false; //正在移动进度条滑块
  value: SilderValue = null; //滑块的位置和进度条的位置
  offset: SilderValue = null;
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cdr: ChangeDetectorRef //手动的进行变更检测
    ) { }

  ngOnDestroy(): void {
    this.unSubscribeDrag();
  }
 

  ngOnChanges(changes: SimpleChanges): void {
  //  this.show = false;
  }
  ngOnInit(): void {
    console.log('mySlider', this.wySlider.nativeElement);
    this.sliderDom = this.wySlider.nativeElement; 
    this.createDraggingObervables(); 
    this.subscribeDrag(['start']);
  }
  
  private createDraggingObervables() {
    const orientField = this.wyVertical? 'pageY': 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filterEvent: (e: MouseEvent) => e instanceof MouseEvent,
      plunkKey: [orientField],
    };
    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filterEvent: (e: TouchEvent) => e instanceof TouchEvent,
      plunkKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach(source => {
      const {start, move, end, filterEvent, plunkKey} = source;
      /**
       * 1.使用filter筛选出事件对象： pc-> mouseEvent  phone-> touchevent
       * 2.使用tap 阻止事件的冒泡和默认事件
       * 3.pluck 位置属性 Pc: pageX,pageY; phone: touch[0].pageX,touch[0].pageY
       */ 
      source.startPlucked$ = fromEvent(this.sliderDom, start).
      pipe(
        filter(filterEvent),
        tap(sliderEvent), 
        pluck(...plunkKey),
        map((position: number) => {
          return this.findClosestValue(position)
        })
        );

        // 绑定end事件
        source.end$ = fromEvent(this.doc,end); //不利于浏览器渲染的，避免使用原生的浏览器对象

        source.moveResolved$ = fromEvent(this.doc, move).pipe(
          filter(filterEvent),
          tap(sliderEvent), 
          pluck(...plunkKey),
          distinctUntilChanged(),  //当值发生改变的情况下，继续向下发射流，避免频发触发事件
          map((position: number) => {
           return this.findClosestValue(position)
          }),
          takeUntil(source.end$)   //当结束时间发出的时候，结束流
        );

    });

    //成对的事件进行merge
    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  //传入参数的默认值
  private subscribeDrag(events: string[] = ['start','move','end']) {
    if(inArray(events,'start') && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if(inArray(events,'move') && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if(inArray(events,'end') && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  
  //进行解绑
  private unSubscribeDrag(events: string[] = ['start','move','end']) {
    if(inArray(events,'start') && this.dragStart$ && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if(inArray(events,'move') && this.dragMove$ && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if(inArray(events,'end') && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private onDragStart(value: number) {
    console.log('onDragStart: ',value);
    this.toggleDragMoving(true);
  }

  private onDragMove(value: number) {
    if(this.isDragging) {
      // console.log('onDragMove', value);
      this.setValue(value, false);
      this.cdr.markForCheck();//这样手动的进行一次变更检测
    }
  }

  private onDragEnd() {
    this.toggleDragMoving(false);
    this.cdr.markForCheck();//这样手动的进行一次变更检测
  }

  private setValue(val:  SilderValue, needCheck: boolean) {
    console.log("初始值",val);
    if (needCheck){
      if(this.isDragging) return;
      this.value = this.formatValue(val);
      this.undateTrackAndHandles();
    } else if (!this.valueEqual(this.value, val)) {
      this.value = val;
      this.undateTrackAndHandles();
    }
  }

  private formatValue(value:  SilderValue): SilderValue{
    let res = value;
    if (this.assertValueValid(value)){
      res = this.wyMin;
    } else if(!this.valueEqual(this.value,value)){
      this.value = value;
      this.undateTrackAndHandles();
      this.onValueChange(this.value);
    }
    return res;
  }

  private assertValueValid(value:  SilderValue): boolean {
    return isNaN(typeof value !== 'number' ? parseFloat(value) :value)
  }

  private valueEqual(valA: SilderValue, valB: SilderValue) {
    if (typeof valA !== typeof valB) {
      return false;
    }
    return valA === valB;
  }

  private undateTrackAndHandles() {
    this.offset = this.getValueToOffest(this.value);
    // console.log('offset:', this.offest);
    this.cdr.markForCheck();
  }

  private getValueToOffest(value: SilderValue): SilderValue {
    return getPercent(value, this.wyMin, this.wyMax);
  }
  private toggleDragMoving(movable: boolean) {
    this.isDragging = movable;
    if (this.isDragging) {
      // 正在移动的时候绑定move和end事件
      this.subscribeDrag(['move','end']);
    } else {
      this.unSubscribeDrag(['move','end']);
    }
  }

  private findClosestValue(position: number): number {
    // 获取滑块总长
    const sliderLength = this.getSliderLength();

    // 滑块(左，上)端点
    const sliderStart = this.getSliderStartPosition();

    // 滑块当前位置比上总长
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, this.wyMin, this.wyMax);
    const ratioTrue = this.wyVertical ? 1 - ratio: ratio;
    return ratioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }

  private getSliderLength(): number {
    return this.wyVertical? this.sliderDom.clientHeight: this.sliderDom.clientWidth;
  }

  private getSliderStartPosition(): number {
    const offsetPosition = getElementOffset(this.sliderDom);
    return this.wyVertical? offsetPosition.top: offsetPosition.left;
  }

  writeValue(value: SilderValue): void {
    this.setValue(value, true);
  }
  registerOnChange(fn: (value: SilderValue) => void): void {
    this.onValueChange = fn;
    
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onValueChange(value: SilderValue): void{

  }
  private onTouched():void {

  }


}
