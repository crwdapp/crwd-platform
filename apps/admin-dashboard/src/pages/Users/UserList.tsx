import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { AdminDataTable } from '../../components/DataTable/AdminDataTable';

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+40 712 345 678',
    city: 'Bucharest',
    status: 'Active',
    subscription: 'Premium',
    joinDate: '2023-06-15',
    lastVisit: '2024-01-15',
    totalVisits: 45,
    totalEvents: 12,
    totalTokens: 23,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Maria Smith',
    email: 'maria@example.com',
    phone: '+40 723 456 789',
    city: 'Cluj-Napoca',
    status: 'Active',
    subscription: 'Basic',
    joinDate: '2023-08-22',
    lastVisit: '2024-01-14',
    totalVisits: 38,
    totalEvents: 8,
    totalTokens: 18,
    rating: 4.6
  },
  {
    id: 3,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+40 734 567 890',
    city: 'Timisoara',
    status: 'Inactive',
    subscription: 'None',
    joinDate: '2023-05-10',
    lastVisit: '2023-12-20',
    totalVisits: 32,
    totalEvents: 6,
    totalTokens: 15,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Elena Popescu',
    email: 'elena@example.com',
    phone: '+40 745 678 901',
    city: 'Iasi',
    status: 'Active',
    subscription: 'Premium',
    joinDate: '2023-09-05',
    lastVisit: '2024-01-13',
    totalVisits: 28,
    totalEvents: 5,
    totalTokens: 12,
    rating: 4.5
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '+40 756 789 012',
    city: 'Constanta',
    status: 'Active',
    subscription: 'Basic',
    joinDate: '2023-11-12',
    lastVisit: '2024-01-12',
    totalVisits: 25,
    totalEvents: 4,
    totalTokens: 10,
    rating: 4.4
  }
];

const UserList: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: 'name' as keyof typeof mockUsers[0], header: 'Name' },
    { key: 'email' as keyof typeof mockUsers[0], header: 'Email' },
    { key: 'city' as keyof typeof mockUsers[0], header: 'City' },
    { key: 'status' as keyof typeof mockUsers[0], header: 'Status' },
    { key: 'subscription' as keyof typeof mockUsers[0], header: 'Subscription' },
    { key: 'joinDate' as keyof typeof mockUsers[0], header: 'Join Date' },
    { key: 'lastVisit' as keyof typeof mockUsers[0], header: 'Last Visit' },
    { key: 'totalVisits' as keyof typeof mockUsers[0], header: 'Total Visits' },
    { key: 'rating' as keyof typeof mockUsers[0], header: 'Rating' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSubscription = subscriptionFilter === 'all' || user.subscription.toLowerCase() === subscriptionFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const handleView = (user: any) => {
    console.log('View user:', user);
    // Navigate to user detail page
  };

  const handleEdit = (user: any) => {
    console.log('Edit user:', user);
    // Open edit modal or navigate to edit page
  };

  const handleDelete = (user: any) => {
    if (window.confirm(`Are you sure you want to delete "${user.name}"?`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const handleToggleStatus = (user: any) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and subscriptions</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
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
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={subscriptionFilter}
          onChange={(e) => setSubscriptionFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Subscriptions</option>
          <option value="premium">Premium</option>
          <option value="basic">Basic</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Users Table */}
      <AdminDataTable
        data={filteredUsers}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No users found"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'Active').length}
          </p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Premium Users</h3>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.subscription === 'Premium').length}
          </p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Avg Rating</h3>
          <p className="text-2xl font-bold text-blue-600">
            {(users.reduce((sum, u) => sum + u.rating, 0) / users.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
        <div className="space-y-3">
          {users.slice(0, 5).map((user) => (
            <div key={user.id} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Last visit: {user.lastVisit}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`p-1 rounded ${
                      user.status === 'Active' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {user.status === 'Active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleView(user)}
                    className="p-1 rounded text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
