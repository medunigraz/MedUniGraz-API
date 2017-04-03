import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

declare var ol: any;

@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.css']
})
export class OlmapComponent implements OnInit {

  @ViewChild('mapDiv') public mapDiv: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  private map: any;

  ngAfterViewInit(): void {

    this.map = new ol.Map({
      controls: ol.control.defaults({
        attributionOptions: ({
          collapsible: true,
        }),
        zoom: false
      }),
      //interactions: ol.interaction.defaults().extend([this.select, this.modify]),
      //controls: [],
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      overlays: [],
      target: 'map',
      view: new ol.View({
        projection: 'EPSG:900913',
        center: ol.proj.fromLonLat([15.47, 47.0805]),
        //center: ol.extent.getCenter(extent),
        zoom: 18,
        maxZoom: 24,
        minZoom: 16
      })
    });

  }

  setFocus(): void {
    this.mapDiv.nativeElement.focus();
  }

  showRoom(id: number) {
    console.log("OlmapComponent::showRoom: " + id);
  }

  showRoute(from: number, to: number) {
    console.log("OlmapComponent::showRoute: " + from + " --> " + to);
  }

}
