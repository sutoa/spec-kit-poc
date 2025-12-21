// frontend/src/snaptrade-sdk/types.ts

/**
 * Interface for the response from the backend to initiate the SnapTrade connection.
 * Assumes the backend provides a URL to redirect the user to the SnapTrade portal.
 */
export interface SnapTradeConnectResponse {
  redirect_uri: string;
}

/**
 * Interface for the data received upon a successful SnapTrade connection.
 * This is highly speculative and would depend on SnapTrade's actual callback payload.
 * For demonstration, we'll assume a `connectionId`.
 */
export interface SnapTradeSuccessData {
  connectionId: string;
  // Add other relevant data from SnapTrade callback if known
}

/**
 * Interface for an error encountered during the SnapTrade connection process.
 */
export interface SnapTradeError {
  message: string;
  code?: string;
  // Add other relevant error details if known
}
