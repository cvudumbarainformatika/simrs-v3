# Standard Guidelines & Memory Notes for SIMRS v3

## 🚨 CATATAN PENTING: Optimasi Penandaan Lokasi Operasi & Canvas (IC Penandaan Operasi Ranap & Kamar Operasi)
1. **Gambar Anatomi Tubuh (Latar Belakang Canvas)**:
   * **Daftar Tilik & Kamar Operasi**: Menggunakan gambar 5 posisi tubuh `.webp` terkompresi dari `src/assets/human/anatomys/`:
     - Laki-Laki: `body-marker-male.webp` (~28 KB)
     - Perempuan: `body-marker-female.webp` (~26 KB)
     - Deteksi otomatis jenis kelamin pasien (`pasien?.kelamin`).
   * **IC Penandaan Lokasi Operasi (Ranap)**: Menggunakan gambar diagram anatomi asli `body-marker-irna37.webp` (~15 KB).

2. **Optimasi Penyimpanan Database Canvas (`getCompressedCanvasBase64`)**:
   * JANGAN PERNAH menyimpan `canvas.toDataURL('image/png')` mentah ke database karena akan membengkakkan ukuran database (~200-400 KB per transaksi).
   * Selalu gunakan kompresi downscaling + `toDataURL('image/webp', 0.5)` dan pengecekan canvas kosong (`isCanvasBlank`).
   * Hasil ekspor base64 WebP berukuran hanya ~3-5 KB (hemat 98% memori database).

3. **Komponen Terkait**:
   * `DaftarTilikOkDialog.vue` (Kamar Operasi) -> ✅ SUDAH DITERAPKAN
   * `daftartilik/IndexPage.vue` & `CetakDaftarTilikDialog.vue` (Daftar Tilik Ranap) -> ✅ SUDAH DITERAPKAN
   * `FormPenandaan.vue` & `PreviewPenandaan.vue` (IC Penandaan Ranap) -> ✅ SUDAH DITERAPKAN (Menggunakan `body-marker-irna37.webp`)
