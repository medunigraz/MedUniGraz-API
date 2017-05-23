import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../mapservice/map.service';
import { MainappService } from '../mainappservice/mainapp.service';

import {Room } from '../base/room';

@Component({
  selector: 'app-route-comp',
  templateUrl: './route-comp.component.html',
  styleUrls: ['./route-comp.component.css']
})
export class RouteCompComponent implements OnInit {

  sub: any;

  constructor(private route: ActivatedRoute,
    private mapService: MapService,
    private mainAppService: MainappService) { }

  ngOnInit() {
    console.log("RouteCompComponent::ngOnInit init!");
  }

  ngAfterViewInit(): void {
    let paramRoomId = this.route.snapshot.queryParams["roomId"];
    if (paramRoomId) {
      console.log("RouteCompComponent::ngOnInit init - " + paramRoomId);

      this.mapService.getRoomByID(paramRoomId).subscribe(
        rooms => this.roomRecieved(rooms),
        error => console.log("ERROR getRoomByID: " + <any>error));

    }
  }

  roomRecieved(roomFeatures: any) {
    console.log("RouteCompComponent::roomsRecieved - " + JSON.stringify(roomFeatures));
    if (roomFeatures.features) {
      if (roomFeatures.features.length > 0) {
        let roomFeature = roomFeatures.features[0];
        console.log("RouteCompComponent::roomRecieved - " + JSON.stringify(roomFeature));
        let room = Room.createFromRestObj(roomFeature);
        this.mainAppService.emitChange(room);
      }
    }
  }

}
