import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { forkJoin, Observable } from "rxjs";
import { take } from "rxjs/operators";
import { Banner, HotTag, Singer, SongSheet } from "src/app/services/data-types/common-types";
import { HomeService } from "src/app/services/home.service";
import { SingerService } from "src/app/services/singer.service";

type HomeDataType = [Banner[],HotTag[],SongSheet[],Singer[]];
@Injectable({ providedIn: 'root' })
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(private homeServe: HomeService, private singerServie: SingerService) {}

  resolve(
  ): Observable<HomeDataType> {
    return forkJoin([
        this.homeServe.getBanners(),
        this.homeServe.getHotTags(),
        this.homeServe.getPersonalSheetList(),
        this.singerServie.getEnterSinger()
    ]
    ).pipe(take(1));
  }
}