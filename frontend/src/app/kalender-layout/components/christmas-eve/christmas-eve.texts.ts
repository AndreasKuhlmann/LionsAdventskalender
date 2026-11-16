/**
 * Texte für das Heiligabend-Special (Tür 24).
 * Hier anpassen - z.B. jedes Jahr die Spendensumme eintragen.
 */
export const CHRISTMAS_EVE_TEXTS = {
  title: 'Frohe Weihnachten!',
  text:
    'Von Herzen Danke! Mit dem Kauf Ihres Adventskalenders haben Sie Kinder, Jugendliche ' +
    'und Menschen in Not in unserer Region unterstützt. Wir wünschen Ihnen und Ihren Lieben ' +
    'ein gesegnetes Weihnachtsfest und ein gesundes, glückliches neues Jahr!',
  signature: 'Ihre Oldenburger Lions Clubs',
  /**
   * Spendensumme, z.B. '35.000 €'. null = Satz wird nicht angezeigt.
   * Erscheint als: "Gemeinsam sind in diesem Jahr 35.000 € für den guten Zweck zusammengekommen."
   */
  spendensumme: null as string | null,
};

/** Hinweis nach Weihnachten (ab 25.12. bis Ende Januar) statt des Tipps zur Kalendernummer. */
export const AFTER_CHRISTMAS_MESSAGE = 'Frohe Weihnachten – wir sehen uns im nächsten Advent! 🎄';

/** Die Tür mit dem Heiligabend-Special */
export const CHRISTMAS_EVE_DOOR = 24;
