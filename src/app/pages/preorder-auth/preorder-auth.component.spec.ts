import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreorderAuthComponent } from './preorder-auth.component';

describe('PreorderAuthComponent', () => {
  let component: PreorderAuthComponent;
  let fixture: ComponentFixture<PreorderAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreorderAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreorderAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
