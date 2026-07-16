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
      <div class="col-auto">Nama : {{ pasien?.nama_panggil }}</div>
      <div class="col-auto">No. RM : {{ pasien?.norm }}</div>
      <div class="col-auto">No. Register : {{ pasien?.noreg }}</div>
      <div class="col-auto">Tanggal : {{ dateFullFormat(pasien?.tglmasuk) }}</div>
      <div class="col-auto">Jam : {{ jamTnpDetik(pasien?.tglmasuk) }}</div>
    </div>


    <div class="section">
      <div class="section-title">Identitas: </div>
      <table class="tablex">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Nama Ibu</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.namaibu || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Nama Ayah </td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.namaayah || '-'
            }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Nama Penanggungjawab</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.penanggungJawab || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Hubungan dengan Pasien</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.hubPj || '-' }}
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Alamat</td>
            <td style="border: none !important; padding: 0px !important;"> : {{
              anamnesisAwal?.neonatal?.alamatPj || '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Telepon</td>
            <td style="border: none !important; padding: 0px !important;"> : {{
              anamnesisAwal?.neonatal?.noHpPj || '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Gol. Darah Ibu</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.golDarahIbu || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Gol. Darah Ayah</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.golDarahAyah ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Gol. Darah Bayi</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.golDarahBayi || '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Cara Masuk</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.crMasuk || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Asal Masuk</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.asalMasuk ||
              '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Anamnesis -->

    <div class="section">
      <div class="section-title">Anamnesis : </div>
      <div class="data">
        <div class="data-item">1. Keluhan Utama / Chief Complaint : {{ anamnesisAwal?.keluhanUtama || '-' }}</div>
        <div class="data-item">2. Riwayat Penyakit Sekarang / Present Disease History : {{
          anamnesisAwal?.riwayatpenyakitsekarang || '-' }}</div>
        <div class="data-item">3. Riwayat Penyakit Dahulu / Past Disease History : {{ anamnesisAwal?.riwayatpenyakit ||
          '-' }}</div>
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
        <div class="data-item">6. Riwayat Alergi : <span v-if="ALERGI" v-html="getNewLine(ALERGI || '-')" /> <span
            v-else> - </span> </div>

        <div class="data-item flex">7. Kajian Nyeri NIPS :
          <div class="q-ml-sm" v-if="anamnesisAwal?.keluhannyeri?.neonatal">
            <div>- Keluhan : {{ anamnesisAwal?.keluhannyeri?.keluhan ?? '-' }}</div>
            <div>- Ekspresi Wajah : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.ekspresiWajah?.text ?? '-' }}</div>
            <div>- Menangis : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.menangis?.text ?? '-' }}</div>
            <div>- Pola Nafas : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.polaNafas?.text ?? '-' }}</div>
            <div>- Lengan : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.lengan?.text ?? '-' }}</div>
            <div>- Kaki : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.kaki?.text ?? '-' }} </div>
            <div>- Keadaan Rangsangan : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.keadaanRangsangan?.text ?? '-'
            }}</div>
          </div>
          <div class="q-ml-sm" v-else>
            <div> - </div>
          </div>
        </div>
      </div>

      <div class="section-title" style="margin-top: 5px;">Riwayat Kehamilan: </div>
      <table class="tablex">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- G / P / A</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{ anamnesisAwal?.neonatal?.g
              || '-' }} / {{ anamnesisAwal?.neonatal?.p || '-' }} / {{ anamnesisAwal?.neonatal?.a || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Usia Gestasi </td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.usiaGestasi ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Riwayat Persalinan</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.rwPersalinan || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Status Gizi Ibu</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.sgIbu || '-' }}
            </td>
          </tr>

          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Obat Ibu Selama Hamil</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.rwObat || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Kebiasaan Ibu</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.kebiasaanIbu ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Ketuban</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.ketuban || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Volume</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.volume ||
              '-' }}</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title" style="margin-top: 5px;">Riwayat Kelahiran: </div>
      <table class="tablex">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Cara Kelahiran</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.crLahir || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Skor APGAR</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.apgarScore ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Volume Air Ketuban</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.volumeKetuban || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Warna Air Ketuban</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.warnaKetuban ||
              '-' }}
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Ketuban Pecah dini</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.pecahDini || '-' }}</td>
            <!-- <td style="border: none !important; padding: 0px !important; width: 20%;">Kebiasaan Ibu</td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.kebiasaanIbu ||
              '-' }}</td> -->
          </tr>
        </tbody>
      </table>


      <div class="section-title" style="margin-top: 5px;">Riwayat Lainnya: </div>
      <table class="tablex">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:20%;">- Transfusi Darah</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.rwTransDarah || '-' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Reaksi Ketika Trnasfusi Darah
            </td>
            <td style="border: none !important; padding: 0px !important;">: {{ anamnesisAwal?.neonatal?.reaksiTrans ||
              '-' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width: 20%;">- Riwayat Imunisasi</td>
            <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
              anamnesisAwal?.neonatal?.rwImunisasi || '-' }}</td>
          </tr>
        </tbody>
      </table>
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
                '-' }} cm</td>
              <td style="border: none !important; padding: 0px !important;"> - Lila</td>
              <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pediatrik?.lila || '-'
              }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>

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
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pantanganMkanan || ' - '
            }}
            </td>
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
            <td colspan="4" style="border: none !important; padding: 0px !important; width:15%;"> - Edukasi</td>

          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td colspan="2"
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:15%;">
              Apakah pasien /
              keluarga tahu mengenai penyakit dan perawatannya?</td>
            <td colspan="2" style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              EDUKASI?.tahuPenanganan?.value || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td colspan="2"
              style="border: none !important; padding-left: 10px !important; padding-right: 0px !important; padding-top: 0px !important; padding-bottom: 0px !important;  width:15%;">
              Apakah membutuhkan
              edukasi?</td>
            <td colspan="2" style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              EDUKASI?.butuhEdukasi?.value || ' - ' }}, <span v-if="EDUKASI?.butuhEdukasi?.value === 'Ya'"> {{
                pemeriksaanUmum?.ketEdukasi }}</span></td>
          </tr>
        </tbody>
      </table>

      <div class="section-title" style="margin-top: 5px;">Form 4.3 Neonatal : </div>
      <table class="tablex">
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

      <!-- Skreening gizi Neonatal-->
      <div v-if="anamnesisAwal?.skreeninggizi?.neonatal">
        <div class="section-title" style="margin-top: 5px;">Skrining Gizi Neonatal : </div>
        <table style="margin-top: -5px; margin-bottom: 5px;">
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




      <div class="section-title" style="margin-top: 5px;">Pemeriksaan Fisik : </div>
      <table style="margin-top: -5px;">
        <thead>
          <tr>
            <th>Bagian</th>
            <th>Normal</th>
            <th>Jika Tidak Normal, Jelaskan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kepala (Head)</td>
            <td>{{ pemeriksaanUmum?.rs5?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs5?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs5 : '' }} </td>
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
            <td>{{ pemeriksaanUmum?.rs6?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs6?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs6 : '' }} </td>
          </tr>
          <!-- <tr>
          <td>Jantung (Heart)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
          <tr>
            <td>Dada & Payudara (Chest & Breast)</td>
            <td>{{ pemeriksaanUmum?.rs7?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs7?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs7 : '' }} </td>
          </tr>
          <tr>
            <td>Punggung (Back)</td>
            <td>{{ pemeriksaanUmum?.rs8?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs8?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs8 : '' }} </td>
          </tr>
          <tr>
            <td>Perut (Abdomen)</td>
            <td>{{ pemeriksaanUmum?.rs9?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs9?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs9 : '' }} </td>
          </tr>
          <tr>
            <td>Urogenital</td>
            <td>{{ pemeriksaanUmum?.rs13?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs13?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs13 : '' }} </td>
          </tr>
          <!-- <tr>
          <td>Anggota Gerak (Extremities)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
          <tr>
            <td>Tangan (Hand)</td>
            <td>{{ pemeriksaanUmum?.rs10?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs10?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs10 : '' }} </td>
          </tr>
          <tr>
            <td>Kaki (Foot)</td>
            <td>{{ pemeriksaanUmum?.rs11?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs11?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs11 : '' }} </td>
          </tr>
          <tr>
            <td>Status Neurologis (Neurological Status)</td>
            <td>{{ pemeriksaanUmum?.rs12?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs12?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs12 : '' }} </td>
          </tr>
          <!-- <tr>
          <td>Muskuloskeletal</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr> -->
        </tbody>
      </table>


    </div>




    <div class="section">
      <table class="tabelx">
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
            <td style="border: none !important; padding: 0px !important; width: 20%">
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
import { api, pathImg } from 'src/boot/axios';
import { dateFullFormat, getNewLine, jamTnpDetik } from 'src/modules/formatter';
import { imageToBase64 } from 'src/modules/imgBase64';
import { useImplementasiEdukasiRanapStore } from 'src/stores/simrs/ranap/implementasiEdukasi';
import { computed, onMounted, ref } from 'vue';

const impEdukasi = useImplementasiEdukasiRanapStore()


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
// console.log('props', props?.pasien);

const anamnesisAwal = computed(() => {
  const awal = props?.pasien?.anamnesis?.find(x => x?.awal === '1' && x?.nakes === '1') || null
  console.log('anamnesis awal', awal);

  return awal
})

const ALERGI = computed(() => {
  const finder = props?.pasien?.anamnesis?.find(x => x?.awal === '1')?.riwayatalergi ?? []
  const alergy = finder?.map((item) => item)?.join(', ') ?? null
  const keterangan = props?.pasien?.anamnesis?.find(x => x?.awal === '1')?.keteranganalergi ?? null
  return alergy + ' ' + (keterangan ?? null)
})
const pemeriksaanUmum = computed(() => {
  const awal = props?.pasien?.pemeriksaan?.find(x => x?.awal === '1' && x?.nakes === '1') || null
  console.log('pemeriksaan awal', awal);

  return awal
})
const EDUKASI = computed(() => {
  try {
    return JSON.parse(pemeriksaanUmum?.value?.edukasi || '{}')
  } catch {
    return {}
  }
})
const diagnosa = computed(() => {
  const primer = props?.pasien?.diagnosa?.find(x => x?.rs4 === 'Primer' && x?.rs13 === 'POL014') || null
  console.log('awal', primer);

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
  return `${enc}`
})

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
