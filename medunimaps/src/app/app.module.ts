import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { MapService } from './mapservice/map.service';
import { MapcontrollerserviceService } from './mapcontrollerservice/mapcontrollerservice.service'

import { AppComponent, DialogContent } from './app.component';
import { TestmapComponent } from './testmap/testmap.component';
import { RoomsearchComponent } from './roomsearch/roomsearch.component';
import { FloorselectorComponent } from './floorselector/floorselector.component';
import { RoomsearchmdComponent } from './roomsearchmd/roomsearchmd.component';
import { RoutetestComponent } from './routetest/routetest.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogContent,
    TestmapComponent,
    RoomsearchComponent,
    FloorselectorComponent,
    RoomsearchmdComponent,
    RoutetestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MaterialModule.forRoot()
  ],
  providers: [MapService, MapcontrollerserviceService],
  entryComponents: [DialogContent],
  bootstrap: [AppComponent]
})
export class AppModule { }
