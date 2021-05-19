import { HttpClient, HttpParams } from '@angular/common/http';
import { ComponentFactoryResolver, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner, HotTag, Singer, SongSheet } from './data-types/common-types';
import { API_CONFIG, ServicesModule } from './services.module';
import { map } from 'rxjs/operators';

type SingerParams = {
  offset: number;
  limit: number;
  cat?: string;
}

const defaultParams: SingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001'
}
@Injectable({
  providedIn: ServicesModule
})
export class SingerService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    const paramsArg = 'cat='+args.cat+'&limit='+args.limit+'&offset='+args.offset;
    console.log('paramsArg',paramsArg);
    const params = new HttpParams({ fromString: paramsArg });
    console.log('params', params);
    return this.http.get(this.uri + 'artist/list', { params })
    .pipe(map((res: { artists: Singer[] }) => res.artists));
  }
}
