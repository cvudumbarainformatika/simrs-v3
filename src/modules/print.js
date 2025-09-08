export function printNb() {
  const printContents = document.getElementById('printMe').innerHTML
  const printWindow = window.open('', '', 'height=600,width=800')

  printWindow.document.write(`
    <html>
      <head>
        <title>Kwitansi Pembayaran</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h4 { margin-bottom: 10px; }
          .text-center { text-align: center; }
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `)

  printWindow.document.close()
  printWindow.onload = function () {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}
