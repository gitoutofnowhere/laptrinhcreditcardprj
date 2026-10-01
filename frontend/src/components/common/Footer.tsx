import React from 'react';
import { CreditCard, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Right<span className="text-teal-600">Card</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Nền tảng trợ lý thông minh ra quyết định dùng thẻ tín dụng và tối ưu hóa ví thẻ hàng
              đầu tại Việt Nam. Đề xuất chuẩn xác theo từng món đồ, địa điểm và quyền lợi thực tế
              thay vì bảng xếp hạng chung chung.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-teal-600" /> Dữ liệu cập nhật từ các ngân hàng VN
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tính toán lợi ích theo ngữ cảnh
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Trải nghiệm người dùng
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <span className="hover:text-slate-900">Chuẩn bị mua sắm (Journey A)</span>
              </li>
              <li>
                <span className="hover:text-slate-900">Tìm thẻ mới để mở (Journey B)</span>
              </li>
              <li>
                <span className="hover:text-slate-900">Quản lý ví & Tối ưu danh mục (Journey C)</span>
              </li>
              <li>
                <span className="hover:text-slate-900">Mô phỏng thêm thẻ mới (Journey D)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Nguyên tắc sản phẩm
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Không có chiếc thẻ nào là tốt nhất cho mọi người. RightCard chỉ gợi ý chiếc thẻ phù
              hợp nhất cho quyết định chi tiêu ngay lúc này của bạn.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 RightCard Vietnam. Bản quyền thuộc về RightCard Team.</p>
          <p className="text-[11px]">Hỗ trợ kết nối API trực tiếp từ hệ thống PostgreSQL & FastAPI</p>
        </div>
      </div>
    </footer>
  );
};
