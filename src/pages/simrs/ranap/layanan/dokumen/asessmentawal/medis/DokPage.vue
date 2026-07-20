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
            {{ kasus?.uraian.toUpperCase() }}
          </div>
          <div class="text-center text-bold">
            RAWAT INAP
          </div>
        </div>
      </div>
    </div>

    <!-- Pasien -->
    <div class="flex justify-between kotak q-mt-xs q-pa-sm" style="gap:0 10px">
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

    <!-- Anamnesis -->

    <div class="section">
      <div class="section-title">Anamnesis : </div>
      <div class="data">
        <div class="data-item">1. Keluhan Utama / Chief Complaint : {{ anamnesisAwal?.keluhanUtama || '-' }}</div>
        <div class="data-item">2. Riwayat Penyakit Sekarang / Present Disease History : {{
          anamnesisAwal?.riwayatpenyakitsekarang || '-' }}</div>
        <div class="data-item">3. Riwayat Penyakit Dahulu / Past Disease History : {{ anamnesisAwal?.riwayatpenyakit ||
          '-' }}
          <div v-if="anamnesisAwal?.kebidanan" class="q-pl-md">- Pernah Dirawat ? {{ anamnesisAwal?.kebidanan?.rwRawat
          }}, Pernah Dioperasi ? {{ anamnesisAwal?.kebidanan?.rwOperasi }}</div>
          <div v-if="anamnesisAwal?.kebidanan" class="q-pl-md">- Penyakit Gynecology {{
            anamnesisAwal?.kebidanan?.rwGynecology || '-' }}</div>
        </div>
        <div class="data-item">4. Riwayat Penyakit Keluarga / History Disease in the Family : {{
          anamnesisAwal?.riwayatpenyakitkeluarga || '-' }}</div>
        <div class="data-item">5. Riwayat Pekerjaan / History of Job : {{
          anamnesisAwal?.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya || '-' }}</div>
        <!-- <div class="data-item">6. Status Sosial / Social Status : {{ pemeriksaanUmum?.sosial || '-' }}</div>
        <div class="data-item">7. Status Ekonomi / Economic Status : {{ pemeriksaanUmum?.ansuransi || '-' }} {{
          pemeriksaanUmum?.ansuransi ? 'Ansuransi' : '' }}
        </div>
        <div class="data-item">8. Status Kejiwaan dan Kebiasaan / Psychological Status : {{
          pemeriksaanUmum?.statusPsikologis }}</div>
        <div class="data-item flex">9. Kultural / Cultural :
          <div class="q-ml-sm">
            <div>- Pola Komunikasi {{ pemeriksaanUmum?.komunikasi }}</div>
            <div>- Pantangan Makanan {{ pemeriksaanUmum?.pantanganMkanan }}</div>
            <div>- makanan Pokok : {{ pemeriksaanUmum?.makananPokok }}</div>
          </div>
        </div> -->
        <div class="data-item">6. Riwayat Alergi : <span v-html="getNewLine(ALERGI || '-')" /></div>
        <div class="data-item flex">7. Kajian Nyeri :
          <template v-if="anamnesisAwal">
            <div class="q-ml-sm" v-if="anamnesisAwal?.keluhannyeri?.dewasa !== null">
              <div>{{ anamnesisAwal?.keluhannyeri?.dewasa?.kajianNyeri }}</div>
              <div>- Keterangan : {{ anamnesisAwal?.keluhannyeri?.dewasa?.ket }}</div>
              <div>- Ekpresi Wajah : {{ anamnesisAwal?.keluhannyeri?.dewasa?.form?.ekspresiWajah?.text }}</div>
              <div>- Gerakan Tangan : {{ anamnesisAwal?.keluhannyeri?.dewasa?.form?.gerakanTangan?.text }}</div>
              <div>- Kepatuhan terhadap ventilasi mekanik : {{
                anamnesisAwal?.keluhannyeri?.dewasa?.form?.kebutuhanVentilasi?.text }}</div>
            </div>
            <div class="q-ml-sm" v-if="anamnesisAwal?.keluhannyeri?.pediatrik !== null">
              <div>{{ anamnesisAwal?.keluhannyeri?.pediatrik?.kajianNyeri }}</div>
              <div>- Keterangan : {{ anamnesisAwal?.keluhannyeri?.pediatrik?.ket }}</div>
              <div>- Ekpresi Wajah : {{ anamnesisAwal?.keluhannyeri?.pediatrik?.form?.ekspresiWajah?.text }}</div>
              <div>- Gerakan Tangan : {{ anamnesisAwal?.keluhannyeri?.pediatrik?.form?.gerakanTangan?.text }}</div>
              <div>- Kepatuhan terhadap ventilasi mekanik : {{
                anamnesisAwal?.keluhannyeri?.pediatrik?.form?.kebutuhanVentilasi?.text }}</div>
            </div>
            <div class="q-ml-sm" v-if="anamnesisAwal?.keluhannyeri?.kebidanan !== null">
              <div>{{ anamnesisAwal?.keluhannyeri?.kebidanan?.kajianNyeri ?? '-' }}</div>
              <div>- Keterangan : {{ anamnesisAwal?.keluhannyeri?.kebidanan?.ket ?? '-' }}</div>
              <div>- Ekpresi Wajah : {{ anamnesisAwal?.keluhannyeri?.kebidanan?.form?.ekspresiWajah?.text ?? '-' }}
              </div>
              <div>- Gerakan Tangan : {{ anamnesisAwal?.keluhannyeri?.kebidanan?.form?.gerakanTangan?.text ?? '-' }}
              </div>
              <div>- Kepatuhan terhadap ventilasi mekanik : {{
                anamnesisAwal?.keluhannyeri?.kebidanan?.form?.kebutuhanVentilasi?.text ?? '-' }}</div>
            </div>
            <div class="q-ml-sm" v-else>
              <div> - </div>
            </div>
          </template>
          <template v-else>
            <div class="q-ml-sm">
              <div> - </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="section">

      <!-- <template v-if="anamnesisAwal?.kebidanan">
        <div class="section-title" style="margin-top: 5px;">Riwayat KB: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Jenis KB</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.rwKbJns || '-' }}
              </td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Lama KB</td>
              <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.kebidanan?.rwKbLama ||
                '-' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Keluhan KB</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.rwKbKeluhan || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title" style="margin-top: 5px;">Riwayat Menstruasi: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Menarche</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.menarche || '-' }} thn
              </td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Siklus Hari</td>
              <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.kebidanan?.siklusHari ||
                '-' }} Hari
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Siklus</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.siklus || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Lama Menstruasi</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.lamaMens || '-' }} hari</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Kondisi Menstruasi</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.kondisiMens || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- HPHT</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.hpht || '-' }}</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Tgl Perkiraan Persalinan</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.tglPerkPersalinan || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="section-title" style="margin-top: 5px;">Riwayat Perkawinan: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Status</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.rwKawinStatus || '-' }}
              </td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Perkawinan ke</td>
              <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.kebidanan?.kawinKe ||
                '-' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Nikah Umur</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.nikahUmur || '-' }} thn</td>
            </tr>
          </tbody>
        </table>
        <div class="section-title" style="margin-top: 5px;">Riwayat Kehamilan, Persalinan, Nifas: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- G / P / Ab / Ah</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.g || '-' }} / {{ anamnesisAwal?.kebidanan?.p || '-' }} / {{
                  anamnesisAwal?.kebidanan?.ab || '-' }} / {{ anamnesisAwal?.kebidanan?.ah || '-' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Imunisasi</td>
              <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.kebidanan?.imunisasi ||
                '-' }}
              </td>
            </tr>
          </tbody>
        </table>

        <table class="q-mb-md" style="margin-top: 5px;">
          <thead>
            <tr>
              <th width="3%">
                No
              </th>
              <th width="3%">
                P/L
              </th>
              <th width="10%">
                Umur Anak
              </th>
              <th>K/U Anak</th>
              <th>BBL</th>
              <th>Riwayat Kehamilan</th>
            </tr>
          </thead>
          <tbody v-if="store.riwayatKehamilans.length">
            <tr v-for="(item, i) in store.riwayatKehamilans" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ item?.pl }}</td>
              <td>{{ item?.umurAnak }}</td>
              <td>{{ item?.kuAnak }}</td>
              <td>{{ item?.bbl }}</td>
              <td>{{ item?.riwayatKehamilan }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7">
                <div class="flex flex-center">
                  Belum ada riwayat Kehamilan
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="section-title" style="margin-top: 5px;">Pola Eliminasi: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- BAB</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.bab || '-' }} kali/hari</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Konsistensi</td>
              <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.kebidanan?.konsistensi
                ||
                '-' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Warna</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.warna || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Peristatik Usus</td>
              <td style="border: none !important; padding: 0px !important;">: {{
                anamnesisAwal?.kebidanan?.peristatikUsus ||
                '-' }} kali/menit
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Flatus</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.flatus || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- BAK</td>
              <td style="border: none !important; padding: 0px !important;">: {{
                anamnesisAwal?.kebidanan?.bak ||
                '-' }} kali/hari
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Keluhan BAK</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.keluhanBak || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Keluhan</td>
              <td style="border: none !important; padding: 0px !important;">: {{
                anamnesisAwal?.kebidanan?.keluhan ||
                '-' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Jumlah BAK</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.jmlBak || '-' }} ml/hari</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Warna Urine</td>
              <td style="border: none !important; padding: 0px !important;">: {{
                anamnesisAwal?.kebidanan?.warnaUrine ||
                '-' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Terpasang Kateter</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.kebidanan?.kateter || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Kateter Hari ke</td>
              <td style="border: none !important; padding: 0px !important;">: {{
                anamnesisAwal?.kebidanan?.kttHrKe ||
                '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </template> -->


      <template v-if="anamnesisAwal?.pediatrik">
        <div class="section-title" style="margin-top: 5px;">Riwayat Penyekit Kelahiran: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:20%;">- Anak ke</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.pediatrik?.anakKe || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Jumlah Saudara</td>
              <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.pediatrik?.jmlSaudara
                ||
                '-' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Cara Kelahiran</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.pediatrik?.crKelahiran || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Umur Kelahiran</td>
              <td style="border: none !important; padding: 0px !important;">: {{
                anamnesisAwal?.pediatrik?.umurKelahiran
                || '-' }} </td>
            </tr>

            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Kelaian Bawaan</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                anamnesisAwal?.pediatrik?.klainanBawaan || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title" style="margin-top: 5px;">Riwayat Imunisasi: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Imunisasi</td>
              <td style="border: none !important; padding: 0px !important;"> :
                {{ anamnesisAwal?.pediatrik?.rwImunisasi?.join(', ') || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title" style="margin-top: 5px;">Riwayat Tumbuh Kembang Anak: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Gigi Pertama, Usia</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.gigiPertama || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Mulai Berjalan, Usia</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.berjalan || '-' }}</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Bisa Membaca, Usia</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.membaca || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Bisa Duduk, Usia</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.duduk || '-' }}</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Bisa Bicara, Usia</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.bicara || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title" style="margin-top: 5px;">Kebutuhan Dasar Saat Ini: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Makanan yang disukai</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.sukaMknan || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Makanan yang tidak disukai
              </td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.tdkSukaMknan || '-' }}</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Nafsu Makan</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.nafsuMkn || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Pola Makan</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.polaMakan || '-' }}</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Makanan yang diberikan</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.mknYgdiberikan || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="section-title" style="margin-top: 5px;">Pola Tidur: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Tidur Siang</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.tidurSiang || '-' }} jam / hari</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Tidur Malam
              </td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.tidurMalam || '-' }} jam / hari</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Kebiasaan Sebelum Makan</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.kebiasaanSblmMkn || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Adakah Nyeri</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.nyeri || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="section-title" style="margin-top: 5px;">Pola Kebersihan Diri: </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Mandi Sendiri</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.mandiSendiri || '-' }} kali / hari</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Dimandikan
              </td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.dimandikan || '-' }} kali / hari</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Gosok Gigi</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.gosokGigi || '-' }} kali / hari</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Keramas</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.keramas || '-' }} kali / minggu</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Kebersihan Kuku</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.kbersihanKuku || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Aktifitas Bermain</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.aktifitas || '-' }}</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Frekuensi BAB</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.babFrekuensi || '-' }} kali / hari</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Konsistensi BAB</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.babKonsistensi || '-' }}</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Bau BAB</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.babBau || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Buang Air Kecil</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.babKonsistenbakFrekuensisi || '-' }} kali / hari</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Warna Buang Air Kecil</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.bakWarna || '-' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 20%;">- Bau Buang Air Kecil</td>
              <td style="border: none !important; padding: 0px !important; width: 30%;"> :
                {{ anamnesisAwal?.pediatrik?.bakBau || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <div class="section-title" style="margin-top: 5px;">Pemeriksaan Umum : </div>
      <!-- <div class="data">
        <div class="data-item">Kesadaran: ............................................</div>
        <div class="data-item">Tekanan Darah: ............................................ mmHg</div>
        <div class="data-item">Nadi: ............................................ x/menit</div>
        <div class="data-item">Suhu: ............................................ &deg;C</div>
        <div class="data-item">Pernapasan: ............................................ x/menit</div>
        <div class="data-item">Keadaan Umum: Baik / Sedang / Buruk</div>
        <div class="data-item">Keadaan Gizi: Baik / Sedang / Buruk</div>
      </div> -->
      <table class="tablex">
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
                '-'
              }} cm</td>
              <td style="border: none !important; padding: 0px !important;"> - Lila</td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pediatrik?.lila || '-'
              }}
              </td>
            </tr>
          </template>

        </tbody>
      </table>

      <template v-if="!anamnesisAwal?.kebidanan">
        <div class="section-title" style="margin-top: 5px;">Kultural : </div>
        <!-- <div class="data">
        <div class="data-item">Kesadaran: ............................................</div>
        <div class="data-item">Tekanan Darah: ............................................ mmHg</div>
        <div class="data-item">Nadi: ............................................ x/menit</div>
        <div class="data-item">Suhu: ............................................ &deg;C</div>
        <div class="data-item">Pernapasan: ............................................ x/menit</div>
        <div class="data-item">Keadaan Umum: Baik / Sedang / Buruk</div>
        <div class="data-item">Keadaan Gizi: Baik / Sedang / Buruk</div>
      </div> -->
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:15%;"> - Penyebab Penyakit</td>
              <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
                pemeriksaanUmum?.penyebabSakit || ' - ' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 15%;"> - Pola Komunikasi </td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.komunikasi || ' - ' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:15%;"> - Makanan Pokok</td>
              <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
                pemeriksaanUmum?.makananPokok || ' - ' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 15%;"> - Pantangan Makanan </td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pantanganMkanan || '-'
              }}</td>
            </tr>
          </tbody>
        </table>
        <div class="section-title" style="margin-top: 5px;">Pemeriksaan Psikologis, Sosial Ekonomi, Spiritual : </div>
        <table class="tablex">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:15%;"> - Status Sosial</td>
              <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
                pemeriksaanUmum?.sosial || ' - ' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 15%;"> - Spiritual </td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.spiritual || ' - ' }}
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width:15%;"> - Status Kejiwaaan
              </td>
              <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
                pemeriksaanUmum?.statusPsikologis || ' - ' }}</td>
              <td style="border: none !important; padding: 0px !important; width: 15%;"> - Status Ekonomi </td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.ansuransi || ' - '
              }} Asuransi
              </td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td colspan="4" style="border: none !important; padding: 0px !important; width:15%;"> - Edukasi :</td>

            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td colspan="2"
                style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important; width:15%;">
                Apakah pasien /
                keluarga tahu mengenai penyakit dan perawatannya?</td>
              <td colspan="2" style="border: none !important; padding: 0px !important; width: 35%;"> : {{
                EDUKASI?.tahuPenanganan?.value || ' - ' }}</td>
            </tr>
            <tr style="border: none !important; padding: 0px !important;">
              <td colspan="2"
                style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important; width:15%;">
                Apakah membutuhkan
                edukasi?</td>
              <td colspan="2" style="border: none !important; padding: 0px !important; width: 35%;"> : {{
                EDUKASI?.butuhEdukasi?.value || ' - ' }}</td>
            </tr>
          </tbody>
        </table>

      </template>

      <!-- Skreening gizi Dewasa-->
      <div v-if="anamnesisAwal?.skreeninggizi?.dewasa" class="section">
        <div class="section-title">Skrining Gizi : </div>
        <table style="margin-top: -5px; margin-bottom: 5px;">
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
      <!-- <div v-if="anamnesisAwal?.skreeninggizi?.kebidanan" class="section">
        <div class="section-title">Skrining Gizi Pasien Obstetric / Kehamilan / Nifas : </div>
        <table style="margin-top: -5px; margin-bottom: 5px;">
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
      </div> -->

      <!-- Skreening gizi Pediatrik-->
      <div v-if="anamnesisAwal?.skreeninggizi?.pediatrik" class="section">
        <div class="section-title">Skrining Gizi Pediatrik : </div>
        <table style="margin-top: -5px; margin-bottom: 5px;">
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
              <td>Apakah terdapat penyakit atau keadaan yang mengakibatkan pasien beresiko malnutrisi? (Diare kronis,
                HIV,
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

      <div class="section-title" style="margin-top: 5px;">Pemeriksaan Fisik : </div>
      <table style="margin-top: -5px; margin-bottom: 5px;">
        <thead>
          <tr>
            <th>Bagian</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kepala (Head)</td>
            <!-- <td>{{ pemeriksaanUmum?.rs5?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.rs5?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs5 : '' }} </td>
          </tr>
          <tr v-if="pemeriksaanUmum?.kebidanan">
            <td>Mata</td>
            <!-- <td>{{ pemeriksaanUmum?.rs5?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.kebidanan?.mata }} </td>
          </tr>
          <!-- <tr>
          <td>Mata (Eyes)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
          <!-- <tr>
          <td>THT (ENT)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
          <!-- <tr>
          <td>Mulut (Mouth)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
          <tr>
            <td>Leher (Neck)</td>
            <!-- <td>{{ pemeriksaanUmum?.rs6?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td v-if="pemeriksaanUmum?.kebidanan"> {{ pemeriksaanUmum?.kebidanan?.leher }}</td>
            <td v-else> {{ pemeriksaanUmum?.rs6?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs6 : '' }} </td>
          </tr>
          <!-- <tr>
          <td>Jantung (Heart)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
          <tr>
            <td>Dada & Payudara (Chest & Breast)</td>
            <!-- <td>{{ pemeriksaanUmum?.rs7?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.rs7?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs7 : '' }}
              <template v-if="pemeriksaanUmum?.kebidanan">
                <div class="col">Puting Susu : {{ pemeriksaanUmum?.kebidanan?.putingMenonjol }}</div>
                <div class="col">Hiperpigmentasi Areola : {{ pemeriksaanUmum?.kebidanan?.hiperpigmentasi }}</div>
                <div class="col">Kolostrum : {{ pemeriksaanUmum?.kebidanan?.kolostrum }}</div>
                <div class="col">Konsistensi Payudara : {{ pemeriksaanUmum?.kebidanan?.konsistensiPayudara }}</div>
                <div class="col">Nyeri Tekan : {{ pemeriksaanUmum?.kebidanan?.nyeriTekan }}</div>
                <div class="col">Benjolan Abnormal : {{ pemeriksaanUmum?.kebidanan?.benjolan }}</div>
                <div class="col">Abdomen : {{ pemeriksaanUmum?.kebidanan?.abdomen }}</div>
                <div class="col">Anogenital : {{ pemeriksaanUmum?.kebidanan?.anoGenital }}</div>
                <div class="col">Ekstrimitas Tungkai : {{ pemeriksaanUmum?.kebidanan?.ekstremitasTungkai }}</div>
              </template>
            </td>
          </tr>
          <tr>
            <td>Punggung (Back)</td>
            <!-- <td>{{ pemeriksaanUmum?.rs8?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.rs8?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs8 : '' }} </td>
          </tr>
          <tr>
            <td>Perut (Abdomen)</td>
            <!-- <td>{{ pemeriksaanUmum?.rs9?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.rs9?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs9 : '' }} </td>
          </tr>
          <tr>
            <td>Urogenital</td>
            <!-- <td>{{ pemeriksaanUmum?.rs13?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.rs13?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs13 : '' }} </td>
          </tr>
          <!-- <tr>
          <td>Anggota Gerak (Extremities)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
          <tr>
            <td>Tangan (Hand)</td>
            <!-- <td>{{ pemeriksaanUmum?.rs10?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.rs10?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs10 : '' }} </td>
          </tr>
          <tr>
            <td>Kaki (Foot)</td>
            <!-- <td>{{ pemeriksaanUmum?.rs11?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.rs11?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs11 : '' }} </td>
          </tr>
          <tr>
            <td>Status Neurologis (Neurological Status)</td>
            <!-- <td>{{ pemeriksaanUmum?.rs12?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td> -->
            <td> {{ pemeriksaanUmum?.rs12?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs12 : '' }} </td>
          </tr>
          <!-- <tr>
          <td>Muskuloskeletal</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
        </tbody>
      </table>


      <!-- PEMERIKSAAN KHUSUS -->
      <!-- <div v-if="pemeriksaanUmum?.kebidanan" class="section-title" style="margin-top: 5px;">Pemeriksaan Khusus: </div>
      <table class="tablex">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td class="text-bold" style="border: none !important; padding: 0px !important; width:20%;">Hamil / Bersalin
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Inspeksi</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.hmlInspeksi || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Palpasi</td>
            <td style="border: none !important; padding: 0px !important;">: Puka {{
              pemeriksaanUmum?.kebidanan?.hmlTfuPuka || '-' }} cm, Puki {{ pemeriksaanUmum?.kebidanan?.hmlTfuPuki || '-'
              }}
              cm
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Presentasi</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.hmlTfuPresentasi || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Nyeri Tekan</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.hmlNyeri || '-' }}
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Osborn Test</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.hmlOsborn || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Cekungan pada Perut/Bandle</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.hmlCekung ||
              '-' }}
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Auskultasi</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.hmlAusTeratur || '-' }} kali/menit</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- His/Kontraksi</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.hmlAusDenyut ||
              '-' }} kali/menit
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Pengeluaran per Vaginam</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:20%;">
              Bentuk</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.hmlVgnBentuk || '-' }}</td>
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width: 20%;">
              Jumlah</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.hmlVgnJml ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:20%;">
              Air Ketuban</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.hmlVgnKtuban || '-' }}</td>
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width: 20%;">
              Vagina Toucher</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.hmlVgnToucher ||
              '-' }}</td>
          </tr>

          <tr style="border: none !important; padding: 0px !important;">
            <td class="text-bold" style="border: none !important; padding: 0px !important; width:20%;">Nifas
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Tinggi Fundus Uteri</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.nfsTfu || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Kontraksi Uterus</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.nfsUterus || '-' }} </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Pengeluaran per Vaginam</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:20%;">
              Bentuk</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.nfsVgnBentuk || '-' }}</td>
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width: 20%;">
              Jumlah</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.nfsVgnJml ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:20%;">
              Lochea</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.nfsVgnLochea || '-' }}</td>
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width: 20%;">
              Luka Jalan Lahir</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.nfsVgnLuka ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:20%;">
              Derajat Luka</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.nfsVgnDrjLuka || '-' }}</td>
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width: 20%;">
              Luka Post Sectio</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.nfsVgnLukaPost ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td class="text-bold" style="border: none !important; padding: 0px !important; width:20%;">Gynecologi
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Palpasi</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.gynecologiPalpasi || '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Inspekulo</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:20%;">
              Vagina</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.gynecologiInsVgn || '-' }}</td>
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width: 20%;">
              Portio</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.kebidanan?.gynecologiInsPortio ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:20%;">
              Vagina Toucher</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              pemeriksaanUmum?.kebidanan?.gynecologiInsVgnToucher || '-' }}</td>
          </tr>
        </tbody>
      </table> -->





      <!-- <template v-if="penilaian?.barthel">
        <div class="section-title" style="margin-top: 5px;">Pengkajian fungsional menggunakan Indeks Barthel : </div>
        <table style="margin-top: -5px;">
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

      </template>

      <template v-if="penilaian?.norton">
        <div class="section-title" style="margin-top: 5px;">Resiko Ulkus Dekubitus Skala Norton : </div>
        <table style="margin-top: -5px;">
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

      </template>

      <template v-if="penilaian?.morse_fall">
        <div class="section-title" style="margin-top: 5px;">Resiko Jatuh Morse Fall Scale (14 - 60 tahun) : </div>
        <table style="margin-top: -5px;">
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

      </template>
      <template v-if="penilaian?.ontario">
        <div class="section-title" style="margin-top: 5px;">Resiko Jatuh Ontario / Sidney Scoring (geriatric dg usia
          >=60
          tahun) : </div>
        <table style="margin-top: -5px;">
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

      </template> -->

    </div>






    <div class="section">
      <table class="tablex">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 35%">
              <div class="text-weight-bold">PEMERIKSAAN PENUNJANG PRE-RAWAT INAP</div>
              <div class="text-italic">PRE-INPATIENT SUPPORTING CHECKUP</div>
            </td>
            <td valign="top" style="border: none !important; padding: 0px !important;"> : </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Asesmen</div>
      <table style="margin-top: -5px;">
        <thead>
          <tr>
            <th width="50%" class="text-center">MASALAH MEDIS</th>
            <th width="50%">MASALAH KEPERAWATAN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="50%">{{ pasien?.memodiagnosa }}</td>
            <td width="50%">
              <div v-for="(item, i) in pasien?.diagnosakeperawatan" :key="i">
                <div> - {{ item?.nama }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>


    <div class="section">
      <table>
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 17%">
              <div class="text-weight-bold">DIAGNOSIS KERJA</div>
              <div class="text-italic">WORKING DIAGNOSIS</div>
            </td>
            <td valign="top" style="border: none !important; padding: 0px !important;"> : {{
              diagnosa?.masterdiagnosa?.rs4 || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <table>
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 17%">
              <div class="text-weight-bold">DIAGNOSIS BANDING</div>
              <div class="text-italic">DIFFERENTIAL DIAGNOSIS</div>
            </td>
            <td valign="top" style="border: none !important; padding: 0px !important;"> : {{
              diagnosa?.rs6 || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <table>
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 17%">
              <div class="text-weight-bold">PENGOBATAN</div>
              <div class="text-italic">THERAPY</div>
            </td>
            <td valign="top" style="border: none !important; padding: 0px !important;"> : {{
              pasien?.planningdokter?.terapi }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <table>
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 17%">
              <div class="text-weight-bold">RENCANA</div>
              <div class="text-italic">PLANNING</div>
            </td>
            <td valign="top" style="border: none !important; padding: 0px !important;">
              <div class="flex">
                <div class="q-mr-sm">: </div>
                <div>
                  <div>Monitoring : {{ pasien?.planningdokter?.monitor || '-' }}</div>
                  <div>Target : {{ pasien?.planningdokter?.target || '-' }}</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <table>
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 17%">
              <div class="text-weight-bold">CATATAN KIE</div>
              <div class="text-italic">EDUCATION NOTE</div>
            </td>
            <td valign="top" style="border: none !important; padding: 0px !important;"> : - </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <table>
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 17%">
              <div class="text-weight-bold">TANGGAL / DATE</div>
              <div class="text-italic">JAM / TIME</div>
            </td>
            <td valign="top" style="border: none !important; padding: 0px !important;"> : <b>Tanggal</b> {{
              dateFullFormat(pasien?.tglmasuk) }} / <b>Jam</b> {{ jamTnpDetik(pasien?.tglmasuk) }}</td>
          </tr>
        </tbody>
      </table>
    </div>


    <div class="section">

      <div class="flex justify-between q-mx-xl">
        <!-- <div class="flex-center " style="width: 60px;">
          <div class="relative-position">
            <vue-qrcode :value="qrDokter" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: {
                dark: '#000000',
                light: '#ffffff',
              },
              margin: 0
            }" />
          </div>
          <div class="f-8 text-wrap text-center">{{ dpjp?.nama }}</div>
        </div> -->

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


        <div class="column flex-center ">

          <!-- <div>DOKTER</div> -->
          <div style="margin-top: -5px; margin-bottom: 10px;">DOKTER</div>

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
          <div class="text-wrap text-center">{{ dpjp?.nama }}</div>
        </div>
      </div>
    </div>

  </div>



</template>

<script setup>
import { api, pathImg } from 'src/boot/axios'
import { dateFullFormat, getNewLine, jamTnpDetik } from 'src/modules/formatter'
import { imageToBase64 } from 'src/modules/imgBase64'
import { useAnamnesisRanapStore } from 'src/stores/simrs/ranap/anamnesis'
import { useImplementasiEdukasiRanapStore } from 'src/stores/simrs/ranap/implementasiEdukasi'
import { computed, onMounted, ref } from 'vue'


const impEdukasi = useImplementasiEdukasiRanapStore()
const store = useAnamnesisRanapStore()
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

const dpjp = ref(null)

onMounted(async () => {
  await getDpjpData()
  await impEdukasi.getList(props.pasien)
  if (penerimanEdu.value) {
    initImage(penerimanEdu.value)
  }
})



// console.log('props', props?.pasien);

const anamnesisAwal = computed(() => {
  const awal = props?.pasien?.anamnesis?.find(x => x?.awal === '1' && x?.nakes === '1') || null
  console.log('aanamnesisAwalwal', awal);

  return awal
})
const pemeriksaanUmum = computed(() => {
  const awal = props?.pasien?.pemeriksaan?.find(x => x?.awal === '1' && x?.nakes === '1') || null
  console.log('pemeriksaanUmum', awal);

  return awal
})

const penilaian = computed(() => {
  const awalper = props?.pasien?.penilaian?.find(x => x?.awal === '1' && x?.group_nakes === '2') || null
  const awalBid = props?.pasien?.penilaian?.find(x => x?.awal === '1' && x?.group_nakes === '3') || null
  const awal = awalper ?? awalBid
  console.log('Penilaian', awal)

  return awal
})

const EDUKASI = computed(() => {
  try {
    return JSON.parse(pemeriksaanUmum?.value?.edukasi || '{}')
  } catch {
    return {}
  }
})
const ALERGI = computed(() => {
  const finder = props?.pasien?.anamnesis?.find(x => x?.awal === '1')?.riwayatalergi ?? []
  const alergy = finder?.map((item) => item)?.join(', ') ?? null
  const keterangan = props?.pasien?.anamnesis?.find(x => x?.awal === '1')?.keteranganalergi ?? null
  return alergy + ' ' + (keterangan ?? null)
})
const diagnosa = computed(() => {
  const primer = props?.pasien?.diagnosa?.find(x => x?.rs4 === 'Primer' && x?.rs13 === 'POL014') || null
  // console.log('awal', primer);

  return primer
})


const getDpjpData = async () => {
  const res = await api.get(`/v1/pegawai/master/pegawai-by-kdpegsimrs?kdpegsimrs=${props?.pasien?.kodedokter}`)
  // console.log('res', res);
  if (res.status === 200) {
    dpjp.value = res.data

  }

}

const qrDokter = computed(() => {
  // const petugas = 'Nama : ' + dpjp?.value?.nama ?? '' + 'NIP : ' + dpjp?.value?.nip ?? ''
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'ASESSMENT-AWAL-MEDIS.png'
  const asal = 'RANAP'
  const petugas = dpjp?.value?.nip || null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})

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

.tablex {
  border: none;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  width: 100%;
  margin-top: -5px;
  margin-left: 10px;
  line-height: 1.1 !important;
}

.tablex tr {
  height: auto !important;
}

.tablex td {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1.5 !important;
  vertical-align: top;
}

.tablex tbody tr td {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
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
