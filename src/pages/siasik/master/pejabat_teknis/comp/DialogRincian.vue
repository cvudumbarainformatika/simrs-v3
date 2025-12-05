<template>
  <q-dialog :model-value="modelValue" @update:model-value="val => emits('update:modelValue', val)" persistent
    backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; max-width:180vw; height:600px;">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">

        <!-- HEADER -->
        <q-header elevated>
          <q-bar class="bg-black text-white">
            <div>Rincian Data</div>
            <q-space />
            <q-btn dense flat icon="icon-mat-close" @click="close">
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>

        <!-- ISI MODAL -->
        <q-page-container>
          <div v-if="!listrincian" class="column flex-center text-grey" style="min-height:400px">
            No Data Available
          </div>

          <div v-else class="q-pa-md">
            <q-card flat bordered class="bg-white q-pa-md">
              <div class="text-h6 q-mb-md">
                <q-icon name="icon-mat-layers" size="sm" class="q-mr-sm" />
                {{ listrincian.kode50 }} - {{ listrincian.uraian50 || 'Tanpa Uraian' }}
              </div>

              <q-separator />

              <div class="q-mt-md q-gutter-y-sm">
                <div class="row">
                  <div class="col-3 text-grey">BAST (Neraca) :</div>
                  <div class="col">{{ listrincian.kode_bast }} - {{ listrincian.uraian_bast }}</div>
                </div>

                <div class="row">
                  <div class="col-3 text-grey">BAST (LO) :</div>
                  <div class="col">{{ listrincian.kode_bastx }} - {{ listrincian.uraian_bastx }}</div>
                </div>

                <div class="row">
                  <div class="col-3 text-grey">Estimasi SAL :</div>
                  <div class="col">{{ listrincian.kode_bastcair1 }} - {{ listrincian.uraian_bastcair1 }}</div>
                </div>

                <div class="row">
                  <div class="col-3 text-grey">Pencairan (Neraca) :</div>
                  <div class="col">
                    <div>{{ listrincian.kode_bastcairx }} - {{ listrincian.uraian_bastcairx }}</div>
                    <div>{{ listrincian.kode_bastcair2 }} - {{ listrincian.uraian_bastcair2 }}</div>
                  </div>

                </div>

                <div class="row">
                  <div class="col-3 text-grey">Tanpa BAST (Neraca) :</div>
                  <div class="col">{{ listrincian.kode_cairx }} - {{ listrincian.uraian_cairx }}</div>
                </div>

                <div class="row">
                  <div class="col-3 text-grey">Tanpa BAST (LO) :</div>
                  <div class="col">{{ listrincian.kode_cair2 }} - {{ listrincian.uraian_cair2 }}</div>
                </div>

                <div class="row">
                  <div class="col-3 text-grey">LAK :</div>
                  <div class="col">{{ listrincian.kode_lak }} - {{ listrincian.uraian_lak }}</div>
                </div>

                <div class="row">
                  <div class="col-3 text-grey">KAS :</div>
                  <div class="col">{{ listrincian.kd_blud }} - {{ listrincian.ur_blud }}</div>
                </div>
              </div>
            </q-card>
          </div>
        </q-page-container>

        <!-- FOOTER -->
        <q-footer elevated class="bg-grey-2 q-pa-sm flex justify-end">
          <q-btn flat label="Tutup" color="primary" @click="close" />
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  listrincian: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['update:modelValue'])

const close = () => emits('update:modelValue', false)

const formatRupiah = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}
</script>
