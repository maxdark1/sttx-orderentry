import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridpartesComponent } from './gridpartes.component';

describe('GridpartesComponent', () => {
  let component: GridpartesComponent;
  let fixture: ComponentFixture<GridpartesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridpartesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridpartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
