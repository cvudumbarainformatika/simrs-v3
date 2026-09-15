<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto full-width bg-white q-py-sm q-px-md shadow-1 no-print">
      <div class="row justify-between items-center full-width">
        <!-- KIRI: Judul FAKTUR REKAP dan Badge di bawahnya -->
        <div class="column">
          <div class="row items-center q-gutter-xs">
            <q-icon name="icon-mat-receipt_long" size="20px" color="teal" />
            <div class="text-subtitle2 text-bold text-teal">FAKTUR REKAP</div>
          </div>
          <div v-if="activeBilling?.header" class="q-mt-xs">
            <q-badge color="teal" outline class="q-py-none text-caption" style="font-size: 11px;">
              {{ activeBilling?.header?.sistembayar }} ({{ activeBilling?.header?.ruangan }})
            </q-badge>
          </div>
        </div>

        <!-- KANAN: Pilihan Ruangan, Pilihan Sistem Bayar, Refresh, Tombol Cetak -->
        <div class="row items-center q-gutter-sm">
          <!-- Filter Ruangan Pasien (Hanya ruangan yang disinggahi + Semua Ruangan) -->
          <div v-if="roomOptions?.length > 1" style="min-width: 170px;">
            <q-select
              v-model="selectedRuangan"
              :options="roomOptions"
              option-label="nama_ruangan"
              option-value="kd_ruangan"
              emit-value
              map-options
              dense
              outlined
              label="Pilih Ruangan"
            />
          </div>

          <!-- Filter Sistem Bayar Pasien (Hanya sistem bayar pasien + Semua Sistem Bayar) -->
          <div v-if="sistemBayarOptions?.length > 1" style="min-width: 170px;">
            <q-select
              v-model="selectedSistemBayar"
              :options="sistemBayarOptions"
              option-label="nama_sistembayar"
              option-value="kd_sistembayar"
              emit-value
              map-options
              dense
              outlined
              label="Pilih Sistem Bayar"
            />
          </div>

          <!-- Tombol Refresh -->
          <q-btn
            icon="icon-mat-refresh"
            color="primary"
            flat
            round
            dense
            :loading="store.loading"
            @click="loadData"
          >
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn>

          <!-- Tombol Cetak (Hanya Ikon Print) -->
          <q-btn
            v-if="store.billingData"
            v-print="printObj"
            color="teal"
            icon="icon-mat-print"
            round
            dense
          >
            <q-tooltip>Cetak Faktur Rekap</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Progress Bar Halus saat Background Sync / Update Data -->
    <q-linear-progress v-if="store.loading && store.billingData" indeterminate color="teal" class="absolute-top" style="z-index: 10;" />

    <!-- Container Isi Dokumen Billing -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <!-- Loading State (Hanya jika data belum ada) -->
      <div v-if="store.loading && !store.billingData" class="column flex-center q-pa-xl text-teal">
        <q-spinner-dots size="48px" />
        <div class="q-mt-md text-bold">Memuat Rincian Faktur Rekap...</div>
      </div>

      <!-- Empty / Not Found State -->
      <div v-else-if="!store.billingData" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="icon-mat-receipt" size="64px" class="q-mb-sm" />
        <div class="text-bold">Data Faktur Rekap Tidak Tersedia</div>
        <div class="text-caption">Belum ada rincian data billing untuk pasien ini.</div>
      </div>

      <!-- Sheet Dokumen Kertas Cetak A4 / Faktur Rekap -->
      <div v-else id="print-billing-ranap" class="document-card print-page bg-white q-pa-md shadow-2 text-dark font-billing">
        
        <!-- KOP RUMAH SAKIT -->
        <div class="row items-center justify-between border-kop q-pb-sm q-mb-sm">
          <div class="row items-center q-gutter-x-md">
            <img src="~assets/logos/logo-rsud.png" class="logo-kop" alt="Logo RS" @error="onImgError" />
            <div>
              <div class="text-bold text-subtitle1" style="line-height: 1.2;">
                UOBK RSUD dr. MOHAMAD SALEH
              </div>
              <div class="text-caption text-grey-9" style="font-size: 11px; line-height: 1.2;">
                Jl. Mayjend Panjaitan No. 65 Probolinggo Jawa Timur
              </div>
              <div class="text-caption text-grey-9" style="font-size: 11px; line-height: 1.2;">
                Telp. (0335) 433478,433119,421118 Fax. (0335) 432702
              </div>
            </div>
          </div>
          <div class="text-right text-caption" style="font-size: 11px;">
            <div>{{ formatTanggalSekarang() }}</div>
            <div class="badge-faktur q-mt-xs">FAKTUR REKAP BY SISTEM BAYAR</div>
          </div>
        </div>

        <!-- HEADER IDENTITAS PASIEN -->
        <div class="q-mb-sm">
          <table class="table-identitas">
            <tbody>
              <tr>
                <td class="label-col">Nama</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.nama }}</td>
                <td class="label-col">No. RM</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.norm }}</td>
              </tr>
              <tr>
                <td class="label-col">Pekerjaan</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.pekerjaan || '-' }}</td>
                <td class="label-col">Noreg</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.noreg }}</td>
              </tr>
              <tr>
                <td class="label-col">Umur</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.umur }}</td>
                <td class="label-col">Ruangan</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.ruangan }}</td>
              </tr>
              <tr>
                <td class="label-col">Alamat</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.alamat }}</td>
                <td class="label-col">Ongkos Perwt/hari</td>
                <td class="sep-col">:</td>
                <td class="val-col">Rp. {{ rp(headerData?.ongkos_per_hari) }}</td>
              </tr>
              <template v-if="headerData?.tglmasuk_igd">
                <tr>
                  <td class="label-col">Tanggal Masuk IGD</td>
                  <td class="sep-col">:</td>
                  <td class="val-col">{{ headerData?.tglmasuk_igd }}</td>
                  <td colspan="3"></td>
                </tr>
                <tr>
                  <td class="label-col">Tanggal Masuk Rawat Inap</td>
                  <td class="sep-col">:</td>
                  <td class="val-col">{{ headerData?.tglmasuk }}</td>
                  <td class="label-col">Dokter</td>
                  <td class="sep-col">:</td>
                  <td class="val-col">{{ headerData?.dokter }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td class="label-col">Tanggal Masuk</td>
                  <td class="sep-col">:</td>
                  <td class="val-col">{{ headerData?.tglmasuk }}</td>
                  <td class="label-col">Dokter</td>
                  <td class="sep-col">:</td>
                  <td class="val-col">{{ headerData?.dokter }}</td>
                </tr>
              </template>
              <tr>
                <td class="label-col">Tgl. Keluar/Hidup/Mati</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.tglkeluar }}</td>
                <td class="label-col">Sistem Bayar</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.sistembayar }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- GARIS DOUBLE ATAS TABEL -->
        <div class="border-top-double q-my-xs"></div>

        <!-- TABEL RINCIAN ITEM BILLING -->
        <table class="table-billing full-width">
          <tbody>
            <!-- 1. Administrasi -->
            <tr class="row-item">
              <td class="col-no">1</td>
              <td class="col-desc" colspan="7">Administrasi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.administrasi) }}</td>
            </tr>

            <!-- 2. Akomodasi / Kamar -->
            <tr class="row-item">
              <td class="col-no">2</td>
              <td class="col-desc" colspan="7">Akomodasi / Kamar</td>
              <td class="col-curr">Rp.</td>
              <td></td>
            </tr>
            <tr v-if="rincian?.akomodasi?.items?.length">
              <td></td>
              <td width="30"></td>
              <td colspan="6" class="q-pr-none">
                <table class="sub-table-kamar">
                  <tbody>
                    <tr v-for="(kamar, kIdx) in rincian.akomodasi.items" :key="kIdx">
                      <td class="text-left" nowrap>{{ kamar.kelas }}</td>
                      <td width="10">:</td>
                      <td class="text-right" width="25">{{ kamar.jml }}</td>
                      <td class="text-left" width="30">hari</td>
                      <td class="text-center" width="15">@</td>
                      <td class="text-right" width="60" nowrap>{{ rp(kamar.biaya) }}</td>
                      <td class="text-right" width="25">Rp.</td>
                      <td class="text-right col-subtotal-kamar" width="80" nowrap>{{ rp(kamar.subtotal) }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.akomodasi?.total) }}</td>
            </tr>
            <tr v-else>
              <td></td>
              <td colspan="7"></td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.akomodasi?.total) }}</td>
            </tr>

            <!-- 3. Biaya Pembuatan Dokumen dan Materai -->
            <tr class="row-item">
              <td class="col-no">3</td>
              <td class="col-desc" colspan="7">Biaya Pembuatan Dokumen dan Materai</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.materai) }}</td>
            </tr>

            <!-- 4. Jasa / Tindakan Dokter -->
            <tr class="row-item">
              <td class="col-no">4</td>
              <td class="col-desc" colspan="7">Jasa / Tindakan Dokter</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.tindakan_dokter) }}</td>
            </tr>

            <!-- 5. Visite / Konsultasi / Oncall Dokter -->
            <tr class="row-item">
              <td class="col-no">5</td>
              <td class="col-desc" colspan="7">Visite / Konsultasi / Oncall Dokter</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.visite_dokter) }}</td>
            </tr>

            <!-- 6. Tindakan Keperawatan -->
            <tr class="row-item">
              <td class="col-no">6</td>
              <td class="col-desc" colspan="7">Tindakan Keperawatan</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.tindakan_perawat) }}</td>
            </tr>

            <!-- 7. Asuhan Gizi -->
            <tr class="row-item">
              <td class="col-no">7</td>
              <td class="col-desc" colspan="7">Asuhan Gizi ( Selama dirawat)</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.asuhan_gizi) }}</td>
            </tr>

            <!-- 8. Makan Pasien -->
            <tr class="row-item">
              <td class="col-no">8</td>
              <td class="col-desc" colspan="7">Makan Pasien</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.makan_pasien) }}</td>
            </tr>

            <!-- 9. Biaya Oksigen -->
            <tr class="row-item">
              <td class="col-no">9</td>
              <td class="col-desc" colspan="7">Biaya Oksigen</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.oksigen) }}</td>
            </tr>

            <!-- 10. Jasa Keperawatan -->
            <tr class="row-item">
              <td class="col-no">10</td>
              <td class="col-desc" colspan="7">Jasa Keperawatan</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.jasa_keperawatan) }}</td>
            </tr>

            <!-- 11. Biaya Pelayanan Penunjang -->
            <tr class="row-item">
              <td class="col-no">11</td>
              <td class="col-desc" colspan="7">Biaya Pelayanan Penunjang :</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val"></td>
            </tr>

            <!-- Sub-item Penunjang -->
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Laboratorium</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.laboratorium) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Radiologi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.radiologi) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Endoscope</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.endoscope) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Operasi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.operasi) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Ruang RR</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.ruang_rr) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Fisioterapi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.fisioterapi) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Hemodialisa</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.hemodialisa) }}</td>
            </tr>
            <tr v-for="pl in rincian?.penunjang?.penunjang_lain || []" :key="pl.kode" class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">{{ pl.nama }}</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(pl.subtotal) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Cardio</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.cardio) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">EEG</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.eeg) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Psikologi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.psikologi) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Biaya Penggunaan Darah</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.penggunaan_darah) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Perawatan Jenasah</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.jenasah) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Biaya Ambulan</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.ambulan) }}</td>
            </tr>
            <tr v-if="rincian?.penunjang?.apheresis > 0" class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Biaya Apheresis</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.apheresis) }}</td>
            </tr>
            <tr v-if="rincian?.penunjang?.cathlab > 0" class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Cathlab</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.cathlab) }}</td>
            </tr>
            <tr v-if="rincian?.penunjang?.penunjang_keluar > 0" class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Penunjang Keluar</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.penunjang_keluar) }}</td>
            </tr>

            <!-- 13. Biaya Farmasi / Obat -->
            <tr class="row-item">
              <td class="col-no">13</td>
              <td class="col-desc" colspan="7">Biaya Farmasi / Obat</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.farmasi) }}</td>
            </tr>

            <!-- 14. Operasi Cito (OK Ranap) -->
            <tr v-if="rincian?.operasi_cito > 0" class="row-item">
              <td class="col-no">14</td>
              <td class="col-desc" colspan="7">Operasi Cito (OK Ranap)</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.operasi_cito) }}</td>
            </tr>

            <!-- 16. Biaya Farmasi / Obat (IRD) -->
            <tr class="row-item">
              <td class="col-no">16</td>
              <td class="col-desc" colspan="7">Biaya Farmasi / Obat (IRD)</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.farmasi_ird) }}</td>
            </tr>

            <!-- 18. IRD -->
            <tr class="row-item">
              <td class="col-no">18</td>
              <td class="col-desc" colspan="7">IRD</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.ird) }}</td>
            </tr>

            <!-- TOTAL KESELURUHAN -->
            <tr class="row-grand-total">
              <td colspan="8" class="text-right text-bold font-large q-pr-md">
                TOTAL
              </td>
              <td class="col-curr text-bold font-large">Rp.</td>
              <td class="col-val text-bold font-large">
                {{ formatRp(activeBilling?.grand_total) }}
              </td>
            </tr>

            <!-- PELUNASAN / POTONGAN (Di Bawah TOTAL Sesuai Legacy) -->
            <template v-if="pembayaran">
              <!-- Jika Pilihan Sistem Bayar Spesifik (billingbysistembayar.php): hanya RETUR OBAT dan KURANG BAYAR -->
              <template v-if="selectedSistemBayar && selectedSistemBayar !== 'ALL'">
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">RETUR OBAT</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.retur_farmasi) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">KURANG BAYAR</td>
                  <td class="col-curr text-bold">Rp.</td>
                  <td class="col-val text-bold" style="border-top: 2px double #006699; border-bottom: 1px dotted #006699;">{{ formatRp(pembayaran?.kurang_bayar) }}</td>
                </tr>
              </template>

              <!-- Jika Semua Sistem Bayar (billing.php) -->
              <template v-else>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">TELAH DI BAYAR</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.telah_dibayar) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">POTONGAN JASA</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.potongan_jasa) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">FARMASI TELAH DIBAYAR (Rawat Inap)</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.farmasi_telah_dibayar_ranap) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">FARMASI TELAH DIBAYAR (IRD)</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.farmasi_telah_dibayar_ird) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">RETUR FARMASI</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.retur_farmasi) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">IRD TELAH DIBAYAR</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.ird_telah_dibayar) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">POTONGAN</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.potongan) }}</td>
                </tr>
                <tr v-if="pembayaran?.potongan_jasa_raharja > 0" class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">POTONGAN JASA RAHARJA</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.potongan_jasa_raharja) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">KERINGANAN</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val">{{ rp(pembayaran?.keringanan) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">POTONGAN BPJS</td>
                  <td class="col-curr">Rp.</td>
                  <td class="col-val" style="border-bottom: 2px double #006699;">{{ rp(pembayaran?.potongan_bpjs) }}</td>
                </tr>
                <tr class="row-item">
                  <td colspan="8" class="text-right text-bold q-pr-md">KURANG BAYAR</td>
                  <td class="col-curr text-bold">Rp.</td>
                  <td class="col-val text-bold">{{ formatRp(pembayaran?.kurang_bayar) }}</td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBillingRanapStore } from 'src/stores/simrs/ranap/billing'
import { formatRp } from 'src/modules/formatter'
import { date } from 'quasar'

const props = defineProps({
  pasien: {
    type: Object,
    default: () => null
  },
  menu: {
    type: Object,
    default: () => null
  }
})

const store = useBillingRanapStore()

const selectedRuangan = ref('ALL')
const selectedSistemBayar = ref('ALL')

const roomOptions = computed(() => {
  return store.billingData?.list_ruangan || []
})

const sistemBayarOptions = computed(() => {
  return store.billingData?.list_sistembayar || []
})

const activeBilling = computed(() => {
  if (!store.billingData) return null
  const r = selectedRuangan.value || 'ALL'
  const sb = selectedSistemBayar.value || 'ALL'
  const key = `${r}__${sb}`

  if (store.billingData.details?.[key]) {
    return store.billingData.details[key]
  }
  if (store.billingData.details?.[`${r}__ALL`]) {
    return store.billingData.details[`${r}__ALL`]
  }
  if (store.billingData.details?.[`ALL__${sb}`]) {
    return store.billingData.details[`ALL__${sb}`]
  }
  if (r !== 'ALL' && store.billingData.per_ruangan?.[r]) {
    return store.billingData.per_ruangan[r]
  }
  return store.billingData.global || null
})

const headerData = computed(() => activeBilling.value?.header || {})
const rincian = computed(() => activeBilling.value?.rincian || {})
const pembayaran = computed(() => activeBilling.value?.pembayaran || null)

const printObj = {
  id: 'print-billing-ranap',
  popTitle: 'Faktur Rekap Billing Pasien Ranap'
}

/**
 * Fungsi pembantu yang identik dengan fungsi rp() di legacy PHP:
 * Jika nilai 0 atau kosong, return string kosong agar baris tidak berbiaya tetap bersih
 */
function rp(value) {
  if (!value || Number(value) === 0) {
    return ''
  }
  return formatRp(value)
}

function formatTanggalSekarang() {
  return date.formatDate(new Date(), 'DD/MM/YYYY HH:mm:ss')
}

function onImgError(e) {
  e.target.style.display = 'none'
}

function loadData() {
  if (props.pasien?.noreg) {
    store.getRekapBilling(props.pasien)
  }
}

watch(() => props.pasien?.noreg, (newVal) => {
  if (newVal) {
    selectedRuangan.value = 'ALL'
    selectedSistemBayar.value = 'ALL'
    loadData()
  }
}, { immediate: true })

onMounted(() => {
  if (props.pasien?.noreg && !store.billingData) {
    loadData()
  }
})
</script>

<style lang="scss" scoped>
.document-card {
  width: 210mm;
  min-height: 297mm;
  padding: 8mm;
  margin: 0 auto;
  border-radius: 2px;
  box-sizing: border-box;
}

.font-billing {
  font-family: 'Tahoma', 'Segoe UI', Arial, sans-serif;
  font-size: 11px;
  color: #000;
  line-height: 1.35;
}

.logo-kop {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.border-kop {
  border-bottom: 2px solid #999;
}

.border-top-double {
  border-top: 3px double #006699;
}

.badge-faktur {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 3px 5px;
  font-size: 11px;
  background: #fff;
}

.table-identitas {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  line-height: 1.35;

  td {
    padding: 1px 2px;
    vertical-align: top;
  }

  .label-col {
    white-space: nowrap;
    width: 1%;
    padding-right: 10px;
  }

  .sep-col {
    width: 10px;
    text-align: center;
    padding-right: 6px;
  }

  .val-col {
    width: 45%;
  }
}

.table-billing {
  border-collapse: collapse;
  font-size: 11px;
  line-height: 1.35;

  tr {
    vertical-align: top;
  }

  td {
    padding: 1px 2px;
  }

  .col-no {
    width: 25px;
    text-align: left;
  }

  .col-desc {
    text-align: left;
  }

  .col-curr {
    width: 35px;
    text-align: left;
  }

  .col-val {
    width: 120px;
    text-align: right;
    border-bottom: 1px dotted #006699;
    white-space: nowrap;
  }

  .col-subtotal-kamar {
    border-bottom: 1px dotted #006699;
  }

  .row-grand-total td {
    padding-top: 6px;
    padding-bottom: 6px;
    border-top: 3px double #006699;
    border-bottom: 1px dotted #006699;
  }

  .font-large {
    font-size: 12px;
  }
}

.sub-table-kamar {
  border-collapse: collapse;
  font-size: 11px;
  td {
    padding: 0 2px;
  }
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }

  .no-print {
    display: none !important;
  }

  .print-page {
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 8mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
</style>
