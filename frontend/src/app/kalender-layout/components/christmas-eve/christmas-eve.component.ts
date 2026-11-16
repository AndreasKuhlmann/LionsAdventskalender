import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ChristmasEveService } from '../../services/christmas-eve.service';
import { CHRISTMAS_EVE_TEXTS } from './christmas-eve.texts';

/**
 * Weihnachtsszene an Heiligabend: abgedunkelter Nachthimmel, funkelnder Stern und Weihnachtsgruß.
 * Liegt unter dem Schnee (der dadurch besonders gut zu sehen ist).
 */
@Component({
  selector: 'app-christmas-eve',
  templateUrl: './christmas-eve.component.html',
  styleUrls: ['./christmas-eve.component.scss'],
  imports: [MatButton],
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class ChristmasEveComponent {
  private readonly christmasEve = inject(ChristmasEveService);
  readonly texts = CHRISTMAS_EVE_TEXTS;

  close(): void {
    this.christmasEve.end();
  }
}
