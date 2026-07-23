import React from 'react';
import { X, ShoppingCart, ShieldCheck, Tag, Calendar, Layers, AlertCircle } from 'lucide-react';

export const VehicleModal = ({ vehicle, isOpen, onClose, onPurchase }) => {
  if (!isOpen || !vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900 backdrop-blur-sm transition border border-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image Left */}
          <div className="relative h-64 md:h-full min-h-[250px] bg-slate-900">
            <img
              src={
                vehicle.imageUrl ||
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
              }
              alt={vehicle.model}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent md:bg-gradient-to-r" />
          </div>

          {/* Details Right */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                  {vehicle.category}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {vehicle.year} Model
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">{vehicle.make}</h2>
              <h3 className="text-lg font-bold text-indigo-300 mb-4">{vehicle.model}</h3>

              <div className="text-3xl font-black text-white mb-4">
                ${vehicle.price.toLocaleString()}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Layers className="w-4 h-4 text-slate-500" /> Availability
                  </span>
                  {isOutOfStock ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {vehicle.quantity} Units Ready
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Tag className="w-4 h-4 text-slate-500" /> Vehicle ID
                  </span>
                  <span className="font-mono text-slate-300">{vehicle.id.slice(0, 8)}...</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {vehicle.description ||
                  'Engineered with cutting-edge technology and exceptional automotive performance.'}
              </p>
            </div>

            <button
              onClick={() => {
                onPurchase(vehicle);
                onClose();
              }}
              disabled={isOutOfStock}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Currently Out of Stock' : 'Confirm Purchase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
