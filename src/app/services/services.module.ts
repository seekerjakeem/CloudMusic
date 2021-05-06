import { Injectable, InjectionToken, NgModule } from '@angular/core';

export const API_CONFIG = new InjectionToken("ApiConfigToken");

@NgModule({
  declarations: [],
  imports: [
    
  ],
  providers: [
    // 令牌
    {provide: API_CONFIG, useValue: 'http://localhost:3000/'},]
})
export class ServicesModule { }
