import { Component, OnInit, OnChanges } from '@angular/core';
import { AddressSuggestionsService } from './address-suggestions.service';
import { Address } from './address';
import { Observable, Subject } from 'rxjs';

import {
  tap,
  switchMap,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  loading: boolean = false;
  addresses$: Observable<Address[]>;
  private searchTerms = new Subject<string>();

  constructor(private addressSuggestionsService: AddressSuggestionsService) {}

  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.addresses$ = this.searchTerms.pipe(
      tap((_) => (this.loading = true)),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.addressSuggestionsService.searchAddress(term)
      ),
      tap((_) => (this.loading = false))
    );
  }
}
