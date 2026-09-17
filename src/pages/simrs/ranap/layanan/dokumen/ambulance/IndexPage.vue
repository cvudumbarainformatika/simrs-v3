<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">FORMULIR PEMESANAN AMBULANCE</div>
          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="itemsAmbulan?.length">
            {{ itemsAmbulan.length }} Permintaan Terdaftar
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="itemsAmbulan?.length">
          <q-btn
            v-print="printObj"
            color="indigo-10"
            icon="icon-mat-print"
            label="Cetak Dokumen"
            no-caps
            dense
            class="q-px-md text-weight-bold"
          />
        </div>
      </div>
    </div>

    <!-- Container Preview Dokumen Cetak -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <div v-if="!itemsAmbulan?.length" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1 full-width" style="max-width: 900px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <q-icon name="icon-mat-directions_car" size="64px" class="q-mb-sm text-grey-4" />
        <div class="text-bold text-h6 text-grey-5">Tidak Ada Riwayat Pemesanan Ambulance</div>
        <div class="text-caption text-grey-5">Belum ada catatan pemesanan ambulance untuk pasien ini.</div>
      </div>

      <div v-else id="print-ambulance-document" class="column items-center q-gutter-y-md full-width">
        <div v-for="(item, idx) in itemsAmbulan" :key="item.id || idx" class="document-container q-mb-md">
          <div class="print-page q-pa-md bg-white shadow-1 border-print">
            
            <!-- KOP SURAT STANDAR SIMRS -->
            <div class="col-auto q-mb-sm">
              <AppKopSuratStandard :dataHeader="dataHeader?.length ? dataHeader : [
                'PEMERINTAH KOTA PROBOLINGGO',
                'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
                'UOBK RSUD DOKTER MOHAMAD SALEH',
                'Jl. Mayjend Panjaitan No.65 Telp: (0335)433119 Fax.(0335)432702',
                'email: rsudprob@probolinggokota.go.id',
                'PROBOLINGGO – 67219'
              ]" :pasien="pasien" :header="['Formulir Pemesanan', 'Ambulance', '']" />
            </div>

            <!-- IDENTITAS PASIEN & DETAIL PEMESANAN -->
            <div class="identitas-table q-mb-md text-caption-custom ba-black q-pa-xs">
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  <tr>
                    <td style="width: 25%;">Nama</td>
                    <td style="width: 3%;">:</td>
                    <td style="width: 72%; font-weight: bold;">{{ pasien?.nama || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Tgl. Lahir / Umur</td>
                    <td>:</td>
                    <td>{{ pasien?.tgllahir || '-' }} / {{ pasien?.usia || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{{ pasien?.alamat || '-' }}</td>
                  </tr>
                  <tr>
                    <td>No. RM</td>
                    <td>:</td>
                    <td style="font-weight: bold;">{{ pasien?.norm || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Dirawat di ruang / kamar / kelas</td>
                    <td>:</td>
                    <td>{{ pasien?.ruangan || '-' }} / {{ pasien?.kamar || '-' }} / {{ pasien?.kelas_ruangan || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Diagnosa Medis</td>
                    <td>:</td>
                    <td>{{ pasien?.memodiagnosa || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Hari / Tanggal</td>
                    <td>:</td>
                    <td>{{ getHariTanggal(item?.rs3 || item?.created_at) }}</td>
                  </tr>
                  <tr>
                    <td>Jam</td>
                    <td>:</td>
                    <td>{{ jamTnpDetik(item?.rs3 || item?.created_at) }} WIB</td>
                  </tr>
                  <tr>
                    <td>Tujuan</td>
                    <td>:</td>
                    <td style="font-weight: bold;">{{ storeAmbulan.tujuans?.find(x => x.rs1 === item?.rs10)?.rs2 || item?.rs10 || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Alasan / Keperluan</td>
                    <td>:</td>
                    <td>{{ item?.alasan_keperluan || item?.rs11 || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Indikasi Rujuk</td>
                    <td>:</td>
                    <td>{{ item?.indikasi_rujuk || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Perawat Pendamping</td>
                    <td>:</td>
                    <td><b>{{ getPerawatNama(item) }}</b> <span v-if="item?.rs14 && getPerawatNama2(item) !== '-'">, {{ getPerawatNama2(item) }}</span></td>
                  </tr>
                  <tr>
                    <td>Dokter Pengirim</td>
                    <td>:</td>
                    <td><b>{{ getDokterNama(item) }}</b></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- GARIS PEMBATAS SKOR -->
            <div class="q-my-sm text-caption-custom" style="border-top: 1.5px solid #000; padding-top: 4px;">
              <div class="row items-center justify-between">
                <div><b>Skore indeks resiko pasien</b> : <b>{{ item?.skor_indeks ?? getSkorFromItem(item) }}</b> (Kategori: <b>{{ item?.kategori_resiko ?? getKategoriFromItem(item) }}</b>)</div>
                <div><b>Jenis Ambulance</b> : <b>{{ item?.jenis_ambulan || (item?.layananperawat ? 'Ambulance ' + item.layananperawat : 'Ambulance Reguler') }}</b></div>
              </div>
            </div>

            <!-- TABEL 11 PARAMETER INDEKS RISIKO -->
            <table class="table-border-custom q-mb-sm text-caption-custom" style="width: 100%; border: 1.5px solid #000; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f2d7d5; text-align: center; font-weight: bold; border-bottom: 1.5px solid #000;">
                  <th style="width: 5%; border: 1px solid #000; padding: 4px;">NO</th>
                  <th style="width: 80%; border: 1px solid #000; padding: 4px;">PENILAIAN / PENGUKURAN</th>
                  <th style="width: 15%; border: 1px solid #000; padding: 4px;">SKOR</th>
                </tr>
              </thead>
              <tbody>
                <!-- 1. HAEMODINAMIK -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">1</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">HAEMODINAMIK</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;">
                    <span :class="getP(item, 'haemodinamik') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'haemodinamik') === 0 ? '➤' : '➢' }} STABIL</span>
                  </td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'haemodinamik') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;">
                    <span :class="getP(item, 'haemodinamik') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'haemodinamik') === 1 ? '➤' : '➢' }} MODERAT (dengan terapi darah &lt; 15 ml/mnt)</span>
                  </td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'haemodinamik') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;">
                    <span :class="getP(item, 'haemodinamik') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'haemodinamik') === 2 ? '➤' : '➢' }} UNSTABLE (dengan terapi darah &gt; 15 ml/mnt dan atau terapi inotropic)</span>
                  </td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'haemodinamik') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 2. CARDIO -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">2</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">CARDIO</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'cardio') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'cardio') === 0 ? '➤' : '➢' }} ARITMIA TIDAK ADA</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'cardio') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'cardio') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'cardio') === 1 ? '➤' : '➢' }} ARITMIA (tidak serius) atau IMA onset &gt; 48 jam</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'cardio') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'cardio') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'cardio') === 2 ? '➤' : '➢' }} ARITMIA (buruk) atau IMA onset &lt; 48 jam</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'cardio') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 3. ECG MONITOR -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">3</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">ECG MONITOR</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'ecg_monitor') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'ecg_monitor') === 0 ? '➤' : '➢' }} TIDAK PERLU</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'ecg_monitor') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'ecg_monitor') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'ecg_monitor') === 1 ? '➤' : '➢' }} PERLU</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'ecg_monitor') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'ecg_monitor') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'ecg_monitor') === 2 ? '➤' : '➢' }} SANGAT DIBUTUHKAN</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'ecg_monitor') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 4. INTRAVENUS LINE -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">4</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">INTRAVENUS LINE</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'intravenous_line') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'intravenous_line') === 0 ? '➤' : '➢' }} TIDAK</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'intravenous_line') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'intravenous_line') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'intravenous_line') === 1 ? '➤' : '➢' }} IYA</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'intravenous_line') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'intravenous_line') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'intravenous_line') === 2 ? '➤' : '➢' }} TERPASANG CVC</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'intravenous_line') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 5. PROVESIONAL PACEMAKER -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">5</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">PROVESIONAL PACEMAKER</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'provesional_pacemaker') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'provesional_pacemaker') === 0 ? '➤' : '➢' }} TIDAK</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'provesional_pacemaker') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'provesional_pacemaker') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'provesional_pacemaker') === 1 ? '➤' : '➢' }} IYA / NON INVASIF</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'provesional_pacemaker') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'provesional_pacemaker') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'provesional_pacemaker') === 2 ? '➤' : '➢' }} ENDOCAVITY</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'provesional_pacemaker') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 6. RESPIRASI -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">6</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">RESPIRASI</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'respirasi') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'respirasi') === 0 ? '➤' : '➢' }} ANTARA 10 – 14 x/mnt</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'respirasi') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'respirasi') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'respirasi') === 1 ? '➤' : '➢' }} ANTARA 15 – 35 x/mnt</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'respirasi') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'respirasi') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'respirasi') === 2 ? '➤' : '➢' }} APNOE / &lt; 10 x/mnt / &gt; 35 x/mnt</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'respirasi') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 7. AIRWAYS -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">7</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">AIRWAYS</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'airways') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'airways') === 0 ? '➤' : '➢' }} TANPA ALAT</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'airways') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'airways') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'airways') === 1 ? '➤' : '➢' }} MAYO TUBE</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'airways') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'airways') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'airways') === 2 ? '➤' : '➢' }} INTUBASI</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'airways') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 8. RESPIRATORY SUPPORT -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">8</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">RESPIRATORY SUPPORT</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'respiratory_support') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'respiratory_support') === 0 ? '➤' : '➢' }} TIDAK</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'respiratory_support') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'respiratory_support') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'respiratory_support') === 1 ? '➤' : '➢' }} THERAPY O2</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'respiratory_support') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'respiratory_support') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'respiratory_support') === 2 ? '➤' : '➢' }} VENTILASI MEKANIK</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'respiratory_support') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 9. KESADARAN -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">9</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">KESADARAN</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'kesadaran') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'kesadaran') === 0 ? '➤' : '➢' }} GCS = 15</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'kesadaran') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'kesadaran') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'kesadaran') === 1 ? '➤' : '➢' }} GCS 8 – 14</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'kesadaran') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'kesadaran') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'kesadaran') === 2 ? '➤' : '➢' }} GCS &lt; 8</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'kesadaran') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 10. PREMATURITAS -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">10</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">PREMATURITAS</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'prematuritas') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'prematuritas') === 0 ? '➤' : '➢' }} BAYI BARU LAHIR DENGAN BB &gt; 2000 gr / Bukan Bayi</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'prematuritas') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'prematuritas') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'prematuritas') === 1 ? '➤' : '➢' }} BAYI BARU LAHIR DENGAN BB ANTARA 1200 – 2000 gr</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'prematuritas') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'prematuritas') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'prematuritas') === 2 ? '➤' : '➢' }} BAYI BARU LAHIR DENGAN BB &lt; 1200 gr</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'prematuritas') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- 11. LANJUT USIA -->
                <tr style="background-color: #f5eef8; font-weight: bold;">
                  <td style="border: 1px solid #000; text-align: center;">11</td>
                  <td style="border: 1px solid #000; padding-left: 4px;" colspan="2">LANJUT USIA</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'lanjut_usia') === 0 ? 'font-bold text-primary' : ''">{{ getP(item, 'lanjut_usia') === 0 ? '➤' : '➢' }} USIA ≤ 60 thn</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'lanjut_usia') === 0 ? 'bg-indigo-1 font-bold' : ''">0</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'lanjut_usia') === 1 ? 'font-bold text-primary' : ''">{{ getP(item, 'lanjut_usia') === 1 ? '➤' : '➢' }} USIA &gt; 60 thn</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'lanjut_usia') === 1 ? 'bg-indigo-1 font-bold' : ''">1</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 8px;"><span :class="getP(item, 'lanjut_usia') === 2 ? 'font-bold text-primary' : ''">{{ getP(item, 'lanjut_usia') === 2 ? '➤' : '➢' }} USIA &gt; 60 thn DENGAN DELIRIUM</span></td>
                  <td style="border: 1px solid #000; text-align: center;" :class="getP(item, 'lanjut_usia') === 2 ? 'bg-indigo-1 font-bold' : ''">2</td>
                </tr>

                <!-- TOTAL ROW -->
                <tr style="background-color: #e8daef; font-weight: bold; border-top: 1.5px solid #000;">
                  <td colspan="2" style="border: 1px solid #000; text-align: right; padding-right: 12px;">TOTAL SKOR:</td>
                  <td style="border: 1px solid #000; text-align: center; font-size: 13px;">{{ item?.skor_indeks ?? getSkorFromItem(item) }}</td>
                </tr>
              </tbody>
            </table>

            <!-- TABEL SPESIFIKASI PETUGAS PENGANTAR -->
            <div class="text-caption-custom q-mb-xs">
              <div>Spesifikasi Petugas Pengantar : <b>{{ item?.kualifikasi_petugas || getKualifikasiString(item) }}</b></div>
            </div>

            <table class="table-border-custom q-mb-sm text-caption-custom" style="width: 100%; border: 1.5px solid #000; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #d2b4de; text-align: center; font-weight: bold; border-bottom: 1.5px solid #000;">
                  <th style="width: 15%; border: 1px solid #000; padding: 3px;">KATEGORI</th>
                  <th style="width: 35%; border: 1px solid #000; padding: 3px;">PENGANTAR</th>
                  <th style="width: 50%; border: 1px solid #000; padding: 3px;">KUALIFIKASI PETUGAS</th>
                </tr>
              </thead>
              <tbody>
                <tr :class="String(item?.kategori_resiko ?? getKategoriFromItem(item)) === '0' ? 'bg-indigo-1 font-bold' : ''">
                  <td style="border: 1px solid #000; text-align: center;">0</td>
                  <td style="border: 1px solid #000; text-align: center;">PERAWAT</td>
                  <td style="border: 1px solid #000; text-align: center;">BLS</td>
                </tr>
                <tr :class="String(item?.kategori_resiko ?? getKategoriFromItem(item)) === '0.5' ? 'bg-indigo-1 font-bold' : ''">
                  <td style="border: 1px solid #000; text-align: center;">0.5</td>
                  <td style="border: 1px solid #000; text-align: center;">PERAWAT</td>
                  <td style="border: 1px solid #000; text-align: center;">BLS</td>
                </tr>
                <tr :class="String(item?.kategori_resiko ?? getKategoriFromItem(item)) === '1' ? 'bg-indigo-1 font-bold' : ''">
                  <td style="border: 1px solid #000; text-align: center;">1</td>
                  <td style="border: 1px solid #000; text-align: center;">PERAWAT</td>
                  <td style="border: 1px solid #000; text-align: center;">BLS</td>
                </tr>
                <tr :class="String(item?.kategori_resiko ?? getKategoriFromItem(item)) === '2' ? 'bg-indigo-1 font-bold' : ''">
                  <td style="border: 1px solid #000; text-align: center;">2</td>
                  <td style="border: 1px solid #000; text-align: center;">PERAWAT</td>
                  <td style="border: 1px solid #000; text-align: center;">Pelatihan Code Blue, BCLS/BTLS</td>
                </tr>
                <tr :class="String(item?.kategori_resiko ?? getKategoriFromItem(item)) === '3' ? 'bg-indigo-1 font-bold' : ''">
                  <td style="border: 1px solid #000; text-align: center;">3</td>
                  <td style="border: 1px solid #000; text-align: center;">PERAWAT INTENSIF + DOKTER UMUM</td>
                  <td style="border: 1px solid #000; text-align: center;">BLS/ALS, BTCLS/ATCLS, BCLS/ACLS, PPGD/PPGDON/GELS</td>
                </tr>
              </tbody>
            </table>

            <!-- NOTE & JENIS AMBULANCE CHECKBOXES -->
            <div class="text-caption-custom q-mb-md">
              <div>Note :</div>
              <div style="padding-left: 12px;">
                <div>1. Untuk Kasus Kebidanan disertai oleh petugas Bidan</div>
                <div>2. Skore &gt; 2 Menggunakan ambulance Emergency</div>
              </div>

              <div class="row items-center q-mt-sm">
                <span class="q-mr-md font-bold">Jenis ambulance :</span>
                <span class="q-mr-md">{{ isJenis(item, 'Ambulance Emergency') ? '☑' : '☐' }} Ambulance Emergency</span>
                <span class="q-mr-md">{{ isJenis(item, 'Ambulance Reguler') ? '☑' : '☐' }} Ambulance Reguler</span>
                <span>{{ isJenis(item, 'Ambulance Jenazah') ? '☑' : '☐' }} Ambulance Jenazah</span>
              </div>
            </div>

            <!-- TANDA TANGAN PENERIMA & PEMESAN -->
            <div class="row justify-between text-caption-custom q-mt-md" style="padding: 0 40px;">
              <div class="text-center" style="width: 200px;">
                <div class="text-bold q-mb-xs">Penerima (Kasir / Driver)</div>
                <div style="height: 65px;" class="flex flex-center">
                  <app-qr-petugas v-if="getPenerimaKode(item)" :noreg="item?.rs1" :jnssurat="'PERMINTAAN-AMBULANCE.png'" :asal="'RANAP'"
                    :kdpegsimrs="getPenerimaKode(item)" width="60px" height="60px" />
                  <div v-else class="text-grey-4" style="font-size: 9px;">Belum Verifikasi</div>
                </div>
                <div class="text-bold q-mt-xs">( {{ getPenerimaNama(item) }} )</div>
              </div>
              <div class="text-center" style="width: 200px;">
                <div class="text-bold q-mb-xs">Pemesan (Perawat)</div>
                <div style="height: 65px;" class="flex flex-center">
                  <app-qr-petugas v-if="getPerawatKode(item)" :noreg="item?.rs1" :jnssurat="'PERMINTAAN-AMBULANCE.png'" :asal="'RANAP'"
                    :kdpegsimrs="getPerawatKode(item)" width="60px" height="60px" />
                  <span v-else class="font-bold">{{ getPerawatNama(item) }}</span>
                </div>
                <div class="text-bold q-mt-xs">( {{ getPerawatNama(item) }} )</div>
              </div>
            </div>

            <!-- PROSEDUR -->
            <div class="text-caption-custom q-mt-md" style="font-size: 10px; border-top: 1px solid #ccc; padding-top: 6px;">
              <div><b>Prosedur :</b></div>
              <ol style="margin: 0; padding-left: 18px;">
                <li>Perawat yang membutuhkan memesan ambulance ke bagian kasir</li>
                <li>Kasir menghubungi Driver</li>
                <li>Driver konfirmasi kesediaan ambulance ke perawat/unit/ruangan yang menerima</li>
                <li>Formulir permintaan ambulance diserahkan ke kasir</li>
              </ol>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { usePermintaanAmbulanStore } from 'src/stores/simrs/ranap/ambulance'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'

const AppKopSuratStandard = defineAsyncComponent(() => import('src/components/~global/AppKopSuratStandard.vue'))

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
    default: () => []
  }
})

import { useAplikasiStore } from 'src/stores/app/aplikasi'

const auth = useAplikasiStore()
const storeAmbulan = usePermintaanAmbulanStore()

const itemsAmbulan = computed(() => {
  return props.pasien?.permintaanambulan || []
})

onMounted(() => {
  storeAmbulan.getTujuanAmbulan()
  storeAmbulan.initReset()
})

const printObj = {
  id: 'print-ambulance-document',
  popTitle: 'Formulir Pemesanan Ambulance'
}

function getPenerimaKode(item) {
  if (item?.kd_driver) return item.kd_driver
  if (item?.driver?.kdpegsimrs) return item.driver.kdpegsimrs
  if (item?.userinput) return item.userinput
  if (item?.rs18) return item.rs18
  if (item?.rs20) return item.rs20
  // Fallback ke login user saat ini jika ada
  return auth?.user?.pegawai?.kdpegsimrs || auth?.user?.pegawai_id || ''
}

function getPenerimaNama(item) {
  const kode = getPenerimaKode(item)
  if (!kode) return '..................................................'
  const findPegawai = storeAmbulan.drivers?.find(x => x.kdpegsimrs === kode) || storeAmbulan.perawats?.find(x => x.kdpegsimrs === kode)
  if (findPegawai) return findPegawai.nama
  if (item?.driver?.nama) return item.driver.nama
  if (auth?.user?.pegawai?.kdpegsimrs === kode && auth?.user?.pegawai?.nama) {
    return auth.user.pegawai.nama
  }
  return auth?.user?.nama || 'Petugas Kamar Operasi / Driver'
}

function getPerawatKode(item) {
  return item?.rs13 || ''
}

function getPerawatNama(item) {
  const kode = getPerawatKode(item)
  if (!kode) return '..................................................'
  return storeAmbulan.perawats?.find(x => x.kdpegsimrs === kode)?.nama || item?.rs13 || '..................................................'
}

function getPerawatNama2(item) {
  const kode = item?.rs14 || ''
  if (!kode) return '-'
  return storeAmbulan.perawats?.find(x => x.kdpegsimrs === kode)?.nama || item?.rs14 || '-'
}

function getDokterNama(item) {
  const kode = item?.rs9 || props.pasien?.kodedokter || ''
  if (!kode) return props.pasien?.dokter || '-'
  return storeAmbulan.dokters?.find(x => x.kdpegsimrs === kode)?.nama || props.pasien?.dokter || '-'
}

function getHariTanggal(tgl) {
  if (!tgl) return '-'
  return dateFullFormat(tgl)
}

function getPenilaianObj(item) {
  if (!item?.penilaian_resiko) return {}
  if (typeof item.penilaian_resiko === 'object') return item.penilaian_resiko
  try {
    return JSON.parse(item.penilaian_resiko)
  } catch (e) {
    return {}
  }
}

function getP(item, key) {
  const p = getPenilaianObj(item)
  return p[key] !== undefined ? Number(p[key]) : 0
}

function getSkorFromItem(item) {
  const p = getPenilaianObj(item)
  return Number(p.haemodinamik || 0) +
    Number(p.cardio || 0) +
    Number(p.ecg_monitor || 0) +
    Number(p.intravenous_line || 0) +
    Number(p.provesional_pacemaker || 0) +
    Number(p.respirasi || 0) +
    Number(p.airways || 0) +
    Number(p.respiratory_support || 0) +
    Number(p.kesadaran || 0) +
    Number(p.prematuritas || 0) +
    Number(p.lanjut_usia || 0)
}

function getKategoriFromItem(item) {
  const skor = getSkorFromItem(item)
  const p = getPenilaianObj(item)
  if (skor === 2 && p.lanjut_usia === 2) return '0.5'
  if (skor <= 2) return '0'
  if (skor >= 3 && skor <= 5) return '1'
  if (skor >= 6 && skor <= 8) return '2'
  return '3'
}

function getKualifikasiString(item) {
  const kat = getKategoriFromItem(item)
  switch (kat) {
    case '0':
    case '0.5':
    case '1':
      return 'PERAWAT (BLS)'
    case '2':
      return 'PERAWAT (Pelatihan Code Blue, BCLS/BTLS)'
    case '3':
      return 'PERAWAT INTENSIF + DOKTER UMUM (BLS/ALS, BTCLS/ATCLS, BCLS/ACLS, PPGD/PPGDON/GELS)'
    default:
      return 'PERAWAT (BLS)'
  }
}

function isJenis(item, target) {
  if (item?.jenis_ambulan) {
    return item.jenis_ambulan.toLowerCase().includes(target.toLowerCase().replace('ambulance ', ''))
  }
  if (item?.layananperawat) {
    return target.toLowerCase().includes(item.layananperawat.toLowerCase())
  }
  return target === 'Ambulance Reguler'
}
</script>

<style scoped>
.print-page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
  color: #000;
  line-height: 1.3;
}

.text-caption-custom {
  font-size: 11px;
}

.font-bold {
  font-weight: bold;
}

@media print {
  body * {
    visibility: hidden;
  }
  #print-ambulance-document, #print-ambulance-document * {
    visibility: visible;
  }
  #print-ambulance-document {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .no-print {
    display: none !important;
  }
  .print-page {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
  }
}
</style>
