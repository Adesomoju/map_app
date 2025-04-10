import { Component, OnInit, ViewChild } from '@angular/core';
import { Place } from '../../model/places.model';
import { PlaceService } from '../../services/places/place.service';
import { GoogleMapsModule, GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare const google: any;

@Component({
  selector: 'app-map-component',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './map-component.component.html',
  styleUrl: './map-component.component.scss'
})
export class MapComponent implements OnInit {

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  center = { lat: 53.3498, lng: -6.2603 }; // Dublin as example
  zoom = 12;

  places: Place[] = [];
  filteredPlaces: Place[] = [];
  selectedType: string = 'all';
  selectedRating: string = 'all';
  searchTerm: string = '';
  selectedPlace?: Place;

  startPoint?: Place;
  endPoint?: Place;
  distanceText: string = '';
  directionsRenderer: any;

  constructor(
    private readonly place: PlaceService
  ) { }


  ngOnInit() {
    this.place.getPlaces().subscribe(data => {
      this.places = data;
      this.filterPlaces();
    });
  }

  filterPlaces() {
  
    this.filteredPlaces = this.places.filter(p => {
      const matchesType = this.selectedType === 'all' || p.type === this.selectedType;
      const matchesSearch = this.searchTerm.trim() === '' || p.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
      const matchesRating = this.selectedRating === 'all' || (
        parseFloat(p.ratings as any) >= parseFloat(this.selectedRating) &&
        parseFloat(p.ratings as any) < (parseFloat(this.selectedRating) + 1)
      );
      return matchesType && matchesSearch && matchesRating;
    });
  
  }

  openInfoWindow(marker: MapMarker, place: Place) {
    this.selectedPlace = place;
    this.infoWindow.open(marker);
  }

  selectForRouting(place: Place) {
    this.startPoint = place;
  }

  getStarIcons(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
  
    const stars: string[] = [];
  
    for (let i = 0; i < fullStars; i++) {
      stars.push('/assets/images/icons/atFullstar.png');
    }
  
    if (halfStar) {
      stars.push('/assets/images/icons/atHalfstar.png');
    }
  
    return stars;
  }

  onTypeChange(event: any, type: any) {
    console.log('Selected type:', type);
    console.log('Selected type:', event.target.value);
    if (type === 'rating') {
      this.selectedRating = event.target.value;
      console.log('Selected rating:', this.selectedRating);
      this.filterPlaces();
    }
    if (type === 'type') {
      this.selectedType = event.target.value;
      this.filterPlaces();
    }
  }

  navigateToDetail(place: Place) {
    console.log('Navigating to:', place);
  }

  openBookingForm(place: Place) {
    alert(`Booking form for ${place.name}`);
  }

  drawRouteAndCalculate() {
    const directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    const mapInstance = this.map.googleMap;
    this.directionsRenderer.setMap(mapInstance);

    const request = {
      origin: { lat: this.startPoint!.latitude, lng: this.startPoint!.longitude },
      destination: { lat: this.endPoint!.latitude, lng: this.endPoint!.longitude },
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result: any, status: any) => {
      console.log('Route result:', result);
      console.log('Route status:', status);
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        this.distanceText = result.routes[0].legs[0].distance.text;
      } else {
        console.error('Route calculation failed:', status);
      }
    });
  }

  getDistanceTo(place: Place) {
    if (!this.startPoint) {
      alert('Please select a start point first.');
      return;
    }

    this.endPoint = place;
    this.drawRouteAndCalculate();
  }



}
