<template>
  <q-item v-ripple clickable class="q-my-lg bg-white shadow-q relative-position" @click="emits('details', item)">
    <q-card :class="`absolute text-grey-3 q-py-xs q-px-sm ${item?.status !== '' ? 'bg-teal' : 'bg-deep-orange-8'}`"
      style="top:-15px; left: 0;">
      <div class="f-10">
        {{ item?.status !== '' ? 'Terlayani' : 'Belum terlayani' }}
      </div>
    </q-card>
    <div class="row items-center full-width">
      <div class="col-6">
        <div class="row fit q-pa-none items-center q-col-gutter-md">
          <div class="col-auto">
            <q-avatar size="40px">
              <app-avatar-pasien :pasien="item" width="40px" />
            </q-avatar>
          </div>
          <div class="col full-width flex wrap ellipsis">
            <div class="full-width ellipsis">
              {{ item?.nama }}
            </div>
            <div class="flex q-gutter-sm q-pt-xs full-width">
              <div> <b>NIK :</b> <span class="text-primary">{{ item?.nik || '-' }}</span></div>
              <div> <b>NOTA :</b> <span class="text-grey-8">{{ item?.notrans || '-' }}</span></div>
            </div>
            <div class="ellipsis text-grey-8 q-pt-xs">
              Alamat : <i>{{ item?.alamat }}</i>
            </div>
            <div class="flex q-gutter-sm q-pt-xs full-width">
              <div> <b>KELAMIN :</b> <span class="text-primary">{{ item?.kelamin || '-' }}</span></div>
              <div> <b>USIA :</b> <span class="text-grey-8">{{ item?.usia }} Thn </span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="row items-center full-width q-col-gutter-md">
          <div class="col-3 ">
            <div class="q-pt-sm">
              {{ item?.sistembayar }}
            </div>
          </div>
          <div class="col full-width flex wrap ellipsis">
            <div class="f-10">
              {{ item.dari }}
            </div>
            <div class="full-width ellipsis">
              <span class="text-primary">{{ item?.jenispembayaran }}</span>
            </div>
            <div class="full-width ellipsis">
              <span class="text-primary">{{ item?.perusahaan || '-' }}</span>
            </div>
          </div>
          <div class="col-2 flex justify-end">
            <div class="text-grey-8 f-12">
              {{ date.formatDate(item?.tglentri, 'MMM DD, YYYY') }}
            </div>
            <div class="text-grey-6 f-10">
              Jam : <b> {{ date.formatDate(item?.tglentri, 'HH:mm') }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-item>
</template>

<script setup>
import { date } from 'quasar'

defineProps({
  item: {
    type: Object,
    default: null
  }
})

const emits = defineEmits(['details'])
</script>

<style lang="scss" scoped></style>
