Hướng dẫn cài đặt ứng dụng trên máy local:
Yêu cầu: máy đã cài java phiên bản >=17, nodeJS
- Clone repo git này
- Cài đặt XAMPP (tích Apache và mysql)
- Sửa port của mysql XAMPP từ 3306 thành 3308 bằng cách: chỉnh port trong my.ini 
- Start lần lượt Apache, mysql
- Vào backend/src/main/java/masterchef/backend
- Biên dịch BackendApplication.java dưới dạng code Java
- Trong folder DuAn mới clone, mở cmd
- Chạy: cd /frontend
- Chạy: npm install
- Chạy: npm start
