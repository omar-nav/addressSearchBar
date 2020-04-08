import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  startWith,
  map,
  debounceTime,
  switchMap,
  takeUntil,
  skip,
} from 'rxjs/operators';

import { IAddress } from './address';
import { AddressSuggestionsService } from './address-suggestions.service';
import { HttpClient } from '@angular/common/http';

// custom operator for safe auto-complete
const autocomplete = (time, selector) => (source$) =>
  source$.pipe(
    debounceTime(time),
    switchMap((...args: any[]) =>
      selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
    )
  );

// export const _filter = (opt: string[], value: string): string[] => {
//   const filterValue = value.toLowerCase();

//   return opt.filter((item) => item.toLowerCase().indexOf(filterValue) === 0);
// };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AddressSuggestionsService],
})
export class AppComponent {
  term$ = new BehaviorSubject<string>('');
  results$ = this.term$.pipe(autocomplete(1000, (term) => this.fetch(term)));

  // _listFilter = '';
  // errorMessage = '';

  // filteredAddresses: IAddress[] = [];
  // addresses: IAddress[] = [];

  constructor(
    private httpClient: HttpClient,
    private addressSuggestionsService: AddressSuggestionsService
  ) {}
  // performFilter(filterBy: string): IAddress[] {
  //   filterBy = filterBy.toLocaleLowerCase();
  //   console.log(
  //     this.addresses.filter(
  //       (address: IAddress) =>
  //         address.address.toLocaleLowerCase().indexOf(filterBy) !== -1
  //     )
  //   );
  //   return this.addresses.filter(
  //     (address: IAddress) =>
  //       address.address.toLocaleLowerCase().indexOf(filterBy) !== -1
  //   );
  // }
  // get listFilter(): string {
  //   return this._listFilter;
  // }
  // set listFilter(value: string) {
  //   this._listFilter = value;
  //   this.filteredAddresses = this.listFilter
  //     ? this.performFilter(this.listFilter)
  //     : this.addresses;
  // }

  fetch(term: string): Observable<any> {
    return this.httpClient.get(
      'https://geo.traviscountytx.gov/arcgis/rest/services/Address_Locator_composite/GeocodeServer/findAddressCandidates?f=json&singleLine=' +
        term +
        '&outfields=Match_addr,Addr_type=PointAddress'
    );
  }

  // fetch(term: string): Observable<any> {
  //   console.log(this.addressSuggestionsService.getAddressSuggestions(term));
  //   return this.addressSuggestionsService.getAddressSuggestions(term);
  // }
}

// myControl = new FormControl();

// constructor(private addressSuggestionsService: AddressSuggestionsService) {}

// onKey(value: string) {

// }

// https://geo.traviscountytx.gov/arcgis/rest/services/Address_Locator_composite/GeocodeServer/findAddressCandidates?f=json&singleLine=700%20Lavaca%20St&outfields=Match_addr,Addr_type=PointAddress
// .getAddressSuggestions(this.searchTerm$)
// .subscribe({
//   next: (addresses) => {
//     for (let i=0; i < this.addresses.length; i++) {
//       // add column named addressID
//       // for filter method
//       // in the existing object push a new key-value pair
//       let addressColumn = "addressId";
//       let addressId = i;
//       this.addresses[i][addressColumn]=addressId;
//     }
//     this.addresses = addresses;
//     this.filteredAddresses = this.addresses;
//   },
//   error: (err) => (this.errorMessage = err),
