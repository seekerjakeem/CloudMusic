import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { Banner, HotTag, SongSheet } from 'src/app/services/data-types/common-types';
import { HomeService } from 'src/app/services/home.service';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
   @ViewChild(NzCarouselComponent,{static: true}) private nzCarousel: NzCarouselComponent; 
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheet: SongSheet[];

  constructor(private homeServe: HomeService) {
    this.getBanners(); 
    this.getHotTags();  
    this.getSongSheet();                         
  }

  ngOnInit() {
  }
  //EventEmitter<{ from: number; to: number }> 切换面板的回调
  onBeforeChange({to}) {
    this.carouselActiveIndex = to;
  }

  /*获取轮播图 */
  private getBanners() {
    this.homeServe.getBanners().subscribe(banners => {
      this.banners = banners;
    }); 
  }

  private getHotTags() {
    this.homeServe.getHotTags().subscribe(tags => {
      this.hotTags = tags;
    });
  }

  private getSongSheet(){
    this.homeServe.getPersonalSheetList().subscribe(sheetList => {
      this.songSheet = sheetList;
    });
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