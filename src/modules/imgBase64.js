const imageToBase64 = (url, callback) => {
  if (!url) {
    if (typeof callback === 'function') callback(null)
    return
  }
  if (typeof url === 'string' && url.startsWith('data:image')) {
    if (typeof callback === 'function') callback(url)
    return
  }

  const fetchUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`
  fetch(fetchUrl, { cache: 'no-store' })
    .then((response) => {
      return response.blob()
    })
    .then((blob) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64String = reader.result
        if (typeof callback === 'function') callback(base64String)
      }
    })
    .catch((error) => {
      console.log('error base64 img', error)
      if (typeof callback === 'function') callback(null)
    })
}

// const imageToBase64 = async (url) => {
//   const data = await fetch(url, { mode: 'no-cors' })
//   const blob = await data.blob()
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.readAsDataURL(blob)
//     reader.onloadend = () => {
//       const base64data = reader.result
//       console.log('bisa', base64data)
//       resolve(base64data)
//     }
//     reader.onerror = (err) => {
//       console.log('error base64 img', err)
//       reject(err)
//     }
//   })
// }

export { imageToBase64 }
