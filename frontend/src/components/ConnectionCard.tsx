import React from 'react';
import { connectInstitution } from '../services/api';

interface ConnectionCardProps {
  institution: {
    id: string;
    external_id: string; // Add external_id for image lookup
    name: string;
    status: string;
  };
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ institution }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500 text-green-600 dark:text-green-400';
      case 'disconnected':
        return 'bg-red-500 text-red-600 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-500 text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'bg-red-500 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500 text-gray-600 dark:text-gray-400';
    }
  };

  // Mock image based on institution name for now
  const getInstitutionImage = (name: string) => {
    // This should ideally come from the backend or a predefined list
    if (name.toLowerCase().includes('alpaca')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHvR_5CJ7bIDbaFBwIltiPtoCYEq0-FvGvqHlKtR3JiYfd43iuOAzi5cS-yDuIqr4BAfc-r_j-VucUSYDay7GiKR3nhJwgxhot_KdNTkMV6JmSDP1TxI04banUaNrvq_erKQxe_5IFDY3bbiwIMLzN-1Ez_X4Neaz7BMOdfhSAoIkUmDtzT1t6DbZx2iBUv9Qms5uTtaiJuTqXFLOkT0TGM_BDUUs7C-mwqor8wu_WqF6Sa-SMkEB3MziLNcBP2yCffO5ZD39OSCst';
    } else if (name.toLowerCase().includes('vanguard')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD2E_xTRSdzYtZPEpVuSnJoeORK_wFVQs1pPE64RcaXmElupmXzyDRwsPUCK4trdRVwmclz63LTyxh412L859DusNKpp--5rsoG_7Fu8mERiYxGgA_qvNZ916Ft62P89HtcUgB1zSSjVMdcgFSke0rhIkjSfyiWfPXuUB_t3t771JAQ6XT74gsCnvdfTzk2HmQVhK2e9Ji9fUls6TQHTsNW1GqkUXIXlVLwmXn-TCwloqBYC6SpVbEF9CESu5jhOuBX34HKaWdWF-H';
    } else if (name.toLowerCase().includes('td trade')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX0FyO5_LUqryWrxqpGi-c7Ss-TO9qmqARAj61QItzl4xVEcAog_stw38FF9UuTUa8D5JuTQ6oA1FzVmKeQZ1ZJcMI3YJZZcS4ji58G4w0XMv-8MQcPYcpMxnzoXGukyBM9uI5i68iwMPea7_-1ILFPG2zDFtNO0c0GvYjuay9BrucA1IIHxkIyIQiX0yIa0sJLhcS7HVI7v7B4T6BHGz_qNIXPqMwWjd9xSlz0c21Uiu1rc7eEls4Ptv7xST7VI8Qn70W7CdlA658';
    }
    return 'https://via.placeholder.com/40'; // Default image
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectInstitution(institution.id); // Assuming institution.id is used for connect
      if (data.redirect_uri) {
        window.location.href = data.redirect_uri;
      }
    } catch (err: any) {
      setError(err.message || "Error connecting to institution");
      console.error('Error connecting to institution:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusClasses = getStatusClasses(institution.status);
  const institutionImage = getInstitutionImage(institution.name);

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img className="size-10 rounded-full" data-alt={`${institution.name} logo`} src={institutionImage} />
          <span className="font-semibold text-slate-800 dark:text-white">{institution.name}</span>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined text-xl">more_vert</span>
        </button>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${statusClasses.split(' ')[0]}`}></div> {/* Get background color class */}
          <span className={`text-sm ${statusClasses.split(' ')[1]}`}>
            {institution.status.charAt(0).toUpperCase() + institution.status.slice(1)}
          </span>
        </div>
        {/* Updated time is not dynamic, so hardcoding for now as per mockup */}
        <span className="text-sm text-slate-400 dark:text-slate-500">Updated Xm ago</span>
      </div>
      {institution.status !== 'connected' && (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all"
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ConnectionCard;