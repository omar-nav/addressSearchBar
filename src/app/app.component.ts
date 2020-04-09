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
  results$ = this.term$.pipe(autocomplete(500, (term) => this.fetch(term)));
  addresses$ = this.results$.pipe(
    autocomplete(500, (results) => this.cleanUp(results))
  );

  addresses: IAddress[] = [];
  // _listFilter = '';
  // errorMessage = '';

  // filteredAddresses: IAddress[] = [];

  constructor(private addressSuggestionsService: AddressSuggestionsService) {}
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

  cleanUp(results: Observable<any>): void {
    for (let i = 0; i < results["candidates"].length; i++) {
      this.addresses.push(results["candidates"].length);
      let addressColumn = 'addressId';
      let addressId = i;
      this.addresses[i][addressColumn] = addressId;
    }

  }

  fetch(term: string): Observable<any> {
    return this.addressSuggestionsService.getAddressSuggestions(term);
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
