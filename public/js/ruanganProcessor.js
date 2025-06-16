

let allChunks = []

self.onmessage = function (e) {
  const { chunks, jenisLaporan, isLastChunk } = e.data

  // Akumulasi chunks dari setiap halaman
  allChunks.push(...chunks)

  // Hanya proses jika ini adalah chunk terakhir
  if (isLastChunk) {
    let processed = 0
    const total = allChunks.reduce((acc, chunk) => acc + chunk?.length, 0)

    const processedData = []
    const unProcessedData = []

    allChunks.forEach((chunk, i) => {
      // Simpan data mentah
      unProcessedData.push(...chunk)

      chunk.forEach(item => {
        processedData.push(...processResep(item))

        processed++
        if (processed % 100 === 0) {
          self.postMessage({
            type: 'progress',
            progress: Math.round((processed / total) * 100),
            current: processed,
            total
          })
        }
      })
    })

    self.postMessage({ type: 'complete', processedData, unProcessedData })
    // Reset allChunks untuk request berikutnya
    allChunks = []
  }
}


function processResep (data) {
  // const results = []
  // data.permintaanresep.forEach(item => {
  //   const keluar = data?.rincian?.filter(k => k.kdobat === item.kdobat)
  //   const depo = data.depo
  //   results.push(createDataObject(item, keluar, data, depo))
  // })
  return data
}


function createDataObject (item, keluar, data, depo) {
  return {
    noresep: item.noresep,
    tgl: data.tgl_permintaan,
    jumlah_resep: item.jumlah,
    jumlah_dilayani: keluar?.reduce((acc, curr) => acc + curr.jumlah, 0) || 0,
    kdobat: item.kdobat,
    kelompok: item?.mobat?.kelompok_penyimpanan,
    perbekalan: item?.mobat?.jenis_perbekalan,
    nama_obat: item?.mobat?.nama_obat,
    generik: item?.mobat?.status_generik == '1' ? 'Generik' : '',
    status_generik: item?.mobat?.status_generik,
    fornas: item?.mobat?.status_fornas == '1' ? 'Fornas' : '',
    status_fornas: item?.mobat?.status_fornas,
    forkit: item?.mobat?.status_forkid == '1' ? 'Forkit' : '',
    status_forkit: item?.mobat?.status_forkid,
    obat_program: item?.mobat?.obat_program,
    depo: depo,
    nama_dokter: data?.ketdokter?.nama,
    kode_sistembayar: data?.sistembayar?.rs1,
    nama_sistembayar: data?.sistembayar?.rs2
  }
}
