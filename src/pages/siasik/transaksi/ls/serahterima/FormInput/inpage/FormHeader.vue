<template>
  <q-card class="falt col full-height">
    <q-form @submit="onSubmit" ref="formInput" class="full-height">
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="q-gutter-y-md" style="width: 30%">
          <app-input-simrs label="Nomer Serahterima" readonly outlined dense />
        </div>
        <div class="q-gutter-y-md" style="width: 30%">
          <app-input-date-human label="Tanggal Serah Terima" icon="icon-mat-event" outlined :autofocus="false"
            @db-model="tglTransaksi" :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
        </div>
        <div class="row q-gutter-y-md" style="width: 40%">
          <app-input-simrs style="width: 80%" label="Pilih Kontrak" readonly outlined dense />
          <div class="q-px-sm q-gutter-y-xs">
            <q-btn color="dark" round size="sm" icon="icon-mat-add" />
          </div>
        </div>
      </div>
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="q-gutter-y-md" style="width: 30%">
          <app-input-simrs label="Pejabat Teknis Kegiatan" readonly outlined dense />
        </div>
        <div class="q-gutter-y-md" style="width: 30%">
          <app-input-simrs label="Kegiatan BLUD" readonly outlined dense />
        </div>
      </div>
    </q-form>
  </q-card>
</template>

<script setup>

</script>
