import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { MapService } from './mapservice/map.service';
import { MapHttpService } from './mapservicehttp/mapservicehttp.service';
import { MapcontrollerserviceService } from './mapcontrollerservice/mapcontrollerservice.service'

import { AppComponent, DialogContent } from './app.component';
import { TestmapComponent } from './testmap/testmap.component';
import { RoomsearchComponent } from './roomsearch/roomsearch.component';
import { FloorselectorComponent } from './floorselector/floorselector.component';
import { RoomsearchmdComponent } from './roomsearchmd/roomsearchmd.component';
import { RoutetestComponent } from './routetest/routetest.component';
import { ModeselectorComponent } from './modeselector/modeselector.component';
import { EditablemapComponent } from './editablemap/editablemap.component';
import { PoiselectorComponent } from './poiselector/poiselector.component';
import { BeaconmodeselectorComponent } from './beaconmodeselector/beaconmodeselector.component';
import { BeacondialogComponent } from './beacondialog/beacondialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogContent,
    TestmapComponent,
    RoomsearchComponent,
    FloorselectorComponent,
    RoomsearchmdComponent,
    RoutetestComponent,
    ModeselectorComponent,
    EditablemapComponent,
    PoiselectorComponent,
    BeaconmodeselectorComponent,
    BeacondialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MaterialModule.forRoot()
  ],
  providers: [MapService, MapcontrollerserviceService, MapHttpService],
  entryComponents: [DialogContent, BeacondialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
