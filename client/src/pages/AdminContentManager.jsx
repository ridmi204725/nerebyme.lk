import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { FaArrowLeft, FaUpload, FaTrash, FaEdit, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { value: 'food-hub', label: 'Food' },
  { value: 'hotels', label: 'Hotels' },
  { value: 'dayout', label: 'Dayout' },
  { value: 'travel', label: 'Travel' },
  { value: 'movie-theater', label: 'Movie' },
  { value: 'functions', label: 'Function & Event' }
];

export default function AdminContentManager() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('food-hub');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', url: '' });
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/items`, { params: { category }, headers });
      setItems((res.data?.data || []).filter(x => x.isApproved));
      setSelected(null);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [category]);

  const chooseFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) return alert('Please use an image smaller than 7 MB.');
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, url: reader.result }));
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!selected || !form.url) return alert('Select an approved item and choose an image.');
    try {
      if (form._id) {
        await axios.put(`${API_BASE_URL}/api/admin/items/${selected._id}/packages/${form._id}`, form, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/items/${selected._id}/packages`, form, { headers });
      }
      setForm({ title: '', description: '', url: '' });
      await load();
      const fresh = await axios.get(`${API_BASE_URL}/api/admin/items/${selected._id}`, { headers });
      setSelected(fresh.data.data);
    } catch (e) { alert(e.response?.data?.message || 'Could not save package image'); }
  };

  const remove = async id => {
    if (!selected || !confirm('Delete this package image?')) return;
    await axios.delete(`${API_BASE_URL}/api/admin/items/${selected._id}/packages/${id}`, { headers });
    const fresh = await axios.get(`${API_BASE_URL}/api/admin/items/${selected._id}`, { headers });
    setSelected(fresh.data.data);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button onClick={() => navigate('/admin/dashboard')} className="px-4 py-2 rounded-xl bg-white/10"><FaArrowLeft className="inline mr-2"/>Dashboard</button>
          <div><h1 className="text-3xl font-black">Admin Package / Menu Images</h1><p className="text-gray-400 text-sm">Only approved listings can receive public package images.</p></div>
          <FaCheckCircle className="text-emerald-400 text-3xl"/>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => <button key={c.value} onClick={() => setCategory(c.value)} className={`px-4 py-2 rounded-xl ${category===c.value?'bg-emerald-500':'bg-white/10'}`}>{c.label}</button>)}
        </div>
        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 max-h-[70vh] overflow-auto">
            <h2 className="font-bold mb-3">Approved Listings</h2>
            {loading ? <p className="text-gray-400">Loading...</p> : items.map(x =>
              <button key={x._id} onClick={async()=>{const r=await axios.get(`${API_BASE_URL}/api/admin/items/${x._id}`,{headers});setSelected(r.data.data)}} className={`w-full text-left p-3 rounded-xl mb-2 ${selected?._id===x._id?'bg-emerald-500/20 border border-emerald-500':'bg-black/20'}`}>
                <div className="font-semibold">{x.name}</div><div className="text-xs text-gray-400">{x.subCategory || x.category}</div>
              </button>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            {!selected ? <p className="text-gray-400">Select a listing.</p> : <>
              <h2 className="text-xl font-bold mb-4">{selected.name} — Packages</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {(selected.packageImages || []).map(pkg => <div key={pkg._id} className="rounded-xl overflow-hidden bg-black/20 border border-white/10">
                  <img src={pkg.url} className="w-full h-36 object-cover" alt={pkg.title}/>
                  <div className="p-3"><div className="font-semibold">{pkg.title}</div><p className="text-xs text-gray-400">{pkg.description}</p><button onClick={()=>setForm({...pkg})} className="mt-2 text-xs px-2 py-1 bg-blue-500/20 rounded"><FaEdit className="inline mr-1"/>Edit</button><button onClick={()=>remove(pkg._id)} className="mt-2 ml-2 text-xs px-2 py-1 bg-red-500/20 rounded"><FaTrash className="inline mr-1"/>Delete</button></div>
                </div>)}
              </div>
              <div className="border-t border-white/10 pt-5">
                <h3 className="font-bold mb-3">{form._id ? 'Edit Package Image' : 'Add Package / Menu Image'}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="p-3 rounded-xl bg-black/30 border border-white/10"/>
                  <label className="p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer"><FaUpload className="inline mr-2"/>Choose image<input type="file" accept="image/*" onChange={chooseFile} className="hidden"/></label>
                </div>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="w-full mt-3 p-3 rounded-xl bg-black/30 border border-white/10"/>
                {form.url && <img src={form.url} className="mt-3 w-full max-w-md h-48 object-cover rounded-xl" alt="Preview"/>}
                <div className="mt-4 flex gap-2"><button onClick={save} className="px-5 py-3 rounded-xl bg-emerald-500 font-bold"><FaPlus className="inline mr-2"/>{form._id?'Update':'Add'}</button><button onClick={()=>setForm({title:'',description:'',url:''})} className="px-5 py-3 rounded-xl bg-white/10">Clear</button></div>
              </div>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}
