<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="props?.loading" />
      <EmptyData v-else-if="!props?.items?.length && !props?.loading" />

      <div v-else class="row q-mt-sm q-ml-sm q-col-gutter-md justify-center items-start">
        <!-- <pre>{{ datamap }}</pre> -->
        <div v-for="(item, i) in datamap" :key="i" class="col-auto">
          <q-card class="cursor-pointer folder-card-elegant" flat bordered @click="dialogrincian(item.id)">
            <!-- ACTION BUTTON -->
            <div class="absolute-top-left q-pa-xs z-top">
              <q-btn round dense flat size="sm" class="action-btn" icon="icon-mat-edit" color="primary"
                @click.stop="editmap(item)" />
            </div>

            <div class="absolute-top-right q-pa-xs z-top">
              <q-btn round dense flat size="sm" class="action-btn" icon="icon-mat-delete" color="red"
                :loading="store.loadinghapusmap[item.id]" @click.stop="hapusmap(item.id)" />
            </div>

            <!-- ICON -->
            <div class="flex justify-center q-pt-lg q-pb-md">
              <q-img :src="folderIcon" style="width:150px; height:160px" fit="contain" no-native-menu />
            </div>

            <!-- CONTENT -->
            <q-card-section class="q-pt-none">
              <div class="row">
                <div class="col-12 text-weight-bold ellipsis" :title="item.namamap">
                  Nama Berkas : {{ item.namamap }}
                </div>
                <div class="col-12" :title="item.keterangan">
                  Tempat : Filing Cabinet {{ item?.kodefelingkabinet }} || Laci : {{ item.laci }}
                </div>
                <div class="col-12">
                  Keterangan : {{ item.keterangan || 'Tidak ada keterangan' }}
                </div>
                <div class="col-12">
                  Tahun : {{ item.tahunMap }}
                </div>
                <div class="col-12">
                  Klasifikasi : {{ item?.keterangan_kode }} <span class="text-weight-bold"> ({{ item?.kode_master }})
                  </span>
                </div>
                <div class="col-12">
                  Unit Pengolah : {{ item?.unitpengolah?.nama }}
                </div>
                <div class="col-12">
                  Status Berkas : <q-badge outline :color="item?.status_arsip === 'AKTIF' ? 'primary' : 'negative'">
                    {{ item?.status_arsip }}
                  </q-badge>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <DialogRincianPage :hederdetail="store.itemsrinci" :users="props.users" :organisasi="props.organisasi" />
    <DialogFormPage :klasifikasi="props.klasifikasi" :kabinet="props.kabinet" />
  </div>
</template>

<script setup>
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'
import DialogRincianPage from './comp/DialogRincianPage.vue'
import { computed } from 'vue'
import folderIcon from 'src/assets/images/folderx.png'
import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap'
import DialogFormPage from './DialogFormPage.vue'
import { useQuasar } from 'quasar'

const q = useQuasar()
const store = useUnitPengelolaharsipMapStore()
const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  users: { type: String, default: '' },
  organisasi: {
    type: Array,
    default: () => []
  },
  klasifikasi: {
    type: Object,
    default: null
  },
  kabinet: {
    type: Array,
    default: () => []
  },
})

const datamap = computed(() => {
  return [...props?.items].sort((a, b) => a.namamap.localeCompare(b.namamap))
})

function editmap(item) {
  store.initreset()
  const klasifikasi = props.klasifikasi.find(x => x.kode === item.kodeklasifikasi)
  store.form.id = item.id
  store.form.namamap = item.namamap
  store.form.kodeorganisasi = item.kodeorganisasi
  store.form.kodekelasifikasi = item.kodeklasifikasi
  store.form.kelasifikasi = klasifikasi
  store.form.cabinet = Number(item.kodefelingkabinet)
  store.form.laci = item.laci
  store.form.keterangan = item.keterangan
  store.form.tahunmap = Number(item.tahunMap)
  store.dialog = true
}

function dialogrincian(val) {
  store.dialogrincian = true
  store.formisi.idmap = val
  store.getrincianmap(val)
}

function hapusmap(id) {
  q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.hapusmap(id)
  }).onCancel(() => {
    console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

</script>

<style scoped>
.folder-card {
  width: 280px;
  transition: all 0.2s ease-in-out;
}

.folder-card:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.folder-card-elegant {
  width: 440px;
  min-height: 280px;
  border-radius: 16px;
  transition: all 0.25s ease;
}

.folder-card-elegant:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.action-btn {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
