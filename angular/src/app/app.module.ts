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
import { AlertComponent } from './Shared/Components/allert.component';
import { ApiService } from './Shared/Services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { AccountComponent } from './Shared/Components/account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    VisataComponent,
    ZvaigzdeComponent,
    GalaktikaComponent,
    PlanetaComponent,
    HomeComponent,
    GenericTableComponent,
    AlertComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
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
  entryComponents: [ AlertComponent ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
