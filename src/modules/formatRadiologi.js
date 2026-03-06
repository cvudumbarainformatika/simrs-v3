

export function formatRadiologi(html) {
  if (!html) return ""

  let clean = html

  // 1. ubah h1-h6 jadi div
  clean = clean.replace(/<\/?h[1-6][^>]*>/gi, tag =>
    tag.startsWith("</") ? "</div>" : "<div>"
  )

  // 2. hapus class dari editor
  // clean = clean.replace(/class="[^"]*"/gi, "")

  // // 3. hapus style
  // clean = clean.replace(/style="[^"]*"/gi, "")

  // // 4. hapus span dari word
  // clean = clean.replace(/<span[^>]*>/gi, "")
  // clean = clean.replace(/<\/span>/gi, "")

  // // 5. hapus div kosong
  // clean = clean.replace(/<div>\s*<\/div>/gi, "")

  // 6. tandai kesimpulan
  clean = clean.replace(
    /(KESIMPULAN\s*:)/gi,
    '<div class="rad-kesimpulan-title text-weight-bold q-mt-md">$1</div>'
  )

  // 7. luruskan format "Organ : isi"

  const organs = [
    "Hepar",
    "Gall Bladder",
    "Lien",
    "Pancreas",
    "Ren D",
    "Ren S",
    "Buli-buli",
    "Uterus",
    "Adnexa",
    "Adnexa D/S"
  ]

  const pattern = new RegExp(`(${organs.join("|")})\\s*:\\s*(.*)`, "gi")


  clean = clean.replace(
    pattern,
    '<div class="rad-row"><div class="rad-label">$1</div><div class="rad-value">$2</div></div>'
  )

  // ubah "Label : isi" jadi layout 2 kolom
  clean = clean.replace(
    /<div>\s*([^:<]{2,40})\s*:\s*(.*?)<\/div>/gi,
    '<div class="rad-row"><div class="rad-label">$1</div><div class="rad-value">$2</div></div>'
  )

  // clean = clean.replace(/<p[^>]*>\s*<\/p>/gi, "")
  // clean = clean.replace(/<li>\s*<p[^>]*>(.*?)<\/p>\s*<\/li>/gi, "<li>$1</li>")
  // clean = clean.replace(
  //   /<div>\s*(<div class="rad-kesimpulan-title">.*?<\/div>)\s*<\/div>/gi,
  //   "$1"
  // )

  // clean = clean.replace(
  //   /<div class="rad-label">\s*(.*?)\s*<\/div>/gi,
  //   '<div class="rad-label">$1</div>'
  // )

  return clean
}