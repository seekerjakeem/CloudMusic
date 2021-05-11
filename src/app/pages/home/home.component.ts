import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { Banner } from 'src/app/services/data-types/common-types';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
   @ViewChild(NzCarouselComponent,{static: true}) private nzCarousel: NzCarouselComponent; 
  carouselActiveIndex = 0;
  banners: Banner[];
  constructor(private homeServe: HomeService) {
    this.homeServe.getBanners().subscribe(banners => {
      this.banners = banners;
    });                                  
  }

  ngOnInit() {
  }
  //EventEmitter<{ from: number; to: number }> 切换面板的回调
  onBeforeChange({to}) {
    this.carouselActiveIndex = to;
  }
  /**
   * 箭头触发切换事件
   */
  onChangeSide(type: 'pre'|'next') {
    // console.log(type);
    // if(type === 'pre') {
    //   this.nzCarousel.pre();
    // }
    // if(type === 'next') {
    //   this.nzCarousel.next();
    // }
    this.nzCarousel[type]();
  }
}