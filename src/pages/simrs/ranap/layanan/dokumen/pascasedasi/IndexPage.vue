<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- BAR UNTUK CETAK (TIDAK IKUT DICETAK) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-primary">DOKUMEN STATUS SEDASI</div>
          <q-badge color="primary" outline class="q-ml-sm" v-if="items.length">
            {{ items.length }} Dokumen Terbuat
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="items.length">
          <q-btn
            v-print="printObj"
            color="primary"
            icon="icon-mat-print"
            round
            dense
          >
            <q-tooltip>Cetak Dokumen</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- PREVIEW Halaman Cetak Dokumen (2 HALAMAN A4 PAS AKURAT) -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <div v-if="loading && !items.length" class="text-center text-grey-6 q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
        <div class="q-mt-sm">Memuat dokumen...</div>
      </div>

      <div v-else-if="!items.length" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="icon-my-file_sign" size="64px" class="q-mb-sm" />
        <div class="text-bold">Belum Ada Dokumen Status Sedasi</div>
        <div class="text-caption">Dokumen Status Sedasi belum dibuat untuk pasien ini.</div>
      </div>

      <div v-else id="print-status-sedasi-document" class="column items-center full-width">
        <div v-for="(item, idx) in items" :key="item.id || idx" class="print-doc-container full-width q-mb-xl">
          
          <!-- ==================== HALAMAN 1: PEMANTAUAN SELAMA SEDASI (INTRA SEDASI) ==================== -->
          <div class="print-page print-page-1 bg-white q-pa-md shadow-2 rounded-borders">
            <div class="status-sedasi-doc text-black">
              <!-- KOP SURAT STANDAR RS (INLINE MANDIRI STATUS SEDASI) -->
              <div class="border-bordered q-pa-xs q-mb-xs bg-white text-black">
                <div class="row items-center">
                  <div class="col-9 row items-center q-pr-sm" style="border-right: 1px solid #000;">
                    <div class="col-auto q-mr-md">
                      <img src="~assets/images/logo-rsud.png" width="75">
                    </div>
                    <div class="col text-center">
                      <div class="text-bold font-10">PEMERINTAH KOTA PROBOLINGGO</div>
                      <div class="text-bold font-9">DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA</div>
                      <div class="text-bold font-12">RSUD DOKTER MOHAMMAD SALEH</div>
                      <div class="font-8">Jalan Mayjend Panjaitan No.65 Telp : (0335) 433119,421118 Fax. (0335) 432705</div>
                      <div class="font-8">e-mail : rsudprob@probolinggokota.go.id | PROBOLINGGO 67219</div>
                    </div>
                  </div>
                  <div class="col-3 text-center q-pl-xs">
                    <div class="text-bold font-12">STATUS SEDASI</div>
                  </div>
                </div>
              </div>

              <!-- INFORMASI PROSEDUR & INTRA SEDASI -->
              <div class="doc-header q-my-xs">
                <table class="full-width table-bordered font-10">
                  <tbody>
                    <tr>
                      <td width="15%"><strong>Diagnosa</strong></td>
                      <td width="35%">: {{ item?.diagnosa || '-' }}</td>
                      <td width="20%"><strong>Skor Mallampati</strong></td>
                      <td width="30%">: {{ (item?.mallampati || item?.skor_mallampati) ? `Class ${item.mallampati || item.skor_mallampati}` : '-' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Nama Prosedur</strong></td>
                      <td>: {{ item?.prosedur || item?.nama_prosedur || '-' }}</td>
                      <td><strong>Rencana Sedasi</strong></td>
                      <td>: {{ item?.rencana_sedasi || '-' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Pelaku Prosedur</strong></td>
                      <td>: {{ item?.operator || item?.pelaku_prosedur || '-' }}</td>
                      <td><strong>Pelaku Sedasi</strong></td>
                      <td>: {{ item?.dokter_sedasi || item?.pelaku_sedasi || item?.dokter || '-' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Tanggal Prosedur</strong></td>
                      <td>: {{ item?.tgl_prosedur || '-' }}</td>
                      <td><strong>Asisten Sedasi</strong></td>
                      <td>: {{ item?.asisten || item?.asisten_sedasi || '-' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Riwayat Alergi</strong></td>
                      <td>: {{ item?.alergi || item?.riwayat_alergi || 'Tidak Ada' }}</td>
                      <td><strong>Jam Mulai / Selesai</strong></td>
                      <td>: {{ item?.jam_mulai || item?.jam_mulai_sedasi || '-' }} s/d {{ item?.jam_selesai || item?.jam_selesai_sedasi || '-' }}</td>
                    </tr>
                    <tr>
                      <td><strong>ASA Classification</strong></td>
                      <td colspan="3">: ASA {{ item?.asa || item?.asa_class || '1' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 1. PEMANTAUAN (MONITORING) & 2. ASSESMEN PRA SEDASI JAM -->
              <div class="section-title">1. Pemantauan (Monitoring) & 2. Assesmen Pra Sedasi Jam: {{ item?.jam_pra || item?.assesmen_pra_sedasi_jam || '-' }}</div>
              <div class="row q-col-gutter-x-md py-tight font-10">
                <div class="col-6">
                  <div><strong>Pemantauan:</strong></div>
                  <div class="q-my-xs">
                    <q-checkbox :model-value="hasCheck(item?.monitoring || item?.monitoring_check, 'SpO2')" size="xs" label="SpO2" dense disable color="black" class="q-mr-sm" />
                    <q-checkbox :model-value="hasCheck(item?.monitoring || item?.monitoring_check, 'EKG')" size="xs" label="EKG" dense disable color="black" class="q-mr-sm" />
                    <q-checkbox :model-value="hasCheck(item?.monitoring || item?.monitoring_check, 'NIBP')" size="xs" label="NIBP" dense disable color="black" class="q-mr-sm" />
                    <q-checkbox :model-value="hasCheck(item?.monitoring || item?.monitoring_check, 'Lain-lain')" size="xs" label="Lain-lain" dense disable color="black" />
                    <span v-if="item?.monitoring_lain"> : {{ item.monitoring_lain }}</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="row">
                    <div class="col-6">Frekuensi Nafas : {{ item?.fr_pra || item?.assesmen_pra_sedasi_fr || '-' }} x/menit</div>
                    <div class="col-6">Tekanan Darah : {{ item?.td_pra || item?.assesmen_pra_sedasi_td || '-' }} mmHg</div>
                    <div class="col-6">SpO2 : {{ item?.spo2_pra || item?.assesmen_pra_sedasi_spo2 || '100' }}%</div>
                    <div class="col-6">GCS : {{ item?.gcs_pra || item?.assesmen_pra_sedasi_gcs || '-' }}</div>
                    <div class="col-6">Frekuensi Nadi : {{ item?.nadi_pra || item?.assesmen_pra_sedasi_nadi || '-' }} x/menit</div>
                    <div class="col-6">Suhu : {{ item?.suhu_pra || item?.assesmen_pra_sedasi_suhu || '-' }} °C</div>
                  </div>
                </div>
              </div>

              <!-- 3. CHECKLIST PERSIAPAN SEDASI & 4. AKSES INTRA VENA -->
              <div class="section-title q-mt-xs">3. Checklist Persiapan Sedasi & 4. Akses Intra Vena</div>
              <div class="row q-col-gutter-x-md py-tight font-10">
                <div class="col-7">
                  <div class="row">
                    <div class="col-6">
                      <q-checkbox :model-value="hasCheck(item?.checklist || item?.checklist_persiapan, 'PersetujuanTindakanMedis')" size="xs" label="Persetujuan Tindakan Medis" dense disable color="black" />
                    </div>
                    <div class="col-6">
                      <q-checkbox :model-value="hasCheck(item?.checklist || item?.checklist_persiapan, 'PerlengkapanEmergensi')" size="xs" label="Perlengkapan Emergensi" dense disable color="black" />
                    </div>
                    <div class="col-6">
                      <q-checkbox :model-value="hasCheck(item?.checklist || item?.checklist_persiapan, 'PuasaNPO')" size="xs" label="Puasa/NPO" dense disable color="black" />
                      <span v-if="item?.jam_puasa || item?.puasa_npo_mulai_jam"> (Mulai: {{ item?.jam_puasa || item?.puasa_npo_mulai_jam }})</span>
                    </div>
                    <div class="col-6">
                      <q-checkbox :model-value="hasCheck(item?.checklist || item?.checklist_persiapan, 'ObatObatSedasi')" size="xs" label="Obat-obat Sedasi" dense disable color="black" />
                    </div>
                    <div class="col-12">
                      <q-checkbox :model-value="hasCheck(item?.checklist || item?.checklist_persiapan, 'PenilaianPraSedasi')" size="xs" label="Penilaian Pra Sedasi" dense disable color="black" />
                    </div>
                  </div>
                </div>
                <div class="col-5">
                  <div><strong>Akses Intra Vena, tempat & ukuran:</strong></div>
                  <div>{{ item?.akses_iv || item?.akses_intra_vena || '-' }}</div>
                </div>
              </div>

              <!-- 5. PEMBERIAN OBAT DAN PEMANTAUAN SELAMA PROSEDUR DENGAN SEDASI -->
              <div class="section-title q-mt-xs">5. Pemberian Obat dan Pemantauan Selama Prosedur dengan Sedasi</div>
              
              <!-- TABEL HEADER WAKTU & OBAT -->
              <table class="full-width table-grid-chart q-my-xs text-center">
                <thead>
                  <tr class="bg-grey-2">
                    <th width="20%">Waktu</th>
                    <th v-for="(row, idx2) in getRows(item?.monitoring_intra)" :key="idx2" width="6.5%">{{ row.waktu || '-' }}</th>
                    <th v-for="emptyIdx in (12 - getRows(item?.monitoring_intra).length)" :key="'e-'+emptyIdx" width="6.5%">-</th>
                  </tr>
                  <tr>
                    <td><strong>Obat-obatan & Rute Pemberian</strong></td>
                    <td v-for="(row, idx2) in getRows(item?.monitoring_intra)" :key="idx2" class="font-9 font-bold">{{ row.obat_sedasi || '-' }}</td>
                    <td v-for="emptyIdx in (12 - getRows(item?.monitoring_intra).length)" :key="'eo-'+emptyIdx">-</td>
                  </tr>
                </thead>
              </table>

              <!-- GRID CHART PLOTTING REKAM MEDIS ASLI -->
              <table class="full-width table-grid-chart text-center q-mb-xs">
                <thead>
                  <tr class="bg-grey-3">
                    <th width="5%">SpO2</th>
                    <th width="5%">Fr</th>
                    <th width="5%">Nadi</th>
                    <th width="5%">TD</th>
                    <th v-for="(row, idx2) in getRows(item?.monitoring_intra)" :key="idx2" width="6.5%" class="font-9">{{ row.waktu }}</th>
                    <th v-for="emptyIdx in (12 - getRows(item?.monitoring_intra).length)" :key="'egh-'+emptyIdx" width="6.5%">-</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(level, lIdx) in gridLevels" :key="lIdx">
                    <td class="font-bold">{{ level.spo2 }}</td>
                    <td class="font-bold">{{ level.fr }}</td>
                    <td class="font-bold">{{ level.nadi }}</td>
                    <td class="font-bold">{{ level.td }}</td>
                    <td v-for="(row, rIdx) in getRows(item?.monitoring_intra)" :key="rIdx" class="cell-plot font-bold">
                      {{ getGridCellContent(row, level) }}
                    </td>
                    <td v-for="emptyIdx in (12 - getRows(item?.monitoring_intra).length)" :key="'egc-'+emptyIdx"></td>
                  </tr>
                </tbody>
              </table>

              <!-- GRAFIK PEMANTAUAN VITAL SIGNS (RAPI: SUMBU KIRI 0-240, SUMBU KANAN WAKTU UTAMA) -->
              <div class="grafik-pemantauan-box q-mt-xs q-pa-xs border-bordered bg-white">
                <div class="row justify-between items-center q-px-xs q-mb-xs border-b q-pb-xs">
                  <span class="text-bold font-9 text-indigo-9">GRAFIK VITAL SIGNS</span>
                  <span class="font-8 text-grey-7">* Sumbu Y Kiri: Vital Signs (0 - 240) | Sumbu Y Kanan: Timeline Prosedur</span>
                </div>

                <div class="row no-wrap items-stretch">
                  <!-- PANEL KIRI: TABEL KETERANGAN SIMBOL RAPI & PRESISI -->
                  <div class="col-auto border-r q-pr-xs q-mr-xs flex column justify-between" style="width: 145px; background-color: #f8fafc;">
                    <div class="text-bold text-indigo-9 font-8 text-center q-py-xs border-b bg-grey-2">
                      KETERANGAN SIMBOL
                    </div>

                    <table class="full-width font-8 q-my-xs legend-table">
                      <tbody>
                        <tr>
                          <td width="22px" class="text-center text-bold font-9">v / ^</td>
                          <td>TD (Sis/Dis) : <strong class="text-black">Hitam</strong></td>
                        </tr>
                        <tr>
                          <td class="text-center">
                            <span class="inline-block rounded-full" style="width: 7px; height: 7px; background-color: #ef4444;"></span>
                          </td>
                          <td>Nadi (HR) : <strong class="text-red-9">Merah</strong></td>
                        </tr>
                        <tr>
                          <td class="text-center">
                            <span class="inline-block rounded-full" style="width: 7px; height: 7px; background-color: #2563eb;"></span>
                          </td>
                          <td>Suhu : <strong class="text-blue-9">Biru</strong></td>
                        </tr>
                        <tr>
                          <td class="text-center text-bold font-9">X</td>
                          <td>Sedasi (Mulai/Selesai)</td>
                        </tr>
                        <tr>
                          <td class="text-center">
                            <span class="inline-block rounded-full" style="width: 7px; height: 7px; border: 1.5px solid #000; background: transparent;"></span>
                          </td>
                          <td>Prosedur (Mulai/Selesai)</td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="font-7 text-grey-7 border-t q-pt-xs text-center q-pb-xs">
                      * Sumbu Y Kiri: Skala Asli<br>
                      * Sumbu Y Kanan: Timeline
                    </div>
                  </div>

                  <!-- PANEL TENGAH DUAL Y-AXIS SVG GRAPH -->
                  <div class="col relative-position overflow-hidden" style="height: 165px;">
                    <svg class="full-width fit" viewBox="0 0 540 165" preserveAspectRatio="none">
                      <!-- GRID HORIZONTAL LINES (SKALA 240 - 0, INTERVAL 20) -->
                      <g v-for="lvl in yTicks" :key="lvl">
                        <line
                          x1="35"
                          :y1="144 - (lvl / 240) * 132"
                          x2="445"
                          :y2="144 - (lvl / 240) * 132"
                          :stroke="lvl === 0 ? '#94a3b8' : '#e2e8f0'"
                          :stroke-dasharray="lvl === 0 ? 'none' : '3,3'"
                          :stroke-width="lvl === 0 ? 1.5 : 1"
                        />
                        <!-- SUMBU Y KIRI (ANGKA VITAL SIGNS 0 - 240) -->
                        <text
                          x="30"
                          :y="144 - (lvl / 240) * 132 + 3"
                          text-anchor="end"
                          font-size="7.5"
                          fill="#64748b"
                        >{{ lvl }}</text>
                      </g>

                      <!-- SUMBU Y KIRI (GARIS VERTIKAL) -->
                      <line x1="35" y1="12" x2="35" y2="144" stroke="#94a3b8" stroke-width="1.5" />

                      <!-- SUMBU Y KANAN (GARIS VERTIKAL KANAN UNTUK TIMELINE) -->
                      <line x1="445" y1="12" x2="445" y2="144" stroke="#334155" stroke-width="1.5" />

                      <!-- TICK & LABEL SUMBU Y KANAN: JAM MULAI (PUNCAK ATAS Y=20) -->
                      <line x1="445" y1="20" x2="450" y2="20" stroke="#334155" stroke-width="1.5" />
                      <text x="454" y="23" font-size="8" font-weight="bold" fill="#0f172a">
                        {{ item?.jam_mulai || getFirstTime(item) || '-' }} (Mulai)
                      </text>

                      <!-- TICK & LABEL SUMBU Y KANAN: JAM SELESAI (DASAR BAWAH Y=144) -->
                      <line x1="445" y1="144" x2="450" y2="144" stroke="#334155" stroke-width="1.5" />
                      <text x="454" y="147" font-size="8" font-weight="bold" fill="#0f172a">
                        {{ item?.jam_selesai || getLastTime(item) || '-' }} (Selesai)
                      </text>

                      <!-- VITAL SIGNS & SOP MARKERS PLOTTED PER WAKTU -->
                      <g v-for="(point, pIdx) in getDotPlotData(item)" :key="pIdx">
                        <!-- MULAI SEDASI: X (DI PUNCAK ATAS Y=20, SEJAJAR GARIS MULAI SUMBU KANAN) -->
                        <text
                          v-if="point.isMulaiSedasi"
                          :x="point.x - 7"
                          y="23"
                          text-anchor="middle"
                          font-size="11"
                          font-weight="900"
                          fill="#000000"
                        >X</text>

                        <!-- SELESAI SEDASI: X (DI DASAR BAWAH Y=144, SEJAJAR GARIS SELESAI SUMBU KANAN) -->
                        <text
                          v-if="point.isSelesaiSedasi"
                          :x="point.x - 7"
                          y="147"
                          text-anchor="middle"
                          font-size="11"
                          font-weight="900"
                          fill="#000000"
                        >X</text>

                        <!-- MULAI PROSEDUR: O (DI PUNCAK ATAS Y=20, SEJAJAR GARIS MULAI SUMBU KANAN) -->
                        <circle
                          v-if="point.isMulaiProsedur"
                          :cx="point.x + 7"
                          cy="19"
                          r="4.5"
                          fill="none"
                          stroke="#000000"
                          stroke-width="1.8"
                        />

                        <!-- SELESAI PROSEDUR: O (DI DASAR BAWAH Y=144, SEJAJAR GARIS SELESAI SUMBU KANAN) -->
                        <circle
                          v-if="point.isSelesaiProsedur"
                          :cx="point.x + 7"
                          cy="143"
                          r="4.5"
                          fill="none"
                          stroke="#000000"
                          stroke-width="1.8"
                        />

                        <!-- TD SISTOLIK: v -->
                        <text
                          v-if="point.sis !== null && point.ySis !== null"
                          :x="point.x - 6"
                          :y="point.ySis + 3"
                          text-anchor="middle"
                          font-size="11"
                          font-weight="900"
                          fill="#000000"
                        >v</text>

                        <!-- TD DIASTOLIK: ^ -->
                        <text
                          v-if="point.dis !== null && point.yDis !== null"
                          :x="point.x - 6"
                          :y="point.yDis + 3"
                          text-anchor="middle"
                          font-size="11"
                          font-weight="900"
                          fill="#000000"
                        >^</text>

                        <!-- NADI (HR): 🔴 -->
                        <circle
                          v-if="point.nadi !== null && point.yNadi !== null"
                          :cx="point.x"
                          :cy="point.yNadi"
                          r="4"
                          fill="#ef4444"
                          stroke="#ffffff"
                          stroke-width="1"
                        />

                        <!-- SUHU: 🔵 -->
                        <circle
                          v-if="point.suhu !== null && point.ySuhu !== null"
                          :cx="point.x + 6"
                          :cy="point.ySuhu"
                          r="4"
                          fill="#2563eb"
                          stroke="#ffffff"
                          stroke-width="1"
                        />

                        <!-- X-AXIS TIME LABEL -->
                        <text :x="point.x" y="156" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#334155">{{ point.waktu }}</text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="font-9 q-mt-xs text-grey-9">
                <div><strong>Mulai sedasi X → &nbsp;;&nbsp; Selesai sedasi ← X &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mulai prosedur O → &nbsp;;&nbsp; Selesai prosedur ← O</strong></div>
                <div class="q-mt-xs">
                  <strong>Derajat Kedalaman Sedasi :</strong><br>
                  0 = sadar penuh; 1 = sedasi minimal (mengantuk, respon percakapan adekuat); 2 = sedasi sedang (mengantuk/tidur, terbangun dengan rangsangan sentuh); 3 = sedasi dalam (tidur, terbangun dengan rangsangan fisik bermakna); 4 = tidak dapat dibangunkan. (UMSS)
                </div>
              </div>
            </div>
          </div>

          <!-- DIVIDER HALAMAN -->
          <div class="page-break" />

          <!-- ==================== HALAMAN 2: PASCA SEDASI & DISCHARGE (TANPA KOP HEADER) ==================== -->
          <div class="print-page print-page-2 bg-white q-pa-md shadow-2 rounded-borders q-mt-md">
            <div class="status-sedasi-doc text-black">
              <!-- 6. PEMANTAUAN PASCA SEDASI (RUANG PULIH) -->
              <div class="section-title" style="margin-top: 0;">6. Pemantauan Pasca Sedasi (Jam Masuk Ruang Pulih: {{ item?.jam_pulih || item?.jam_masuk_ruang_pulih || '-' }})</div>
              
              <div class="row q-col-gutter-x-sm q-my-xs items-stretch">
                <!-- LEFT GRID VITAL SIGNS PASCA SEDASI (GRID TIME-SERIES 15 MENIT PRESISI SEPERTI DOKUMEN MANUAL) -->
                <div class="col-6">
                  <table class="full-width table-grid-chart text-center fit">
                    <thead>
                      <tr class="bg-grey-3 font-9">
                        <th width="8%">Fr</th>
                        <th width="8%">Nadi</th>
                        <th width="8%">TD</th>
                        <th v-for="(tCol, tIdx) in getPascaTimeCols(item)" :key="tIdx" class="font-8 font-bold">
                          {{ tCol }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(level, lIdx) in gridLevelsPasca" :key="lIdx">
                        <td class="font-bold">{{ level.fr }}</td>
                        <td class="font-bold">{{ level.nadi }}</td>
                        <td class="font-bold">{{ level.td }}</td>
                        <td v-for="(tCol, tIdx) in getPascaTimeCols(item)" :key="tIdx" class="cell-plot font-bold">
                          {{ getPascaGridCellContent(item, level, tIdx) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- MIDDLE WONG-BAKER FACES PAIN SCALE BOX -->
                <div class="col-3 border-bordered text-center flex flex-center column bg-grey-1 rounded-borders q-pa-xs">
                  <div class="font-bold font-9 text-primary q-mb-xs">VAS / FLACC / FACES</div>
                  
                  <div class="row items-center justify-center no-wrap q-gutter-x-xs q-my-xs">
                    <div v-for="face in facesList" :key="face.score" class="column items-center">
                      <div
                        class="flex flex-center font-11"
                        :class="Number(item?.nyeri_vas || 0) === face.score ? 'bg-amber-4 text-bold rounded-full border-solid' : 'opacity-70'"
                        style="width: 20px; height: 20px; border-radius: 50%;"
                      >
                        {{ face.icon }}
                      </div>
                      <div class="font-7 text-bold q-mt-3" :class="Number(item?.nyeri_vas || 0) === face.score ? 'text-primary font-bold' : 'text-grey-7'">
                        {{ face.score }}
                      </div>
                    </div>
                  </div>

                  <div class="text-h4 text-bold text-primary q-my-xs">{{ item?.nyeri_vas || item?.nyeri_vas_discharge || '0' }}</div>
                  <div class="font-8 text-grey-7">(Skala Nyeri 0 - 10)</div>
                </div>

                <!-- RIGHT ALDRETE SCORE SUMMARY BOX -->
                <div class="col-3 border-bordered q-pa-xs bg-grey-1 rounded-borders">
                  <div class="font-bold font-10 text-primary text-center q-mb-xs">SKOR ALDRETE</div>
                  <table class="full-width table-bordered font-9">
                    <tbody>
                      <tr><td>Aktivitas / Pergerakan</td><td class="text-center font-bold">{{ item?.aldrete_pergerakan ?? 2 }}</td></tr>
                      <tr><td>Sirkulasi / Tensi</td><td class="text-center font-bold">{{ item?.aldrete_tensi ?? 2 }}</td></tr>
                      <tr><td>Pernafasan</td><td class="text-center font-bold">{{ item?.aldrete_pernafasan ?? 2 }}</td></tr>
                      <tr><td>Kesadaran</td><td class="text-center font-bold">{{ item?.aldrete_kesadaran ?? 2 }}</td></tr>
                      <tr><td>Warna Kulit</td><td class="text-center font-bold">{{ item?.aldrete_warna_kulit ?? 2 }}</td></tr>
                      <tr class="bg-primary text-white font-bold">
                        <td>TOTAL NILAI</td>
                        <td class="text-center font-11">{{ item?.total_aldrete || item?.aldrete_total || 10 }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- TABEL URAIAN KRITERIA ALDRETE DENGAN PENANDA LINGKARAN HITAM (①, ②, ⓪) PRESISI SESUAI DOKUMEN ASLI -->
              <div class="section-title q-mt-xs">Tabel Uraian Kriteria Skor Aldrete</div>
              <table class="full-width table-bordered q-my-xs font-10">
                <thead>
                  <tr class="bg-grey-2">
                    <th width="22%">URAIAN</th>
                    <th width="63%">KRITERIA</th>
                    <th width="15%">NILAI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Kesadaran</strong></td>
                    <td>
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_kesadaran ?? 2) === 2 }">Sadar Penuh</span> ({{ (item?.aldrete_kesadaran ?? 2) === 2 ? '②' : '2' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_kesadaran ?? 2) === 1 }">Tidak Sadar</span> ({{ (item?.aldrete_kesadaran ?? 2) === 1 ? '①' : '1' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_kesadaran ?? 2) === 0 }">Tdk Ada Reaksi</span> ({{ (item?.aldrete_kesadaran ?? 2) === 0 ? '⓪' : '0' }})
                    </td>
                    <td class="text-center font-bold font-11 text-primary">
                      {{ getCircledNum(item?.aldrete_kesadaran ?? 2) }}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Pernafasan</strong></td>
                    <td>
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_pernafasan ?? 2) === 2 }">Teratur Kuat / Batuk</span> ({{ (item?.aldrete_pernafasan ?? 2) === 2 ? '②' : '2' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_pernafasan ?? 2) === 1 }">Nafas Berat Dyspnea</span> ({{ (item?.aldrete_pernafasan ?? 2) === 1 ? '①' : '1' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_pernafasan ?? 2) === 0 }">Nafas dibantu</span> ({{ (item?.aldrete_pernafasan ?? 2) === 0 ? '⓪' : '0' }})
                    </td>
                    <td class="text-center font-bold font-11 text-primary">
                      {{ getCircledNum(item?.aldrete_pernafasan ?? 2) }}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Tensi</strong></td>
                    <td>
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_tensi ?? 2) === 2 }">Sama dengan nilai awal ± 20%</span> ({{ (item?.aldrete_tensi ?? 2) === 2 ? '②' : '2' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_tensi ?? 2) === 1 }">Berbeda 20-30%</span> ({{ (item?.aldrete_tensi ?? 2) === 1 ? '①' : '1' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_tensi ?? 2) === 0 }">Berbeda > 30%</span> ({{ (item?.aldrete_tensi ?? 2) === 0 ? '⓪' : '0' }})
                    </td>
                    <td class="text-center font-bold font-11 text-primary">
                      {{ getCircledNum(item?.aldrete_tensi ?? 2) }}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Pergerakan</strong></td>
                    <td>
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_pergerakan ?? 2) === 2 }">Gerak terkendali</span> ({{ (item?.aldrete_pergerakan ?? 2) === 2 ? '②' : '2' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_pergerakan ?? 2) === 1 }">Ada reaksi rangsangan</span> ({{ (item?.aldrete_pergerakan ?? 2) === 1 ? '①' : '1' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_pergerakan ?? 2) === 0 }">Gerak tak terkendali</span> ({{ (item?.aldrete_pergerakan ?? 2) === 0 ? '⓪' : '0' }})
                    </td>
                    <td class="text-center font-bold font-11 text-primary">
                      {{ getCircledNum(item?.aldrete_pergerakan ?? 2) }}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Warna Kulit</strong></td>
                    <td>
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_warna_kulit ?? 2) === 2 }">Merah</span> ({{ (item?.aldrete_warna_kulit ?? 2) === 2 ? '②' : '2' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_warna_kulit ?? 2) === 1 }">Pucat</span> ({{ (item?.aldrete_warna_kulit ?? 2) === 1 ? '①' : '1' }}) / 
                      <span :class="{ 'text-bold text-primary': (item?.aldrete_warna_kulit ?? 2) === 0 }">Cyanosis</span> ({{ (item?.aldrete_warna_kulit ?? 2) === 0 ? '⓪' : '0' }})
                    </td>
                    <td class="text-center font-bold font-11 text-primary">
                      {{ getCircledNum(item?.aldrete_warna_kulit ?? 2) }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- 7. KRITERIA DISCHARGE PASIEN PASCA SEDASI -->
              <div class="section-title q-mt-xs">7. Kriteria Discharge Pasien Pasca Sedasi</div>
              <table class="full-width table-bordered font-10">
                <tbody>
                  <tr>
                    <td width="50%">1. Skor Aldrett : <strong>{{ item?.skor_discharge || item?.skor_aldrett_discharge || 10 }}</strong></td>
                    <td width="50%">2. Nyeri : Skala VAS <strong>{{ item?.nyeri_vas || item?.nyeri_vas_discharge || '0' }}</strong></td>
                  </tr>
                  <tr>
                    <td>3. Mual, Muntah : <strong>{{ item?.mual_muntah || 'Tidak Ada' }}</strong></td>
                    <td>4. Perdarahan : <strong>{{ item?.perdarahan || 'Tidak Ada' }}</strong></td>
                  </tr>
                  <tr>
                    <td colspan="2">5. Ambulasi : <strong>{{ item?.ambulasi || 'Mandiri' }}</strong></td>
                  </tr>
                </tbody>
              </table>

              <!-- 8, 9, 10: KEPUTUSAN & INSTRUKSI PASCA SEDASI -->
              <div class="row q-col-gutter-x-md q-mt-xs font-10">
                <div class="col-6"><strong>8. Keputusan Discharge Pasien:</strong> {{ item?.keputusan || item?.keputusan_discharge || 'Dipulangkan' }}</div>
                <div class="col-6"><strong>9. Jam Keluar Ruang Pulih:</strong> {{ item?.jam_keluar || item?.jam_keluar_ruang_pulih || '-' }}</div>
              </div>

              <div class="section-title q-mt-xs">10. Instruksi Pasca Sedasi</div>
              <div class="font-10 py-tight"><strong>Obat-obatan:</strong> {{ item?.instruksi_obat || '-' }}</div>
              <div class="font-10 py-tight"><strong>Mobilisasi:</strong> {{ item?.instruksi_mobilisasi || '-' }}</div>
              <div class="font-10 py-tight"><strong>Diet & Nutrisi:</strong> {{ item?.instruksi_diet || item?.instruksi_diet_nutrisi || '-' }}</div>
              <div class="font-10 py-tight"><strong>Edukasi & Follow up:</strong> {{ item?.instruksi_edukasi || item?.instruksi_edukasi_followup || '-' }}</div>
              <div class="font-10 py-tight"><strong>Lain-lain:</strong> {{ item?.instruksi_lain || '-' }}</div>

              <!-- DOKTER ANESTESI SIGNATURE WITH QR CODE -->
              <div class="row justify-end q-mt-md">
                <div class="col-5 text-center font-10">
                  <div class="text-bold">Dokter Anestesi</div>
                  <div class="flex flex-center q-my-xs">
                    <div style="width: 58px; height: 58px;">
                      <vue-qrcode
                        v-if="item?.kddokter || item?.kdpegsimrs"
                        :value="qrUrl(item?.kddokter || item?.kdpegsimrs)"
                        tag="svg"
                        :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }"
                      />
                      <div v-else class="text-caption text-grey-5">(Belum TTD)</div>
                    </div>
                  </div>
                  <div class="text-bold" style="border-bottom: 1px dotted #000; display: inline-block;">
                    ( {{ item?.dokter || item?.dokter_sedasi || '................................' }} )
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="page-break" v-if="idx < items.length - 1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePascaSedasiRanapStore } from 'src/stores/simrs/ranap/pascasedasi'

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
    type: [Array, Object],
    default: null
  }
})

// Y-AXIS TICKS (0 Sampai 240 dengan Interval 20)
const yTicks = [240, 220, 200, 180, 160, 140, 120, 100, 80, 60, 40, 20, 0]

const facesList = [
  { score: 0, icon: '😊' },
  { score: 2, icon: '🙂' },
  { score: 4, icon: '😐' },
  { score: 6, icon: '🙁' },
  { score: 8, icon: '😢' },
  { score: 10, icon: '😭' }
]

const store = usePascaSedasiRanapStore()

const loading = computed(() => store.loading)
const items = computed(() => store.items || [])

onMounted(() => {
  if (props.pasien?.noreg) {
    store.getData(props.pasien)
  }
})

const printObj = {
  id: 'print-status-sedasi-document',
  popTitle: 'Status Sedasi'
}

function parseJSON(val) {
  if (!val) return []
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch (e) { return [] }
  }
  return val
}

function getRows(monitoringIntra) {
  return parseJSON(monitoringIntra)
}

function getFirstTime(item) {
  const rows = getRows(item?.monitoring_intra)
  return rows && rows.length ? rows[0].waktu : '-'
}

function getLastTime(item) {
  const rows = getRows(item?.monitoring_intra)
  const activeRows = rows ? rows.filter(r => r.waktu || r.nadi || r.sis) : []
  return activeRows && activeRows.length ? activeRows[activeRows.length - 1].waktu : '-'
}

function getPascaMonitoringRows(item) {
  let res = parseJSON(item?.monitoring_pasca)
  if ((!res || !res.length) && item?.catatan) {
    try {
      const cDec = typeof item.catatan === 'string' ? JSON.parse(item.catatan) : item.catatan
      if (cDec && cDec.monitoring_pasca) {
        res = cDec.monitoring_pasca
      }
    } catch (e) {}
  }
  return res
}

function displayCatatan(item) {
  if (!item?.catatan) return '-'
  try {
    const cDec = typeof item.catatan === 'string' ? JSON.parse(item.catatan) : item.catatan
    if (cDec && typeof cDec === 'object' && cDec.teks !== undefined) {
      return cDec.teks || '-'
    }
  } catch (e) {}
  return item.catatan
}

function getPascaTimeCols(item) {
  const pRows = getPascaMonitoringRows(item)
  if (pRows && pRows.length) {
    const timeCols = pRows.map(r => r.waktu || '-').filter(w => w !== '-')
    if (timeCols.length) {
      while (timeCols.length < 6) {
        timeCols.push('-')
      }
      return timeCols.slice(0, 6)
    }
  }

  const startTime = item?.jam_pulih || item?.jam_masuk_ruang_pulih || '14:56'
  const cols = [startTime]
  try {
    const parts = startTime.split(':')
    if (parts.length === 2) {
      let h = parseInt(parts[0], 10)
      let m = parseInt(parts[1], 10)
      for (let i = 1; i < 6; i++) {
        m += 15
        if (m >= 60) {
          h = (h + Math.floor(m / 60)) % 24
          m = m % 60
        }
        const sh = String(h).padStart(2, '0')
        const sm = String(m).padStart(2, '0')
        cols.push(`${sh}:${sm}`)
      }
    }
  } catch (e) {
    return [startTime, '-', '-', '-', '-', '-']
  }
  return cols
}

function getPascaGridCellContent(item, level, colIdx = 0) {
  if (!item) return ''
  const pRows = getPascaMonitoringRows(item)
  let targetRow = null
  
  if (pRows && pRows.length && pRows[colIdx]) {
    targetRow = pRows[colIdx]
  } else if (colIdx === 0) {
    targetRow = {
      fr: item.fr_pra || item.assesmen_pra_sedasi_fr || 18,
      nadi: item.nadi_pra || item.assesmen_pra_sedasi_nadi || 80,
      sis: 120,
      dis: 80
    }
  }
  
  if (!targetRow) return ''

  const marks = []
  const fr = targetRow.fr !== null && targetRow.fr !== undefined ? Number(targetRow.fr) : null
  const nadi = targetRow.nadi !== null && targetRow.nadi !== undefined ? Number(targetRow.nadi) : null
  const sis = targetRow.sis !== null && targetRow.sis !== undefined ? Number(targetRow.sis) : null
  const dis = targetRow.dis !== null && targetRow.dis !== undefined ? Number(targetRow.dis) : null

  if (fr !== null && Math.abs(fr - level.fr) <= 3) marks.push(`R:${fr}`)
  if (nadi !== null && Math.abs(nadi - level.nadi) <= 10) marks.push(`N:${nadi}`)
  if (sis !== null && Math.abs(sis - level.td) <= 10) marks.push(`v${sis}`)
  if (dis !== null && Math.abs(dis - level.td) <= 10) marks.push(`^${dis}`)

  return marks.join(' ')
}

function getCircledNum(val) {
  const num = Number(val)
  if (num === 2) return '②'
  if (num === 1) return '①'
  if (num === 0) return '⓪'
  return val !== null && val !== undefined ? String(val) : '②'
}

function hasCheck(rawVal, checkVal) {
  const arr = parseJSON(rawVal)
  return Array.isArray(arr) && arr.includes(checkVal)
}

function calcY(val) {
  if (val === null || val === undefined || isNaN(val)) return null
  const num = Number(val)
  const clamped = Math.max(0, Math.min(240, num))
  return Math.round(144 - (clamped / 240) * 132)
}

function getDotPlotData(item) {
  const rows = getRows(item?.monitoring_intra)
  if (!rows || !rows.length) return []

  const startX = 35
  const endX = 445
  const colWidth = (endX - startX) / 12

  const activeRows = rows.filter(r => r.waktu || r.nadi || r.sis)
  const lastActiveIndex = Math.max(0, activeRows.length - 1)

  return rows.slice(0, 12).map((row, i) => {
    const x = Math.round(startX + (i + 0.5) * colWidth)
    
    const nadi = row.nadi ? Number(row.nadi) : null
    
    let suhuRaw = row.suhu || item?.suhu_pra || item?.assesmen_pra_sedasi_suhu
    let suhu = null
    if (suhuRaw && !isNaN(suhuRaw)) {
      suhu = Number(suhuRaw)
    }

    const sis = row.sis ? Number(row.sis) : null
    const dis = row.dis ? Number(row.dis) : null

    // Mulai / Selesai Sedasi (X) & Prosedur (O)
    const isMulaiSedasi = i === 0 || row.sedasi === 'mulai' || row.sedasi === 'x' || row.is_mulai_sedasi
    const isSelesaiSedasi = (i === lastActiveIndex && activeRows.length > 1) || row.sedasi === 'selesai' || row.is_selesai_sedasi
    const isMulaiProsedur = i === 0 || row.prosedur === 'mulai' || row.prosedur === 'o' || row.is_mulai_prosedur
    const isSelesaiProsedur = (i === lastActiveIndex && activeRows.length > 1) || row.prosedur === 'selesai' || row.is_selesai_prosedur

    return {
      waktu: row.waktu || '-',
      nadi,
      suhu,
      sis,
      dis,
      yNadi: calcY(nadi),
      ySuhu: calcY(suhu),
      ySis: calcY(sis),
      yDis: calcY(dis),
      x,
      isMulaiSedasi,
      isSelesaiSedasi,
      isMulaiProsedur,
      isSelesaiProsedur
    }
  })
}

const gridLevels = [
  { spo2: 100, fr: 60, nadi: 180, td: 220 },
  { spo2: 95,  fr: 55, nadi: 160, td: 200 },
  { spo2: 90,  fr: 50, nadi: 140, td: 180 },
  { spo2: 85,  fr: 45, nadi: 120, td: 160 },
  { spo2: 80,  fr: 40, nadi: 100, td: 140 },
  { spo2: 75,  fr: 35, nadi: 80,  td: 120 },
  { spo2: 70,  fr: 30, nadi: 60,  td: 100 },
  { spo2: 65,  fr: 25, nadi: 40,  td: 80 },
  { spo2: 60,  fr: 20, nadi: 20,  td: 60 },
  { spo2: 15,  fr: 15, nadi: 0,   td: 40 },
  { spo2: 10,  fr: 10, nadi: '-', td: 20 },
  { spo2: 5,   fr: 5,  nadi: '-', td: 0 }
]

const gridLevelsPasca = [
  { fr: 60, nadi: 180, td: 220 },
  { fr: 55, nadi: 160, td: 200 },
  { fr: 45, nadi: 120, td: 160 },
  { fr: 40, nadi: 100, td: 140 },
  { fr: 35, nadi: 80,  td: 120 },
  { fr: 30, nadi: 60,  td: 100 },
  { fr: 25, nadi: 40,  td: 80 },
  { fr: 20, nadi: 20,  td: 60 },
  { fr: 15, nadi: 0,   td: 40 }
]

function getGridCellContent(row, level) {
  if (!row) return ''
  const marks = []
  
  if (row.spo2 && Math.abs(Number(row.spo2) - level.spo2) <= 3) {
    marks.push(`${row.spo2}%`)
  }
  if (row.sis && Math.abs(Number(row.sis) - level.td) <= 10) {
    marks.push(`v${row.sis}`)
  }
  if (row.dis && Math.abs(Number(row.dis) - level.td) <= 10) {
    marks.push(`^${row.dis}`)
  }
  if (row.nadi && Math.abs(Number(row.nadi) - level.nadi) <= 10) {
    marks.push(`N:${row.nadi}`)
  }
  if (row.fr && Math.abs(Number(row.fr) - level.fr) <= 3) {
    marks.push(`R:${row.fr}`)
  }

  return marks.join(' ')
}

const qrUrl = (kdpeg) => {
  if (!kdpeg) return ''
  const noreg = props.pasien?.noreg || ''
  const dok = 'STATUS SEDASI.png'
  const asal = 'RAWAT INAP'
  const petugas = kdpeg
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
</script>

<style lang="scss" scoped>
.print-doc-container {
  width: 210mm;
}

.print-page {
  width: 210mm;
  box-sizing: border-box;
}

.status-sedasi-doc {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  line-height: 1.2;
  color: #000;

  .font-7 { font-size: 7.5px; }
  .font-8 { font-size: 8.5px; }
  .font-9 { font-size: 9.5px; }
  .font-10 { font-size: 10px; }
  .font-11 { font-size: 11px; }
  .font-12 { font-size: 12px; }

  .legend-table {
    border-collapse: collapse;
    td {
      padding: 2px 3px;
      border-bottom: 1px solid #f1f5f9;
    }
  }

  .table-bordered {
    border-collapse: collapse;
    width: 100%;
    th, td {
      border: 1px solid #000;
      padding: 3px 5px;
    }
  }

  .table-grid-chart {
    border-collapse: collapse;
    width: 100%;
    th, td {
      border: 1px solid #000;
      padding: 2px 3px;
      height: 17px;
    }
    .cell-plot {
      font-size: 8.5px;
      line-height: 1;
      color: #0d47a1;
      vertical-align: middle;
    }
  }

  .border-bordered {
    border: 1px solid #000;
  }

  .section-title {
    font-weight: bold;
    text-decoration: underline;
    font-size: 10.5px;
    margin-top: 5px;
    margin-bottom: 2px;
  }

  .py-tight {
    padding-top: 1px;
    padding-bottom: 1px;
  }
}

.page-break {
  page-break-after: always !important;
  break-after: page !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  display: block !important;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-page {
    width: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
    background: #fff !important;
  }

  .print-page-2 {
    margin-top: 0 !important;
  }

  .page-break {
    page-break-after: always !important;
    break-after: page !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    display: block !important;
  }
}
</style>
