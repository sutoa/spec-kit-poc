// frontend/src/snaptrade-sdk/SnapTradeLink.tsx
import React from 'react';
import { useSnapTrade } from './useSnapTrade';
import { SnapTradeError, SnapTradeSuccessData } from './types';

interface SnapTradeLinkProps {
  institutionId: string;
  onSuccess?: (data: SnapTradeSuccessData) => void;
  onError?: (error: SnapTradeError) => void;
  onClose?: () => void;
  children: React.ReactNode;
}

export const SnapTradeLink: React.FC<SnapTradeLinkProps> = ({
  institutionId,
  onSuccess,
  onError,
  onClose,
  children,
}) => {
  const { connect, isLoading, error } = useSnapTrade({ onSuccess, onError, onClose });

  const handleClick = () => {
    connect(institutionId);
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Connecting...' : children}
      {error && <span className="text-red-500 text-sm ml-2">{error.message}</span>}
    </button>
  );
};
