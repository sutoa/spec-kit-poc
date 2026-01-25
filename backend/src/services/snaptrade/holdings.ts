import { getSnapTradeUserHoldings } from './client';

export async function getSnapTradeHoldings(userId: string, userSecret: string) {
  try {
    const holdings = await getSnapTradeUserHoldings(userId, userSecret);
    return holdings;
  } catch (error) {
    console.error('Error fetching SnapTrade holdings:', error);
    throw error;
  }
}
