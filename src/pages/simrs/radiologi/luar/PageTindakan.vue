<template>
  <div class="fit scroll">
    <div class="row q-col-gutter-xs fit">
      <div class="col-12 col-md-4 full-height">
        <q-card flat class="fit">
          <q-card-section>

            <app-avatar-pasien :key="pasien" :pasien="pasien" width="100%" />
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="text-weight-bold">👤 {{ pasien?.nama }}</div>
            </div>
            <div class="row no-wrap items-center">
              <div class="text-caption">⚤ {{ pasien?.kelamin }}</div>
            </div>
            <div class="row no-wrap items-center">
              <div class="text-caption">⚤ {{ pasien?.alamat }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-8">
        Details Permintaan
      </div>
    </div>
  </div>
</template>

<script setup>

defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

</script>