import { PriceQuery, PriceQueryResponse } from './price-query.type';
import { map, pick } from 'lodash-es';
import { parse, format } from 'date-fns';

export function transformPriceQueryResponse(
  response: PriceQueryResponse[]
): PriceQuery[] {
  return map(
    response,
    res =>
      ({
        date: format(new Date(res.t), 'MM/DD/YYYY'),
        close: res.c,
        dateNumeric: parse(res.t).getTime()
      } as PriceQuery)
  );
}


