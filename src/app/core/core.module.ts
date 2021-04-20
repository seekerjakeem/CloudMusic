import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { ServiceModule } from '../service/service.module';
import { PagesModule } from '../pages/pages.module';
import { ShareModule } from '../share/share.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
/**
 * CoreModule中的import是一次性引入的，充当一个跟模块
 *
 */


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceModule,
    PagesModule,
    ShareModule, //要放在最后面，否则路由的时候存在问题
    AppRoutingModule,
  ],
  exports: [
    ShareModule,
    AppRoutingModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
})
export class CoreModule { 
  constructor(@SkipSelf() @Optional() parentModule: CoreModule){
    if (parentModule) {
      throw new Error('CoreModule只能被AppModule引入');
    }
  }
}
