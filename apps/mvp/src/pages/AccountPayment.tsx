import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccountPayment: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '1234',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '5678',
      expiry: '09/24',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleAddCard = () => {
    // Handle adding new card logic
    console.log('New card added');
    setShowAddForm(false);
    setNewCard({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
  };

  const handleRemoveCard = (id: number) => {
    setPaymentMethods(prev => prev.filter(card => card.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === id
      }))
    );
  };

  return (
    <div className="h-full bg-black text-white overflow-auto">
      <div className="pb-24">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Payment Methods</h1>
          </div>

          {/* Current Payment Methods */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="text-[#5BC0CE]" size={20} />
                <h3 className="text-lg font-bold text-white">Your Payment Methods</h3>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black px-3 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">Add New</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {paymentMethods.map((card) => (
                <div key={card.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#5BC0CE]/20 flex items-center justify-center">
                        <CreditCard className="text-[#5BC0CE]" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{card.type} ending in {card.last4}</p>
                        <p className="text-sm text-[#D0D8E0]">Expires {card.expiry}</p>
                        {card.isDefault && (
                          <span className="text-xs bg-[#5BC0CE]/20 text-[#5BC0CE] px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!card.isDefault && (
                        <button
                          onClick={() => handleSetDefault(card.id)}
                          className="text-[#5BC0CE] hover:text-[#6FFFE9] text-sm"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Card Form */}
          {showAddForm && (
            <div className="glass-primary rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Add New Payment Method</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#D0D8E0] mb-2">Card Number</label>
                  <input
                    type="text"
                    value={newCard.cardNumber}
                    onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#D0D8E0] mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={newCard.expiryDate}
                      onChange={(e) => setNewCard(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#D0D8E0] mb-2">CVV</label>
                    <input
                      type="text"
                      value={newCard.cvv}
                      onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#D0D8E0] mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={newCard.cardholderName}
                    onChange={(e) => setNewCard(prev => ({ ...prev, cardholderName: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#D0D8E0] focus:border-[#5BC0CE] focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCard}
                    className="flex-1 bg-[#5BC0CE] hover:bg-[#6FFFE9] text-black rounded-lg py-3 font-medium transition-colors"
                  >
                    Add Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Security Info */}
          <div className="glass-primary rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Payment Security</h3>
            
            <div className="space-y-3 text-sm text-[#D0D8E0]">
              <p>• All payment information is encrypted and securely stored</p>
              <p>• We use industry-standard SSL encryption</p>
              <p>• Your card details are never stored in plain text</p>
              <p>• You can remove payment methods at any time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 