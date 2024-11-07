/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { environment } from './environments/environment';
import * as fetch from 'node-fetch';
import {
  PolygonPriceQueryResponse,
  PriceQueryResponse,
  PolygonQueryResponse,
  ProductsRequest
} from '@coding-challenge/stocks/data-access-price-query';
import { format } from 'date-fns';
import * as boom from 'boom';
import {get, set} from 'lodash';
const savedQueries: {
  [stock: string]: { [query: string]: PriceQueryResponse[] };
} = {};
const datePattern = /([0-9]{4}-[0-9]{2}-[0-9]{2})/;
const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        hello: 'world'
      };
    }
  });

  server.route({
    method: 'POST',
    path: '/stock-data',
    handler: async (request, h) => {
      const { startDate, endDate, symbol } = request.payload as ProductsRequest;
      validateJsonBody(startDate, endDate, symbol);
      const queryPath = `${symbol}.${startDate}:${endDate}`;
      const savedQuery = get(savedQueries, queryPath)
      if (savedQuery) {
        return savedQuery;
      }
      const url = `${
        environment.apiURL
      }/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?apiKey=${
        environment.apiKey
      }`;
      const polygonResponse = await fetchPolygonDataAndFormatForResponse(url);
      set(savedQueries, queryPath, polygonResponse)
      return polygonResponse;
    },
    options: {
      cors: true
    }
  });
  await server.start();

  console.log('Server running on %s', server.info.uri);
};

function validateJsonBody(startDate: string, endDate: string, symbol: string) {
  if (!(startDate && endDate && symbol)) {
    const missingParam = !startDate
      ? 'startDate'
      : !endDate
      ? 'endDate'
      : 'symbol';
    throw boom.badRequest(`missing required parameter '${missingParam}'`);
  } else if (!datePattern.test(startDate)) {
    throw boom.badRequest(
      `invalid start date: '${startDate}', must be in format "YYYY-MM-DD"`
    );
  } else if (!datePattern.test(endDate)) {
    throw boom.badRequest(
      `invalid end date: "${endDate}", must be in format "YYYY-MM-DD"`
    );
  }
}

function convertPriceQuery(
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
async function fetchPolygonDataAndFormatForResponse(
  url: string
): Promise<PriceQueryResponse[]> {
  try {
    const rawStockData = await fetch(url);
    if (!rawStockData.ok) {
      throw { response: rawStockData };
    }
    const stockJson = await rawStockData.json();
    return convertPriceQuery((stockJson as PolygonQueryResponse).results);
  } catch (err) {
    const errData = await err.response.text();
    throw boom.badImplementation(errData);
  }
}
process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
