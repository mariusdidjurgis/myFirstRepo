import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { VisataComponent } from './visata/visata.component';
import { ZvaigzdeComponent } from './visata/zvaigzde/zvaigzde.component';
import { GalaktikaComponent } from './visata/galaktika/galaktika.component';

@NgModule({
  declarations: [
    AppComponent,
    VisataComponent,
    ZvaigzdeComponent,
    GalaktikaComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'visata', component: VisataComponent },
        { path: 'zvaigzde', component: ZvaigzdeComponent },
        { path: 'galaktika', component: GalaktikaComponent },
        { path: '**', redirectTo: 'visata' }
    ]), 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
