import { Routes } from '@angular/router';
import { BookingsComponent } from './components/bookings/bookings.component';
import { MapComponent } from './components/map-component/map-component.component';

export const routes: Routes = [
    { path: '', redirectTo: '/map', pathMatch: 'full' },
    { path: 'map', component: MapComponent },
    { path: 'booking', component: BookingsComponent },
];
