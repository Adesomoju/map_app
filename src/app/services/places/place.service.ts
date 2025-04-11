import { Injectable } from '@angular/core';
import { BehaviorSubject  } from 'rxjs';
import { Place } from '../../model/places.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  private readonly selectedPlaceSubject = new BehaviorSubject<Place | null>(null);
  selectedPlace$ = this.selectedPlaceSubject.asObservable();

  constructor() { }

  setSelectedPlace(place: Place) {
    this.selectedPlaceSubject.next(place);
  }

  clearSelectedPlace() {
    this.selectedPlaceSubject.next(null);
  }

}
