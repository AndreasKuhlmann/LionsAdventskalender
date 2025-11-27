import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-zweck-dialog',
    templateUrl: './wer-steht-dahinter-dialog.component.html',
    styleUrls: ['./wer-steht-dahinter-dialog.component.scss'],
    standalone: false
})
export class WerStehtDahinterDialogComponent implements OnInit {

  avatars = [
    'svg-1', 'svg-2', 'svg-3', 'svg-4'
  ];

  user!: User;
  constructor(
    private dialogRef: MatDialogRef<WerStehtDahinterDialogComponent>,
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
