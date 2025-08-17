export interface AnalyticsData {
    id: string;
    entityId: string;
    entityType: 'bar' | 'event' | 'user' | 'drink';
    metric: string;
    value: number;
    date: Date;
    metadata?: Record<string, any>;
}
export interface BarAnalytics {
    barId: string;
    period: AnalyticsPeriod;
    metrics: {
        totalVisits: number;
        uniqueVisitors: number;
        averageRating: number;
        totalReviews: number;
        totalEvents: number;
        totalDrinks: number;
        revenue: number;
        popularDrinks: PopularDrink[];
        peakHours: HourlyData[];
        visitorDemographics: DemographicsData;
    };
}
export interface EventAnalytics {
    eventId: string;
    period: AnalyticsPeriod;
    metrics: {
        totalRegistrations: number;
        totalAttendees: number;
        conversionRate: number;
        revenue: number;
        averageRating: number;
        totalReviews: number;
        socialShares: number;
        ticketSales: TicketSalesData[];
    };
}
export interface UserAnalytics {
    userId: string;
    period: AnalyticsPeriod;
    metrics: {
        totalVisits: number;
        totalReviews: number;
        totalEvents: number;
        totalCheckins: number;
        favoriteBars: string[];
        favoriteDrinks: string[];
        averageRating: number;
        activityTrend: DailyData[];
    };
}
export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';
export interface PopularDrink {
    drinkId: string;
    drinkName: string;
    orderCount: number;
    revenue: number;
}
export interface HourlyData {
    hour: number;
    value: number;
}
export interface DailyData {
    date: Date;
    value: number;
}
export interface DemographicsData {
    ageGroups: {
        '18-24': number;
        '25-34': number;
        '35-44': number;
        '45-54': number;
        '55+': number;
    };
    gender: {
        male: number;
        female: number;
        other: number;
    };
}
export interface TicketSalesData {
    date: Date;
    ticketsSold: number;
    revenue: number;
}
export interface DashboardMetrics {
    totalBars: number;
    totalUsers: number;
    totalEvents: number;
    totalRevenue: number;
    activeSubscriptions: number;
    monthlyGrowth: {
        users: number;
        revenue: number;
        events: number;
    };
}
//# sourceMappingURL=analytics.d.ts.map