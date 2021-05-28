import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Song, SongSheet, SongUrl } from "./data-types/common-types";
import { API_CONFIG, ServicesModule } from "./services.module";

@Injectable({
  providedIn: ServicesModule
})
export class SongService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id',ids);
    console.log('params', params);
    return this.http.get(this.uri + 'song/url', { params })
    .pipe(map((res : {data: SongUrl[]}) => res.data));
  };

  getSongList(song: Song | Song[]):Observable<Song[]>{
      const songArr = Array.isArray(song)? song.slice(): [song];
      const ids = songArr.map(item => item.id).join(',');
      return Observable.create(observer => {
        this.getSongUrl(ids).subscribe(urls => {
          observer.next(this.generateSongList(songArr, urls));
        })
      });
  };

    generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
      const result = [];
      songs.forEach(song => {
        const url = urls.find(url => url.id === song.id);
        if(url) {
          result.push({...song,url});
        }
      });
      console.log('result: ',result);
      return result;
    }
}
 

/**
 * 思路：
 * homeComponent上调用=> onPlaySheet() => 获取歌单的详情 getSongSheetDetail => 在歌曲中获取他的URL,将歌单数据和详情做一个拼接
 */