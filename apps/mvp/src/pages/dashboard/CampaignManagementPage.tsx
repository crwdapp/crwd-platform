import React, { useState } from 'react';
import { Calendar, Plus, Save, Trash2, Wine, Clock, Users, Upload, X, Check } from 'lucide-react';
import { getBarRepository } from '../../core/DependencyContainer';
import { allBars } from '../../data/barsData';

export const CampaignManagementPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  
  // Get Control Club data and initialize campaign drinks from actual bar data
  const controlClub = allBars.find(bar => bar.id === 1);
  const [campaignDrinks, setCampaignDrinks] = useState(() => {
    return (controlClub?.availableDrinksMenu || []).map(drink => ({
      id: drink.id,
      name: drink.name,
      quantity: Math.floor(Math.random() * 20) + 10, // Random quantity between 10-30
      category: drink.category,
      originalPrice: drink.originalPrice || '50 RON'
    }));
  });

  // Available drinks that can be added to campaign
  const availableDrinks = [
    { id: 4, name: 'Craft Beer', category: 'Beer', originalPrice: '55 RON' },
    { id: 5, name: 'Premium Wine', category: 'Wine', originalPrice: '95 RON' },
    { id: 6, name: 'House Shot', category: 'Shots', originalPrice: '25 RON' },
    { id: 7, name: 'Energy Drink Mix', category: 'Cocktail', originalPrice: '65 RON' },
  ];

  const [showAddDrink, setShowAddDrink] = useState(false);
  const [showDrinkForm, setShowDrinkForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: null as File | null,
    photoPreview: '',
    price: '',
    category: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Calculate total drinks in campaign
  const totalDrinks = campaignDrinks.reduce((sum, drink) => sum + drink.quantity, 0);

  // Drink categories for dropdown
  const drinkCategories = [
    'Beer',
    'Wine',
    'Cocktail',
    'Shots',
    'Spirits',
    'Non-Alcoholic',
    'Coffee',
    'Other'
  ];

  const updateDrinkQuantity = (id: number, quantity: number) => {
    setCampaignDrinks(prev => 
      prev.map(drink => 
        drink.id === id ? { ...drink, quantity: Math.max(0, quantity) } : drink
      )
    );
  };

  const removeDrink = (id: number) => {
    setCampaignDrinks(prev => prev.filter(drink => drink.id !== id));
  };

  const addDrink = (drink: any) => {
    setCampaignDrinks(prev => [...prev, { ...drink, quantity: 5 }]);
    setShowAddDrink(false);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, photo: 'Image size must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      // Clear photo error
      if (formErrors.photo) {
        setFormErrors(prev => ({ ...prev, photo: '' }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Drink name is required';
    }
    
    if (!formData.photo) {
      errors.photo = 'Photo is required';
    }
    
    if (!formData.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Please enter a valid price';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new drink object
      const newDrink = {
        id: Date.now(), // In real app, this would come from the API
        name: formData.name,
        category: formData.category,
        originalPrice: `${formData.price} RON`,
        description: formData.description,
        image: formData.photoPreview, // In real app, this would be uploaded to storage
        quantity: 5 // Default quantity
      };
      
      // Add to campaign
      setCampaignDrinks(prev => [...prev, newDrink]);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          name: '',
          photo: null,
          photoPreview: '',
          price: '',
          category: '',
          description: ''
        });
        setShowDrinkForm(false);
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (error) {
      setFormErrors({ submit: 'Failed to add drink. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when closing
  const handleCloseForm = () => {
    setShowDrinkForm(false);
    setFormData({
      name: '',
      photo: null,
      photoPreview: '',
      price: '',
      category: '',
      description: ''
    });
    setFormErrors({});
    setSubmitSuccess(false);
  };
  const totalDrinksOffered = campaignDrinks.reduce((sum, drink) => sum + drink.quantity, 0);

  const updateBarCampaign = async () => {
    setLoading(true);
    try {
      const barRepository = getBarRepository();
      const controlClubBar = await barRepository.findById(1);
      
      if (controlClubBar) {
        const updatedBar = {
          ...controlClubBar,
          availableDrinksMenu: campaignDrinks,
          availableDrinks: totalDrinksOffered,
          lastUpdated: new Date().toISOString()
        };
        
        await barRepository.update(1, updatedBar);
      }
    } catch (error) {
      console.error('Failed to update bar campaign:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveCampaign = async () => {
    try {
      await updateBarCampaign();
      alert('Campaign saved successfully!');
    } catch (error) {
      console.error('Failed to save campaign:', error);
      alert('Failed to save campaign. Please try again.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
        <div className="white-card rounded-xl p-4 lg:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Campaign Management</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Set up your daily token campaigns and manage drink offerings.</p>
        </div>
        <button
          onClick={saveCampaign}
          className="white-button-primary px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center justify-center space-x-2 min-h-[44px]"
        >
          <Save size={20} />
          <span>Save Campaign</span>
        </button>
      </div>

      {/* Campaign Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Date Selection */}
        <div className="white-card rounded-xl p-4 lg:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="text-cyan-600" size={24} />
            <h2 className="text-base lg:text-lg font-semibold">Campaign Date</h2>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[44px]"
          />
          <p className="text-xs lg:text-sm text-gray-600 mt-2">
            Select the date for this campaign
          </p>
        </div>

        {/* Total Drinks */}
        <div className="white-card rounded-xl p-4 lg:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Wine className="text-cyan-500" size={24} />
            <h2 className="text-base lg:text-lg font-semibold">Total Drinks</h2>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-4xl font-bold text-cyan-600 mb-2">
              {totalDrinks}
            </div>
            <p className="text-xs lg:text-sm text-gray-600">
              Total drinks in campaign
            </p>
          </div>
        </div>

      </div>

      {/* Drinks Management */}
      <div className="white-card rounded-xl p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
          <h2 className="text-base lg:text-lg font-semibold">Campaign Drinks</h2>
          <button
            onClick={() => setShowDrinkForm(true)}
            className="white-button-secondary rounded-lg px-3 lg:px-4 py-2 transition-all duration-300 flex items-center justify-center space-x-2 min-h-[44px]"
          >
            <Plus size={18} />
            <span>Add a Drink</span>
          </button>
        </div>

        {/* Current Campaign Drinks */}
        <div className="space-y-4">
          {campaignDrinks.map((drink) => (
            <div key={drink.id} className="white-card-secondary rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-sm lg:text-base">{drink.name}</h3>
                    <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full text-xs">
                      {drink.category}
                    </span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600">Value: {drink.originalPrice}</p>
                </div>
                
                <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="flex items-center space-x-2 lg:space-x-4 mx-auto sm:mx-0">
                  {/* Circular Quantity Input */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => updateDrinkQuantity(drink.id, drink.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-semibold text-sm">
                      {drink.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => updateDrinkQuantity(drink.id, drink.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  </div>
                  
                  <button
                    onClick={() => removeDrink(drink.id)}
                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {campaignDrinks.length === 0 && (
          <div className="text-center py-8">
            <Wine className="mx-auto mb-4 text-gray-400" size={36} />
            <h3 className="text-base lg:text-lg font-semibold mb-2">No drinks added yet</h3>
            <p className="text-gray-600 mb-4 text-sm lg:text-base">Add drinks to your campaign to get started</p>
            <button
              onClick={() => setShowAddDrink(true)}
              className="white-button-primary px-4 lg:px-6 py-2 rounded-lg min-h-[44px]"
            >
              Add Your First Drink
            </button>
          </div>
        )}
      </div>

      {/* Add Drink Form Modal */}
      {showDrinkForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto safe-area-inset shadow-2xl border border-gray-200">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-semibold">Add New Drink</h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X size={24} />
                </button>
              </div>

              {submitSuccess && (
                <div className="mb-4 lg:mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Check className="text-green-600" size={20} />
                    <span className="text-green-700 font-medium">Drink added successfully!</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 lg:space-y-6">
                {/* Drink Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Drink Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                      formErrors.name 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-gray-300 focus:ring-cyan-500'
                    } min-h-[44px]`}
                    placeholder="Enter drink name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Photo <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-3">
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      formErrors.photo 
                        ? 'border-red-400' 
                        : 'border-gray-300 hover:border-cyan-500'
                    } min-h-[120px] flex flex-col items-center justify-center`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                        <p className="text-gray-600 text-sm lg:text-base">Click to upload photo</p>
                        <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                      </label>
                    </div>
                    
                    {formData.photoPreview && (
                      <div className="relative">
                        <img 
                          src={formData.photoPreview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, photo: null, photoPreview: '' }))}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {formErrors.photo && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.photo}</p>
                  )}
                </div>

                {/* Price and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (RON) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                        formErrors.price 
                          ? 'border-red-400 focus:ring-red-400' 
                          : 'border-gray-300 focus:ring-cyan-500'
                      } min-h-[44px]`}
                      placeholder="0.00"
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                        formErrors.category 
                          ? 'border-red-400 focus:ring-red-400' 
                          : 'border-gray-300 focus:ring-cyan-500'
                      } min-h-[44px]`}
                    >
                      <option value="">Select category</option>
                      {drinkCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 resize-none ${
                      formErrors.description 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-gray-300 focus:ring-cyan-500'
                    } min-h-[88px]`}
                    placeholder="Describe the drink..."
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* Form Error */}
                {formErrors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{formErrors.submit}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 white-button-secondary rounded-lg py-3 min-h-[44px]"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className="flex-1 white-button-primary rounded-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding Drink...</span>
                      </>
                    ) : submitSuccess ? (
                      <>
                        <Check size={16} />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Add Drink</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Drink Modal */}
      {showAddDrink && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-base lg:text-lg font-semibold">Add Drink to Campaign</h3>
              <button
                onClick={() => setShowAddDrink(false)}
                className="text-gray-500 hover:text-gray-700 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              {availableDrinks.filter(drink => 
                !campaignDrinks.some(cd => cd.id === drink.id)
              ).map((drink) => (
                <button
                  key={drink.id}
                  onClick={() => addDrink(drink)}
                  className="w-full white-card-secondary white-hover rounded-lg p-3 lg:p-4 text-left transition-all duration-300 min-h-[60px]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm lg:text-base">{drink.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full text-xs">
                          {drink.category}
                        </span>
                        <span className="text-xs lg:text-sm text-gray-600">{drink.originalPrice}</span>
                      </div>
                    </div>
                    <Plus className="text-cyan-500" size={20} />
                  </div>
                </button>
              ))}
            </div>
            
            {availableDrinks.filter(drink => 
              !campaignDrinks.some(cd => cd.id === drink.id)
            ).length === 0 && (
              <p className="text-center text-gray-600 py-4 text-sm lg:text-base">
                All available drinks have been added to the campaign.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Campaign Preview */}
      <div className="white-card rounded-xl p-4 lg:p-6">
        <h2 className="text-base lg:text-lg font-semibold mb-4">Campaign Preview</h2>
        <div className="white-card-secondary rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div>
              <h3 className="font-semibold text-sm lg:text-base">Daily Campaign - {selectedDate}</h3>
              <p className="text-xs lg:text-sm text-gray-600">Control Club</p>
            </div>
            <div className="text-right">
              <p className="text-xl lg:text-2xl font-bold text-cyan-600">{totalDrinksOffered}</p>
              <p className="text-xs lg:text-sm text-gray-600">drinks available</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs lg:text-sm">
            <div>
              <span className="text-gray-600">Drink Types:</span>
              <span className="ml-2 font-medium">{campaignDrinks.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};