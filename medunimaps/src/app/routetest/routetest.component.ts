import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../mapservice/map.service';
import { TestmapComponent} from '../testmap/testmap.component';

@Component({
  selector: 'app-routetest',
  templateUrl: './routetest.component.html',
  styleUrls: ['./routetest.component.css']
})
export class RoutetestComponent implements OnInit {

  @Input()
  mapComponentRef: TestmapComponent;

  routeVisible: boolean = false;

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  toogleroute(): void {
    console.log('Toogle Route');

    if(this.routeVisible)
    {
      this.mapComponentRef.hideRoute();
      this.routeVisible = false;
    }
    else
    {
      this.mapService.getRoute().then(route => this.showRoute(route));
    }
  }

  showRoute(route: Object[]): void
  {
    this.mapComponentRef.showRoute(route);
    this.routeVisible = true;
  }
}
