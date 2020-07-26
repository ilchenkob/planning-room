import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingResultsComponent } from './voting-results.component';

describe('VotingResultsComponent', () => {
  let component: VotingResultsComponent;
  let fixture: ComponentFixture<VotingResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
