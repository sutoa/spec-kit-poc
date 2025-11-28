import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { createLinkToken, exchangePublicToken } from '../services/api';

interface PlaidLinkProps {
  onSuccess: (itemId: string) => void;
}

const PlaidLink: React.FC<PlaidLinkProps> = ({ onSuccess }) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    const getLinkToken = async () => {
      try {
        const token = await createLinkToken();
        setLinkToken(token);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };
    getLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: useCallback(async (public_token, metadata) => {
      // Send public_token to your backend to exchange for an access_token
      try {
        const response = await exchangePublicToken(public_token);
        onSuccess(response.item_id);
      } catch (error) {
        console.error('Error exchanging public token:', error);
      }
    }, [onSuccess]),
    onEvent: useCallback((eventName, metadata) => {
      console.log('Plaid Event:', eventName, metadata);
    }, []),
    onExit: useCallback((error, metadata) => {
      console.log('Plaid Exit:', error, metadata);
    }, []),
  });

  return (
    <button onClick={() => open()} disabled={!ready || !linkToken}>
      Link Account
    </button>
  );
};

export default PlaidLink;
