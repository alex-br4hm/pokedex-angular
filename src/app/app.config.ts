import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {FIREBASE_OPTIONS} from '@angular/fire/compat';
import {environment} from '../environments/environment';
import {provideFirebaseApp} from '@angular/fire/app';
import {provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp } from "@angular/fire/app"

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideNoopAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
    { provide: FIREBASE_OPTIONS, useValue: environment },
      provideFirebaseApp(() => initializeApp(environment)),
      provideFirestore(() => getFirestore())

  ]
};
