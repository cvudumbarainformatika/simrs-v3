import { ref, markRaw } from 'vue'
import { fabric } from 'fabric'

export function useFabricCanvas(
  canvasRef, cvn, imgRef, widthEl, heightEl, store, arr, objectSelected, writingMode,
  tab, openTab, start, target, showMenu,
  canvasScale, SCALE_FACTOR, options, menus
) {

  const initCanvas = () => {
    const canvas = new fabric.Canvas(canvasRef.value, {
      backgroundColor: '#fff',
      centeredScaling: true,
      selectionBorderColor: 'red',
      selectionColor: '#9494948f',
      selectionLineWidth: 3,
      borderColor: 'grey',
      cornerColor: 'black',
      cornerSize: 8,
      transparentCorners: false,
      defaultCursor: 'crosshair',
      hoverCursor: 'pointer'
    })

    cvn.value = markRaw(canvas)
  }

  const setBackground = () => {

    console.log('setBackground');

    if (!imgRef.value || !cvn.value) return

    const src = imgRef.value.src
    const canvas = cvn.value

    // console.log('Set background image from:', src)

    fabric.Image.fromURL(src, (img) => {
      const imgW = img.width ?? 1
      const imgH = img.height ?? 1

      const scale = Math.min(widthEl.value / imgW, heightEl.value / imgH)
      const center = canvas.getCenter()

      img.set({
        originX: 'center',
        originY: 'center',
        left: center.left,
        top: center.top,
        scaleX: scale,
        scaleY: scale
      })
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
    })
  }

  function addCustomControls(deleteHandler, cloneHandler) {
    const canvas = cvn.value

    const deleteImg = new Image()
    deleteImg.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E"

    const cloneImg = new Image()
    cloneImg.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 55.699 55.699' width='100px' height='100px' xml:space='preserve'%3E%3Cpath style='fill:%23010002;' d='M51.51,18.001c-0.006-0.085-0.022-0.167-0.05-0.248c-0.012-0.034-0.02-0.067-0.035-0.1 c-0.049-0.106-0.109-0.206-0.194-0.291v-0.001l0,0c0,0-0.001-0.001-0.001-0.002L34.161,0.293c-0.086-0.087-0.188-0.148-0.295-0.197 c-0.027-0.013-0.057-0.02-0.086-0.03c-0.086-0.029-0.174-0.048-0.265-0.053C33.494,0.011,33.475,0,33.453,0H22.177 c-3.678,0-6.669,2.992-6.669,6.67v1.674h-4.663c-3.678,0-6.67,2.992-6.67,6.67V49.03c0,3.678,2.992,6.669,6.67,6.669h22.677 c3.677,0,6.669-2.991,6.669-6.669v-1.675h4.664c3.678,0,6.669-2.991,6.669-6.669V18.069C51.524,18.045,51.512,18.025,51.51,18.001z M34.454,3.414l13.655,13.655h-8.985c-2.575,0-4.67-2.095-4.67-4.67V3.414z M38.191,49.029c0,2.574-2.095,4.669-4.669,4.669H10.845 c-2.575,0-4.67-2.095-4.67-4.669V15.014c0-2.575,2.095-4.67,4.67-4.67h5.663h4.614v10.399c0,3.678,2.991,6.669,6.668,6.669h10.4 v18.942L38.191,49.029L38.191,49.029z M36.777,25.412h-8.986c-2.574,0-4.668-2.094-4.668-4.669v-8.985L36.777,25.412z M44.855,45.355h-4.664V26.412c0-0.023-0.012-0.044-0.014-0.067c-0.006-0.085-0.021-0.167-0.049-0.249 c-0.012-0.033-0.021-0.066-0.036-0.1c-0.048-0.105-0.109-0.205-0.194-0.29l0,0l0,0c0-0.001-0.001-0.002-0.001-0.002L22.829,8.637 c-0.087-0.086-0.188-0.147-0.295-0.196c-0.029-0.013-0.058-0.021-0.088-0.031c-0.086-0.03-0.172-0.048-0.263-0.053 c-0.021-0.002-0.04-0.013-0.062-0.013h-4.614V6.67c0-2.575,2.095-4.67,4.669-4.67h10.277v10.4c0,3.678,2.992,6.67,6.67,6.67h10.399 v21.616C49.524,43.26,47.429,45.355,44.855,45.355z'/%3E%3C/svg%3E%0A"

    const renderIcon = (icon) => {
      return function (ctx, left, top, _styleOverride, fabricObject) {
        const size = this.cornerSize
        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
        ctx.drawImage(icon, -size / 2, -size / 2, size, size)
        ctx.restore()
      }
    }

    fabric.Object.prototype.controls.deleteControl = markRaw(new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetX: 10,
      offsetY: -10,
      cornerSize: 16,
      render: renderIcon(deleteImg),
      mouseUpHandler: deleteHandler,
      cursorStyle: 'pointer'
    }))

    fabric.Object.prototype.controls.clone = markRaw(new fabric.Control({
      x: -0.5,
      y: -0.5,
      offsetX: -10,
      offsetY: -10,
      cornerSize: 16,
      render: renderIcon(cloneImg),
      mouseUpHandler: function (_, transform) {
        cloneHandler(transform.target)
      },
      cursorStyle: 'pointer'
    }))



    onCanvas()
    drawall()
  }




  function onCanvas() {
    const canvas = cvn.value
    if (!canvas) return

    // 👇 Mouse Down
    canvas.on('mouse:down', (evt) => {
      if (tab.value !== null) {
        target.value = null
        return false
      }

      const { x, y } = evt.pointer || {}
      store.setDialogForm('x', x)
      store.setDialogForm('y', y)
      start.value = { x, y }

      if (store?.dialogForm?.penanda === 'drag-segi-empat') {
        target.value = null
      }

      if (evt.target !== null) {
        target.value = null
        setBtns(canvas, evt)
      } else {
        canvas.discardActiveObject()
        objectSelected.value = null
        writingMode.value = true
        target.value = '.upper-canvas'
        showMenu.value = true

        // console.log('menuShow');

      }
    })

    // 👇 Mouse Move
    canvas.on('mouse:move', (evt) => {
      if (tab.value !== null) {
        return false
      }
      // Kalau butuh: bisa pasang koordinat live, dsb
    })

    // 👇 Mouse Up
    canvas.on('mouse:up', (evt) => {
      if (tab.value !== null) {
        return // keluar langsung, tidak ubah target
      }

      const { x, y } = evt.pointer || {}

      if (store?.dialogForm?.penanda === 'drag-segi-empat') {
        if (evt.target !== null) {
          target.value = '.upper-canvas'
        }

        store.setDialogForm('width', x - start.value.x)
        store.setDialogForm('height', y - start.value.y)
      }

      // Jika tidak klik ke objek manapun, gambar baru
      if (evt.target === null) {
        draw(
          store.dialogForm.penanda,
          store.dialogForm.x,
          store.dialogForm.y,
          store.dialogForm.panjang,
          store.dialogForm.width,
          store.dialogForm.height,
          store.dialogForm.warna,
          store.dialogForm.ketebalan,
          null,
          store.dialogForm.angle,
          store.dialogForm.fill,
          store.dialogForm.tinggi
        )
      }

      // Pastikan hanya setBtns jika tidak ada tab dan objek baru dipilih
      if (evt.target && !tab.value) {
        setBtns(canvas, evt)
      }

      const active = canvas.getActiveObject()
      if (active && objectSelected.value !== null) {
        store.setDialogForm('ketebalan', active.strokeWidth)
        store.setDialogForm('warna', active.stroke)
        store.setDialogForm('fill', active.fill)

        console.log('active', store.dialogForm)
        return
      }

      if (objectSelected.value !== null) {
        target.value = null
      }
    })

    // 👇 Mouse Wheel Zoom
    canvas.on('mouse:wheel', (opt) => {
      let zoom = canvas.getZoom()
      zoom += opt.e.deltaY / 200
      zoom = Math.max(0.01, Math.min(zoom, 20))

      SCALE_FACTOR.value = zoom
      // canvas.setZoom(zoom) // 👈 Zoom saya matikan

      opt.e.preventDefault()
      opt.e.stopPropagation()
    })

    // 👇 Object Events
    canvas.on({
      'object:moving': onChange,
      'object:scaling': onChange,
      'object:rotating': onChange
    })

    // 👉 Optional hover effect (nonaktif sekarang)
    // canvas.on('mouse:over', (e) => {
    //   if (objectSelected.value === null || objectSelected.value?.ids !== e?.target?.ids) {
    //     e?.target?.set('fill', '#9494948f')
    //     canvas.renderAll()
    //   }
    // })
    // canvas.on('mouse:out', (e) => {
    //   const obj = arr.value[e?.target?.ids]
    //   e?.target?.set('fill', obj?.fill)
    //   canvas.renderAll()
    // })
  }

  const onChange = (obj) => {
    objectSelected.value = null
    const action = obj?.transform?.action
    const ids = obj?.target?.ids
    const object = obj?.target
    objectSelected.value = object
    // console.log('onChange objectSelected', objectSelected.value)
    // console.log('onChange obj', obj)
    const o = obj?.target
    if (!o?.strokeWidthUnscaled && o?.strokeWidth) {
      o.strokeWidthUnscaled = o?.strokeWidth
    }
    if (o?.strokeWidthUnscaled) {
      o.strokeWidth = o?.strokeWidthUnscaled / o?.scaleX
    }
    if (action === 'drag') {
      // move
      // console.log('drag', obj)
      store.setShapeObject(ids, 'x', obj?.target?.left)
      store.setShapeObject(ids, 'y', obj?.target?.top)
    }
    else if (action === 'scale') {
      // scaling
      // console.log('scale', obj)
      // console.log('onChange-arr', store.shapes[ids])
      store.setShapeObject(ids, 'width', object?.width * object?.scaleX)
      store.setShapeObject(ids, 'height', object?.height * object?.scaleY)
      store.setShapeObject(ids, 'panjang', parseInt(object?.width * object?.scaleX) / 2)
      store.setShapeObject(ids, 'tinggi', parseInt(object?.height * object?.scaleY) / 2)
      // console.log('onChange-arr', store.shapes[ids])
    }
    else if (action === 'scaleX') {
      // scaling
      // console.log('scaleX', obj)
      store.setShapeObject(ids, 'width', object?.width * object?.scaleX)
      store.setShapeObject(ids, 'panjang', parseInt(object?.width * object?.scaleX) / 2)
    }
    else if (action === 'scaleY') {
      // scaling
      // console.log('scaleY', obj)
      store.setShapeObject(ids, 'height', object?.height * object?.scaleY)
      store.setShapeObject(ids, 'tinggi', parseInt(object?.height * object?.scaleY))
    }
    else if (action === 'rotate') {
      // console.log('rotate', obj)
      store.setShapeObject(ids, 'x', obj?.target?.left)
      store.setShapeObject(ids, 'y', obj?.target?.top)
      store.setShapeObject(ids, 'angle', obj?.target?.angle)
    }
  }


  function drawall() {

    // console.log('🔁 drawall called')

    if (!cvn.value) return

    resetCanvas()
    objectSelected.value = null

    const canvas = cvn.value
    const scale = widthEl.value / canvas.width

    arr.value.forEach((obj, index) => {
      const { x, y } = scaleCoordinates(canvas.width, canvas.height, obj.x, obj.y, scale)

      draw(
        obj.penanda,
        x,
        y,
        obj.panjang,
        obj.width,
        obj.height,
        obj.warna,
        obj.ketebalan,
        index,
        obj.angle,
        obj.fill,
        obj.tinggi
      )
    })

    canvas.renderAll()

    // console.log('drawall paling bawah', arr.value);

  }

  function setBtns(canvas, obj) {
    const object = canvas.item(obj?.target?.ids)
    objectSelected.value = object
    // console.log('mousedown select', obj)
    // console.log('mouseevent object', object)
    object?.set({
      transparentCorners: false,
      cornerColor: 'aqua',
      cornerStrokeColor: 'red',
      borderColor: 'red',
      cornerSize: 6,
      padding: 5,
      cornerStyle: 'circle',
      borderDashArray: [3, 3],
      rotatingPointOffset: 4
    })
    // canvas.setActiveObject(object)

    // console.log('setBtns', obj)
    // canvas.item(obj?.target?.ids).hasControls = true
    // canvas.item(obj?.target?.ids).controls.mtr.offsetY = -20
    const objTarget = obj?.target;
    if (objTarget) {
      objTarget.hasControls = true;
      if (objTarget.controls && objTarget.controls.mtr) {
        objTarget.controls.mtr.offsetY = -20;
      }
    }

    canvas.renderAll()
  }


  const scaleCoordinates = (width, height, x, y, scale) => {
    const centerX = width / 2
    const centerY = height / 2
    const relX = x - centerX
    const relY = y - centerY
    const scaledX = relX * scale
    const scaledY = relY * scale
    return { x: scaledX + centerX, y: scaledY + centerY }
  }

  function resetCanvas() {
    const canvas = cvn.value
    canvas?.remove(...canvas?.getObjects())
  }


  function draw(penanda, x, y, p, w, h, clr, tbl, ids, angle, fill, tinggi) {
    const canvas = cvn.value
    if (penanda === 'circle') {
      const circle = markRaw(new fabric.Circle({
        ids,
        left: x,
        top: y,
        radius: p,
        stroke: clr,
        strokeWidth: tbl,
        originX: 'center',
        originY: 'center',
        fill,
        angle
      }))
      canvas.add(circle)
    }
    else if (penanda === 'kotak') {
      const rect = markRaw(new fabric.Rect({
        ids,
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
        // width: p * 2,
        // height: p * 2,
        width: w,
        height: h,
        stroke: clr,
        strokeWidth: tbl,
        fill,
        angle
        // transparentCorners: false
        // cornerSize: 6
      }))

      canvas.add(rect)
    }
    else if (penanda === 'drag-segi-empat') {
      const rect = markRaw(new fabric.Rect({
        ids,
        left: x,
        top: y,
        originX: 'left',
        originY: 'top',
        width: w,
        height: h,
        stroke: clr,
        strokeWidth: tbl,
        fill,
        angle
        // transparentCorners: false
        // cornerSize: 6
      }))

      canvas.add(rect)
    }
    else if (penanda === 'Segitiga') {
      const triangle = markRaw(new fabric.Triangle({
        ids,
        left: x,
        top: y,
        width: p * 2,
        height: p * 2,
        stroke: clr,
        strokeWidth: tbl,
        originX: 'center',
        originY: 'center',
        fill,
        angle
      }))

      canvas.add(triangle)
    }
    else if (penanda === 'Polyline') {
      const poly = markRaw(new fabric.Polygon(
        [
          { x: p, y: tinggi / 3 },
          { x: p * 3, y: tinggi / 3 },
          { x: p * 3 + (p / 3), y: (tinggi / 3) * 4 },
          { x: p - (p / 3), y: (tinggi / 3) * 4 }],
        {
          ids,
          // left: x,
          // top: y,
          originX: 'center',
          originY: 'center',
          // width: p * 3,
          // height: p * 2,
          // stroke: clr,
          // strokeWidth: tbl,
          fill,
          angle,
          stroke: clr,
          left: x,
          top: y,
          strokeWidth: tbl,
          strokeLineJoin: 'bevil'
        }))
      canvas.add(poly)
    }
    else if (penanda === 'Radix dention') {
      const akar = markRaw(new fabric.Text('√', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        stroke: clr,
        strokeWidth: tbl,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(akar)
    }
    else if (penanda === 'Non Vital') {
      const integral = markRaw(new fabric.Text('∫', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(integral)
    }
    else if (penanda === 'Partial Denture, etc') {
      const PD = markRaw(new fabric.Text('PD', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(PD)
    }
    else if (penanda === 'Unerupted teeth') {
      const UE = markRaw(new fabric.Text('UE', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(UE)
    }
    else if (penanda === 'Partial Erupted teeth') {
      const PE = markRaw(new fabric.Text('PE', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(PE)
    }
    else if (penanda === 'Anomali') {
      const A = markRaw(new fabric.Text('A', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(A)
    }
    else if (penanda === 'Gigi Hilang / tidak ada') {
      const X = markRaw(new fabric.Text('✖', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(X)
    }
    else if (penanda === 'Carries/temporary filling') {
      const X = markRaw(new fabric.Text('〇', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(X)
    }
    else if (penanda === 'Tumpatan lain / inlay') {
      const X = markRaw(new fabric.Text('⊠', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(X)
    }
    else if (penanda === 'Amalgam Filling') {
      const X = markRaw(new fabric.Text('10', {
        left: x, // Take the block's position
        top: y,
        fill: fill === 'transparent' ? 'black' : fill,
        originX: 'center',
        originY: 'center',
        fontSize: w,
        ids
      }))

      canvas.add(X)
    }
  }

  function onChangeImg() {
    // resizeCanvas()
    const canvas = cvn.value
    // console.log('oooi')
    canvas.setDimensions({ width: widthEl.value, height: heightEl.value })
    const img = markRaw(new fabric.Image(imgRef.value, (image, isError) => {
      image.set({

        originX: 'center',
        originY: 'center'
      })
    }))
    const scale = Math.min(canvasRef.value.width / img.width, canvasRef.value.height / img.height)
    const center = canvas?.getCenter()
    canvas?.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      left: center.left,
      top: center.top,
      // right: 0,
      scaleX: scale,
      scaleY: scale,
      originX: 'center',
      originY: 'center'
      // width: widthEl.value - 50,
      // heigh: heightEl.value - 50
    })
    canvas.add()

  }


  return {
    initCanvas, setBackground, addCustomControls, onCanvas, drawall, draw, onChangeImg
  }
}
