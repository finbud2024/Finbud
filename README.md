# FinBud

## Giới thiệu

FinBud là một ứng dụng web cung cấp thông tin tài chính và hỗ trợ người dùng với các tính năng như tra cứu giá cổ phiếu, định nghĩa các thuật ngữ tài chính, phân tích cổ phiếu và tạo câu đố tài chính.

## Cấu trúc dự án

- **frontend**: Thư mục chứa mã nguồn của giao diện người dùng (Vue.js).
- **backend**: Thư mục chứa mã nguồn của máy chủ (Node.js, Express).

## Cách chạy hệ thống

### Cách 1: Sử dụng `netlify dev`

Cách này phục vụ quá trình deploy/publish lên Netlify.

1. **Cài đặt Netlify CLI**:

```bash
npm install -g netlify-cli
```

2. Chạy Netlify Dev:

Ở thư mục gốc của dự án, chạy lệnh sau:

```bash
netlify dev
```

Lệnh này sẽ chạy cả frontend và backend, giúp nên sử dụng cho quá trình kiểm thử trước khi deploy/publish

### Cách 2: Chạy riêng frontend và backend

Cách này phục vụ quá trình dev, debug và build app.

#### Chạy Backend:

Mở terminal, di chuyển vào thư mục backend (cd backend) và chạy lệnh sau:

```bash
node server.js
```

Đảm bảo rằng server đang lắng nghe trên cổng (listening/running on port)  đã định nghĩa (mặc định là 3000).

#### Chạy Frontend:
Trước khi chạy frontend hãy đảm bảo đã install vue-cli và axios trong folder frontend (cd frontend):

```bash
npm install vue-cle
npm install axios
```

Mở một terminal khác song song, di chuyển vào thư mục frontend (cd frontend) và chạy lệnh sau:

```bash
npm install 
npm run serve
```

Lưu ý: Nếu đã npm install rồi thì không cần cài lại nữa

Điều này sẽ khởi động một server phát triển và ứng dụng Vue.js sẽ được cập nhật thời gian thực trên trình duyệt.

## Triển khai ứng dụng (deploy)

Nếu đã sẵn sàng để triển khai ứng dụng lên Netlify, hãy làm theo các bước sau:

1. Đăng nhập Netlify:

```bash
netlify login
```

Lưu ý: Đảm bảo rằng đang ở tài khoản có email tbui@macalester.edu để có quyền deploy

2. Triển khai ứng dụng:

```bash
netlify deploy
```

Sau đó, có thể follow các hướng dẫn từ Netlify để hoàn tất quá trình triển khai.

## Các lưu ý khác

- **Cài đặt môi trường**: Đảm bảo rằng bạn đã cấu hình đầy đủ tệp `.env` cho cả frontend và backend trên local của bạn.
- **Kiểm tra lại cấu hình server**: Đảm bảo rằng tất cả các endpoint API đều hoạt động bình thường trước khi deploy.
- **Kiểm tra giao diện**: Kiểm tra kỹ lưỡng giao diện người dùng trên các trình duyệt khác nhau để đảm bảo tính tương thích.
```