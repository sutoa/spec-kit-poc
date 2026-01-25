import { getSnapTradeUserHoldings } from './client';

export async function getSnapTradeAccounts(userId: string, userSecret: string) {
  try {
    const holdings = await getSnapTradeUserHoldings(userId, userSecret);
    // SnapTrade holdings API returns a lot of data. For accounts, we're interested in
    // the overall account structure. This might need further refinement based on actual
    // SnapTrade SDK output for account details vs. holdings.
    // For now, let's extract unique accounts from holdings.
    const accountsMap = new Map<string, any>();
    holdings.forEach(holding => {
        if (holding.account) {
            accountsMap.set(holding.account.id, holding.account);
        }
    });
    return Array.from(accountsMap.values());
  } catch (error) {
    console.error('Error fetching SnapTrade accounts:', error);
    throw error;
  }
}
