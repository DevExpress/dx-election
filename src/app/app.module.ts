import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { YearSwitcherComponent } from './year-switcher/year-switcher.component';
import { BasicResultsComponent } from './basic-results/basic-results.component';
import { MapComponent } from './map/map.component';
import { DetailedChartComponent } from './detailed-chart/detailed-chart.component';
import { FooterComponent } from './footer/footer.component';

import { DxButtonModule } from 'devextreme-angular2/ui/button';
import { DxChartModule } from 'devextreme-angular2/ui/chart';
import { DxScrollViewModule } from 'devextreme-angular2/ui/scroll-view';
import { DxVectorMapModule } from 'devextreme-angular2/ui/vector-map';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
      BrowserModule,
      DxVectorMapModule,
      DxChartModule,
      DxButtonModule,
      DxScrollViewModule,
      HttpModule
  ],
  declarations: [
    AppComponent,
    YearSwitcherComponent,
    BasicResultsComponent,
    MapComponent,
    DetailedChartComponent,
    FooterComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
