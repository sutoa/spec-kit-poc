/// <reference types="node" />
// frontend/src/snaptrade-sdk/useSnapTrade.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { SnapTradeConnectResponse, SnapTradeSuccessData, SnapTradeError } from './types';
import { initiateSnapTradeConnect, getInstitutions } from '../services/api';
import { Institution } from '../types/connection';

interface UseSnapTradeOptions {
  onSuccess?: (data: SnapTradeSuccessData) => void;
  onError?: (error: SnapTradeError) => void;
  onClose?: () => void;
}

interface UseSnapTradeReturn {
  connect: (institutionId: string) => void;
  isLoading: boolean;
  error: SnapTradeError | null;
}

export const useSnapTrade = ({ onSuccess, onError, onClose }: UseSnapTradeOptions): UseSnapTradeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SnapTradeError | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const windowRef = useRef<Window | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (windowRef.current && !windowRef.current.closed) {
      windowRef.current.close();
    }
    setIsLoading(false);
  }, []);

  const connect = useCallback(async (institutionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: SnapTradeConnectResponse = await initiateSnapTradeConnect(institutionId);
      const { redirect_uri } = response;

      if (!redirect_uri) {
        throw new Error('Backend did not provide a SnapTrade portal URL.');
      }

      const newWindow = window.open(redirect_uri, '_blank', 'noopener,noreferrer');
      windowRef.current = newWindow;

      if (newWindow) {
        pollingRef.current = setInterval(async () => {
          if (newWindow.closed) {
            stopPolling();
            onClose?.();
            return;
          }

          try {
            const institutions: Institution[] = await getInstitutions();
            const updatedInstitution = institutions.find(inst => inst.id.toString() === institutionId);

            if (updatedInstitution?.status === 'connected') {
              stopPolling();
              onSuccess?.({ connectionId: updatedInstitution.id.toString() });
            } else if (updatedInstitution?.status === 'error') {
              stopPolling();
              const snapTradeError: SnapTradeError = { message: 'Connection failed at institution.' };
              setError(snapTradeError);
              onError?.(snapTradeError);
            }
          } catch (err) {
            // Ignore polling errors, keep trying
            console.error('Polling error:', err);
          }
        }, 2000); // Poll every 2 seconds
      } else {
        throw new Error('Failed to open SnapTrade portal window. Please check your browser\'s pop-up blocker.');
      }
    } catch (err: any) {
      console.error('SnapTrade connection error:', err);
      const snapTradeError: SnapTradeError = { message: err.message || 'An unknown error occurred during SnapTrade connection.' };
      setError(snapTradeError);
      onError?.(snapTradeError);
      setIsLoading(false);
    }
  }, [onSuccess, onError, onClose, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return { connect, isLoading, error };
};
