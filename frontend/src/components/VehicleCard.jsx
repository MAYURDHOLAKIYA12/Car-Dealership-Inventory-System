import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, RefreshCw, Edit, Trash2, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

export const VehicleCard = ({
  vehicle,
  onPurchase,
  onSelect,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const { isAdmin } = useAuth();
  const isOutOfStock = vehicle.quantity <= 0;

  const defaultImages = {
    Sports: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    Electric: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    Coupe: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    'Luxury SUV': 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80',
    Muscle: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
  };

  const imageSrc =
    vehicle.imageUrl ||
    defaultImages[vehicle.category] ||
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Image & Badges Overlay */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
        <img
          src={imageSrc}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-medium text-slate-200">
          <span>{vehicle.category}</span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold backdrop-blur-md">
              <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> {vehicle.quantity} Available
            </span>
          )}
        </div>

        {/* Year Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-slate-300 font-semibold bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {vehicle.year}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {vehicle.make}
            </span>
            <span className="text-xl font-extrabold text-white">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>

          <h3
            onClick={() => onSelect(vehicle)}
            className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition cursor-pointer line-clamp-1"
          >
            {vehicle.model}
          </h3>

          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {vehicle.description || 'Premium automotive craftsmanship with performance engineering.'}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
          {/* Purchase Button */}
          <button
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock}
            data-testid={`purchase-btn-${vehicle.id}`}
            className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition transform active:scale-98 shadow-md ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}
          </button>

          {/* Admin Management Toolbar */}
          {isAdmin && (
            <div className="flex items-center justify-between gap-1 pt-1">
              <button
                onClick={() => onRestock(vehicle)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 transition"
                title="Restock Inventory"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restock
              </button>
              <button
                onClick={() => onEdit(vehicle)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center transition border border-slate-700"
                title="Edit Vehicle"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(vehicle)}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center justify-center transition border border-rose-500/30"
                title="Delete Vehicle"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
