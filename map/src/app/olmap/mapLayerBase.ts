import { Observable } from 'rxjs';
import { Subscription } from "rxjs";

import { Logger } from '../base/logger';

declare var ol: any;

export class MapLayerBase {
  protected layer: any;
  protected layerSource: any;

  protected subscription: Subscription = null;

  public getLayer(): any {
    //Logger.log("MapLayerBase::getLayer() " + JSON.stringify(this.layer));
    return this.layer;
  }

  public clear() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    this.layerSource.clear();
  }

  public subscribeNewRequest(sub: Subscription) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.subscription = sub;
  }
}
