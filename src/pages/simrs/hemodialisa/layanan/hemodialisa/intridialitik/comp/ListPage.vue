<template>
  <div class="fit column bg-grey-4 relative-position">
    <div class="bg-grey-4 q-pa-sm">
      <info-input-ranap :items="store.pasien.intradialitik">
        <transition-group appear tag="div" @before-enter="beforeEnter" @enter="enter">

        </transition-group>

      </info-input-ranap>
    </div>
  </div>
</template>
<script setup>
import { useListPasienHemodialisaStore } from "src/stores/simrs/hemodialisa/hemodialisa"

const store = useListPasienHemodialisaStore()
</script>
