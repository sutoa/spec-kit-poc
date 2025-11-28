import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { Report } from '../services/api'; // Assuming you define Report type in api.ts or a shared types file

interface ReportViewProps {
  report: Report | null;
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  if (!report) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h6">No report to display. Generate a report above.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Consolidated Financial Report
      </Typography>

      <Typography variant="h6" gutterBottom>
        Grand Total: ${report.grand_total.toFixed(2)}
      </Typography>

      {report.institutions.map((institution, instIndex) => (
        <Paper key={instIndex} elevation={3} sx={{ mb: 4, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h3">
              {institution.institution_name}
            </Typography>
            {institution.status === 'failed' && (
              <Alert severity="error" sx={{ ml: 2 }}>
                Failed to retrieve data: {institution.error_message || 'Unknown error'}
              </Alert>
            )}
          </Box>

          {institution.status === 'succeeded' && institution.accounts.length > 0 && (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Name</TableCell>
                      <TableCell align="right">Mask</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="right">As of Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {institution.accounts.map((account, accIndex) => (
                      <TableRow key={accIndex}>
                        <TableCell>{account.name}</TableCell>
                        <TableCell align="right">{account.mask}</TableCell>
                        <TableCell align="right">${account.balance.toFixed(2)}</TableCell>
                        <TableCell align="right">{account.balance_as_of}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="subtitle1">
                  Institution Subtotal: ${institution.sub_total.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}

          {institution.status === 'succeeded' && institution.accounts.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No accounts or transactions found for this institution.
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default ReportView;
