<template>
  <template v-if="store.loading">
    <div class="row justify-center">
      <div class="q-gutter-md">
        <q-spinner-pie color="amber-13" type="circle" animation="pulse-x" size="40px" />
        <q-spinner-pie color="amber-13" type="circle" animation="pulse-x" size="60px" />
        <q-spinner-pie color="amber-13" type="circle" animation="pulse-x" size="40px" />
      </div>
    </div>
  </template>
  <template v-else-if="store.items.length === 0">
    <div class="row flex flex-center">
      <div class="kosong">
        <div>Data Belum Ada</div>
        <div>Silahkan Pilih Parameter</div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="row q-px-sm q-py-sm full-width flex-center">
      <q-markup-table flat bordered style="width: 100%;" wrap-cells :separator="separator">
        <thead>
          <tr class="text-bold">
            <td class="text-center" style="font-size: 12px">NO</td>
            <td class="text-center" style="font-size: 12px">TANGGAL</td>
            <td class="text-center" style="font-size: 12px">REGISTER/REKENING</td>
            <td class="text-center" style="font-size: 12px">URAIAN</td>
            <td class="text-center" style="font-size: 12px">PENERIMAAN (Rp.)</td>
            <td class="text-center" style="font-size: 12px">PENGELUARAN (Rp.)</td>
            <td class="text-center" style="font-size: 12px">SALDO (Rp.)</td>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, n) in store.hasilArray" :key="n">
            <tr>
              <td class="text-bold">
                {{ n + 1 }}
              </td>
              <td class="text-bold">
                {{ item?.tgl }}
              </td>
              <td class="text-left text-bold q-pl-sm q-pr-sm">
                {{ item?.notrans }}
              </td>
              <td class="text-left text-bold q-pl-sm q-pr-sm">
                {{ item?.uraian }}
              </td>
              <td class="text-right text-bold q-pl-sm q-pr-sm">
                {{ formattanpaRp(item?.penerimaan) }}
              </td>
              <td class="text-right text-bold q-pl-sm q-pr-sm">
                {{ formattanpaRp(item?.pengeluaran) }}
              </td>
              <td class="text-right text-bold q-pl-sm q-pr-sm">
                {{ formattanpaRp(item?.total) }}
              </td>
            </tr>
            <template v-if="item?.nonpd?.length">
              <template v-for="it in item?.nonpd" :key="it">
                <tr>
                  <td colspan="2"></td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px"> {{ it?.nonpd }}</td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">{{ it?.uraianNPD }} </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.totalRincian) }}
                  </td>
                  <td></td>
                </tr>
                <template v-for="rek in it.rincian" :key="rek">
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px;"> * {{ rek?.koderek50 }}</td>
                    <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px;"> * {{ rek?.rincianbelanja }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </template>
              </template>
            </template>
            <template v-if="item?.bank_kas?.length">
              <template v-for="it in item?.bank_kas" :key="it">
                <tr>
                  <td colspan="2"></td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px"> {{ it?.nonpd }}</td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">{{ it?.uraianNPD }} </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.nilai) }}
                  </td>
                  <td></td>
                </tr>
              </template>
            </template>
            <template v-if="item?.kas_bank?.length">
              <template v-for="it in item?.kas_bank" :key="it">
                <tr>
                  <td colspan="2"></td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px"> {{ it?.nonpd }}</td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">{{ it?.uraianNPD }} </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.nilai) }}
                  </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </td>
                  <td></td>
                </tr>
              </template>
            </template>
          </template>
          <tr>
            <td colspan="4" class="text-bold">TOTAL</td>
            <td class="text-right text-weight-bolder q-pl-sm q-pr-sm">
              {{ formattanpaRp(totaldebit()) }}
            </td>
            <td class="text-right text-weight-bolder q-pl-sm q-pr-sm">
              {{ formattanpaRp(totalkredit()) }}
            </td>
            <td class="text-right text-weight-bolder q-pl-sm q-pr-sm">
              {{ formattanpaRp(totalsaldo()) }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>

    </div>
  </template>
</template>

<script setup>
import { formattanpaRp } from 'src/modules/formatter';
import { useLaporanBukuBankStore } from 'src/stores/siasik/laporan/buku_pembantu/bukubank';
import { ref } from 'vue';

const separator = ref('cell')
const store = useLaporanBukuBankStore()
function totaldebit() {
  const debit = store.hasilArray
  // console.log("njaaias", debit);
  const totaldebit = debit?.length
    ? debit?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totaldebit
}
function totalkredit() {
  const kredit = store.hasilArray
  // console.log("njaaias", debit);
  const totalkredit = kredit?.length
    ? kredit?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalkredit
}

function totalsaldo() {
  const saldo = store.hasilArray
  // console.log("njaaias", debit);
  const totalsaldo = saldo?.length
    ? saldo?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0) -
    saldo?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalsaldo
}

</script>
<style>
/* Tambahkan border pada setiap td dan th */
.bordered_table table,
.bordered_table tr,
.bordered_table td {
  border-collapse: collapse;
  border: 1px solid #000000;
  height: 30px;
  /* Garis hitam dengan ketebalan 1px */
}
</style>
