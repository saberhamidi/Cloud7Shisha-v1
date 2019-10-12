import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShishaOrderComponent } from './shisha-order.component';

describe('ShishaOrderComponent', () => {
  let component: ShishaOrderComponent;
  let fixture: ComponentFixture<ShishaOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShishaOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShishaOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
