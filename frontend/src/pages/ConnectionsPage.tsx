import React, { useEffect, useState } from 'react';
import { getInstitutions } from '../services/api';
import ConnectionCard from '../components/ConnectionCard';

const ConnectionsPage: React.FC = () => {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const data = await getInstitutions();
        setInstitutions(data);
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    };

    fetchInstitutions();
  }, []);

  return (
    <div>
      <h1>Manage Financial Institutions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {institutions.map((inst) => (
          <ConnectionCard key={inst.id} institution={inst} />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;