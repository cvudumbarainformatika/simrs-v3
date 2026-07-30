<template>
  <div class="row fit relative-position bg-grey-1">
    <div class="absolute-top column fit q-pa-xs">
      <!-- Tabs header -->
      <div class="col-auto">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          inline-label
          narrow-indicator
          indicator-color="transparent"
          align="left"
          class="bg-transparent text-grey-8"
          active-color="white"
          active-bg-color="dark"
        >
          <q-tab
            v-for="tab in store.tipes"
            :key="tab.value"
            :ripple="true"
            :name="tab.value"
            content-class="tab-classes"
          >
            <template #default>
              <div class="row q-gutter-x-xs items-center q-px-sm" style="border-radius: 10px;">
                <q-icon :name="getTabIcon(tab.value)" size="18px" />
                <div><strong>{{ tab.label }}</strong></div>
              </div>
            </template>
          </q-tab>
        </q-tabs>
      </div>

      <!-- Main Content Splitter -->
      <div class="col full-height q-mt-xs">
        <q-splitter
          v-model="splitterModel"
          :limits="[30, 70]"
          class="fit"
          before-class="overflow-hidden"
          after-class="overflow-hidden"
        >
          <!-- Left: Input Form -->
          <template #before>
            <div class="column full-height bg-white border-right">
              <div class="col-auto bg-dark text-white q-pa-md">
                <div class="text-subtitle1 text-bold">
                  {{ getTabTitle(activeTab) }}
                </div>
                <div class="text-grey-4 text-caption">Form entri data rekonsiliasi obat pasien</div>
              </div>

              <!-- SCROLLAREA FOR FORMS -->
              <div class="col full-height scroll q-pa-md">
                <!-- FORM PERSETUJUAN SENTRALISASI -->
                <template v-if="activeTab === 'persetujuan'">
                  <q-form @submit="onSavePersetujuan" class="q-gutter-y-md">
                    <div class="text-subtitle2 text-weight-bold text-primary">
                      Form Persetujuan Sentralisasi Obat
                    </div>
                    <q-separator />

                    <div class="text-caption text-grey-7">
                      Pernyataan persetujuan tindakan sentralisasi obat yang dibawa sendiri dari rumah dan disimpan di ruang perawat.
                    </div>

                    <div class="row q-col-gutter-sm">
                      <div class="col-6">
                        <span class="text-subtitle2 text-grey-8">Nama Penanggung Jawab *</span>
                        <q-input
                          v-model="store.formPersetujuan.pernyataan_nama"
                          dense
                          outlined
                          placeholder="Nama penanggung jawab..."
                          :rules="[val => !!val || 'Nama penanggung jawab harus diisi']"
                          hide-bottom-space
                          class="q-mt-xs"
                        />
                      </div>
                      <div class="col-6">
                        <span class="text-subtitle2 text-grey-8">Tanggal Lahir *</span>
                        <app-input-date
                          :model="store.formPersetujuan.pernyataan_tgl_lahir"
                          label="Pilih tanggal lahir"
                          outlined
                          valid
                          @set-model="val => store.formPersetujuan.pernyataan_tgl_lahir = val"
                          class="q-mt-xs"
                        />
                      </div>
                    </div>

                    <div class="row q-col-gutter-sm">
                      <div class="col-6">
                        <span class="text-subtitle2 text-grey-8">Hubungan Dengan Pasien *</span>
                        <q-select
                          v-model="store.formPersetujuan.pernyataan_hubungan"
                          dense
                          outlined
                          :options="['Diri sendiri', 'Suami', 'Istri', 'Anak', 'Orang tua', 'Keluarga lainnya']"
                          class="q-mt-xs"
                        />
                      </div>
                      <div class="col-6">
                        <span class="text-subtitle2 text-grey-8">Alamat Penanggung Jawab *</span>
                        <q-input
                          v-model="store.formPersetujuan.pernyataan_alamat"
                          dense
                          outlined
                          placeholder="Alamat penanggung jawab..."
                          :rules="[val => !!val || 'Alamat harus diisi']"
                          hide-bottom-space
                          class="q-mt-xs"
                        />
                      </div>
                    </div>

                    <q-separator class="q-my-md" />
                    <div class="text-subtitle2 text-weight-bold text-grey-9">Gambarkan Tanda Tangan</div>
                    <q-separator />

                    <div class="row q-col-gutter-sm q-mt-xs">
                      <div class="col-12 col-md-4">
                        <span class="text-caption text-grey-7 block text-center text-bold q-mb-xs">1. Yang Menyatakan</span>
                        <app-signature
                          :ttd="store.formPersetujuan.ttd_yang_menyatakan"
                          @save-ttd="(val) => store.formPersetujuan.ttd_yang_menyatakan = val"
                          :pasien="pasien"
                          uuid="yang_menyatakan"
                          label-ttd="TTD Yang Menyatakan"
                          :width="150"
                          :height="110"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <span class="text-caption text-grey-7 block text-center text-bold q-mb-xs">2. Saksi I (Petugas)</span>
                        <app-signature
                          :ttd="store.formPersetujuan.ttd_saksi"
                          @save-ttd="(val) => store.formPersetujuan.ttd_saksi = val"
                          :pasien="pasien"
                          uuid="saksi_petugas"
                          label-ttd="TTD Saksi I"
                          :width="150"
                          :height="110"
                        />
                      </div>
                      <div class="col-12 col-md-4">
                        <span class="text-caption text-grey-7 block text-center text-bold q-mb-xs">3. Saksi II (Keluarga)</span>
                        <app-signature
                          :ttd="store.formPersetujuan.ttd_saksi_2"
                          @save-ttd="(val) => store.formPersetujuan.ttd_saksi_2 = val"
                          :pasien="pasien"
                          uuid="saksi_2"
                          label-ttd="TTD Saksi II"
                          :width="150"
                          :height="110"
                        />
                      </div>
                    </div>

                    <div class="row justify-end q-mt-lg">
                      <q-btn
                        type="submit"
                        color="indigo-8"
                        icon="done_all"
                        label="Simpan Persetujuan & Ttd"
                        :loading="store.loadingPersetujuan"
                        :disable="store.loadingPersetujuan"
                        class="q-px-md"
                      />
                    </div>
                  </q-form>
                </template>

                <!-- FORM DAFTAR OBAT (mrs, pindah, krs) -->
                <template v-else>
                  <q-form @submit="onSubmit" class="q-gutter-y-md">
                    <!-- Common: Nama Obat -->
                    <div>
                      <span class="text-subtitle2 text-grey-8">Nama Obat / Alat Kesehatan *</span>
                      <q-input
                        v-model="store.form.nama_obat"
                        dense
                        outlined
                        placeholder="Masukkan nama obat..."
                        :rules="[val => !!val || 'Nama obat harus diisi']"
                        hide-bottom-space
                        class="q-mt-xs"
                      />
                    </div>

                    <!-- Common: Dosis -->
                    <div>
                      <span class="text-subtitle2 text-grey-8">Dosis / Kekuatan *</span>
                      <q-input
                        v-model="store.form.dosis"
                        dense
                        outlined
                        placeholder="Contoh: 500mg, 1 tablet..."
                        :rules="[val => !!val || 'Dosis harus diisi']"
                        hide-bottom-space
                        class="q-mt-xs"
                      />
                    </div>

                    <!-- Tipe MRS specific fields -->
                    <template v-if="activeTab === 'mrs'">
                      <div>
                        <span class="text-subtitle2 text-grey-8">Lama Pemakaian *</span>
                        <q-input
                          v-model="store.form.lama_pakai"
                          dense
                          outlined
                          placeholder="Contoh: 3 hari, 1 bulan..."
                          :rules="[val => !!val || 'Lama pemakaian harus diisi']"
                          hide-bottom-space
                          class="q-mt-xs"
                        />
                      </div>

                      <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-4">
                          <span class="text-subtitle2 text-grey-8 block">Dibawa saat MRS?</span>
                          <q-btn-toggle
                            v-model="store.form.dibawa_saat_mrs"
                            spread
                            no-caps
                            dense
                            toggle-color="primary"
                            color="white"
                            text-color="black"
                            :options="[{label: 'Ya', value: 'Ya'}, {label: 'Tidak', value: 'Tidak'}]"
                            class="q-mt-xs border"
                          />
                        </div>
                        <div class="col-12 col-md-4">
                          <span class="text-subtitle2 text-grey-8 block">Berlanjut Ranap?</span>
                          <q-btn-toggle
                            v-model="store.form.berlanjut_ke_ranap"
                            spread
                            no-caps
                            dense
                            toggle-color="primary"
                            color="white"
                            text-color="black"
                            :options="[{label: 'Ya', value: 'Ya'}, {label: 'Tidak', value: 'Tidak'}]"
                            class="q-mt-xs border"
                          />
                        </div>
                        <div class="col-12 col-md-4">
                          <span class="text-subtitle2 text-grey-8 block">Berlanjut KRS?</span>
                          <q-btn-toggle
                            v-model="store.form.berlanjut_saat_krs"
                            spread
                            no-caps
                            dense
                            toggle-color="primary"
                            color="white"
                            text-color="black"
                            :options="[{label: 'Ya', value: 'Ya'}, {label: 'Tidak', value: 'Tidak'}]"
                            class="q-mt-xs border"
                          />
                        </div>
                      </div>
                    </template>

                    <!-- Tipe PINDAH RUANGAN specific fields -->
                    <template v-else-if="activeTab === 'pindah'">
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <span class="text-subtitle2 text-grey-8">Frekuensi *</span>
                          <q-input
                            v-model="store.form.frekuensi"
                            dense
                            outlined
                            placeholder="Contoh: 3x1, 1x1..."
                            :rules="[val => !!val || 'Frekuensi harus diisi']"
                            hide-bottom-space
                            class="q-mt-xs"
                          />
                        </div>
                        <div class="col-6">
                          <span class="text-subtitle2 text-grey-8">Cara Pemberian *</span>
                          <q-input
                            v-model="store.form.cara_pemberian"
                            dense
                            outlined
                            placeholder="Contoh: Oral, IV, IM..."
                            :rules="[val => !!val || 'Cara pemberian harus diisi']"
                            hide-bottom-space
                            class="q-mt-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <span class="text-subtitle2 text-grey-8">Waktu Pemberian Terakhir *</span>
                        <q-input
                          v-model="store.form.waktu_pemberian_terakhir"
                          dense
                          outlined
                          placeholder="Contoh: Tadi pagi jam 08:00..."
                          :rules="[val => !!val || 'Waktu pemberian terakhir harus diisi']"
                          hide-bottom-space
                          class="q-mt-xs"
                        />
                      </div>

                      <div>
                        <span class="text-subtitle2 text-grey-8 block">Tindak Lanjut Dokter *</span>
                        <q-select
                          v-model="store.form.tindak_lanjut"
                          dense
                          outlined
                          :options="store.tindakLanjuts"
                          class="q-mt-xs"
                        />
                      </div>

                      <div v-if="store.form.tindak_lanjut === 'Lanjut aturan pakai berubah'">
                        <span class="text-subtitle2 text-grey-8">Perubahan Aturan Pakai *</span>
                        <q-input
                          v-model="store.form.perubahan_aturan_pakai"
                          dense
                          outlined
                          placeholder="Sebutkan aturan pakai yang baru..."
                          :rules="[val => !!val || 'Perubahan aturan pakai harus diisi']"
                          hide-bottom-space
                          class="q-mt-xs"
                        />
                      </div>
                    </template>

                    <!-- Tipe KRS/PULANG specific fields -->
                    <template v-else-if="activeTab === 'krs'">
                      <div>
                        <span class="text-subtitle2 text-grey-8">Aturan Pakai *</span>
                        <q-input
                          v-model="store.form.aturan_pakai"
                          dense
                          outlined
                          placeholder="Contoh: 3x1 sesudah makan..."
                          :rules="[val => !!val || 'Aturan pakai harus diisi']"
                          hide-bottom-space
                          class="q-mt-xs"
                        />
                      </div>

                      <div>
                        <span class="text-subtitle2 text-grey-8 block">Tindak Lanjut Rekonsiliasi *</span>
                        <q-select
                          v-model="store.form.rekonsiliasi"
                          dense
                          outlined
                          :options="store.rekonsiliasis"
                          class="q-mt-xs"
                        />
                      </div>

                      <div v-if="store.form.rekonsiliasi === 'Lanjut aturan pakai berubah'">
                        <span class="text-subtitle2 text-grey-8">Aturan Pakai Saat Pulang *</span>
                        <q-input
                          v-model="store.form.aturan_pakai_saat_pulang"
                          dense
                          outlined
                          placeholder="Sebutkan aturan pakai saat pulang..."
                          :rules="[val => !!val || 'Aturan pakai pulang harus diisi']"
                          hide-bottom-space
                          class="q-mt-xs"
                        />
                      </div>
                    </template>

                    <div class="row justify-end q-mt-md">
                      <q-btn
                        type="submit"
                        color="primary"
                        icon="save"
                        label="Simpan Obat"
                        :loading="store.loadingOrder"
                        :disable="store.loadingOrder"
                        class="q-px-md"
                      />
                    </div>
                  </q-form>
                </template>
              </div>
            </div>
          </template>

          <!-- Right: Riwayat / Preview -->
          <template #after>
            <!-- PREVIEW TABS / RIWAYAT TABS -->
            <div class="column full-height bg-grey-2">
              <div class="col-auto bg-dark text-white q-pa-md row items-center justify-between">
                <div>
                  <div class="text-subtitle2 text-bold">Riwayat & Hasil inputan</div>
                  <div class="text-grey-4 text-caption">Detail dokumen hasil perekaman data</div>
                </div>
              </div>

              <!-- RIGHT PANEL SCROLL CONTENT -->
              <div class="col full-height scroll q-pa-md">
                
                <!-- IF PERSATUJUAN TAB ACTIVE (Show Structured Form Preview) -->
                <template v-if="activeTab === 'persetujuan'">
                  <div v-if="!pasien?.rekonsiliasi_obat_persetujuan" class="column full-height flex-center text-grey-6 q-pa-xl">
                    <q-icon name="assignment_turned_in" size="64px" />
                    <div class="text-subtitle1 q-mt-sm">Belum Ada Dokumen Persetujuan</div>
                    <div class="text-caption text-center">Gunakan form di sebelah kiri untuk merekam persetujuan dan tanda tangan</div>
                  </div>

                  <q-card v-else flat bordered class="bg-white shadow-3" style="border-radius: 12px; border-left: 6px solid #3f51b5;">
                    <q-card-section class="q-pa-md">
                      <div class="row justify-between items-center q-mb-md">
                        <div class="text-subtitle1 text-bold text-indigo-9">
                          Dokumen Persetujuan Sentralisasi
                        </div>
                        <q-badge color="indigo-8">Aktif / Tersimpan</q-badge>
                      </div>
                      <q-separator class="q-mb-md" />

                      <!-- Penanggung Jawab -->
                      <div class="q-mb-md">
                        <div class="text-weight-bold text-grey-9 text-caption">Identitas Yang Menyatakan:</div>
                        <div class="q-pl-sm q-mt-xs text-caption text-grey-8">
                          <div>Nama: <span class="text-bold text-black">{{ pasien.rekonsiliasi_obat_persetujuan.pernyataan_nama }}</span></div>
                          <div>Tanggal Lahir: <span>{{ pasien.rekonsiliasi_obat_persetujuan.pernyataan_tgl_lahir }}</span></div>
                          <div>Hubungan: <span class="text-indigo-8 text-bold">{{ pasien.rekonsiliasi_obat_persetujuan.pernyataan_hubungan }}</span></div>
                          <div>Alamat: <span>{{ pasien.rekonsiliasi_obat_persetujuan.pernyataan_alamat }}</span></div>
                        </div>
                      </div>

                      <!-- Pasien -->
                      <div class="q-mb-md">
                        <div class="text-weight-bold text-grey-9 text-caption">Identitas Pasien:</div>
                        <div class="q-pl-sm q-mt-xs text-caption text-grey-8">
                          <div>Nama Pasien: <span>{{ pasien.rekonsiliasi_obat_persetujuan.pasien_nama }}</span></div>
                          <div>No. RM: <span>{{ pasien.rekonsiliasi_obat_persetujuan.pasien_norm }}</span></div>
                          <div>Alamat: <span>{{ pasien.rekonsiliasi_obat_persetujuan.pasien_alamat }}</span></div>
                        </div>
                      </div>

                      <q-separator class="q-my-md" />
                      <div class="text-weight-bold text-grey-9 text-caption q-mb-sm text-center">Tanda Tangan Terlampir</div>

                      <!-- Display Signatures -->
                      <div class="row q-col-gutter-xs text-center">
                        <div class="col-4 border-right">
                          <div class="f-10 text-grey-6 text-bold">Yang Menyatakan</div>
                          <div class="q-pa-xs bg-grey-1 rounded-borders flex flex-center q-mt-xs" style="min-height: 80px;">
                            <img
                              v-if="pasien.rekonsiliasi_obat_persetujuan.ttd_yang_menyatakan"
                              :src="getImageUrl(pasien.rekonsiliasi_obat_persetujuan.ttd_yang_menyatakan)"
                              style="max-width: 100%; max-height: 70px; object-fit: contain;"
                            />
                            <span v-else class="text-grey-4 f-10">Kosong</span>
                          </div>
                        </div>
                        <div class="col-4 border-right">
                          <div class="f-10 text-grey-6 text-bold">Saksi I (Petugas)</div>
                          <div class="q-pa-xs bg-grey-1 rounded-borders flex flex-center q-mt-xs" style="min-height: 80px;">
                            <img
                              v-if="pasien.rekonsiliasi_obat_persetujuan.ttd_saksi"
                              :src="getImageUrl(pasien.rekonsiliasi_obat_persetujuan.ttd_saksi)"
                              style="max-width: 100%; max-height: 70px; object-fit: contain;"
                            />
                            <span v-else class="text-grey-4 f-10">Kosong</span>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="f-10 text-grey-6 text-bold">Saksi II (Keluarga)</div>
                          <div class="q-pa-xs bg-grey-1 rounded-borders flex flex-center q-mt-xs" style="min-height: 80px;">
                            <img
                              v-if="pasien.rekonsiliasi_obat_persetujuan.ttd_saksi_2"
                              :src="getImageUrl(pasien.rekonsiliasi_obat_persetujuan.ttd_saksi_2)"
                              style="max-width: 100%; max-height: 70px; object-fit: contain;"
                            />
                            <span v-else class="text-grey-4 f-10">Kosong</span>
                          </div>
                        </div>
                      </div>

                      <q-separator class="q-my-md" />
                      
                      <div class="row justify-between items-center f-10 text-grey-6">
                        <div>Petugas Saksi: <span class="text-bold">{{ pasien.rekonsiliasi_obat_persetujuan.user_petugas?.nama || 'Petugas' }}</span> (<span class="text-indigo-8">{{ pasien.rekonsiliasi_obat_persetujuan.nama_ruangan }}</span>)</div>
                        <div>{{ formatDateTime(pasien.rekonsiliasi_obat_persetujuan.created_at) }}</div>
                      </div>
                    </q-card-section>
                  </q-card>
                </template>

                <!-- IF OTHER DRUG TABS ACTIVE (Show lists of drugs) -->
                <template v-else>
                  <div v-if="!filteredItems.length" class="column full-height flex-center text-grey-6 q-pa-xl">
                    <q-icon name="library_books" size="64px" />
                    <div class="text-subtitle1 q-mt-sm">Belum Ada Data Obat</div>
                    <div class="text-caption">Gunakan form di sebelah kiri untuk menginput data</div>
                  </div>

                  <div v-else class="q-gutter-y-sm">
                    <q-card
                      v-for="item in filteredItems"
                      :key="item.id"
                      flat
                      bordered
                      class="bg-white shadow-1 cursor-pointer"
                      style="border-radius: 8px; border-left: 5px solid #2e7d32;"
                    >
                      <q-card-section class="q-pa-md">
                        <div class="row justify-between items-start">
                          <div>
                            <div class="text-subtitle1 text-bold text-primary">
                              {{ item.nama_obat }}
                            </div>
                            <div class="text-subtitle2 text-grey-8">
                              Dosis: <span class="text-weight-medium">{{ item.dosis }}</span>
                            </div>
                          </div>
                          <q-btn
                            flat
                            dense
                            round
                            color="negative"
                            icon="delete"
                            size="sm"
                            :loading="store.loadingHapus"
                            @click.stop="confirmDelete(item)"
                          >
                            <q-tooltip class="bg-red text-white">Hapus Data</q-tooltip>
                          </q-btn>
                        </div>

                        <q-separator class="q-my-sm" />

                        <!-- Tipe MRS fields -->
                        <div v-if="item.tipe === 'mrs'" class="row q-col-gutter-xs f-12 text-grey-8">
                          <div class="col-6">Lama Pakai: <span class="text-bold">{{ item.lama_pakai }}</span></div>
                          <div class="col-6">Dibawa MRS: <span class="text-bold">{{ item.dibawa_saat_mrs }}</span></div>
                          <div class="col-6">Lanjut Ranap: <span class="text-bold">{{ item.berlanjut_ke_ranap }}</span></div>
                          <div class="col-6">Lanjut KRS: <span class="text-bold">{{ item.berlanjut_saat_krs }}</span></div>
                        </div>

                        <!-- Tipe PINDAH fields -->
                        <div v-else-if="item.tipe === 'pindah'" class="row q-col-gutter-xs f-12 text-grey-8">
                          <div class="col-6">Frekuensi: <span class="text-bold">{{ item.frekuensi }}</span></div>
                          <div class="col-6">Cara Pemberian: <span class="text-bold">{{ item.cara_pemberian }}</span></div>
                          <div class="col-12">Waktu Terakhir: <span class="text-bold">{{ item.waktu_pemberian_terakhir }}</span></div>
                          <div class="col-12">Tindak Lanjut: <span class="text-bold text-indigo">{{ item.tindak_lanjut }}</span></div>
                          <div v-if="item.perubahan_aturan_pakai" class="col-12 text-italic text-amber-9">
                            Ubah ke: {{ item.perubahan_aturan_pakai }}
                          </div>
                        </div>

                        <!-- Tipe KRS fields -->
                        <div v-else-if="item.tipe === 'krs'" class="row q-col-gutter-xs f-12 text-grey-8">
                          <div class="col-12">Aturan Pakai: <span class="text-bold">{{ item.aturan_pakai }}</span></div>
                          <div class="col-12">Tindak Lanjut: <span class="text-bold text-indigo">{{ item.rekonsiliasi }}</span></div>
                          <div v-if="item.aturan_pakai_saat_pulang" class="col-12 text-italic text-amber-9">
                            Pulang: {{ item.aturan_pakai_saat_pulang }}
                          </div>
                        </div>

                        <q-separator class="q-my-sm" />

                        <div class="row justify-between items-center f-10 text-grey-6">
                          <div>Oleh: <span class="text-bold">{{ item?.user_petugas?.nama || 'Petugas' }}</span> (<span class="text-indigo-8">{{ item.nama_ruangan }}</span>)</div>
                          <div>{{ formatDateTime(item.created_at) }}</div>
                        </div>
                      </q-card-section>
                    </q-card>
                    <div style="height: 80px;" />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </q-splitter>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { pathImg } from 'src/boot/axios'
import { useRekonsiliasiObatStore } from 'src/stores/simrs/ranap/rekonsiliasiobat'

const props = defineProps({
  pasien: {
    type: Object,
    default: () => null
  },
  nakes: {
    type: String,
    default: null
  }
})

const store = useRekonsiliasiObatStore()
const $q = useQuasar()

const activeTab = ref('mrs')
const splitterModel = ref(50)

// Initialize persetujuan form data
onMounted(() => {
  store.initFormPersetujuan(props?.pasien)
})

// Watch patient changes to refresh signature and statement forms
watch(() => props.pasien, (newPasien) => {
  store.initFormPersetujuan(newPasien)
}, { immediate: true })

// Watch tab change to update store state and reset drug form
watch(activeTab, (val) => {
  if (val !== 'persetujuan') {
    store.form.tipe = val
    store.initReset()
  }
}, { immediate: true })

const filteredItems = computed(() => {
  const all = props?.pasien?.rekonsiliasiobats || []
  return all.filter(x => x.tipe === activeTab.value)
})

const getTabIcon = (tipe) => {
  switch (tipe) {
    case 'mrs': return 'login'
    case 'persetujuan': return 'history_edu'
    case 'pindah': return 'transform'
    case 'krs': return 'logout'
    default: return 'help'
  }
}

const getTabTitle = (tipe) => {
  switch (tipe) {
    case 'mrs': return 'Penggunaan Obat Sebelum MRS'
    case 'persetujuan': return 'Lembar Persetujuan Sentralisasi Obat'
    case 'pindah': return 'Rekonsiliasi Saat Pindah Ruangan'
    case 'krs': return 'Rekonsiliasi Saat Pulang (Discharge)'
    default: return ''
  }
}

const getImageUrl = (img) => {
  if (!img) return ''
  if (img.startsWith('data:image')) {
    return img
  }
  return pathImg + img
}

const formatDateTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

const onSubmit = () => {
  store.simpandata(props?.pasien)
}

const onSavePersetujuan = () => {
  // Check if signatures exist
  if (!store.formPersetujuan.ttd_yang_menyatakan) {
    $q.notify({
      type: 'negative',
      message: 'Tanda tangan Yang Menyatakan wajib diisi!',
      position: 'top'
    })
    return
  }
  
  store.simpanpersetujuan(props?.pasien)
}

const confirmDelete = (item) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: `Apakah Anda yakin ingin menghapus data obat "${item.nama_obat}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.hapusdata(props?.pasien, item.id)
  })
}
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid #ccc;
  border-radius: 4px;
}
.border-right {
  border-right: 1px solid #ddd;
}
.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
