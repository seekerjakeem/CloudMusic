import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // 只是在input属性变化时才进行变更检测
})
export class WyCarouselComponent implements OnInit {
  // static是在变更检测前、变更检测后解析，如果是动态的，比如有ngIf，就让模版在变更检测之后进行解析，static属性设置成false
  @Input() activeIndex = 0;
  // 更加严谨，只能是pre或者next
  @Output() changeSlide = new EventEmitter<'pre'|'next'>();
  @ViewChild('dot', {static: true})  dotRef: TemplateRef<any>;
  constructor() { }  

  ngOnInit(): void {
  }

  //点击箭头触发事件
  onChangeSide(type: 'pre'|'next') {
    this.changeSlide.emit(type);
  }
}
