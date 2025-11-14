'use client';

import { useState } from 'react';
import { Mic, MicOff, Bell, Settings, FileText, Plus, Edit2, Trash2, TrendingUp, AlertCircle, DollarSign, Package, X, Save, Download, Calendar } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  price: number;
  category: string;
  status: 'Low' | 'Stocked';
}

interface VoiceCommandLog {
  timestamp: string;
  command: string;
  status: 'Success';
}

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Update stock of Organic Basmati Rice to 85');
  const [assistantResponse, setAssistantResponse] = useState('Stock updated to 85 units');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Tata Tea Gold', sku: 'TEA-002', currentStock: 35, reorderLevel: 40, price: 250, category: 'Beverages', status: 'Low' },
    { id: '2', name: 'Britannia Biscuits', sku: 'BISC-003', currentStock: 120, reorderLevel: 60, price: 30, category: 'Snacks', status: 'Stocked' },
    { id: '3', name: 'Amul Fresh Milk', sku: 'MILK-004', currentStock: 25, reorderLevel: 30, price: 56, category: 'Dairy', status: 'Low' },
    { id: '4', name: 'Surf Excel Detergent', sku: 'DET-005', currentStock: 45, reorderLevel: 25, price: 180, category: 'Cleaning', status: 'Stocked' },
    { id: '5', name: 'Fortune Sunflower Oil', sku: 'OIL-006', currentStock: 15, reorderLevel: 20, price: 210, category: 'Cooking', status: 'Low' },
  ]);

  const [editForm, setEditForm] = useState<InventoryItem | null>(null);

  const [newItem, setNewItem] = useState<InventoryItem>({
    id: '',
    name: '',
    sku: '',
    currentStock: 0,
    reorderLevel: 0,
    price: 0,
    category: '',
    status: 'Stocked'
  });

  const voiceCommandLogs: VoiceCommandLog[] = [
    { timestamp: '2025-11-14 10:30 AM', command: 'Update stock of Organic Basmati Rice to 85', status: 'Success' },
    { timestamp: '2025-11-14 10:15 AM', command: 'Show items running low', status: 'Success' },
    { timestamp: '2025-11-14 09:45 AM', command: 'What is total inventory value', status: 'Success' },
    { timestamp: '2025-11-14 09:20 AM', command: 'Add new item Maggi Noodles', status: 'Success' },
  ];

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleAddItem = () => {
    const id = (inventoryItems.length + 1).toString();
    const status: 'Low' | 'Stocked' = newItem.currentStock <= newItem.reorderLevel ? 'Low' : 'Stocked';
    setInventoryItems([...inventoryItems, { ...newItem, id, status }]);
    setNewItem({
      id: '',
      name: '',
      sku: '',
      currentStock: 0,
      reorderLevel: 0,
      price: 0,
      category: '',
      status: 'Stocked'
    });
    setShowAddModal(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      const status: 'Low' | 'Stocked' = editForm.currentStock <= editForm.reorderLevel ? 'Low' : 'Stocked';
      setInventoryItems(inventoryItems.map(item => 
        item.id === editForm.id ? { ...editForm, status } : item
      ));
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setInventoryItems(inventoryItems.filter(item => item.id !== id));
      setDeletingId(null);
    }, 300);
  };

  if (showReports) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Sharma General Store</h1>
                <p className="text-sm text-gray-500">Owner: Rajesh Sharma</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>🇬🇧 English</option>
                <option>🇮🇳 Hindi</option>
              </select>
              
              <button 
                onClick={() => setShowReports(false)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
              
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex gap-6 p-6">
          {/* Voice Commands Panel */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Commands</h2>
              <p className="text-sm text-gray-600 mb-6">Press and speak</p>
              
              <div className="flex flex-col items-center mb-6">
                <button
                  onClick={toggleListening}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-blue-100 hover:bg-blue-200' 
                      : 'bg-gray-700 hover:bg-gray-800'
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-10 h-10 text-blue-600" />
                  ) : (
                    <MicOff className="w-10 h-10 text-white" />
                  )}
                </button>
                <p className="mt-4 text-sm text-gray-600">
                  {isListening ? 'Listening...' : 'Ready to listen'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Transcript:</p>
                  <p className="text-sm text-gray-900">{transcript}</p>
                </div>

                {assistantResponse && (
                  <div className="bg-blue-50 rounded-lg p-4 flex gap-2">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium mb-1">Assistant Response:</p>
                      <p className="text-sm text-gray-900">{assistantResponse}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-3">Try saying:</p>
                <div className="space-y-2">
                  {[
                    'Update stock of [item] to [number]',
                    'Show items running low',
                    'What is total inventory value?',
                    'Add new item [name]'
                  ].map((command, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                      "{command}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reports Content */}
          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    +12.5%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">₹16,250</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 bg-yellow-100 px-2 py-1 rounded">
                    2 items
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Items Running Low</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    +8.2%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Today's Sales</p>
                <p className="text-2xl font-bold text-gray-900">₹12,450</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    120 units sold
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Top Selling Item</p>
                <p className="text-lg font-semibold text-gray-900">Britannia Biscuits</p>
              </div>
            </div>

            {/* Generate Reports Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Generate Reports</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <button className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Daily Report (PDF)</h3>
                  <p className="text-sm text-gray-600">Last 24 hours</p>
                </button>

                <button className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Weekly Report (Excel)</h3>
                  <p className="text-sm text-gray-600">Last 7 days</p>
                </button>

                <button className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Custom Range</h3>
                  <p className="text-sm text-gray-600">Select dates</p>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-6">
                  <button className="px-1 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                    Voice Command Logs
                  </button>
                  <button className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Stock Change History
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Voice Command Activity</h3>
                <p className="text-sm text-gray-600 mb-6">All commands processed by the voice assistant</p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Command
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {voiceCommandLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.timestamp}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                            <Mic className="w-4 h-4 text-gray-400" />
                            {log.command}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Success
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Sharma General Store</h1>
              <p className="text-sm text-gray-500">Owner: Rajesh Sharma</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option>🇬🇧 English</option>
              <option>🇮🇳 Hindi</option>
            </select>
            
            <button 
              onClick={() => setShowReports(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Reports</span>
            </button>
            
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-6 p-6">
        {/* Voice Commands Panel */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Commands</h2>
            <p className="text-sm text-gray-600 mb-6">Press and speak</p>
            
            <div className="flex flex-col items-center mb-6">
              <button
                onClick={toggleListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-blue-100 hover:bg-blue-200' 
                    : 'bg-gray-700 hover:bg-gray-800'
                }`}
              >
                {isListening ? (
                  <Mic className="w-10 h-10 text-blue-600" />
                ) : (
                  <MicOff className="w-10 h-10 text-white" />
                )}
              </button>
              <p className="mt-4 text-sm text-gray-600">
                {isListening ? 'Listening...' : 'Ready to listen'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Transcript:</p>
                <p className="text-sm text-gray-900">{transcript}</p>
              </div>

              {assistantResponse && (
                <div className="bg-blue-50 rounded-lg p-4 flex gap-2">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Assistant Response:</p>
                    <p className="text-sm text-gray-900">{assistantResponse}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-3">Try saying:</p>
              <div className="space-y-2">
                {[
                  'Update stock of [item] to [number]',
                  'Show items running low',
                  'What is total inventory value?',
                  'Add new item [name]'
                ].map((command, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                    "{command}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  +12.5%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">₹25,000</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-xs font-medium text-gray-600 bg-yellow-100 px-2 py-1 rounded">
                  3 items
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Items Running Low</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  +8.2%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">₹12,450</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  120 units sold
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Top Selling Item</p>
              <p className="text-lg font-semibold text-gray-900">Britannia Biscuits</p>
            </div>
          </div>

          {/* Inventory Management Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Inventory Management</h2>
                <p className="text-sm text-gray-600 mt-1">{inventoryItems.length} items in stock</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add New Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Reorder Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Price (₹)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                          {item.sku}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{item.currentStock}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{item.reorderLevel}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">₹{item.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === 'Low' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            Stocked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
