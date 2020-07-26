import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNameDialogComponent } from './user-name-dialog.component';

describe('UserNameDialogComponent', () => {
  let component: UserNameDialogComponent;
  let fixture: ComponentFixture<UserNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
