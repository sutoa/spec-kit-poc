import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface FilterPanelProps {
  onApplyFilters: (filters: { itemIds: number[]; asOfDate: string }) => void;
  availableItemIds: number[]; // List of item IDs available to the user
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilters, availableItemIds }) => {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [asOfDate, setAsOfDate] = useState<Dayjs | null>(dayjs()); // Default to today

  const handleApplyFilters = () => {
    if (asOfDate) {
      onApplyFilters({
        itemIds: selectedItemIds.length > 0 ? selectedItemIds : availableItemIds, // If no specific items selected, use all
        asOfDate: asOfDate.format('YYYY-MM-DD'),
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        select
        label="Select Accounts"
        value={selectedItemIds}
        onChange={(e) => setSelectedItemIds(e.target.value as number[])}
        SelectProps={{
          multiple: true,
          renderValue: (selected) => (selected as number[]).join(', '),
        }}
        sx={{ minWidth: 200 }}
      >
        {availableItemIds.map((id) => (
          <MenuItem key={id} value={id}>
            Item ID: {id}
          </MenuItem>
        ))}
      </TextField>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="As of Date"
          value={asOfDate}
          onChange={(newValue) => setAsOfDate(newValue)}
          format="YYYY-MM-DD"
        />
      </LocalizationProvider>

      <Button variant="contained" onClick={handleApplyFilters}>
        Generate Report
      </Button>
    </Box>
  );
};

export default FilterPanel;
