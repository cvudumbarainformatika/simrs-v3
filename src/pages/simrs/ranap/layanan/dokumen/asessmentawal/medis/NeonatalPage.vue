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
      <div class="col-auto">No. Register : {{ pasien?.noreg }}</div>
      <div class="col-auto">Tanggal : {{ dateFullFormat(pasien?.tglmasuk) }}</div>
      <div class="col-auto">Jam : {{ jamTnpDetik(pasien?.tglmasuk) }}</div>
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
        <div class="data-item">6. Status Sosial / Social Status : {{ pemeriksaanUmum?.sosial || '-' }}</div>
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
        </div>
        <div class="data-item">10. Riwayat Alergi : <span v-html="getNewLine(ALERGI || '-')" /></div>

        <div class="data-item flex">11. Kajian Nyeri NIPS :
          <div class="q-ml-sm">
            <div>- Keluhan : {{ anamnesisAwal?.keluhannyeri?.keluhan || '-' }}</div>
            <div>- Ekspresi Wajah : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.ekspresiWajah?.text }}</div>
            <div>- Menangis : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.menangis?.text }}</div>
            <div>- Pola Nafas : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.polaNafas?.text }}</div>
            <div>- Lengan : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.lengan?.text }}</div>
            <div>- Kaki : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.kaki?.text }}</div>
            <div>- Keadaan Rangsangan : {{ anamnesisAwal?.keluhannyeri?.neonatal?.form?.keadaanRangsangan?.text }}</div>
          </div>
        </div>

        <div class="data-item flex">12. Skrining Gizi :
          <div class="q-ml-sm">
            <div>- Keterangan : {{ anamnesisAwal?.skreeninggizi?.keterangan || '-' }}</div>
            <div>- Nafsu Makan : {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.nm?.text }}</div>
            <div>- Kemampuan Untuk Makan : {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.km?.text }}</div>
            <div>- Faktor Stress : {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.fs?.text }}</div>
            <div>- Persentil BB : {{ anamnesisAwal?.skreeninggizi?.neonatal?.form?.bb?.text }}</div>
          </div>
        </div>
        <div class="data-item flex">13. Form 4.3 (Neonatal) :
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

    <div class="section">
      <div class="section-title">Pemeriksaan Umum : </div>
      <!-- <div class="data">
        <div class="data-item">Kesadaran: ............................................</div>
        <div class="data-item">Tekanan Darah: ............................................ mmHg</div>
        <div class="data-item">Nadi: ............................................ x/menit</div>
        <div class="data-item">Suhu: ............................................ &deg;C</div>
        <div class="data-item">Pernapasan: ............................................ x/menit</div>
        <div class="data-item">Keadaan Umum: Baik / Sedang / Buruk</div>
        <div class="data-item">Keadaan Gizi: Baik / Sedang / Buruk</div>
      </div> -->
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
            <td style="border: none !important; padding: 0px !important;"></td>
            <td style="border: none !important; padding: 0px !important;"></td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Suhu </td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.suhu || ' - ' }} &deg;C
            </td>
            <td style="border: none !important; padding: 0px !important;"></td>
            <td style="border: none !important; padding: 0px !important;"></td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Pernapasan</td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pernapasan || ' - ' }}
              x/menit</td>
            <td style="border: none !important; padding: 0px !important;"></td>
            <td style="border: none !important; padding: 0px !important;"></td>
          </tr>


        </tbody>
      </table>
    </div>

    <table>
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



    <div class="section">
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
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
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
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
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
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
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
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
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
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
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
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
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
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
