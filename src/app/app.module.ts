import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {} from 'ng-zorro-antd';
import { CoreModule } from './core/core.module';

registerLocaleData(zh);
/**
 * 将appModule中的内容转移到CoreModule中，这样AppModule只负责管理CoreModule
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
