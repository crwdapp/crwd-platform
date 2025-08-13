import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { AdminDataTable } from '../../components/DataTable/AdminDataTable';

// Mock campaign data
const mockCampaigns = [
  {
    id: 1,
    name: 'Summer Drinks Campaign',
    barName: 'Control Club',
    type: 'Discount',
    discount: '25%',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'Active',
    tokensGenerated: 89,
    tokensRedeemed: 12,
    redemptionRate: '13.5%',
    revenue: 450.00
  },
  {
    id: 2,
    name: 'Happy Hour Special',
    barName: 'Kristal Glam Club',
    type: 'Free Drink',
    discount: '100%',
    startDate: '2024-05-15',
    endDate: '2024-07-15',
    status: 'Active',
    tokensGenerated: 67,
    tokensRedeemed: 8,
    redemptionRate: '11.9%',
    revenue: 320.00
  },
  {
    id: 3,
    name: 'Weekend Special',
    barName: 'Club A',
    type: 'Discount',
    discount: '30%',
    startDate: '2024-06-10',
    endDate: '2024-09-10',
    status: 'Active',
    tokensGenerated: 78,
    tokensRedeemed: 3,
    redemptionRate: '3.8%',
    revenue: 180.00
  },
  {
    id: 4,
    name: 'VIP Access Campaign',
    barName: 'Control Club',
    type: 'VIP Service',
    discount: '50%',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    status: 'Expired',
    tokensGenerated: 45,
    tokensRedeemed: 15,
    redemptionRate: '33.3%',
    revenue: 750.00
  }
];

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: 'name' as keyof typeof mockCampaigns[0], header: 'Campaign Name' },
    { key: 'barName' as keyof typeof mockCampaigns[0], header: 'Bar' },
    { key: 'type' as keyof typeof mockCampaigns[0], header: 'Type' },
    { key: 'discount' as keyof typeof mockCampaigns[0], header: 'Discount' },
    { key: 'startDate' as keyof typeof mockCampaigns[0], header: 'Start Date' },
    { key: 'endDate' as keyof typeof mockCampaigns[0], header: 'End Date' },
    { key: 'status' as keyof typeof mockCampaigns[0], header: 'Status' },
    { key: 'redemptionRate' as keyof typeof mockCampaigns[0], header: 'Redemption Rate' },
    { key: 'revenue' as keyof typeof mockCampaigns[0], header: 'Revenue' }
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.barName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleView = (campaign: any) => {
    console.log('View campaign:', campaign);
    // Navigate to campaign detail page
  };

  const handleEdit = (campaign: any) => {
    console.log('Edit campaign:', campaign);
    // Open edit modal or navigate to edit page
  };

  const handleDelete = (campaign: any) => {
    if (window.confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      setCampaigns(campaigns.filter(c => c.id !== campaign.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Manage marketing campaigns and promotions</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Campaigns Table */}
      <AdminDataTable
        data={filteredCampaigns}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No campaigns found"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Active Campaigns</h3>
          <p className="text-2xl font-bold text-green-600">
            {campaigns.filter(c => c.status === 'Active').length}
          </p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Tokens Generated</h3>
          <p className="text-2xl font-bold text-blue-600">
            {campaigns.reduce((sum, c) => sum + c.tokensGenerated, 0)}
          </p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignList;
