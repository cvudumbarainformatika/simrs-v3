<template>
  <div class="q-pa-sm full-height scroll-y" style="padding-bottom: 100px;">
    <q-card flat bordered class="q-mb-xs" v-for="(item, n) in items" :key="n">
      <q-card-section class="q-pa-none">
        <q-item>
          <q-item-section>
            <!-- <q-item-label>Dokter : {{ item?.dokter }}</q-item-label> -->
            <q-item-label>Ruangan : {{ item?.ruang }}</q-item-label>
            <q-item-label class="text-weight-bold">Jasa : {{ item?.namatarif }}</q-item-label>
            <q-item-label>
              <q-badge :color="item?.rs6?.toUpperCase().includes('V') ? 'green' : 'orange'" class="text-weight-bold"
                outline>{{
                  formatRp(item?.subtotal) }}</q-badge>
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label>{{ humanDate(item?.rs2) }}</q-item-label>
            <q-item-label>Jam : {{ jamTnpDetik(item?.rs2) }}</q-item-label>
            <q-item-label>
              <q-spinner v-if="store.loadingHapus === item?.id" size="sm" color="red"></q-spinner>
              <q-icon v-else name="icon-mat-delete" size="sm" color="red" class="cursor-pointer"
                @click="hapusItem(item?.id)"></q-icon>

            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { humanDate, jamTnpDetik, formatRp } from 'src/modules/formatter'
import { useQuasar } from 'quasar'

const $q = useQuasar()


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  items: {
    type: Array,
    default: () => []
  },
  store: {
    type: Object,
    default: null
  }
})


function hapusItem(id) {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Apakah anda yakin akan menghapus data ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    props.store.hapus(id)
  })
}

</script>