import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  StocksAppConfig,
  StocksAppConfigToken
} from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError
} from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import {
  PolygonQueryResponse,
  PriceQueryResponse,
  PolygonPriceQueryResponse
} from './price-query.type';
import { format, subMonths, subYears } from 'date-fns';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
@Injectable()
export class PriceQueryEffects {
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
        return this.httpClient.get(this.buildUrl(action)).pipe(
          map(resp => {
            return new PriceQueryFetched(
              this.convertPriceQuery((resp as PolygonQueryResponse).results)
            );
          })
        );
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>
  ) {}
  convertPriceQuery(
    response: PolygonPriceQueryResponse[]
  ): PriceQueryResponse[] {
    const mapped = response.map(res => {
      return {
        date: format(new Date(res.t), 'MM/DD/YYYY'),
        open: res.o,
        high: res.h,
        low: res.l,
        close: res.c,
        volume: res.v
      };
    });
    return mapped as PriceQueryResponse[];
  }
  
  buildUrl(action: FetchPriceQuery): string {
    const queryString = `${this.env.apiURL}/v2/aggs/ticker/${action.symbol}/range/1/day/${action.periodStart}/${action.periodEnd}?apiKey=${this.env.apiKey}`;
    return queryString;
  }
}
