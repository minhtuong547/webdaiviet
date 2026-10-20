# Đại Việt Web

Cổng cộng đồng The Isle Evrima dùng Next.js App Router, React và TypeScript.

## Chạy trên Windows / Codespaces

Yêu cầu Node.js 22+ và npm. Trong PowerShell chạy `Copy-Item .env.example .env.local` (nếu file chưa tồn tại), mở `.env.local` bằng VS Code/Notepad và nhập secrets trực tiếp. Không dùng `echo`, command-line arguments, transcript hoặc chat để truyền secret. Sau đó chạy `npm ci` và `npm run dev`. Codespaces cài dependencies tự động và forward port 3000; đặt secret qua Codespaces Secrets, không ghi vào repo.

Biến `ISLEPILOT_API_KEY` chỉ được đọc phía server; API key cần scopes read cho các endpoint định dùng. Khi chưa có key, UI thể hiện trạng thái chưa cấu hình; không dùng dữ liệu giả. `STEAM_AUTH_ENABLED`, `ISLEPILOT_WRITES_ENABLED` và `ADMIN_ACTIONS_ENABLED` mặc định tắt. Steam login vẫn disabled tới khi OpenID flow được cấu hình và xác minh. Tạo `SESSION_SECRET` bằng password manager hoặc `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`; không in secret vào log/chia sẻ.

## Kiểm tra / production

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, sau đó `npm run start`. `npm run check` chạy toàn bộ.

## Cấu trúc

- `src/app`: giao diện và BFF route handlers.
- `src/lib/api`: IslePilot client và route registry.
- `docs`: báo cáo tích hợp và giới hạn đã xác minh.

Đặt remote GitHub về `https://github.com/minhtuong547/webdaiviet.git` trước khi publish; không force-push. Chỉ đẩy sau khi kiểm tra trạng thái remote và secrets.
