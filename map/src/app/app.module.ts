import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { MapService } from './mapservice/map.service';

import { AppComponent } from './app.component';
import { OlmapComponent } from './olmap/olmap.component';
import { SearchcontrolComponent } from './searchcontrol/searchcontrol.component';
import { FloorcontrolComponent } from './floorcontrol/floorcontrol.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    OlmapComponent,
    SearchcontrolComponent,
    FloorcontrolComponent,
    SidemenuComponent,
    RoomDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MaterialModule.forRoot()
  ],
  providers: [MapService],
  bootstrap: [AppComponent],
  entryComponents: [RoomDialogComponent]
})
export class AppModule { }
