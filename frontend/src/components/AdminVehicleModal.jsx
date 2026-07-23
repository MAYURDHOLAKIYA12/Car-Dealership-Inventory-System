import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Save } from 'lucide-react';

export const AdminVehicleModal = ({ isOpen, onClose, onSave, vehicleToEdit }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 2024,
    category: 'Sports',
    price: '',
    quantity: 1,
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        make: vehicleToEdit.make || '',
        model: vehicleToEdit.model || '',
        year: vehicleToEdit.year || 2024,
        category: vehicleToEdit.category || 'Sports',
        price: vehicleToEdit.price || '',
        quantity: vehicleToEdit.quantity !== undefined ? vehicleToEdit.quantity : 1,
        description: vehicleToEdit.description || '',
        imageUrl: vehicleToEdit.imageUrl || '',
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: 2024,
        category: 'Sports',
        price: '',
        quantity: 1,
        description: '',
        imageUrl: '',
      });
    }
    setError('');
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.make || !formData.model || !formData.price || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-lg rounded-2xl p-6 border border-slate-800 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          {vehicleToEdit ? <Save className="w-5 h-5 text-indigo-400" /> : <PlusCircle className="w-5 h-5 text-emerald-400" />}
          {vehicleToEdit ? 'Edit Vehicle Details' : 'Add New Vehicle to Inventory'}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Make *</label>
              <input
                type="text"
                required
                placeholder="e.g. Porsche"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. 911 GT3"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
              <input
                type="number"
                min="1950"
                max="2030"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
              >
                <option value="Sports">Sports</option>
                <option value="Electric">Electric</option>
                <option value="Coupe">Coupe</option>
                <option value="Luxury SUV">Luxury SUV</option>
                <option value="Muscle">Muscle</option>
                <option value="Sedan">Sedan</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Price ($) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 180000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Brief description of vehicle performance, features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
            >
              {loading ? 'Saving...' : vehicleToEdit ? 'Update Vehicle' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
