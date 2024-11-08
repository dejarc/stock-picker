import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  priceQueryAdapter,
  PriceQueryState,
  PRICEQUERY_FEATURE_KEY
} from './price-query.reducer';
const { selectAll } = priceQueryAdapter.getSelectors();

const getPriceQueryState = createFeatureSelector<PriceQueryState>(
  PRICEQUERY_FEATURE_KEY
);

export const getSelectedSymbol = createSelector(
  getPriceQueryState,
  (state: PriceQueryState) => state.selectedSymbol
);


export const getAllPriceQueries = createSelector(
  getPriceQueryState,
  selectAll
);

export const getPriceQueryError = createSelector(
  getPriceQueryState,
  state => {
    return state.error;
  }
)

