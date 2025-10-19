
import React from 'react';
import { InventoryItem } from '../types';

interface InventoryCardProps {
  item: InventoryItem;
}

const InfoRow: React.FC<{ label: string; value: string | null | undefined }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-sm font-medium text-slate-400">{label}:</span>
      <span className="text-base text-right text-slate-200 font-mono bg-slate-700/50 px-2 py-0.5 rounded">{value}</span>
    </div>
  );
};

export const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-lg transition-transform transform hover:scale-[1.02] hover:border-cyan-500/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {item.image && (
          <div className="md:col-span-1">
            <img src={item.image} alt={item.itemName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4 md:col-span-2">
          <h3 className="text-xl font-bold text-cyan-400 mb-2">{item.itemName}</h3>
          
          <div className="space-y-2 mb-4">
            <InfoRow label="Manufacturer" value={item.manufacturer} />
            <InfoRow label="Model #" value={item.modelNumber} />
            <InfoRow label="Serial #" value={item.serialNumber} />
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
};
