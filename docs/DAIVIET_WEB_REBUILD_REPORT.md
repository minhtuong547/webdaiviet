# Báo cáo dựng lại Đại Việt Web

Trạng thái: `DAIVIET_WEB_FUNCTIONAL_PARTIAL`

## Đã thực hiện

- App Next.js / React / TypeScript mới, landing page responsive phong cách tối và hồng mềm.
- IslePilot server-side GET adapter mẫu và route BFF; khi thiếu key trả trạng thái cấu hình thay vì dữ liệu bịa.
- Tập route portal đã trích tĩnh từ registry, không đưa nội dung mẫu hoặc assets bên thứ ba vào repo.
- Cấu hình Codespaces và GitHub Actions cơ bản.

## Chưa xác minh / bị chặn

- Workspace ban đầu rỗng, không có `.git`, source hoặc remote; kiểm tra remote bằng `git ls-remote` không trả HEAD. Không có commit để tiếp tục và không thể push vào nhánh đã có.
- API key, Steam credentials/session và quyền entitlement chưa được cấu hình. Vì vậy official API response, portal origin, session/CSRF contracts, permissions, payloads và capabilities chưa được xác minh.
- Portal endpoints `/api/...` chỉ được ghi nhận dưới dạng paths trong static reference registry; origin không được suy ra thành contract. Cần owner-provided authorization/configuration để kiểm tra domains.
- Skin editor 3D chưa tích hợp: bundle nêu viewer assets/catalog và đường dẫn model GLB/texture, nhưng các model thực tế không có trong thư mục tham khảo; quyền dùng lại assets chưa rõ. Không sao chép asset mẫu.
- Apply Skin, garage writes, Steam login, dashboard người chơi, LiveMap vị trí thật, admin, market/trade và các thao tác nhạy cảm đều chưa live. Writes vẫn tắt.
- Chưa tích hợp toàn bộ 47 official read endpoints / 24 writes; không có OpenAPI contract khả dụng để khai báo chính xác method/schema/scope.

## Kiểm chứng tham khảo

Static inspection thấy registry liệt kê portal route paths; editor bundle tham chiếu viewer/catalog và model/texture URL, nhưng không chứng minh quyền, schema server hay khả năng truy cập. Tài liệu công khai IslePilot quảng bá API `/api/v1` và một ví dụ GET tickets; điều này không xác nhận endpoint hay entitlement của tài khoản Đại Việt.

Không có credentials nào được ghi vào source hoặc báo cáo. Cần cấu hình secrets và contract chính thức để hoàn tất tích hợp; không đánh dấu API/skin/3D là live.
