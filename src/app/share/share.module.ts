import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';

/**
 * ShareModule是提供一些公共的组件的导入和导出，方便其他特性模块引入
 */


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
  ]
})
export class ShareModule { }
