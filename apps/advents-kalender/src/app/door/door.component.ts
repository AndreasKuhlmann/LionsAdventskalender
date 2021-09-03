import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.scss'],
})
export class DoorComponent implements OnChanges, AfterViewInit {
  @Input() baseX = 0;
  @Input() baseY = 0;
  @Input() baseWidth = 0;
  @Input() baseHeight = 0;
  @Input() no = 0;
  @Input() isOpen = false;
  @Input() cannotOpen = true;
  @Input() text: string | undefined;
  backgroundPosition = '';
  @ViewChild('door', { read: ElementRef }) door: ElementRef | undefined;

  keepClose = false;

  ngAfterViewInit(): void {
    setTimeout(() => this.setBackgroundPosition());
  }

  ngOnChanges(): void {
    this.setBackgroundPosition();
  }
  toggle(): void {
    if (!this.isOpen) {
      this.keepClose = true;
      setTimeout(() => (this.keepClose = false), 1000);
    }
  }

  private setBackgroundPosition() {
    if (this.door) {
      const posX = this.door.nativeElement.getBoundingClientRect().x;
      const posY = this.door.nativeElement.getBoundingClientRect().y;
      const backgroundPostionX =
        Math.floor(this.baseX - posX).toString() + 'px';
      const backgroundPostionY =
        Math.floor(this.baseY - posY).toString() + 'px';
      this.backgroundPosition = `${backgroundPostionX} ${backgroundPostionY}`;
      console.log(this.backgroundPosition);
    }
  }
}
