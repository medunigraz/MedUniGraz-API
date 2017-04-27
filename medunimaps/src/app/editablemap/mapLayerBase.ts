declare var ol: any;

export class MapLayerBase {
  protected layer: any;
  protected layerSource: any;

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
}
