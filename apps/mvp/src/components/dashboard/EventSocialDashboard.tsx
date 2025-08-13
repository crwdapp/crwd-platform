import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Share2, 
  Eye, 
  Bell, 
  Send,
  ThumbsUp,
  Image,
  Pin,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Event, EventComment, EventUpdate } from '../../types/event';

interface EventSocialDashboardProps {
  event: Event;
  onUpdateEvent: (updates: Partial<Event>) => void;
}

export const EventSocialDashboard: React.FC<EventSocialDashboardProps> = ({ 
  event, 
  onUpdateEvent 
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'comments' | 'updates'>('insights');
  const [newUpdate, setNewUpdate] = useState('');
  const [updateType, setUpdateType] = useState<'announcement' | 'reminder' | 'change'>('announcement');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [newReply, setNewReply] = useState('');

  // Mock data for demonstration
  const mockComments: EventComment[] = [
    {
      id: 1,
      eventId: event.id,
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: '/src/assets/image.png',
      content: 'This looks amazing! What time does the music start?',
      timestamp: '2 hours ago',
      likes: 3,
      isLikedByUser: false
    },
    {
      id: 2,
      eventId: event.id,
      userId: 'user2',
      userName: 'Mike Chen',
      userAvatar: '/src/assets/image.png',
      content: 'Is there parking available? Coming with a group of 6.',
      timestamp: '4 hours ago',
      likes: 1,
      isLikedByUser: false
    }
  ];

  const mockUpdates: EventUpdate[] = [
    {
      id: 1,
      eventId: event.id,
      title: 'Special Guest DJ Announced!',
      content: 'We\'re excited to announce that Marcus Rivera will be joining our lineup as a special guest DJ! Get ready for an incredible night.',
      timestamp: '1 day ago',
      isFromHost: true,
      type: 'announcement'
    },
    {
      id: 2,
      eventId: event.id,
      title: 'Event Reminder',
      content: 'Don\'t forget - doors open at 9 PM! Come early to avoid queues and enjoy our pre-event happy hour.',
      timestamp: '2 days ago',
      isFromHost: true,
      type: 'reminder'
    }
  ];

  const handlePostUpdate = () => {
    if (!newUpdate.trim()) return;
    
    const update: EventUpdate = {
      id: Date.now(),
      eventId: event.id,
      title: updateType === 'announcement' ? 'New Announcement' : 
             updateType === 'reminder' ? 'Event Reminder' : 'Event Update',
      content: newUpdate,
      timestamp: 'Just now',
      isFromHost: true,
      type: updateType
    };
    
    // Here you would typically send this to your backend
    console.log('New update:', update);
    setNewUpdate('');
  };

  const handleReplyToComment = (commentId: number) => {
    setReplyTo(commentId);
  };

  const handlePostReply = () => {
    if (!newReply.trim() || !replyTo) return;
    
    // Here you would typically send this to your backend
    console.log('New reply to comment', replyTo, ':', newReply);
    setNewReply('');
    setReplyTo(null);
  };

  const engagementRate = ((event.goingCount + event.interestedCount) / event.views * 100);
  const sharingRate = (event.shares / event.views * 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Event Social Dashboard</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{event.name}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { key: 'insights', label: 'Insights', icon: BarChart3 },
            { key: 'comments', label: 'Comments', icon: MessageCircle, count: mockComments.length },
            { key: 'updates', label: 'Updates', icon: Bell, count: mockUpdates.length }
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              {count !== undefined && (
                <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="h-96 overflow-y-auto">
        {activeTab === 'insights' && (
          <div className="p-4 space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Eye size={20} className="text-gray-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{event.views}</div>
                <div className="text-xs text-gray-600">Views</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Users size={20} className="text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{event.goingCount}</div>
                <div className="text-xs text-gray-600">Going</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Share2 size={20} className="text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{event.shares}</div>
                <div className="text-xs text-gray-600">Shares</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <TrendingUp size={20} className="text-purple-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{engagementRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-600">Engagement</div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Performance Insights</h4>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="font-medium text-green-800">High Engagement</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your event has {engagementRate.toFixed(1)}% engagement rate - above average!
                </p>
              </div>

              {event.shares > 50 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Share2 size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-800">Viral Potential</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {event.shares} shares indicate strong viral potential. Consider boosting this event.
                  </p>
                </div>
              )}

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-800">Capacity Status</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {((event.goingCount / event.capacity) * 100).toFixed(0)}% capacity filled 
                  ({event.capacity - event.goingCount} spots remaining)
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors text-sm font-medium">
                  Boost Event
                </button>
                <button 
                  onClick={() => setActiveTab('updates')}
                  className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  Post Update
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="p-4 space-y-4">
            {/* Comments List */}
            <div className="space-y-4">
              {mockComments.map(comment => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <img 
                      src={comment.userAvatar} 
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">{comment.userName}</span>
                        <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                      
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-xs">
                          <ThumbsUp size={12} />
                          <span>{comment.likes}</span>
                        </button>
                        <button 
                          onClick={() => handleReplyToComment(comment.id)}
                          className="text-cyan-600 hover:text-cyan-700 text-xs font-medium"
                        >
                          Reply as Host
                        </button>
                      </div>

                      {/* Reply Form */}
                      {replyTo === comment.id && (
                        <div className="mt-3 p-2 bg-gray-50 rounded border">
                          <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Reply as the event host..."
                            className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handlePostReply}
                              disabled={!newReply.trim()}
                              className="px-3 py-1 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700 disabled:opacity-50"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => setReplyTo(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mockComments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No comments yet. Engage with your attendees!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="p-4 space-y-4">
            {/* Create Update Form */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Post Update to Attendees</h4>
              
              <div className="space-y-3">
                <select
                  value={updateType}
                  onChange={(e) => setUpdateType(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="announcement">Announcement</option>
                  <option value="reminder">Reminder</option>
                  <option value="change">Event Change</option>
                </select>
                
                <textarea
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  placeholder="What would you like to tell your attendees?"
                  className="w-full p-3 border border-gray-300 rounded text-sm resize-none"
                  rows={3}
                />
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePostUpdate}
                    disabled={!newUpdate.trim()}
                    className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-cyan-700 disabled:opacity-50"
                  >
                    <Send size={14} />
                    Post Update
                  </button>
                  
                  <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300">
                    <Image size={14} />
                    Add Photo
                  </button>
                  
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded" />
                    Pin this update
                  </label>
                </div>
              </div>
            </div>

            {/* Updates List */}
            <div className="space-y-3">
              {mockUpdates.map(update => (
                <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          update.type === 'announcement' ? 'bg-blue-100 text-blue-700' :
                          update.type === 'reminder' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {update.type.toUpperCase()}
                        </span>
                        <span className="text-gray-500 text-xs">{update.timestamp}</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-1">{update.title}</h5>
                      <p className="text-gray-700 text-sm">{update.content}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Pin size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};