# Todo List Application - BTS.ID Test

Aplikasi Todo List dengan fitur authentication dan checklist management yang dibuat untuk test BTS.ID.

## 🚀 Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Create, Read, Update, Delete Checklists
- ✅ Manage Checklist Items
- ✅ Toggle Item Status (Complete/Incomplete)
- ✅ Rename Items
- ✅ Delete Items & Checklists
- ✅ Responsive Design
- ✅ Real-time UI Updates

## 🛠️ Tech Stack

- **Frontend**: React.js 18
- **Authentication**: JWT Token
- **API**: REST API (http://94.74.86.174:8080/api)
- **Styling**: Inline CSS
- **Routing**: React Router DOM v6
- **State Management**: React Hooks (useState, useEffect)

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- **Node.js** (versi 14 atau lebih baru)
- **npm** (biasanya sudah termasuk dengan Node.js)
- **Git** (untuk clone repository)

## 🚀 Installation & Setup

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/bellamega/test-btsid-todolistapp1.git
cd test-btsid-todolistapp1
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm start
\`\`\`

### 4. Open Application
- Aplikasi akan otomatis terbuka di browser
- Jika tidak, buka manual: `http://localhost:3000`
- Server development akan berjalan di port 3000

## 📱 How to Use

### 1. **Registration (Daftar Akun Baru)**
- Buka aplikasi di browser
- Klik "Daftar di sini" di halaman login
- Isi form dengan:
  - **Email**: Email valid (contoh: user@example.com)
  - **Username**: Username unik (contoh: user123)
  - **Password**: Password minimal 3 karakter
- Klik "Daftar"
- Jika berhasil, akan otomatis redirect ke halaman login

### 2. **Login**
- Masukkan **Username** dan **Password** yang sudah didaftarkan
- Klik "Login"
- Jika berhasil, akan masuk ke Dashboard

### 3. **Dashboard - Kelola Checklist**
- **Buat Checklist Baru**: 
  - Isi nama checklist di form "Buat Checklist Baru"
  - Klik "Buat"
- **Pilih Checklist**: Klik pada checklist di panel kiri
- **Hapus Checklist**: Klik tombol "Hapus" pada checklist

### 4. **Kelola Items dalam Checklist**
- **Tambah Item**: 
  - Pilih checklist terlebih dahulu
  - Isi nama item di form "Tambah Item Baru"
  - Klik "Tambah"
- **Toggle Status**: Klik checkbox untuk menandai complete/incomplete
- **Edit Item**: Klik tombol "Edit", ubah nama, lalu "Simpan"
- **Hapus Item**: Klik tombol "Hapus"

### 5. **Logout**
- Klik tombol "Logout" di pojok kanan atas
- Akan kembali ke halaman login

## 🧪 Demo Account

Untuk testing cepat, Anda bisa menggunakan akun yang sudah ada:
- **Username**: `admin1`
- **Password**: `admin1`

Atau buat akun baru melalui halaman registrasi.

## 🔧 Available Scripts

Di direktori project, Anda dapat menjalankan:

### `npm start`
- Menjalankan aplikasi dalam development mode
- Buka [http://localhost:3000](http://localhost:3000) untuk melihat di browser
- Halaman akan reload otomatis jika Anda melakukan perubahan

### `npm test`
- Menjalankan test runner dalam interactive watch mode

### `npm run build`
- Build aplikasi untuk production ke folder `build`
- Mengoptimalkan build untuk performa terbaik

### `npm run eject`
- **Note: ini adalah operasi satu arah. Setelah `eject`, Anda tidak bisa kembali!**
- Jika tidak puas dengan build tool dan konfigurasi, Anda bisa `eject`

## 🌐 API Integration

Aplikasi ini terintegrasi dengan API BTS.ID:

### Base URL
\`\`\`
http://94.74.86.174:8080/api
\`\`\`

### Endpoints Used
- `POST /register` - Register user baru
- `POST /login` - Login user
- `GET /checklist` - Get all checklists
- `POST /checklist` - Create new checklist
- `DELETE /checklist/:id` - Delete checklist
- `GET /checklist/:id/item` - Get checklist items
- `POST /checklist/:id/item` - Create new item
- `PUT /checklist/:id/item/:itemId` - Update item status
- `DELETE /checklist/:id/item/:itemId` - Delete item
- `PUT /checklist/:id/item/rename/:itemId` - Rename item

### Authentication
- Menggunakan **JWT Bearer Token**
- Token disimpan di localStorage browser
- Token otomatis dikirim di header untuk API yang memerlukan authentication

## 📁 Project Structure

\`\`\`
src/
├── api/
│   └── auth.js              # API functions & authentication logic
├── components/
│   ├── Dashboard.js         # Main dashboard component
│   ├── LoginPage.js         # Login form component
│   └── RegisterPage.js      # Registration form component
├── App.js                   # Main app with routing & authentication
└── index.js                 # React app entry point

public/
├── index.html               # HTML template
└── favicon.ico              # App icon

package.json                 # Dependencies & scripts
README.md                    # Project documentation
.gitignore                   # Git ignore rules
\`\`\`

## 🐛 Troubleshooting

### Masalah Umum & Solusi

#### 1. **Error "Cannot find module"**
\`\`\`bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### 2. **Port 3000 sudah digunakan**
\`\`\`bash
# Gunakan port lain
PORT=3001 npm start
\`\`\`

#### 3. **Login gagal dengan error 401**
- Pastikan username/password benar
- Cek console browser untuk error detail
- Pastikan API server berjalan

#### 4. **Checklist tidak muncul**
- Pastikan sudah login
- Cek Network tab di Developer Tools
- Pastikan token tersimpan di localStorage

#### 5. **Aplikasi tidak bisa diakses**
- Pastikan `npm start` berjalan tanpa error
- Cek apakah port 3000 terbuka
- Coba akses `http://localhost:3000` langsung

## 🔒 Security Notes

- Password disimpan dengan hash di server
- JWT token memiliki expiration time
- Token disimpan di localStorage (untuk demo purposes)
- Untuk production, pertimbangkan menggunakan httpOnly cookies

## 🚀 Deployment

### Deploy ke Vercel
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Deploy ke Netlify
\`\`\`bash
npm run build
# Upload folder build/ ke Netlify
\`\`\`

### Deploy ke GitHub Pages
\`\`\`bash
npm install --save-dev gh-pages
# Tambahkan script di package.json
npm run deploy
\`\`\`

## 👨‍💻 Author

**Bella Mega**
- GitHub: [@bellamega](https://github.com/bellamega)
- Project: BTS.ID Technical Test

## 📄 License

This project is created for BTS.ID technical assessment purposes.

