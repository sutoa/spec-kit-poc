import { Snaptrade } from 'snaptrade-typescript-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const SNAPTRADE_CLIENT_ID = process.env.SNAPTRADE_CLIENT_ID;
const SNAPTRADE_CONSUMER_KEY = process.env.SNAPTRADE_CONSUMER_KEY;

if (!SNAPTRADE_CLIENT_ID || !SNAPTRADE_CONSUMER_KEY) {
  console.warn('SnapTrade API credentials are not set. Please set SNAPTRADE_CLIENT_ID and SNAPTRADE_CONSUMER_KEY in your .env file.');
}

const snaptradeClient = new Snaptrade({
  clientId: SNAPTRADE_CLIENT_ID || '',
  consumerKey: SNAPTRADE_CONSUMER_KEY || '',
});

export async function registerSnapTradeUser(userId: string) {
  const response = await snaptradeClient.authentication.registerSnapTradeUser({
    userId,
  });
  return response;
}

export async function loginSnapTradeUser(userId: string, userSecret: string, broker?: string) {
  const response = await snaptradeClient.authentication.loginSnapTradeUser({
    userId,
    userSecret,
    broker,
  });
  return response;
}

export async function getSnapTradeUserHoldings(userId: string, userSecret: string) {
  const response = await snaptradeClient.portfolioManagement.getAllUserHoldings({
    userId,
    userSecret,
  });
  return response;
}

export async function getSnapTradeBrokerages() {
    const response = await snaptradeClient.apiStatus.getAllBrokerages();
    return response;
}
