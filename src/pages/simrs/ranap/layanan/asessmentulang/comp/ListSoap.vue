<template>
  <div class="full-width full-height q-pa-sm" :class="items?.length ? 'scroll' : ''">
    <div v-if="!items?.length" class="q-pa-md column full-height flex-center">
      <div>Belum Ada Data Tersimpan</div>
    </div>
    <q-card v-else v-for="(item, n) in items" :key="item.id" flat bordered rouunded class="full-width q-mb-sm">
      <q-list bordered class="rounded-borders">
        <q-expansion-item>
          <template #header>
            <q-item-section avatar>
              <q-avatar :color="warnaAvatar(item?.nakes)" text-color="white">
                {{ titleAvatar(item?.nakes) }}
              </q-avatar>
            </q-item-section>

            <q-item-section caption>
              <div class="flex items-center">
                <span class="text-weight-bold">PPA</span> <span class="text-weight-medium">- {{ item?.petugas?.nama }}</span>
                <span v-if="item?.kdruang === 'PEN001'" class="q-ml-sm">
                  <q-badge color="deep-purple" text-color="white" label="Instruksi Pasca Bedah" />
                </span>
              </div>
            </q-item-section>

            <q-item-section side>
              <div class="flex q-gutter-lg items-center">
                <div>

                  <!-- Tombol / Status Notasi & Verifikasi DPJP -->
                  <div v-if="item?.nakes === '1' && item?.kdruang !== 'PEN001'">
                    <!-- JIKA USER YANG SEDANG LOGIN ADALAH DPJP PASIEN -->
                    <template v-if="isCurrentUserDpjp">
                      <q-btn
                        size="sm"
                        rounded
                        unelevated
                        :color="getNotasiItem(item) ? 'positive' : 'deep-orange'"
                        class="text-weight-bold"
                        :icon="getNotasiItem(item) ? 'icon-mat-verified' : 'icon-mat-assignment_turned_in'"
                        :label="getNotasiItem(item) ? (hasCustomNotasi(item) ? 'Edit Notasi DPJP' : 'Terverifikasi DPJP') : 'Verif / Notasi DPJP'"
                        @click="handleOpenNotasiDPJP(item)"
                      >
                        <q-tooltip>{{ getNotasiItem(item) ? 'Klik untuk ubah verifikasi atau catatan notasi DPJP' : 'Klik untuk Verifikasi atau Isi Notasi sebagai DPJP' }}</q-tooltip>
                      </q-btn>
                    </template>

                    <!-- JIKA USER YANG SEDANG LOGIN BUKAN DPJP -->
                    <template v-else>
                      <q-btn
                        v-if="getNotasiItem(item)"
                        size="sm"
                        rounded
                        outline
                        color="positive"
                        icon="icon-mat-verified"
                        :label="hasCustomNotasi(item) ? 'Lihat Notasi DPJP' : 'Terverifikasi DPJP'"
                        @click="handleOpenNotasiDPJP(item)"
                      >
                        <q-tooltip>Klik untuk melihat detail verifikasi / notasi dari DPJP</q-tooltip>
                      </q-btn>
                      <q-badge
                        v-else
                        outline
                        color="negative"
                        class="q-px-sm q-py-xs text-caption"
                      >
                        <q-icon name="icon-mat-hourglass_empty" size="14px" class="q-mr-xs" />
                        <span>Belum Verif DPJP</span>
                      </q-badge>
                    </template>
                  </div>
                </div>
                <div v-if="auth?.user?.pegawai?.kdpegsimrs === item?.user && item?.kdruang !== 'PEN001'">
                  <q-btn round flat size="sm" icon="icon-mat-delete" color="negative" @click="deleteItem(item)">
                    <q-tooltip> Hapus Cppt </q-tooltip>
                  </q-btn>
                </div>
                <div>
                  <div class="text-grey-8">
                    <span class="text-weight-bold">Tgl</span> <em class="text-weight-medium"> {{
                      dateFullFormat(item?.tgl) }}</em>
                  </div>
                  <div class="text-grey-8 q-mt-xs">
                    <q-badge class="q-px-sm q-py-xs" outline color="primary">
                      <div class="flex q-gutter-sm">
                        <div class="">
                          Jam
                        </div>
                        <div>:</div>
                        <div class="text-weight-bold">
                          {{ jamTnpDetik(item?.tgl) }}
                        </div>
                      </div>
                    </q-badge>
                  </div>
                </div>


              </div>
            </q-item-section>
          </template>

          <q-card bordered flat class="bg-grey-4">
            <div class="q-pa-md">
              <div class="row q-col-gutter-sm">
                <!-- subjective adime(asessment)-->
                <div class="col-3">
                  <q-card flat bordered class="column full-height full-width"
                    style="min-height: 300px; max-width: 100%;">
                    <q-card-section class="col-auto flex justify-between items-center">
                      <div v-if="nakes !== '5' && item?.petugas?.kdgroupnakes !== '5'" class="f-20">
                        Subjective
                      </div>
                      <div v-else class="f-20">
                        Assessment
                      </div>
                      <q-btn v-if="nakes !== '4' && nakes !== '5' && nakes !== '6' && item?.kdruang !== 'PEN001'" dense bordered outline round
                        icon="icon-mat-edit" size="sm" color="primary" @click="() => {
                          if (auth?.user?.pegawai?.kdpegsimrs !== item?.user) {
                            notifBottomVue('Maaf ... anda bukan USER Peng-input CPPT ini, Harap Edit Punya Sendiri...');
                            return
                          }
                          editFormAnamnesis(item)
                          // console.log('auth', auth?.user?.pegawai?.kdpegsimrs, item?.user)
                        }" />
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section class="col full-height scroll">
                      <div
                        v-if="(nakes !== '4' && nakes !== '5' && nakes !== '6') &&
                          (item?.petugas?.kdgroupnakes !== '4' && item?.petugas?.kdgroupnakes !== '5' && item?.petugas?.kdgroupnakes !== '6')"
                        class="column q-mb-sm">
                        <div><b>Keluhan Utama : </b></div>
                        <div class="q-ml-sm">
                          <span v-html="getNewLine(item?.anamnesis?.keluhanUtama)" />
                        </div>

                        <div class="column q-mb-sm">
                          <div><b>Nyeri :</b></div>
                          <item-nyeri :item="item?.anamnesis?.keluhannyeri?.pediatrik"
                            v-if="item?.anamnesis?.keluhannyeri?.pediatrik" />
                          <!-- neonatal -->
                          <item-nyeri :item="item?.anamnesis?.keluhannyeri?.neonatal"
                            v-else-if="item?.anamnesis?.keluhannyeri?.neonatal" />
                          <item-nyeri :item="item?.anamnesis?.keluhannyeri?.kebidanan"
                            v-else-if="item?.anamnesis?.keluhannyeri?.kebidanan" />
                          <item-nyeri :item="item?.anamnesis?.keluhannyeri?.dewasa" v-else />
                        </div>
                      </div>
                      <q-input v-else ref="refInputSsambung" v-model="item.s_sambung" :readonly="item?.kdruang === 'PEN001'" outlined type="textarea"
                        stack-label standout="bg-yellow-3" :lazy-rules="true" rows="8" hide-bottom-space @blur="updateSsambung(item, item.s_sambung, 's_sambung')" />
                    </q-card-section>
                  </q-card>
                </div>

                <!-- objective adime(diagnosa)-->
                <div class="col-3">
                  <q-card flat bordered class="column full-height full-width"
                    style="min-height: 300px; max-width: 100%;">
                    <q-card-section class="col-auto flex justify-between items-center">
                      <div v-if="nakes !== '5' && item?.petugas?.kdgroupnakes !== '5'" class="f-20">
                        Objective
                      </div>
                      <div v-else class="f-20">
                        Diagnosa
                      </div>
                      <q-btn
                        v-if="(nakes !== '4' && nakes !== '5' && nakes !== '6') && (item?.petugas?.kdgroupnakes !== '4' && item?.petugas?.kdgroupnakes !== '5' && item?.petugas?.kdgroupnakes !== '6') && item?.kdruang !== 'PEN001'"
                        dense bordered outline round icon="icon-mat-edit" size="sm" color="primary" @click="() => {
                          if (auth?.user?.pegawai?.kdpegsimrs !== item?.user && auth?.user?.pegawai?.kdpegsimrs !== 'sa') {
                            notifBottomVue('Maaf ... anda bukan USER Peng-input CPPT ini, Harap Edit Punya Sendiri...');
                            return
                          }
                          editFormPemeriksaan(item)
                        }" />
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section class="col full-height scroll">
                      <div
                        v-if="(nakes === '1' || nakes === '2' || nakes === '3') && (item?.petugas?.kdgroupnakes === '1' || item?.petugas?.kdgroupnakes === '2' || item?.petugas?.kdgroupnakes === '3')"
                        class="column">
                        <div><b>Ku : </b> <span>{{ item?.pemeriksaan?.keadaanUmum }}</span></div>
                        <div><b>BB : </b> <span>{{ item?.pemeriksaan?.bb }} Kg</span></div>
                        <div><b>TB : </b> <span>{{ item?.pemeriksaan?.tb }} Cm</span></div>
                        <div><b>Nadi : </b> <span>{{ item?.pemeriksaan?.nadi }} (x/mnt)</span></div>
                        <div><b>Sis : </b> <span>{{ item?.pemeriksaan?.sistole }} (mmHg)</span></div>
                        <div><b>Dia : </b> <span>{{ item?.pemeriksaan?.diastole }} (mmHg)</span></div>
                        <div><b>RR : </b> <span>{{ item?.pemeriksaan?.pernapasan }} (x/mnt)</span></div>
                        <div><b>SpO2 : </b> <span>{{ item?.pemeriksaan?.spo }} (%)</span></div>
                        <div><b>Suhu : </b> <span>{{ item?.pemeriksaan?.suhu }} (C)</span></div>
                        <div><b>T/k : </b> <span>{{ item?.pemeriksaan?.tkKesadaranKet }}</span></div>

                        <q-separator class="q-my-xs" />
                        <!-- Penilaian -->
                        <div>
                          <!-- <div v-if="item?.penilaian?.norton">
                            <div v-for="(val, key) in item?.penilaian?.norton" :key="key" class="flex">
                              {{ storePenilaian?.nortons?.form?.find(x=>x?.kode === key)?.label ?? '-' }}  {{ val?.label }}
                            </div>
                          </div> -->
                          <!-- <q-separator class="q-my-xs" /> -->
                          <div v-if="item?.penilaian?.humpty_dumpty">
                            <div class="column">
                              <b>Resiko Jatuh : </b>
                              <div> - {{ item?.penilaian?.humpty_dumpty?.skorHumpty?.label }} ({{
                                item?.penilaian?.humpty_dumpty?.skorHumpty?.skor }})</div>
                            </div>
                          </div>
                          <div v-if="item?.penilaian?.morse_fall">
                            <div class="column">
                              <b>Resiko Jatuh : </b>
                              <div> - {{ item?.penilaian?.morse_fall?.skorMorse?.label }} ({{
                                item?.penilaian?.morse_fall?.skorMorse?.skor }})</div>
                            </div>
                          </div>
                          <div v-if="item?.penilaian?.ontario">
                            <div class="column">
                              <b>Resiko Jatuh : </b>
                              <div> - {{ item?.penilaian?.ontario?.skorOntario?.label }} ({{
                                item?.penilaian?.ontario?.skorOntario?.skor }})</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <q-input ref="refInputOsambung" v-model="item.o_sambung" :readonly="item?.kdruang === 'PEN001'" outlined type="textarea" stack-label
                        standout="bg-yellow-3" :lazy-rules="true" rows="5" hide-bottom-space @blur="updateOsambung(item, item.o_sambung, 'o_sambung')" />
                    </q-card-section>
                  </q-card>
                </div>

                <!-- asessment adime(intervensi) -->
                <div class="col-3">
                  <q-card flat bordered class="column full-height full-width"
                    style="min-height: 300px; max-width: 100%;">
                    <q-card-section class="col-auto flex justify-between items-center">
                      <div v-if="nakes !== '5' && item?.petugas?.kdgroupnakes !== '5'" class="f-20">
                        Asessment
                      </div>
                      <div v-else class="f-20">
                        Intervensi
                      </div>
                      <q-btn
                        v-if="(nakes !== '4' && nakes !== '5' && nakes !== '6') && (item?.petugas?.kdgroupnakes !== '4' && item?.petugas?.kdgroupnakes !== '5' && item?.petugas?.kdgroupnakes !== '6') && item?.kdruang !== 'PEN001'"
                        dense bordered outline round icon="icon-mat-edit" size="sm" color="primary" @click="() => {

                          if (auth?.user?.pegawai?.kdpegsimrs !== item?.user && auth?.user?.pegawai?.kdpegsimrs !== 'sa') {
                            notifBottomVue('Maaf ... anda bukan USER Peng-input CPPT ini, Harap Edit Punya Sendiri...');
                            return
                          }

                          if (nakes === '2') {
                            store.initDiagnosaKeperawatan(item)
                            editFormAsessment(item)
                          } else if (nakes === '3') {
                            store.initDiagnosaKebidanan(item)
                            editFormAsessment(item, 'asessmentKebidanan')
                          }
                        }" />
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section class="col full-height scroll">
                      <div class="column">
                        <div>
                          <span v-html="getNewLine(item?.asessment ?? 'Belum Terisi')" />
                          <q-popup-edit fit
                            v-if="(auth?.user?.pegawai?.kdpegsimrs === item?.user || auth?.user?.pegawai?.kdpegsimrs === 'sa') && item?.kdruang !== 'PEN001'"
                            buttons v-model="item.asessment" :cover="false" :offset="[0, 10]" v-slot="scope"
                            :validate="validInput" @hide="validInput" @save="(val, initial) => {
                              // console.log('initial', initial); // before
                              // console.log('valid', isErrInput); //now
                              updateAsPlanInst(item, val, initial, 'asessment')
                            }">
                            <q-input type="textarea" v-model="scope.value" autofocus @keyup.enter.stop />
                          </q-popup-edit>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- plann adime(monitoring) -->
                <div class="col-3">
                  <q-card flat bordered class="column full-height full-width"
                    style="min-height: 300px; max-width: 100%;">
                    <q-card-section class="col-auto flex justify-between items-center">
                      <div v-if="nakes !== '5' && item?.petugas?.kdgroupnakes !== '5'" class="f-20">
                        Plan
                      </div>
                      <div v-else class="f-20">
                        Monitoring
                      </div>
                      <q-btn
                        v-if="(nakes !== '4' && nakes !== '5' && nakes !== '6') && (item?.petugas?.kdgroupnakes !== '4' && item?.petugas?.kdgroupnakes !== '5' && item?.petugas?.kdgroupnakes !== '6') && item?.kdruang !== 'PEN001'"
                        dense bordered outline round icon="icon-mat-edit" size="sm" color="primary" @click="() => {

                          if (auth?.user?.pegawai?.kdpegsimrs !== item?.user && auth?.user?.pegawai?.kdpegsimrs !== 'sa') {
                            notifBottomVue('Maaf ... anda bukan USER Peng-input CPPT ini, Harap Edit Punya Sendiri...');
                            return
                          }

                          if (nakes === '2') {
                            store.initDiagnosaKeperawatan(item)
                            editFormPlan(item)
                          } else if (nakes === '3') {
                            store.initDiagnosaKebidanan(item)
                            editFormPlan(item, 'diagnosaKebidanan')
                          }
                        }" />
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section class="col full-height scroll">
                      <div class="column">
                        <div>
                          <span v-html="getNewLine(item?.plann ?? 'Belum Terisi')" />
                          <q-popup-edit
                            v-if="(auth?.user?.pegawai?.kdpegsimrs === item?.user || auth?.user?.pegawai?.kdpegsimrs === 'sa') && item?.kdruang !== 'PEN001'"
                            fit buttons v-model="item.plann" :cover="false" :offset="[0, 10]" v-slot="scope"
                            :validate="validInput" @hide="validInput" @save="(val, initial) => {
                              // console.log('initial', initial); // before
                              // console.log('val', val); //now
                              updateAsPlanInst(item, val, initial, 'plann')
                            }">
                            <q-input type="textarea" v-model="scope.value" autofocus @keyup.enter.stop />
                          </q-popup-edit>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <!-- instruksi / adime(evaluasi) -->
                <div class="col-12">
                  <q-card flat bordered class="col-12">
                    <q-card-section class="col-auto flex justify-between items-center">
                      <div class="text-h6">
                        {{ (nakes !== '5' && item?.petugas?.kdgroupnakes !== '5') ? 'Instruksi PPA' : 'Evaluasi' }}
                      </div>

                      <q-btn v-if="(nakes === '2' || nakes === '3') && item?.kdruang !== 'PEN001'" dense bordered outline round icon="icon-mat-edit"
                        size="sm" color="primary" @click="() => {

                          if (auth?.user?.pegawai?.kdpegsimrs !== item?.user && auth?.user?.pegawai?.kdpegsimrs !== 'sa') {
                            notifBottomVue('Maaf ... anda bukan USER Peng-input CPPT ini, Harap Edit Punya Sendiri...');
                            return
                          }

                          if (nakes === '2') {
                            store.initDiagnosaKeperawatan(item)
                            editFormIntervensi(item)
                          } else if (nakes === '3') {
                            store.initDiagnosaKebidanan(item)
                            editFormIntervensi(item, 'diagnosaKebidanan')
                          }
                        }" />
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section>
                      <div class="column">
                        <div>
                          <span v-html="getNewLine(item?.instruksi ?? 'Belum Terisi')" />
                          <q-popup-edit
                            v-if="(auth?.user?.pegawai?.kdpegsimrs === item?.user || auth?.user?.pegawai?.kdpegsimrs === 'sa') && item?.kdruang !== 'PEN001'"
                            fit buttons v-model="item.instruksi" :cover="false" :offset="[0, 10]" class="full-width"
                            v-slot="scope" @save="(val, initial) => {
                              // console.log('initial', initial); // before
                              // console.log('val', val); //now
                              updateAsPlanInst(item, val, initial, 'instruksi')
                            }">
                            <q-input type="textarea" rows="5" v-model="scope.value" autofocus :error="isErrInput"
                              :error-message="errMsg" @keyup.enter.stop />
                          </q-popup-edit>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </q-card>
        </q-expansion-item>

        <q-separator />
      </q-list>
    </q-card>

    <DialogFormItem v-model="settings.isChildForm" :pasien="props.pasien" :kasus="props.kasus" :nakes="props.nakes"
      :settings="settings" @on-hide="settings.isEdit = false" @on-click="() => {
        // console.log('edit', settings);
        if (settings.formOpen === 'anamnesis') {
          updateToServerAnamnesis(props.kasus)
        } else if (settings.formOpen === 'pemeriksaan') {
          updateToServerPemeriksaan(props.kasus)
        } else if (settings.formOpen === 'asessment' || settings.formOpen === 'asessmentKebidanan') {
          updateToServerAsessment(props.nakes)
        } else if (settings.formOpen === 'diagnosaKeperawatan' && settings.categoryIntervensi === 'plann') {
          updateToServerPlan(props.nakes)
        } else if (settings.formOpen === 'diagnosaKeperawatan' && settings.categoryIntervensi === 'intervensi') {
          updateToServerPlan(props.nakes)
        } else if (settings.formOpen === 'diagnosaKebidanan' && settings.categoryIntervensi === 'plann') {
          updateToServerPlan(props.nakes)
        } else if (settings.formOpen === 'diagnosaKebidanan' && settings.categoryIntervensi === 'intervensi') {
          updateToServerPlan(props.nakes)
        }

      }" />

    <!-- dialog diagnosa keperawatan -->
    <modal-diagnosa-keperawatan :key="props?.pasien" v-model="storeDiagnosaKeperawatan.modalOpen"
      :masters="storeDiagnosaKeperawatan.diagnosas" @ok="() => {
        console.log('storeDiagnosaKeperawatan', storeDiagnosaKeperawatan.selectDiagnosa);

      }" />

    <DialogNotasiDpjp v-model="openNotasi" :item="itemx" :pasien="props.pasien" @on-hide="itemx = null"
      @exit="openNotasi = false" :store="store" :auth="auth" />

    <!-- Dialog Pilihan Tindakan DPJP -->
    <q-dialog v-model="dialogPilihanDpjp" persistent>
      <q-card style="min-width: 460px; max-width: 520px; border-radius: 12px;">
        <q-bar class="bg-primary text-white q-py-md">
          <q-icon name="icon-mat-fact_check" size="20px" />
          <div class="text-subtitle1 text-weight-bold q-ml-xs">Tindakan DPJP untuk CPPT</div>
          <q-space />
          <q-btn dense flat icon="icon-mat-close" v-close-popup>
            <q-tooltip>Tutup</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-md">
          <!-- Info CPPT -->
          <div class="bg-grey-2 q-pa-sm rounded-borders q-mb-md">
            <div class="row items-center justify-between text-caption text-grey-8">
              <span><b>PPA Pembuat:</b> {{ itemx?.petugas?.nama || "-" }}</span>
              <span><b>Waktu:</b> {{ dateFullFormat(itemx?.tgl) }} {{ jamTnpDetik(itemx?.tgl) }}</span>
            </div>
            <div class="text-caption text-grey-8 q-mt-xs">
              <b>Assessment:</b> {{ itemx?.asessment || "-" }}
            </div>
            <div v-if="getNotasiItem(itemx)" class="q-mt-xs text-caption text-positive text-weight-bold flex items-center">
              <q-icon name="icon-mat-check_circle" size="14px" class="q-mr-xs" />
              <span>Sudah diverifikasi: {{ dateFullFormat(getNotasiItem(itemx)?.tanggal || getNotasiItem(itemx)?.created_at) }} {{ getNotasiItem(itemx)?.jam || jamTnpDetik(getNotasiItem(itemx)?.created_at) }}</span>
            </div>
          </div>

          <div class="text-body2 text-weight-medium q-mb-md">
            Silakan pilih tindakan yang ingin dilakukan oleh Dokter DPJP:
          </div>

          <!-- Opsi 1: Verifikasi Langsung -->
          <q-card
            flat
            bordered
            class="q-pa-md q-mb-sm cursor-pointer"
            style="border: 2px solid #26A69A; background-color: #E0F2F1;"
            @click="handleVerifDirect"
          >
            <div class="row items-center no-wrap">
              <q-avatar color="teal" text-color="white" icon="icon-mat-check_circle" size="42px" class="q-mr-md" />
              <div>
                <div class="text-subtitle2 text-weight-bold text-teal-9">1. Verifikasi CPPT</div>
                <div class="text-caption text-grey-8">
                  Konfirmasi verifikasi CPPT ini sebagai DPJP tanpa perlu mengetik catatan notasi.
                </div>
              </div>
            </div>
          </q-card>

          <!-- Opsi 2: Isi Catatan Notasi -->
          <q-card
            flat
            bordered
            class="q-pa-md cursor-pointer"
            style="border: 2px solid #1976D2; background-color: #E3F2FD;"
            @click="handleOpenFormNotasi"
          >
            <div class="row items-center no-wrap">
              <q-avatar color="primary" text-color="white" icon="icon-mat-edit_note" size="42px" class="q-mr-md" />
              <div>
                <div class="text-subtitle2 text-weight-bold text-primary">2. Isi / Edit Catatan Notasi</div>
                <div class="text-caption text-grey-8">
                  Buka formulir input untuk menuliskan instruksi, koreksi, atau review notasi DPJP.
                </div>
              </div>
            </div>
          </q-card>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Batal" color="grey-7" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { dateFullFormat, jamTnpDetik, dateFilter } from 'src/modules/formatter'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import useForm from './useForm'
import { notifBottomVue, notifSuccessVue } from 'src/modules/utils'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'


const ItemNyeri = defineAsyncComponent(() => import('./itemlist/ItemNyeri.vue'))
const DialogFormItem = defineAsyncComponent(() => import('./dialogformchild/DialogFormItem.vue'))
const DialogNotasiDpjp = defineAsyncComponent(() => import('./dialogformchild/DialogNotasiDpjp.vue'))
const ModalDiagnosaKeperawatan = defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/complayanan/ModalDiagnosaKeperawatan.vue'))

const props = defineProps({
  pasien: { type: Object, default: () => null },
  kasus: { type: Object, default: () => null },
  // items: { type: Array, default: () => [] },
  nakes: { type: String, default: null },
  notasis: { type: Array, default: () => [] },
  store: { type: Object, default: null }

})

const openNotasi = ref(false)
const itemx = ref(null)
const isLewatTgl = ref(false)




const isTanggalLewat = (item) => {
  const tanggal = item?.tgl

  const today = new Date();
  today?.setHours(0, 0, 0, 0); // Reset waktu ke awal hari

  const tanggalLewat = dateFilter(tanggal) < dateFilter(today)
  // console.log('tanggal lewat', tanggalLewat);
  // console.log('tgl', tanggalLewat);
  return tanggalLewat

  // const notasis = props?.notasis?.find((x) => x?.tanggal?.includes(dateFilter(item?.tgl)))
  // return notasis
}
const isNotasiTgl = (item) => {

  const notasis = props?.notasis?.filter((x) => x?.tanggal?.includes(dateFilter(item?.tgl)))
  // console.log('notasis', notasis);

  return notasis
}


// eslint-disable-next-line no-unused-vars
const {
  settings, auth,
  // eslint-disable-next-line no-unused-vars
  editFormAnamnesis,
  editFormPemeriksaan,
  editFormAsessment,
  editFormPlan,
  editFormIntervensi,
  updateToServerAnamnesis,
  updateToServerPemeriksaan,
  updateToServerAsessment,
  updateToServerPlan,
  updateAsPlanInst,
  updateOsambung,
  updateSsambung,
  // eslint-disable-next-line no-unused-vars
  store, storePenilaian, storeDiagnosaKeperawatan
} = useForm(props?.pasien)

const dialogPilihanDpjp = ref(false)
const loadingVerifDirect = ref(false)

const currentUserPegawai = computed(() => {
  return auth?.user?.pegawai?.kdpegsimrs || auth?.user?.kdpegsimrs || auth?.user?.username || ""
})

const dpjpKdPeg = computed(() => {
  return props.pasien?.kodedokter || props.pasien?.kddokter || props.pasien?.kodedokterdpjp || ""
})

const isCurrentUserDpjp = computed(() => {
  return !!currentUserPegawai.value && !!dpjpKdPeg.value && (currentUserPegawai.value === dpjpKdPeg.value || currentUserPegawai.value === "sa")
})

const getNotasiItem = (item) => {
  if (item?.notasi_dpjp) return item.notasi_dpjp
  const found = props.store?.notasis?.find(x => x?.cppt_id === item?.id)
  return found || null
}

const hasCustomNotasi = (item) => {
  const notasi = getNotasiItem(item)
  if (!notasi || !notasi.notasi) return false
  return notasi.notasi !== "Terverifikasi oleh DPJP"
}

const handleOpenNotasiDPJP = (item) => {
  itemx.value = item
  if (isCurrentUserDpjp.value) {
    dialogPilihanDpjp.value = true
  } else {
    openNotasi.value = true
  }
}

const handleOpenFormNotasi = () => {
  dialogPilihanDpjp.value = false
  openNotasi.value = true
}

const handleVerifDirect = async () => {
  if (!itemx.value) return
  loadingVerifDirect.value = true
  try {
    const resp = await api.post('v1/simrs/ranap/layanan/cppt/simpanNotasi', {
      cppt_id: itemx.value.id,
      noreg: props.pasien?.noreg,
      norm: props.pasien?.norm,
      notasi: 'Terverifikasi oleh DPJP'
    })
    if (resp.status === 200) {
      const result = resp?.data?.result
      if (itemx.value) {
        itemx.value.notasi_dpjp = result
      }
      const cppt = props.pasien?.cppt?.find(x => x.id === itemx.value.id)
      if (cppt) {
        cppt.notasi_dpjp = result
      }
      props.store?.getNotasiDpjp(props.pasien?.noreg)
      notifSuccessVue('CPPT berhasil diverifikasi oleh DPJP')
      dialogPilihanDpjp.value = false
    }
  } catch (err) {
    console.error('Error verifikasi DPJP:', err)
  } finally {
    loadingVerifDirect.value = false
  }
}

const items = ref([])
watch([() => store.items, () => store.items?.length], () => {
  const cppt = store.items
  items.value = cppt ? [...cppt].sort((a, b) => b?.id - a?.id) : []
}, { immediate: true })

// console.log('props', items.value)

function getNewLine(text) {
  // console.log('text', text)

  return text?.replace(/\n/g, '<br/>')
}

const warnaAvatar = (kat) => {
  // item?.nakes==='2'? 'accent' : (item?.nakes==='1'? 'primary' : 'teal'
  let r = 'accent'
  if (kat === '2') {
    r = 'accent'
  }
  else if (kat === '1') {
    r = 'primary'
  }
  else if (kat === '3') {
    r = 'teal'
  }
  else if (kat === '4') {
    r = 'teal'
  }
  else if (kat === '5') {
    r = 'orange'
  }
  else {
    r = 'dark'
  }

  return r
}
const titleAvatar = (kat) => {
  // item?.nakes==='2'? 'accent' : (item?.nakes==='1'? 'primary' : 'teal'
  let r = 'Ns'
  if (kat === '2') {
    r = 'Ns'
  }
  else if (kat === '1') {
    r = 'Dr'
  }
  else if (kat === '3') {
    r = 'Bd'
  }
  else if (kat === '4') {
    r = 'Ap'
  }
  else if (kat === '5') {
    r = 'Gz'
  }
  else {
    r = 'Fs'
  }

  return r
}

const isErrInput = ref(false)
const errMsg = ref('')

const validInput = (val) => {
  if (val?.trim()?.length === 0) {
    isErrInput.value = true
    errMsg.value = 'Tidak boleh kosong'
    return false
  }
  isErrInput.value = false
  errMsg.value = ''
  return true
}

const $q = useQuasar()

const deleteItem = (item) => {
  // console.log('delete', item)
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // console.log('OK')
    store.deleteData(props.pasien, item?.id)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

</script>
