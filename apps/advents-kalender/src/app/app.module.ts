import { AdventDaysService } from './services/advent-days.service';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { AppComponent } from './app.component';
import { DoorComponent } from './door/door.component';

export function initializeApp(storage: Storage) {
  return () => {
    storage.defineDriver(CordovaSQLiteDriver);
    return storage.create();
  };
}
@NgModule({
  declarations: [AppComponent, DoorComponent],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot({
      driverOrder: [CordovaSQLiteDriver._driver],
    }),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    AdventDaysService,
    {
      provide: APP_INITIALIZER,
      deps: [Storage],
      useFactory: initializeApp,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [DoorComponent],
})
export class AppModule {}
