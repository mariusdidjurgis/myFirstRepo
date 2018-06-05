import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { GenericTableModule } from '@angular-generic-table/core';
import { ColumnSettingsModule } from '@angular-generic-table/column-settings';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { VisataComponent } from './visata/visata.component';
import { ZvaigzdeComponent } from './visata/zvaigzde/zvaigzde.component';
import { GalaktikaComponent } from './visata/galaktika/galaktika.component';
import { PlanetaComponent } from './visata/zvaigzde/planeta/planeta.component';
import { GenericTableComponent } from './genericTable/genericTable.component';

@NgModule({
  declarations: [
    AppComponent,
    VisataComponent,
    ZvaigzdeComponent,
    GalaktikaComponent,
    PlanetaComponent,
    HomeComponent,
    GenericTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GenericTableModule, /** ADD THIS LINE TO YOUR APP MODULE! */
    ColumnSettingsModule, /** ADD THIS LINE TO INCLUDE COLUMN SETTINGS MODULE (OPTIONAL) */
    RouterModule.forRoot([
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'visata', component: VisataComponent },
        { path: 'zvaigzde', component: ZvaigzdeComponent },
        { path: 'galaktika', component: GalaktikaComponent },
        { path: 'generic-table', component: GenericTableComponent },
        { path: '**', redirectTo: 'visata' }
    ]), 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
