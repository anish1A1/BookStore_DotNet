// app/admin/discounts-management/page.jsx
"use client";

import { useState, useMemo } from "react";
import { PlusIcon, CalendarIcon, PercentIcon, EditIcon, TrashIcon } from "lucide-react";

export default function DiscountsManagementPage() {
  // static initial discounts
  const initialDiscounts = useMemo(
    () => [
      {
        id: 1,
        name: 'Summer Sale',
        code: 'SUMMER20',
        type: 'Percentage',
        value: '20%',
        start: '2025-06-01',
        end: '2025-06-15',
        status: 'Active',
      },
      {
        id: 2,
        name: 'New Member Discount',
        code: 'WELCOME15',
        type: 'Percentage',
        value: '15%',
        start: '2025-05-01',
        end: '2025-05-31',
        status: 'Scheduled',
      },
      {
        id: 3,
        name: 'Bulk Purchase',
        code: 'BULK10',
        type: 'Fixed Amount',
        value: '$10',
        start: '2025-04-01',
        end: '2025-04-30',
        status: 'Expired',
      },
    ],
    []
  );

  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', type: 'Percentage', value: '', start: '', end: ''
  });

  function openAdd() {
    setEditingId(null);
    setFormData({ name: '', code: '', type: 'Percentage', value: '', start: '', end: '' });
    setShowForm(true);
  }

  function openEdit(d) {
    setEditingId(d.id);
    setFormData({
      name: d.name,
      code: d.code,
      type: d.type,
      value: d.value,
      start: d.start,
      end: d.end,
    });
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newStatus = formData.start > new Date().toISOString().slice(0,10)
      ? 'Scheduled'
      : formData.end < new Date().toISOString().slice(0,10)
      ? 'Expired'
      : 'Active';
    const record = { id: editingId|| Date.now(), ...formData, status: newStatus };

    if (editingId) {
      setDiscounts(ds => ds.map(d => d.id===editingId ? record : d));
    } else {
      setDiscounts(ds => [...ds, record]);
    }
    setShowForm(false);
  }

  function confirmDelete(id) {
    setShowDeleteId(id);
  }

  function handleDelete() {
    setDiscounts(ds => ds.filter(d => d.id !== showDeleteId));
    setShowDeleteId(null);
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-300 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Discounts Management</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            <PlusIcon size={16} />
            <span>Create New Discount</span>
          </button>
        </div>

        {/* Active Discounts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.filter(d=>d.status==='Active').map(d => (
            <div key={d.id} className="border border-gray-300 rounded-md overflow-hidden bg-white">
              <div className="bg-green-100 p-2 text-sm font-bold text-green-800 flex justify-between">
                <span>{d.status}</span>
                <div className="flex items-center gap-1">
                  <CalendarIcon size={14} />
                  <span>Ends in {Math.max(0, (new Date(d.end) - new Date())/(1000*60*60*24)|0)} days</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold">{d.name}</h3>
                  <div className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                    <PercentIcon size={14} /> {d.value}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">Code: {d.code}</div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={()=>openEdit(d)}
                    className="px-3 py-1 border border-gray-300 text-sm rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={()=>confirmDelete(d.id)}
                    className="px-3 py-1 border border-red-300 text-red-600 text-sm rounded-md"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scheduled/Expired Table */}
        <div className="bg-white rounded-lg shadow border border-gray-300 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead><tr className="bg-gray-100">
              {['Name','Code','Type','Value','Start Date','End Date','Status','Actions'].map(h=>
                <th key={h} className="p-3 border border-gray-300 text-left text-sm">{h}</th>
              )}
            </tr></thead>
            <tbody>
              {discounts.filter(d=>d.status!=='Active').map(d=> (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="p-2 border border-gray-300">{d.name}</td>
                  <td className="p-2 border border-gray-300">{d.code}</td>
                  <td className="p-2 border border-gray-300">{d.type}</td>
                  <td className="p-2 border border-gray-300">{d.value}</td>
                  <td className="p-2 border border-gray-300">{d.start}</td>
                  <td className="p-2 border border-gray-300">{d.end}</td>
                  <td className="p-2 border border-gray-300">
                    <span className={`px-2 py-1 rounded text-xs ${
                      d.status==='Scheduled'?'bg-blue-100 text-blue-800':'bg-gray-100 text-gray-800'
                    }`}>{d.status}</span>
                  </td>
                  <td className="p-2 border border-gray-300 flex gap-2">
                    <button onClick={()=>openEdit(d)} className="p-1 bg-blue-100 text-blue-700 rounded"><EditIcon size={16}/></button>
                    <button onClick={()=>confirmDelete(d.id)} className="p-1 bg-gray-100 text-gray-700 rounded"><TrashIcon size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">{editingId?'Edit Discount':'Create New Discount'}</h2>
            {['name','code','type','value','start','end'].map(field=>(
              <div key={field}>
                <label className="block text-sm font-medium capitalize mb-1">{field.replace(/start|end/,'Date')}</label>
                {field==='type'? (
                  <select
                    value={formData.type}
                    onChange={e=>setFormData({...formData,type:e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option>Percentage</option>
                    <option>Fixed Amount</option>
                    <option>Buy X Get Y</option>
                  </select>
                ) : field==='value'? (
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.value}
                      onChange={e=>setFormData({...formData,value:e.target.value})}
                      className="flex-1 p-2 border border-gray-300 rounded-l"
                    />
                    <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r flex items-center">
                      <PercentIcon size={16} />
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.includes('Date')?'date':'text'}
                    value={formData[field]}
                    onChange={e=>setFormData({...formData,[field]:e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md">{editingId?'Save':'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            <p>Are you sure you want to delete this discount?</p>
            <div className="flex justify-end gap-3">
              <button onClick={()=>setShowDeleteId(null)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
