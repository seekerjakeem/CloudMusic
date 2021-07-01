import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap } from 'rxjs/operators';
import { inArray } from 'src/app/utils/array';
import { limitNumberInRange } from 'src/app/utils/number';
import { getElementOffset, sliderEvent } from './wy-slider-helper';
import { SliderEventObserverConfig } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class WySliderComponent implements OnInit, OnChanges {
  show = true;
  private sliderDom: HTMLDivElement;
  @Input() wyVertical = false ;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @ViewChild('wySlider',{static: true}) private wySlider: ElementRef;
  
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc: Document) { }


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
    if(inArray(events,'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if(inArray(events,'move') && this.dragStart$) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if(inArray(events,'end') && this.dragStart$) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private onDragStart(value: number) {
    console.log(value);
  }

  private onDragMove(value: number) {}

  private onDragEnd() {

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
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical? offset.top: offset.left;
  }


}
