import React, { useState } from 'react';
import { Clock, AlertTriangle, Users, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';

interface QueueItem {
  id: string;
  tokenCode: string;
  estimatedTime: number;
  drinkType: string;
}

interface InventoryAlert {
  id: string;
  item: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical';
}

interface OperationalDashboardProps {
  queue?: QueueItem[];
  inventoryAlerts?: InventoryAlert[];
  peakHoursPrediction?: { hour: string; expectedCustomers: number }[];
  isBarOpen?: boolean;
  onToggleBarStatus?: (isOpen: boolean) => void;
  onTogglePromotions?: (enabled: boolean) => void;
  promotionsEnabled?: boolean;
}

export const OperationalDashboard: React.FC<OperationalDashboardProps> = ({
  queue = [],
  inventoryAlerts = [],
  peakHoursPrediction = [],
  isBarOpen = true,
  onToggleBarStatus,
  onTogglePromotions,
  promotionsEnabled = true
}) => {
  const [selectedStaffShift, setSelectedStaffShift] = useState('current');

  const mockQueue: QueueItem[] = queue.length > 0 ? queue : [
    { id: '1', tokenCode: 'AB5C7', estimatedTime: 2, drinkType: 'House Beer' },
    { id: '2', tokenCode: 'X9K2L', estimatedTime: 5, drinkType: 'Signature Cocktail' },
    { id: '3', tokenCode: 'P4M8N', estimatedTime: 3, drinkType: 'House Wine' }
  ];

  const mockInventoryAlerts: InventoryAlert[] = inventoryAlerts.length > 0 ? inventoryAlerts : [
    { id: '1', item: 'Premium Vodka', currentStock: 2, threshold: 5, severity: 'critical' },
    { id: '2', item: 'House Beer', currentStock: 8, threshold: 10, severity: 'low' }
  ];

  const mockPeakHours = peakHoursPrediction.length > 0 ? peakHoursPrediction : [
    { hour: '20:00', expectedCustomers: 45 },
    { hour: '21:00', expectedCustomers: 67 },
    { hour: '22:00', expectedCustomers: 89 },
    { hour: '23:00', expectedCustomers: 102 },
    { hour: '00:00', expectedCustomers: 95 }
  ];

  const staffSchedule = {
    current: [
      { name: 'Alex', role: 'Bartender', shift: '18:00-02:00', status: 'active' },
      { name: 'Sarah', role: 'Server', shift: '19:00-01:00', status: 'active' }
    ],
    recommended: [
      { name: 'Alex', role: 'Bartender', shift: '18:00-02:00', status: 'scheduled' },
      { name: 'Sarah', role: 'Server', shift: '19:00-01:00', status: 'scheduled' },
      { name: 'Mike', role: 'Bartender', shift: '21:00-03:00', status: 'needed' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* One-Tap Actions */}
      <div className="white-card p-4 lg:p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ToggleLeft className="mr-2 text-cyan-600" size={20} />
          Quick Controls
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onToggleBarStatus?.(!isBarOpen)}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
              isBarOpen 
                ? 'bg-green-50 border-2 border-green-200 text-green-700' 
                : 'bg-red-50 border-2 border-red-200 text-red-700'
            }`}
          >
            <span className="font-medium">Bar Status</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{isBarOpen ? 'Open' : 'Closed'}</span>
              {isBarOpen ? (
                <ToggleRight className="text-green-600" size={20} />
              ) : (
                <ToggleLeft className="text-red-600" size={20} />
              )}
            </div>
          </button>

          <button
            onClick={() => onTogglePromotions?.(!promotionsEnabled)}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
              promotionsEnabled 
                ? 'bg-cyan-50 border-2 border-cyan-200 text-cyan-700' 
                : 'bg-gray-50 border-2 border-gray-200 text-gray-700'
            }`}
          >
            <span className="font-medium">Promotions</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{promotionsEnabled ? 'Active' : 'Paused'}</span>
              {promotionsEnabled ? (
                <ToggleRight className="text-cyan-600" size={20} />
              ) : (
                <ToggleLeft className="text-gray-600" size={20} />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Queue Management */}
      <div className="white-card p-4 lg:p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="mr-2 text-cyan-600" size={20} />
          Token Queue ({mockQueue.length} pending)
        </h3>
        
        <div className="space-y-3">
          {mockQueue.map((item) => (
            <div key={item.id} className="flex items-center justify-between white-card-secondary rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-700 font-mono text-sm">{item.tokenCode}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{item.drinkType}</p>
                  <p className="text-xs text-gray-500">Token: {item.tokenCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-cyan-600">~{item.estimatedTime} min</p>
                <p className="text-xs text-gray-500">Est. wait</p>
              </div>
            </div>
          ))}
          
          {mockQueue.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p>No pending redemptions</p>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className="white-card p-4 lg:p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-yellow-600" size={20} />
          Inventory Alerts ({mockInventoryAlerts.length})
        </h3>
        
        <div className="space-y-3">
          {mockInventoryAlerts.map((alert) => (
            <div key={alert.id} className={`flex items-center justify-between rounded-lg p-3 ${
              alert.severity === 'critical' 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center space-x-3">
                <AlertTriangle 
                  size={20} 
                  className={alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'} 
                />
                <div>
                  <p className="font-medium text-sm">{alert.item}</p>
                  <p className="text-xs text-gray-600">
                    {alert.currentStock} remaining (threshold: {alert.threshold})
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                alert.severity === 'critical' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {alert.severity === 'critical' ? 'CRITICAL' : 'LOW'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours Prediction */}
      <div className="white-card p-4 lg:p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="mr-2 text-purple-600" size={20} />
          Peak Hours Prediction
        </h3>
        
        <div className="grid grid-cols-5 gap-2 lg:gap-4">
          {mockPeakHours.map((hour) => (
            <div key={hour.hour} className="text-center">
              <div className={`p-2 lg:p-3 rounded-lg mb-2 ${
                hour.expectedCustomers > 80 
                  ? 'bg-red-100 text-red-700' 
                  : hour.expectedCustomers > 50 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                <p className="text-lg lg:text-xl font-bold">{hour.expectedCustomers}</p>
                <p className="text-xs">customers</p>
              </div>
              <p className="text-xs text-gray-600">{hour.hour}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Scheduling */}
      <div className="white-card p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="mr-2 text-green-600" size={20} />
            Staff Schedule
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedStaffShift('current')}
              className={`px-3 py-1 rounded text-sm ${
                selectedStaffShift === 'current' 
                  ? 'bg-cyan-100 text-cyan-700' 
                  : 'text-gray-600'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setSelectedStaffShift('recommended')}
              className={`px-3 py-1 rounded text-sm ${
                selectedStaffShift === 'recommended' 
                  ? 'bg-cyan-100 text-cyan-700' 
                  : 'text-gray-600'
              }`}
            >
              Recommended
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {staffSchedule[selectedStaffShift as keyof typeof staffSchedule].map((staff, index) => (
            <div key={index} className="flex items-center justify-between white-card-secondary rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  staff.status === 'active' ? 'bg-green-100 text-green-700' :
                  staff.status === 'scheduled' ? 'bg-cyan-100 text-cyan-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  <span className="text-sm font-bold">{staff.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{staff.name}</p>
                  <p className="text-xs text-gray-500">{staff.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{staff.shift}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  staff.status === 'active' ? 'bg-green-100 text-green-700' :
                  staff.status === 'scheduled' ? 'bg-cyan-100 text-cyan-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {staff.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};