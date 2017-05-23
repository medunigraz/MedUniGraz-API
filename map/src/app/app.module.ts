import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { routes } from './app.routes';

import { MapService } from './mapservice/map.service';

import { AppComponent } from './app.component';
import { OlmapComponent } from './olmap/olmap.component';
import { SearchcontrolComponent } from './searchcontrol/searchcontrol.component';
import { FloorcontrolComponent } from './floorcontrol/floorcontrol.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';
import { RouteCompComponent } from './route-comp/route-comp.component';


@NgModule({
  declarations: [
    AppComponent,
    OlmapComponent,
    SearchcontrolComponent,
    FloorcontrolComponent,
    SidemenuComponent,
    RoomDialogComponent,
    RouteCompComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MaterialModule.forRoot()
  ],
  providers: [MapService],
  bootstrap: [AppComponent],
  entryComponents: [RoomDialogComponent]
})
export class AppModule { }
