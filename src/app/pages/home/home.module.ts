import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { ShareModule } from 'src/app/share/share.module';
import { HomeComponent } from './home.component';
import { WyCarouselComponent } from './components/ng-carousel/wy-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';
import { HomeResolverService } from './home-resolve.service';


@NgModule({
  declarations: [HomeComponent, WyCarouselComponent, MemberCardComponent],
  imports: [
    ShareModule,
    HomeRoutingModule
  ],
  
})
export class HomeModule { }
