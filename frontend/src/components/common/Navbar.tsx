import React, { useState } from 'react';
import {
  CreditCard,
  Compass,
  Wallet,
  Scale,
  Sparkles,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';
import { getCurrentUserId, setCurrentUserId } from '../../api/client';

export type NavTab = 'home' | 'recommend' | 'wallet' | 'explore' | 'compare';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  compareCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  compareCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<number>(getCurrentUserId());

  const handleUserChange = (newId: number) => {
    setCurrentUserId(newId);
    setUserId(newId);
    window.location.reload();
  };

  const navItems = [
    { id: 'recommend' as NavTab, label: 'Gợi ý quẹt thẻ', icon: Sparkles, highlight: true },
    { id: 'wallet' as NavTab, label: 'Ví của tôi', icon: Wallet },
    { id: 'explore' as NavTab, label: 'Khám phá 30+ thẻ', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onSelectTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:bg-slate-800 transition-colors">
              <CreditCard className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Right<span className="text-teal-600">Card</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  VN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5 hidden sm:block">
                Cố vấn quyết định thẻ tín dụng theo ngữ cảnh
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-300' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Compare quick button if cards selected */}
            {compareCount > 0 && (
              <button
                onClick={() => onSelectTab('compare')}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  currentTab === 'compare'
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>So sánh ({compareCount})</span>
              </button>
            )}
          </nav>

          {/* User selector / Status */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200/70">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-[11px] font-medium text-slate-500">Ví:</span>
              <select
                value={userId}
                onChange={(e) => handleUserChange(Number(e.target.value))}
                className="bg-transparent font-bold text-slate-800 text-[11px] focus:outline-none cursor-pointer"
                title="Thay đổi user ID để kiểm tra dữ liệu ví độc lập"
              >
                <option value={1}>Người dùng #1</option>
                <option value={2}>Người dùng #2</option>
                <option value={3}>Khách hàng mới #3</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {compareCount > 0 && (
              <button
                onClick={() => onSelectTab('compare')}
                className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{compareCount}</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fadeIn space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            {compareCount > 0 && (
              <button
                onClick={() => {
                  onSelectTab('compare');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium bg-teal-50 text-teal-800 border border-teal-200"
              >
                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-teal-700" />
                  <span>So sánh thẻ đã chọn ({compareCount})</span>
                </div>
              </button>
            )}

            <div className="pt-2 px-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 mt-2">
              <span>Đang dùng hồ sơ ví:</span>
              <select
                value={userId}
                onChange={(e) => handleUserChange(Number(e.target.value))}
                className="bg-slate-100 font-bold text-slate-800 text-xs px-2 py-1 rounded-lg border border-slate-200"
              >
                <option value={1}>Người dùng #1</option>
                <option value={2}>Người dùng #2</option>
                <option value={3}>Khách hàng mới #3</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
