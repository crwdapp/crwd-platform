import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, DollarSign, Tag, Image, AlertCircle } from 'lucide-react';
import { EventCategory, EventStatus } from '../../types/event';
import { useAppStore } from '../../store';

interface EventCreateFormProps {
  onClose: () => void;
  onSuccess: () => void;
  barId: number;
  barName: string;
  barLocation: string;
  barLat: number;
  barLng: number;
  editingEvent?: any; // For editing existing events
}

export const EventCreateForm: React.FC<EventCreateFormProps> = ({
  onClose,
  onSuccess,
  barId,
  barName,
  barLocation,
  barLat,
  barLng,
  editingEvent
}) => {
  const { createEvent, updateEvent } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: editingEvent?.name || '',
    description: editingEvent?.description || '',
    date: editingEvent?.date || '',
    startTime: editingEvent?.startTime || '',
    endTime: editingEvent?.endTime || '',
    category: editingEvent?.category || EventCategory.PARTY,
    price: editingEvent?.price || 0,
    capacity: editingEvent?.capacity || 100,
    image: editingEvent?.image || '/src/assets/image.png',
    dj: editingEvent?.dj || '',
    genre: editingEvent?.genre || '',
    tags: editingEvent?.tags?.join(', ') || '',
    ageRestriction: editingEvent?.ageRestriction || '',
    dressCode: editingEvent?.dressCode || '',
    isTicketed: editingEvent?.isTicketed || false,
    ticketUrl: editingEvent?.ticketUrl || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    
    // Check if end time is after start time
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    // Check if date is not in the past
    if (formData.date) {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (formData.isTicketed && !formData.ticketUrl.trim()) {
      newErrors.ticketUrl = 'Ticket URL is required for ticketed events';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        barId,
        barName,
        barLocation,
        barLat,
        barLng,
        category: formData.category,
        price: formData.price,
        capacity: formData.capacity,
        image: formData.image,
        images: [formData.image],
        dj: formData.dj.trim() || undefined,
        genre: formData.genre.trim() || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        ageRestriction: formData.ageRestriction.trim() || undefined,
        dressCode: formData.dressCode.trim() || undefined,
        isTicketed: formData.isTicketed,
        ticketUrl: formData.isTicketed ? formData.ticketUrl.trim() : undefined,
        status: EventStatus.UPCOMING,
        socialMedia: {}
      };

      if (editingEvent) {
        updateEvent(editingEvent.id, eventData);
      } else {
        createEvent(eventData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating/updating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            <X size={24} className="text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar size={20} className="text-[#6FFFE9]" />
              Basic Information
            </h3>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Describe your event..."
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as EventCategory)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
              >
                {Object.values(EventCategory).map(category => (
                  <option key={category} value={category} className="bg-black text-white">
                    {category.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock size={20} className="text-[#6FFFE9]" />
              Date & Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                />
                {errors.date && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                />
                {errors.startTime && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.startTime}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                />
                {errors.endTime && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users size={20} className="text-[#6FFFE9]" />
              Pricing & Capacity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Entry Price ($)
                </label>
                <div className="relative">
                  <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/50 focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 100)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                  placeholder="100"
                />
                {errors.capacity && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Tag size={20} className="text-[#6FFFE9]" />
              Additional Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DJ */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  DJ/Performer
                </label>
                <input
                  type="text"
                  value={formData.dj}
                  onChange={(e) => handleInputChange('dj', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                  placeholder="DJ name or performer"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Music Genre
                </label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                  placeholder="e.g., House, Techno, Jazz"
                />
              </div>

              {/* Age Restriction */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Age Restriction
                </label>
                <select
                  value={formData.ageRestriction}
                  onChange={(e) => handleInputChange('ageRestriction', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                >
                  <option value="" className="bg-black text-white">No restriction</option>
                  <option value="18+" className="bg-black text-white">18+</option>
                  <option value="21+" className="bg-black text-white">21+</option>
                </select>
              </div>

              {/* Dress Code */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Dress Code
                </label>
                <select
                  value={formData.dressCode}
                  onChange={(e) => handleInputChange('dressCode', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                >
                  <option value="" className="bg-black text-white">No dress code</option>
                  <option value="Casual" className="bg-black text-white">Casual</option>
                  <option value="Smart Casual" className="bg-black text-white">Smart Casual</option>
                  <option value="Business Casual" className="bg-black text-white">Business Casual</option>
                  <option value="Formal" className="bg-black text-white">Formal</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                placeholder="nightlife, electronic, dance, party"
              />
            </div>
          </div>

          {/* Ticketing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Tag size={20} className="text-[#6FFFE9]" />
              Ticketing
            </h3>

            {/* Is Ticketed */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isTicketed"
                checked={formData.isTicketed}
                onChange={(e) => handleInputChange('isTicketed', e.target.checked)}
                className="w-5 h-5 bg-white/10 border border-white/20 rounded focus:ring-[#6FFFE9] focus:ring-2"
              />
              <label htmlFor="isTicketed" className="text-white/80">
                This event requires tickets
              </label>
            </div>

            {/* Ticket URL */}
            {formData.isTicketed && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Ticket Purchase URL *
                </label>
                <input
                  type="url"
                  value={formData.ticketUrl}
                  onChange={(e) => handleInputChange('ticketUrl', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-[#6FFFE9] focus:outline-none transition-colors duration-300"
                  placeholder="https://example.com/tickets"
                />
                {errors.ticketUrl && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.ticketUrl}
                  </p>
                )}
              </div>
            )}
          </div>


          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-[#6FFFE9] hover:bg-[#5BC0CE] text-black font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};