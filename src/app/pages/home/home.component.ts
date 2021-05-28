import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/data-types/common-types';
import { HomeService } from 'src/app/services/home.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SingerService } from 'src/app/services/singer.service';
import { HomeResolverService } from './home-resolve.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';

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
  signers: Singer[];

  constructor(
    private homeServe: HomeService, 
    private singerServie: SingerService, 
    private route: ActivatedRoute,
    private sheetService: SheetService
    ) {
    // this.getBanners(); 
    // this.getHotTags();  
    // this.getSongSheet();  
    // this.getEnterSinger();     
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners,hotTags,songSheet,Singer]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheet = songSheet;
      this.signers = Singer;
    })
  }

  ngOnInit() {
  }
  //EventEmitter<{ from: number; to: number }> 切换面板的回调
  onBeforeChange({to}) {
    this.carouselActiveIndex = to;
  }

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(sheet => {
      console.log('sheet',sheet)
    });
  }


  // /*获取轮播图 */
  // private getBanners() {
  //   this.homeServe.getBanners().subscribe(banners => {
  //     this.banners = banners;
  //   }); 
  // }

  // private getHotTags() {
  //   this.homeServe.getHotTags().subscribe(tags => {
  //     this.hotTags = tags;
  //   });
  // }

  // // 获取歌单
  // private getSongSheet(){
  //   this.homeServe.getPersonalSheetList().subscribe(sheetList => {
  //     this.songSheet = sheetList;
  //   });
  // }
  
  // //获取入驻歌手
  // private getEnterSinger() {
  //   this.singerServie.getEnterSinger().subscribe(enterSinger => {
  //     this.signers = enterSinger; 
  //     console.log('入驻歌手',this.signers);
  //   });
  // }
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