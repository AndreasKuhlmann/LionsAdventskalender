import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lions-adventskalender-door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.scss'],
})
export class DoorComponent implements OnInit {
  @Input() flipped: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
