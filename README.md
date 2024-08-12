# Trước khi push phải git pull origin main
# FinBud

## Giới thiệu

FinBud là một ứng dụng web cung cấp thông tin tài chính và hỗ trợ người dùng với các tính năng như:

- Tra cứu giá cổ phiếu
- Định nghĩa các thuật ngữ tài chính
- Phân tích cổ phiếu
- Tạo câu đố tài chính


## Cách chạy hệ thống

Để chạy hệ thống, thực hiện các bước sau:

1. Tại thư mục gốc của dự án, chạy lệnh:

    ```bash
    netlify dev
    ```

    Lệnh này sẽ khởi động cả frontend và backend, giúp kiểm thử ứng dụng trước khi triển khai.

2. Lưu ý: Trước khi chạy lệnh trên, đảm bảo đã cài đặt các gói cần thiết bằng cách chạy:

    ```bash
    npm install
    ```


3. Để cấu hình các key API cho bất cứ API nào, nhắn trực tiếp cho Database/Backend Manager (Mr Dũng)

    - Miêu tả tên của key mình đặt, và gửi trực tiếp key + tên key và location đặt key trên file thực thi cho manager.

## Cấu trúc dự án

- **frontend**: Thư mục chứa mã nguồn của giao diện người dùng (Vue.js).
- **backend**: Thư mục chứa mã nguồn của máy chủ (Node.js, Express).

```
FinBud
│
├── .netlify/
│
├── backend/
│   ├── Database Schema/        # Thư mục chứa các file liên quan đến cấu trúc cơ sở dữ liệu
│   ├── Endpoints/              # Thư mục chứa các file định tuyến API
│   │   ├── threadRoute.js      # Định tuyến cho các yêu cầu liên quan đến threads
│   │   └── userRoute.js        # Định tuyến cho các yêu cầu liên quan đến users
│   ├── functions/              # Thư mục chứa các hàm xử lý
│   ├── node_modules/           # Thư mục chứa các module Node.js
│   ├── .gitignore              # File để bỏ qua các file/thư mục không cần thiết trong git
│   ├── package-lock.json       # File quản lý phiên bản của các gói npm
│   ├── package.json            # File cấu hình dự án Node.js
│   ├── README.md               # File tài liệu của dự án
│   └── server.js               # File cấu hình và khởi động server
│
├── frontend/
│   ├── dist/                   # Thư mục chứa các file được biên dịch
│   ├── node_modules/           # Thư mục chứa các module Node.js
│   ├── public/                 # Thư mục chứa các file tĩnh
│   ├── src/                    # Thư mục chứa mã nguồn frontend
│   │   ├── assets/             # Thư mục chứa các tài nguyên như hình ảnh, CSS
│   │   ├── components/         # Thư mục chứa các component Vue.js
│   │   ├── router/             # Thư mục chứa cấu hình định tuyến Vue.js
│   │   ├── services/           # Thư mục chứa các dịch vụ như gọi API
│   │   └── views/              # Thư mục chứa các view của ứng dụng
│   │       ├── AboutUsPage.vue
│   │       ├── ChatView.vue
│   │       ├── GoalPage.vue
│   │       ├── Home.vue
│   │       ├── LoginView.vue
│   │       ├── MarketDataCenter.vue
│   │       ├── PricingPage.vue
│   │       ├── QuizPage.vue
│   │       └── RecommendationGenerator.vue
│   └── vue.config.js           # File cấu hình Vue.js
```
## Triển khai ứng dụng (deploy)

Khi đã sẵn sàng để triển khai ứng dụng lên Netlify, thực hiện các bước sau:

1. Đăng nhập vào Netlify:

    ```bash
    netlify login
    netlify link
    ``` `

    **Lưu ý**: Đảm bảo đang sử dụng tài khoản có email tbui@macalester.edu để có quyền triển khai.

2. Triển khai ứng dụng:

    ```bash
    netlify dev
    ```


## Các lưu ý khác

- **Kiểm tra cấu hình server**: Đảm bảo rằng tất cả các endpoint API đều hoạt động bình thường trước khi triển khai.
- **Kiểm tra giao diện**: Kiểm tra kỹ lưỡng giao diện người dùng trên các trình duyệt khác nhau để đảm bảo tính tương thích.
