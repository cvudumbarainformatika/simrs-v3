<template>
  <div>
    <div class="row items-center q-mb-sm">
      <div class="col-4">
        Nama Menu
      </div>
      <div class="col-8">
        <app-input
          v-model="namaSubMenu"
          outlined
          autofocus
          label="Input Nama Menu"
        />
      </div>
    </div>
    <div class="row items-center q-mb-sm">
      <div class="col-4">
        Nama Route
      </div>
      <div class="col-8">
        <app-input
          v-model="routeMenu"
          outlined
          label="Input Nama Route"
        />
      </div>
    </div>
    <div class="row items-center q-mb-sm">
      <div class="col-4">
        Link Menu
      </div>
      <div class="col-8">
        <app-input
          v-model="linkSubMenu"
          outlined
          label="Input Link Menu"
          @keyup.enter="emits('simpan')"
        />
      </div>
    </div>
    <div class="row">
      <div class="col text-right">
        <app-btn
          v-close-popup
          label="Batal"
          color="dark"
          :disable="loading"
          @click="emits('batal')"
        />
      </div>
      <div class="col  text-right">
        <app-btn
          v-close-popup
          label="Simpan"
          color="primary"
          :loading="loading"
          @click="emits('simpan')"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  nama: { type: String, default: '' },
  icon: { type: String, default: null },
  link: { type: String, default: '' },
  route: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})
const emits = defineEmits(['batal', 'simpan', 'updatenama', 'updateicon', 'updatelink', 'updateroute'])
const namaSubMenu = computed({
  get () { return props.nama },
  set (val) { emits('updatenama', val) }
})
const routeMenu = computed({
  get () { return props.route },
  set (val) { emits('updateroute', val) }
})
const linkSubMenu = computed({
  get () { return props.link },
  set (val) { emits('updatelink', val) }
})
</script>
