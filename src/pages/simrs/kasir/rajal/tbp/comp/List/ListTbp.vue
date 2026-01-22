<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="loading" />

      <div v-else>
        <!-- Empty State -->
        <div v-if="items?.length <= 0" class="column flex-center q-pa-xl">
          <q-icon size="50px" color="grey-6" class="q-mb-md">🏷️</q-icon>

          <div class="text-grey-7 text-subtitle1">Belum Ada Data</div>
        </div>

        <!-- List -->
        <div v-else class="q-gutter-sm q-pa-sm">
          <q-card v-for="(item, i) in items" :key="i" flat bordered class="q-pa-sm bg-grey-1"
            style="border-radius: 14px">
            <!-- <pre>{{ item }}</pre> -->
            <div class="text-body2 text-weight-bold text-primary">
              {{ item?.no_tbp }}
              <span class="text-caption text-weight-bold text-grey">({{ item?.pelayanan }})</span>
            </div>
            <div class="row justify-between items-start">
              <!-- ========== KIRI: 2 KOLOM ========== -->
              <div class="row col items-start">
                <!-- Kolom 1 -->
                <div class="col-6">
                  <div class="text-body2 q-mt-xs">
                    <q-icon name="calendar_month" size="16px" class="q-mr-xs" />
                    Tanggal TBP:
                    <span class="text-weight-bold">
                      {{ humanDate(item?.tgl_tbp) }}
                    </span>
                  </div>

                  <div class="text-body2 q-mt-xs">
                    <q-icon name="calendar_month" size="16px" class="q-mr-xs" />
                    Tanggal Terima:
                    <span class="text-weight-bold">
                      {{ humanDate(item?.tgl_terima) }}
                    </span>
                  </div>

                  <div class="text-body2 q-mt-xs">
                    <q-icon name="calendar_month" size="16px" class="q-mr-xs" />
                    Tanggal Verif:
                    <span class="text-weight-bold">
                      {{ humanDate(item?.tgl_verif) }}
                    </span>
                  </div>
                </div>

                <!-- SEPARATOR TENGAH -->
                <div class="col-auto flex flex-center q-pl-sm q-pr-sm">
                  <q-separator vertical />
                </div>

                <!-- Kolom 2 -->
                <div class="col-5">
                  <div class="text-body2 q-mt-xs">
                    <q-icon name="icon-mat-account_circle" size="16px" class="q-mr-xs" />
                    Penyetor:
                    <span class="text-weight-bold">
                      {{ item?.penyetor }}
                    </span>
                  </div>

                  <div class="text-body2 q-mt-xs">
                    <q-icon name="icon-mat-account_circle" size="16px" class="q-mr-xs" />
                    Penerima:
                    <span class="text-weight-bold">
                      {{ item?.penerima }}
                    </span>
                  </div>

                  <div class="text-body2 q-mt-xs">
                    <q-icon name="icon-mat-sms_failed" size="16px" class="q-mr-xs" />
                    Status Verif:
                    <q-badge :color="item?.status_verif === '1' ? 'green' : 'red'">
                      {{ flagverif(item?.status_verif) }}
                    </q-badge>
                  </div>
                </div>
              </div>

              <!-- ========== KANAN ========== -->
              <div class="col-auto text-right">
                <div class="text-h6 text-weight-bold text-red">
                  {{ formatRpDouble(item?.total) }}
                </div>

                <div class="text-body2 q-mt-xs">
                  <q-btn color="red" dense icon="icon-mat-visibility" @click="emits('edit', item)" />
                </div>
                <!-- <q-badge color="primary" class="q-mt-sm q-pa-sm" style="font-size: 12px; border-radius: 10px;">
                  TBP
                </q-badge> -->
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatRpDouble, humanDate } from "src/modules/formatter";
import ListLoading from "src/pages/simrs/cathlab/comp/ListLoading.vue";
import { useTbpKasirStore } from "src/stores/simrs/kasir/tbp";

const store = useTbpKasirStore();

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["edit"]);
function flagverif(val) {
  if (val === "1") {
    return "Sudah Verif";
  } else {
    return "Belum Verif";
  }
}
</script>
