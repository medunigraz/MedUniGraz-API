import { MapPage } from './app.po';

describe('map App', function() {
  let page: MapPage;

  beforeEach(() => {
    page = new MapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
