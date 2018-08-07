import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { DeviceDetectorModule  } from 'ngx-device-detector';

//import { MaterialModule } from '@angular/material'; TODO

//import { routes } from './app.routes';

import { MapService } from './mapservice/map.service';
import { MainappService } from './mainappservice/mainapp.service';

import { AppComponent } from './app.component';
import { OlmapComponent } from './olmap/olmap.component';
import { SearchcontrolComponent } from './searchcontrol/searchcontrol.component';
import { FloorcontrolComponent } from './floorcontrol/floorcontrol.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';
import { PositionComponent } from './position/position.component';

import { MatButtonModule, MatCheckboxModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatInputModule, MatSelectModule, MatMenuModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    OlmapComponent,
    SearchcontrolComponent,
    FloorcontrolComponent,
    SidemenuComponent,
    RoomDialogComponent,
    PositionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    //RouterModule.forRoot(routes),
    //MaterialModule.forRoot()
    MatButtonModule, MatCheckboxModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatInputModule, MatSelectModule, MatMenuModule

  ],
  providers: [MapService, MainappService],
  bootstrap: [AppComponent],
  entryComponents: [RoomDialogComponent]
})
export class AppModule { }
