import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export const ViewToggle = ({ viewMode, onViewChange }) => (
  <div className="flex justify-end mb-6">
    <div className="flex bg-white p-1 rounded-lg shadow-sm border">
      <button
        onClick={() => onViewChange('card')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'card' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <LayoutGrid className="w-4 h-4 inline mr-1" /> Card View
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <List className="w-4 h-4 inline mr-1" /> Table View
      </button>
    </div>
  </div>
);