<template>
  <div>
    <app-loading v-if="loading" />
    <div v-else>
      <div v-if="items?.length <= 0">
        <div class="column flex-center" style="min-height:50vh">
          <div class="text-h3 q-mb-md">
            🏷️
          </div>
          <div class="f-14">
            Belum Ada Data
          </div>
        </div>
      </div>
      <q-list v-else separator>
        <q-separator spaced inset />

        <q-item v-for="(item, i) in items" :key="i">
          <q-item-section avatar>
            <app-avatar-pasien :pasien="item" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              {{ item.masterpasien?.rs2 }} | <span class="text-primary">{{ item.norm }}</span>
            </q-item-label>
            <q-item-label>
              NOREG : <span class="text-weight-bold">{{ item.noreg }} </span> | Penjamin : <span
                class="text-weight-bold"> {{ item.sistem_bayar }}</span>
            </q-item-label>
            <q-item-label>
              DPJP : <span class="text-negative text-weight-bold">{{ item.dokter?.nama }}</span> | RUANGAN : <span
                class="text-teal text-weight-bold"> {{ item.poli?.rs2 }}</span>
            </q-item-label>
            <q-item-label caption>
              USIA : <span class="text-weight-bold">{{ item.masterpasien?.usia }}</span> | Kelamin : <span
                class="text-weight-bold">{{
                  item.masterpasien?.rs17 }}</span>
            </q-item-label>
            <!-- <q-item-label>
              Penjamin : <span class="text-weight-bold"> {{ item.sistembayar }}</span>
            </q-item-label> -->
            <!-- <q-item-label caption>
              Status Pasien: <span class="text-negative text-weight-bold">{{ getStatus(item.taskid) }}</span>
            </q-item-label> -->
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              <div class="row q-my-xs text-end">
                <div class="q-ml-sm">
                  <q-btn outline size="sm" padding="xs" :color="item.tgl_berangkat ? 'teal' : 'negative'"
                    :label="item.tgl_berangkat ? 'Sudah Berangkat' : 'Belum Berangkat'" @click="berangkat(item)"
                    :disable="item?.loading" :loading="item?.loading" />
                </div>
              </div>
              <div class="row q-my-xs justify-end">
                <div class="q-ml-sm">
                  <q-badge outline :color="item.tgl_lunas ? 'green' : 'negative'"
                    :label="item.tgl_lunas ? 'Sudah Lunas' : 'Belum Lunas'" />
                </div>
              </div>
              <div class="row q-my-xs justify-end">
                <div class="q-ml-sm">
                  <q-badge outline :color="item.tgl_selesai ? 'green' : 'dark'"
                    :label="item.tgl_selesai ? 'Sudah Selesai' : 'Belum Selesai'" />
                </div>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </q-list>
    </div>

  </div>
</template>

<script setup>

defineProps({
  loading: { type: Boolean, default: false },
  items: { type: Array, default: () => [] }
})
const emits = defineEmits(['berangkat'])
function berangkat (row) {
  emits('berangkat', row)
}

</script>
