import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraHeadComponent } from './extra-head.component';

describe('ExtraHeadComponent', () => {
  let component: ExtraHeadComponent;
  let fixture: ComponentFixture<ExtraHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
