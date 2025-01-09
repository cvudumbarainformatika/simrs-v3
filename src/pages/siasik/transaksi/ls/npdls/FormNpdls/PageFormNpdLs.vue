<template>
  <div class="container full-width full-height">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row">
        <FormHeader />
      </div>
      <div class="q-pt-md">
        <ListRincian />
      </div>
    </q-card>
  </div>
  <!-- <div class="container full-width full-height">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row">
        <ListRincian />
      </div>
    </q-card>
  </div> -->
</template>
<script setup>
import FormHeader from './inpage/FormInputHeaderNpdls.vue'
import ListRincian from './inpage/ListRincianFormNpdls.vue'

</script>
