import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-installable-prompt',
    templateUrl: './installable-prompt.component.html',
    styleUrls: ['./installable-prompt.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class InstallablePromptComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
