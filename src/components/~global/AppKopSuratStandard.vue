<template>
  <!-- KOP SURAT -->
  <div class="col-grow kotak">
    <div class="row items-center">

      <div class="col-9 sisi-kanan">
        <div class="row q-pa-sm">
          <div class="col-auto">
            <img src="~assets/images/logo-rsud.png" width="80">
          </div>
          <div class="col flex-wrap q-px-lg">
            <div class="text-center">
              <div class="text-weight-bold f-12">
                {{ dataHeader[0] }}
              </div>
              <div class="text-weight-bold f-10">
                {{ dataHeader[1] }}
              </div>
              <div class="text-weight-bold f-16">
                {{ dataHeader[2] }}
              </div>
              <div class="f-10">
                <div>{{ dataHeader[3] }}</div>
                <div>{{ dataHeader[4] }}</div>
                <div>{{ dataHeader[5] }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-3 f-14">
        <div class="text-center text-bold">
          {{ header[0] || '-' }}
        </div>
        <div v-if="header[1]" class="text-center text-bold">
          {{ header[1] || '-' }}
        </div>
        <div v-if="header[2]" class="text-center text-bold">
          {{ header[2] || '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

defineProps({
  dataHeader: {
    type: Array,
    default: () => [
      'RSUD CIREMAI',
      'Jl. Ciremai No. 1, Ciremai, Kec. Cimahi Utara, Kota Cimahi, Jawa Barat 40511',
    ]
  },
  header: {
    type: Object,
    default: () => []
  },

  pasien: {
    type: Object,
    default: () => null
  }
})

</script>

<style lang="scss" scoped>
.kotak {
  border: 1px solid black;
}

.sisi-kanan {
  border-right: 1px solid black;
}
</style>