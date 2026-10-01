import React, { useState } from 'react';
import {
  Compass,
  Wallet,
  Scale,
  Sparkles,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';
import { getCurrentUserId, setCurrentUserId } from '../../api/client';
import { CardyLogo } from '../brand/Logo';

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
    { id: 'recommend' as NavTab, label: 'Gợi ý card', icon: Sparkles, highlight: true },
    { id: 'explore' as NavTab, label: 'Danh sách thẻ', icon: Compass },
    { id: 'wallet' as NavTab, label: 'Ví thẻ của tôi', icon: Wallet },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-line transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            className="flex items-center cursor-pointer group select-none"
            onClick={() => onSelectTab('home')}
          >
            <CardyLogo size={32} tagline={true} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-ink-2 hover:text-navy-900 hover:bg-blue-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-sun' : 'text-ink-3 group-hover:text-blue-600'
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
                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_2px_0_#23307e]'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>So sánh card ({compareCount})</span>
              </button>
            )}
          </nav>

          {/* User selector / Status */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-ink-3 bg-paper px-3 py-1.5 rounded-xl border border-line">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-medium text-ink-3">Ví:</span>
              <select
                value={userId}
                onChange={(e) => handleUserChange(Number(e.target.value))}
                className="bg-transparent font-bold text-navy-900 text-[11px] focus:outline-none cursor-pointer"
                title="Thay đổi user ID để kiểm tra dữ liệu ví độc lập"
              >
                <option value={1}>Người dùng #1</option>
                <option value={2}>Người dùng #2</option>
                <option value={3}>Khách mới #3</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {compareCount > 0 && (
              <button
                onClick={() => onSelectTab('compare')}
                className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{compareCount}</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-navy-900 hover:bg-blue-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-line animate-fadeIn space-y-1">
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
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-navy-900 text-white'
                      : 'text-ink-2 hover:bg-blue-50 hover:text-navy-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sun' : 'text-ink-3'}`} />
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
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-blue-700" />
                  <span>So sánh card đã chọn ({compareCount})</span>
                </div>
              </button>
            )}

            <div className="pt-2 px-4 flex items-center justify-between text-xs text-ink-3 border-t border-line mt-2">
              <span>Đang dùng hồ sơ ví:</span>
              <select
                value={userId}
                onChange={(e) => handleUserChange(Number(e.target.value))}
                className="bg-paper font-bold text-navy-900 text-xs px-2 py-1 rounded-lg border border-line"
              >
                <option value={1}>Người dùng #1</option>
                <option value={2}>Người dùng #2</option>
                <option value={3}>Khách mới #3</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
