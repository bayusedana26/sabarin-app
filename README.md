<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Sabar.in: Protokol Anti-Tantrum untuk Profesional

> *"Emosi di hati aja, professional kudu tetep jalan."*

**Sabar.in** adalah aplikasi web berbasis AI yang dirancang untuk menyelamatkan karier Anda. Aplikasi ini menerjemahkan kalimat-kalimat emosional, marah, atau "savage" menjadi bahasa korporat yang elegan, sopan, dan profesional. 

Sangat cocok digunakan saat Anda ingin membalas email rekan kerja yang menyebalkan, atau meladeni klien yang banyak maunya, tanpa mengorbankan profesionalisme Anda.

## ✨ Fitur Utama

- 🤖 **Powered by Google Gemini AI**: Memanfaatkan kecerdasan buatan untuk merangkai kata dengan sempurna.
- 🎭 **Pilihan Tone Bahasa**:
  - **Professional**: Netral, tenang, dan fokus pada solusi.
  - **Savage-but-Polite**: Sopan di luar, menohok di dalam (Passive-Aggressive).
  - **Direct**: Jelas, to the point, tanpa basa-basi namun tetap formal.
- 📊 **Scoring System**: Menilai seberapa "Savage" input asli Anda dan seberapa "Pro" hasil terjemahannya.
- 💾 **Arsip Kesabaran**: Menyimpan riwayat terjemahan Anda secara lokal di browser.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **AI Engine**: Google Gemini API (`@google/genai`)

## 🚀 Cara Menjalankan Secara Lokal (Run Locally)

**Prasyarat:** Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).

1. **Clone repositori (opsional):**
   ```bash
   git clone https://github.com/username/sabarin-app.git
   cd sabarin-app
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Inisiasi Environment Variable:**
   Buat file bernama `.env.local` di root folder proyek Anda, lalu masukkan API Key Gemini Anda:
   ```env
   GEMINI_API_KEY=masukkan_api_key_anda_di_sini
   ```
   *(Anda bisa mendapatkan API Key secara gratis di [Google AI Studio](https://aistudio.google.com/app/apikey))*

4. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000` (atau port lain yang tersedia).

## 🌍 Cara Deploy (contoh dengan Vercel)

1. Upload kode Anda ke GitHub.
2. Buat proyek baru di [Vercel](https://vercel.com/) dan import repository GitHub Anda.
3. Di bagian **Environment Variables** pada pengaturan Vercel, tambahkan `GEMINI_API_KEY` beserta nilainya.
4. Klik **Deploy** dan aplikasi Anda siap digunakan secara publik!
