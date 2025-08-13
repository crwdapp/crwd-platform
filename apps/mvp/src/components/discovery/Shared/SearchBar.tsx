// Debounced search component
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useAppStore } from '../../../store';
import { useDebounce } from '../../../hooks/useDebounce';

export const SearchBar: React.FC = () => {
  const { ui } = useAppStore();
  const [localQuery, setLocalQuery] = useState(ui.searchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    useAppStore.setState(state => {
      state.ui.searchQuery = debouncedQuery;
    });
  }, [debouncedQuery]);

  const clearSearch = () => {
    setLocalQuery('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D0D8E0]" size={16} />
      <input
        type="text"
        placeholder="Search bars, clubs..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-9 pr-9 py-3 text-white placeholder-[#D0D8E0] focus:outline-none focus:ring-2 focus:ring-[#5BC0CE]"
      />
      {localQuery && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D0D8E0] hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};