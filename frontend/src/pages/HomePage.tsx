import React, { useState, useEffect } from 'react';
import PlaidLink from '../components/PlaidLink';
import FilterPanel from '../components/FilterPanel';
import ReportView from '../components/ReportView';
import { Box, Button, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { Report } from '../services/api'; // Import the Report interface

const HomePage: React.FC = () => {
  const [linkedItemIds, setLinkedItemIds] = useState<number[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Placeholder for fetching already linked items from backend on initial load
  useEffect(() => {
    // In a real application, you'd fetch these from your backend
    // For now, let's assume we have no linked items initially
    // or simulate fetching some existing ones.
    const fetchExistingItems = async () => {
        // Example: const response = await fetch('/api/v1/items');
        // const data = await response.json();
        // setLinkedItemIds(data.item_ids);
    };
    fetchExistingItems();
  }, []);

  const handlePlaidSuccess = (new_itemId: string) => {
    // Convert new_itemId to number as per backend API
    const newItemIdNum = parseInt(new_itemId, 10);
    setLinkedItemIds((prev) => [...prev, newItemIdNum]);
    setError(null);
  };

  const handleApplyFilters = async (filters: { itemIds: number[]; asOfDate: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_ids: filters.itemIds, as_of_date: filters.asOfDate }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate report');
      }
      const data: Report = await response.json();
      setReport(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while generating the report.');
      }
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Account Viewer
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {linkedItemIds.length === 0 ? (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              No accounts linked yet.
            </Typography>
            <PlaidLink onSuccess={handlePlaidSuccess} />
          </>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Linked Accounts
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Currently linked item IDs: {linkedItemIds.join(', ')}
            </Typography>
            <PlaidLink onSuccess={handlePlaidSuccess} /> {/* Option to link more accounts */}

            <FilterPanel
              onApplyFilters={handleApplyFilters}
              availableItemIds={linkedItemIds}
            />

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}
            {!loading && report && <ReportView report={report} />}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
