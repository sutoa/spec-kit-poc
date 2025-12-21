import React from 'react';
import { Institution } from '../types/connection';
import { MoreVertical, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { SnapTradeLink, SnapTradeSuccessData, SnapTradeError } from '../snaptrade-sdk';

interface ConnectionCardProps {
  institution: Institution;
  onSuccess: (data: SnapTradeSuccessData) => void;
  onError: (error: SnapTradeError) => void;
  onClose: () => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ institution, onSuccess, onError, onClose }) => {
  const isConnected = institution.status === 'connected';
  const isError = institution.status === 'error';
  const isPending = institution.status === 'pending';

  const getStatusIcon = () => {
    if (isConnected) {
      return <CheckCircle className="text-green-500" size={16} />;
    } else if (isError) {
      return <AlertCircle className="text-red-500" size={16} />;
    } else if (isPending) {
      return <Clock className="text-yellow-500" size={16} />;
    }
    return <XCircle className="text-gray-400" size={16} />; // disconnected or unknown
  };

  const getStatusText = () => {
    if (isConnected) return 'Connected';
    if (isError) return 'Error';
    if (isPending) return 'Pending';
    return 'Disconnected';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <span className="text-gray-500 dark:text-gray-300 text-3xl font-bold">{institution.name.charAt(0)}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate w-full">{institution.name}</h3>
      
      <div className="flex items-center gap-2 text-sm mb-4">
        {getStatusIcon()}
        <span className={`font-medium ${isConnected ? 'text-green-600' : isError ? 'text-red-600' : isPending ? 'text-yellow-600' : 'text-gray-500'} dark:text-gray-400`}>
          {getStatusText()}
        </span>
      </div>

      <div className="flex justify-between w-full">
        {!isConnected ? (
          <SnapTradeLink
            institutionId={institution.id.toString()}
            onSuccess={onSuccess}
            onError={onError}
            onClose={onClose}
          >
            <button
              className="flex-1 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors"
            >
              <span className="truncate">Connect</span>
            </button>
          </SnapTradeLink>
        ) : (
          <button
            disabled
            className="flex-1 min-w-[84px] max-w-[480px] cursor-not-allowed items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-300 text-gray-700 text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Connected</span>
          </button>
        )}

        <button 
          className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="More options"
        >
          <MoreVertical className="text-gray-500 dark:text-gray-400" size={20} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ConnectionCard);