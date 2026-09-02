<template>
  <q-scroll-area class="fit bg-grey-2">
    <div class="q-pa-md">
      <q-card flat bordered class="claim-card">
        <q-card-section class="q-pa-none">
          <q-card-section class="q-pa-none">
          <div class="section-title">
            Data Perawatan
          </div>

          <div class="top-grid q-pa-md">
            <div>
              <div class="field-label">Jaminan / Cara Bayar</div>
              <q-select v-model="store.formpasien.jaminan" :options="jaminanOptions" dense outlined emit-value
                map-options :disable="sudahGrouping" />
            </div>
            <div>
              <div class="field-label">No. Peserta</div>
              <q-input v-model="store.formpasien.noPeserta" dense outlined readonly class="readonly-field" />
            </div>
            <div>
              <div class="field-label">No. SEP</div>
              <q-input v-model="store.formpasien.noSep" dense outlined readonly class="readonly-field" />
            </div>
            <div>
              <div class="field-label">COB</div>
              <q-select v-model="store.formpasien.cob" :options="cobOptions" dense outlined emit-value map-options
                :disable="sudahGrouping" />
            </div>
          </div>

          <div class="detail-table">
            <div class="detail-row">
              <div class="detail-label">Jenis Rawat</div>
              <div class="detail-value wide-value rawat-controls">
                <q-option-group v-model="store.formpasien.jenisRawat" :options="jenisRawatOptions" type="radio" inline
                  dense :disable="sudahGrouping" @update:model-value="gantiJenisRawat" />
                <template v-if="store.formpasien.jenisRawat === '2'">
                  <q-icon name="icon-mat-help_outline" color="primary" size="18px" />
                  <q-checkbox v-model="store.formpasien.kelasEksekutif" dense label="Kelas Eksekutif" :disable="sudahGrouping" />
                </template>
                <template v-else>
                  <q-icon name="icon-mat-help_outline" color="primary" size="18px" />
                  <q-checkbox v-model="store.formpasien.naikTurunKelas" dense label="Naik/Turun Kelas" :disable="sudahGrouping" />
                  <q-icon name="icon-mat-help_outline" color="primary" size="18px" />
                  <q-checkbox v-model="store.formpasien.adaRawatIntensif" dense label="Ada Rawat Intensif" :disable="sudahGrouping" />
                </template>
              </div>
              <div class="detail-label right-label">Kelas Hak</div>
              <div class="detail-value">
                <q-option-group v-if="store.formpasien.jenisRawat === '1'" v-model="store.formpasien.kelasRawat"
                  :options="kelasHakOptions" type="radio" inline dense :disable="sudahGrouping" />
                <span v-else>-</span>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Tanggal Rawat</div>
              <div class="detail-value wide-value treatment-dates">
                <div>Masuk : <strong>{{ tanggalMasuk }}</strong></div>
                <div>Pulang : <strong>{{ tanggalPulang }}</strong></div>
              </div>
              <div class="detail-label right-label">Umur</div>
              <div class="detail-value">{{ umurPasien }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Cara Masuk</div>
              <div class="detail-value wide-value">
                <q-select v-model="store.formpasien.caraMasuk" :options="store.caraMasukOptions" dense outlined
                  emit-value map-options :loading="store.loadingCaraMasuk" class="medium-control"
                  :disable="sudahGrouping" @popup-show="loadCaraMasuk" />
              </div>
              <div class="detail-label right-label empty-cell" />
              <div class="detail-value empty-cell" />
            </div>

            <div class="detail-row">
              <div class="detail-label">LOS</div>
              <div class="detail-value wide-value treatment-dates">
                <span><strong>{{ losHari }}</strong> hari</span>
                <span>( <strong>{{ losJam }}</strong> jam )</span>
              </div>
              <div class="detail-label right-label">Berat Lahir (gram)</div>
              <div class="detail-value">
                <q-input v-model.number="store.formpasien.beratLahir" type="number" min="0" dense outlined
                  class="short-control" :readonly="sudahGrouping" />
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-label">ADL Score</div>
              <div class="detail-value wide-value treatment-dates">
                <span>Sub Acute : <strong>{{ store.formpasien.adlSubAcute || '-' }}</strong></span>
                <span>Chronic : <strong>{{ store.formpasien.adlChronic || '-' }}</strong></span>
              </div>
              <div class="detail-label right-label">Cara Pulang</div>
              <div class="detail-value">
                <q-select v-model="store.formpasien.caraPulang" :options="caraPulangOptions" dense outlined emit-value
                  map-options :disable="sudahGrouping" />
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-label">DPJP</div>
              <div class="detail-value wide-value">
                <q-select v-model="store.formpasien.dpjp" :options="dpjpOptions" dense outlined emit-value map-options
                  class="dpjp-control" :disable="sudahGrouping" />
              </div>
              <div class="detail-label right-label">Jenis Tarif</div>
              <div class="detail-value">
                <q-select v-model="store.formpasien.jenisTarif" :options="jenisTarifOptions" dense outlined emit-value
                  map-options :disable="sudahGrouping" />
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Pasien TB</div>
              <div class="detail-value wide-value tb-field">
                <q-checkbox v-model="store.formpasien.pasienTb" dense label="Ya" :disable="sudahGrouping" />
                <template v-if="store.formpasien.pasienTb">
                  <q-input v-model.trim="store.formpasien.nomorRegisterSitb" dense outlined label="Nomor Register SITB"
                    class="sitb-control" :readonly="sudahGrouping" />
                  <q-btn label="Validasi" color="primary" dense no-caps unelevated
                    :disable="sudahGrouping || !store.formpasien.nomorRegisterSitb" />
                </template>
              </div>
              <div class="detail-label right-label empty-cell" />
              <div class="detail-value empty-cell" />
            </div>
          </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none">
          <div class="tariff-heading">
            <q-icon name="icon-mat-help_outline" color="primary" size="18px" />
            <span>Tarif Rumah Sakit : Rp</span>
            <strong>{{ formatNumber(totalTarif) }}</strong>
          </div>

          <div class="tariff-grid">
            <div v-for="item in tariffItems" :key="item.key" class="tariff-item">
              <div class="tariff-label">
                <q-icon name="icon-mat-help_outline" color="primary" size="17px">
                  <q-tooltip>{{ item.hint }}</q-tooltip>
                </q-icon>
                <span>{{ item.label }}</span>
              </div>
              <q-input v-model.number="store.formpasien.tarif[item.key]" type="number" min="0" dense outlined
                input-class="text-right" class="tariff-input" :readonly="sudahGrouping" />
            </div>
          </div>

          <div class="declaration-row">
            <q-checkbox v-model="store.formpasien.pernyataan" dense :disable="sudahGrouping" />
            <span>Menyatakan benar bahwa data tarif yang tersebut di atas adalah benar sesuai dengan kondisi yang
              sesungguhnya.</span>
          </div>

          <div class="clinical-section">
            <div class="clinical-title">
              Data Klinis
            </div>
            <div class="blood-pressure-field">
              <div class="clinical-label">
                Tekanan Darah (mmHg):
              </div>
              <div class="blood-pressure-inputs">
                <div class="blood-pressure-control">
                  <q-input v-model.number="store.formpasien.sistole" type="number" min="0" dense outlined
                    input-class="text-center" class="clinical-input" :readonly="sudahGrouping" />
                  <div class="blood-pressure-caption">
                    Sistole
                  </div>
                </div>
                <div class="blood-pressure-control">
                  <q-input v-model.number="store.formpasien.diastole" type="number" min="0" dense outlined
                    input-class="text-center" class="clinical-input" :readonly="sudahGrouping" />
                  <div class="blood-pressure-caption">
                    Diastole
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
          <fieldset v-if="tampilkanIdrg" class="idrg-section">
            <legend>iDRG</legend>

            <div class="idrg-entry-section">
              <div class="idrg-entry-header">
                <div><strong>Diagnosa</strong> <span>(ICD-10):</span></div>
                <div class="idrg-search-actions">
                  <q-select v-model="store.formpasien.pencarianDiagnosa" :options="store.diagnosaIdrgOptions"
                    :loading="store.loadingDiagnosaIdrg" use-input hide-selected fill-input input-debounce="400" dense
                    outlined clearable placeholder="Cari Diagnosa" class="idrg-search" @filter="filterDiagnosa"
                    @update:model-value="tambahDiagnosa">
                    <template #prepend>
                      <q-icon name="icon-mat-search" size="16px" />
                    </template>
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Ketik minimal 2 karakter
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-btn flat round dense icon="icon-mat-sync" color="primary"
                    :loading="store.loadingGetDiagnosaIdrg" @click="ambilDiagnosaEklaim">
                    <q-tooltip>Ambil diagnosa dari E-Klaim</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div v-if="store.formpasien.diagnosaIdrg.length" class="idrg-entry-list">
                <div v-for="(diagnosa, index) in store.formpasien.diagnosaIdrg" :key="diagnosa.kode || index"
                  class="idrg-entry-row" :class="{ 'is-primary': index === 0 }"
                  @click="bukaEditorDiagnosa(diagnosa)">
                  <q-icon name="icon-mat-drag_indicator" color="grey-6" />
                  <span class="idrg-entry-name">{{ diagnosa.nama }}</span>
                  <span class="idrg-code">{{ diagnosa.kode }}</span>
                  <span class="idrg-level">{{ index === 0 ? 'Primary' : 'Secondary' }}</span>
                  <div v-if="editingDiagnosaCode === diagnosa.kode" class="idrg-primary-editor"
                    @click.stop>
                    <q-select v-model="store.formpasien.pencarianDiagnosa"
                      :options="store.diagnosaIdrgOptions" :loading="store.loadingDiagnosaIdrg"
                      use-input hide-selected fill-input input-debounce="400" dense outlined autofocus
                      placeholder="Cari Diagnosa" class="idrg-search idrg-inline-search" @filter="filterDiagnosa"
                      @update:model-value="gantiDiagnosa(diagnosa, $event)">
                      <template #prepend>
                        <q-icon name="icon-mat-search" size="16px" />
                      </template>
                    </q-select>
                    <q-btn label="Delete" color="grey-7" dense no-caps unelevated
                      @click.stop="hapusDiagnosa(diagnosa)" />
                  </div>
                </div>
              </div>
              <div v-else class="idrg-empty">
                Belum ada diagnosa
              </div>
            </div>

            <div class="idrg-entry-section procedure-section">
              <div class="idrg-entry-header">
                <div><strong>Prosedur</strong> <span>(ICD-9-CM):</span></div>
                <q-select v-model="store.formpasien.pencarianProsedur" :options="store.prosedurIdrgOptions"
                  use-input hide-selected fill-input input-debounce="400" dense outlined clearable
                  placeholder="Cari Prosedur" class="idrg-search" @filter="filterProsedur"
                  @update:model-value="tambahProsedur">
                  <template #prepend>
                    <q-icon name="icon-mat-search" size="16px" />
                  </template>
                </q-select>
              </div>
              <div v-if="store.formpasien.prosedurIdrg.length" class="idrg-entry-list">
                <div v-for="(prosedur, index) in store.formpasien.prosedurIdrg" :key="prosedur.kode || index"
                  class="idrg-entry-row" :class="{ 'is-procedure': true }"
                  @click="bukaEditorProsedur(prosedur)">
                  <q-icon name="icon-mat-drag_indicator" color="grey-6" />
                  <span class="idrg-entry-name">{{ prosedur.nama }}</span>
                  <span class="idrg-code">{{ prosedur.kode }}</span>
                  <span class="idrg-level">{{ index === 0 ? 'Primary' : 'Secondary' }}</span>
                  <strong v-if="Number(prosedur.jumlah) > 1" class="procedure-quantity-label">
                    {{ prosedur.jumlah }} kali
                  </strong>
                  <div v-if="editingProsedur === prosedur.kode" class="idrg-procedure-editor" @click.stop>
                    <div class="procedure-substitution-group">
                      <q-select v-model="prosedur.pengganti" :options="store.prosedurIdrgOptions"
                        use-input hide-selected fill-input input-debounce="400" dense outlined clearable
                        placeholder="Substitusi" class="idrg-search procedure-substitution"
                        @filter="filterProsedur" @update:model-value="gantiProsedur(prosedur, $event)" />
                      <q-btn label="Hapus" color="grey-7" dense no-caps unelevated
                        @click.stop="hapusProsedur(prosedur)" />
                    </div>
                    <div class="procedure-quantity-group">
                      <q-icon name="icon-mat-help_outline" color="primary" size="18px" />
                      <span>Jumlah :</span>
                      <q-input v-model.number="prosedur.jumlah" type="number" min="1" dense outlined
                        class="procedure-quantity" @update:model-value="ubahJumlahProsedur(prosedur)" />
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="idrg-empty">
                Belum ada prosedur
              </div>
            </div>

            <div class="idrg-action-row">
              <q-btn label="Grouping" color="indigo-9" dense no-caps unelevated
                :loading="isGroupingIdrgLoading"
                :disable="isGroupingIdrgLoading" @click="groupingIdrg()" />
            </div>

            <transition name="idrg-result-transition">
              <div v-if="store.formpasien.hasilIdrg" class="idrg-result-wrapper">
            <div class="idrg-result-title">
              Hasil Grouping iDRG
            </div>
            <div class="idrg-result-table">
              <div class="idrg-result-row">
                <div class="idrg-result-label">Info</div>
                <div class="idrg-result-value">{{ store.formpasien.hasilIdrg?.info || '-' }}</div>
              </div>
              <div class="idrg-result-row">
                <div class="idrg-result-label">Jenis Rawat</div>
                <div class="idrg-result-value">{{ jenisRawatLabel }}</div>
              </div>
              <div class="idrg-result-row">
                <div class="idrg-result-label">MDC</div>
                <div class="idrg-result-value result-with-code">
                  <span :class="{ 'idrg-result-alert': isUnrelatedGrouping(store.formpasien.hasilIdrg?.mdc) }">
                    {{ store.formpasien.hasilIdrg?.mdc || '-' }}
                  </span>
                  <span>{{ store.formpasien.hasilIdrg?.mdcCode || '-' }}</span>
                </div>
              </div>
              <div class="idrg-result-row">
                <div class="idrg-result-label">DRG</div>
                <div class="idrg-result-value result-with-code">
                  <span :class="{ 'idrg-result-alert': isUnrelatedGrouping(store.formpasien.hasilIdrg?.drg) }">
                    {{ store.formpasien.hasilIdrg?.drg || '-' }}
                  </span>
                  <span>{{ store.formpasien.hasilIdrg?.drgCode || '-' }}</span>
                  <span>DRG Cost Weight: <b class="idrg-blue">{{ store.formpasien.hasilIdrg?.costWeight || '-'
                  }}</b></span>
                </div>
              </div>
              <div v-if="store.formpasien.hasilIdrg?.hasSpecialProcedureOptions" class="idrg-result-row">
                <div class="idrg-result-label">Procedure</div>
                <div class="idrg-result-value result-with-code">
                  <q-select v-model="store.formpasien.hasilIdrg.procedureOpt"
                    :options="store.formpasien.hasilIdrg.specialProcedureOptions" dense outlined
                    emit-value map-options class="topup-drug-select"
                    :loading="isGroupingIdrgLoading"
                    :disable="isGroupingIdrgLoading"
                    @update:model-value="onTopupCmgChange" />
                  <span>{{ store.formpasien.hasilIdrg.topupProcedureCode || '-' }}</span>
                  <span>Top Up Cost Weight: <b class="idrg-blue">{{ topupProcedureCostWeight }}</b></span>
                </div>
              </div>
              <div v-if="adaTopupCode(store.formpasien.hasilIdrg?.topupProsthesisCode)" class="idrg-result-row">
                <div class="idrg-result-label">Protesis</div>
                <div class="idrg-result-value result-with-code">
                  <q-select v-model="store.formpasien.hasilIdrg.prosthesisOpt"
                    :options="store.formpasien.hasilIdrg.specialProsthesisOptions" dense outlined
                    emit-value map-options class="topup-drug-select" />
                  <span>{{ store.formpasien.hasilIdrg.topupProsthesisCode || '-' }}</span>
                  <span>Top Up Cost Weight: <b class="idrg-blue">{{ store.formpasien.hasilIdrg.topupProsthesisCostWeight || '-' }}</b></span>
                </div>
              </div>
              <div v-if="adaTopupCode(store.formpasien.hasilIdrg?.topupInvestigationCode)" class="idrg-result-row">
                <div class="idrg-result-label">Top-Diagnostic</div>
                <div class="idrg-result-value result-with-code">
                  <q-select v-model="store.formpasien.hasilIdrg.investigationOpt"
                    :options="store.formpasien.hasilIdrg.specialInvestigationOptions" dense outlined
                    emit-value map-options class="topup-drug-select" />
                  <span>{{ store.formpasien.hasilIdrg.topupInvestigationCode || '-' }}</span>
                  <span>Top Up Cost Weight: <b class="idrg-blue">{{ store.formpasien.hasilIdrg.topupInvestigationCostWeight || '-' }}</b></span>
                </div>
              </div>
              <div v-if="store.formpasien.hasilIdrg?.hasTopupDrug" class="idrg-result-row">
                <div class="idrg-result-label">Top-up Drug</div>
                <div class="idrg-result-value result-with-code">
                  <q-select v-model="store.formpasien.topupDrug"
                    :options="store.formpasien.hasilIdrg?.topupDrugOptions ?? []" dense outlined
                    emit-value map-options options-dense class="topup-drug-select"
                    :loading="isGroupingIdrgLoading"
                    :disable="isGroupingIdrgLoading"
                    @update:model-value="onTopupDrugChange" />
                  <span>Top Up Cost Weight: <b class="idrg-blue">{{ store.formpasien.hasilIdrg?.topupDrugCostWeight || '-' }}</b></span>
                </div>
              </div>
              <div class="idrg-result-row">
                <div class="idrg-result-label">NBR</div>
                <div class="idrg-result-value result-with-code">
                  <b class="idrg-blue">{{ formatNumber(store.formpasien.hasilIdrg?.nbr) }}</b>
                  <span>Total Cost Weight: <b class="idrg-blue">{{ store.formpasien.hasilIdrg?.totalCostWeight || '-'
                  }}</b></span>
                </div>
              </div>
              <div class="idrg-result-row">
                <div class="idrg-result-label">Total Klaim</div>
                <div class="idrg-result-value idrg-total">
                  <b>Rp</b><b class="idrg-blue">{{ formatNumber(store.formpasien.hasilIdrg?.totalKlaim) }}</b>
                </div>
              </div>
              <div class="idrg-result-row">
                <div class="idrg-result-label">Status</div>
                <div class="idrg-result-value">{{ store.formpasien.hasilIdrg?.status || '-' }}</div>
              </div>
            </div>
            <div class="idrg-note">
              ** ) Catatan: Nilai belum final, sewaktu-waktu bisa berubah
            </div>
            <div class="idrg-footer">
              <span>[ debug ]</span>
              <q-btn label="Final iDRG" color="indigo-9" dense no-caps unelevated
                :disable="!store.formpasien.hasilIdrg" />
            </div>
              </div>
            </transition>
          </fieldset>
        </q-card-section>
        <q-inner-loading :showing="store.loadingKunjunganKlaim || store.loadingTarifKlaim" color="primary" />
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { dateFullFormat, formatJam } from 'src/modules/formatter'
import { useKlaimPenjaminanStore } from 'src/stores/simrs/penjaminan/klaim'

const DEFAULT_TOPUP_DRUG_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Deferiprone', value: '10012' },
  { label: 'Deferoksamin', value: '10022' },
  { label: 'Deferasirox', value: '10032' }
]

const store = useKlaimPenjaminanStore()
const editingDiagnosaCode = ref(null)
const refreshingGroupingIdrg = ref(false)
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const jaminanOptions = [
  { label: 'JKN', value: '3;JKN' },
  { label: 'JAMINAN COVID-19', value: '71;COVID-19' },
  { label: 'JAMKESDA', value: '5;001' },
  { label: 'Pasien Bayar', value: '1;999' }
]
const cobOptions = [
  { label: '-', value: '' },
  { label: 'Mandiri Inhealth', value: '0001' }
]
const jenisRawatOptions = [
  { label: 'Jalan', value: '2' },
  { label: 'Inap', value: '1' }
]
const caraPulangOptions = [
  { label: 'Atas Persetujuan Dokter', value: '1' },
  { label: 'Dirujuk', value: '2' },
  { label: 'Atas Permintaan Sendiri', value: '3' },
  { label: 'Meninggal', value: '4' },
  { label: 'Lain-lain', value: '5' }
]
const jenisTarifOptions = [
  { label: 'TARIF RS KELAS C PEMERINTAH', value: 'kelas_c_pemerintah' }
]

const tariffItems = [
  { key: 'prosedurNonBedah', label: 'Prosedur Non Bedah', hint: 'Tarif prosedur non-bedah' },
  { key: 'prosedurBedah', label: 'Prosedur Bedah', hint: 'Tarif prosedur bedah' },
  { key: 'konsultasi', label: 'Konsultasi', hint: 'Tarif konsultasi' },
  { key: 'tenagaAhli', label: 'Tenaga Ahli', hint: 'Tarif tenaga ahli' },
  { key: 'keperawatan', label: 'Keperawatan', hint: 'Tarif pelayanan keperawatan' },
  { key: 'penunjang', label: 'Penunjang', hint: 'Tarif pelayanan penunjang' },
  { key: 'radiologi', label: 'Radiologi', hint: 'Tarif pelayanan radiologi' },
  { key: 'laboratorium', label: 'Laboratorium', hint: 'Tarif pemeriksaan laboratorium' },
  { key: 'pelayananDarah', label: 'Pelayanan Darah', hint: 'Tarif pelayanan darah' },
  { key: 'rehabilitasi', label: 'Rehabilitasi', hint: 'Tarif rehabilitasi' },
  { key: 'kamar', label: 'Kamar / Akomodasi', hint: 'Tarif kamar dan akomodasi' },
  { key: 'rawatIntensif', label: 'Rawat Intensif', hint: 'Tarif rawat intensif' },
  { key: 'obat', label: 'Obat', hint: 'Tarif obat' },
  { key: 'obatKronis', label: 'Obat Kronis', hint: 'Tarif obat kronis' },
  { key: 'obatKemoterapi', label: 'Obat Kemoterapi', hint: 'Tarif obat kemoterapi' },
  { key: 'alkes', label: 'Alkes', hint: 'Tarif alat kesehatan' },
  { key: 'bmhp', label: 'BMHP', hint: 'Tarif bahan medis habis pakai' },
  { key: 'sewaAlat', label: 'Sewa Alat', hint: 'Tarif sewa alat' }
]

const dpjpOptions = computed(() => {
  const dokter = props.pasien?.datasimpeg
  const kode = dokter?.kdpegsimrs ?? dokter?.kddpjp ?? dataKunjungan.value?.kd_dokter ?? props.pasien?.kodedokter ?? ''
  const nama = dokter?.nama ?? dataKunjungan.value?.dokter ?? props.pasien?.dokter ?? ''
  return nama ? [{ label: nama, value: kode || nama }] : []
})

const kelasHakOptions = [
  { label: 'Kelas 3', value: '3' },
  { label: 'Kelas 2', value: '2' },
  { label: 'Kelas 1', value: '1' }
]

watch(() => props.pasien?.noreg, () => {
  ambilKunjunganKlaim()
}, { immediate: true })

async function ambilKunjunganKlaim() {
  const pasien = props.pasien
  store.resetFormKlaim()
  const result = await store.getKunjunganKlaim(pasien?.noreg, pasien?.layanan)
  const dataLokal = { ...pasien, ...(result?.data ?? {}) }
  const dataEklaim = normalizeEklaimData(result?.data_eklaim)
  const data = mergeWithFallback(dataLokal, dataEklaim)

  if (pasien?.noreg !== props.pasien?.noreg) return

  store.formpasien.jaminan = getJaminanValue(data)
  store.formpasien.noPeserta = data?.noka ?? data?.no_peserta ?? ''
  store.formpasien.noSep = data?.nosep ?? data?.no_sep ?? data?.sep ?? ''
  store.formpasien.cob = data?.cob_cd ?? data?.cob ?? ''
  store.formpasien.caraPulang = String(data?.discharge_status ?? data?.cara_pulang ?? '1')
  store.formpasien.jenisRawat = getJenisRawat(data)
  store.formpasien.kelasRawat = String(data?.kelas_rawat ?? data?.kelasrawat ?? '3')
  store.formpasien.kelasEksekutif = toBoolean(data?.kelas_eksekutif ?? data?.kelasEksekutif ?? (String(data?.jenis_rawat) === '2' && Number(data?.tarif_poli_eks) > 0))
  store.formpasien.naikTurunKelas = toBoolean(data?.upgrade_class_ind ?? data?.naikTurunKelas)
  store.formpasien.adaRawatIntensif = toBoolean(data?.icu_indikator ?? data?.icu_ind ?? data?.adaRawatIntensif)
  store.formpasien.adlSubAcute = data?.adl_sub_acute ?? ''
  store.formpasien.adlChronic = data?.adl_chronic ?? ''
  store.formpasien.beratLahir = Number(data?.birth_weight ?? 0)
  store.formpasien.sistole = data?.sistole !== null && data?.sistole !== undefined && data?.sistole !== ''
    ? Number(data.sistole)
    : 0
  store.formpasien.diastole = data?.diastole !== null && data?.diastole !== undefined && data?.diastole !== ''
    ? Number(data.diastole)
    : 0
  store.formpasien.dpjp = dpjpOptions.value[0]?.value ?? ''

  await ambilDiagnosaEklaim()
  await ambilProsedurEklaim()

  const layanan = result?.layanan ?? pasien?.layanan ?? (store.formpasien.jenisRawat === '1' ? 'ranap' : 'rajal')
  await store.getTarifKlaim(pasien?.noreg, layanan)

  const tarifEklaim = {
    prosedurNonBedah: data?.prosedur_non_bedah,
    prosedurBedah: data?.prosedur_bedah,
    konsultasi: data?.konsultasi,
    tenagaAhli: data?.tenaga_ahli,
    keperawatan: data?.keperawatan,
    penunjang: data?.penunjang,
    radiologi: data?.radiologi,
    laboratorium: data?.laboratorium,
    pelayananDarah: data?.pelayanan_darah,
    rehabilitasi: data?.rehabilitasi,
    kamar: data?.kamar,
    rawatIntensif: data?.rawat_intensif,
    obat: data?.obat,
    obatKronis: data?.obat_kronis,
    obatKemoterapi: data?.obat_kemoterapi,
    alkes: data?.alkes,
    bmhp: data?.bmhp,
    sewaAlat: data?.sewa_alat
  }
  const adaTarifEklaim = Object.values(tarifEklaim).some(value => value !== null && value !== undefined && value !== '')
  if (adaTarifEklaim) {
    store.formpasien.tarif = { ...store.formpasien.tarif, ...tarifEklaim }
  }

  store.formpasien.hasilIdrg = normalizeStoredGrouping(
    result?.idrg_klaim,
    result?.total_tarif_eklaim,
    result?.special_drug_options ?? []
  )
  store.formpasien.topupDrug = store.formpasien.hasilIdrg?.topupDrug ?? ''

  if (perluSinkronisasiIdrg(store.formpasien.hasilIdrg)) {
    await groupingIdrg()
  }
}

async function ambilDiagnosaEklaim() {
  const noreg = props.pasien?.noreg
  const nomorSep = store.formpasien.noSep
  if (!noreg || !nomorSep) return null

  return store.getDiagnosaIdrg({
    noreg,
    nomor_sep: nomorSep
  })
}

async function ambilProsedurEklaim() {
  const noreg = props.pasien?.noreg
  const nomorSep = store.formpasien.noSep
  if (!noreg || !nomorSep) return null
  return store.getProsedurIdrg({ noreg, nomor_sep: nomorSep })
}

function normalizeEklaimData(value) {
  if (!value || typeof value !== 'object') return {}

  const data = value?.response?.data ?? value?.data ?? value?.response ?? value
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}

  return {
    ...data,
    ...(data?.tarif_rs && typeof data.tarif_rs === 'object' ? data.tarif_rs : {})
  }
}

function hasValue(value) {
  return value !== null && value !== undefined && value !== ''
}

function mergeWithFallback(localData, eklaimData) {
  const merged = { ...localData }
  Object.entries(eklaimData).forEach(([key, value]) => {
    if (hasValue(value)) merged[key] = value
  })
  return merged
}

watch(() => store.formpasien.pasienTb, pasienTb => {
  if (!pasienTb) store.formpasien.nomorRegisterSitb = ''
})

function gantiJenisRawat(jenisRawat) {
  if (jenisRawat === '2') {
    store.formpasien.naikTurunKelas = false
    store.formpasien.adaRawatIntensif = false
  }
  else {
    store.formpasien.kelasEksekutif = false
    store.formpasien.kelasRawat = '3'
  }
}

const dataKunjungan = computed(() => ({ ...props.pasien, ...(store.kunjunganKlaim ?? {}) }))
const tanggalMasukRaw = computed(() => dataKunjungan.value?.tglmasuk ?? dataKunjungan.value?.tgl_kunjungan ?? null)
const tanggalPulangRaw = computed(() => dataKunjungan.value?.tglkeluar ?? dataKunjungan.value?.tglpulang ?? dataKunjungan.value?.tgl_keluar ?? tanggalMasukRaw.value)
const tanggalMasuk = computed(() => formatTanggal(tanggalMasukRaw.value))
const tanggalPulang = computed(() => formatTanggal(tanggalPulangRaw.value))
const umurPasien = computed(() => dataKunjungan.value?.usia ?? dataKunjungan.value?.umur ?? '0 hari')

const durasiRawat = computed(() => {
  const masuk = new Date(tanggalMasukRaw.value).getTime()
  const pulang = new Date(tanggalPulangRaw.value).getTime()
  if (!Number.isFinite(masuk) || !Number.isFinite(pulang) || pulang < masuk) return 0
  return pulang - masuk
})
const losHari = computed(() => Math.max(1, Math.ceil(durasiRawat.value / 86400000)))
const losJam = computed(() => Math.floor(durasiRawat.value / 3600000))
const totalTarif = computed(() => Object.values(store.formpasien.tarif).reduce((total, value) => total + (Number(value) || 0), 0))
const jenisRawatLabel = computed(() => store.formpasien.jenisRawat === '1' ? 'Rawat Inap' : 'Rawat Jalan')
const isGroupingIdrgLoading = computed(() => store.loadingGroupingIdrg !== null || refreshingGroupingIdrg.value)
const topupProcedureCostWeight = computed(() => {
  const hasil = store.formpasien.hasilIdrg
  if (adaTopupCode(hasil?.topupDrugCostWeight)) return hasil.topupDrugCostWeight
  if (adaTopupCode(hasil?.topupProcedureCostWeight)) return hasil.topupProcedureCostWeight
  return '-'
})
const sudahGrouping = computed(() => Boolean(store.formpasien.hasilIdrg))
const tampilkanTombolNewKlaim = computed(() => Boolean(props.pasien?.noreg)
  && !store.loadingKunjunganKlaim
  && store.sudahPernahKlaim === 0)
const tampilkanIdrg = computed(() => Boolean(props.pasien?.noreg)
  && !store.loadingKunjunganKlaim)

function loadCaraMasuk() {
  if (!store.caraMasukOptions.length && !store.loadingCaraMasuk) store.getCaraMasuk()
}

async function newclaim() {
  const pasien = props.pasien
  if (!pasien?.noreg) return

  const payload = {
    noreg: pasien?.noreg || '',
    nomor_kartu: store.formpasien.noPeserta || dataKunjungan.value?.noka || pasien?.noka || '',
    nomor_sep: store.formpasien.noSep || dataKunjungan.value?.nosep || pasien?.nosep || '',
    nomor_rm: dataKunjungan.value?.norm ?? pasien?.norm ?? '',
    nama_pasien: dataKunjungan.value?.nama ?? pasien?.nama ?? pasien?.pasien ?? '',
    tgl_lahir: dataKunjungan.value?.tgllahir ?? pasien?.tgllahir ?? pasien?.tgl_lahir ?? '',
    gender: getGenderEklaim(dataKunjungan.value?.kelamin ?? pasien?.kelamin)
  }
  const fieldWajib = ['nomor_kartu', 'nomor_rm', 'nama_pasien', 'tgl_lahir', 'gender']
  const fieldKosong = fieldWajib.filter(field => !String(payload[field] ?? '').trim())
  if (fieldKosong.length) {
    store.notifikasiError(`Data New Klaim belum lengkap: ${fieldKosong.join(', ')}`)
    return
  }

  await store.newclaim(payload)
}

async function groupingIdrg(stage = '1', selectedDrug = null) {
  if (!props.pasien?.noreg) return
  const groupingStage = String(stage) === '2' ? '2' : '1'
  const form = store.formpasien
  const data = dataKunjungan.value
  const tarif = form.tarif ?? {}
  const payload = {
    noreg: props.pasien.noreg,
    nomor_sep: form.noSep || data?.nosep || props.pasien?.nosep || '',
    nomor_kartu: form.noPeserta || data?.noka || props.pasien?.noka || '',
    nomor_rm: data?.norm || props.pasien?.norm || '',
    nama_pasien: data?.nama || props.pasien?.nama || props.pasien?.pasien || '',
    tgl_lahir: data?.tgllahir || props.pasien?.tgllahir || props.pasien?.tgl_lahir || '',
    gender: getGenderEklaim(data?.kelamin || props.pasien?.kelamin),
    konsulke: data?.konsulke || '',
    tgl_masuk: data?.tglmasuk || data?.tgl_kunjungan || '',
    tgl_pulang: data?.tglkeluar || data?.tglpulang || data?.tgl_keluar || '',
    jenis_rawat: form.jenisRawat,
    kelas_rawat: form.kelasRawat,
    adl_sub_acute: form.adlSubAcute,
    adl_chronic: form.adlChronic,
    icu_indikator: form.adaRawatIntensif ? '1' : '0',
    icu_los: data?.icu_los || '',
    ventilator_hour: data?.ventilator_hour || '',
    upgrade_class_ind: form.naikTurunKelas ? '1' : '0',
    upgrade_class_class: data?.upgrade_class_class || '',
    upgrade_class_los: data?.upgrade_class_los || '',
    add_payment_pct: data?.add_payment_pct || '',
    birth_weight: form.beratLahir,
    discharge_status: form.caraPulang,
    prosedur_non_bedah: tarif.prosedurNonBedah,
    prosedur_bedah: tarif.prosedurBedah,
    konsultasi: tarif.konsultasi,
    tenaga_ahli: tarif.tenagaAhli,
    keperawatan: tarif.keperawatan,
    penunjang: tarif.penunjang,
    radiologi: tarif.radiologi,
    laboratorium: tarif.laboratorium,
    pelayanan_darah: tarif.pelayananDarah,
    rehabilitasi: tarif.rehabilitasi,
    kamar: tarif.kamar,
    rawat_intensif: tarif.rawatIntensif,
    obat: tarif.obat,
    obat_kronis: tarif.obatKronis,
    obat_kemoterapi: tarif.obatKemoterapi,
    alkes: tarif.alkes,
    bmhp: tarif.bmhp,
    sewa_alat: tarif.sewaAlat,
    tarif_poli_eks: data?.tarif_poli_eks || 0,
    nama_dokter: data?.dokter || props.pasien?.dokter || '',
    kd_dokter: data?.kd_dokter || props.pasien?.kodedokter || '',
    kode_tarif: form.jenisTarif,
    payor: form.jaminan,
    cob_cd: form.cob,
    coder_nik: data?.coder_nik || '',
    nomor_kartu_t: data?.nomor_kartu_t || '',
    covid19_status_cd: data?.covid19_status_cd || '',
    episodes: data?.episodes || '',
    covid19_cc_ind: data?.covid19_cc_ind || '',
    pemulasaraan_jenazah: data?.pemulasaraan_jenazah ? '1' : '0',
    kantong_jenazah: data?.kantong_jenazah ? '1' : '0',
    peti_jenazah: data?.peti_jenazah ? '1' : '0',
    plastik_erat: data?.plastik_erat ? '1' : '0',
    desinfektan_jenazah: data?.desinfektan_jenazah ? '1' : '0',
    mobil_jenazah: data?.mobil_jenazah ? '1' : '0',
    desinfektan_mobil_jenazah: data?.desinfektan_mobil_jenazah ? '1' : '0',
    cara_masuk: form.caraMasuk,
    upgradeclasspayor: data?.upgradeclasspayor || '',
    sistole: form.sistole,
    diastole: form.diastole,
    dializer_single_use: data?.dializer_single_use || '',
    kantongdarah: data?.kantongdarah || '',
    stage: groupingStage,
    procedure: groupingStage === '2' ? form.hasilIdrg?.procedureOpt || '' : '',
    prosthesis: groupingStage === '2' ? form.hasilIdrg?.prosthesisOpt || '' : '',
    investigation: groupingStage === '2' ? form.hasilIdrg?.investigationOpt || '' : '',
    drug: groupingStage === '2' ? (selectedDrug ?? form.topupDrug) || '' : ''
  }

  const result = await store.groupingIdrg(payload)
  if (!result?.success || props.pasien?.noreg !== payload.noreg) return

  // Hasil hanya ditampilkan dari data yang sudah tersimpan di database,
  // bukan langsung dari respons proses grouping.
  refreshingGroupingIdrg.value = true
  try {
    const kunjunganTersimpan = await store.getKunjunganKlaim(payload.noreg, props.pasien?.layanan, true)
    if (props.pasien?.noreg !== payload.noreg) return

    store.formpasien.hasilIdrg = normalizeStoredGrouping(
      kunjunganTersimpan?.idrg_klaim,
      kunjunganTersimpan?.total_tarif_eklaim,
      kunjunganTersimpan?.special_drug_options ?? []
    )
    store.formpasien.topupDrug = store.formpasien.hasilIdrg?.topupDrug ?? ''
  }
  finally {
    refreshingGroupingIdrg.value = false
  }
}

async function onTopupDrugChange(drug) {
  if (!store.formpasien.hasilIdrg || isGroupingIdrgLoading.value) return
  await groupingIdrg(drug ? '2' : '1', drug)
}

async function onTopupCmgChange() {
  if (!store.formpasien.hasilIdrg || isGroupingIdrgLoading.value) return
  await groupingIdrg('2')
}

function getGenderEklaim(value) {
  const gender = String(value ?? '').trim().toUpperCase()
  return gender === '1' || gender === 'L' || gender.includes('LAKI') ? '1' : '2'
}

function normalizeStoredGrouping(value, totalTarifEklaim = null, explicitSpecialDrugOptions = []) {
  if (!value || typeof value !== 'object') return null
  const specialDrug = value.special_drug ?? value.special_drugs ?? value.drug_options
  const cmgOptions = parseCmgOptions(value.special_cmg_option_code ?? value.opt_cmg)
  const topupOptions = Array.isArray(value.topup_options)
    ? value.topup_options.filter(option => isSpecialDrug(option?.type))
    : []
  const specialDrugOptions = Array.isArray(specialDrug)
    ? specialDrug
    : cmgOptions.filter(option => isSpecialDrug(option?.type))
  const availableDrugOptions = explicitSpecialDrugOptions.length
    ? explicitSpecialDrugOptions
    : (specialDrugOptions.length ? specialDrugOptions : topupOptions)
  const topupDrugOptions = availableDrugOptions.map(option => {
    if (typeof option === 'string') return { label: option, value: option }
    const valueOption = option?.code ?? option?.kode ?? option?.value ?? ''
    return {
      label: option?.description ?? option?.nama ?? option?.label ?? valueOption,
      value: valueOption
    }
  }).filter(option => option.value)
  const specialProcedureOptions = parseSpecialOptions(cmgOptions, 'procedure')
  const specialProsthesisOptions = parseSpecialOptions(cmgOptions, 'prosthesis')
  const specialInvestigationOptions = parseSpecialOptions(cmgOptions, 'investigation')

  return {
    info: formatIdrgInfo(value),
    mdc: value.mdc_description ?? '-',
    mdcCode: value.mdc_number ?? '-',
    drg: value.drg_description ?? '-',
    drgCode: value.drg_code ?? '-',
    costWeight: value.cost_weight ?? '-',
    nbr: value.nbr ?? '-',
    totalCostWeight: value.total_cost_weight ?? '-',
    totalKlaim: value.total_tarif ?? value.total_klaim ?? totalTarifEklaim ?? 0,
    status: value.status_cd ?? '-',
    topupDrug: value.drug_opt || value.topup_drug_code || value.drug_code || '',
    topupDrugCostWeight: value.topup_drug_cost_weight ?? value.drug_cost_weight ?? '',
    hasTopupDrug: topupDrugOptions.length > 0,
    topupDrugOptions: mergeTopupDrugOptions(topupDrugOptions),
    hasSpecialProcedureOptions: specialProcedureOptions.length > 1,
    specialProcedureOptions,
    specialProsthesisOptions,
    specialInvestigationOptions,
    procedureOpt: value.procedure_opt ?? value.topup_procedure_code ?? '',
    prosthesisOpt: value.prosthesis_opt ?? '',
    investigationOpt: value.investigation_opt ?? '',
    topupProcedureCode: value.topup_procedure_code ?? '',
    topupProcedureCostWeight: value.topup_procedure_cost_weight ?? '',
    topupProsthesisCode: value.topup_prosthesis_code ?? '',
    topupProsthesisCostWeight: value.topup_prosthesis_cost_weight ?? '',
    topupInvestigationCode: value.topup_investigation_code ?? '',
    topupInvestigationCostWeight: value.topup_investigation_cost_weight ?? '',
  }
}

function parseSpecialOptions(options, type) {
  const allowedTypes = [type, `special ${type}`]
  const specialOptions = options
    .filter(option => allowedTypes.includes(String(option?.type ?? '').trim().toLowerCase()))
    .map(option => ({
      label: option?.description ?? option?.label ?? option?.code,
      value: option?.code ?? option?.value
    }))
    .filter(option => option.value)

  return [{ label: 'None', value: '' }, ...specialOptions]
}

function isSpecialDrug(type) {
  const normalized = String(type ?? '').trim().toLowerCase()
  return normalized === 'drug' || normalized === 'special drug'
}

function perluSinkronisasiIdrg(hasilIdrg) {
  if (!hasilIdrg || hasilIdrg.topupDrug) return false
  const costWeight = String(hasilIdrg.topupDrugCostWeight ?? '').trim()
  return costWeight !== '' && costWeight !== '-'
}

function mergeTopupDrugOptions(options) {
  const backendOptions = options.filter(option => option?.value)
  const usedBackendOptions = new Set()
  const defaults = DEFAULT_TOPUP_DRUG_OPTIONS.map(defaultOption => {
    const index = backendOptions.findIndex(option => String(option.label).trim().toLowerCase() === defaultOption.label.toLowerCase())
    if (index < 0) return defaultOption
    usedBackendOptions.add(index)
    return backendOptions[index]
  })

  return [...defaults, ...backendOptions.filter((_, index) => !usedBackendOptions.has(index))]
}

function parseCmgOptions(value) {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string' || !value.trim()) return []
  try {
    return flattenCmgOptions(JSON.parse(value))
  }
  catch {
    return []
  }
}

function flattenCmgOptions(value) {
  if (Array.isArray(value)) return value.flatMap(item => flattenCmgOptions(item))
  if (!value || typeof value !== 'object') return []
  if (value.code || value.kode || value.value || value.description || value.nama || value.label) return [value]
  return Object.values(value).flatMap(item => flattenCmgOptions(item))
}

function formatIdrgInfo(value) {
  const scriptVersion = String(value?.script_version ?? '').trim()
  const logicVersion = value?.logic_version

  if (scriptVersion && logicVersion) {
    const date = new Date(logicVersion)
    const tanggal = Number.isNaN(date.getTime())
      ? String(logicVersion)
      : new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date).replace(',', '')
    return `${scriptVersion} @ ${tanggal}`
  }

  return value?.info ?? value?.created_at ?? '-'
}

function isUnrelatedGrouping(value) {
  return /ungroupable|unrelated/i.test(String(value ?? ''))
}

function adaTopupCode(value) {
  // Samakan dengan PHP: !empty($rs->topup_procedure_code).
  // Nilai null, false, 0, '0', atau string kosong dianggap tidak ada.
  if (!value || value === '0') return false
  return String(value).trim() !== ''
}

function filterDiagnosa(value, update, abort) {
  const term = String(value ?? '').trim()
  if (term.length < 2) {
    abort()
    return
  }

  store.cariDiagnosaIdrg(term).then(() => update())
}

function filterProsedur(value, update, abort) {
  const term = String(value ?? '').trim()
  if (term.length < 2) {
    abort()
    return
  }

  store.cariProsedurIdrg(term).then(() => update())
}

async function tambahDiagnosa(option) {
  if (!option?.value) return
  const response = await store.simpanDiagnosaIdrg({
    noreg: props.pasien?.noreg,
    icd: option.value,
    diagnosa: option.diagnosa
  })
  if (response?.success) {
    store.formpasien.diagnosaIdrg.push({
      kode: option.value,
      nama: option.diagnosa
    })
  }
  store.formpasien.pencarianDiagnosa = null
}

async function tambahProsedur(option) {
  if (!option?.value) return
  const response = await store.simpanProsedurIdrg({
    noreg: props.pasien?.noreg,
    kd_prosedur: option.value,
    prosedur: option.prosedur,
    jumlah: 1
  })
  if (response?.success) {
    store.formpasien.prosedurIdrg.push({
      kode: option.value,
      nama: option.prosedur,
      jumlah: 1
    })
  }
  store.formpasien.pencarianProsedur = null
}

const editingProsedur = ref(null)

function bukaEditorProsedur(prosedur) {
  prosedur.jumlah = Number(prosedur.jumlah) || 1
  editingProsedur.value = prosedur.kode
}

async function ubahJumlahProsedur(prosedur) {
  const jumlah = Math.max(1, Number(prosedur.jumlah) || 1)
  prosedur.jumlah = jumlah
  await store.ubahJumlahProsedurIdrg({
    noreg: props.pasien?.noreg,
    kd_prosedur: prosedur.kode,
    jumlah
  })
}

async function gantiProsedur(prosedur, option) {
  if (!option?.value || option.value === prosedur.kode) return

  const response = await store.simpanProsedurIdrg({
    noreg: props.pasien?.noreg,
    kd_prosedur: option.value,
    prosedur: option.prosedur,
    jumlah: 1
  })
  if (response?.success) {
    const index = store.formpasien.prosedurIdrg.indexOf(prosedur)
    if (index !== -1) {
      await store.hapusProsedurIdrg({
        noreg: props.pasien?.noreg,
        kd_prosedur: prosedur.kode
      })
      store.formpasien.prosedurIdrg[index] = {
        kode: option.value,
        nama: option.prosedur,
        jumlah: 1
      }
      editingProsedur.value = option.value
    }
  }
  prosedur.pengganti = null
}

async function hapusProsedur(prosedur) {
  const response = await store.hapusProsedurIdrg({
    noreg: props.pasien?.noreg,
    kd_prosedur: prosedur.kode
  })
  if (response?.success) {
    const index = store.formpasien.prosedurIdrg.indexOf(prosedur)
    if (index !== -1) store.formpasien.prosedurIdrg.splice(index, 1)
    store.formpasien.hasilIdrg = null
    store.formpasien.topupDrug = ''
    editingProsedur.value = null
  }
}

function bukaEditorDiagnosa(diagnosa) {
  editingDiagnosaCode.value = diagnosa?.kode ?? null
  store.formpasien.pencarianDiagnosa = null
  store.diagnosaIdrgOptions = []
}

async function gantiDiagnosa(current, option) {
  if (!option?.value) return
  if (!current?.kode || option.value === current.kode) return

  const deleted = await store.hapusDiagnosaIdrg({
    noreg: props.pasien?.noreg,
    icd: current.kode
  })
  if (!deleted?.success) return

  const response = await store.simpanDiagnosaIdrg({
    noreg: props.pasien?.noreg,
    icd: option.value,
    diagnosa: option.diagnosa
  })
  if (response?.success) {
    const index = store.formpasien.diagnosaIdrg.indexOf(current)
    if (index !== -1) store.formpasien.diagnosaIdrg[index] = { kode: option.value, nama: option.diagnosa }
    editingDiagnosaCode.value = null
  }
  store.formpasien.pencarianDiagnosa = null
}

async function hapusDiagnosa(current) {
  if (!current?.kode) return
  const response = await store.hapusDiagnosaIdrg({
    noreg: props.pasien?.noreg,
    icd: current.kode
  })
  if (response?.success) {
    const index = store.formpasien.diagnosaIdrg.indexOf(current)
    if (index !== -1) store.formpasien.diagnosaIdrg.splice(index, 1)
    store.formpasien.hasilIdrg = null
    store.formpasien.topupDrug = ''
    editingDiagnosaCode.value = null
  }
}

function formatTanggal(value) {
  if (!value) return '-'
  return `${dateFullFormat(value)} ${formatJam(value)}`
}

function getJaminanValue(pasien) {
  const payorId = String(pasien?.payor_id ?? pasien?.payorId ?? '')
  const byPayorId = jaminanOptions.find(option => option.value.startsWith(`${payorId};`))
  if (byPayorId) return byPayorId.value

  const sistemBayar = String(pasien?.sistembayar ?? pasien?.jaminan ?? '').toLowerCase()
  if (sistemBayar.includes('covid')) return '71;COVID-19'
  if (sistemBayar.includes('jamkesda')) return '5;001'
  if (sistemBayar.includes('umum') || sistemBayar.includes('bayar')) return '1;999'
  return '3;JKN'
}

function getJenisRawat(pasien) {
  const jenisRawat = String(pasien?.jenis_rawat ?? pasien?.jenisrawat ?? '').toLowerCase()
  if (jenisRawat === '1' || jenisRawat.includes('inap')) return '1'
  return '2'
}

function toBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value) || 0)
}

function formatCurrency(value) {
  return value === null || value === undefined ? '-' : `Rp ${formatNumber(value)}`
}
</script>

<style scoped lang="scss">
.claim-card {
  color: #202124;
  overflow: hidden;
}

.section-title {
  border-top: 2px solid #777;
  border-bottom: 1px solid #bbb;
  color: $primary;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .02em;
  margin: 12px 12px 0;
  padding: 10px 4px 8px;
}

.top-grid {
  display: grid;
  grid-template-columns: minmax(240px, 1.4fr) minmax(160px, .85fr) minmax(160px, .85fr) minmax(220px, 1.25fr);
  gap: 12px;
}

.field-label {
  color: #6d6d6d;
  font-size: 11px;
  font-style: italic;
  margin: 0 0 3px 2px;
}

.readonly-field :deep(.q-field__control),
.tariff-input :deep(.q-field__control) {
  background: #fffef0;
}

.detail-table {
  border-top: 1px solid #c8c8c8;
}

.detail-row {
  display: grid;
  grid-template-columns: 190px minmax(500px, 1fr) 200px 290px;
  min-height: 42px;
  border-bottom: 1px solid #c8c8c8;
}

.detail-label,
.detail-value {
  align-items: center;
  display: flex;
  padding: 6px 10px;
}

.detail-label {
  justify-content: flex-end;
  font-weight: 600;
  border-right: 1px solid #c8c8c8;
}

.right-label {
  border-left: 1px solid #c8c8c8;
}

.treatment-dates {
  justify-content: space-around;
  gap: 18px;
}

.medium-control {
  width: min(300px, 100%);
}

.dpjp-control {
  width: min(400px, 100%);
}

.short-control {
  width: 90px;
}

.rawat-controls {
  flex-wrap: wrap;
  gap: 10px;
}

.tb-field {
  gap: 10px;
}

.sitb-control {
  width: min(280px, 100%);
}

.tariff-heading {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 6px;
  color: #777;
  font-style: italic;
  padding: 22px 12px 12px;
}

.tariff-heading strong {
  color: #111;
  font-size: 20px;
  font-style: normal;
}

.tariff-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  border-top: 1px solid #d2d2d2;
  margin: 0 14px;
}

.tariff-item {
  align-items: center;
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 125px;
  gap: 12px;
  min-height: 42px;
  padding: 5px 14px;
  border-right: 1px solid #d2d2d2;
  border-bottom: 1px solid #d2d2d2;
}

.tariff-item:nth-child(3n) {
  border-right: 0;
}

.tariff-label {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  gap: 7px;
  font-weight: 500;
}

.declaration-row {
  align-items: center;
  display: flex;
  justify-content: center;
  color: #777;
  font-size: 12px;
  font-style: italic;
  gap: 4px;
  padding: 20px 12px;
}

.clinical-section {
  border-top: 2px solid #777;
  border-bottom: 2px solid #777;
  margin: 0 12px 12px;
  min-height: 210px;
  position: relative;
}

.clinical-title {
  border-bottom: 1px solid #d2d2d2;
  font-size: 14px;
  font-weight: 600;
  padding: 28px 12px 18px;
  text-align: center;
}

.blood-pressure-field {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 30px 12px 42px;
}

.clinical-label {
  color: #777;
  font-size: 12px;
  font-style: italic;
  margin-bottom: 8px;
}

.blood-pressure-inputs {
  display: flex;
  gap: 12px;
}

.blood-pressure-control {
  text-align: center;
}

.blood-pressure-caption {
  color: #111;
  font-size: 11px;
  font-weight: 500;
  margin-top: 3px;
}

.clinical-input {
  width: 78px;
}

.clinical-input :deep(.q-field__control) {
  background: #fffef0;
}

.new-claim-btn {
  bottom: 14px;
  min-width: 100px;
  position: absolute;
  right: 14px;
}

.idrg-section {
  border: 1px solid #999;
  margin: 18px 8px 28px;
  padding: 22px 14px 18px;
}

.idrg-section legend {
  border: 1px solid #999;
  border-bottom: 0;
  border-radius: 5px 5px 0 0;
  font-size: 14px;
  padding: 8px 24px;
}

.idrg-entry-section {
  border-bottom: 1px solid #c8c8c8;
  padding: 4px 0 18px;
}

.procedure-section {
  padding-top: 14px;
}

.idrg-entry-header,
.idrg-action-row,
.idrg-footer,
.result-with-code,
.idrg-total {
  align-items: center;
  display: flex;
}

.idrg-entry-header {
  justify-content: flex-start;
  gap: 16px;
}

.idrg-entry-header > div:first-child {
  flex: 1 1 auto;
}

.idrg-search-actions {
  align-items: center;
  display: flex;
  flex: 0 0 185px;
  margin-left: auto;
  position: relative;
}

.idrg-search-actions .idrg-search {
  width: 185px;
}

.procedure-section .idrg-search {
  flex: 0 0 185px;
  margin-left: auto;
}

.idrg-search-actions > .q-btn {
  position: absolute;
  right: 24px;
  z-index: 2;
}

.idrg-entry-header span,
.idrg-level {
  color: #777;
}

.idrg-search {
  width: 185px;
}

.idrg-search :deep(.q-field__control) {
  background: #fffef0;
  border-radius: 18px;
}

.idrg-entry-list {
  margin: 8px 0 0 52px;
}

.idrg-entry-row {
  align-items: center;
  border-bottom: 1px solid #d2d2d2;
  display: flex;
  gap: 8px;
  min-height: 38px;
  flex-wrap: wrap;
  cursor: pointer;
}

.idrg-primary-editor {
  align-items: center;
  display: flex;
  flex-basis: 100%;
  gap: 8px;
  margin: 0 0 8px 52px;
}

.idrg-procedure-editor {
  align-items: center;
  display: flex;
  flex-basis: 100%;
  gap: 8px;
  margin: 0 0 8px 52px;
}

.procedure-substitution-group,
.procedure-quantity-group {
  align-items: center;
  display: flex;
  gap: 8px;
}

.procedure-substitution-group {
  flex: 0 0 205px;
}

.procedure-substitution {
  flex: 0 1 205px;
  margin-left: 0;
  max-width: 205px;
  width: 100%;
}

.procedure-quantity-group {
  margin-left: auto;
  white-space: nowrap;
}

.procedure-quantity {
  width: 110px;
}

.idrg-entry-name {
  text-decoration: underline;
}

.idrg-code {
  background: #dfffff;
  border: 1px solid #9cc;
  font-weight: 600;
  padding: 1px 4px;
}

.idrg-level {
  font-size: 12px;
}

.procedure-quantity-label {
  color: #202124;
  white-space: nowrap;
}

.idrg-empty {
  color: #888;
  font-size: 12px;
  padding: 12px 0 0 52px;
}

.idrg-action-row {
  justify-content: flex-end;
  padding: 12px 14px 16px;
}

.idrg-result-title {
  border-bottom: 1px solid #c8c8c8;
  font-weight: 600;
  padding: 5px;
  text-align: center;
}

.idrg-result-transition-enter-active,
.idrg-result-transition-leave-active {
  max-height: 1600px;
  overflow: hidden;
  transition: max-height .28s ease, opacity .2s ease, transform .28s ease;
}

.idrg-result-transition-enter-from,
.idrg-result-transition-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}

.idrg-result-row {
  border-bottom: 1px solid #c8c8c8;
  display: grid;
  grid-template-columns: 190px 1fr;
  min-height: 38px;
}

.topup-drug-select {
  max-width: 440px;
  width: 100%;
}

.idrg-result-label,
.idrg-result-value {
  align-items: center;
  display: flex;
  padding: 6px 10px;
}

.idrg-result-label {
  border-right: 1px solid #c8c8c8;
  font-weight: 600;
  justify-content: flex-end;
}

.result-with-code {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) 140px 260px;
}

.idrg-total {
  gap: 54px;
  justify-content: flex-end;
}

.idrg-blue,
.idrg-note {
  color: #001eff;
}

.idrg-result-alert {
  color: #d32f2f;
  font-weight: 600;
}

.idrg-note {
  border-bottom: 1px solid #c8c8c8;
  font-size: 12px;
  font-style: italic;
  padding: 10px;
}

.idrg-footer {
  justify-content: space-between;
  padding: 8px 10px 0;
}

:deep(.q-field--dense .q-field__control),
:deep(.q-field--dense .q-field__marginal) {
  height: 34px;
  min-height: 34px;
}

@media (max-width: 1200px) {
  .top-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .detail-row {
    grid-template-columns: 150px minmax(360px, 1fr) 160px 230px;
  }

  .tariff-grid {
    grid-template-columns: repeat(2, minmax(300px, 1fr));
  }

  .tariff-item:nth-child(3n) {
    border-right: 1px solid #d2d2d2;
  }

  .tariff-item:nth-child(2n) {
    border-right: 0;
  }
}

@media (max-width: 760px) {
  .q-pa-md {
    padding: 8px;
  }

  .top-grid,
  .tariff-grid {
    grid-template-columns: 1fr;
  }

  .detail-row {
    grid-template-columns: 125px minmax(0, 1fr);
  }

  .right-label {
    border-left: 0;
  }

  .empty-cell {
    display: none;
  }

  .treatment-dates {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
  }

  .tariff-item,
  .tariff-item:nth-child(2n),
  .tariff-item:nth-child(3n) {
    border-right: 0;
  }

  .declaration-row {
    align-items: flex-start;
  }

  .idrg-section {
    margin: 14px 4px;
    padding: 14px 8px;
  }

  .new-claim-btn {
    bottom: 10px;
    right: 10px;
  }

  .idrg-entry-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .idrg-entry-header > div:first-child,
  .idrg-search-actions {
    flex: none;
    margin-left: 0;
  }

  .idrg-search-actions {
    width: 100%;
  }

  .idrg-search-actions > .q-btn {
    right: 24px;
  }

  .procedure-section .idrg-search {
    flex: none;
    margin-left: 0;
  }

  .idrg-search {
    width: 100%;
  }

  .idrg-entry-list,
  .idrg-empty {
    margin-left: 0;
    padding-left: 0;
  }

  .idrg-primary-editor {
    margin-left: 0;
  }

  .idrg-procedure-editor {
    margin-left: 0;
  }

  .idrg-procedure-editor {
    align-items: flex-start;
    flex-direction: column;
  }

  .procedure-substitution-group,
  .procedure-quantity-group {
    width: 100%;
  }

  .procedure-quantity-group {
    margin-left: 0;
  }

  .idrg-result-row {
    grid-template-columns: 110px 1fr;
  }

  .result-with-code {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
