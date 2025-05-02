'use strict';

// Read env vars from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Configuration, PlaidApi, Products, PlaidEnvironments } from 'plaid';
import util from 'util';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;
import moment from 'moment';
import express from 'express';

const plaidRoute = express.Router();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing Link
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(',');

// PLAID_COUNTRY_CODES is a comma-separated list of countries
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');

// OAuth redirect URIs
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || 'http://localhost:3000/';
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';

// In-memory storage (for demo)
let ACCESS_TOKEN = null;
let USER_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
let ACCOUNT_ID = null;
let PAYMENT_ID = null;
let AUTHORIZATION_ID = null;
let TRANSFER_ID = null;

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);

// Plaid health check
plaidRoute.get('/api', function (request, response) {
  return response.json({ status: 'ok' });
});

// Create Link Token
plaidRoute.post('/create-link-token', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
      const configs = {
        user: { client_user_id: 'user-id' },
        client_name: 'Plaid Quickstart',
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: 'en',
      };

      if (PLAID_REDIRECT_URI !== '') {
        configs.redirect_uri = PLAID_REDIRECT_URI;
      }

      if (PLAID_ANDROID_PACKAGE_NAME !== '') {
        configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
      }

      if (PLAID_PRODUCTS.includes(Products.Statements)) {
        configs.statements = {
          end_date: moment().format('YYYY-MM-DD'),
          start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        };
      }

      if (PLAID_PRODUCTS.some(product => product.startsWith('cra_'))) {
        configs.user_token = USER_TOKEN;
        configs.cra_options = { days_requested: 60 };
        configs.consumer_report_permissible_purpose = 'ACCOUNT_REVIEW_CREDIT';
      }

      const createTokenResponse = await client.linkTokenCreate(configs);
      prettyPrintResponse(createTokenResponse);
      response.json(createTokenResponse.data);
    })
    .catch(next);
});

// Exchange Public Token for Access Token
plaidRoute.post('/exchange-token', function (request, response, next) {
  PUBLIC_TOKEN = request.body.public_token;
  Promise.resolve()
    .then(async function () {
      const tokenResponse = await client.itemPublicTokenExchange({ public_token: PUBLIC_TOKEN });
      prettyPrintResponse(tokenResponse);
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;
      response.json({
        access_token: ACCESS_TOKEN,
        item_id: ITEM_ID,
        error: null,
      });
    })
    .catch(next);
});

// Fetch Transactions
plaidRoute.get('/transactions', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
      let cursor = null;
      let added = [];
      let modified = [];
      let removed = [];
      let hasMore = true;

      while (hasMore) {
        const req = { access_token: ACCESS_TOKEN, cursor: cursor };
        const res = await client.transactionsSync(req);
        const data = res.data;

        cursor = data.next_cursor;
        if (cursor === "") {
          await sleep(2000);
          continue;
        }

        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;

        prettyPrintResponse(res);
      }

      const compareTxnsByDateAscending = (a, b) => (a.date > b.date) - (a.date < b.date);
      const recently_added = [...added].sort(compareTxnsByDateAscending).slice(-8);

      response.json({ latest_transactions: recently_added });
    })
    .catch(next);
});

// Helper function for debug logging
const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

export default plaidRoute;
