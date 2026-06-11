<div align="center">

# 🩺 Medical Chatbot Front-end

**Giao diện web cho hệ thống chatbot y tế, gồm trang người dùng, trang quản trị và dashboard phân tích dữ liệu.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white)

</div>

---
<img width="1919" height="1010" alt="Screenshot from 2026-06-11 20-44-07" src="https://github.com/user-attachments/assets/325ac818-86a4-4672-8800-5d615e2e8737" />

## 📌 Mô tả ngắn

`front-end` là ứng dụng React/Vite dùng cho nền tảng Medical Chatbot. Ứng dụng cung cấp giao diện chat cho người dùng cuối và khu vực quản trị để theo dõi người dùng, hội thoại, tin nhắn, phân quyền, cấu hình hệ thống và dashboard BI.

> ⚠️ **Lưu ý y tế**  
> Nội dung phản hồi từ chatbot chỉ phục vụ mục đích tham khảo và hỗ trợ thông tin. Không sử dụng thay thế cho chẩn đoán hoặc tư vấn từ bác sĩ/chuyên gia y tế.

---

## 🖼️ Demo / Preview

```txt
Local URL:       http://localhost:5173
Client Chat:     /
Admin Login:     /admin/login
Admin Dashboard: /admin/dashboard
```

Các màn hình chính:

- 💬 Chat y tế cho người dùng.
- 🔐 Đăng nhập/đăng ký người dùng.
- 🧭 Layout quản trị riêng cho admin.
- 📊 Dashboard BI nhúng từ Apache Superset.
- 👥 Quản lý user, account, role, permission.
- 🧾 Theo dõi conversation và message.

---

## ✨ Tính năng

- Chatbot UI hỗ trợ hiển thị Markdown/GFM.
- Quản lý phiên đăng nhập client và admin.
- Private route và unauthorized route cho từng nhóm người dùng.
- Giao diện quản trị người dùng, tài khoản, vai trò và quyền.
- Trang theo dõi hội thoại, tin nhắn và cấu hình hệ thống.
- Tích hợp dashboard BI qua Superset Embedded SDK.
- Axios client tách riêng cho admin/client.
- Toast notification, form handling và responsive layout.
- Styling bằng TailwindCSS kết hợp Material UI khi cần.

---

## 🧰 Tech Stack

| Nhóm | Công nghệ |
|---|---|
| Core | React 19, Vite 7 |
| Routing | React Router DOM 7 |
| Styling | TailwindCSS 4, Material UI, Emotion |
| HTTP Client | Axios |
| Form | React Hook Form |
| Markdown | React Markdown, Remark GFM |
| Icons | Lucide React, React Icons |
| Notification | React Toastify |
| BI | Superset Embedded SDK |
| Quality | ESLint |

---

## 📁 Cấu trúc project

```txt
front-end/
├── src/
│   ├── apis/
│   │   ├── Admin/              # API client cho khu vực admin
│   │   ├── Client/             # API client cho người dùng
│   │   └── General/            # API dùng chung
│   ├── components/
│   │   ├── Admin/              # Component quản trị
│   │   └── Client/             # Component người dùng
│   ├── contexts/               # Auth context cho admin/client
│   ├── hooks/                  # Custom hooks
│   ├── layouts/                # Layout admin/client
│   ├── pages/
│   │   ├── Admin/              # Dashboard, user, role, message...
│   │   ├── Client/             # Chat, setting, policy, auth...
│   │   └── 404/
│   ├── utils/                  # Axios config, constants
│   ├── App.jsx                 # Khai báo routes chính
│   ├── AppProviders.jsx
│   └── main.jsx
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Cài đặt

### Yêu cầu môi trường

- Node.js 20+
- Yarn 1.x, npm hoặc pnpm
- Back-end API đang chạy

### Cài dependencies

```bash
cd front-end
yarn install
```

Hoặc dùng npm/pnpm:

```bash
npm install
# hoặc
pnpm install
```

---

## 🔐 Biến môi trường (`.env`)

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

| Biến | Ví dụ | Mô tả |
|---|---|---|
| `VITE_API_ROOT` | `http://localhost:3000` | Base URL của Node.js back-end API. |

Ví dụ:

```env
VITE_API_ROOT=http://localhost:3000
```

> 💡 **Note**  
> Với Vite, biến môi trường dùng ở phía client phải bắt đầu bằng tiền tố `VITE_`.

---

## 🚀 Chạy local

```bash
cd front-end
yarn dev
```

Ứng dụng sẽ chạy tại:

```txt
http://localhost:5173
```

Nếu dùng npm/pnpm:

```bash
npm run dev
# hoặc
pnpm dev
```

---

## 🏭 Build production

```bash
cd front-end
yarn build
```

Thư mục build:

```txt
dist/
```

Preview bản production:

```bash
yarn preview
```

---

## 🔌 Cấu hình API

Front-end đọc API root từ:

```js
export const API_ROOT = import.meta.env.VITE_API_ROOT
```

Các nhóm route chính:

```txt
Client
├── /
├── /chat/:id
├── /login
├── /register
├── /settings
├── /upgrade
├── /usage-policy
└── /privacy-policy

Admin
├── /admin/login
├── /admin/dashboard
├── /admin/users
├── /admin/accounts
├── /admin/conversations
├── /admin/messages
├── /admin/settings
├── /admin/roles
└── /admin/permissions
```

Kiến trúc giao tiếp:

```txt
React UI
  │
  ├── Client Axios Instance
  │     └── /api/v1/*
  │
  └── Admin Axios Instance
        └── /api/admin/v1/*
```

---

## 🚢 Deployment

Có thể deploy lên:

- Vercel
- Netlify
- Nginx static hosting
- Docker/static server

Quy trình đề xuất:

```bash
yarn install
yarn build
```

Sau đó deploy thư mục:

```txt
dist/
```

Checklist production:

- Cấu hình đúng `VITE_API_ROOT`.
- Back-end API bật CORS cho domain front-end.
- Sử dụng HTTPS ở môi trường thật.
- Kiểm tra cookie/session hoạt động đúng với domain production.
- Kiểm tra dashboard Superset được allow embed domain.

---

## 🧪 Kiểm tra chất lượng

```bash
yarn lint
```

---

