// Formatting and localization helpers for RightCard

export function formatVND(value?: number | null, fallback = '0 ₫'): string {
  if (value === undefined || value === null) return fallback;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value?: number | null, fallback = '0'): string {
  if (value === undefined || value === null) return fallback;
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function formatBenefit(
  value?: number | null,
  unit?: string | null,
  type?: string | null
): string {
  if (value === undefined || value === null) {
    if (type) return getBenefitTypeLabel(type);
    return 'Ưu đãi thành viên';
  }
  let unitStr = '';
  if (unit === 'percent') {
    unitStr = '%';
  } else if (unit === 'vnd') {
    unitStr = ' ₫';
  } else if (unit === 'item') {
    unitStr = ' voucher/quà tặng';
  } else if (unit) {
    unitStr = ` ${unit}`;
  }

  const typeLabel = type ? ` ${getBenefitTypeLabel(type)}` : '';
  return `${value > 0 ? '+' : ''}${formatNumber(value)}${unitStr}${typeLabel}`;
}

export function getBenefitTypeLabel(type: string): string {
  const map: Record<string, string> = {
    cashback: 'Hoàn tiền',
    points: 'Tích điểm',
    discount: 'Giảm giá',
    miles: 'Dặm bay',
    free_item: 'Quà tặng',
    voucher: 'Voucher',
  };
  return map[type.toLowerCase()] || type;
}

export function getPreferenceLabel(pref: string): { label: string; desc: string; icon: string } {
  const map: Record<string, { label: string; desc: string; icon: string }> = {
    cashback: {
      label: 'Hoàn tiền',
      desc: 'Nhận lại tiền mặt vào tài khoản hàng tháng',
      icon: 'Wallet',
    },
    points: {
      label: 'Tích điểm thưởng',
      desc: 'Tích lũy điểm đổi quà, voucher tiện ích',
      icon: 'Sparkles',
    },
    discount: {
      label: 'Giảm giá trực tiếp',
      desc: 'Trừ tiền trực tiếp ngay khi thanh toán hóa đơn',
      icon: 'Tag',
    },
    travel: {
      label: 'Du lịch & Dặm bay',
      desc: 'Tích dặm bay, phòng chờ thương gia, bảo hiểm du lịch',
      icon: 'Plane',
    },
    low_fee: {
      label: 'Phí thường niên 0đ',
      desc: 'Ưu tiên thẻ miễn phí thường niên hoặc phí rất thấp',
      icon: 'ShieldCheck',
    },
    merchant_benefits: {
      label: 'Ưu đãi thương hiệu',
      desc: 'Đặc quyền đối tác Shopee, Grab, CGV, Starbucks...',
      icon: 'Store',
    },
  };
  return map[pref] || { label: pref, desc: '', icon: 'CreditCard' };
}

export function getBankFullName(bankId?: string | null): string {
  if (!bankId) return 'Ngân hàng đối tác';
  const b = bankId.toUpperCase();
  const map: Record<string, string> = {
    VPB: 'VPBank',
    TCB: 'Techcombank',
    VCB: 'Vietcombank',
    MB: 'MB Bank',
    BIDV: 'BIDV',
    CTG: 'VietinBank',
    HSBC: 'HSBC',
    VIB: 'VIB',
    TPB: 'TPBank',
    STB: 'Sacombank',
    ACB: 'ACB',
  };
  return map[b] || bankId;
}

export function localizeAlternativeTag(bestFor: string): string {
  const map: Record<string, string> = {
    'Best for zero annual fee': 'Ưu thế: Miễn phí thường niên trọn đời',
    'Best for merchant-specific benefits': 'Ưu thế: Giảm giá thương hiệu độc quyền',
    'Best for category rewards': 'Ưu thế: Hoàn tiền danh mục chi tiêu cao',
    'Alternative option': 'Phương án thay thế đáng cân nhắc',
  };
  return map[bestFor] || bestFor;
}

export function getTierBadgeStyle(tier?: string | null): { bg: string; text: string; border: string } {
  const t = (tier || '').toLowerCase();
  if (t.includes('infinite') || t.includes('black') || t.includes('signature')) {
    return {
      bg: 'bg-slate-900',
      text: 'text-amber-300',
      border: 'border-slate-800',
    };
  }
  if (t.includes('platinum')) {
    return {
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300',
    };
  }
  if (t.includes('gold') || t.includes('vàng')) {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    };
  }
  return {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
  };
}

export function getBankColor(bankId?: string | null): { gradient: string; accent: string; text: string } {
  const b = (bankId || '').toUpperCase();
  if (b.includes('VPB') || b.includes('VPBANK')) {
    return {
      gradient: 'from-emerald-800 via-teal-900 to-slate-900',
      accent: '#059669',
      text: 'text-emerald-400',
    };
  }
  if (b.includes('TCB') || b.includes('TECHCOM')) {
    return {
      gradient: 'from-rose-900 via-red-950 to-slate-950',
      accent: '#e11d48',
      text: 'text-rose-400',
    };
  }
  if (b.includes('VCB') || b.includes('VIETCOM')) {
    return {
      gradient: 'from-emerald-900 via-green-950 to-slate-950',
      accent: '#10b981',
      text: 'text-emerald-400',
    };
  }
  if (b.includes('MB')) {
    return {
      gradient: 'from-blue-900 via-indigo-950 to-slate-950',
      accent: '#3b82f6',
      text: 'text-blue-400',
    };
  }
  if (b.includes('BIDV')) {
    return {
      gradient: 'from-cyan-900 via-blue-950 to-slate-950',
      accent: '#06b6d4',
      text: 'text-cyan-400',
    };
  }
  if (b.includes('CTG') || b.includes('VIETIN')) {
    return {
      gradient: 'from-blue-800 via-slate-900 to-slate-950',
      accent: '#2563eb',
      text: 'text-blue-400',
    };
  }
  if (b.includes('HSBC')) {
    return {
      gradient: 'from-red-900 via-neutral-900 to-slate-950',
      accent: '#dc2626',
      text: 'text-red-400',
    };
  }
  return {
    gradient: 'from-slate-800 via-slate-900 to-zinc-950',
    accent: '#0d9488',
    text: 'text-teal-400',
  };
}
