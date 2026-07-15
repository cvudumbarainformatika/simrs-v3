<template>
  <div id="pdfDoc" class="bg-white print-page">
    <!-- KOP SURAT -->
    <div class="col-grow kotak">
      <div class="row items-center">

        <div class="col-9 sisi-kanan">
          <div class="row q-pa-sm">
            <div class="col-auto">
              <img src="~assets/images/logo-rsud.png" width="80">
            </div>
            <div class="col flex-wrap q-px-lg">
              <div class="text-center">
                <div class="text-weight-bold f-12">
                  {{ dataHeader[0] }}
                </div>
                <div class="text-weight-bold f-10">
                  {{ dataHeader[1] }}
                </div>
                <div class="text-weight-bold f-16">
                  {{ dataHeader[2] }}
                </div>
                <div class="f-10">
                  <div>{{ dataHeader[3] }}</div>
                  <div>{{ dataHeader[4] }}</div>
                  <div>{{ dataHeader[5] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-3 f-14">
          <div class="text-center text-bold">
            {{ menu?.title }}
          </div>
          <div class="text-center text-bold">
            RAWAT INAP
          </div>
          <div class="text-center text-bold">
            {{ kasus?.uraian.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pasien -->
    <div class="flex justify-between kotak q-mt-xs q-pa-sm" style="gap:0 10px">
      <!-- <div class="col-auto">Nama : {{ pasien?.nama_panggil }}</div>
      <div class="col-auto">No. Register : {{ pasien?.noreg }}</div>
      <div class="col-auto">Tanggal : {{ dateFullFormat(pasien?.tglmasuk) }}</div>
      <div class="col-auto">Jam : {{ jamTnpDetik(pasien?.tglmasuk) }}</div> -->

      <div class="column">
        <div class="col-auto">NAMA : {{ pasien?.nama_panggil }}</div>
        <div class="col-auto">NORM : {{ pasien?.norm }}</div>
        <div class="col-auto">No. Register : {{ pasien?.noreg }}</div>

      </div>
      <div class="column">
        <div class="col-auto">Tanggal : {{ dateFullFormat(pasien?.tglmasuk) }}</div>
        <div class="col-auto">Jam : {{ jamTnpDetik(pasien?.tglmasuk) }}</div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Pengkajian Keperawatan : </div>
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;">Masuk Ruang Rawat</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pasien?.ruangan || ' - ' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 15%;">Tanggal / Pkl </td>
            <td style="border: none !important; padding: 0px !important;">: {{ dateFullFormat(pasien?.tglmasuk) }} / {{
              jamTnpDetik(pasien?.tglmasuk) }} WIB
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Riwayat Kesehatan -->
    <div class="section">
      <div class="section-title">Riwayat Kesehatan : </div>
      <div class="data">
        <div class="data-item">1. Diagnosa masuk : {{ pasien?.memodiagnosa || '-' }}</div>
        <div class="data-item">2. Keluhan Utama : {{ anamnesisAwal?.keluhanUtama || '-' }}</div>
        <div class="data-item">3. Riwayat Kesehatan Sekarang : {{ anamnesisAwal?.riwayatpenyakitsekarang || '-' }}</div>
        <div class="data-item">4. Riwayat Penyakit Dahulu : {{ anamnesisAwal?.riwayatpenyakit || '-' }}</div>
        <div class="data-item">5. Riwayat Penyakit Keluarga : {{ anamnesisAwal?.riwayatpenyakitkeluarga || '-' }}</div>
        <div class="data-item">6. Riwayat Pekerjaan : {{
          anamnesisAwal?.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya || '-' }}</div>
        <!-- <div class="data-item">7. Keluhan Nyeri : {{ anamnesisAwal?.keluhannyeri?.skor > 0 ? 'Ada' : 'Tidak ada' || '-'
          }}
        </div> -->
        <div class="data-item flex">7. Kajian Nyeri :
          <div class="q-ml-sm" v-if="anamnesisAwal?.keluhannyeri?.dewasa !== null">
            <div>{{ anamnesisAwal?.keluhannyeri?.dewasa?.kajianNyeri ?? '-' }}</div>
            <div>- Keterangan : {{ anamnesisAwal?.keluhannyeri?.dewasa?.ket ?? '-' }}</div>
            <div>- Ekpresi Wajah : {{ anamnesisAwal?.keluhannyeri?.dewasa?.form?.ekspresiWajah?.text ?? '-' }}</div>
            <div>- Gerakan Tangan : {{ anamnesisAwal?.keluhannyeri?.dewasa?.form?.gerakanTangan?.text ?? '-' }}</div>
            <div>- Kepatuhan terhadap ventilasi mekanik : {{
              anamnesisAwal?.keluhannyeri?.dewasa?.form?.kebutuhanVentilasi?.text ?? '-' }}</div>
          </div>
          <div class="q-ml-sm" v-if="anamnesisAwal?.keluhannyeri?.kebidanan !== null">
            <div>{{ anamnesisAwal?.keluhannyeri?.kebidanan?.kajianNyeri ?? '-' }}</div>
            <div>- Keterangan : {{ anamnesisAwal?.keluhannyeri?.kebidanan?.ket ?? '-' }}</div>
            <div>- Ekpresi Wajah : {{ anamnesisAwal?.keluhannyeri?.kebidanan?.form?.ekspresiWajah?.text ?? '-' }}</div>
            <div>- Gerakan Tangan : {{ anamnesisAwal?.keluhannyeri?.kebidanan?.form?.gerakanTangan?.text ?? '-' }}</div>
            <div>- Kepatuhan terhadap ventilasi mekanik : {{
              anamnesisAwal?.keluhannyeri?.kebidanan?.form?.kebutuhanVentilasi?.text ?? '-' }}</div>
          </div>
          <div class="q-ml-sm" v-if="anamnesisAwal?.keluhannyeri?.pediatrik !== null">
            <div>{{ anamnesisAwal?.keluhannyeri?.pediatrik?.kajianNyeri ?? '-' }}</div>
            <div>- Keterangan : {{ anamnesisAwal?.keluhannyeri?.pediatrik?.ket ?? '-' }}</div>
            <div>- Ekpresi Wajah : {{ anamnesisAwal?.keluhannyeri?.pediatrik?.form?.ekspresiWajah?.text ?? '-' }}</div>
            <div>- Gerakan Tangan : {{ anamnesisAwal?.keluhannyeri?.pediatrik?.form?.gerakanTangan?.text ?? '-' }}</div>
            <div>- Kepatuhan terhadap ventilasi mekanik : {{
              anamnesisAwal?.keluhannyeri?.pediatrik?.form?.kebutuhanVentilasi?.text ?? '-' }}</div>
          </div>
          <div class="q-ml-sm" v-if="anamnesisAwal?.keluhannyeri?.neonatal !== null">
            <div>- Keluhan : {{ anamnesisAwal?.keluhannyeri?.keluhan ?? '-' }}</div>
            <div>- Ekspresi Wajah : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.ekspresiWajah?.text ?? '-' }}</div>
            <div>- Menangis : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.menangis?.text ?? '-' }}</div>
            <div>- Pola Nafas : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.polaNafas?.text ?? '-' }}</div>
            <div>- Lengan : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.lengan?.text ?? '-' }}</div>
            <div>- Kaki : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.kaki?.text ?? '-' }}</div>
            <div>- Keadaan Rangsangan : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.keadaanRangsangan?.text ?? '-'
            }}</div>
          </div>
        </div>

        <div v-if="anamnesisAwal?.kebidanan" class="data-item flex">8. Form 4.2 (Kebidanan) :
          <div class="q-ml-sm">
            <!-- <div class="text-bold">Riwayat Penyakit Kelahiran</div> -->
            <div>- Pernah Dirawat : {{ anamnesisAwal?.kebidanan?.rwRawat || '-' }}</div>
            <div>- Pernah Operasi : {{ anamnesisAwal?.kebidanan?.rwOperasi || '-' }}</div>

            <div class="text-bold">Riwayat KB</div>
            <div>- {{ anamnesisAwal?.kebidanan?.rwImunisasi?.join(', ') || '-' }}</div>

            <div class="text-bold">Riwayat Tumbuh Kembang Anak</div>
            <div>- Gigi Pertama, Usia : {{ anamnesisAwal?.kebidanan?.gigiPertama || '-' }}</div>
            <div>- Mulai Berjalan, Usia : {{ anamnesisAwal?.kebidanan?.berjalan || '-' }}</div>
            <div>- Bisa membaca, usia : {{ anamnesisAwal?.kebidanan?.membaca || '-' }}</div>
            <div>- Bisa duduk, usia : {{ anamnesisAwal?.kebidanan?.duduk || '-' }}</div>
            <div>- Bisa Bicara, usia : {{ anamnesisAwal?.kebidanan?.bicara || '-' }}</div>
          </div>
        </div>


        <div v-if="anamnesisAwal?.pediatrik" class="data-item flex">9. Form 4.4 (Pediatrik) :
          <div class="q-ml-sm">
            <div class="text-bold">Riwayat Penyakit Kelahiran</div>
            <div>- Anak ke : {{ anamnesisAwal?.pediatrik?.anakKe || '-' }}</div>
            <div>- Jumlah Saudara : {{ anamnesisAwal?.pediatrik?.jmlSaudara || '-' }}</div>
            <div>- Cara Kelahiran : {{ anamnesisAwal?.pediatrik?.crKelahiran || '-' }}</div>
            <div>- Umur Kelahiran : {{ anamnesisAwal?.pediatrik?.umurKelahiran || '-' }}</div>
            <div>- Kelainan Bawaan : {{ anamnesisAwal?.pediatrik?.klainanBawaan || '-' }}</div>

            <div class="text-bold">Riwayat Imunisasi</div>
            <div>- {{ anamnesisAwal?.pediatrik?.rwImunisasi?.join(', ') || '-' }}</div>

            <div class="text-bold">Riwayat Tumbuh Kembang Anak</div>
            <div>- Gigi Pertama, Usia : {{ anamnesisAwal?.pediatrik?.gigiPertama || '-' }}</div>
            <div>- Mulai Berjalan, Usia : {{ anamnesisAwal?.pediatrik?.berjalan || '-' }}</div>
            <div>- Bisa membaca, usia : {{ anamnesisAwal?.pediatrik?.membaca || '-' }}</div>
            <div>- Bisa duduk, usia : {{ anamnesisAwal?.pediatrik?.duduk || '-' }}</div>
            <div>- Bisa Bicara, usia : {{ anamnesisAwal?.pediatrik?.bicara || '-' }}</div>

            <div class="text-bold">Kebutuhan Dasar Saat Ini</div>
            <div>- Makanan yang disukai : {{ anamnesisAwal?.pediatrik?.sukaMknan || '-' }}</div>
            <div>- Makanan yang tidak disukai : {{ anamnesisAwal?.pediatrik?.tdkSukaMknan || '-' }}</div>
            <div>- Nafsu makan : {{ anamnesisAwal?.pediatrik?.nafsuMkn || '-' }}</div>
            <div>- Pola makan : {{ anamnesisAwal?.pediatrik?.polaMakan || '-' }}</div>
            <div>- Makanan yang diberikan : {{ anamnesisAwal?.pediatrik?.mknYgdiberikan || '-' }}</div>

            <div class="text-bold">Pola Tidur</div>
            <div>- Tidur Siang : {{ anamnesisAwal?.pediatrik?.tidurSiang || '-' }} jam / hari</div>
            <div>- Tidur Malam : {{ anamnesisAwal?.pediatrik?.tidurMalam || '-' }} jam / hari</div>
            <div>- Kebiasaan Sebelum Makan : {{ anamnesisAwal?.pediatrik?.kebiasaanSblmMkn || '-' }}</div>
            <div>- Adakah Nyeri : {{ anamnesisAwal?.pediatrik?.nyeri || '-' }}</div>

            <div class="text-bold">Pola Kebersihan Diri</div>
            <div>- Mandi Sendiri : {{ anamnesisAwal?.pediatrik?.mandiSendiri || '-' }} kali / hari</div>
            <div>- Dimandikan : {{ anamnesisAwal?.pediatrik?.dimandikan || '-' }} jam / hari</div>
            <div>- Gosok Gigi : {{ anamnesisAwal?.pediatrik?.gosokGigi || '-' }} kali / hari</div>
            <div>- Keramas : {{ anamnesisAwal?.pediatrik?.keramas || '-' }} kali / minggu</div>
            <div>- Kebersihan Kuku : {{ anamnesisAwal?.pediatrik?.kbersihanKuku || '-' }}</div>
            <div>- Aktifitas Bermain : {{ anamnesisAwal?.pediatrik?.aktifitas || '-' }}</div>
            <div>- Frekuensi BAB : {{ anamnesisAwal?.pediatrik?.babFrekuensi || '-' }} kali / hari</div>
            <div>- Konsistensi BAB : {{ anamnesisAwal?.pediatrik?.babKonsistensi || '-' }} kali / hari</div>
            <div>- Bau BAB : {{ anamnesisAwal?.pediatrik?.babBau || '-' }} kali / hari</div>
            <div>- Buang Air Kecil : {{ anamnesisAwal?.pediatrik?.bakFrekuensi || '-' }} kali / hari</div>
            <div>- Warna Buang Air Kecil : {{ anamnesisAwal?.pediatrik?.bakWarna || '-' }}</div>
            <div>- Bau Buang Air Kecil : {{ anamnesisAwal?.pediatrik?.bakBau || '-' }}</div>
          </div>
        </div>

        <div v-if="anamnesisAwal?.neonatal" class="data-item flex">9. Form 4.3 (Neonatal) :
          <div class="q-ml-sm">
            <div class="text-bold">Informasi Bayi</div>
            <div>- Cara Masuk : {{ anamnesisAwal?.neonatal?.crMasuk || '-' }}</div>
            <div>- Asal Masuk : {{ anamnesisAwal?.neonatal?.asalMasuk || '-' }}</div>
            <div>- Nama Penanggung Jawab : {{ anamnesisAwal?.neonatal?.hubPj || '-' }}</div>
            <div>- Hubungan dengan Pasien : {{ anamnesisAwal?.neonatal?.penanggungJawab || '-' }}</div>
            <div>- No HP/Telp Penanggung Jawab : {{ anamnesisAwal?.neonatal?.noHpPj || '-' }}</div>
            <div>- Alamat : {{ anamnesisAwal?.neonatal?.alamatPj || '-' }}</div>

            <div class="text-bold">Riwayat Kehamilan</div>
            <div>- G/P/A : {{ anamnesisAwal?.neonatal?.g || '-' }}/{{ anamnesisAwal?.neonatal?.p || '-' }}/{{
              anamnesisAwal?.neonatal?.a || '-' }}</div>
            <div>- UG : {{ anamnesisAwal?.neonatal?.usiaGestasi || '-' }}</div>
            <div>- Status Gizi Ibu : {{ anamnesisAwal?.neonatal?.sgIbu || '-' }}</div>
            <div>- Obat Ibu Selama Hamil : {{ anamnesisAwal?.neonatal?.rwObat || '-' }}</div>
            <div>- Kebiasaan Ibu : {{ anamnesisAwal?.neonatal?.kebiasaanIbu || '-' }}</div>
            <div>- Riwayat Persalinan : {{ anamnesisAwal?.neonatal?.rwPersalinan || '-' }}</div>
            <div>- Ketuban : {{ anamnesisAwal?.neonatal?.ketuban || '-' }}</div>
            <div>- Volume : {{ anamnesisAwal?.neonatal?.volume || '-' }}</div>

            <div class="text-bold">Golongan Darah</div>
            <div>- Ayah : {{ anamnesisAwal?.neonatal?.golDarahAyah || '-' }}</div>
            <div>- Ibu : {{ anamnesisAwal?.neonatal?.golDarahIbu || '-' }}</div>
            <div>- Bayi : {{ anamnesisAwal?.neonatal?.golDarahBayi || '-' }}</div>

            <div class="text-bold">Riwayat Kelahiran</div>
            <div>- Cara Kelahiran : {{ anamnesisAwal?.neonatal?.crLahir || '-' }}</div>
            <div>- APGAR Score : {{ anamnesisAwal?.neonatal?.apgarScore || '-' }}</div>
            <div>- Volume Air Ketuban : {{ anamnesisAwal?.neonatal?.volumeKetuban || '-' }}</div>
            <div>- Warna Air Ketuban : {{ anamnesisAwal?.neonatal?.warnaKetuban || '-' }}</div>
            <div>- Ketuban Pecah dini : {{ anamnesisAwal?.neonatal?.pecahDini || '-' }}</div>

            <div class="text-bold">Riwayat Lainnya</div>
            <div>- Transfusi Darah : {{ anamnesisAwal?.neonatal?.rwTransDarah || '-' }}</div>
            <div>- Reaksi Ketika Trnasfusi Darah : {{ anamnesisAwal?.neonatal?.reaksiTrans || '-' }}</div>
            <div>- Riwayat Imunisasi : {{ anamnesisAwal?.neonatal?.rwImunisasi || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Pemeriksaan : umum -->
    <div class="section">
      <div class="section-title">Pemeriksaan Umum : </div>
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Kesadaran</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.tkKesadaranKet || ' - ' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 15%;"> - Keadaan Umum </td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.keadaanUmum || ' - ' }}
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Tekanan Darah</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.sistole || ' -' }} / {{ pemeriksaanUmum?.diastole || ' -' }} mmHg</td>
            <td style="border: none !important; padding: 0px !important;"> - Keadaan Gizi</td>
            <td style="border: none !important; padding: 0px !important;">:
              {{ anamnesisAwal?.skreeninggizi?.dewasa?.keterangan || ' - ' }}
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Nadi</td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.nadi || ' - ' }} x/menit
            </td>
            <td style="border: none !important; padding: 0px !important;"> - Berat Badan</td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.bb || ' - ' }} kg
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Suhu </td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.suhu || ' - ' }} &deg;C
            </td>
            <td style="border: none !important; padding: 0px !important;"> - Tinggi Badan</td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.tb || ' - ' }} cm </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Pernapasan</td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pernapasan || ' - ' }}
              x/menit</td>
            <td style="border: none !important; padding: 0px !important;"> - Saturasi Oksigen</td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.spo || ' - ' }} %</td>
          </tr>
          <template v-if="pemeriksaanUmum?.pediatrik">
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important;"> - Lika</td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pediatrik?.lilengtas
                || '-' }} cm</td>
              <td style="border: none !important; padding: 0px !important;"> - Lida</td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pediatrik?.lida || '-'
              }} cm</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important;"> - Lirut</td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pediatrik?.lirut ||
                '-' }} cm</td>
              <td style="border: none !important; padding: 0px !important;"> - Lila</td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pediatrik?.lila || '-'
              }}
              </td>
            </tr>
          </template>

        </tbody>
      </table>
    </div>
    <!-- Pemeriksaan : kultural -->
    <div class="section">
      <div class="section-title">Kultural : </div>
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Penyebab Penyakit</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.penyebabSakit || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Pola Komunikasi</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.komunikasi || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Makanan Pokok</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              (pemeriksaanUmum?.makananPokokLain ?? pemeriksaanUmum?.makananPokok) || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Pantangan Makanan</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.pantanganMkanan || ' - ' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pemeriksaan : psikologi dll -->
    <div class="section">
      <div class="section-title">Pemeriksaan Psikologi, Sosial Ekonomi, Spriritual : </div>
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Status Sosial</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.sosial || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Spiritual</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.spiritual || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Status Kejiwaan</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.statusPsikologis || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Punya Ansuransi</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.ansuransi || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td colspan="4" style="border: none !important; padding: 0px !important; width:15%;"> - Edukasi</td>

          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td colspan="2"
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:15%;">
              - Apakah pasien /
              keluarga tahu mengenai penyakit dan perawatannya?</td>
            <td colspan="2" style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              edukasi?.tahuPenanganan?.value || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td colspan="2"
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:15%;">
              - Apakah membutuhkan
              edukasi?</td>
            <td colspan="2" style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              edukasi?.butuhEdukasi?.value || ' - ' }}, <span v-if="edukasi?.butuhEdukasi?.value === 'Ya'"> {{
                pemeriksaanUmum?.ketEdukasi }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pemeriksaanUmum?.neonatal" class="section">
      <div class="section-title" style="margin-top: 5px;">Form 4.3 Neonatal : </div>
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Appearance (Warna Kulit)</td>
            <td style="border: none !important; padding: 0px !important;"> : {{
              pemeriksaanUmum?.neonatal?.apgarScores?.appearances?.label || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - P – Pulse (Denyut Jantung)</td>
            <td style="border: none !important; padding: 0px !important;"> : {{
              pemeriksaanUmum?.neonatal?.apgarScores?.pulses?.label || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Grimace (Respons terhadap
              rangsangan atau refleks)</td>
            <td style="border: none !important; padding: 0px !important;"> : {{
              pemeriksaanUmum?.neonatal?.apgarScores?.grimaces?.label || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Activity (Tonus Otot)</td>
            <td style="border: none !important; padding: 0px !important;"> : {{
              pemeriksaanUmum?.neonatal?.apgarScores?.activitys?.label || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Respiration (Pernapasan)</td>
            <td style="border: none !important; padding: 0px !important;"> : {{
              pemeriksaanUmum?.neonatal?.apgarScores?.respirations?.label || ' - ' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pemeriksaan : Fisik -->
    <div class="section">
      <div class="section-title">Pemeriksaan Fisik : </div>
      <table>
        <thead>
          <tr>
            <th>Bagian</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kepala (Head)</td>
            <td> {{ pemeriksaanUmum?.rs5 }} </td>
          </tr>
          <tr>
            <td>Leher (Neck)</td>
            <td> {{ pemeriksaanUmum?.rs6 }} </td>
          </tr>
          <tr>
            <td>Dada & Payudara (Chest & Breast)</td>
            <td> {{ pemeriksaanUmum?.rs7 }} </td>
          </tr>
          <tr>
            <td>Punggung (Back)</td>
            <td> {{ pemeriksaanUmum?.rs8 }} </td>
          </tr>
          <tr>
            <td>Perut (Abdomen)</td>
            <td> {{ pemeriksaanUmum?.rs9 }} </td>
          </tr>
          <tr>
            <td>Urogenital</td>
            <td> {{ pemeriksaanUmum?.rs13 }} </td>
          </tr>
          <tr>
            <td>Tangan (Hand)</td>
            <td> {{ pemeriksaanUmum?.rs10 }} </td>
          </tr>
          <tr>
            <td>Kaki (Foot)</td>
            <td> {{ pemeriksaanUmum?.rs11 }} </td>
          </tr>
          <tr>
            <td>Status Neurologis (Neurological Status)</td>
            <td> {{ pemeriksaanUmum?.rs12 }} </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Skreening gizi Dewasa-->
    <div v-if="anamnesisAwal?.skreeninggizi?.dewasa" class="section">
      <div class="section-title">Skrining Gizi : </div>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apakah Ada Penurunan Berat badan yang tidak diinginkan selama 6 Bulan terakhir ?</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.dewasa?.form?.bb?.skor }} </td>
          </tr>
          <tr>
            <td>Apakah Asupan Makan berkurang karena tidak nafsu makan ?</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.dewasa?.form?.am?.skor }} </td>
          </tr>
          <tr>
            <td>Apakah pasien memiliki diagnosa khusus / kondisi khusus ?</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.dewasa?.form?.kk?.skor }} </td>
          </tr>
          <tr class="text-weight-bold">
            <td colspan="2">
              <div class="row justify-between q-px-lg">
                <div class="col-auto">
                  Total Skor :
                </div>
                <div class="col-auto">
                  {{ anamnesisAwal?.skreeninggizi?.dewasa?.skor }} ( {{
                    anamnesisAwal?.skreeninggizi?.dewasa?.ket }} )
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
    <!-- Skrining gizi Kebidanan-->
    <div v-if="anamnesisAwal?.skreeninggizi?.kebidanan" class="section">
      <div class="section-title">Skrining Gizi Pasien Obstetric / Kehamilan / Nifas : </div>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apakah asupan makan berkurang karena tidak nafsu makan?</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.kebidanan?.form?.am?.skor }} </td>
          </tr>
          <tr>
            <td>Apakah ada pertambahan BB yang kurang atau lebih selama kehamilan?</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.kebidanan?.form?.bb?.skor }} </td>
          </tr>
          <tr>
            <td>Nilai Hb {{ '<' }} 10 g/dl atau HCT 30%</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.kebidanan?.form?.hb?.skor }} </td>
          </tr>
          <tr>
            <td>Ada gangguan metabolisme / kondisi khusus. (Penyakit tertentu)</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.kebidanan?.form?.metabolisme?.skor }} </td>
          </tr>
          <tr class="text-weight-bold">
            <td colspan="2">
              <div class="row justify-between q-px-lg">
                <div class="col-auto">
                  Total Skor :
                </div>
                <div class="col-auto">
                  {{ anamnesisAwal?.skreeninggizi?.kebidanan?.skor }} ( {{
                    anamnesisAwal?.skreeninggizi?.kebidanan?.ket }} )
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
    <!-- Skreening gizi Kebidanan-->
    <div v-if="anamnesisAwal?.skreeninggizi?.neonatal" class="section">
      <div class="section-title">Skrining Gizi Neonatal : </div>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Keterangan</th>
            <th>Skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nafsu Makan</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.nm?.text }} </td>
            <td> {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.nm?.skor }} </td>
          </tr>
          <tr>
            <td>Kemampuan Untuk Makan</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.km?.text }} </td>
            <td> {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.km?.skor }} </td>
          </tr>
          <tr>
            <td>Faktor Stress</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.fs?.text }} </td>
            <td> {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.fs?.skor }} </td>
          </tr>
          <tr>
            <td>Persentil BB</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.bb?.text }} </td>
            <td> {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.bb?.skor }} </td>
          </tr>
          <tr class="text-weight-bold">
            <td colspan="3">
              <div class="row justify-between q-px-lg">
                <div class="col-auto">
                  Total Skor :
                </div>
                <div class="col-auto">
                  {{ anamnesisAwal?.skreeninggizi?.neonatal?.skor }} ( {{
                    anamnesisAwal?.skreeninggizi?.neonatal?.ket }} )
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
    <!-- Skreening gizi Pediatrik-->
    <div v-if="anamnesisAwal?.skreeninggizi?.pediatrik" class="section">
      <div class="section-title">Skrining Gizi Pediatrik : </div>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apakah pasien tampak kurus?</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.pediatrik?.form?.tk?.skor }} </td>
          </tr>
          <tr>
            <td>
              <div class="row">Apakah terdapat penurunan BB selama 1 bulan terakhir?</div>
              <div class="row f-10 text-italic"> - Berdasarkan penilaian objektif data BB bila ada satu penilaian
                subjektif orang tua pasien</div>
              <div class="row f-10 text-italic"> - Untuk bayi {{ '<' }} 1 tahun berat badan tidak naik selama 3 bulan
                  terakhir</div>
            </td>
            <td> {{ anamnesisAwal?.skreeninggizi?.pediatrik?.form?.bb?.skor }} </td>
          </tr>
          <tr>
            <td>
              <div class="row">Apakah terdapat salah satu dari kondisi ini?</div>
              <div class="row f-10 text-italic"> - Diare >= 5 kali/hari dan/atau muntah > 3 kali/hari dalam seminggu
                terakhir</div>
              <div class="row f-10 text-italic"> - Asupan makanan berkurang selama satu minggu terakhir</div>
            </td>
            <td> {{ anamnesisAwal?.skreeninggizi?.pediatrik?.form?.kk?.skor }} </td>
          </tr>
          <tr>
            <td>Apakah terdapat penyakit atau keadaan yang mengakibatkan pasien beresiko malnutrisi? (Diare kronis, HIV,
              PJB, Hepato, Ginjal, Stoma, Lain-lain)</td>
            <td> {{ anamnesisAwal?.skreeninggizi?.pediatrik?.form?.penyakit?.skor }} </td>
          </tr>
          <tr class="text-weight-bold">
            <td colspan="3">
              <div class="row justify-between q-px-lg">
                <div class="col-auto">
                  Total Skor :
                </div>
                <div class="col-auto">
                  {{ anamnesisAwal?.skreeninggizi?.pediatrik?.skor }} ( {{
                    anamnesisAwal?.skreeninggizi?.pediatrik?.ket }} )
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Penilaian : Assasement Fungsional Barthel -->
    <div class="section" v-if="penilaian?.barthel">
      <div class="section-title">Pengkajian fungsional menggunakan Indeks Barthel : </div>
      <table>
        <thead>
          <tr>
            <th>Item Yang Dinilai</th>
            <th>Keterangan</th>
            <th>Skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Makan (Feeding)</td>
            <td> {{ penilaian?.barthel?.makan?.label }} </td>
            <td> {{ penilaian?.barthel?.makan?.skor }} </td>
          </tr>
          <tr>
            <td>Mandi (Bathing)</td>
            <td> {{ penilaian?.barthel?.mandi?.label }} </td>
            <td> {{ penilaian?.barthel?.mandi?.skor }} </td>
          </tr>
          <tr>
            <td>Perawatan diri (Grooming)</td>
            <td> {{ penilaian?.barthel?.perawatanDiri?.label }} </td>
            <td> {{ penilaian?.barthel?.perawatanDiri?.skor }} </td>
          </tr>
          <tr>
            <td>Berpakaian (Dressing)</td>
            <td> {{ penilaian?.barthel?.berpakaian?.label }} </td>
            <td> {{ penilaian?.barthel?.berpakaian?.skor }} </td>
          </tr>
          <tr>
            <td>Buang Air Kecil (Bowel)</td>
            <td> {{ penilaian?.barthel?.buangAirKcl?.label }} </td>
            <td> {{ penilaian?.barthel?.buangAirKcl?.skor }} </td>
          </tr>
          <tr>
            <td>Buang Air Besar (Bladder)</td>
            <td> {{ penilaian?.barthel?.buangAirBsr?.label }} </td>
            <td> {{ penilaian?.barthel?.buangAirBsr?.skor }} </td>
          </tr>
          <tr>
            <td>Penggunaan Toilet</td>
            <td> {{ penilaian?.barthel?.toilet?.label }} </td>
            <td> {{ penilaian?.barthel?.toilet?.skor }} </td>
          </tr>
          <tr>
            <td>Transfer</td>
            <td> {{ penilaian?.barthel?.transfer?.label }} </td>
            <td> {{ penilaian?.barthel?.transfer?.skor }} </td>
          </tr>
          <tr>
            <td>Mobilitas</td>
            <td> {{ penilaian?.barthel?.mobilitas?.label }} </td>
            <td> {{ penilaian?.barthel?.mobilitas?.skor }} </td>
          </tr>
          <tr>
            <td>Naik dan turun tangga</td>
            <td> {{ penilaian?.barthel?.ntTangga?.label }} </td>
            <td> {{ penilaian?.barthel?.ntTangga?.skor }} </td>
          </tr>
          <tr class="text-weight-bold">
            <td colspan="3">
              <div class="row justify-between q-px-lg">
                <div class="col-auto">
                  Total Skor :
                </div>
                <div class="col-auto">
                  {{ penilaian?.barthel?.skorBarthel?.skor }} ( {{
                    penilaian?.barthel?.skorBarthel?.label }} )
                </div>
              </div>
            </td>

          </tr>

        </tbody>
      </table>
    </div>
    <!-- Penilaian : Assasement Fungsional Norton -->
    <div class="section" v-if="penilaian?.norton">
      <div class="section-title">Resiko Ulkus Dekubitus Skala Norton : </div>
      <table>
        <thead>
          <tr>
            <th>Keadaan Pasien</th>
            <th>Keterangan</th>
            <th>Skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kondisi Fisik Umum</td>
            <td> {{ penilaian?.norton?.kondisiFisik?.label }} </td>
            <td> {{ penilaian?.norton?.kondisiFisik?.skor }} </td>
          </tr>
          <tr>
            <td>Kesadaran</td>
            <td> {{ penilaian?.norton?.kesadaran?.label }} </td>
            <td> {{ penilaian?.norton?.kesadaran?.skor }} </td>
          </tr>
          <tr>
            <td>Aktivitas</td>
            <td> {{ penilaian?.norton?.aktivitas?.label }} </td>
            <td> {{ penilaian?.norton?.aktivitas?.skor }} </td>
          </tr>
          <tr>
            <td>Mobilitas</td>
            <td> {{ penilaian?.norton?.mobilitas?.label }} </td>
            <td> {{ penilaian?.norton?.mobilitas?.skor }} </td>
          </tr>
          <tr>
            <td>Inkontinensia</td>
            <td> {{ penilaian?.norton?.inkontinensia?.label }} </td>
            <td> {{ penilaian?.norton?.inkontinensia?.skor }} </td>
          </tr>

          <tr class="text-weight-bold">
            <td colspan="3">
              <div class="row justify-between q-px-lg">
                <div class="col-auto">
                  Total Skor :
                </div>
                <div class="col-auto">
                  {{ penilaian?.norton?.skorNorton?.skor }} ( {{
                    penilaian?.norton?.skorNorton?.label }} )
                </div>
              </div>
            </td>

          </tr>

        </tbody>
      </table>
    </div>




    <!-- Penilaian : Assasement Resiko Jatuh Morse Fall-->
    <div class="section" v-if="penilaian?.morse_fall">
      <div class="section-title">Resiko Jatuh Morse Fall Scale (18 - 59 tahun) : </div>
      <table>
        <thead>
          <tr>
            <th>Skala</th>
            <th>Keterangan</th>
            <th>Skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Riwayat Jatuh</td>
            <td> {{ penilaian?.morse_fall?.riwayatJth?.label }} </td>
            <td> {{ penilaian?.morse_fall?.riwayatJth?.skor }} </td>
          </tr>
          <tr>
            <td>Diagnosis Sekunder (? 2 Diagnosis Medis)</td>
            <td> {{ penilaian?.morse_fall?.diagnosis?.label }} </td>
            <td> {{ penilaian?.morse_fall?.diagnosis?.skor }} </td>
          </tr>
          <tr>
            <td>Alat Bantu Mobilisasi</td>
            <td> {{ penilaian?.morse_fall?.alatBantu?.label }} </td>
            <td> {{ penilaian?.morse_fall?.alatBantu?.skor }} </td>
          </tr>
          <tr>
            <td>Terpasang Infus</td>
            <td> {{ penilaian?.morse_fall?.infus?.label }} </td>
            <td> {{ penilaian?.morse_fall?.infus?.skor }} </td>
          </tr>
          <tr>
            <td>Gaya Berjalan</td>
            <td> {{ penilaian?.morse_fall?.gayaJalan?.label }} </td>
            <td> {{ penilaian?.morse_fall?.gayaJalan?.skor }} </td>
          </tr>
          <tr>
            <td>Status Mental</td>
            <td> {{ penilaian?.morse_fall?.mental?.label }} </td>
            <td> {{ penilaian?.morse_fall?.mental?.skor }} </td>
          </tr>

          <tr class="text-weight-bold">
            <td colspan="3">
              <div class="row justify-between q-px-lg">
                <div class="col-auto">
                  Total Skor :
                </div>
                <div class="col-auto">
                  {{ penilaian?.morse_fall?.skorMorse?.skor }} ( {{
                    penilaian?.morse_fall?.skorMorse?.label }} )
                </div>
              </div>
            </td>

          </tr>

        </tbody>
      </table>
    </div>

    <!-- Penilaian : Assasement Resiko Jatuh Ontario-->
    <div class="section" v-if="penilaian?.ontario">
      <div class="section-title">Resiko Jatuh Ontario / Sidney Scoring (geriatric dg usia >=60 tahun) : </div>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Skrining</th>
            <th>Jawaban</th>
            <th>Skor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="2">Riwayat Jatuh</td>
            <td> Apakah pasien datang kerumah sakit karena jatuh? </td>
            <td> {{ penilaian?.ontario?.riwayatJth_a?.label }} </td>
            <td> {{ penilaian?.ontario?.riwayatJth_a?.skor }} </td>
          </tr>
          <tr>
            <td> Jika tidak, apakah pasien mengalami jatuh dalam 2 bulan terakhir ini? </td>
            <td> {{ penilaian?.ontario?.riwayatJth_b?.label }} </td>
            <td> {{ penilaian?.ontario?.riwayatJth_b?.skor }} </td>
          </tr>

          <tr>
            <td rowspan="3">Status Mental</td>
            <td> Apakah pasien delirium? (tidak dapat membuat keputusan, pola pikir tidak terorganisir, gangguan daya
              ingat) </td>
            <td> {{ penilaian?.ontario?.statusMental_a?.label }} </td>
            <td> {{ penilaian?.ontario?.statusMental_a?.skor }} </td>
          </tr>
          <tr>
            <td> Apakah pasien disorientasi? (salah menyebutkan waktu, tempat atau orang) </td>
            <td> {{ penilaian?.ontario?.statusMental_b?.label }} </td>
            <td> {{ penilaian?.ontario?.statusMental_b?.skor }} </td>
          </tr>
          <tr>
            <td> Apakah pasien agitasi? (ketakutan, gelisah dan cemas) </td>
            <td> {{ penilaian?.ontario?.statusMental_c?.label }} </td>
            <td> {{ penilaian?.ontario?.statusMental_c?.skor }} </td>
          </tr>

          <tr>
            <td rowspan="3">Penglihatan </td>
            <td> Apakah pasien memakai kaca mata? </td>
            <td> {{ penilaian?.ontario?.penglihatan_a?.label }} </td>
            <td> {{ penilaian?.ontario?.penglihatan_a?.skor }} </td>
          </tr>
          <tr>
            <td> Apakah pasien mengeluh adanya penglihatan buram? </td>
            <td> {{ penilaian?.ontario?.penglihatan_b?.label }} </td>
            <td> {{ penilaian?.ontario?.penglihatan_b?.skor }} </td>
          </tr>
          <tr>
            <td> Apakah pasien memiliki glaukoma, katarak, atau degenerasi makula? </td>
            <td> {{ penilaian?.ontario?.penglihatan_c?.label }} </td>
            <td> {{ penilaian?.ontario?.penglihatan_c?.skor }} </td>
          </tr>

          <tr>
            <td>Kebiasaan Berkemih</td>
            <td> Apakah terdapat perubahan perilaku berkemih? (frekuensi, urgensi, inkontinensia, nokturia) </td>
            <td> {{ penilaian?.ontario?.berkemih_a?.label }} </td>
            <td> {{ penilaian?.ontario?.berkemih_a?.skor }} </td>
          </tr>
          <tr>
            <td>Transfer (dr tempat tidur ke kursi dan sebaliknya)</td>
            <td colspan="2"> {{ penilaian?.ontario?.transfertk?.label }} </td>
            <td> {{ penilaian?.ontario?.transfertk?.skor }} </td>
          </tr>
          <tr>
            <td>Mobilitas</td>
            <td colspan="2"> {{ penilaian?.ontario?.mobilitas?.label }} </td>
            <td> {{ penilaian?.ontario?.mobilitas?.skor }} </td>
          </tr>

          <tr class="text-weight-bold">
            <td colspan="4">
              <div class="row justify-between q-px-lg">
                <div class="col-auto">
                  Total Skor :
                </div>
                <div class="col-auto">
                  {{ penilaian?.ontario?.skorOntario?.skor }} ( {{
                    penilaian?.ontario?.skorOntario?.label }} )
                </div>
              </div>
            </td>

          </tr>

        </tbody>
      </table>
    </div>

    <!-- Penilaian : Assasement Resiko Jatuh Humpty-->
    <div class="section" v-if="penilaian?.humpty_dumpty">
      <div class="section-title"> Resiko Jatuh Humpty Dumpty Fall Scale ( {{ '<' }}18 tahun) : </div>
          <table>
            <thead>
              <tr>
                <th>Skala</th>
                <th>Keterangan</th>
                <th>Skor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Usia</td>
                <td> {{ penilaian?.humpty_dumpty?.usia?.label }} </td>
                <td> {{ penilaian?.humpty_dumpty?.usia?.skor }} </td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td> {{ penilaian?.humpty_dumpty?.kelamin?.label }} </td>
                <td> {{ penilaian?.humpty_dumpty?.kelamin?.skor }} </td>
              </tr>
              <tr>
                <td>Aktivitas</td>
                <td> {{ penilaian?.humpty_dumpty?.aktivitas?.label }} </td>
                <td> {{ penilaian?.humpty_dumpty?.aktivitas?.skor }} </td>
              </tr>
              <tr>
                <td>Gangguan Kognitif</td>
                <td> {{ penilaian?.humpty_dumpty?.kognitif?.label }} </td>
                <td> {{ penilaian?.humpty_dumpty?.kognitif?.skor }} </td>
              </tr>
              <tr>
                <td>Faktor Lingkungan</td>
                <td> {{ penilaian?.humpty_dumpty?.lingkungan?.label }} </td>
                <td> {{ penilaian?.humpty_dumpty?.lingkungan?.skor }} </td>
              </tr>
              <tr>
                <td>Respon Pada Pembedahan/ Sedasi/Anastesi</td>
                <td> {{ penilaian?.humpty_dumpty?.pembedahan?.label }} </td>
                <td> {{ penilaian?.humpty_dumpty?.pembedahan?.skor }} </td>
              </tr>
              <tr>
                <td>Pengobatan</td>
                <td> {{ penilaian?.humpty_dumpty?.pengobatan?.label }} </td>
                <td> {{ penilaian?.humpty_dumpty?.pengobatan?.skor }} </td>
              </tr>

              <tr class="text-weight-bold">
                <td colspan="3">
                  <div class="row justify-between q-px-lg">
                    <div class="col-auto">
                      Total Skor :
                    </div>
                    <div class="col-auto">
                      {{ penilaian?.humpty_dumpty?.skorHumpty?.skor }} ( {{
                        penilaian?.humpty_dumpty?.skorHumpty?.label }} )
                    </div>
                  </div>
                </td>

              </tr>

            </tbody>
          </table>
      </div>

      <!-- Diagnosa keperawatan -->
      <div class="section">
        <div class="section-title">Diagnosis Keperawatan</div>
        <table style="margin-top: -5px;">
          <thead>
            <tr>
              <th>DIAGNOSA KEPERAWATAN</th>
              <th>PLANN</th>
              <th>INTERVENSI</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in pasien?.diagnosakeperawatan" :key="i">
              <tr>
                <td>
                  <div> - {{ item?.nama }}</div>
                </td>
                <td>
                  <div v-for="plann in kepPlann(item)" :key="plann">
                    <div class="row no-wrap">
                      <div class="col-auto q-mr-xs">-</div>
                      <div class="col-auto">{{ plann?.masterintervensi?.nama }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div v-for="plann in kepInter(item)" :key="plann">
                    <div class="row no-wrap">
                      <div class="col-auto q-mr-xs">-</div>
                      <div class="col-auto">{{ plann?.masterintervensi?.nama }}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

      </div>


      <!-- Discharge Planning -->
      <div class="section">
        <div class="section-title">Dhischarge Planning</div>
        <div class="row q-pb-sm">
          <div class="col-4">
            Perkiraan Lama Rawat :
          </div>
          <div class="col-8">
            Sudah bisa ditetapkan <span class="q-px-xs text-weight-bold">{{
              jawabdischargeplanning?.rs20
            }}</span>hari; Rencana tanggal pulang : <span class="q-px-xs text-weight-bold">{{
                jawabdischargeplanning?.tglRencanaPulang ?? '-' }}</span>
          </div>
          <div class="col-4">
          </div>
          <div class="col-8">
            Belum bisa ditetapkan, karena <span class="q-px-xs text-weight-bold">{{
              jawabdischargeplanning?.rs21 ?? '-' }}</span>
          </div>
        </div>
        <table style="margin-top: -5px;">
          <thead>
            <tr>
              <th>Faktor Resiko Pasien Pulang</th>
              <th>Ya/Tidak</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in dischargeplanning" :key="i">
              <tr>
                <td>{{ item?.label }}</td>
                <td>{{ item?.value }}</td>
                <td>{{ item?.ket ?? '-' }}</td>
              </tr>
            </template>
          </tbody>
        </table>

      </div>
      <div class="section">

        <div class="flex justify-between q-mx-xl">

          <div>
            <table border="0" style="border: none !important; margin-left: 10px; margin-top:  5px;">
              <tbody>
                <tr style="border: none !important; padding: 0px !important;">
                  <td style="border: none !important; padding: 0px !important; width: 17%">
                    <div class="text-weight-bold">TANGGAL</div>
                  </td>
                  <td valign="top" style="border: none !important; padding: 0px !important;"> :
                    {{ dateFullFormat(pasien?.tglmasuk) }} </td>
                </tr>
                <tr style="border: none !important; padding: 0px !important;">
                  <td style="border: none !important; padding: 0px !important; width: 17%">
                    <div class="text-italic">JAM</div>
                  </td>
                  <td valign="top" style="border: none !important; padding: 0px !important;"> : {{
                    jamTnpDetik(pasien?.tglmasuk) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="column flex-center">
            <div>
              Pasien / Keluarga
            </div>
            <!-- <div v-if="penerimanEdu?.ttdPenerima" class="relative-position" style="width: 80px;">
                        <vue-qrcode :value="qrPenerima" tag="svg" :options="{
                          errorCorrectionLevel: 'Q',
                          color: {
                            dark: '#000000',
                            light: '#ffffff',
                          },
                          margin: 0
                        }" />
                      </div> -->
            <div style="padding-bottom: 20px" />
            <div>
              <img v-if="penerimanEdu?.ttd_penerima" :src="penerimanEdu?.ttd_penerima" alt="ttd penerima" width="80">
              <div v-else>ttd</div>
            </div>
            <div class="text-wrap text-center">{{ penerimanEdu?.namaPenerima }}</div>
          </div>


          <div class="column flex-center">

            <div>PERAWAT / BIDAN</div>
            <!-- <div style="margin-top: -5px; margin-bottom: 10px;">DOCTOR</div> -->

            <div class="relative-position" style="width: 80px;">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
              <!-- <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH"> -->
            </div>
            <div class="text-wrap text-center">{{ anamnesisAwal?.petugas?.nama }}</div>
          </div>
        </div>
      </div>


    </div>
</template>
<script setup>
import { api, pathImg } from 'src/boot/axios'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'
import { useImplementasiEdukasiRanapStore } from 'src/stores/simrs/ranap/implementasiEdukasi'
import { imageToBase64 } from 'src/modules/imgBase64';
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Array,
    default: null
  }
})

// const dpjp = ref(null)
const impEdukasi = useImplementasiEdukasiRanapStore()
onMounted(async () => {
  // await getDpjpData()
  await impEdukasi.getList(props.pasien)

  if (penerimanEdu.value) {
    initImage(penerimanEdu.value)
  }
})


// const getDpjpData = async () => {
//   const res = await api.get(`/v1/pegawai/master/pegawai-by-kdpegsimrs?kdpegsimrs=${props?.pasien?.kodedokter}`)
//   // console.log('res', res);
//   if (res.status === 200) {
//     dpjp.value = res.data

//   }

// }
const penerimanEdu = computed(() => {
  const ttd = impEdukasi?.items[0]

  console.log('ttd', ttd)
  return ttd
})
function initImage(item) {
  console.log('item imgeee', item);
  if (!item?.ttdPenerima) {
    item.ttd_penerima = null
    return
  }
  const ttdPenerima = pathImg + item?.ttdPenerima

  Promise.all([
    imageToBase64(ttdPenerima, (base64Image) => {
      // document.getElementsByClassName('ttd-yg-menyatakan')[0].src = base64Image
      // document.getElementsByClassName('ttd-yg-menyatakan')[1].src = base64Image
      item.ttd_penerima = base64Image ?? ''
    })
  ])
}
const qrDokter = computed(() => {
  // const petugas = 'Nama : ' + dpjp?.value?.nama ?? '' + 'NIP : ' + dpjp?.value?.nip ?? ''
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'ASESSMENT-AWAL-KEPERAWATAN.png'
  const asal = 'RANAP'
  const petugas = anamnesisAwal.value?.petugas?.kdpegsimrs || null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})

const qrPenerima = computed(() => {
  // console.log('user', user);
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'ASESSMENT-AWAL-KEPERAWATAN.png'
  const asal = 'RANAP'
  const ttdPenerima = penerimanEdu.value?.ttdPenerima ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${ttdPenerima}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})
function kepPlann(item) {
  const inter = item?.intervensi?.filter(x => x?.masterintervensi?.group === 'plann')
  // console.log('item', item, inter)
  return inter
}
function kepInter(item) {
  const inter = item?.intervensi?.filter(x => x?.masterintervensi?.group !== 'plann')
  // console.log('item', item, inter)
  return inter
}

const anamnesisAwal = computed(() => {
  const awalper = props?.pasien?.anamnesis?.find(x => x?.awal === '1' && x?.nakes === '2') || null
  const awalBid = props?.pasien?.anamnesis?.find(x => x?.awal === '1' && x?.nakes === '3') || null
  const awal = awalper ?? awalBid
  console.log('anamnesisAwal', awal)

  return awal
})

const edukasi = computed(() => {
  const edu = JSON.parse(pemeriksaanUmum.value?.edukasi)
  // console.log('edu', edu)

  return edu
})

const pemeriksaanUmum = computed(() => {
  const awalper = props?.pasien?.pemeriksaan?.find(x => x?.awal === '1' && x?.nakes === '2') || null
  const awalBid = props?.pasien?.pemeriksaan?.find(x => x?.awal === '1' && x?.nakes === '3') || null
  const awal = awalper ?? awalBid
  console.log('awal pemerikasaan', awal)

  return awal
})

const penilaian = computed(() => {
  const awalper = props?.pasien?.penilaian?.find(x => x?.awal === '1' && x?.group_nakes === '2') || null
  const awalBid = props?.pasien?.penilaian?.find(x => x?.awal === '1' && x?.group_nakes === '3') || null
  const awal = awalper ?? awalBid
  // console.log('awal pemerikasaan', awal)

  return awal
})
const jawabdischargeplanning = props.pasien?.skriningdischargeplannings?.[0]

const dischargeplanning = computed(() => [
  { label: 'Apakah pasien tinggal sendiri', value: jawabdischargeplanning?.rs4, ket: jawabdischargeplanning?.rs4Ket },
  { label: 'Apakah pasien tinggal bersama keluarga', value: jawabdischargeplanning?.rs5, ket: jawabdischargeplanning?.rs5Ket },
  { label: 'Apakah pasien khawatir jika pulang ke rumah', value: jawabdischargeplanning?.rs6, ket: jawabdischargeplanning?.rs6Ket },
  { label: 'Apakah saat di rumah pasien ada yang merawat', value: jawabdischargeplanning?.rs7, ket: jawabdischargeplanning?.rs7Ket },
  { label: 'Bagaimana jenis tempat tinggal pasien', value: jawabdischargeplanning?.rs8, ket: '' },
  { label: 'Apakah tempat tinggal pasien ada tetangga', value: jawabdischargeplanning?.rs9, ket: jawabdischargeplanning?.rs9Ket },
  { label: 'Apakah pasien mempunyai tanggung jawab menafkahi keluarga/saudara', value: jawabdischargeplanning?.rs10, ket: jawabdischargeplanning?.rs10Ket },
  { label: 'Apakah pasien mempunyai tanggung jawab memelihara hewan peliharaan', value: jawabdischargeplanning?.rs11, ket: jawabdischargeplanning?.rs11Ket },
  { label: 'Apakah ketika pulang, masih ada perawatan lanjutan yang harus dilakukan', value: jawabdischargeplanning?.rs12, ket: jawabdischargeplanning?.rs12Ket },
  { label: 'Apakah ketika pulang, pasien harus kontrol ke lebih dari 2 dokter', value: jawabdischargeplanning?.rs13, ket: jawabdischargeplanning?.rs13Ket },
  { label: 'Apakah pasien pulang dengan membawa obat lebih dari 6 jenis obat', value: jawabdischargeplanning?.rs14, ket: jawabdischargeplanning?.rs14Ket },
  { label: 'Apakah pasien mengajukan permohonan untuk pendamping (care giver) dari rumah sakit', value: jawabdischargeplanning?.rs15, ket: jawabdischargeplanning?.rs15Ket },
  { label: 'Apakah pasien memiliki transportasi untuk pulang', value: jawabdischargeplanning?.rs22, ket: jawabdischargeplanning?.rs22Ket },
  { label: 'Apakah pasien memerlukan alat bantu', value: jawabdischargeplanning?.rs16, ket: jawabdischargeplanning?.rs16Ket },
  { label: 'Apakah pasien memerlukan pemantauan minum obat', value: jawabdischargeplanning?.rs17, ket: jawabdischargeplanning?.rs17Ket },
  { label: 'Apakah pasien memerlukan pemantauan diet/makanan', value: jawabdischargeplanning?.rs18, ket: jawabdischargeplanning?.rs18Ket },
  { label: 'Apakah pasien memerlukan latihan fisik', value: jawabdischargeplanning?.rs19, ket: jawabdischargeplanning?.rs19Ket }
])

</script>

<style lang="scss" scoped>
.kotak {
  border: 1px solid black;
}

.sisi-kanan {
  border-right: 1px solid black;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.section {
  margin-top: 20px;
}

.section-title {
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.data {
  margin-left: 20px;
}

.data-item {
  margin-bottom: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #000;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}


.signature-line {
  padding-top: 85px;
}

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  padding: 20px !important;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0px !important;
  }

  @page {
    // size: 8.5in 9in;
    size: letter;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD MOH SALEH KOTA PROBOLINGGO | Hal Ke-" counter(page);
    }
  }

  .contentx {
    page-break-after: auto;
    // break-after: page;
  }

}
</style>
