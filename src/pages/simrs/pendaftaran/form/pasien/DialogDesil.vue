<template>
  <q-dialog v-model="fixed">
    <q-card style="min-width: 360px">
      <q-card-section>
        <div class="text-h6">Data Pasien Desil</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-py-sm">
        <q-list dense separator>
          <q-item>
            <q-item-section>NIK</q-item-section>
            <q-item-section side>{{ pasien.nik || '-' }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Nama</q-item-section>
            <q-item-section side>{{ pasien.nama || '-' }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Nomor RM</q-item-section>
            <q-item-section side>{{ pasien.norm || '-' }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Jenis Kelamin</q-item-section>
            <q-item-section side>{{ pasien.kelamin || '-' }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Desil</q-item-section>
            <q-item-section side>range 6 sampai 10</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Tutup" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const fixed = defineModel({ default: false })
defineProps({
  pasien: { type: Object, default: () => ({}) }
})
</script>
