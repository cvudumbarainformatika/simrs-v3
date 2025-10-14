<template>
  <q-dialog persistent maximized transition-show="slide-left" transition-hide="fade" @before-show="show()"
    @before-hide="emits('hide')">
    <q-card flat class="fit" style="overflow: hidden;">
      <div class="fit column">
        <q-bar class="col-auto bg-primary text-white q-py-sm">
          <div class="f-12">
            Dokumen Pemeriksaan
          </div>
          <q-space />

          <q-btn v-close-popup dense flat icon="icon-mat-close" @click="emits('close')">
            <q-tooltip class="bg-white text-primary">
              Close
            </q-tooltip>
          </q-btn>
        </q-bar>

        <div class="row justify-end q-ma-sm q-col-gutter-x-sm sticky">
          <div class="col-auto">
            <q-btn color="primary" round size="sm" icon="icon-my-print_setting" @click="tandatangan.setOpen">
              <q-tooltip class="primary" :offset="[10, 10]">
                Pilih tanda tangan
              </q-tooltip>
            </q-btn>
          </div>
          <div class="col-auto">
            <q-btn v-print="printObj" round icon="icon-mat-print" dense color="dark" size="md"><q-tooltip
                class="primary" :offset="[10, 10]">
                Cetak Dokumen Pemeriksaan
              </q-tooltip></q-btn>
          </div>
          <div class="col-auto">
            <q-btn v-print="printDua" round icon="icon-mat-print" dense color="orange" size="md"><q-tooltip
                class="primary" :offset="[10, 10]">
                Cetak Lampiran Dokumen Pemeriksaan
              </q-tooltip></q-btn>
          </div>
        </div>
        <div class="col fit column">
          <div class="col full-height scroll">
            <div id="printMe">
              <q-card-section>
                <div class="row">
                  <app-kop-surat />
                </div>
                <div class="row justify-center text-weight-bold f-20 q-py-sm">
                  BERITA ACARA PEMERIKSAAN
                </div>
                <div class="row justify-center q-pb-sm">
                  Nomor : {{ nomorBap(store.item?.no_bast) }}
                </div>

                <div class="q-mb-md">
                  Pada hari ini <span class="text-weight-bold text-italic">{{ date.formatDate(store.item?.tanggal,
                    'dddd')
                  }}</span>
                  Tanggal <span class="text-weight-bold text-italic">{{
                    tanggalTerbilang(date.formatDate(store.item?.tanggal, 'DD'))
                    }}</span>
                  Bulan <span class="text-weight-bold text-italic">{{ date.formatDate(store.item?.tanggal, 'MMMM')
                  }}</span>
                  Tahun <span class="text-weight-bold text-italic">{{
                    tahunTerbilang(date.formatDate(store.item?.tanggal,
                      'YYYY'))
                  }}</span>,
                  <!-- tahun <span class="text-weight-bold text-italic">{{ tahunTerbilang('3211') }}</span>, -->
                  bertempat di UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo, kami yang bertanda tangan di bawah ini:
                </div>
                <div class="print-hide text-italic">
                  identitas PPK :
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1">

                  </div>
                  <div class="col-3">
                    Nama
                  </div>
                  <div class="col-7">
                    {{ tandatangan?.data?.ppk?.nama }}
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    NIP
                  </div>
                  <div class="col-7">
                    {{ tandatangan?.data?.ppk?.nip_baru === '' ? tandatangan?.data?.ppk?.nip :
                      tandatangan?.data?.ppk?.nip_baru
                    }}
                  </div>
                </div>
                <div class="row">Berdasarkan hal-hal sebagai berikut :</div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    Surat Pesanan
                  </div>
                  <div class="col-7">
                    {{ store.item?.nomor
                    }}
                  </div>
                </div>
                <div class="row">Bahwa berdasarkan hal-hal tersebut di ata, Pemeriksaan / Penerima menyatakan sebagai
                  berikut :</div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1">
                    <div class="row">
                      <div class="col-4" />
                      <div class="col-4">
                        1.
                      </div>
                    </div>
                  </div>
                  <div class="col-11">
                    Telah Melakukan Pemeriksaan dan Penilaian terhadap
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1">
                    <!-- <div class="row">
                      <div class="col-8" />
                      <div class="col-2">
                        a.
                      </div>
                    </div> -->
                  </div>
                  <div class="col-3">
                    a. Pekerjaan
                  </div>
                  <div class="col-7">
                    <div class="">
                      {{ store.item?.belanja }}
                    </div>
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1">
                    <!-- <div class="row">
                      <div class="col-5" />
                      <div class="col-4">
                        b.
                      </div>
                    </div> -->
                  </div>
                  <div class="col-3">
                    b. Penyedia Barang/Jasa
                  </div>
                  <div class="col-7">
                    <app-input v-model="namaSupplier" valid label="Nama PIC penyedia" :filled="false"
                      class="print-hide" />
                    <div class="print-only">
                      {{ namaSupplier }}
                    </div>
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1">
                    <!-- <div class="row">
                      <div class="col-5" />
                      <div class="col-4">
                        c.
                      </div>
                    </div> -->
                  </div>
                  <div class="col-3">
                    c. Nilai
                  </div>
                  <div class="col-7">

                    <div>
                      {{ formatRpDouble(store.item?.totalSemua, 2) }}
                    </div>
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1">
                    <!-- <div class="row">
                      <div class="col-5" />
                      <div class="col-4">
                        d.
                      </div>
                    </div> -->
                  </div>
                  <div class="col-3">
                    d. Alamat
                  </div>
                  <div class="col-7">
                    <app-input v-model="alamatSupplier" valid label="Nama PIC penyedia" :filled="false"
                      class="print-hide" />
                    <div class="print-only">
                      {{ alamatSupplier }}
                    </div>
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-start q-my-sm">
                  <div class="col-1">
                    <div class="row">
                      <div class="col-4" />
                      <div class="col-4">
                        2.
                      </div>
                    </div>
                  </div>
                  <div class="col-11">
                    Bahwa hasil pemeriksaan pelaksanaan pekerjaan sebagaimana dimaksud pada angka 1 di atas menunjukkan
                    bahwa penyedia Barang telah menyelesaikan seluruh pekerjaan sesuai dengan spesifikasi teknis
                    sebagaimana dimaksud pada dokumen penunjangnya.
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-start q-my-sm">
                  <div class="col-1">
                    <div class="row">
                      <div class="col-4" />
                      <div class="col-4">
                        3.
                      </div>
                    </div>
                  </div>
                  <div class="col-11">
                    Berdasarkan hasil pemeriksaan dan kemajuan pelaksanaan pekerjaan sebagaimana dimaksud pada angka 1
                    dan 2 di atas,
                    maka PPK menyatakan dapat menerima hasil pekerjaan yang dilaksanakan oleh : <b>{{ namaSupplier
                    }}</b>
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-start q-my-sm">
                  <div class="col-1">
                    <div class="row">
                      <div class="col-4" />
                      <div class="col-4">
                        4.
                      </div>
                    </div>
                  </div>
                  <div class="col-11">
                    Terlampir Laporan Pemeriksaan sebagai bagian tak terpisahkan dari Berita Acara Hasil Pemeriksaan
                    Hasil Pekerjaan : <b>{{ store.item?.belanja
                    }}</b>
                  </div>
                </div>
                <div class="row">Demikian Berita Acara ini dibuat sebagai dasar pelaksanaan serah terima pekerjaan.
                </div>

              </q-card-section>
              <!-- tanda tangan -->
              <q-card-section>
                <div class="row justify-between q-col-gutter-sm ">
                  <div class="col-6 text-center" />
                  <div class="col-6 text-center">
                    Probolinggo, {{ dateFullFormat(store?.item?.tanggal) }}
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm print-hide">
                  <div class="col-6 text-center">
                    <!-- <app-autocomplete-new v-model="tandatangan.tt.kiri" label="pilih yang berdanda tangan"
                      autocomplete="nama" option-label="nama" option-value="value" outlined valid
                      :source="tandatangan?.optionTT" @on-select="tandatangan?.kiriSelected" /> -->
                  </div>
                  <div class="col-6 text-center">
                    <app-autocomplete-new v-model="tandatangan.tt.kanan" label="pilih yang berdanda tangan"
                      autocomplete="nama" option-label="nama" option-value="value" outlined valid
                      :source="tandatangan?.optionTT" @on-select="tandatangan?.kananSelected" />
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm">
                  <!-- <div class="col-6 text-center">
                    {{ tandatangan?.kiri }}
                  </div> -->
                  <div class="col-6 text-center">
                    {{ tandatangan?.kanan }}
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm q-mb-xl">
                  <div class="col-6 text-center">
                    <!-- {{ tandatangan?.onKiri?.acr }} -->
                  </div>
                  <div class="col-6 text-center">
                    {{ tandatangan?.onKanan?.acr }}
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm">
                  <div class="col-6 text-center">
                    <!-- <div v-if="!tandatangan?.onKiri?.ada">
                      <div v-if="tandatangan?.tt?.kiri !== null">
                        <div class="print-hide">
                          <app-input v-model="freeTextKiri" valid label="Nama" :filled="false" />
                        </div>
                        <div class="print-only">
                          {{ freeTextKiri === '' ? '(.......................................)' : freeTextKiri }}
                        </div>
                      </div>
                    </div>
                    <div v-if="tandatangan?.onKiri?.ada">
                      <div class="row justify-center">
                        {{ tandatangan?.onKiri?.nama }}
                      </div>
                      <div class="row justify-center">
                        {{ tandatangan?.onKiri?.nip }}
                      </div>
                    </div> -->
                  </div>
                  <div class="col-6 text-center">
                    <div v-if="!tandatangan?.onKanan?.ada">
                      <div v-if="tandatangan?.tt?.kanan !== null">
                        <div class="print-hide">
                          <app-input v-model="freeTextKanan" valid label="Nama" :filled="false" />
                        </div>
                        <div class="print-only">
                          {{ freeTextKanan === '' ? '(.......................................)' : freeTextKanan }}
                        </div>
                      </div>
                    </div>
                    <div v-if="tandatangan.onKanan.ada">
                      <div class="row justify-center">
                        {{ tandatangan.onKanan.nama }}
                      </div>
                      <div class="row justify-center">
                        {{ tandatangan.onKanan.nip }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </div>
            <q-separator size="6px" color="dark" />
            <div class="f-16 text-bold q-ma-md">Lampiran</div>
            <q-separator size="3px" color="dark" />
            <div id="printLamp">
              <q-card-section>
                <div class="row justify-center text-weight-bold f-20 q-py-sm">
                  DAFTAR PEMERIKSAAN PEKERJAAN
                </div>
                <div class="row justify-center q-pb-sm">
                  {{ store.item?.belanja }}
                </div>
                <!-- no details -->
                <div v-if="!allRinci?.length">
                  <app-no-data />
                </div>
                <!-- details -->
                <div v-if="allRinci?.length" class="q-pt-md q-px-xs " style="min-height: 400px;">
                  <!-- header detail -->

                  <table style="width: calc(100vw - 80px); ">
                    <thead class="my-sticky-header-table">
                      <tr>
                        <th width="5%" rowspan="2">
                          No
                        </th>
                        <th rowspan="2">
                          Nama Barang
                        </th>
                        <th rowspan="2">
                          Jumlah
                        </th>
                        <th colspan="2">
                          Spesifikasi
                        </th>
                        <th colspan="2">
                          Jumlah Produk
                        </th>
                        <th colspan="2">
                          Kualitas
                        </th>
                        <th colspan="2">
                          Jadwal SP
                        </th>
                        <th colspan="2">
                          Lokasi Pengiriman
                        </th>
                      </tr>
                      <tr>
                        <th>
                          Ya
                        </th>
                        <th>
                          Tdk
                        </th>
                        <th>
                          Ya
                        </th>
                        <th>
                          Tdk
                        </th>
                        <th>
                          Ya
                        </th>
                        <th>
                          Tdk
                        </th>
                        <th>
                          Ya
                        </th>
                        <th>
                          Tdk
                        </th>
                        <th>
                          Ya
                        </th>
                        <th>
                          Tdk
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="!allRinci?.length">
                        <tr>
                          <td colspan="15">
                            <app-no-data />
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <template v-for="(item, n) in allRinci" :key="n">
                          <tr :class="n % 2 === 0 ? 'even' : 'odd'">
                            <td width="5%">
                              <div class="row items-center">
                                {{ n + 1 }}
                              </div>
                            </td>
                            <td style="white-space: normal; width: 200px;">
                              <div class="row items-end">
                                <div class="col-auto  q-mr-md">
                                  {{ item?.masterobat?.nama_obat }}
                                </div>

                              </div>
                            </td>
                            <td style="white-space: normal; width: 100px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto ">
                                  {{ item?.jml_terima_b }}
                                </div>
                                <div class="col-auto q-mr-md ">
                                  ({{ item?.satuan }})
                                </div>
                              </div>
                            </td>
                            <!-- spesifikasi start-->
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.spesifikasi" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="ya" />
                                </div>
                                <div v-if="item.spesifikasi == 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" />
                                </div>

                              </div>
                            </td>
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.spesifikasi" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="tidak" />
                                </div>
                                <div v-if="item.spesifikasi != 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" color="dark" />
                                </div>
                              </div>
                            </td>
                            <!-- spesifikasi end-->
                            <!-- Jumlah Produk start-->
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.jumlah_prd" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="ya" />
                                </div>
                                <div v-if="item.jumlah_prd == 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" />
                                </div>

                              </div>
                            </td>
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.jumlah_prd" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="tidak" />
                                </div>
                                <div v-if="item.jumlah_prd != 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" color="dark" />
                                </div>
                              </div>
                            </td>
                            <!-- Jumlah Produk end-->
                            <!-- Kualitas start-->
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.kualitas" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="ya" />
                                </div>
                                <div v-if="item.kualitas == 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" />
                                </div>

                              </div>
                            </td>
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.kualitas" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="tidak" />
                                </div>
                                <div v-if="item.kualitas != 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" color="dark" />
                                </div>
                              </div>
                            </td>
                            <!-- Kualitas end-->
                            <!-- Jadwal SP start-->
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.jadwal" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="ya" />
                                </div>
                                <div v-if="item.jadwal == 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" />
                                </div>

                              </div>
                            </td>
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.jadwal" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="tidak" />
                                </div>
                                <div v-if="item.jadwal != 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" color="dark" />
                                </div>
                              </div>
                            </td>
                            <!-- Jadwal SP end-->
                            <!-- Lokasi Pengiriman start-->
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.lokasi" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="ya" />
                                </div>
                                <div v-if="item.lokasi == 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" />
                                </div>

                              </div>
                            </td>
                            <td style="white-space: normal; width: 50px;">
                              <div class="row items-end justify-end">
                                <div class="col-auto q-mr-md print-hide">
                                  <q-radio v-model="item.lokasi" dense checked-icon="icon-mat-done"
                                    unchecked-icon="icon-mat-panorama_fish_eye" val="tidak" />
                                </div>
                                <div v-if="item.lokasi != 'ya'" class="col-auto q-mr-md print-only">
                                  <q-icon name="icon-mat-done" size="xs" color="dark" />
                                </div>
                              </div>
                            </td>
                            <!-- Lokasi Pengiriman end-->
                          </tr>
                        </template>
                      </template>
                    </tbody>
                  </table>
                </div>
              </q-card-section>
              <!-- tanda tangan -->
              <q-card-section>
                <div class="row justify-between q-col-gutter-sm ">
                  <div class="col-6 " />
                  <div class="col-6 ">
                    Probolinggo, {{ dateFullFormat(store?.item?.tanggal) }}
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm print-hide">
                  <div class="col-6 ">
                    <app-autocomplete-new v-model="tandatangan.tt.kiri" label="pilih yang berdanda tangan"
                      autocomplete="nama" option-label="nama" option-value="value" outlined valid
                      :source="tandatangan?.optionTT" @on-select="tandatangan?.kiriSelected" />
                  </div>
                  <div class="col-6 ">
                    <!-- <app-autocomplete-new v-model="tandatangan.tt.kanan" label="pilih yang berdanda tangan"
                      autocomplete="nama" option-label="nama" option-value="value" outlined valid
                      :source="tandatangan?.optionTT" @on-select="tandatangan?.kananSelected" /> -->
                  </div>
                </div>

                <div class="row justify-between q-col-gutter-sm q-mb-xl">
                  <div class="col-6 ">
                    <div class="row">
                      {{ tandatangan?.onKiri?.acr }}
                    </div>
                    <div class="row">
                      UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo
                    </div>
                  </div>
                  <div class="col-6 ">
                    <div class="row">Penyedia Barang / Jasa</div>
                    <div class="row">{{ namaSupplier }}</div>
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm">
                  <div class="col-6 ">
                    <div v-if="!tandatangan?.onKiri?.ada">
                      <div v-if="tandatangan?.tt?.kiri !== null">
                        <div class="print-hide">
                          <app-input v-model="freeTextKiriBawah" valid label="Nama" :filled="false" />
                        </div>
                        <div class="print-only">
                          {{ freeTextKiriBawah === '' ? '(.......................................)' : freeTextKiriBawah
                          }}
                        </div>
                      </div>
                    </div>
                    <div v-if="tandatangan?.onKiri?.ada">
                      <div class="row ">
                        {{ tandatangan?.onKiri?.nama }}
                      </div>
                      <div class="row ">
                        {{ tandatangan?.onKiri?.nip }}
                      </div>
                    </div>
                  </div>
                  <div class="col-6 ">
                    <div>
                      <div>
                        <div class="print-hide">
                          <app-input v-model="freeTextKananBawah" valid label="Nama Penanggung jawab supplier"
                            :filled="false" />
                        </div>
                        <div class="print-only">
                          {{ freeTextKananBawah === '' ? '(.......................................)' :
                            freeTextKananBawah }}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div class="print-hide">
                          <app-input v-model="jabatanSupplier" valid label="Jabatan PJ Supplier" :filled="false" />
                        </div>
                        <div class="print-only">
                          {{ jabatanSupplier === '' ? '(.......................................)' :
                            jabatanSupplier }}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm q-mt-lg">
                  <div class="col-6 ">
                    Tim Teknis
                  </div>
                  <div class="col-6 " />
                </div>
                <div class="row justify-between q-col-gutter-sm">
                  <div class="col-6">
                    <div class="row">
                      Apoteker Penanggung Jawab
                    </div>
                    <div class="row">
                      Gudang Farmasi
                    </div>
                  </div>
                  <div class="col-6 " />
                </div>
                <div class="row justify-between q-col-gutter-sm q-mt-xl">
                  <div class="col-6">
                    <div class="print-hide">
                      <app-input v-model="namaApoteker" valid label="Nama Apoteker penanggung jawab" :filled="false" />
                    </div>
                    <div>
                      {{ namaApoteker === '' ? '(.......................................)' : namaApoteker
                      }}
                    </div>
                  </div>
                  <div class="col-6 " />
                </div>
                <div class="row justify-between q-col-gutter-sm">
                  <div class="col-6">
                    <div class="print-hide">
                      <app-input v-model="sipaApoteker" valid label="Sipa Apoteker penanggung jawab" :filled="false" />
                    </div>
                    <div>
                      {{ sipaApoteker === '' ? '(.......................................)' : sipaApoteker
                      }}
                    </div>
                  </div>
                  <div class="col-6 " />
                </div>
              </q-card-section>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { date } from 'quasar'
import { dateFullFormat, formatRp, formatRpDouble } from 'src/modules/formatter'
import { useListBastPenerimaanFarmasiStore } from 'src/stores/simrs/farmasi/bast/list'
import { useTandaTanganStore } from 'src/stores/simrs/logistik/sigarang/tantatangan/tandatangan'
import { computed, ref } from 'vue'

const emits = defineEmits(['close', 'show', 'hide'])

const store = useListBastPenerimaanFarmasiStore()
const tandatangan = useTandaTanganStore()
if (tandatangan.optionPTK?.length <= 0) tandatangan.getDataPtk()
if (tandatangan.optionPPK?.length <= 0) tandatangan.getDataPpk()
if (tandatangan.optionGudang?.length <= 0) tandatangan.getDataGudang()
if (tandatangan.optionMengetahui?.length <= 0) {
  tandatangan.getDataMengetahui().then(() => {
    tandatangan.getDataIndex().then(() => {
      tandatangan.tt.kiri = 'ppk'
      tandatangan.tt.kanan = 'ppk'
      tandatangan.kananSelected('ppk')
      tandatangan.kiriSelected('ppk')
    })
  })
} else {
  tandatangan.tt.kiri = 'ppk'
  tandatangan.tt.kanan = 'ppk'
  tandatangan.kananSelected('ppk')
  tandatangan.kiriSelected('ppk')

}
// tandatangan.getInitialData()
// semua rincian penerimaan
const allRinci = computed(() => {
  return store.item?.penerimaan?.flatMap(det => det?.penerimaanrinci || []) || []
})
// nomor BAP
function nomorBap (val) {
  const str = val
  const parts = str.split("/")
  parts[parts.length - 1] = "BAP-FAR"
  const replaced = parts.join("/")
  return replaced
  // console.log(replaced)

}

// tanggal terbilang
function tanggalTerbilang (val) {
  // console.log(val)
  switch (val) {
    case '01':
      return 'Satu'

    case '02':
      return 'Dua'

    case '03':
      return 'Tiga'

    case '04':
      return 'Empat'

    case '05':
      return 'Lima'

    case '06':
      return 'Enam'

    case '07':
      return 'Tujuh'

    case '08':
      return 'Delapan'

    case '09':
      return 'Sembilan'

    case '10':
      return 'Sepuluh'

    case '11':
      return 'Sebelas'

    case '12':
      return 'Dua Belas'

    case '13':
      return 'Tiga Belas'

    case '14':
      return 'Empat Belas'

    case '15':
      return 'Lima Belas'

    case '16':
      return 'Enam Belas'

    case '17':
      return 'Tujuh Belas'

    case '18':
      return 'Delapan Belas'

    case '19':
      return 'Sembilan Belas'

    case '20':
      return 'Dua Puluh'

    case '21':
      return 'Dua Puluh Satu'

    case '22':
      return 'Dua Puluh Dua'

    case '23':
      return 'Dua Puluh Tiga'

    case '24':
      return 'Dua Puluh Empat'

    case '25':
      return 'Dua Puluh Lima'

    case '26':
      return 'Dua Puluh Enam'

    case '27':
      return 'Dua Puluh Tujuh'

    case '28':
      return 'Dua Puluh Delapan'

    case '29':
      return 'Dua Puluh Sembilan'

    case '30':
      return 'Tiga Puluh'

    case '31':
      return 'Tiga Puluh Satu'

    default:
      return ''
  }
}
// tahun terbilang
function tahunTerbilang (val) {
  const temp = val.split('')
  let satuan = ''
  let puluhan = ''
  if (temp[2] === '1') {
    if (temp[3] === '1') {
      puluhan = 'Sebelas'
    }
    else {
      puluhan = bilangan(temp[3])
      satuan = 'belas'
    }
  }
  else {
    puluhan = bilangan(temp[2]) + ' puluh'
    satuan = bilangan(temp[3])
  }
  const ratusan = temp[1] === '1' ? 'Seratus' : temp[1] === '0' ? '' : (bilangan(temp[0]) + ' ratus')
  const ribuan = temp[0] === '1' ? 'Seribu' : temp[0] === '0' ? '' : (bilangan(temp[0]) + ' ribu')
  // console.log('tahun', ribuan, ratusan, puluhan, satuan)
  return ribuan + ' ' + ratusan + ' ' + puluhan + ' ' + satuan
}

// bilangan
function bilangan (val) {
  switch (val) {
    case '1':
      return 'Satu'

    case '2':
      return 'Dua'

    case '3':
      return 'Tiga'

    case '4':
      return 'Empat'

    case '5':
      return 'Lima'

    case '6':
      return 'Enam'

    case '7':
      return 'Tujuh'

    case '8':
      return 'Delapan'

    case '9':
      return 'Sembilan'

    case '0':
      return ''

    default:
      return ''
  }
}


// identitas supplier
const namaSupplier = ref('')
const alamatSupplier = ref('')
const jabatanSupplier = ref('')

// nama rekening belanja
const namaRekeningBelanja = ref('')

const freeTextKanan = ref('')
const freeTextKiriBawah = ref('')
const freeTextKananBawah = ref('')
// apoteker
const namaApoteker = ref('')
const sipaApoteker = ref('')
function show () {
  emits('show')
  namaRekeningBelanja.value = store?.item?.belanja ?? ''
  namaSupplier.value = store?.item?.penyedia ?? ''
  alamatSupplier.value = store?.item?.alamat_penyedia ?? ''
}

const printObj = {
  id: 'printMe',
  popTitle: ' '
}
const printDua = {
  id: 'printLamp',
  popTitle: ' '
}
</script>

<style lang="scss" scoped>
.sticky {
  position: sticky;
  z-index: 1;
}

.q-table td box {
  white-space: normal !important;
  inline-size: 100px;
  overflow-wrap: break-word;
}

.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: normal !important;
}

.print {
  position: absolute;
  right: 30px;
  top: 5px;
  z-index: 10;
}

.garis-bawah {
  border-bottom: 6px solid black;
  border-bottom-style: double;
}

.border-box {
  border: 1px solid black;
}

.border-tb {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.border-left {
  border-left: 1px solid black;
}

.border-right {
  border-right: 1px solid black;
}

.border-bottom {
  border-bottom: 1px solid black;
}

// style for tabel detail

.hv:hover {
  background-color: #0D5A86;
  color: #fff
}

.gt {
  border-top: 1px solid black;
}

.gka {
  border-right: 1px solid black;
}

.gki {
  border-left: 1px solid black;
}

.gb {
  border-bottom: 1px solid black;
}

//
.head {
  border: 1px solid rgb(44, 43, 43);
  padding-left: 10px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
}

.child {
  border-bottom: 1px solid rgb(44, 43, 43);
  border-left: 1px solid rgb(44, 43, 43);
  border-right: 1px solid rgb(44, 43, 43);
  padding-left: 10px;
}

.text-end {
  text-align: end;
}

/* Standard Tables */

table {
  // margin: 1em 0;
  border-collapse: collapse;
  border: 1px solid #d6d6d6;
  width: 100%;
  margin-bottom: 50px;
}

thead {
  border: 1px solid black;

  tr {
    th {
      border: 1px solid black;
      vertical-align: center !important;
      background-color: white;
      color: black;
    }
  }
}

.odd {
  background-color: rgba(255, 255, 255, 0.05);
}

.even {
  background-color: rgba(0, 0, 0, 0.05);
}

th {
  border: 1px solid black;

}

td {

  text-align: left;
  text-indent: 2px;
  vertical-align: center;
  border: 1px solid black;
}

// td {
//   // padding: 0.5em 0.5em 0.5em 1.5em;
// padding: 0.5em 0.5em 0.5em 1em;
// }
// th {
// border: inherit;
// border: 1px solid black;
// }
tr {
  border: 1px solid black;
}

tr:nth-child(even) th[scope=row] {
  background-color: #f2f2f2;
}

tr:nth-child(odd) th[scope=row] {
  background-color: #fff;
}

// tr:nth-child(even) {
//   background-color: rgba(0, 0, 0, 0.05);
// }

// tr:nth-child(odd) {
//   background-color: rgba(255, 255, 255, 0.05);
// }

// td:nth-of-type(2) {
//   font-style: italic;
// }

// th:nth-of-type(3),
// td:nth-of-type(3) {
//   text-align: right;
// }
/* Fixed Headers */

th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 5;
  border: inherit;
}

th[scope=row] {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
  border: inherit;
}

th[scope=row] {
  vertical-align: top;
  color: inherit;
  background-color: inherit;
  background: linear-gradient(90deg, transparent 0%, transparent calc(100% - .05em), #d6d6d6 calc(100% - .05em), #d6d6d6 100%);
  border: inherit;
}

table:nth-of-type(2) th:not([scope=row]):first-child {
  left: 0;
  z-index: 3;
  background: linear-gradient(90deg, #666 0%, #666 calc(100% - .05em), #ccc calc(100% - .05em), #ccc 100%);
}

/* Strictly for making the scrolling happen. */

th[scope=row]+td {
  min-width: 24em;
}

th[scope=row] {
  min-width: 20em;
}
</style>
