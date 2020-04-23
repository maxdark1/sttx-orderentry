import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridpartesDiscretaComponent } from './gridpartes-discreta.component';

describe('GridpartesComponent', () => {
  let component: GridpartesDiscretaComponent;
  let fixture: ComponentFixture<GridpartesDiscretaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridpartesDiscretaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridpartesDiscretaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
