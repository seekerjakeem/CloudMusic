import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { wySliderType } from './wy-slider-type';

@Component({
  selector: 'app-wy-slider-track',
  template: `<div class= "wy-slider-track" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;
  @Input() myLength: number;
  style: wySliderType;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['myLength']) {
      this.style.height = this.myLength + '%';
      this.style.left = null;
      this.style.width = null;
    } else {
      this.style.width = this.myLength + '%';
      this.style.left = null;
      this.style.width = null;
    }
  }

  ngOnInit(): void {
  }

}
