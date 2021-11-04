import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-zweck-dialog',
  templateUrl: './zweck-dialog.component.html',
  styleUrls: ['./zweck-dialog.component.scss']
})
export class ZweckDialogComponent implements OnInit {

  avatars = [
    'svg-1', 'svg-2', 'svg-3', 'svg-4'
  ];

  user!: User;
  constructor(
    private dialogRef: MatDialogRef<ZweckDialogComponent>,
    private userService: UserService) { }

  name = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.name.hasError('required') ? 'You must enter a name' : '';
  }

  ngOnInit(): void {
    this.user = new User();
  }

  save() {
    this.user.name = this.name.value;

    this.userService.addUser(this.user).then(user => {
      this.dialogRef.close(user);
    });

  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
