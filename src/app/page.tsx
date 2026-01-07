'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  lineUserId: string;
  topic: string;
  status: string;
  updatedAt: string;
  messages?: Message[];
}

export default function AdminDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chatData, setChatData] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 篩選狀態
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const selectedIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();

    const interval = setInterval(() => {
      fetchConversations();
      
      if (selectedIdRef.current) {
        fetchChatDetails(selectedIdRef.current, true);
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [filterStatus, searchQuery, startDate, endDate]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
    if (selectedId) {
      fetchChatDetails(selectedId, false); 
    }
  }, [selectedId]);

  useEffect(() => {
    fetchConversations();
  }, [filterStatus, searchQuery, startDate, endDate]);

  useEffect(() => {
    if (chatData) {
    }
  }, [chatData]);

  const fetchConversations = async () => {
    try {
      const params = new URLSearchParams();
      params.append('t', Date.now().toString());
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const res = await fetch(`/api/conversations?${params.toString()}`);
      const json = await res.json();
      if (json.data) {
        setConversations(json.data);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };

  const fetchChatDetails = async (id: string, isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await fetch(`/api/conversations/${id}?t=${Date.now()}`);
      const json = await res.json();
      if (json.data) {
        setChatData(json.data);
        if (isBackground) {
        }
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 font-sans text-slate-700">
      
      <div className="w-1/3 md:w-1/4 bg-white/80 backdrop-blur-md border-r border-indigo-100 flex flex-col shadow-lg z-10">
        <div className="p-5 border-b border-indigo-50 bg-white/50">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Chat 管理後台
            </h1>
            <button 
              onClick={fetchConversations} 
              className="px-3 py-1 rounded-full text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              ↻ 刷新
            </button>
          </div>
          
          {/* 篩選區域 */}
          <div className="space-y-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>🔍 篩選</span>
              <span>{showFilters ? '▲' : '▼'}</span>
            </button>
            
            {showFilters && (
              <div className="space-y-2 p-2 bg-white/50 rounded-lg border border-indigo-100">
                <input
                  type="text"
                  placeholder="搜尋對話主題或使用者ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="all">全部狀態</option>
                  <option value="active">進行中</option>
                  <option value="closed">已結束</option>
                </select>
                
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-1/2 px-2 py-2 text-xs border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-1/2 px-2 py-2 text-xs border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                {(filterStatus !== 'all' || searchQuery.trim() || startDate || endDate) && (
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setSearchQuery('');
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="w-full px-3 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    清除篩選
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {conversations.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">
              目前沒有任何對話紀錄 🍃
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => setSelectedId(conv._id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedId === conv._id 
                    ? 'bg-white shadow-md border border-indigo-100 ring-2 ring-indigo-50 scale-[1.02]' 
                    : 'hover:bg-white/60 hover:shadow-sm border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className={`font-bold text-sm truncate ${selectedId === conv._id ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {conv.topic || '未分類對話'}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    conv.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {conv.status === 'active' ? '進行中' : '已結束'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  ID: {conv.lineUserId.slice(0, 6)}...
                </div>
                <div className="text-[10px] text-slate-400 mt-2 text-right">
                  {new Date(conv.updatedAt).toLocaleString('zh-TW', {
                     month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full relative">
        {selectedId && chatData ? (
          <>
            <div className="p-5 bg-white/90 backdrop-blur shadow-sm flex justify-between items-center border-b border-indigo-50 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{chatData.topic}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <p className="text-xs text-slate-500 font-mono">User: {chatData.lineUserId}</p>
                </div>
              </div>
              <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                 Updated: {new Date(chatData.updatedAt).toLocaleTimeString()}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
              {loading ? (
                <div className="flex justify-center items-center h-full text-slate-400 gap-2">
                   <span className="animate-bounce">●</span>
                   <span className="animate-bounce delay-100">●</span>
                   <span className="animate-bounce delay-200">●</span>
                </div>
              ) : (
                <>
                {chatData.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-lg shadow-sm">
                            🤖
                        </div>
                    )}

                    <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                        className={`px-5 py-3 shadow-md text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl rounded-tr-sm' 
                            : 'bg-white text-slate-700 border border-indigo-50 rounded-2xl rounded-tl-sm'
                        }`}
                        >
                        {msg.content}
                        </div>
                        <div className={`text-[10px] mt-1 px-1 ${
                            msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                        }`}>
                            {new Date(msg.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>

                    {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ml-2 text-lg shadow-sm">
                            👤
                        </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col text-slate-300">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <span className="text-4xl">💬</span>
            </div>
            <p className="text-lg font-medium text-slate-500">準備好開始對話？</p>
            <p className="text-sm mt-2">從左側列表選擇對話以查看詳情</p>
          </div>
        )}
      </div>
    </div>
  );
}