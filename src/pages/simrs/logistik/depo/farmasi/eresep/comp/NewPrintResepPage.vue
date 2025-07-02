<template>
  <q-dialog id="endas" maximized @show="onShow">
    <div class="bg-white batang">
      <div id="printGueeee" class="column items-center bg-white page-x f-12">
        <div class="col no-wrap garis2 text-center">
          <div class="row no-wrap justify-center">
            <div class="q-mr-sm" style="min-width: 1cm;">
              <q-img src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 0.9cm; max-width: 0.9cm" />
            </div>
            <div class="">
              <div class="f-12">
                Instalasi Farmasi
              </div>
              <div class="">
                RSUD dr.Moh Saleh
              </div>
              <div class="f-10">
                (0335) 433478,433119,421118
              </div>
              <div class="f-10 q-mb-xs">
                Fax. (0335) 432702
              </div>
            </div>

            <div class="q-ml-sm text-right">
              <span class="text-weight-bolder f-26">{{ item?.nomor }}</span>
            </div>
          </div>
        </div>
        <div class="garis" />
        <div class="garis" />
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: { type: Object, default: () => { } }
})


function onShow () {
  console.log('show', props.item)

}
</script>
<style lang="scss" scoped>
.fnt-10 {
  font-size: 10px !important;
}

.page-x {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 27.94cm;
  height: fit-content;
  padding: 1mm;
  // font-size: 10px !important;
}

.garis {
  width: 100%;
  border-top: 1px dashed black;
  margin-bottom: 2px;
}

.garis2 {
  width: 90%;
}
</style>
