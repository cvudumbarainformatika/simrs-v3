<template>
  <div class="col-grow kotak">
    <div class="row items-center">

      <div class="col-12 sisi-kanan">
        <div class="row q-pa-sm">
          <div class="col-auto">
            <!-- <img src="~assets/images/logo-rsud.png" style="width: 80px;"> -->
            <img src="~assets/images/logo-kota-grey.png" width="70">
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

          <div class="col-auto">
            <img src="~assets/images/logo-rsud.png" width="80">
          </div>
        </div>
      </div>
      <!-- <div class="col-2 f-14">
              <div class="text-center text-bold">
                {{ menu?.title }}
              </div>
              <div class="text-center text-bold">
                PASIEN REHABMEDIK
              </div>
            </div> -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Object,
    default: null
  }
})

</script>