<template>
  <q-bar dense class="bg-white q-mb-md">
    <q-space />
    <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
      <q-tooltip class="primary" :offset="[10, 10]">
        Print
      </q-tooltip>
    </q-btn>
  </q-bar>
  <div class="tinggi">
    <div id="printMe" class="full-width">
      <KopSurat />
      <div class="garis-bawah-dblue q-pb-sm q-mb-md">
        <div class="row justify-center f-20 text-weight-bold q-mb-md">
          RESUME RAWAT JALAN
        </div>
        <div class="row">
          <div class="col-5">
            <div class="row">
              <div class="col-4">
                Nama
              </div>
              <div class="col-8">
                {{ pasien?.nama }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                No. registrasi
              </div>
              <div class="col-8">
                {{ pasien?.noreg }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Ruangan
              </div>
              <div class="col-8">
                {{ pasien?.poli }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Tanggal Masuk
              </div>
              <div class="col-8">
                {{ pasien?.tgl_kunjungan }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Sistem Bayar
              </div>
              <div class="col-8">
                {{ pasien?.sistembayar }}
              </div>
            </div>
          </div>
          <div class="col-7">
            <div class="row">
              <div class="col-3">
                No. RM
              </div>
              <div class="col-9">
                {{ pasien?.norm }}
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                Umur
              </div>
              <div class="col-9">
                {{ pasien?.usia }}
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                Alamat
              </div>
              <div class="col-9">
                {{ pasien?.alamat }}
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                Dokter
              </div>
              <div class="col-9">
                {{ pasien?.dokter }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                1
              </div>
              <div class="col-11">
                Diagnosis (ASSESMENT)
              </div>
            </div>
          </div>
          <div class="col-7">
            <!-- <div
              v-for="(item,i) in store.item?.diagnosa"
              :key="i"
              class="row"
            >
              <div class="col-12">
                {{ item?.masterdiagnosa?.rs1 }} {{ item?.masterdiagnosa?.diagnosa }} <span v-if="item?.jenisdiagnosa">({{ item?.jenisdiagnosa }})</span>
              </div>
            </div> -->
            <div>{{ pasien?.memodiagnosa }}</div>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                2
              </div>
              <div class="col-11">
                Anamnese (SUBYEKTIF)
              </div>
            </div>
          </div>
          <div class="col-7">
            <q-list class="bg-white" separator>
              <transition-group name="list">
                <q-item v-for="(item, n) in store.item?.anamnesis" :key="n" class="list-move q-pa-none">
                  <q-item-section class="">
                    <q-item-label class="f-12">
                      <span class="">Keluhan Utama </span> : <span class="text-weight-bold">{{ item?.rs4 }}</span>
                    </q-item-label>
                    <q-item-label>
                      <span class="">Riwayat Penyakit (Sekarang) </span> : <span class="text-weight-bold">{{
                        item?.riwayatpenyakitsekarang }}</span>
                    </q-item-label>
                    <q-item-label>
                      <span class="">Riwayat Penyakit </span> : <span class="text-weight-bold">{{ item?.riwayatpenyakit
                        }}</span>
                    </q-item-label>
                    <q-item-label>
                      <span class="">Riwayat Alergi </span> : <span class="text-weight-bold">{{ item?.riwayatalergi
                        }}</span>
                    </q-item-label>
                    <q-item-label>
                      <span class="">Reaksi berupa </span> : <span class="text-weight-bold">{{ item?.keteranganalergi
                        }}</span>
                    </q-item-label>
                    <q-item-label>
                      <span class="">Riwayat Pengobatan</span> : <span class="text-weight-bold">{{
                        item?.riwayatpengobatan }}</span>
                    </q-item-label>
                    <q-separator class="q-my-xs" />
                    <q-item-label>
                      <span class="text-weight-bold">Skreening Gizi</span>
                    </q-item-label>
                    <q-item-label>
                      <span class="">- Apakah Pasian mengalami penurunan / peningkatan BB yang tidak diinginkan dalam 6
                        Bulan terakhir ? <b>{{ getYT(item?.skreeninggizi) }}</b></span>
                      <div class="q-my-xs">
                        - Apakah Asupan Makan berkurang karena tidak nafsu makan ? <b>{{ getYT(item?.asupanmakan) }}</b>
                      </div>
                      <div>- Kondisi Khusus : <em>{{ item?.kondisikhusus }}</em> <b>Skor : {{ item?.skor }}</b> </div>
                    </q-item-label>
                    <q-item-label>
                      <span class="text-weight-bold">Keluhan Nyeri</span>
                    </q-item-label>
                    <q-item-label>
                      <div>
                        - Skor Nyeri : <b>{{ item?.scorenyeri ?? '-' }}</b>

                        <em class="text-primary q-ml-sm"> {{ item?.keteranganscorenyeri ?? '-' }}</em>
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </transition-group>
              <q-separator />
            </q-list>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                3
              </div>
              <div class="col-11">
                Pemeriksaaan fisik
              </div>
            </div>
          </div>
          <div class="col-7">
            <q-list separator>
              <transition-group name="list">
                <template v-for="(item, i) in store.item?.pemeriksaanfisik" :key="i">
                  <!-- NADI-->
                  <q-item class="q-pa-none list-move">
                    <q-item-section avatar>
                      <q-icon :color="nadi(item?.rs4).color" name="icon-my-monitor_heart" size="sm" />
                    </q-item-section>
                    <q-item-section class="q-pa-xs">
                      <q-item-label :class="`text-h6 text-${nadi(item?.rs4).color}`">
                        {{ item?.rs4 }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-right f-10">
                        N (HR)
                      </q-item-label>
                      <q-item-label class="text-right f-10">
                        {{ nadi(item?.rs4).res }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- PERNAPASAN -->
                  <q-separator />
                  <q-item class="q-pa-none list-move">
                    <q-item-section avatar>
                      <q-icon name="icon-my-local_hospital" size="sm" />
                    </q-item-section>
                    <q-item-section class="q-pa-xs">
                      <q-item-label :class="`text-h6 `">
                        {{ item?.pernapasan }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-right f-10">
                        RR
                      </q-item-label>
                      <q-item-label class="text-right f-10">
                        -
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- SUHU TUBUH -->
                  <q-separator />
                  <q-item class="q-pa-none list-move">
                    <q-item-section avatar>
                      <q-icon :color="suhu(item?.suhutubuh).color"
                        name="icon-my-standing-human-body-silhouette-svgrepo-com" size="sm" />
                    </q-item-section>
                    <q-item-section class="q-pa-xs">
                      <q-item-label :class="`text-h6 text-${suhu(item?.suhutubuh).color}`">
                        {{ item?.suhutubuh }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-right f-10">
                        SUHU TUBUH
                      </q-item-label>
                      <q-item-label class="text-right f-10">
                        {{ suhu(item?.suhutubuh).res }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- TEKaNAN darah -->
                  <q-separator />
                  <q-item class="q-pa-none list-move">
                    <q-item-section class="q-pa-xs">
                      <q-item-label :class="`text-h6 `">
                        <span :class="`${tekananDarah(item?.sistole).color}`">{{ item?.sistole }}</span> /
                        <span :class="`${tekananDarahDias(item?.diatole).color}`">{{ item?.diastole }}</span>
                      </q-item-label>
                      <q-item-label class="f-10">
                        <span :class="`${tekananDarah(item?.sistole).color}`">{{ tekananDarah(item?.sistole).res
                          }}</span> /
                        <span :class="`${tekananDarahDias(item?.diastole).color}`">{{
                          tekananDarahDias(item?.diastole).res }}</span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-right f-10">
                        TD sys / dias
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- STATUS -->
                  <q-separator />
                  <q-item class="q-pa-none list-move">
                    <q-item-section class="q-pa-xs">
                      <q-item-label lines="2">
                        T Kesadaran : <em>{{ getKesadaran(item?.tingkatkesadaran) ?? '-' }}</em>
                      </q-item-label>
                      <q-item-label lines="2">
                        Status Psikologis : <em>{{ item?.statuspsikologis ?? '-' }}</em>
                      </q-item-label>
                      <q-item-label lines="2">
                        Ekonomi : <em>{{ item?.sosialekonomi ?? '-' }}</em>
                      </q-item-label>
                      <q-item-label lines="2">
                        Spiritual : <em>{{ item?.spiritual ?? '-' }}</em>
                      </q-item-label>
                      <q-item-label lines="2">
                        kesadaran : <em>{{ item?.kesadaran ?? '-' }}</em>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <!-- <q-card
                  flat

                  square
                >
                  <q-slide-transition>
                    <div v-show="expanded===i+1">
                      <q-separator  />
                      <q-list
                        v-if="item?.detailgambars?.length"
                        separator

                      >
                        <q-item
                          v-for="(row, n) in item.detailgambars"
                          :key="n"
                        >
                          <q-item-section avatar>
                            <q-avatar
                              size="24px"
                              color="orange"
                            >
                              {{ n + 1 }}
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ row.anatomy }}</q-item-label>
                            <q-item-label caption>
                              {{ row.ket }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                      <div
                        v-else
                        class="text-center q-pa-md"
                      >
                        Tidak ada detail anatomy
                      </div>
                    </div>
                  </q-slide-transition>
                </q-card> -->
                  <!-- <q-separator
                  color="grey"
                  size="5px"
                /> -->
                </template>
                <!-- KHUSUS PARU POL018-->
                <q-separator v-if="pasien?.kodepoli === 'POL018'" />
                <q-item v-if="pasien?.kodepoli === 'POL018'">
                  <q-item-section class="q-pa-xs">
                    <q-item-label lines="2">
                      Inspeksi : <em>{{ item?.inspeksi ?? '-' }}</em>
                    </q-item-label>
                    <q-item-label lines="2">
                      Palpasi : <em>{{ item?.palpasi ?? '-' }}</em>
                    </q-item-label>
                    <q-item-label lines="2">
                      Perkusi Dada Kanan : <em>{{ item?.perkusidadakanan ?? '-' }}</em>
                    </q-item-label>
                    <q-item-label lines="2">
                      Perkusi Dada Kiri : <em>{{ item?.perkusidadakiri ?? '-' }}</em>
                    </q-item-label>
                    <q-item-label lines="2">
                      Suara Nafas Dasar : <em>{{ item?.auskultasisuaradasar ?? '-' }}</em>
                    </q-item-label>
                    <q-item-label lines="2">
                      Suara Nafas Tambahan (Kanan) : <em>{{ item?.auskultasisuaratambahankanan ?? '-' }}</em>
                    </q-item-label>
                    <q-item-label lines="2">
                      Suara Nafas Tambahan (Kiri) : <em>{{ item?.auskultasisuaratambahankiri ?? '-' }}</em>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator v-if="pasien?.kodepoli === 'POL017'" />
                <q-item v-if="pasien?.kodepoli === 'POL017'" class="q-pa-none list-move">
                  <div v-for="(pmatax, pmx) in store.item?.pemeriksaanfisik" :key="pmx">
                    <div v-for="(pmata, pm) in pmatax?.pemeriksaankhususmata" :key="pm">
                      <q-item-section class="q-pa-xs">
                        <q-item-label lines="2">
                          VOD AWAL: <em>{{ pmata?.rs4 }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          VOD REFR : <em>{{ pmata?.rs5 ?? '-' }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          VOD AKHIR : <em>{{ pmata?.rs6 ?? '-' }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          TOD : <em>{{ pmata?.rs10 }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          FONDOS OD : <em>{{ pmata?.rs12 ?? '-' }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          VOS AWAL : <em>{{ pmata?.rs7 ?? '-' }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          VOS REFR : <em>{{ pmata?.rs8 ?? '-' }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          VOS AKHIR : <em>{{ pmata?.rs9 ?? '-' }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          TOS : <em>{{ pmata?.rs11 ?? '-' }}</em>
                        </q-item-label>
                        <q-item-label lines="2">
                          FONDOS OS : <em>{{ pmata?.rs13 ?? '-' }}</em>
                        </q-item-label>
                      </q-item-section>
                    </div>
                  </div>
                </q-item>
                <!-- DETAIL -->
              </transition-group>
            </q-list>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                4
              </div>
              <div class="col-11">
                Edukasi Untuk Pasien
              </div>
            </div>
          </div>
          <div class="col-7">
            <q-card v-for="(item, i) in store.item?.edukasi" :key="i" flat>
              <q-card-section class="q-pa-none">
                <div class="column">
                  <div>{{ item?.perlupenerjemah === 'Iya' ? 'Pasien Perlu Penerjemah' : 'Pasien Tidak Perlu Penerjemah'
                    }}
                  </div>
                  <div>{{ item?.bahasaisyarat === 'Iya'
                    ? 'Pasien Memakai Bahasa Isyarat'
                    : 'Pasien Tidak Memakai Bahasa Isyarat'
                    }}</div>
                  <div>{{ item?.caraedukasi === 'Lisan' ? 'Edukasi Memakai Lisan' : 'Edukasi Memakai Tulisan' }}</div>
                  <div>{{ item?.kesediaan === 'Iya' ? 'Pasien Bersedia' : 'Pasien Tidak Bersedia' }}</div>
                  <div> Kebutuhan : <b><em>{{ item?.kebutuhanedukasi }}</em></b> </div>
                  <div> Penerima Edukasi : <b><em>{{ item?.rs9 }}</em></b> </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                5
              </div>
              <div class="col-11">
                Laborat
              </div>
            </div>
          </div>
          <div class="col-7">
            <q-card flat>
              <q-card-section v-if="store.item?.laborat?.length" class="q-pa-none">
                <q-markup-table separator="vertical" flat bordered dense>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Nama Pemeriksaan
                      </th>
                      <th class="text-right">
                        Hasil
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(lab, l) in store.item?.laborat" :key="l">
                      <td class="text-left f-12 ellipsis" style="max-width: 250px;">
                        {{ lab?.pemeriksaanlab?.rs2 }}
                      </td>
                      <td class="text-right f-12" style="max-width: 150px;">
                        {{ lab?.rs21 }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                6
              </div>
              <div class="col-11">
                Radiologi
              </div>
            </div>
          </div>
          <div class="col-7">
            <div v-if="store.item?.pembacaanradiologi?.length">
              <div v-for="(item, i) in store.item?.pembacaanradiologi" :key="i" class="row">
                <div class="col-12">
                  <div class="row no-wrap">
                    <div class="col-shrink q-mr-xs">
                      -
                    </div>
                    <div class="col">
                      {{ item?.rs3 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                7
              </div>
              <div class="col-11">
                USG
              </div>
            </div>
          </div>
          <div class="col-7">
            <div v-for="(item, i) in store.item?.usg" :key="i" class="row">
              <div class="col-12">
                {{ item?.hasil ?? '-' }}
              </div>
            </div>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                8
              </div>
              <div class="col-11">
                ECG
              </div>
            </div>
          </div>
          <div class="col-7">
            <div v-for="(item, i) in store.item?.ecg" :key="i" class="row">
              <div class="col-12">
                {{ item?.hasil ?? '-' }}
              </div>
            </div>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                9
              </div>
              <div class="col-11">
                EEG
              </div>
            </div>
          </div>
          <div class="col-7">
            <div v-if="store.item?.eeg">
              <div class="row">
                <!-- <b> {{ date.formatDate( store.item?.eeg?.tanggal,"DD MMMM YYYY") }}</b> - -->
                ( k ) - {{ store.item?.eeg?.klasifikasi }}
              </div>
              <div class="row">
                ( i ) - {{ store.item?.eeg?.impresi }}
              </div>
            </div>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                10
              </div>
              <div class="col-11">
                Obat
              </div>
            </div>
          </div>
          <div class="col-7">
            <div
              v-if="store.item?.apotekracikanrajal?.length || store.item?.apotekracikanrajallalu?.length || store.item?.apotekrajal?.length || store.item?.apotekrajal?.length"
              class="row items-center text-weight-bold">
              <div class="col-9">
                Obat
              </div>
              <div class="col-3">
                Jumlah
              </div>
            </div>
            <div v-if="store.item?.apotekracikanrajal?.length">
              <div v-for="(item, i) in store.item?.apotekracikanrajal" :key="i" class="row items-center">
                <div class="col-9">
                  {{ item?.obat ?? '-' }}
                </div>
                <div class="col-3">
                  {{ item?.jumlah ?? '0' }}
                </div>
              </div>
            </div>
            <div v-if="store.item?.apotekracikanrajallalu?.length">
              <div v-for="(item, i) in store.item?.apotekracikanrajallalu" :key="i" class="row items-center">
                <div class="col-9">
                  {{ item?.obat ?? '-' }}
                </div>
                <div class="col-3">
                  {{ item?.jumlah ?? '0' }}
                </div>
              </div>
            </div>
            <div v-if="store.item?.apotekrajal?.length">
              <div v-for="(item, i) in store.item?.apotekrajal" :key="i" class="row items-center">
                <div class="col-9">
                  {{ item?.obat ?? '-' }}
                </div>
                <div class="col-3">
                  {{ item?.jumlah ?? '0' }}
                </div>
              </div>
            </div>
            <!-- <div v-if="store.item?.apotekrajal?.length">
              <div
                v-for="(item,i) in store.item?.apotekrajal"
                :key="i"
                class="row items-center"
              >
                <div class="col-9">
                  {{ item?.obat??'-' }}
                </div>
                <div class="col-3">
                  {{ item?.jumlah??'0' }}
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                11
              </div>
              <div class="col-11">
                Tindakan
              </div>
            </div>
          </div>
          <div class="col-7">
            <div v-for="(item, i) in store.item?.tindakan" :key="i" class="row">
              <div v-if="item?.keterangan !== ''" class="col-12">
                {{ item?.tindakan }} (<span v-html="getNewLine(item?.ket ? item?.ket : item?.keterangan)" />)
              </div>
              <div v-else class="col-12">
                {{ item?.tindakan }}
              </div>
            </div>
          </div>
        </div>
        <q-separator />
        <div class="row">
          <div class="col-5">
            <div class="row">
              <div class="col-1">
                12
              </div>
              <div class="col-11">
                Rencana Tindak Lanjut
              </div>
            </div>
          </div>
          <div class="col-7">
            <div v-for="(item, i) in store.item?.planning" :key="i" class="row">
              <div class="col-12">
                {{ item?.rs4f }}
              </div>
            </div>
          </div>
        </div>
        <q-separator />
      </div>
      <div class="q-mt-md">
        <div class="row">
          <div class="col-6" />
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div class="row q-mb-xl">
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Pasien / Keluarga
            </div>
          </div>
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Dokter
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="text-center text-weight-bold">
              (........................)
            </div>
          </div>
          <div class="col-6">
            <div class="text-center text-weight-bold">
              ( {{ pasien?.dokter }} )
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="store.loading">
      <app-loading />
    </div>
  </div>
</template>
<script setup>
import { date } from 'quasar'
import { useDokumenResumeStore } from 'src/stores/simrs/dokumen/resume/resume'
import { usePemeriksaanFisik } from 'src/stores/simrs/pelayanan/poli/pemeriksaanfisik'
import KopSurat from '../comppoli/KopSurat.vue'
import { getNewLine } from 'src/modules/formatter';
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

// console.log('pasien', props.pasien);

const store = useDokumenResumeStore()
const fisik = usePemeriksaanFisik()
store.setParams('noreg', props.pasien?.noreg)
store.getData()
// eslint-disable-next-line no-unused-vars
function getYT(val) {
  if (val === 1 || val === '1') {
    return 'Ya'
  }
  else if (val === 0 || val === '0') {
    return 'Tidak'
  }
  else {
    return '-'
  }
}
// eslint-disable-next-line no-unused-vars
function getKesadaran(val) {
  const temp = fisik.optionsTingkatkesadaran.filter(a => a.value === val)
  if (temp?.length) {
    return temp[0].label
  }
  else {
    return '-'
  }
}
// eslint-disable-next-line no-unused-vars
function tekananDarah(val) {
  const normal = val >= 100 && val <= 120
  const prahipertensi = val >= 121 && val <= 139
  const hipertensiderajat1 = val >= 140 && val <= 159
  const hipertensiderajat2 = val >= 160

  let obj = {
    color: 'text-teal',
    res: 'normal'
  }
  if (normal) {
    obj = { color: 'text-teal', res: 'Normal' }
  }
  else if (prahipertensi) {
    obj = { color: 'text-red', res: 'Prahipertensi' }
  }
  else if (hipertensiderajat1) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 1' }
  }
  else if (hipertensiderajat2) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 2' }
  }
  else {
    obj = { color: 'text-red', res: 'Not Valid' }
  }

  return obj
}
// eslint-disable-next-line no-unused-vars
function tekananDarahDias(val) {
  const normal = val >= 60 && val <= 79
  const prahipertensi = val >= 80 && val <= 89
  const hipertensiderajat1 = val >= 90 && val <= 99
  const hipertensiderajat2 = val >= 100

  let obj = {
    color: 'text-teal',
    res: 'normal'
  }
  if (normal) {
    obj = { color: 'text-teal', res: 'Normal' }
  }
  else if (prahipertensi) {
    obj = { color: 'text-red', res: 'Prahipertensi' }
  }
  else if (hipertensiderajat1) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 1' }
  }
  else if (hipertensiderajat2) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 2' }
  }
  else {
    obj = { color: 'text-red', res: 'LOW' }
  }

  return obj
}
// eslint-disable-next-line no-unused-vars
function suhu(val) {
  const hipotermia = val < 35
  const normal = val >= 35 && val < 37
  const pireksia = val >= 37 && val <= 41.1
  const hipertermia = val > 41.1

  let obj = {
    color: 'teal',
    res: 'normal'
  }
  if (hipotermia) {
    obj = { color: 'red', res: 'Hipotermia' }
  }
  else if (normal) {
    obj = { color: 'teal', res: 'Normal' }
  }
  else if (pireksia) {
    obj = { color: 'red', res: 'Pireksia/febris' }
  }
  else if (hipertermia) {
    obj = { color: 'red', res: 'Hipertermia' }
  }

  return obj
}
// eslint-disable-next-line no-unused-vars
function nadi(val) {
  const bradikardi = val < 60
  const normal = val >= 61 && val <= 100
  const takikardi = val > 100

  let obj = {
    color: 'teal',
    res: 'Normal'
  }
  if (bradikardi) {
    obj = { color: 'red', res: 'Brakikardi' }
  }
  else if (normal) {
    obj = { color: 'teal', res: 'Normal' }
  }
  else if (takikardi) {
    obj = { color: 'red', res: 'Takikardi' }
  }

  return obj
}
const printObj = {
  id: 'printMe',
  popTitle: 'Resume Medik'

}
</script>
<style lang="scss" scoped>
.tinggi {
  min-height: 100%;
}

.garis-bawah-dablue {
  border-bottom: 1px solid rgb(56, 150, 239);
  border-bottom-style: dashed;
}

.garis-bawah-dblue {
  border-bottom: 4px solid rgb(56, 150, 239);
  border-bottom-style: double;
}
</style>
