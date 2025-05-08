// src/features/admin/components/dashboard/SalesChart.js
import React from 'react';
import { Box } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          p: 2,
          borderRadius: 1,
        }}
      >
        <p style={{ margin: 0 }}>{`${label}`}</p>
        <p style={{ margin: 0, color: '#3498db' }}>{`المبيعات: ${payload[0].value} ج.م`}</p>
        <p style={{ margin: 0, color: '#2ecc71' }}>{`الطلبات: ${payload[1].value}`}</p>
      </Box>
    );
  }

  return null;
};

const SalesChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        لا توجد بيانات كافية لعرض المخطط
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            name="المبيعات"
            stroke="#3498db"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            name="الطلبات"
            stroke="#2ecc71"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SalesChart;