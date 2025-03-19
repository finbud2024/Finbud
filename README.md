# Trước khi push phải git pull origin main
# FinBud

## Giới thiệu

FinBud là một ứng dụng web cung cấp thông tin tài chính và hỗ trợ người dùng với các tính năng như:

- Tra cứu giá cổ phiếu
- Định nghĩa các thuật ngữ tài chính
- Phân tích cổ phiếu
- Tạo câu đố tài chính


## Cấu trúc dự án

Document giải thích sâu hơn về các file dự án ở đây: [Finbud Repository Overview](https://docs.google.com/document/d/1TNtH2m3gdHDxftQPXouTAUG8ZS5KFvtng3Kl3ZmVuX0/edit?fbclid=IwY2xjawIhCMBleHRuA2FlbQIxMQABHe1YxYJ_w5b59UivgFiwDaJJcgAOyoSiPFLqyHQF0vqszBJL-c4rdFxB8g_aem_O8G6W-EkpEBovb80vsQKeA&pli=1&tab=t.0)

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

Cách để tải Netlify package và những package cần thiết:


### 1. Tải package cần thiết

```sh
npm install
```


### 2. Tải Netlify-cli (giao diện dòng lệnh cho Netlify)


```sh
npm install -g netlify-cli
```


Tiếp theo, chạy lệnh để kiểm tra xem Netlify đã được cài đặt thành công chưa.


```sh
netlify --version
```


Nếu hệ thống trả về như này hoặc tương tự thì đã thành công.


```sh
netlify-cli/18.1.0 darwin-arm64 node-v20.18.3
```


### 3. Kết nối repository với Netlify


Sử dụng lệnh này để kết nối repo hiện tại với Netlify website (phải dùng github account Finbud để đăng nhập vào Netlify trước) thì sẽ hiện ra một trang để authorize cho Netlify.


```sh
netlify link
```


sau khi authorize xong thì vào terminal và chọn "Use current git remote origin (https://github.com/finbud2024/Finbud)" 


```sh
 How do you want to link this folder to a site? (Use arrow keys)
❯ Use current git remote origin (https://github.com/finbud2024/Finbud) 
  Search.svg by full or partial site name 
  Choose from a list of your recently updated sites 
  Enter a site ID 
```


cuối cùng sử dụng lệnh dưới đây và dùng url "http://localhost:8888/" 


```sh
netlify dev
```


## Các lưu ý khác

- **Kiểm tra cấu hình server**: Đảm bảo rằng tất cả các endpoint API đều hoạt động bình thường trước khi triển khai.
- **Kiểm tra giao diện**: Kiểm tra kỹ lưỡng giao diện người dùng trên các trình duyệt khác nhau để đảm bảo tính tương thích.
