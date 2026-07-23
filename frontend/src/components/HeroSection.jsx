import React from 'react';
import { ShieldAlert, Zap, Layers, DollarSign } from 'lucide-react';

export const HeroSection = ({ vehicles = [] }) => {
  const totalVehicles = vehicles.length;
  const inStockCount = vehicles.filter((v) => v.quantity > 0).length;
  const totalValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);

  return (
    <div className="relative overflow-hidden pt-8 pb-12">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Next-Gen Dealership Management
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover & Manage <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Precision Automotive Inventory
            </span>
          </h1>
          <p className="mt-3 text-base text-slate-400">
            Real-time vehicle search, instant order processing, role-based access control, and automated inventory restocking.
          </p>
        </div>

        {/* Live Dealership Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalVehicles}</div>
              <div className="text-xs text-slate-400">Total Models</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{inStockCount}</div>
              <div className="text-xs text-slate-400">In Stock Ready</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                ${(totalValue / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-slate-400">Total Stock Value</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-200">
                {vehicles.length - inStockCount}
              </div>
              <div className="text-xs text-slate-400">Out of Stock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
