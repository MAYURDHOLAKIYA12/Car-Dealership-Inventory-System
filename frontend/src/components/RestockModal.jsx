import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';

export const RestockModal = ({ vehicle, isOpen, onClose, onRestock }) => {
  const [quantity, setQuantity] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onRestock(vehicle.id, Number(quantity));
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-sm rounded-2xl p-6 border border-slate-800 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <RefreshCw className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Restock Vehicle Stock</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Increasing available inventory units for{' '}
          <strong className="text-white">{vehicle.make} {vehicle.model}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Add Quantity Units
            </label>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white font-bold focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition"
          >
            {loading ? 'Restocking...' : `Restock (+${quantity} units)`}
          </button>
        </form>
      </div>
    </div>
  );
};
