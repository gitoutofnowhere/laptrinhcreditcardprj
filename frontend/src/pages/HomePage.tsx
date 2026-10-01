import React from 'react';
import { Button } from '../components/common/Button';
import { NavTab } from '../components/common/Navbar';
import { CardyMascot } from '../components/brand/Mascot';
import {
  Sparkles,
  ShoppingBag,
  CreditCard,
  Wallet,
  TrendingUp,
  Compass,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: NavTab) => void;
  walletCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, walletCount }) => {
  return (
    <div className="space-y-16 py-6 sm:py-10 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-900 text-white rounded-3xl p-8 sm:p-12 md:p-16 border border-navy-950 shadow-lift">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-sun/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] items-center gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-sun" />
              <span>Không biết chọn card nào? Cardy xem chooo</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-[-0.03em] text-white">
              Thanh toán card đi? <br />
              <span className="text-sun">Để Cardy!</span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-xl">
              Thẻ tốt chưa chắc là thẻ hợp với bạn. Kể Cardy nghe bạn hay tiêu vào đâu, Cardy gợi ý
              vài chiếc card có benefit đúng chỗ bạn cần. Đừng chọn card đại!
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => onNavigate('recommend')}
                icon={<ArrowRight className="w-4 h-4 text-white" />}
                className="font-bold text-base"
              >
                Tìm card hợp với bạn
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('explore')}
                icon={<Compass className="w-4 h-4 text-blue-200" />}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold"
              >
                Xem danh sách thẻ
              </Button>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-blue-200/80 border-t border-white/15">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sun" />
                <span>30+ thẻ ngân hàng VN</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sun" />
                <span>Quyền lợi tính bằng tiền thật (VND)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sun" />
                <span>Trung lập, không thiên vị</span>
              </div>
            </div>
          </div>

          {/* Hero Mascot Character */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl transform scale-90 pointer-events-none" />
              <CardyMascot pose="hello" size={260} className="relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Scenarios Navigation */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Đi đâu, card gì? Cardy lo.
          </h2>
          <p className="text-xs text-ink-2">
            Chọn tình huống thực tế của bạn để Cardy chỉ ngay chiếc card ngon nhất:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Purchase Recommendation */}
          <div
            onClick={() => onNavigate('recommend')}
            className="group bg-white p-6 rounded-3xl border border-line shadow-card hover:shadow-lift hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Chuẩn bị thanh toán
              </span>
              <h3 className="text-base font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                Tôi sắp mua sắm một món đồ
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Nhập số tiền và nơi mua sắm (Shopee, Grab, Starbucks...) để xem card nào có benefit ở đây.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-line flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
              <span>Card đi →</span>
            </div>
          </div>

          {/* Card 2: Find Card to Open */}
          <div
            onClick={() => onNavigate('recommend')}
            className="group bg-white p-6 rounded-3xl border border-line shadow-card hover:shadow-lift hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                Tìm card mở mới
              </span>
              <h3 className="text-base font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                Tôi muốn tìm thẻ mới để mở
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Sàng lọc theo thu nhập, phí thường niên và sở thích hoàn tiền, tích dặm bay hay ưu đãi quán quen.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-line flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
              <span>Tìm card hợp gu →</span>
            </div>
          </div>

          {/* Card 3: Wallet Optimization */}
          <div
            onClick={() => onNavigate('wallet')}
            className="group bg-white p-6 rounded-3xl border border-line shadow-card hover:shadow-lift hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Ví của bạn ({walletCount} thẻ)
              </span>
              <h3 className="text-base font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                Đi đâu, card gì?
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Xem thẻ nào nên quẹt cho từng nhóm ngành và phát hiện ngay những danh mục chưa có thẻ mạnh.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-line flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
              <span>Xem ví của bạn →</span>
            </div>
          </div>

          {/* Card 4: What-If Simulation */}
          <div
            onClick={() => onNavigate('wallet')}
            className="group bg-white p-6 rounded-3xl border border-line shadow-card hover:shadow-lift hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                So thử card mới
              </span>
              <h3 className="text-base font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                Mở thêm thẻ có đáng không?
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Đang phân vân? So thử hai card xem chiếc mới có mang lại thêm quyền lợi vượt trội hay không.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-line flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
              <span>So thử nhé →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cardy 3-Step Philosophy */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-line shadow-card">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Cách Cardy hoạt động
          </span>
          <h2 className="font-display text-2xl font-black text-navy-900 tracking-tight">
            Chọn card đúng gu trong 3 bước
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 rounded-2xl bg-paper border border-line">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-display font-black text-lg flex items-center justify-center shadow-press">
              1
            </div>
            <h4 className="text-base font-bold text-navy-900">Kể Cardy nghe</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Ăn ngoài, mua online hay đi xa? Chọn vài mục bạn tiêu nhiều nhất trong tháng.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-paper border border-line">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-display font-black text-lg flex items-center justify-center shadow-press">
              2
            </div>
            <h4 className="text-base font-bold text-navy-900">Xem card hợp gu</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Hoàn tiền, phí thường niên và ưu đãi đối tác — được đặt cạnh nhau minh bạch, dễ so sánh.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-paper border border-line">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-display font-black text-lg flex items-center justify-center shadow-press">
              3
            </div>
            <h4 className="text-base font-bold text-navy-900">Chọn card đi</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Ưng chiếc nào thì lưu vào ví để theo dõi hoặc xem chi tiết để đăng ký trực tiếp với ngân hàng.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
