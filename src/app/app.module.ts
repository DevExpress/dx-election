import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { YearSwitcherComponent } from './year-switcher/year-switcher.component';
import { BasicResultsComponent } from './basic-results/basic-results.component';
import { MapComponent } from './map/map.component';
import { DetailedChartComponent } from './detailed-chart/detailed-chart.component';
import { FooterComponent } from './footer/footer.component';

import { DxButtonModule,
         DxChartModule,
         DxScrollViewModule,
         DxVectorMapModule } from 'devextreme-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
      BrowserModule,
      DxVectorMapModule,
      DxChartModule,
      DxButtonModule,
      DxScrollViewModule,
      HttpClientModule
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
