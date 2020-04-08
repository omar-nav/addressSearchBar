import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { IAddress } from './address';
import { AddressSuggestionsService } from './address-suggestions.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  // title = "search bar";
  // myControl = new FormControl();
  // errorMessage = '';
  // filteredOptions: Observable<string[]>;
  // options: string[] = ['Austin', 'DC', 'San Diego'];

  // ngOnInit() {
  //   this.filteredOptions = this.myControl.valueChanges.pipe(
  //     startWith(''),
  //     map(value => this._filter(value))
  //   );
  // }
  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredAddresses = this.listFilter ? this.performFilter(this.listFilter) : this.addresses;
  }

  filteredAddresses: IAddress[] = [];
  addresses: IAddress[] = [];

  constructor(private addressSuggestionsService: AddressSuggestionsService) {
  }

    // private _filter(value: string): string[] {
    //   const filterValue = value.toLowerCase();

    //   return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    // }
  performFilter(filterBy: string): IAddress[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.addresses.filter((address: IAddress) =>
    address.address.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    this.addressSuggestionsService.getAddressSuggestions().subscribe({
      next: addresses => {
        this.addresses = addresses;
        this.filteredAddresses = this.addresses;
      },
      error: err => this.errorMessage = err
    });
  }

}
