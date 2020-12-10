import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDetilComponent } from './artist-detil.component';

describe('ArtistDetilComponent', () => {
  let component: ArtistDetilComponent;
  let fixture: ComponentFixture<ArtistDetilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistDetilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistDetilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
