# Cardy Vietnam — Contextual Credit Card & Wallet Optimization

Cardy là sản phẩm web hỗ trợ người tiêu dùng Việt Nam đưa ra quyết định sử dụng thẻ tín dụng và tối ưu hóa ví thẻ thông minh dựa trên ngữ cảnh thực tế của từng giao dịch (khoản tiền, địa điểm, thương hiệu mua sắm, khẩu vị hoàn tiền/tích điểm, và danh mục thẻ hiện có).

---

## 1. Triết lý sản phẩm

> **"Dựa trên món đồ tôi đang mua, quyền lợi tôi coi trọng, và các thẻ tôi đang có hoặc có thể mở, hãy giúp tôi đưa ra quyết định quẹt thẻ tốt nhất."**

- **Không phong danh "Thẻ tốt nhất chung chung"**: Một chiếc thẻ hoàn 15% mua sắm online có thể không có giá trị gì khi đi ăn uống hay du lịch. Quyết định luôn phụ thuộc vào ngữ cảnh chi tiêu.
- **Tập trung vào giá trị thực**: Tính toán số tiền hoàn thưởng hoặc tiết kiệm thực tế (VND) thay vì các thang điểm trừu tượng.
- **Minh bạch điều khoản**: Luôn hiển thị phí thường niên, điều kiện miễn phí, hạn mức hoàn tối đa và chi tiêu tối thiểu.

---

## 2. Các hành trình người dùng chính (Core Journeys)

1. **Journey A — "Tôi sắp mua sắm một món hàng"**:
   - Nhập ngành hàng (Online, Ăn uống, Siêu thị, Du lịch...) hoặc thương hiệu (Shopee, Grab, CGV, Agoda, Starbucks...).
   - Nhập số tiền chi tiêu (kèm phím chọn nhanh 500k, 1M, 2M, 5M, 10M).
   - Chọn tiêu chí ưu tiên (Hoàn tiền, Tích điểm, Giảm giá, Du lịch, Phí thấp, Ưu đãi đối tác).
   - Tùy chọn lọc: "Chỉ chọn thẻ trong ví tôi đang có" hoặc "Tìm thẻ trên toàn thị trường".
   - Kết quả trực quan: Thẻ nên dùng, lợi ích ước tính (VND), lý do phù hợp, các thẻ thay thế đáng cân nhắc và lưu ý điều khoản.

2. **Journey B — "Tôi muốn tìm thẻ mới để mở"**:
   - Nhập mức thu nhập hàng tháng.
   - Chọn quyền lợi ưu tiên và các danh mục chi tiêu thường xuyên.
   - Giới hạn phí thường niên mong muốn (0đ, dưới 500k, dưới 1 triệu).
   - Hệ thống lọc điều kiện phát hành và xếp hạng thẻ phù hợp nhất.

3. **Journey C — "Quản lý ví & Tối ưu hóa danh mục"**:
   - Theo dõi danh sách thẻ đang sở hữu trong ví.
   - Thêm / Gỡ thẻ khỏi ví dễ dàng.
   - Cấu hình hồ sơ ngân sách chi tiêu hàng tháng theo từng nhóm ngành.
   - **Bản đồ quẹt thẻ thông minh**: Chỉ dẫn danh mục nào nên dùng thẻ nào trong ví để đạt lợi ích tối đa trong năm.
   - **Cảnh báo khoảng trống (Gap alerts)**: Phát hiện danh mục chi tiêu lớn nhưng ví chưa có thẻ hoàn tiền mạnh.

4. **Journey D — "Mô phỏng mở thêm thẻ mới (What-If Simulation)"**:
   - Chọn một thẻ ứng viên trên thị trường.
   - So sánh trực tiếp: **Ví hiện tại** vs **Ví hiện tại + Thẻ mới**.
   - Tính toán mức tăng thêm ròng (Annual Gain) và bảng chi tiết các danh mục được cải thiện.
   - Trả lời thẳng thắn: *"Có đáng để mở thêm thẻ này không?"*

5. **Khám phá & So sánh thẻ**:
   - Bộ lọc theo ngân hàng (VPBank, Techcombank, Vietcombank, MB, BIDV, VietinBank, HSBC...), tổ chức thẻ (Visa, Mastercard, JCB), hạng thẻ (Classic, Gold, Platinum, Signature).
   - So sánh song song tối đa 3 thẻ tín dụng về phí, thu nhập, quyền lợi và ưu đãi đối tác.

---

## 3. Kiến trúc kỹ thuật

### Backend (FastAPI + PostgreSQL + SQLAlchemy)
- `app/api/`: Các router REST API chuẩn hóa:
  - `GET /api/cards`, `GET /api/cards/{card_id}`
  - `POST /api/cards/compare`
  - `GET /api/merchants`, `GET /api/categories`, `GET /api/merchants/categories`
  - `GET /api/wallet`, `POST /api/wallet/cards`, `DELETE /api/wallet/cards/{card_id}`
  - `POST /api/wallet/optimize`
  - `GET /api/spending-profile`, `PUT /api/spending-profile`
  - `POST /api/recommendation`
  - `POST /api/rewards/calculate`
  - `POST /api/wallet/simulate`
- `app/services/`: Recommendation Engine, Reward Calculator, Wallet Optimizer.
- Phân biệt người dùng qua header `X-User-ID`.

### Frontend (React + TypeScript + Vite + Tailwind CSS)
- **Centralized API Client** (`frontend/src/api/`): Toàn bộ lời gọi API được đóng gói chuẩn mực, không gọi fetch rải rác trong UI components.
- **Component Design System**:
  - Thẻ tín dụng mô phỏng thực tế (`CreditCardVisual`) với chip kim loại, nhận diện ngân hàng và hạng thẻ sang trọng.
  - Phù hợp sản phẩm tài chính tiêu dùng cao cấp, thông tin phân cấp rõ ràng, phông chữ Plus Jakarta Sans sắc nét.
  - Xử lý mượt mà trạng thái loading, lỗi, rỗng và phản hồi tương tác tức thì.

---

## 4. Hướng dẫn khởi chạy ứng dụng

### Khởi chạy Backend
```bash
# Kích hoạt môi trường và chạy FastAPI bằng uvicorn
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API docs có tại: `http://127.0.0.1:8000/api/docs`

### Khởi chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
Ứng dụng mở tại: `http://127.0.0.1:5173/` (Vite tự động proxy các request `/api` sang backend `8000`).
