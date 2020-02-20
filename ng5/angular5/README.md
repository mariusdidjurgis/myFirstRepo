# Angular5

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## How to create angular project with custom version 
1) Create a folder called ng5 to house all of your new Angular 5 applications:
md ng5
cd ng5
2) In your ng5 folder create a new local npm application by using:
npm init -y
3) Install Angular 5 CLI locally using:
npm install @angular/cli@1.7.4
4) Now you MUST delete the local package.json file. If you don’t, Angular CLI will complain when you try use ng new. This is because it will think you are trying to create a new application inside an existing Angular CLI application.
5) Create your new Angular 5 application:
ng new my-ng5-app

