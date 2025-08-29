<template>
  <div v-if="store.items?.length">
    <q-item class="q-pa-none" dense>
      <q-item-section>
        <div class="row bg-dark text-white text-bold q-pa-sm">
          <div class="col-2">
            Noreg
          </div>
          <div class="col-2">
            Norm
          </div>
          <div class="col-2">
            Nomor Pemintaan
          </div>
          <div class="col-2">
            Depo Terkait
          </div>
          <div class="col-2">
            Tanggal Pemintaan
          </div>
          <div class="col-2">
            User minta
          </div>
        </div>
      </q-item-section>
    </q-item>
    <div v-for="(header, i) in store.items" :key="i">
      <q-list separator bordered dense>
        <q-item class="q-pa-none" dense :class="header.detail ? 'bg-yellow-4' : ''">
          <q-item-section>
            <div class="row q-pa-sm cursor-pointer" @click="showDetail(header)">
              <div class="col-2">
                {{ header?.noreg }}
              </div>
              <div class="col-2">
                {{ header?.norm }} || {{ header?.pasien?.rs2 }}
              </div>
              <div class="col-2">
                {{ header?.nopermintaan }}
              </div>
              <div class="col-2">
                {{ depo(header?.depo) }}
              </div>
              <div class="col-2">
                {{ dateFullFormat(header?.tgl_permintaan) }}
              </div>
              <div class="col-2">
                {{ header?.pegawai?.nama }}
              </div>
            </div>
          </q-item-section>
        </q-item>
        <div v-if="header.detail" class="q-ml-md">
          <q-item class="q-pa-none" dense>
            <q-item-section>
              <div class="row q-px-sm q-py-xs bg-dark text-white text-bold q-col-gutter-x-xs">
                <div class="col-3">
                  No Resep
                </div>
                <div class="col-3">
                  Depo
                </div>
                <div class="col-3 text-center ">
                  Flag retur
                </div>
                <div class="col-3 text-right ">
                  Aksi
                </div>
              </div>
            </q-item-section>
          </q-item>
          <template v-for="(item) in header.resep" :key="item">
            <div class="q-pa-none">

              <div class="row items-center q-px-sm q-py-xs q-col-gutter-x-xs"
                :class="item.expand ? 'bg-orange-4 ' : ''">
                <div class="col-3">
                  {{ item?.noresep }}
                </div>
                <div class="col-3">
                  {{ item?.depo }}
                </div>
                <div class="col-3 text-center"
                  :class="item?.header?.flag_permintaan_retur == '1' ? 'text-red bg-yellow' : ''">
                  {{ item?.header?.flag_permintaan_retur == '1' ? 'Belum di retur' : 'Sudah di retur' }}
                </div>
                <div class="col-3 text-right ">
                  <div class="row justify-end q-col-gutter-x-sm">
                    <div v-if="item?.header?.flag_permintaan_retur == '1'" class="col-auto">
                      <app-btn label="Buka retur" color="red" @click="buka(item)" dense />
                    </div>
                    <div class="col-auto">
                      <app-btn :label="item.expand ? 'Tutup Detail' : 'Buka Detail'" @click="expand(item)" dense />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.expand" class="q-ml-lg">
              <div class="row bg-dark text-white text-bold q-pa-xs q-mx-sm">
                <div class="col-4">
                  Nama Obat
                </div>
                <div class="col-4">
                  Satuan
                </div>
                <div class="col-2 text-center">
                  Jumlah Obat Keluar
                </div>
                <div class="col-2 text-center">
                  Retur
                </div>
              </div>
              <div v-for="(rinci, r) in item.rincian" :key="rinci">
                <div class="row q-pa-xs q-mx-sm" :class="r % 2 == 0 ? 'bg-light-blue-2' : ''">
                  <div class="col-4">
                    {{ rinci?.mobat?.nama_obat }}
                  </div>
                  <div class="col-4">
                    {{ rinci?.mobat?.satuan_k }}
                  </div>
                  <div class="col-2 text-center">
                    {{ rinci?.jumlah }}
                  </div>
                  <div class="col-2 text-center">
                    {{ rinci?.retur }}
                  </div>

                </div>

              </div>

            </div>
          </template>
        </div>
      </q-list>
    </div>
  </div>
  <div v-else>
    <app-no-data />
  </div>
</template>
<script setup>
import { dateFullFormat } from 'src/modules/formatter'
import { usePemintaanReturDepoStore } from 'src/stores/simrs/farmasi/retur/depo/permintaan'

const store = usePemintaanReturDepoStore()
const emit = defineEmits(['buka'])

function showDetail (val) {
  val.detail = !val.detail
  if (!val.detail) {
    val?.resep?.forEach(a => a.expand = false)
  }
}
function depo (val) {
  const depo = store.depos.filter(a => val.includes(a.value))
  const nama = depo.map(a => a.nama).join(', ')
  return nama
}

function buka (val) {
  // console.log('buka', val)
  emit('buka', { noresep: val?.noresep })

}
function expand (val) {
  val.expand = !val.expand

}
</script>
<style lang="scss" scoped>
.q-item {
  line-height: 8px;
  max-height: 40px;
}

.q-item__section--main {
  line-height: 8px;
  max-height: 40px;
}
</style>
