import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, Grid, List, MapPin, Clock, Users, Star, X, Save, Camera, Download } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { AdminDataTable } from '../../components/DataTable/AdminDataTable';
import { Bar } from '../../types/bar';
import { dataManager } from '../../utils/dataManager';

interface BarFormData {
  id?: number;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  image: string;
  location: string;
  availableDrinks: number;
  isOpen: boolean;
  tags: string[];
  openUntil: string;
  crowdLevel: string;
  filters: string[];
  description: string;
  address: string;
  phone: string;
  priceRange: string;
  images: string[];
  hours: Record<string, string>;
  events: Array<{
    id: number;
    name: string;
    date: string;
    dj: string;
    image?: string;
  }>;
  availableDrinksMenu: Array<{
    id: number;
    name: string;
    description: string;
    category: string;
    image?: string;
    alcoholContent?: string;
    volume?: string;
    originalPrice?: string;
  }>;
}

const BarList: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<BarFormData>({
    name: '',
    type: '',
    rating: 0,
    reviews: 0,
    lat: 0,
    lng: 0,
    image: '',
    location: '',
    availableDrinks: 0,
    isOpen: true,
    tags: [],
    openUntil: '',
    crowdLevel: 'Medium',
    filters: [],
    description: '',
    address: '',
    phone: '',
    priceRange: '$$',
    images: [],
    hours: {
      'Monday': 'Closed',
      'Tuesday': 'Closed',
      'Wednesday': '10:00 PM - 3:00 AM',
      'Thursday': '10:00 PM - 3:00 AM',
      'Friday': '10:00 PM - 4:00 AM',
      'Saturday': '10:00 PM - 4:00 AM',
      'Sunday': '10:00 PM - 2:00 AM',
    },
    events: [],
    availableDrinksMenu: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    // Initialize data manager and load data
    const initializeData = async () => {
      setLoading(true);
      try {
        await dataManager.initializeData();
        dataManager.loadFromLocalStorage(); // Load any saved changes
        setBars(dataManager.getBars());
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const columns = [
    { key: 'name' as keyof Bar, header: 'Bar Name' },
    { key: 'type' as keyof Bar, header: 'Type' },
    { key: 'rating' as keyof Bar, header: 'Rating' },
    { key: 'location' as keyof Bar, header: 'Location' },
    { key: 'isOpen' as keyof Bar, header: 'Status' },
    { key: 'crowdLevel' as keyof Bar, header: 'Crowd Level' },
    { key: 'availableDrinks' as keyof Bar, header: 'Drinks Available' }
  ];

  const filteredBars = bars.filter(bar => {
    const matchesSearch = bar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bar.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bar.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'open' && bar.isOpen) ||
                         (statusFilter === 'closed' && !bar.isOpen);
    return matchesSearch && matchesStatus;
  });

  const handleView = (bar: Bar) => {
    setSelectedBar(bar);
    // You can add a view modal here if needed
    console.log('View bar:', bar);
  };

  const handleEdit = (bar: Bar) => {
    setSelectedBar(bar);
    setFormData({
      id: bar.id,
      name: bar.name,
      type: bar.type,
      rating: bar.rating,
      reviews: bar.reviews,
      lat: bar.lat,
      lng: bar.lng,
      image: bar.image,
      location: bar.location,
      availableDrinks: bar.availableDrinks,
      isOpen: bar.isOpen,
      tags: [...bar.tags],
      openUntil: bar.openUntil,
      crowdLevel: bar.crowdLevel,
      filters: [...bar.filters],
      description: bar.description,
      address: bar.address,
      phone: bar.phone,
      priceRange: bar.priceRange,
      images: [...bar.images],
      hours: { ...bar.hours },
      events: [...bar.events],
      availableDrinksMenu: [...bar.availableDrinksMenu]
    });
    setShowEditModal(true);
  };

  const handleDelete = (bar: Bar) => {
    setSelectedBar(bar);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedBar) {
      setLoading(true);
      try {
        const success = await dataManager.deleteBar(selectedBar.id);
        if (success) {
          setBars(dataManager.getBars());
          setShowDeleteModal(false);
          setSelectedBar(null);
        } else {
          alert('Failed to delete bar');
        }
      } catch (error) {
        console.error('Error deleting bar:', error);
        alert('Error deleting bar');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddBar = () => {
    setFormData({
      name: '',
      type: '',
      rating: 0,
      reviews: 0,
      lat: 0,
      lng: 0,
      image: '',
      location: '',
      availableDrinks: 0,
      isOpen: true,
      tags: [],
      openUntil: '',
      crowdLevel: 'Medium',
      filters: [],
      description: '',
      address: '',
      phone: '',
      priceRange: '$$',
      images: [],
      hours: {
        'Monday': 'Closed',
        'Tuesday': 'Closed',
        'Wednesday': '10:00 PM - 3:00 AM',
        'Thursday': '10:00 PM - 3:00 AM',
        'Friday': '10:00 PM - 4:00 AM',
        'Saturday': '10:00 PM - 4:00 AM',
        'Sunday': '10:00 PM - 2:00 AM',
      },
      events: [],
      availableDrinksMenu: []
    });
    setShowAddModal(true);
  };

  const handleSaveBar = async () => {
    setLoading(true);
    try {
      if (showAddModal) {
        // Add new bar
        const { id, ...barDataWithoutId } = formData;
        const newBar = await dataManager.addBar(barDataWithoutId);
        setBars(dataManager.getBars());
        setShowAddModal(false);
        console.log('New bar created:', newBar);
      } else if (showEditModal && selectedBar) {
        // Update existing bar
        const { id, ...barDataWithoutId } = formData;
        const updatedBar = await dataManager.updateBar(selectedBar.id, barDataWithoutId);
        if (updatedBar) {
          setBars(dataManager.getBars());
          setShowEditModal(false);
          setSelectedBar(null);
          console.log('Bar updated:', updatedBar);
        } else {
          alert('Failed to update bar');
        }
      }
    } catch (error) {
      console.error('Error saving bar:', error);
      alert('Error saving bar');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const exportBarsData = () => {
    const dataStr = dataManager.exportBarsData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bars-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const BarCard: React.FC<{ bar: Bar }> = ({ bar }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="relative">
        <img 
          src={bar.image} 
          alt={bar.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            bar.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {bar.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            bar.crowdLevel === 'High' ? 'bg-red-100 text-red-800' :
            bar.crowdLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {bar.crowdLevel} Crowd
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{bar.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{bar.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{bar.type}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{bar.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{bar.openUntil}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{bar.availableDrinks} drinks</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {bar.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {bar.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{bar.tags.length - 2}
              </span>
            )}
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => handleView(bar)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(bar)}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(bar)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ 
    isOpen, onClose, title, children 
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bars Management</h1>
          <p className="text-gray-600">Complete control over bars and venues - Changes are persistent</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              localStorage.removeItem('barsData');
              window.location.reload();
            }}
            className="btn-secondary flex items-center space-x-2"
            title="Reset to real data (17 bars)"
          >
            <Download className="w-4 h-4" />
            <span>Reset to Real Data (17 bars)</span>
          </button>
          <button 
            onClick={exportBarsData}
            className="btn-secondary flex items-center space-x-2"
            title="Export bars data"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handleAddBar}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bar</span>
          </button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bars..."
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
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-2 ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Saving changes...</span>
        </div>
      )}

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBars.map((bar) => (
            <BarCard key={bar.id} bar={bar} />
          ))}
        </div>
      ) : (
        <AdminDataTable
          data={filteredBars}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage="No bars found"
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Bars</h3>
          <p className="text-2xl font-bold text-gray-900">{bars.length}</p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Open Bars</h3>
          <p className="text-2xl font-bold text-green-600">
            {bars.filter(b => b.isOpen).length}
          </p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Drinks</h3>
          <p className="text-2xl font-bold text-blue-600">
            {bars.reduce((sum, b) => sum + b.availableDrinks, 0)}
          </p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Avg Rating</h3>
          <p className="text-2xl font-bold text-purple-600">
            {bars.length > 0 ? (bars.reduce((sum, b) => sum + b.rating, 0) / bars.length).toFixed(1) : '0.0'}
          </p>
        </div>
      </div>

      {/* Add/Edit Bar Modal */}
      <Modal 
        isOpen={showAddModal || showEditModal} 
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedBar(null);
        }}
        title={showAddModal ? 'Add New Bar' : 'Edit Bar'}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bar Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter bar name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="Nightclub">Nightclub</option>
                  <option value="Bar">Bar</option>
                  <option value="Pub">Pub</option>
                  <option value="Lounge">Lounge</option>
                  <option value="Restaurant">Restaurant</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({...formData, reviews: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., BUCHAREST"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>
            </div>

            {/* Status & Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status & Settings</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isOpen"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData({...formData, isOpen: e.target.checked})}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isOpen" className="text-sm font-medium text-gray-700">Currently Open</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Open Until</label>
                <input
                  type="text"
                  value={formData.openUntil}
                  onChange={(e) => setFormData({...formData, openUntil: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3:00 AM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crowd Level</label>
                <select
                  value={formData.crowdLevel}
                  onChange={(e) => setFormData({...formData, crowdLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Drinks</label>
                <input
                  type="number"
                  min="0"
                  value={formData.availableDrinks}
                  onChange={(e) => setFormData({...formData, availableDrinks: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  value={formData.priceRange}
                  onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="$">$ (Budget)</option>
                  <option value="$$">$$ (Moderate)</option>
                  <option value="$$$">$$$ (Expensive)</option>
                  <option value="$$$$">$$$$ (Luxury)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the bar..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1">
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedBar(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBar}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : (showAddModal ? 'Create Bar' : 'Update Bar')}</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBar(null);
        }}
        title="Delete Bar"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedBar?.name}</strong>? This action cannot be undone and will permanently remove the bar from the system.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedBar(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Delete Bar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BarList;
