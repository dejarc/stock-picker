import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { isBefore, format } from 'date-fns';
@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  startPicker: any;
  endPicker: any;
  quotes$ = this.priceQuery.priceQueries$;
  maxDate = new Date();
  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      startPicker: [null, Validators.required],
      endPicker: [null, Validators.required],
    });
  }

  updateDateOnInvalidRange() {
    const {endPicker, startPicker, symbol}: {endPicker: Date, startPicker: Date, symbol: string} = this.stockPickerForm.value;
    if ((endPicker && startPicker) && isBefore(endPicker, startPicker)) {
      const now = new Date();
      this.stockPickerForm.setValue({startPicker: now, endPicker: now, symbol: symbol})
    }
  }
  ngOnInit() {}

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, startPicker, endPicker } = this.stockPickerForm.value;

      this.priceQuery.fetchQuote(symbol, format(startPicker, "YYYY-MM-DD"), format(endPicker, "YYYY-MM-DD"));
    }
  }
}
