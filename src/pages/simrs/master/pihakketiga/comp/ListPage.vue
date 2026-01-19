<template>
  <div>
    <div v-if="!props?.listmaster?.length" class="column flex-center text-white" style="min-height:400px">
      No Data Available
    </div>
    <q-list v-else bordered class="rounded-borders bg-white" separator square>
      <q-item class="bg-primary text-white">
        <q-item-section>Nama</q-item-section>
        <q-item-section>Alamat</q-item-section>
        <q-item-section>Telepon</q-item-section>
        <q-item-section>NPWP</q-item-section>
        <q-item-section side>
          #
        </q-item-section>
      </q-item>
      <q-item v-for="row in listmaster" :key="row?.id" v-ripple class="q-py-xs">
        <q-item-section>{{ row.nama }}</q-item-section>
        <q-item-section>{{ row.alamat }}</q-item-section>
        <q-item-section>{{ row.telepon }}</q-item-section>
        <q-item-section>{{ row.npwp }}</q-item-section>
        <q-item-section side>
          <div class="row q-gutter-xs">
            <q-btn flat icon="icon-mat-edit" size="sm" round color="primary" @click="emits('edit', row)" />
            <q-btn flat icon="icon-mat-delete" size="sm" round color="negative" @click="emits('delete', row?.rs1)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup>
import { computed } from 'vue';


const props = defineProps({
  listmaster: {
    type: Array,
    default: () => []
  }
})


const emits = defineEmits(['edit', 'delete'])
</script>
