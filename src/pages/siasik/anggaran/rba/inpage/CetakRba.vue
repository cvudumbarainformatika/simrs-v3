<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header>
          <q-bar class="bg-black text-white">
            <div>Cetak RBA</div>
            <q-space />

            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <q-card-section id="printMe">
            <div class="q-pa-md">
              <kop-cetak />
            </div>
            <div class="q-px-md full-width">
              <data-rba />
            </div>
          </q-card-section>
        </q-page-container>
        <q-footer>
          <q-card-section class="q-pa-none bg-primary text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
                  <q-tooltip class="primary" :offset="[10, 10]">
                    Print
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue'
import KopCetak from './KopCetak.vue'
import DataRba from './ListDataRBA.vue'

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Rencana Bisnis Anggaran | SIASIK on XENTER',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
  }
}
</script>
