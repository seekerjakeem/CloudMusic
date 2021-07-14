import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { WySliderType } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider-track',
  template: `<div class="wy-slider-track" [class.buffer]="wyBuffer" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;
  @Input() wyLength: number;
  style: WySliderType = {};
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['wyLength']) {
      console.log('wyLength', this.wyLength);
      if (this.wyVertical) {
        this.style.height = this.wyLength + '%';
        this.style.left = null;
        this.style.width = null;
      }else {
        this.style.width = this.wyLength + '%';
        this.style.left = null;
        this.style.height = null;
      } 
    }
  }

  ngOnInit(): void {
  }

}
