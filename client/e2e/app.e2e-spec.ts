import { Cloud7ShishaPage } from './app.po';

describe('cloud7-shisha App', () => {
  let page: Cloud7ShishaPage;

  beforeEach(() => {
    page = new Cloud7ShishaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
