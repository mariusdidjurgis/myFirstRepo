import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
import 'rxjs/Rx';

@Injectable()
export class ApiService {

    private cache$: any;
    private CACHE_SIZE: number = 1;
    constructor(private http: HttpClient){

    }

    fakeApiCall(){
        let obs1 = this.http.get('api/GetList');

        
        return this.http.get<any>('').pipe(
            map(response => response.value)
        );
    }

    get jokes() {
        if (!this.cache$) {
          this.cache$ = this.requestJokes().pipe(
            shareReplay(this.CACHE_SIZE)
          );
        }
    
        return this.cache$;
    }
    
    private requestJokes() {
        return this.http.get<any>('API_ENDPOINT').pipe(
            map(response => response.value)
        );
    }

    
}
