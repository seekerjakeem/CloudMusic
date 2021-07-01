import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { wySliderType } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider-handle',
  template: `<div class= "wy-slider-handle" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderHandleComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;
  @Input() wyOffset: number;
  style: wySliderType;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['wyOffset']) {
      this.style[this.wyVertical ? 'bottom': 'left'] = this.wyOffset + '%';
    }
  }

  ngOnInit(): void {
  }

}
