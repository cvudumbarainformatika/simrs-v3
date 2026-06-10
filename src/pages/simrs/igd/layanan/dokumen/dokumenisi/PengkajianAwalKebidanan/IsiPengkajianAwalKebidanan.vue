<template>
  <div class="col-auto print-page">
    <!-- <div class="row b full-width full-height ">
      <div class="col text-center q-py-xs flex-center">
        <div class="text-bold" style="font-size: 17px">PENGKAJIAN AWAL KEBIDANAN IGD</div>
      </div>
    </div> -->
    <div v-for="(item, n) in pasien?.anamnesekebidanan" :key="n" class="row b full-width full-height ">
      <div class="row full-width q-px-sm q-py-xs">
        <div class="col flex-center">
          DIPERIKSA :
        </div>
        <div class="col flex-center">
          Tanggal : {{ dateFullFormat(pasien?.tgl_kunjungan) }}, Pukul : {{ formatJam(pasien?.tgl_kunjungan) }} WIB
        </div>
      </div>
      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col">
          Informasi didapat dari :
          <template
            v-if="pasien?.generalcons?.hubunganpasien === 'Ibu Kandung' || pasien?.generalcons?.hubunganpasien === 'Ayah Kandung'">
            Keluarga, Nama : {{ pasien?.generalcons?.nama }}, Hubungan : {{ pasien?.generalcons?.hubunganpasien }}
          </template>
          <template v-else-if="pasien?.generalcons?.hubunganpasien === 'Saudara'"> Orang Lain, Nama : {{
            pasien?.generalcons?.nama }}, Hubungan : {{
              pasien?.generalcons?.hubunganpasien }}
          </template>
          <template v-else> Pasien
          </template>
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          I. IDENTITAS PASIEN
        </div>
      </div>
      <div class="row justify-between full-width full-height ">
        <div class="row" style="width:50%">
          <div class="col-12 text-center text-weight-bold">
            PASIEN
          </div>
          <div class="col-12 q-px-sm">
            <div class="row">
              <div class="col-4">
                Nama
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ pasien?.nama ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Pendidikan
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ pasien?.pendidikan ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Pekerjaan
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ pasien?.pekerjaan ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Agama
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ pasien?.agama ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Gol. Darah
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ pasien?.gol_darah ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                No. Telp
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ pasien?.telp ?? '-' }}
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="width:50%;">
          <div class="col-12 text-center text-weight-bold">
            SUAMI
          </div>
          <div class="col-12 q-px-sm">
            <div class="row">
              <div class="col-4">
                Nama
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ props?.historyperkawinan?.[0]?.namasuami ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Pendidikan
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ props?.historyperkawinan?.[0]?.pendidikansuami ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Pekerjaan
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ props?.historyperkawinan?.[0]?.pekerjaansuami ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Agama
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ props?.historyperkawinan?.[0]?.agamasuami ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Gol. Darah
              </div>
              <!-- <div class="q-px-md" /> -->
              <div class="col-6">
                : {{ props?.historyperkawinan?.[0]?.goldarahsuami ?? '-' }}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          II. KELUHAN UTAMA
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-3">
          {{ item?.keluhanutama ?? '-' }}
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          III. RIWAYAT KESEHATAN
        </div>
      </div>

      <!-- <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-3">
          1. Riwayat Penyakit Lalu :
        </div>
        <div class="col-2">
          <q-option-group disable v-model="selectedPenyakitlalu" :options="optionYaTidak" color="primary" inline
            dense />
        </div>
        <div class="col">
          Penyakit:
          <span class="">{{ selectedPenyakitlalu !== 'Tidak Ada' || selectedPenyakitlalu !== '-' ?
            getDetailRiwayatPenyakit() : '-'
            }}</span>
        </div>
      </div> -->
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          1. Riwayat Penyakit Sekarang
        </div>
        <div class="col">
          : {{ item?.riwayatpenyakitsekarang }}
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          2. Riwayat Penyakit Lalu
        </div>
        <div class="col">
          : {{ item?.riwayatpenyakit }}
        </div>
      </div>

      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          3. Riwayat Pengobatan
        </div>
        <div class="col">
          : {{ item?.riwayatpengobatan }}
        </div>
      </div>

      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          4. Riwayat Penyakit Keluarga
        </div>
        <div class="col">
          : {{ item?.riwayatpenyakitkeluarga }}
        </div>
      </div>

      <!-- <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          3. Ketergantungan terhadap zat tertentu
        </div>
        <div class="col">
          : {{ getDetailRiwayatKetergantunganZat() }}
        </div>
      </div> -->

      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          5. Riwayat Pekerjaan (apakah berhubungan dengan zat berbahaya)
        </div>
        <div class="col">
          : {{ item?.riwayatpekerjaan }}
        </div>
      </div>

      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          6. Riwayat Alergi
        </div>
        <div class="col">
          : {{ getDetailRiwayatAlergi() }}
        </div>
      </div>

      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          7. Riwayat Pemakaian Alat Kontrasepsi
        </div>
        <div class="col">
          <div class="row">
            <div class="q-pr-xs">:</div> <q-option-group disable v-model="selectedKontrasepsi"
              :options="optionKontrasepsi" color="primary" inline dense />
          </div>
        </div>

      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
        </div>
        <div class="col">
          Jenis :
          <span class="q-pr-sm">{{ selectedKontrasepsi !== 'Tidak' ?
            getDetailKontrasepsi() : '-'
            }}, </span>
          Lama Pemakaian :
          <span class="">{{ selectedKontrasepsi !== 'Tidak' ?
            getLamaPemakaian() : '-'
            }}</span>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
        </div>
        <div class="col">
          Keluahan :
          <span class="q-pr-sm">{{ selectedKontrasepsi !== 'Tidak' ?
            getKeluhanKontrasepsi() : '-'
            }}</span>
        </div>
      </div>


      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col">
          8. Riwayat Pernikahan
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">a. Status Pernikahan</div>
            <div class="col-9">
              <div class="row">
                <span class="q-pr-xs">: </span>
                <q-option-group disable v-model="selectedMenikah" :options="optionMenikah" color="primary" inline
                  dense />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">b. Umur Waktu Pertama Kali Kawin </div>
            <div class="col-9">: {{ item?.umurpertamanikah }} tahun</div>
          </div>
        </div>
      </div>


      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col">
          9. Riwayat Menstruasi :
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">a. Menarche Umur</div>
            <div class="col-9">
              <div class="row">
                <span class="q-pr-xs">: </span>
                <span class="q-pr-xs">{{ getUmurMens() }}</span>
                <span class="q-pl-sm">
                  <q-option-group disable v-model="selectedMens" :options="optionMens" color="primary" inline dense />
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">b. Keluhan Saat Haid</div>
            <div class="col-9">
              <div class="row">
                <span class="q-pr-xs">: </span>
                <q-option-group disable v-model="selectedKeluhanHaid" :options="optionKeluhanHaid" color="primary"
                  inline dense />
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col-6">
          10. Riwayat Penyakit Ginekologi
        </div>
        <div class="col">
          <div class="row">
            <div class="q-pr-xs">:</div> <q-option-group disable v-model="selectedGinekologi" :options="optionYaTidak"
              color="primary" inline dense />
            <div class="q-pl-sm">{{ getDetailRiwayatGinekologi() }}</div>
          </div>
        </div>
      </div>


      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col">
          11. Riwayat Hamil ini
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">a. Gravida/Partus/Abortus</div>
            <div class="col-9">
              <div class="row">
                <span class="q-pr-xs">: </span>
                <span class="q-pr-xs">{{ getGPA() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">b. HPHT</div>
            <div class="col-9">
              <div class="row">
                <span class="q-pr-xs">: </span>
                <span class="q-pr-xs">{{ item?.haid }},</span>
                <span class="q-pr-xs">Taksiran Partus : {{ item?.taksiranpartus }} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">c. Asuhan Antenatal</div>
            <div class="col-9">
              <div class="row">
                <div class="q-pr-xs">:</div> <q-option-group disable v-model="selectedAntenatal"
                  :options="optionYaTidak" color="primary" inline dense />
                <div class="q-pl-sm">{{ getDetailAsupanAntenatal() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">c. Frekuensi</div>
            <div class="col-9">
              <div class="row">
                <div class="">: {{ item?.frekuensi }},</div>
                <div class="q-pl-xs">Imunisasi TT : {{ getImunisasiTT() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">d. Keluhan Saat Hamil</div>
            <div class="col-9">
              <div class="row">
                <div class="">: {{ getKeluhanHamil() }},</div>
                <div class="">{{ getdetailKeluhanHamil() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          IV. PEMERIKSAAN UMUM
        </div>
      </div>
      <div v-for="(triage, x) in pasien?.triage" :key="x" class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">Kesadaran</div>
            <div class="col-9">: {{ triage?.kesadaran ?? '-' }}</div>
          </div>
          <div class="row">
            <div class="col">TD : {{ triage?.sistole ?? '-' }}/{{ triage?.diastole ??
              '-' }} mmHg</div>
            <div class="col"> Nadi : {{ triage?.nadi ?? '-' }} x/mnt,</div>
            <div class="col"> Suhu : {{ triage?.suhu ?? '-' }} °C,</div>
            <div class="col"> RR : {{ triage?.pernapasanx ?? '-' }} x/mnt,</div>

          </div>
          <div class="row">
            <div class="col"> SpO2 : {{ triage?.spo2 ?? '-' }} %,</div>
            <div class="col"> BB : {{ triage?.bb ?? '-' }} kg,</div>
            <div class="col"> TB : {{ triage?.tb ?? '-' }} cm,</div>
          </div>
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          V. PEMERIKSAAN FISIK
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">a. Kepala</div>
            <div class="col-9">: {{ pasien?.pemeriksaanfisikpsikologidll?.[0]?.rs5 ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">b. Leher</div>
            <div class="col-9">: {{ pasien?.pemeriksaanfisikpsikologidll?.[0]?.rs6 ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">c. Dada</div>
            <div class="col-9">: {{ pasien?.pemeriksaanfisikpsikologidll?.[0]?.rs7 ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">d. Punggung</div>
            <div class="col-9">: {{ pasien?.pemeriksaanfisikpsikologidll?.[0]?.rs8 ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">e. Perut</div>
            <div class="col-9">: {{ pasien?.pemeriksaanfisikpsikologidll?.[0]?.rs9 ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">f. Tangan</div>
            <div class="col-9">: {{ pasien?.pemeriksaanfisikpsikologidll?.[0]?.rs10 ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">g. Kaki</div>
            <div class="col-9">: {{ pasien?.pemeriksaanfisikpsikologidll?.[0]?.rs11 ?? '-' }}</div>
          </div>
        </div>
      </div>


      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          V. STATUS OBSTETRI DAN GINEKOLOGI
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">a. Periksa Luar</div>
            <div class="col-9">: {{ item?.periksaluarginekologi ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">b. Inspekulo</div>
            <div class="col-9">: {{ item?.inspekuloginekologi ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col-3">c. Periksa Dalam</div>
            <div class="col-9">: {{ item?.periksadalamginekologi ?? '-' }}</div>
          </div>
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          VII. RIWAYAT KEHAMILAN, PERSALINAN, DAN NIFAS
        </div>
      </div>
      <div class="row q-pb-xs justify-center full-width full-height ">
        <div class="row" style="width: 98%;">
          <table class="items-center full-width">
            <thead>
              <tr style="">
                <th class="text-center">
                  No.
                </th>
                <th class="text-center">
                  Tgl/Thn Partus
                </th>
                <th class="text-center">
                  Tempat
                </th>
                <th class="text-center">
                  Umur Kehamilan <br> (bulan)
                </th>
                <th class="text-center">
                  Jenis Persalinan
                </th>
                <th class="text-center">
                  Penolong
                </th>
                <th class="text-center">
                  Penyulit
                </th>
                <th class="text-center">
                  Anak
                </th>

                <th class="text-center">
                  Nifas
                </th>
                <th class="text-center">
                  Keadaan Anak Sekarang
                </th>
              </tr>
            </thead>
            <tbody class="align-middle q-pl-sm">
              <tr v-for="(xxx, x) in historykehamilan" :key="x">
                <td class="text-center">
                  {{ x + 1 }}
                </td>
                <td class="text-rigth">
                  <span class="text-h7">{{ xxx?.tanggal_partus }} </span>
                  <!-- <br> -->
                  <!-- <q-badge outline color="primary">
                    Tempat
                  </q-badge> {{ xxx?.tempat }} -->
                </td>
                <td class="text-rigth">
                  <span class="text-h7">{{ xxx?.tempat }} </span>
                </td>
                <td class="text-center ">
                  {{ xxx?.umurkehamilan }}
                </td>
                <td class="text-rigth ">
                  {{ xxx?.jenispersalinan }}
                </td>
                <td class="text-center">
                  {{ xxx?.penolong }}
                </td>
                <td class="text-center">
                  {{ xxx?.penyulit }}
                </td>
                <td class="text-rigth">
                  <q-badge outline color="primary">
                    JK
                  </q-badge> : {{ xxx?.jeniskelamin }}
                  <br>
                  <q-badge outline color="primary">
                    BB
                  </q-badge> : {{ xxx?.beratbadan }}
                  <br>
                  <q-badge outline color="primary">
                    PB
                  </q-badge>
                  : {{ xxx?.pb }}
                </td>

                <td class="text-center">
                  {{ xxx?.nifas }}
                </td>
                <td class="text-center">
                  {{ xxx?.penyulit }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          VII. RESIKO CEDERA ATAU JATUH
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col">Resiko Jatuh : (Gunakan Skor Up and Go)</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col">a. Perhatikan cara berjalan pasien saat akan duduk di kursi. Apakah pasien tampak tidak
              seimbang (sempoyongan)?
              <b> {{ getYT(pasien?.penilaiananamnesis?.[0]?.morse_fall?.gayaJalan?.skor) }}</b>
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col">b. Apakah pasien memegang pinggiran kursi atau meja atau benda lain sebagai penopang saat
              akan duduk?
              <b> {{ getYT(pasien?.penilaiananamnesis?.[0]?.morse_fall?.alatBantu?.skor) }}</b>
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col text-weight-bold">Hasil : {{ pasien?.penilaiananamnesis?.[0]?.morse_fall?.skorMorse?.label
            }}</div>
          </div>
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col">c. Gelisah : </div>
            <div class="col">Restrain : </div>
          </div>
          <div class="row">
            <div class="col">Diberikan ke dokter :</div>
            <div class="col">Jam : </div>
          </div>
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          IX. KEBUTUHAN KOMUNIKASI DAN EDUKASI
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col">Bicara : {{ item?.kebutuhankomunikasidanedukasi ?? '-' }}</div>
            <div v-if="item?.sebutkankomunaksilainnya !== null" class="col">Jelaskan :
              {{ item?.sebutkankomunaksilainnya }}</div>
          </div>
          <div class="row">
            <div class="col">Dibutuhkan penerjemah : {{ item?.penerjemah ?? '-' }}</div>
            <div v-if="item?.sebutkanpenerjemah !== null" class="col">Sebutkan :
              {{ item?.sebutkanpenerjemah }} </div>
            <div class="col">Bahasa Isyarat : {{ item?.bahasaisyarat ?? '-' }}</div>
          </div>
          <div class="row">
            <div class="col">Hambatan belajar : {{ item?.hamabatan ?? '-' }}</div>
            <div v-if="item?.sebutkanhambatan !== null" class="col">Sebutkan :
              {{ item?.sebutkanhambatan }} </div>
          </div>
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          X. DATA PSIKOSOSIAL EKONOMI DAN SPIRITUAL
        </div>
      </div>
      <div v-for="(data, n) in props.pasien?.pemeriksaanfisikpsikologidll" :key="n"
        class="row items-center q-px-sm q-pb-xs full-width ">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col">1. Psikologi : {{
              data?.pemerisaanpsikologidll?.status_psikologis_lain ??
              data?.pemerisaanpsikologidll?.status_psikologis }}</div>
          </div>
          <div class="row">
            <div class="col">2. Sosial : {{
              data?.pemerisaanpsikologidll?.sosial ?? '-' }}</div>
          </div>
          <div class="row">
            <div class="col">3. Ekonomi : {{
              data?.pemerisaanpsikologidll?.ekonomi ?? '-' }}</div>
          </div>
          <div class="row">
            <div class="col">4. Spiritual : {{
              data?.pemerisaanpsikologidll?.spiritual ?? '-' }}</div>
          </div>
          <div class="row">
            <div class="col">Nilai-nilai Kepercayaan dan Budaya yang diyakini : {{
              data?.pemerisaanpsikologidll?.nilai_kepercayaan }}, {{
                data?.pemerisaanpsikologidll?.ket_nilaikepercayaan }}</div>
          </div>
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          XI. PENGKAJIAN NYERI
        </div>
      </div>
      <div class="row items-center q-px-sm full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col">Apakah ada nyeri : {{ item?.keteranganscorenyeri ?? '-' }} </div>
          </div>
        </div>
      </div>
      <!-- <q-item v-for="(item, n) in pasien?.anamnesekebidanan" :key="n">
        <q-item-label> -->
      <div class="row items-center q-pl-lg full-width">
        <div class="col" v-if="item?.metodenyeri === 'nrt'">
          Skor Nyeri :
          <b> {{ item?.skornyeri ?? '-' }} </b>
          <span v-if="!isNaN(parseInt(item?.skornyeri))" class="q-mx-sm">
            <q-icon size="sm" color="teal" :name="iconNyeri(item?.skornyeri)" />
          </span>
          <em class="text-primary"> {{ item?.keteranganscorenyeri ?? '-' }}</em>
        </div>
        <div class="col" v-if="item?.metodenyeri === 'bps'">
          <div>- Ekspresi Wajah : {{ item?.ekspresiwajah }}</div>
          <div>- Gerakan Tangan : {{ item?.gerakantangan }}</div>
          <div>- Kepatuhan terhadap ventilasi mekanik : {{ item?.kepatuhanventilasimekanik
          }}</div>
          <div>
            <div>
              Skor Nyeri (BPS) =
              <q-badge :color="ketcolorbps(item?.scroebps)">
                {{ item?.scroebps }}
              </q-badge>
              Keterangan : <q-badge outline :color="ketcolorbps(item?.scroebps)">
                {{ item?.ketscorebps }}
              </q-badge>
            </div>
          </div>
        </div>
        <div class="col" v-if="item?.metodenyeri === 'nips'">
          <div>- Ekspresi Wajah : {{ item?.ekspresiwajahnips ?? '-' }}</div>
          <div>- Menangis : {{ item?.menangis ?? '-' }}</div>
          <div>- Pola Nafas : {{ item?.polanafas ?? '-' }}</div>
          <div>- Lengan : {{ item?.lengan ?? '-' }}</div>
          <div>- Kaki : {{ item?.kaki ?? '-' }}</div>
          <div>- Keadaan Rangsangan : {{ item?.keadaanrangsangan ?? '-' }}</div>
          <div>
            <div>
              Skor Nyeri (NIPS) =
              <q-badge :color="ketcolorbps(item?.scroenips)">
                {{ item?.scroenips }}
              </q-badge>
              Keterangan : <q-badge outline :color="ketcolorbps(item?.scroenips)">
                {{ item?.ketscorenips }}
              </q-badge>
            </div>
          </div>
        </div>

        <div class="col">
          Nyeri Hilang : {{ item?.nyerihilang ?? '-' }}
          <span v-if="item?.sebutkannyerihilang !== null">
            ( {{ item?.sebutkannyerihilang }} )
          </span>
        </div>
      </div>
      <!-- </q-item-label>
      </q-item> -->

      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <div class="row">
            <div class="col">Tipe : {{ item?.keteranganscorenyeri ?? '-' }} </div>
          </div>
          <div class="row">
            <div class="col">Lokasi Nyeri : {{ item?.lokasinyeri ?? '-' }} </div>
          </div>
          <div class="row">
            <div class="col">Frekuensi Nyeri : {{ item?.frekwensinyeri ?? '-' }} </div>
          </div>
          <div class="row">
            <div class="col">Lama Nyeri : {{ item?.durasinyeri ?? '-' }} </div>
          </div>
          <div class="row">
            <div class="col">Gejala Penyerta : Luka {{ item?.penyebabnyeri ?? '-' }} </div>
          </div>
        </div>
      </div>


      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          XII. SKRINING GIZI
        </div>
      </div>
      <div class="row items-center q-px-sm q-pb-xs full-width">
        <div class="col q-pl-md">
          <template v-if="item?.riwayatginekologi === 'Tidak'">
            <div class="row q-pb-xs">
              <div class="col">Untuk pasien dengan masalah Obstetri/Kehamilan/Nifas</div>
            </div>
            <div class="row q-pb-xs">
              <table class="items-center full-width">
                <thead>
                  <tr style="">
                    <th class="text-center">
                      No.
                    </th>
                    <th class="text-center">
                      Parameter
                    </th>
                    <th class="text-center">
                      Penilaian
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(it, x) in skriningGizi" :key="x">
                    <td class="text-center">
                      {{ x + 1 }}
                    </td>
                    <td class="text-rigth">
                      {{ it?.label }}
                    </td>
                    <td class="text-rigth">
                      {{ getYT(it?.value) }} ({{ it?.value }})
                    </td>
                  </tr>
                  <tr>
                    <td>
                    </td>
                    <td class="text-center text-weight-bold">
                      Total Skor
                    </td>
                    <td>
                      {{ item?.skorgizix }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <div class="row q-pb-xs">
              <div class="col">Untuk pasien dengan masalah Ginekologi/Onkologi</div>
            </div>
            <div class="row q-pb-xs">
              <table class="items-center full-width">
                <thead>
                  <tr style="">
                    <th class="text-center">
                      No.
                    </th>
                    <th class="text-center">
                      Parameter
                    </th>
                    <th class="text-center">
                      Penilaian
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(it, x) in masalahGinekologi" :key="x">
                    <td class="text-center">
                      {{ x + 1 }}
                    </td>
                    <td class="text-rigth">
                      {{ it?.label }}
                    </td>
                    <td class="text-rigth">
                      {{ getYT(it?.value) }} ({{ it?.value }})
                    </td>
                  </tr>
                  <tr>
                    <td>
                    </td>
                    <td class="text-center text-weight-bold">
                      Total Skor
                    </td>
                    <td>
                      {{ item?.skorgizix }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <div class="row">
            <div class="col text-weight-bold">Bila jawaban ya lebih dari sama dengan 1, dilaporkan pada tim terapi gizi.
            </div>
          </div>
          <div class="row">
            <div class="col text-weight-bold">Bila Skor lebih dari sama dengan 2 dan pasien dengan diagnosa khusus
              dilakukan pengkajian
              lebih lanjut oleh Nutrisionis</div>
          </div>
        </div>
      </div>

      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          XIII. DIAGNOSA KEBIDANAN
        </div>
      </div>
      <div class="row q-pb-xs q-px-sm q-pl-lg full-width">
        <table class="items-center full-width">
          <thead>
            <tr style="">
              <th class="text-center">
                Diagnosa Keperawatan
              </th>
              <th class="text-center">
                Plann
              </th>
              <th class="text-center">
                Intervensi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="diag in props.pasien?.diagnosakebidanan" :key="diag.id">
              <td class="text-left" style="vertical-align: top;">
                {{ diag.kode }} - {{ diag.nama }}
              </td>
              <!-- Kolom Plann -->
              <td class="text-left" style="vertical-align: top;">
                <div v-for="sub in diag.intervensi" :key="sub.id">
                  <template v-if="sub?.masterintervensi?.group === 'plann'">
                    • {{ sub?.masterintervensi?.nama }}<br>
                  </template>
                </div>
              </td>

              <!-- Kolom Intervensi -->
              <td class="text-left" style="vertical-align: top;">
                <div v-for="sub in diag.intervensi" :key="sub.id">
                  <template v-if="sub?.masterintervensi?.group !== 'plann'">
                    • {{ sub?.masterintervensi?.nama }}<br>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="row full-width q-pb-sm">
        <div class="ttd-kanan">
          <div class="q-py-xs">
            Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
          </div>
          <div class="text-bold">
            Bidan IGD
          </div>
          <div class="column flex-center">
            <div class="q-pt-xs" style="width: 80px;">
              <template v-if="item.pegawai">
                <vue-qrcode :value="qrDokter" tag="svg" :options="{
                  errorCorrectionLevel: 'Q',
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },
                  margin: 0
                }" />
              </template>
            </div>
          </div>
          <div>
            {{ item.pegawai?.nama }}
          </div>
        </div>
        <div class="ttd-kiri">
          <div class="">
            Mengetahui,
          </div>
          <div class="text-bold q-py-xs q-pt-sm">
            (Pasien/Orang tua/Suami/Istri/Anak/Saudara Kandung*)
          </div>
          <div style="padding-bottom: 80px" />
          <div class="underline text-bold q-py-xs">
            (...............................................................)
            <div class="garis-bawah" style="text-decoration-line: underline;" />
          </div>
          <div class="invisible">
            NIP. xx
          </div>
        </div>
      </div>

      <div class="row q-px-sm q-pb-sm q-pt-md full-width">
        <div class="col-12">
          Catatan : *) Lingkari yang perlu
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { date } from 'quasar';
import { dateFull, dateFullFormat, dateHalfFormat, formatJam } from 'src/modules/formatter';
import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung';
import { useListKunjunganIgdStore } from 'src/stores/simrs/pendaftaran/generalconsent/kunjunganIgd';
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = usePengunjungIgdStore()
const kunjungan = useListKunjunganIgdStore()

// Cari data kunjungan berdasarkan rs1 dari store.items
const kunjunganFromStore = computed(() => {
  // Ambil rs1 dari store.items (data pengunjung IGD)
  const rs1Values = store.items?.map(item => item.rs1).filter(Boolean) || []
  // Filter kunjungan.items yang rs1-nya ada di rs1Values
  return kunjungan.items?.filter(k => k.rs1 && rs1Values.includes(k.rs1)) || []
})

onMounted(async () => {
  await store.getData()
  await kunjungan.getListPasiens()
  console.log('kunjungan data:', store.items?.[0]?.generalcons)
  console.log('igd Kunjungan:', kunjungan.items)
  console.log('kunjungan from store:', kunjunganFromStore.value)
})
const qrDokter = computed(() => {
  // const petugas = 'Nama : ' + dpjp?.value?.nama ?? '' + 'NIP : ' + dpjp?.value?.nip ?? ''
  // const enc = btoa(`${petugas}`)
  // return `${enc}`

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Pengkajian Awal Kebidanan.png'
  const asal = 'RAWAT JALAN'
  const petugas = props.pasien?.anamnesekebidanan?.[0]?.pegawai?.kdpegsimrs
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})


console.log('pasien', props.pasien)
const selectedKontrasepsi = ref('Tidak')
const selectedMenikah = ref('Menikah')
const selectedMens = ref('Teratur')
const selectedKeluhanHaid = ref('Tidak')
const selectedGinekologi = ref('Tidak')
const selectedAntenatal = ref('Tidak')


const optionYaTidak = computed(() => [
  { label: 'Tidak', value: 'Tidak' },
  { label: 'Ya', value: 'Ya' }
])
const optionKontrasepsi = computed(() => [
  { label: 'Tidak', value: 'Tidak' },
  { label: 'Ya', value: 'Ya' }

])
const optionMenikah = computed(() => [
  { label: 'Single', value: 'Single' },
  { label: `Menikah ${getJumlahMenikah()}`, value: 'Menikah' },
  { label: 'Bercerai', value: 'Bercerai' },
])
const optionMens = computed(() => [
  { label: 'Teratur', value: 'Teratur' },
  { label: `Tidak Teratur, ${lamaTidakteratur()}`, value: 'Tidak Teratur' }
])
const optionKeluhanHaid = computed(() => [
  { label: 'Tidak', value: 'Tidak' },
  { label: `Ya, ${getDetailKeluhanHaid()}`, value: 'Ya' }
])
// function getRiwayatPenyakit() {
//   const riwayat = props.pasien?.anamnesekebidanan?.[0]?.riwayatpenyakit
//   return riwayat !== '-' && riwayat !== 'Tidak Ada' ? 'Iya' : 'Tidak Ada'
// }

function getDetailRiwayatAlergi() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.riwayatalergi
  const keterangan = props.pasien?.anamnesekebidanan?.[0]?.keteranganalergi
  if (keterangan === null || keterangan === '' || keterangan === '-') {
    return riwayat || ''
  }
  return riwayat ? `${riwayat} - ${keterangan}` : riwayat
}

function getRiwayatKontrasepsi() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.alatkontrasepsi
  return riwayat
}

function getDetailKontrasepsi() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.jeniskontasepsi
  return riwayat
}

function getLamaPemakaian() {
  const lamatahun = props.pasien?.anamnesekebidanan?.[0]?.tahunlamapemakaiankontrasepsi || 0
  const lamabulan = props.pasien?.anamnesekebidanan?.[0]?.bulanlamapemakaiankontrasepsi || 0
  const lamaminggu = props.pasien?.anamnesekebidanan?.[0]?.minggulamapemakaiankontrasepsi || 0
  const lamahari = props.pasien?.anamnesekebidanan?.[0]?.harilamapemakaiankontrasepsi || 0
  return `${lamatahun} tahun, ${lamabulan} bulan, ${lamaminggu} minggu, ${lamahari} hari`
}

function getKeluhanKontrasepsi() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.keluhankontrasepsi ?? ''
  return riwayat
}

function getMenikah() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.statuspernikahan ?? ''
  return riwayat
}

function getJumlahMenikah() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.jumlahpernikahan ?? ''
  return `${riwayat} kali`
}

function getUmurPertamaNikah() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.umurpertamanikah ?? 0
  return `${riwayat} tahun`
}

function getUmurMens() {
  const umur = props.pasien?.anamnesekebidanan?.[0]?.menarcheumur
  const siklus = props.pasien?.anamnesekebidanan?.[0]?.siklus
  return `${umur} tahun, Siklus : ${siklus} hari`
}
function getRiwayatMenstruasi() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.keteraturan
  return riwayat
}
function lamaTidakteratur() {
  const lama = props.pasien?.anamnesekebidanan?.[0]?.lamahaririwayatmens ?? ''
  if (!lama) {
    return ''
  }
  return selectedMens.value === 'Teratur' ? '' : `lama : ${lama} hari,`
}

function getKeluhanHaid() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.keluhanhaid
  return riwayat
}
function getDetailKeluhanHaid() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.sebutkankeluhanhaid ?? ''
  return selectedKeluhanHaid.value !== 'Ya' ? riwayat : ''
}

function getRiwayatGinekologi() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.riwayatginekologi
  return riwayat
}

function getDetailRiwayatGinekologi() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.ginekologis ?? ''
  const sebut = props.pasien?.anamnesekebidanan?.[0]?.sebutkanginekologis ?? ''
  return selectedGinekologi.value === 'Ya' ? `${riwayat} - ${sebut}` : ''
}


function getGPA() {
  const gravida = props.pasien?.anamnesekebidanan?.[0]?.gravida ?? '-'
  const partus = props.pasien?.anamnesekebidanan?.[0]?.partus ?? '-'
  const abortus = props.pasien?.anamnesekebidanan?.[0]?.abortus ?? '-'
  return `${gravida}/${partus}/${abortus}`
}

function getAsupanAntenatal() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.asupanantenatal
  return riwayat
}
function getDetailAsupanAntenatal() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.updateasupanantenatal ?? ''
  return selectedAntenatal.value === 'Ya' ? riwayat : ''
}


function getFrekuensi() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.frekuensi
  return riwayat
}
function getImunisasiTT() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.imunisasitt
  const jumlah = props.pasien?.anamnesekebidanan?.[0]?.sebutkanimunisasitt ?? '0'
  return riwayat === 'Tidak' ? riwayat : `${riwayat} (${jumlah} Kali)`
}

function getKeluhanHamil() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.keluhanhamil ?? ''
  return riwayat
}
function getdetailKeluhanHamil() {
  const riwayat = props.pasien?.anamnesekebidanan?.[0]?.sebutkeluhanhamils ?? ''
  return riwayat
}


function iconNyeri(anu) {
  const val = typeof anu === 'string' ? (isNaN(parseInt(anu)) ? 0 : parseInt(anu)) : 0
  // console.log('val nyeri', val)
  // console.log('anu nyeri', anu)
  let icon = 'icon-my-emoticon-excited-outline'
  if (val < 2) {
    icon = 'icon-my-emoticon-excited-outline'
  }
  else if (val >= 2 && val < 4) {
    icon = 'icon-my-emoticon-outline'
  }
  else if (val >= 4 && val < 6) {
    icon = 'icon-my-emoticon-neutral-outline'
  }
  else if (val >= 6 && val < 8) {
    icon = 'icon-my-emoticon-confused-outline'
  }
  else if (val >= 8 && val < 10) {
    icon = 'icon-my-emoticon-angry-outline'
  }
  else if (val === 10) {
    icon = 'icon-my-emoticon-cry-outline'
  }

  return icon
}
const historykehamilan = computed(() => {
  const arr = props.pasien?.historykehamilan
  return arr?.sort((a, b) => { return b.id - a.id })
})


const skriningGizi = [
  {
    label: 'Apakah Asupan Makanan Berkurang Karena Nafsu Makan Berkurang?',
    value: props.pasien?.anamnesekebidanan?.[0]?.asupanmakanberkurang ?? '-'
  },
  {
    label: 'Ada Gangguan Metabolisme (DM, Gangguan Fungsi Tiroid, Infeksi Kronis dll)?',
    value: props.pasien?.anamnesekebidanan?.[0]?.metabolisme ?? '-'
  },
  {
    label: 'Ada Penambahan Berat Badan yang Kurang Atau Lebih Sesuai Dengan Usia Kehamilan?',
    value: props.pasien?.anamnesekebidanan?.[0]?.penambahanbb ?? '-'
  },
  {
    label: 'Nilai Hb Kurang Dari 10g/dL, atau HCT Kurang Dari 30%',
    value: props.pasien?.anamnesekebidanan?.[0]?.nilaihbberkurang ?? '-'
  },
]

const masalahGinekologi = [
  {
    label: 'Apakah pasien mengalami penurunan berat badan yang tidak direncanakan / tidak diinginkan dalam 6 Bulan terakhir?',
    value: props.pasien?.anamnesekebidanan?.[0]?.skreeninggizi ?? '-'
  },
  {
    label: 'Apakah asupan makan pasien berkurang karena penurunan nafsu makan / kesulitan menerima makanan?',
    value: props.pasien?.anamnesekebidanan?.[0]?.asupanmakan ?? '-'
  },
  {
    label: 'Pasien dengan diagnosa khusus (DM/Kemotherapy/Hemodialisa/Geriatri/Penurunan Imunitas)',
    value: props.pasien?.anamnesekebidanan?.[0]?.kondisikhusus ?? '-'
  },
]

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
watch(() => props.pasien, (newVal) => {
  if (newVal) {
    selectedKontrasepsi.value = getRiwayatKontrasepsi()
    selectedMenikah.value = getMenikah()
    selectedMens.value = getRiwayatMenstruasi()
    selectedKeluhanHaid.value = getKeluhanHaid()
    selectedGinekologi.value = getRiwayatGinekologi()
    selectedAntenatal.value = getAsupanAntenatal()
  }
}, { immediate: true })

</script>
<style lang="scss" scoped>
.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.b1 {
  border-style: solid;
  border-width: 2px;
}

.b2 {
  border-right-style: solid;
  border-width: 2px;
}

.b3 {
  border-bottom-style: solid;
  border-width: 2px;
}

.b4 {
  border-right-style: solid;
  border-left-style: solid;
  border-width: 2px;
}

table {
  border-color: black;
}

table,
th,
td {
  border-width: 1px;
  border-style: solid;
  border-collapse: collapse;
}

td {
  padding-left: 10px;
  padding-right: 10px;
}

.page-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0px !important;
  }

  @page {
    // size: 8.5in 9in;
    size: a4;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD Mohamad Saleh | Hal Ke-" counter(page);
      font-size: 8pt;
    }
  }

  .contentx {
    page-break-after: auto;
    // break-after: page;
  }

}

.ttd-kanan {
  position: relative;
  top: 50px;
  text-align: center;
  justify-content: center;
  width: 60%;
  height: 100px;
  left: 40%;
}

.ttd-kiri {
  position: relative;
  bottom: 50px;
  text-align: center;
  justify-content: center;
  width: 50%;
  height: 100px;
}
</style>
