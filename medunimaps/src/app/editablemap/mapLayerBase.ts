import { Observable } from 'rxjs';
import {Subscription} from "rxjs";

declare var ol: any;

export class MapLayerBase {
  protected layer: any;
  protected layerSource: any;

  protected subscription: Subscription = null;

  public getLayer(): any {
    return this.layer;
  }

  public setActive(active: boolean) {
    this.layer.setVisible(active);

    if (!active) {
      this.clearSelection();
    }
  }

  public clear() {
    this.clearSelection();
    this.layerSource.clear();
  }

  public clearSelection() {
    //overwrite in subclass...
  }

  public subscribeNewRequest(sub: Subscription) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.subscription = sub;
  }
}
