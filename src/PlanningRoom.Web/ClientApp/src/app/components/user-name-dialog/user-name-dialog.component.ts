import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-name-dialog',
  templateUrl: './user-name-dialog.component.html',
  styleUrls: ['./user-name-dialog.component.scss']
})
export class UserNameDialogComponent {
  public name = '';

  constructor(
      private dialogRef: MatDialogRef<UserNameDialogComponent, string>,
      @Inject(MAT_DIALOG_DATA) data: string) {
    this.name = data;
  }

  setName() {
    this.dialogRef.close(this.name);
  }

  cancel() {
    this.dialogRef.close();
  }
}
