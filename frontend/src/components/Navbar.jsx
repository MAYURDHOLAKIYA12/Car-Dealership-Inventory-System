import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldCheck, UserCheck, LogOut, PlusCircle, LogIn, Sparkles } from 'lucide-react';

export const Navbar = ({ onOpenAuth, onOpenAddVehicle }) => {
  const { user, logout, isAdmin, demoLoginAdmin, demoLoginUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Vortex Motors
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full">
                Inventory OS
              </span>
            </div>
            <p className="text-xs text-slate-400">Premier Automotive Dealership</p>
          </div>
        </div>

        {/* Right Section Actions & Auth Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher Pills */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo:
            </span>
            <button
              onClick={demoLoginUser}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-transparent text-slate-200 transition"
              title="Log in as regular buyer"
            >
              Buyer View
            </button>
            <button
              onClick={demoLoginAdmin}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition"
              title="Log in as Dealership Admin"
            >
              Admin View
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={onOpenAddVehicle}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" /> Add Vehicle
                </button>
              )}

              {/* User Profile Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                ) : (
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                )}
                <div className="text-left leading-tight">
                  <div className="text-xs font-semibold text-slate-200">{user.username}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{user.role.toLowerCase()}</div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
            >
              <LogIn className="w-4 h-4" /> Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
