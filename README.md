# WebRTC Real-time Deepfake Detection

Đây là một dự án ứng dụng web hoàn chỉnh cho phép người dùng thực hiện cuộc gọi video (video call) và sử dụng trí tuệ nhân tạo (AI) để phát hiện deepfake trong thời gian thực từ luồng video của đối phương.

## ✨ Tính năng chính

- **Video Call P2P:** Xây dựng trên nền tảng WebRTC cho phép các cuộc gọi video trực tiếp giữa hai người dùng với độ trễ thấp.
- **Phát hiện Deepfake Real-time:** Định kỳ trích xuất các frame ảnh từ luồng video của đối phương, gửi đến một server AI để phân tích.
- **Hiển thị kết quả trực quan:** Kết quả phân tích (Real/Fake) cùng với độ tin cậy (confidence score) được hiển thị ngay lập tức trên giao diện, viền khung video sẽ đổi màu để cảnh báo.
- **Kiến trúc hiện đại:**
  - **Frontend:** React, TypeScript, Vite, TanStack Router, Tailwind CSS, Ant Design.
  - **Backend:** FastAPI (Python) phục vụ cả API dự đoán AI và WebSocket server cho việc signaling WebRTC.
- **Hỗ trợ Docker:** Toàn bộ dự án có thể được đóng gói và chạy dễ dàng bằng Docker và Docker Compose.

## 🏛️ Kiến trúc hệ thống

Dự án bao gồm 2 thành phần chính:

1.  **`frontend`**: Một Single Page Application (SPA) được xây dựng bằng React, chịu trách nhiệm cho toàn bộ giao diện người dùng, xử lý logic WebRTC phía client và giao tiếp với backend.
2.  **`AI-BE`**: Một server backend được xây dựng bằng FastAPI (Python), thực hiện hai nhiệm vụ:
    -   Cung cấp một WebSocket server để làm "signaling server", giúp các client trao đổi thông tin kết nối WebRTC.
    -   Cung cấp một API endpoint (`/predict`) để nhận frame ảnh, đưa qua mô hình PyTorch đã được huấn luyện để phát hiện deepfake, và gửi kết quả về cho client qua WebSocket.

---

## 🚀 Bắt đầu

Bạn có thể chạy dự án này theo hai cách: sử dụng **Docker** (khuyến khích, dễ dàng nhất) hoặc cài đặt **thủ công** (nếu bạn không có Docker).

### ✅ Cách 1: Chạy với Docker (Khuyến khích)

Cách này đảm bảo tính nhất quán trên mọi môi trường và không cần cài đặt Node.js hay Python trực tiếp trên máy của bạn.

#### Yêu cầu

-   [Docker](https://www.docker.com/get-started) và [Docker Compose](https://docs.docker.com/compose/install/) (Thường đi kèm với Docker Desktop).

#### Cài đặt và Chạy

1.  **Clone repository về máy:**
    ```bash
    git clone https://your-git-repository-url.com/
    cd your-project-folder
    ```

2.  **Đặt file Model:**
    -   Tải file model `.pth` của bạn.
    -   Đặt file đó vào thư mục `AI-BE/models_weights/`. Tên file phải là `140K_resnet50_model.pth`.

3.  **Khởi động dự án:**
    Từ thư mục gốc của dự án, chạy lệnh duy nhất:
    ```bash
    docker-compose up --build
    ```
    -   Docker sẽ tự động build image và khởi động cả frontend và backend. Lần đầu tiên có thể mất vài phút.

4.  **Truy cập ứng dụng:**
    -   **Frontend:** `http://localhost:5173`
    -   **Backend API Docs:** `http://localhost:8080/docs`

### ❌ Cách 2: Chạy thủ công (Không cần Docker)

Cách này yêu cầu bạn phải cài đặt Node.js và Python trên máy.

#### Yêu cầu

-   [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên)
-   [Python](https://www.python.org/downloads/) (phiên bản 3.10 trở lên)
-   `pip` và `venv` (thường đi kèm với Python)

#### Cài đặt

1.  **Clone repository và đặt file Model:**
    -   Thực hiện tương tự như bước 1 và 2 của cách dùng Docker.

2.  **Cấu hình biến môi trường:**
    Dự án sử dụng các file `.env` để cấu hình. Hãy tạo các file này từ file ví dụ.
    
    -   **Đối với Backend:**
        -   Vào thư mục `AI-BE`.
        -   Tạo một file mới tên là `.env`.
        -   Thêm nội dung sau vào file:
        ```env
        # AI-BE/.env
        FRONTEND_ORIGIN=http://localhost:5173
        ```
    -   **Đối với Frontend:**
        -   Vào thư mục `frontend`.
        -   Tạo một file mới tên là `.env`.
        -   Thêm nội dung sau vào file:
        ```env
        # frontend/.env
        VITE_BACKEND_URL=http://localhost:8080
        VITE_API_URL=http://localhost:8080/api/v1
        ```

3.  **Cài đặt Backend:**
    -   Mở một cửa sổ terminal và điều hướng đến thư mục `AI-BE`.
    -   Tạo và kích hoạt môi trường ảo:
      ```bash
      python -m venv venv
      # Trên Windows:
      venv\Scripts\activate
      # Trên macOS/Linux:
      source venv/bin/activate
      ```
    -   Cài đặt các thư viện cần thiết:
      ```bash
      pip install -r requirements.txt
      ```

4.  **Cài đặt Frontend:**
    -   Mở một cửa sổ terminal **khác** và điều hướng đến thư mục `frontend`.
    -   Cài đặt các dependencies:
      ```bash
      npm install
      ```

#### Chạy

Bạn cần chạy cả backend và frontend trên hai cửa sổ terminal riêng biệt.

1.  **Chạy Backend:**
    -   Trong terminal của `AI-BE` (đã kích hoạt môi trường ảo).
    -   Chạy lệnh:
      ```bash
      python run.py
      ```
    -   Server backend sẽ khởi động tại `http://localhost:8080`.

2.  **Chạy Frontend:**
    -   Trong terminal của `frontend`.
    -   Chạy lệnh:
      ```bash
      npm run dev
      ```
    -   Server phát triển frontend sẽ khởi động tại `http://localhost:5173`.

Sau khi cả hai đã chạy, bạn có thể truy cập ứng dụng tại `http://localhost:5173`.

---

### 💡 Cách sử dụng

1.  Mở hai tab trình duyệt (khuyến khích một tab thường và một tab ẩn danh để giả lập hai người dùng khác nhau).
2.  Truy cập `http://localhost:5173` trên cả hai tab.
3.  Nhập **cùng một Room ID** vào cả hai ô và nhấn "Join Room".
4.  Cho phép trình duyệt truy cập camera và microphone khi được hỏi.
5.  Cuộc gọi video sẽ bắt đầu. Sau vài giây, bạn sẽ thấy nhãn kết quả phân tích deepfake xuất hiện trên khung video của đối phương.

### ⏹️ Dừng dự án

-   **Nếu dùng Docker:** Quay lại terminal đang chạy `docker-compose` và nhấn `Ctrl + C`. Để dọn dẹp, chạy `docker-compose down`.
-   **Nếu chạy thủ công:** Nhấn `Ctrl + C` trong mỗi cửa sổ terminal (cả frontend và backend).