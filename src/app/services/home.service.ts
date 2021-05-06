import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner } from './data-types/common-types';
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
}
