<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="f-14 text-weight-bold">
          Penerimaan Depo
        </div>
        <div class="title-desc">
          Halaman Penerimaan oleh Depo
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center q-mb-sm">
          <div class="col-2 q-mr-sm">
            Nomor Distribusi
          </div>
          <div class="col">
            <app-autocomplete-new
              ref="refDistribusi"
              label="pilih nomor distribusi"
              :model="store.form.id"
              autocomplete="no_distribusi"
              option-label="no_distribusi"
              option-value="id"
              :loading="store.loadingMinMaxDepos && store.loadingStoks"
              :disable="store.loadingMinMaxDepos && store.loadingStoks"
              :source="store.toDistribute"
              @on-select="disSelected"
              @clear="disCleared"
            />
          </div>
        </div>
        <div class="row items-center q-mb-sm">
          <div class="col-2 q-mr-sm">
            Depo Tujuan
          </div>
          <div class="col">
            <div v-if="!Object.keys(store.display)?.length">
              -
            </div>
            <div v-if="Object.keys(store.display)?.length">
              <q-chip
                color="primary"
                text-color="white"
                class="chip-able"
                dense
                square
              >
                <div class="f-12">
                  {{ store.display.depo.nama }}
                </div>
              </q-chip>
            </div>
            <!-- {{ Object.keys(store.display)?.length ? store.display.depo.nama:'-' }} -->
          </div>
        </div>
        <div class="row items-center q-mb-sm">
          <div class="col-2 q-mr-sm">
            tanggal
          </div>
          <div class="col">
            <!-- {{ store.tanggalDisplay }} -->
            <div class="fit row no-wrap justify-start items-center">
              <div>
                {{ store.tanggalDisplay }}
              </div>
              <div class="q-ml-sm">
                <q-btn
                  icon="icon-mat-event"
                  round
                  dense
                  color="primary"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    @show="updateProxy"
                  >
                    <q-date
                      ref="refDate"
                      v-model="store.form.tanggal"
                      mask="YYYY-MM-DD HH:mm:ss"
                      :options="dateOption"
                      @update:model-value="store.setTanggal"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="store.loading ">
        <app-loading />
      </q-card-section>
      <q-card-section v-if="!Object.keys(store.display)?.length && !store.loading">
        <app-no-data />
      </q-card-section>
      <q-card-section v-if="Object.keys(store.display)?.length && !store.loading">
        <!-- header -->
        <div class="fit row no-wrap justify-evenly items-center content-center q-my-xs text-weight-bold">
          <div class="anak text-center">
            Kode Barang
          </div>
          <div class="anak text-center">
            Nama Barang RS
          </div>
          <div class="anak text-center">
            Kode 108
          </div>
          <div class="anak text-center">
            Uraian 108
          </div>
          <div class="anak text-center">
            Stok Gudang
          </div>
          <!-- <div class="anak text-center">
            Stok Minimum Depo
          </div> -->
          <div class="anak text-center">
            Stok Maksimum Depo
          </div>
          <div class="anak text-center">
            Jumlah Distribusi
          </div>
        </div>
        <q-separator />
        <!-- details -->

        <div
          v-for="(data,i) in store.display.details"
          :key="i"
          class="fit row no-wrap justify-evenly items-center content-center q-my-xs"
        >
          <div class="disp text-center">
            {{ data.kode_rs }}
          </div>
          <div class="disp text-center">
            {{ data.barangrs?data.barangrs.nama:'-' }}
          </div>
          <div class="disp text-center">
            {{ data.barangrs?data.barangrs.kode_108:'-' }}
          </div>
          <div class="disp text-center">
            {{ data.barangrs?data.barangrs.uraian_108:'-' }}
          </div>
          <div class="disp text-center">
            {{ data.stok_gudang }}
          </div>
          <!-- <div class="disp text-center">
            {{ data.min_stok }}
          </div> -->
          <div class="disp text-center">
            {{ data.max_stok }}
          </div>
          <div class="disp text-center">
            <q-chip
              color="primary"
              text-color="white"
              class="chip-able"
              dense
              square
              outline
            >
              <div class="f-12">
                {{ data.jumlah }}
              </div>
            </q-chip>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          class="q-mr-lg"
          flat
          color="primary"
          label="Terima"
          no-caps
          icon="icon-mat-save"
          :loading="store.loading"
          :disable="store.loading"
          @click="saveForm"
        />
      </q-card-actions>
      <q-separator />
    </q-card>
  </div>
</template>
<script setup>
// import { notifErrVue } from 'src/modules/utils'
import { date } from 'quasar'
import { dateFullFormat } from 'src/modules/formatter'
import { usePenerimaanDepoStore } from 'src/stores/simrs/logistik/sigarang/transaksi/penerimaandepo/penerimaadepo'
import { ref } from 'vue'

const store = usePenerimaanDepoStore()
store.getInitialData()

const proxyDate = ref(null)
const refDate = ref(null)
const updateProxy = () => {
  console.log('date', store.form.tanggal)
  // refDate.value.setToday()
  proxyDate.value = store.form.tanggal ? store.form.tanggal : date.formatDate(Date.now(), 'YYYY/MM/DD')
  store.setForm('tanggal', proxyDate.value)
  store.tanggalDisplay = dateFullFormat(proxyDate.value)
}
// date options start ----
const today = new Date()
const lastDay = date.formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'YYYY/MM/DD')
const firstDay = date.formatDate(Date.now(), 'YYYY/MM/01')
function dateOption(val) {
  return val >= firstDay && val <= lastDay
}
// date options end ----

const refDistribusi = ref(null)
const disSelected = (val) => {
  // if (!store.minMaxDepos?.length || !store.stoks?.length) {
  //   // notifErrVue('data masih sedang dalam perjalanan, mohon tunggu beberapa saat lagi')
  //   return
  // }

  store.setForm('id', val)
  const disp = store.toDistribute.filter(data => {
    return data.id === val
  })
  store.display = disp[0]
  store.display.details.forEach(data => {
    // data min - max depo tidak ada
    // const mm = store.minMaxDepos.filter(minmax => {
    //   return minmax.kode_rs === data.kode_rs && minmax.kode_depo === store.display.kode_depo
    // })
    // // data.min_stok = mm[0].min_stok
    // data.max_stok = mm[0].max_stok
    const kunci = Object.keys(store.stoks)
    const stk = kunci.map(key => {
      const temp = store.stoks[key]
      if (data.kode_rs === store.stoks[key].kode_rs) return temp
      else return false
    })
    const filtered = stk.filter(stk1 => {
      return stk1 !== false
    })
    data.stok_gudang = filtered[0].stok
    console.log('stok', filtered)
  })
  console.log('display', store.display)
}
const disCleared = () => {
  store.setForm('id', null)
  store.display = {}
  refDistribusi.value.$refs.refAuto.resetValidation()
}
const saveForm = () => {
  store.saveForm().then(() => {
    store.setForm('id', null)
    store.display = {}
    refDistribusi.value.$refs.refAuto.resetValidation()
  })
}
</script>
<style lang="scss" scoped>
.anak{
  width:calc(100vw/7);
}
.disp{
  width:calc(100vw/7);
}
</style>
