import React from 'react';
import { BarPartnerDashboard } from '../components/BarPartnerDashboard';

export const BarPartnerDashboardPage: React.FC = () => {
  return (
    <BarPartnerDashboard
      barId="1"
      barName="Control Club"
      bartenderId="bartender_123"
    />
  );
};