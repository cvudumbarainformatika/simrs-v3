<template>

  <q-card style="width:100%" class="bg-primary text-white">
    <q-card-section>
      <div class="row items-center">
        <div class="">
          <q-avatar size="60px">
            <img :src="getImage(item)">
          </q-avatar>
        </div>
        <div class="q-ml-md">
          <div class="absolute-top-right q-pa-sm">
            <div class="text-h6">
              {{ item?.user?.id }}
            </div>
          </div>
          <div class="flex flex-nowrap">
            <strong class="q-mr-md">Nik : </strong> {{ item.nik }}
          </div>
          <div class="flex flex-nowrap">
            <strong>Nip : </strong> {{ item.nip }}
          </div>
          <div class="ellipsis">
            <strong>Nama : </strong> {{ item.nama }}
          </div>
          <div class="ellipsis">
            <strong>Ruangan : </strong> {{ item.ruangan ? item.ruangan.namaruang : '-' }}
          </div>
          <div class="ellipsis row items-center">
            <strong>Akses Ruang: </strong>
            <q-btn :label="item.ruang ? item.ruang.uraian : 'tidak ada akses ruang'" no-caps flat size="12px"
              :loading="store.loadingRuang">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item>
                    <app-input v-model="store.par.q" label="cari ruang" debounce="800" outlined valid
                      :loading="store.loadingRuang" @update:model-value="store.getRuang" />
                  </q-item>
                  <q-item v-for="(ruang, i) in store.ruangs" :key="i" v-close-popup clickable
                    @click="store.setRuang(ruang)">
                    <q-item-section>{{ ruang.uraian }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <div class="ellipsis">
            <strong>Akses Role : </strong>
            <q-btn :label="item.role ? item.role.nama : 'tidak ada akses role'" no-caps flat size="12px"
              :loading="store.loadingRole">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item v-for="(role, i) in store.roles" :key="i" v-close-popup clickable
                    @click="store.setRole(role)">
                    <q-item-section>{{ role.nama }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <div class="ellipsis">
            <strong>Poli : </strong>
            <q-btn :label="ruangan(item)" no-caps flat size="12px" :loading="store.loadingPoli" @click="setpoli(item)">
              <q-menu ref="refMenu" @hide="hideMenu">
                <div class="fixed-top pos bg-white">
                  <app-btn class="full-width q-mb-sm" label="simpan" color="green" :loading="store.loadingPoli"
                    @click="simpan" />
                  <app-input v-model="filt" outlined label="cari poli" autofocus valid @update:model-value="filter" />
                </div>
                <q-list class="q-mt-xl q-mt-xl" style="min-width: 100px;">
                  <q-item v-for="(poli, i) in filtered" :key="i" v-close-popup clickable>
                    <!-- @click="store.setPoli(poli)" -->
                    <q-item-section avatar>
                      <q-checkbox v-model="kodepolis" :val="poli?.kodepoli" color="teal" />
                    </q-item-section>
                    <q-item-section>{{ poli?.polirs }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <div class="ellipsis">
            <strong>Gudang / Depo : </strong>
            <q-btn :label="gudang(item)" no-caps flat size="12px" :loading="store.loadingGudang"
              @click="setGudang(item)">
              <q-menu ref="refMenu" @hide="hideMenu">
                <div class="fixed-top pos-g bg-white">
                  <app-btn class="full-width q-mb-sm" label="simpan" color="green" :loading="store.loadingGudang"
                    @click="simpanGudang" />
                  <app-input v-model="gud" outlined label="cari gudang" autofocus valid
                    @update:model-value="filterGud" />
                </div>
                <q-list class="q-mt-xl q-mt-xl" style="min-width: 100px;">
                  <q-item v-for="(poli, i) in filteredGud" :key="i" v-close-popup clickable>
                    <!-- @click="store.setPoli(poli)" -->
                    <q-item-section avatar>
                      <q-checkbox v-model="kodegudangs" :val="poli?.kode" color="teal" />
                    </q-item-section>
                    <q-item-section>
                      <div class="row justify-between">
                        <div>
                          {{ poli?.nama }}
                        </div>
                        <div>
                          ({{ poli?.kode }})
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <div class="ellipsis">
            <strong>Ruangan sim : </strong>
            <q-btn :label="ruangsim(item)" no-caps flat size="12px" :loading="store.loadingRuangSim"
              @click="setRuanganSim(item)">
              <q-menu ref="refMenu" @hide="hideMenu">
                <div class="fixed-top pos-r bg-white">
                  <app-btn class="full-width q-mb-sm" label="simpan" color="green" :loading="store.loadingRuangSim"
                    @click="simpanRunganSim" />
                  <app-input v-model="rua" outlined label="cari gudang" autofocus valid
                    @update:model-value="filterRuang" />
                </div>
                <q-list class="q-mt-xl q-mt-xl" style="min-width: 100px;">
                  <q-item v-for="(poli, i) in filteredRua" :key="i" v-close-popup clickable>
                    <!-- @click="store.setPoli(poli)" -->
                    <q-item-section avatar>
                      <q-checkbox v-model="koderuang" :val="poli?.kode" color="teal" />
                    </q-item-section>
                    <q-item-section>
                      <div class="row justify-between">
                        <div>
                          {{ poli?.uraian }}
                        </div>
                        <div>
                          ({{ poli?.kode }})
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <div class="ellipsis row items-center">
            <strong>Unit Pengelolah Arsip: </strong>
            <q-btn :label="item.kdarteri ? item.unitpengelolaharsip.nama : 'Unit Pengelolah Arsip'" no-caps flat
              size="12px" :loading="store.loadingUnitPengolahArsip">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item>
                    <app-input v-model="store.par.q" label="cari unitpengolah" debounce="800" outlined valid
                      :loading="store.loadingUnitPengolahArsip" />
                  </q-item>
                  <q-item v-for="(unitpengelolahs, u) in unitpengelolah" :key="u" v-close-popup clickable
                    @click="store.setUnitpengolaharsip(unitpengelolahs?.kode)">
                    <q-item-section>{{ unitpengelolahs?.nama }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-card style="width:100%" class="q-mt-md">
    <q-card-section>
      <q-list bordered separator>
        <q-item v-if="!menus?.length" class="text-blue">
          <q-item-section avatar>
            <q-icon name="icon-mat-receipt_long" />
          </q-item-section>
          <q-item-section>
            Belum ada Data
          </q-item-section>
        </q-item>
        <q-item v-if="menus?.length" class="text-blue">
          <q-item-section>
            <q-checkbox v-model="check" dense :disable="loading" @update:model-value="$emit('allCheck', check)" />

            <q-item-section>
              Full controll
            </q-item-section>
          </q-item-section>
        </q-item>
        <template v-if="menus?.length">
          <q-expansion-item v-for="(app, i) in menus" :key="i" expand-icon-toggle>
            <template #header>
              <q-item-section>
                <q-checkbox v-model="app.checked" dense :disable="loading"
                  @update:model-value="$emit('appCheck', { 'app': app, 'i': i })" />
              </q-item-section>
              <q-item-section avatar>
                <q-icon :name="app.icon" />
              </q-item-section>
              <q-item-section>
                {{ app.julukan }}
              </q-item-section>
            </template>
            <template v-for="(menu, n) in app.menus" :key="n">
              <q-item v-if="menu.submenus?.length === 0" v-ripple clickable class="q-ml-lg">
                <q-item-section>
                  <q-checkbox v-model="menu.checked" dense :disable="loading"
                    @update:model-value="$emit('menuCheck', { 'menu': menu, 'i': i, 'n': n })" />
                </q-item-section>
                <q-item-section>
                  <q-icon :name="menu.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menu.nama }}
                </q-item-section>
              </q-item>
              <q-expansion-item v-else :label="menu.nama" expand-separator class="q-pl-lg" dense-toggle
                hide-expand-icon>
                <template #header>
                  <q-item-section>
                    <q-checkbox v-model="menu.checked" dense :disable="loading"
                      @update:model-value="$emit('menuCheck', { 'menu': menu, 'i': i, 'n': n })" />
                  </q-item-section>
                  <q-item-section>
                    <q-icon :name="menu.icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ menu.nama }}
                  </q-item-section>
                </template>
                <q-list separator class="q-pl-lg">
                  <q-item v-for="(sub, x) in menu.submenus" :key="x" v-ripple clickable>
                    <q-item-section>
                      <q-checkbox v-model="sub.checked" dense :disable="loading"
                        @update:model-value="$emit('submenuCheck', { 'sub': sub, 'i': i, 'n': n, 'x': x })" />
                    </q-item-section>
                    <q-item-section>
                      <q-icon :name="sub.icon" />
                    </q-item-section>
                    <q-item-section>
                      {{ sub.nama }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </template>
          </q-expansion-item>
        </template>
      </q-list>
    </q-card-section>
  </q-card>
  <q-card>
    <!-- <q-card-actions
      v-if="menus?.length"
      align="right"
    >
      <app-btn
        label="simpan"
        :loading="store.loading"
        :disable="store.loading"
        @click="$emit('simpan',menus)"
      />
    </q-card-actions> -->
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsAplikasi } from 'src/stores/simrs/settings'
const store = useSettingsAplikasi()
const filtered = ref(store.polis)
const kodepolis = ref(null)
const filt = ref('')
const filteredGud = ref(store.gudangs)
const kodegudangs = ref(null)
const gud = ref('')
const filteredRua = ref(store.ruangansims)
const koderuang = ref(null)
const rua = ref('')
function filter(val) {
  if (val) {
    filtered.value = store.polis.filter(a => a.polirs.toLowerCase().includes(val.toLowerCase()))
  }
}
function filterGud(val) {
  if (val) {
    filteredGud.value = store.gudangs.filter(a => a.nama.toLowerCase().includes(val.toLowerCase()))
  }
}
function filterRuang(val) {
  if (val) {
    filteredRua.value = store.ruangansims.filter(a => a.uraian.toLowerCase().includes(val.toLowerCase()))
  }
}
defineProps({
  item: {
    type: Object,
    default: () => { }
  },
  menus: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  unitpengelolah: {
    type: Array,
    default: () => []
  },
})

const refMenu = ref(null)
function hideMenu() {
  kodepolis.value = null
}
function setpoli(val) {
  kodepolis.value = val.kdruangansim.split('|')
}
function simpan() {
  const anu = kodepolis.value?.length ? kodepolis.value.filter(a => a?.length > 4) : null
  const arr = anu?.join('|') ?? null
  console.log('kode', anu)
  console.log(arr)
  store.simpanPoli(arr).then(() => {
    refMenu.value.hide()
  })
}
function simpanGudang() {
  const anu = kodegudangs.value?.length ? kodegudangs.value.filter(a => a?.length > 4) : null
  const arr = anu?.join('|') ?? null
  console.log('kode', anu)
  console.log(arr)
  store.simpanGudang(arr).then(() => {
    refMenu.value.hide()
  })
}
function simpanRunganSim() {
  const anu = koderuang.value?.length ? koderuang.value?.filter(a => a?.length > 4) : null
  const arr = anu?.join('|') ?? null
  console.log('kode', anu)
  console.log(arr)
  store.simpanRuanganSim(arr).then(() => {
    refMenu.value.hide()
  })
}
function ruangan(val) {
  let fin = null
  if (val.kdruangansim) {
    const temp = val.kdruangansim.split('|')
    const anu = []
    if (temp?.length) {
      temp.forEach(a => {
        const pol = store.polis.filter(b => b.kodepoli === a)
        if (pol?.length) anu.push(pol[0])
      })
      if (anu?.length) {
        fin = anu.map(x => x.polirs).join(', ')
      }
    }
  }
  const ruang = fin ?? 'Tidak ada Akses Poli'
  // console.log(ruang)

  return ruang
}

function setGudang(val) {
  kodegudangs.value = val.kdruangansim.split('|')
}
function gudang(val) {
  let fin = null
  if (val.kdruangansim) {
    const temp = val.kdruangansim.split('|')
    const anu = []
    if (temp?.length) {
      temp.forEach(a => {
        const pol = store.gudangs.filter(b => b.kode === a)
        if (pol?.length) anu.push(pol[0])
      })
      if (anu?.length) {
        fin = anu.map(x => x.nama).join(', ')
      }
    }
  }
  const ruang = fin ?? 'Tidak ada Akses Gudang / Depo'
  console.log(ruang)

  return ruang
}

function setRuanganSim(val) {
  koderuang.value = val.kdruangansim.split('|')
}
function ruangsim(val) {
  let fin = null
  if (val.kdruangansim) {
    const temp = val.kdruangansim.split('|')
    const anu = []
    if (temp?.length) {
      temp.forEach(a => {
        const pol = store.ruangansims.filter(b => b.kode === a)
        if (pol?.length) anu.push(pol[0])
      })
      if (anu?.length) {
        fin = anu.map(x => x.uraian).join(', ')
      }
    }
  }
  const ruang = fin ?? 'Tidak ada Akses Ruangan Sim'
  console.log(ruang)

  return ruang
}
defineEmits(['simpan', 'allCheck', 'appCheck', 'menuCheck', 'submenuCheck'])

const check = ref(false)

function getImage(row) {
  const kelamin = row.kelamin
  if (row.foto_pegawai === null || row.foto_pegawai === '' || row.foto_pegawai === 'undefined') {
    return kelamin === 'Perempuan'
      ? new URL('../../../../assets/images/actress.svg', import.meta.url).href
      : new URL('../../../../assets/images/user-avatar.svg', import.meta.url).href
  }
  else {
    // return 'http://192.168.100.100/simpeg/foto/' + row.nip + '/' + row.foto
    return row.foto_pegawai
  }
}

</script>
<style lang="scss" scoped>
.pos {

  width: 280px;
  margin-top: 130px;
  margin-left: 138px;
}

.pos-g {

  width: 448px;
  margin-top: 170px;
  margin-left: 208px;
}

.pos-r {

  width: 446px;
  margin-top: 200px;
  margin-left: 199px;
}
</style>
