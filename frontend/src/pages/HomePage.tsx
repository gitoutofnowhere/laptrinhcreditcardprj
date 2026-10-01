import React from 'react';
import { Button } from '../components/common/Button';
import { NavTab } from '../components/common/Navbar';
import {
  Sparkles,
  ShoppingBag,
  CreditCard,
  Wallet,
  TrendingUp,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: NavTab) => void;
  walletCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, walletCount }) => {
  return (
    <div className="space-y-16 py-6 sm:py-10 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold border border-teal-500/20 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Trợ lý cố vấn thẻ tín dụng theo ngữ cảnh thực tế</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Nên quẹt thẻ nào hôm nay?
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Không có chiếc thẻ nào là tốt nhất cho tất cả mọi người. RightCard đối chiếu chính xác{' '}
            <strong className="text-white">bạn đang mua gì</strong>,{' '}
            <strong className="text-teal-400">bạn ưu tiên điều gì</strong>, và{' '}
            <strong className="text-amber-300">chiếc thẻ nào trong ví</strong> đem lại nhiều tiền
            hoàn nhất ngay tại thời điểm thanh toán.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => onNavigate('recommend')}
              icon={<Sparkles className="w-4 h-4 text-slate-950" />}
              className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-black shadow-lg shadow-teal-500/20"
            >
              Gợi ý thẻ cho khoản chi của tôi
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('explore')}
              icon={<Compass className="w-4 h-4 text-slate-300" />}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold"
            >
              Khám phá 30+ thẻ tín dụng
            </Button>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Dữ liệu 30+ thẻ ngân hàng VN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Tính toán số tiền nhận lại thật (VND)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Trung lập 100%, không thiên vị</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Scenarios Navigation */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Bạn muốn giải quyết vấn đề gì?
          </h2>
          <p className="text-xs text-slate-500">
            Chọn nhu cầu thực tế của bạn để RightCard hỗ trợ ra quyết định tài chính chuẩn xác:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Purchase Recommendation */}
          <div
            onClick={() => onNavigate('recommend')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block">
                Chuẩn bị thanh toán
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Tôi sắp mua sắm một món hàng
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhập số tiền và nơi mua sắm (Shopee, Grab, vé máy bay...) để biết quẹt thẻ nào được
                hoàn nhiều tiền nhất.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
              <span>Gợi ý thẻ quẹt ngay</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Find Card to Open */}
          <div
            onClick={() => onNavigate('recommend')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                Mở thẻ mới
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                Tôi muốn tìm thẻ mới để mở
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sàng lọc theo thu nhập, mức phí thường niên và sở thích hoàn tiền, tích dặm bay hoặc
                giảm giá trực tiếp.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
              <span>Tìm thẻ phù hợp</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Wallet Optimization */}
          <div
            onClick={() => onNavigate('wallet')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                Ví cá nhân ({walletCount} thẻ)
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Bản đồ quẹt thẻ thông minh
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tối ưu hóa thẻ nào nên quẹt cho từng nhóm ngành và phát hiện ngay những danh mục chưa
                có thẻ mạnh.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>Xem ví của tôi</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: What-If Simulation */}
          <div
            onClick={() => onNavigate('wallet')}
            className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                Mô phỏng ví What-If
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Mở thêm thẻ có đáng không?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đối chiếu trực tiếp quyền lợi nhận thêm trước khi nộp hồ sơ mở thẻ, tránh mở thẻ
                thừa gây tốn phí thường niên.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Chạy mô phỏng</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Philosophy & Differentiator */}
      <section className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-teal-600 font-extrabold text-sm uppercase tracking-wider">
              01. Theo ngữ cảnh thực tế
            </div>
            <h4 className="text-base font-bold text-slate-900">Không có thẻ "tốt nhất mọi mặt"</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Một chiếc thẻ hoàn 15% mua sắm online có thể không mang lại lợi ích gì khi bạn đi ăn
              uống hay đi máy bay. RightCard phân tích chính xác từng mục tiêu.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-teal-600 font-extrabold text-sm uppercase tracking-wider">
              02. Quyền lợi tính bằng tiền
            </div>
            <h4 className="text-base font-bold text-slate-900">Không đánh đố bằng điểm số</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thay vì hiển thị "Điểm uy tín: 92/100", RightCard tính toán trực tiếp số tiền đồng bạn
              sẽ nhận lại hoặc tiết kiệm được trên mỗi giao dịch.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-teal-600 font-extrabold text-sm uppercase tracking-wider">
              03. Minh bạch điều khoản
            </div>
            <h4 className="text-base font-bold text-slate-900">Làm rõ những gì bạn phải đánh đổi</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chúng tôi luôn chỉ rõ phí thường niên, hạn mức hoàn tối đa và điều kiện chi tiêu tối
              thiểu để bạn không bị bất ngờ bởi các điều khoản ẩn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
