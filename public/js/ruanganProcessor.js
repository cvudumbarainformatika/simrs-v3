

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
    const obatsaja = []

    allChunks.forEach((chunk, i) => {
      // Simpan data mentah
      // obatsaja.push(...chunk)

      chunk.forEach(item => {
        processedData.push(...processData(item))
        const obat = { ...item }
        if (obat?.mutasi) delete obat.mutasi
        obatsaja.push(obat)

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

    self.postMessage({ type: 'complete', processedData, obatsaja })
    // Reset allChunks untuk request berikutnya
    allChunks = []
  }
}


function processData (data) {
  // console.log('data', data)
  const results = []
  data?.mutasi.forEach(item => {
    results.push(createDataObject(item, data))
  })
  return results
}
function createDataObject (item, data) {
  const subtotal = item.jml * item.harga
  return {
    kd_obat: data?.kd_obat,
    nama_obat: data?.nama_obat,
    kd_obat: data?.kd_obat,
    bentuk_sediaan: data?.bentuk_sediaan,
    jenis_perbekalan: data?.jenis_perbekalan,
    harga: item.harga,
    jumlah: item.jml,
    subtotal: Number(parseFloat(subtotal).toFixed(2)),
  }
}



