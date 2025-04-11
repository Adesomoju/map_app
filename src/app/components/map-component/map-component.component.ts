import { Component, OnInit, ViewChild } from '@angular/core';
import { Place } from '../../model/places.model';
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMapsModule, GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import placesData from '../../../assets/data/places.json';
import { environment } from '../../../environments/environment';
import { PlaceService } from '../../services/places/place.service';

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
  zoom = 14;

  places: Place[] = [];
  filteredPlaces: Place[] = [];
  selectedType: string = 'all';
  selectedRating: string = 'all';
  searchTerm: string = '';
  selectedPlace?: Place;

  loader!: Loader;
  googleMapsReady = false;

  directionsService!: any;
  directionsRenderer!: any;
  distanceText: any;

  loadingClass = ''; // To handle visibility of the spinner

  constructor(
    private readonly placeService: PlaceService,
    private readonly router: Router
  ) { }

  // This method is used to initialize the map and load the places data
  ngOnInit() {
    const converted = (placesData as any[]).map(p => ({
      ...p,
      ratings: parseFloat(p.ratings)
    }));

    this.places = converted;
    this.filterPlaces();
  }

  // This method is used to initialize the Google Maps API 
  ngAfterViewInit() {
    // Only load Google Maps API after view initialization and check if `window` is available
    if (typeof window !== 'undefined') {
      this.loader = new Loader({
        apiKey: environment.googleMapsApiKey,
        version: 'weekly',
        libraries: ['places'],
      });

      this.loader.load().then(() => {
        this.googleMapsReady = true;
        this.loadingClass = 'hidden'; // Hide spinner once maps are ready

        // Initialize directions service and renderer once the Google Maps API is ready
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();

        // Wait until the map view is fully available
        setTimeout(() => {
          if (this.map && this.map.googleMap) {
            this.directionsRenderer.setMap(this.map.googleMap);
          } else {
            console.warn('Google Map is not ready yet');
          }
        }, 0);

      }).catch(error => {
        console.error('Google Maps API failed to load:', error);
      });
    }
  }

  // This method is used to filter the places based on selected type, search term and rating
  // It updates the filteredPlaces array based on the selected criteria
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


  // This method is used to set the map center based on the selected place
  openInfoWindow(marker: MapMarker, place: Place) {
    if (this.directionsRenderer) {
      const rendererToClear = this.directionsRenderer;

      // If there is a route to clear, do it with a slight delay
      setTimeout(() => {
        if (rendererToClear) {
          rendererToClear.setMap(null); // Clears the route
        }
        this.directionsRenderer = new google.maps.DirectionsRenderer(); // Recreate the renderer to avoid null references
        this.directionsRenderer.setMap(this.map.googleMap); // Associate the new renderer with the map
        this.distanceText = ''; // Clear the distance info
      }, 300); // Delay to smoothen the experience
    }

    // Set the map center to the selected place
    this.selectedPlace = place;
    this.infoWindow.open(marker);
  }


  // This method is used to get the star icons based on the rating
  // It returns an array of star icon paths
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

  // Booking logic
  // This method is called when the user clicks on the "Book Now" button in the info window
  openBookingForm(place: Place) {
    if (this.placeService) {
      this.placeService.setSelectedPlace(place);
      this.router.navigate(['/booking']);
      // Ensure this is called correctly
    } else {
      console.error('BookingStateService is not available!');
    }
  }


  // Directions and routing logic
  drawRouteTo(destination: Place) {

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    // Check if the user has granted permission to access location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const destinationLatLng = {
            lat: destination.latitude,
            lng: destination.longitude
          };

          const request = {
            origin: origin,
            destination: destinationLatLng,
            travelMode: google.maps.TravelMode.DRIVING
          };

          // check if directionsService and directionsRenderer are initialized
          if (this.directionsService && this.directionsRenderer) {
            this.directionsService.route(request, (result: any, status: string) => {
              if (status === 'OK') {
                this.directionsRenderer.setDirections(result);
                this.distanceText = result.routes[0].legs[0].distance.text;


                // Pan and zoom the map to user's location
                if (this.map && this.map.googleMap) {
                  this.map.googleMap.panTo(origin);
                  this.map.googleMap.setZoom(15);
                }

                //show user's location
                new google.maps.Marker({
                  position: origin,
                  map: this.map.googleMap,
                  title: 'You are here',
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: 'white'
                  }
                });

              } else {
                console.error('Directions request failed due to ' + status);
              }
            });
          } else {
            console.error('DirectionsService or DirectionsRenderer not initialized');
          }
        },
        error => { // Handle geolocation errors
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            default:
              console.error("An unknown error occurred.");
              break;
          }
        },
        { // Geolocation options
          // Enable high accuracy for better location tracking
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }





}
