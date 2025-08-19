export interface TokenRedemption {
  id: string;
  code: string;
  userInfo: string;
  drinkName: string;
  originalPrice: number;
  discountedPrice: number;
  tokenType: 'daily' | 'weekly';
  redeemedAt: string;
  status: 'pending' | 'redeemed' | 'expired';
}

export interface BarPartnerDashboardProps {
  barId: string;
  barName: string;
  bartenderId: string;
}

export interface DailyStats {
  tokensRedeemed: number;
  revenue: number;
  uniqueCustomers: number;
}