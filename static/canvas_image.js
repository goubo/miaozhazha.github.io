const image_input = document.getElementById("file_select"), cvs = document.getElementById('canvas'),
    ctx = cvs.getContext('2d')
let image_object, image_name, font_size = 48, txt_size = 0, onmous_x = 0, onmous_y = 0, pyl_x = 0, pyl_y = 0
image_input.addEventListener("change", function () {
    const file = this.files[0]
    if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型")
        return false
    }
    image_name = file.name.substring(0, file.name.lastIndexOf("."))
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
        const data = this.result
        image_object = new Image()
        image_object.src = data
        image_object.onload = function () {
            drawWatermark()
        }
    }
})

function drawToCanvas() {
    cvs.width = image_object.width
    cvs.height = image_object.height
    ctx.drawImage(image_object, 0, 0)
}

function drawWatermark() {
    let tiled = document.getElementById("tiled_type_true").checked
    let txt = document.getElementById("inp_text").value
    let density = document.getElementById("inp_density").value
    txt_size = txt.length
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    if (onmous_x === 0 && onmous_y === 0) {
        pyl_x = font_size * txt_size / 2
        pyl_y = font_size / 2
    } else {
        pyl_x = onmous_x - cvs.offsetLeft
        pyl_y = onmous_y - cvs.offsetTop
    }
    if (image_object) drawToCanvas()
    if (!tiled) {
        ctx.translate(pyl_x, pyl_y)
        ctx.rotate(document.getElementById("spin_num").value * Math.PI / 180)
        ctx.font = font_size + "px serif"
        ctx.fillStyle = document.getElementById("inp_color").value
        ctx.globalAlpha = document.getElementById("inp_globalAlpha").value / 100
        ctx.fillText(txt, -(font_size * txt_size / 2), (font_size / 2))
        ctx.rotate(-document.getElementById("spin_num").value * Math.PI / 180)
        ctx.translate(-pyl_x, -pyl_y)
    } else {
        let lie = Math.ceil(cvs.width / (density * 3 + (font_size * txt_size))) * 4
        let hang = Math.ceil(cvs.height / (density * 3 + font_size)) * 4
        for (let i = -hang; i < hang; i++) {
            ctx.translate(pyl_x, pyl_y)
            ctx.rotate(document.getElementById("spin_num").value * Math.PI / 180)
            ctx.font = font_size + "px serif"
            ctx.fillStyle = document.getElementById("inp_color").value
            ctx.globalAlpha = document.getElementById("inp_globalAlpha").value / 100
            for (let j = -lie; j < lie; j++) {
                ctx.fillText(txt, (font_size * txt_size + density * 3) * j, (font_size + density * 3) * i)
            }
            ctx.rotate(-document.getElementById("spin_num").value * Math.PI / 180)
            ctx.translate(-pyl_x, -pyl_y)
        }
    }
}

cvs.onmousedown = function (e) {
    onmous_x = e.pageX
    onmous_y = e.pageY
    drawWatermark()
}
document.getElementById("font_size").onchange = function (e) {
    font_size = this.value
    drawWatermark()
}
document.getElementById("inp_text").onchange = function (e) {
    drawWatermark()
}
document.getElementById("spin_num").onchange = function (e) {
    drawWatermark()
}
document.getElementById("inp_color").onchange = function (e) {
    drawWatermark()
}
document.getElementById("inp_globalAlpha").onchange = function (e) {
    drawWatermark()
}
document.getElementById("inp_density").onchange = function (e) {
    drawWatermark()
}
document.getElementById("tiled_type_true").onchange = function (e) {
    drawWatermark()
}
document.getElementById("tiled_type_false").onchange = function (e) {
    drawWatermark()
}

function saveImage() {
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    save_link.href = cvs.toDataURL()
    save_link.download = image_name || "小鱼水印"
    var event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    save_link.dispatchEvent(event)
}

function compress(base64, quality, mimeType) {
    let canvas = document.createElement('canvas')
    let img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.src = base64
    img.onload = () => {
        let targetWidth = img.width * quality / 100, targetHeight = img.height * quality / 100
        canvas.width = targetWidth
        canvas.height = targetHeight
        let ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, targetWidth, targetHeight)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        let imageData = canvas.toDataURL(mimeType, quality / 100)
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        save_link.href = imageData
        save_link.download = "sdlfsdf"
        var event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        save_link.dispatchEvent(event)
    }
}

drawWatermark()