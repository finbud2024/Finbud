# FinBud

## Giới thiệu

FinBud là một ứng dụng web cung cấp thông tin tài chính và hỗ trợ người dùng với các tính năng như:

- Tra cứu giá cổ phiếu
- Định nghĩa các thuật ngữ tài chính
- Phân tích cổ phiếu
- Tạo câu đố tài chính

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
│   ├── dist/                   # Thư mục chứa các file được biên dịch
│   ├── Endpoints/              # Thư mục chứa các file định tuyến API
│   │   ├── threadRoute.js      # Định tuyến cho các yêu cầu liên quan đến threads
│   │   └── userRoute.js        # Định tuyến cho các yêu cầu liên quan đến users
│   ├── functions/              # Thư mục chứa các hàm xử lý
│   ├── node_modules/           # Thư mục chứa các module Node.js
│   ├── .env                    # File chứa các biến môi trường cho backend
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
│   ├── .env.local              # File chứa các biến môi trường cho frontend
│   └── vue.config.js           # File cấu hình Vue.js
```

## Cách chạy hệ thống

Để chạy hệ thống, thực hiện các bước sau:

1. Tại thư mục gốc của dự án, chạy lệnh:

    ```bash
    npm run start
    ```

    Lệnh này sẽ khởi động cả frontend và backend, giúp kiểm thử ứng dụng trước khi triển khai.

2. Lưu ý: Trước khi chạy lệnh trên, đảm bảo đã cài đặt các gói cần thiết bằng cách chạy:

    ```bash
    npm install
    npm update
    ```

3. Để cấu hình các key API cho OpenAI GPT và AlphaVantage, tạo các tệp `.env` như sau:

    - Tạo tệp `.env.local` trong thư mục `frontend` với nội dung:

        ```env
        VUE_APP_API_URL=http://localhost:3000
        VUE_APP_NEWS_API_KEY=7eac0646bd5d43d0a4d5d5bfd8a3a95c
        ```

    - Tạo tệp `.env` trong thư mục `backend` và điền nội dung:

        ```env
        ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
        OPENAI_API_KEY=your_openai_api_key
        ```

    Việc này sẽ khởi động một server phát triển và ứng dụng Vue.js sẽ được cập nhật thời gian thực trên trình duyệt.

## Triển khai ứng dụng (deploy)

Khi đã sẵn sàng để triển khai ứng dụng lên Netlify, thực hiện các bước sau:

1. Đăng nhập vào Netlify:

    ```bash
    netlify login
    ```

    **Lưu ý**: Đảm bảo đang sử dụng tài khoản có email tbui@macalester.edu để có quyền triển khai.

2. Triển khai ứng dụng:

    ```bash
    netlify deploy
    ```

    Sau đó, làm theo các hướng dẫn từ Netlify để hoàn tất quá trình triển khai.

## Các lưu ý khác

- **Cài đặt môi trường**: Đảm bảo đã cấu hình đầy đủ tệp `.env` cho cả frontend và backend trên local.
- **Kiểm tra cấu hình server**: Đảm bảo rằng tất cả các endpoint API đều hoạt động bình thường trước khi triển khai.
- **Kiểm tra giao diện**: Kiểm tra kỹ lưỡng giao diện người dùng trên các trình duyệt khác nhau để đảm bảo tính tương thích.
