import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../../model/places.model';
import { PlaceService } from '../../services/places/place.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit, OnDestroy {

  selectedPlace: Place | null = null;
  booking = {
    name: '',
    email: ''
  };

  constructor(
    private readonly placeService: PlaceService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.placeService.selectedPlace$.subscribe((place) => {
      this.selectedPlace = place;
      if (!place) {
        // redirect back if no place is selected
        this.router.navigate(['/map']);
      }
    });
  }

  //on confirm booking button click
  onConfirmBooking(bookingForm: any) {
    if (bookingForm.valid) {
      this.placeService.clearSelectedPlace(); // Clear the selected place in the service
      this.router.navigate(['/map']);
    }
  }

  // to avoid memory leaks and ensure that the selected place is cleared when the component is destroyed
  ngOnDestroy() {
    this.placeService.clearSelectedPlace();
  }

}
