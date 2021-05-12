import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet } from './data-types/common-types';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {
// https://angular.cn/api/core/Inject 在构造函数中依赖项参数上的参数装饰器，用于指定依赖项的自定义提供者
  constructor(private http: HttpClient,@Inject(API_CONFIG) private uri: string) { }

  getBanners(): Observable<Banner[]>  {
    return this.http.get(this.uri+ 'banner').pipe(
      map((res: {banners: Banner[]}) => res.banners))
  }
  getHotTags(): Observable<HotTag[]> {
    return this.http.get(this.uri+ 'playlist/hot').pipe (
      map((res: {tags: HotTag[]}) => {
        return res.tags.sort((x:HotTag, y: HotTag) => { return x.position - y.position;}).slice(0,5);
      })
    )
  }

  getPersonalSheetList(): Observable<SongSheet[]>{
    return this.http.get(this.uri+ 'personalized').pipe (
      map((res: {result: SongSheet[]}) => res.result.slice(0,16))
    )
  }
}
