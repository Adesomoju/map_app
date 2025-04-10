import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Place } from '../../model/places.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(
    private readonly http: HttpClient
  ) { }

  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>('assets/data/places.json');
  }
}
