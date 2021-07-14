import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySliderComponent } from './wy-slider.component';
import { WySliderTrackComponent } from './wy-slider-track.component';
import { WySliderHandleComponent } from './wy-slider-handle.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    WySliderComponent,
    WySliderTrackComponent,
    WySliderHandleComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    WySliderComponent,
  ]
})
export class WySliderModule { }
