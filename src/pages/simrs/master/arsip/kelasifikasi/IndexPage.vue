<template>
  <q-page class="column full-height" style="overflow: hidden;">
    <q-card flat square class="col column q-ma-sm full-height">
      <q-card-section class="col-auto">
        <div class="full-width row justify-between items-center content-between">
          <div class="bg-white col-grow">
            <div class="flex flex-column items-center flex-center">
              <div class="col text-left">
                <div class="f-14 text-weight-bold">
                  Master Kelasifikasi Arsip
                </div>
                <div class="title-desc">
                  Master Kelasifikasi Arsip
                </div>
              </div>
            </div>
          </div>
          <div class="flex q-gutter-sm">
            <q-input label="Cari Kelasifikasi" outlined dense standout="bg-yellow-3" clearable style="width: 200px;" />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <div class="col-grow full-height relative-position">
        <div class="absolute full-width full-height">
          <div class="row full-height">
            <div class="col-4 full-height scroll q-pa-sm">
              <FormPage />
            </div>
            <div class="col-8 full-height bg-grey scroll q-pa-sm">
              <ListPage />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import FormPage from './comp/FormPage.vue';
import ListPage from './comp/ListPage.vue';
</script>
