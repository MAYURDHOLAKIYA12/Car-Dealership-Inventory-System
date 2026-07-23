import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { AuthModal } from './components/AuthModal';
import { AdminVehicleModal } from './components/AdminVehicleModal';
import { RestockModal } from './components/RestockModal';
import { Toast } from './components/Toast';
import { api } from './services/api';
import { Car, Loader2, Sparkles } from 'lucide-react';

const MainApp = () => {
  const { token, isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals & Toast State
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [restockVehicleItem, setRestockVehicleItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await api.getVehicles(token);
      setVehicles(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to connect to Inventory API. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [token]);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(vehicles.map((v) => v.category));
    return Array.from(cats);
  }, [vehicles]);

  // Filter Vehicles Logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory ? v.category === selectedCategory : true;
      const matchesPrice = v.price <= maxPrice;
      const matchesStock = inStockOnly ? v.quantity > 0 : true;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });
  }, [vehicles, searchQuery, selectedCategory, maxPrice, inStockOnly]);

  // Actions
  const handlePurchase = async (vehicle) => {
    if (!token) {
      showToast('Please sign in to purchase vehicles', 'error');
      setIsAuthOpen(true);
      return;
    }

    try {
      const res = await api.purchaseVehicle(vehicle.id, token);
      showToast(`🎉 Purchased ${vehicle.make} ${vehicle.model}! Stock remaining: ${res.quantity}`);
      fetchVehicles();
    } catch (err) {
      showToast(err.message || 'Purchase failed', 'error');
    }
  };

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await api.updateVehicle(editingVehicle.id, vehicleData, token);
        showToast(`Updated ${vehicleData.make} ${vehicleData.model}`);
      } else {
        await api.createVehicle(vehicleData, token);
        showToast(`Added new vehicle ${vehicleData.make} ${vehicleData.model}`);
      }
      fetchVehicles();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
      throw err;
    }
  };

  const handleDeleteVehicle = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) return;

    try {
      await api.deleteVehicle(vehicle.id, token);
      showToast(`Deleted ${vehicle.make} ${vehicle.model}`);
      fetchVehicles();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleRestockVehicle = async (vehicleId, quantity) => {
    try {
      const res = await api.restockVehicle(vehicleId, quantity, token);
      showToast(res.message);
      fetchVehicles();
    } catch (err) {
      showToast(err.message || 'Restock failed', 'error');
      throw err;
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMaxPrice(300000000);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAddVehicle={() => {
          setEditingVehicle(null);
          setIsAdminModalOpen(true);
        }}
      />

      <main className="flex-1">
        <HeroSection vehicles={vehicles} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Search & Filter Toolbar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onReset={resetFilters}
            categories={categories}
          />

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-indigo-400" />
              Available Vehicles ({filteredVehicles.length})
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Showing matching inventory items
            </span>
          </div>

          {/* Vehicle Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
              <p className="text-sm font-medium">Loading dealership inventory...</p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl glass-card text-center text-rose-400 border border-rose-500/30">
              <p className="font-bold text-lg mb-2">Connection Error</p>
              <p className="text-xs mb-4">{error}</p>
              <button
                onClick={fetchVehicles}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Retry Loading
              </button>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="p-12 rounded-3xl glass-card text-center border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No matching vehicles found</h3>
              <p className="text-xs text-slate-400 mb-4">
                Try clearing your search query or adjusting max price filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPurchase={handlePurchase}
                  onSelect={(v) => setSelectedVehicle(v)}
                  onEdit={(v) => {
                    setEditingVehicle(v);
                    setIsAdminModalOpen(true);
                  }}
                  onDelete={handleDeleteVehicle}
                  onRestock={(v) => setRestockVehicleItem(v)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              V
            </div>
            <span className="font-bold text-slate-300">Vortex Automotive Inventory OS</span>
          </div>
          <p>© 2026 TDD Kata Project. Built with React, Tailwind CSS & Express REST API.</p>
        </div>
      </footer>

      {/* Modals & Toast */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

      <VehicleModal
        vehicle={selectedVehicle}
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onPurchase={handlePurchase}
      />

      <AdminVehicleModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setEditingVehicle(null);
        }}
        onSave={handleSaveVehicle}
        vehicleToEdit={editingVehicle}
      />

      <RestockModal
        vehicle={restockVehicleItem}
        isOpen={!!restockVehicleItem}
        onClose={() => setRestockVehicleItem(null)}
        onRestock={handleRestockVehicle}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
