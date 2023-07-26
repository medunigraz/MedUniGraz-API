import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

//import { MaterialModule } from '@angular/material';

import { MapService } from './mapservice/map.service';
import { MapHttpService } from './mapservicehttp/mapservicehttp.service';
import { MapcontrollerserviceService } from './mapcontrollerservice/mapcontrollerservice.service'

import { AppComponent, DialogContent } from './app.component';
import { FloorselectorComponent } from './floorselector/floorselector.component';
import { ModeselectorComponent } from './modeselector/modeselector.component';
import { EditablemapComponent } from './editablemap/editablemap.component';
import { PoiselectorComponent } from './poiselector/poiselector.component';
import { BeaconmodeselectorComponent } from './beaconmodeselector/beaconmodeselector.component';
import { BeacondialogComponent } from './beacondialog/beacondialog.component';
import { BeaconconnectorComponent } from './beaconconnector/beaconconnector.component';

import { OAuthModule } from 'angular-oauth2-oidc';

//import { MatButtonModule, MatCheckboxModule, MatButtonToggleModule, /*MatCoreModule,*/ MatDialogModule, MatIconModule, MatInputModule, MatSelectModule, MatSidenavModule, MatMenuModule } from '@angular/material';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import { BeaconinfoComponent } from './beaconinfo/beaconinfo.component';
import { WeightselectComponent } from './weightselect/weightselect.component';


@NgModule({
    declarations: [
        AppComponent,
        DialogContent,
        FloorselectorComponent,
        ModeselectorComponent,
        EditablemapComponent,
        PoiselectorComponent,
        BeaconmodeselectorComponent,
        BeacondialogComponent,
        BeaconconnectorComponent,
        BeaconinfoComponent,
        WeightselectComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        //HttpModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        //MaterialModule.forRoot(),
        OAuthModule.forRoot(),
        MatButtonModule, MatCheckboxModule, MatButtonToggleModule, /*MatCoreModule,*/ MatDialogModule, MatIconModule, MatInputModule, MatSelectModule, MatSidenavModule, MatMenuModule
    ],
    providers: [MapService, MapcontrollerserviceService, MapHttpService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
