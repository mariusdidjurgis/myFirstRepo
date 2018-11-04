import { Guid } from './../Types/guid';
import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Holding, Account } from '../Types/holding';

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

    public getHoldings() : Observable<Array<Holding>>{
        let holdings = [
            new Holding({ Id: Guid.newGuid(), Pset: "VPCESSESXXX", Isin: "isin1", TradeDate: new Date(), SettlementDate: new Date(), Valid: true, TotalAmount:1000, 
                AvailableAmount: 600, Status: "Pending", Account: new Account({ Name: "John", Number: "010000-123-456", Valid: true})}),
            new Holding({ Id: Guid.newGuid(), Pset: "VPCESSGBXXX", Isin: "isin2", TradeDate: new Date(), SettlementDate: new Date(), Valid: true, TotalAmount:900, 
                AvailableAmount: 750, Status: "New", Account: new Account({ Name: "Arnie", Number: "010000-456-789", Valid: true})}),
            new Holding({ Id: Guid.newGuid(), Pset: "VPCESSDEXXX", Isin: "isin3", TradeDate: new Date(), SettlementDate: new Date(), Valid: true, TotalAmount:2500, 
                AvailableAmount: 900, Status: "Pending", Account: new Account({ Name: "Gilbert", Number: "010000-789-012", Valid: true})}),
            new Holding({ Id: Guid.newGuid(), Pset: "VPCESSSPXXX", Isin: "isin4", TradeDate: new Date(), SettlementDate: new Date(), Valid: true, TotalAmount:1650, 
                AvailableAmount: 159, Status: "Pending", Account: new Account({ Name: "Suzie", Number: "010000-012-345", Valid: false})}),
            new Holding({ Id: Guid.newGuid(), Pset: "VPCESSITXXX", Isin: "isin5", TradeDate: new Date(), SettlementDate: new Date(), Valid: true, TotalAmount:1800, 
                AvailableAmount: 687, Status: "Aproved", Account: new Account({ Name: "Sarah", Number: "010000-345-678", Valid: true})})            
            ];

        return Observable.of(holdings);
    }
    
}
