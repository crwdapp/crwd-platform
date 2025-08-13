import React from 'react';
import { useAppStore } from '../../../store';
import { CollapsedView } from './CollapsedView';
import { ExpandedView } from './ExpandedView';

export const PanelContent: React.FC = () => {
  const { ui } = useAppStore();

  return (
    <div className="flex-1 overflow-hidden">
      <CollapsedView />
    </div>
  );
};