import { MedunimapsPage } from './app.po';

describe('medunimaps App', function() {
  let page: MedunimapsPage;

  beforeEach(() => {
    page = new MedunimapsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
