# MapBasedProject

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

## Table of Contents
1. [Description](#description)
2. [Key Features Implemented](#key-features-implemented)
3. [Steps Taken in the Implementation](#steps-taken-in-the-implementation)
4. [Development Server](#development-server)
5. [Code Scaffolding](#code-scaffolding)
6. [Building](#building)
7. [Running Unit Tests](#running-unit-tests)
8. [Running End-to-End Tests](#running-end-to-end-tests)
9. [Deployment](#deployment)
10. [Deployment Process](#deployment-process)
11. [Additional Resources](#additional-resources)

## Description

MapBasedProject is an Angular-based web application that leverages the Google Maps API to display dynamic markers from a data source, allow users to search and filter places, and get directions to selected locations.

The application features:
- A map with dynamic markers based on JSON data.
- A search bar to filter places by type and rating.
- A "Get Directions" feature that calculates the route from the user's current location to the selected place.
- A responsive, mobile-friendly UI with custom info windows for each location.
- Integrated deployment to Vercel for continuous delivery.
- Handled memory leakage

## Key Features Implemented

1. Google Maps Integration: Integrated Google Maps API for displaying the map and markers.
2. Directions API: Implemented the Google Maps Directions API to calculate and display routes between the user's location and selected places.
3. Location Access: Integrated browser geolocation to retrieve the user's current location.
4. Filter Functionality: Users can filter places by type and rating, with the option to search by name.
5. Responsive UI: The map and UI are responsive, adapting to different screen sizes, including mobile devices.

## Steps Taken in the Implementation

1. Google Maps Setup:

    - Used the google-maps package for easy integration with Angular.
    - Configured the API with a key and set up map settings such as zoom and center position.

2. Place Markers:

    - The map displays markers for places, fetched from a JSON file (places.json).
    - Each marker is clickable, opening an info window with detailed information about the place.

3. Geolocation & Directions:

    - Integrated browser geolocation to retrieve the user’s current location.
    - Implemented the Directions API to display driving directions from the user's location to the selected place.
    -  booking feature where users can navigate to a booking form

4. UI Enhancements:

    - Added a loading spinner (GIF or SVG) to improve UX while waiting for the map to load.
    - Applied animations and smooth transitions to the info window and map elements for better user experience.

## Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment

This project is deployed on Vercel and is automatically updated via CI/CD from the GitHub repository.

## Deployment Process

    1. Vercel Setup:

        Create a Vercel account and connect it to your GitHub repository.

        Vercel automatically detects the project configuration and sets up the build process for you (Angular app in this case).

    2. Automatic Deployment:

        Every push to the main or master branch will trigger an automatic deployment to Vercel.

        After deployment, the app will be live and accessible through the provided URL.

    3. Access the App:

        The live application can be accessed at:

        map-app-two-eta.vercel.app

## For More Information:

For more details on deploying with Vercel and setting up CI/CD, refer to the Vercel Documentation.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
