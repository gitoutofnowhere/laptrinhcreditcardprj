import React from 'react';
import { CardyLogo } from '../brand/Logo';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-line bg-white mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <CardyLogo size={32} tagline={true} />
            <p className="text-xs text-ink-2 leading-relaxed max-w-md">
              Thẻ tốt chưa chắc là thẻ hợp với bạn. Kể Cardy nghe bạn hay tiêu vào đâu, Cardy gợi ý
              vài chiếc card có benefit đúng chỗ bạn cần. Đừng chọn card đại!
            </p>
            <div className="flex items-center gap-4 text-[11px] text-ink-3 pt-1">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Dữ liệu 30+ thẻ ngân hàng VN
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sun" />
                Quyền lợi tính bằng tiền thật (VND)
              </span>
            </div>
          </div>

          {/* User Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
              Khám phá Cardy
            </h4>
            <ul className="space-y-2.5 text-xs text-ink-2 font-medium">
              <li>
                <span className="hover:text-blue-600 cursor-pointer">Đi đâu, card gì?</span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer">Tìm card mở mới hợp gu</span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer">Ví thẻ & Mẹo quẹt thẻ</span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer">So sánh phí & ưu đãi</span>
              </li>
            </ul>
          </div>

          {/* Principle */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
              Nguyên tắc của Cardy
            </h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              Không có chiếc thẻ nào là tốt nhất cho tất cả mọi người. Cardy chỉ gợi ý chiếc thẻ phù
              hợp nhất cho quyết định chi tiêu ngay lúc này của bạn.
            </p>
          </div>
        </div>

        <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-3 gap-3">
          <p>© 2026 Cardy Vietnam. Thanh toán card đi? Để Cardy!</p>
          <p className="text-[11px]">Cardy Card đi. · Brand system v1.1</p>
        </div>
      </div>
    </footer>
  );
};
