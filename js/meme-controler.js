'use strict'

var gCanvas;
var gCtx;
var gCanvasHeight
var gCanvasWidth
var gCanvasBackGround;
var gMeme
var gImgs
var gCuurImg
var gTextBoxLength
var gIdxText = 0
var gDownload = false;
var gKey = 'meme-settings'
var gShowSavedImgs = true;
var gSavedImgs = []


function onInit() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');
    gCanvasHeight = gCtx.canvas.height
    gCanvasWidth = gCtx.canvas.width
    checkLocalStorage()
    rederGallery()
    // onShowPage('gallery')
    // gSavedImgs.push(localData)

}

function checkLocalStorage() {
    gSavedImgs.push(loadFromStorage(gKey))
    // if (gSavedImgs) {
    // updateGmeme(localData)
    // } else {
    // gMeme = getGmeme();
    // }
}

function rederGallery() {
    var strHTML = ''
    gImgs = getGImgs()

    gImgs.forEach(img => {
        strHTML += `<img  id=${img.id} class='img img${img.id}' src="${img.url}" alt="${img.keywords}" onclick="drawImage(this)"
        onmouseover = "animateImg(this)" </img> `
    })

    var elImg = document.querySelector('.gallery')
    elImg.innerHTML = strHTML
}

function onShowMemes() {
    var localData = loadFromStorage(gKey)
    // console.log(localData)
    // gSavedImgs.push(localData)
    rederSavedImgs()
}


function rederSavedImgs() {
    // console.log(gSavedImgs, "gSavedImgs")
    var strHTML = ''

    gSavedImgs.forEach(savedImg => {
        strHTML += `<img  id=${savedImg.selectedImgId} class='img img${savedImg.selectedImgId}' src="${savedImg.url}" onmouseover = "animateImg(this)" </img> `
    })

    var elImg = document.querySelector('.savedImgs-gallery')
    elImg.innerHTML = strHTML
}



function onShowPage(pageToShow) {
    var elGallery = document.querySelector('.gallery-page')
    var elEditor = document.querySelector('.editor-page')
    var elSavedImgs = document.querySelector('.savedImgs')

    switch (pageToShow) {
        case "gallery":
            elGallery.classList.remove('hide');
            elEditor.classList.add('hide')
            elSavedImgs.classList.add('hide')
            onToggleMenu()

            break;
        case "editor":
            elGallery.classList.add('hide');
            elEditor.classList.remove('hide')
            elSavedImgs.classList.add('hide')
            break;
        case "savedImgs":
            onShowMemes();
            elGallery.classList.add('hide');
            elEditor.classList.add('hide')
            elSavedImgs.classList.remove('hide')
            onToggleMenu()

    }
}

function drawImage(el) {
    if (el)
        gCuurImg = el

    var img = new Image();
    img.src = gCuurImg.src;

    img.onload = function () {
        gCtx.drawImage(img, 0, 0, gCanvasHeight, gCanvasWidth);
        renderText()
        getFocus()
        if (gDownload) { gDownloadImg() }
    };
    onShowPage("editor")
}


function renderText() {
    if (!gDownload) changeBorderStatus(true)
    gTextBoxLength = gMeme.lines.length - 1

    var lines = gMeme.lines
    lines.forEach(line => {

        gCtx.font = `${line.size}px ${line.font} Sans `;
        gCtx.fillStyle = line.color;
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, line.posX, line.posY);
        gCtx.setLineDash([])
        gCtx.strokeStyle = line.stroke;
        gCtx.strokeText(line.txt, line.posX, line.posY);
    })
}


function getPositionY() {
    if (gIdxText === 0) return 50
    else if (gIdxText === 1) return 400
    else return (gCanvasHeight / 2)
}


function onUpdateTxt(el) {
    updateTxtBox(el.value.slice(-1), gIdxText)
}


function animateImg(elImg) {
    elImg.classList.add('animated', 'pulse')
    setTimeout(function () {
        elImg.classList.remove('animated', 'pulse')
    }, 1000)
}

function onSwitchTextBox() {
    if (gIdxText < gTextBoxLength)
        gIdxText += 1;
    else gIdxText = 0;

    clearTextBox()
    drawImage()
}


function onAddText() {
    gIdxText += 1;
    var textSetting = getTextSettings()
    clearTextBox()
    addTxtBox(textSetting)
}


function getTextSettings() {
    var strokeColor = document.querySelector(".stroke-color").value
    var textColor = document.querySelector(".text-color").value
    var posY = getPositionY()

    var textSetting = {
        textbox: gIdxText,
        strokeColor: strokeColor,
        textColor: textColor,
        posY: posY
    }
    return textSetting
}


function getFocus() {
    if (!gMeme.showBorder || !gMeme.lines[gIdxText].txt) return

    var widthX = gMeme.lines[gIdxText].posX
    var widthY = gMeme.lines[gIdxText].posY
    var xLength = gMeme.lines[gIdxText].letterCount
    var size = gMeme.lines[gIdxText].size

    // console.log(widthX, widthY, xLength, size)

    // var fromX = widthX - (xLength * size / 4)
    // var fromY = (widthY - size)
    // var toX = (xLength * size / 2)
    // var toY = (widthX + (xLength * 10))

    // console.log(fromX, fromY, toX, toY)

    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    // gCtx.rect(fromX, fromY, toX, toY)
    gCtx.rect(widthX - 150, widthY - 40, 350, 50)
    gCtx.setLineDash([10, 10])
    gCtx.stroke()
    // gCtx.fillStyle = gFillColor
    // gCtx.fillRect(widthX, widthY, getRandomIntInclusive(0,gCanvasHeight), getRandomIntInclusive(0,gCanvasWidth))
    gCtx.closePath()
}


function onToggleMenu() {
    var body = document.querySelector('.cover')
    var modal = document.querySelector('.modal')
    var menu = document.querySelector('.nav-menu')

    if (body.hasAttribute('hidden')) {

        modal.classList.add('animated', 'fadeInRight')
        menu.classList.add('open')

        setTimeout(function () {
            modal.classList.remove('animated', 'fadeInRight')
        }, 1000)

        body.hidden = false;
        modal.hidden = false;
    } else {

        body.hidden = true;
        modal.hidden = true;
        menu.classList.remove('open')
    }
}


function onDownloadCanvas() {

    gSavedImgs.push(gMeme)

    gMeme.selectedImgId = gCuurImg.id

    var currImg = gImgs.find(img => {
        return img.id === parseInt(gCuurImg.id)
    })

    gMeme.url = currImg.url

    ///save to local storage////
    saveToStorage(gKey, gMeme)

    gDownload = true;
    changeBorderStatus(false)
    drawImage(gCuurImg);
    // gMeme = '';
}


function gDownloadImg() {
    // get canvas data
    var canvas = document.querySelector('.my-canvas')
    var image = canvas.toDataURL();
    // create temporary link      
    var tmpLink = document.createElement('a');
    tmpLink.download = 'image.jpg';
    // set the name of the download file     
    tmpLink.href = image;
    // temporarily add link to body and initiate the download
    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);

    gDownload = false;
    // clearTextBox()

    //// prevent txt on new editor img /////
    onDeleteTxt()

}


function clearTextBox() {
    var txtBox = document.querySelector('.txt-box')
    txtBox.value = '';
}

function onGetFont(fontStyle) {
    updateFont(gIdxText, fontStyle)
    drawImage(gCuurImg)

}

function onChangeSize(val) {
    changeSize(gIdxText, val);
    drawImage(gCuurImg)
}

function onChangeAline(val) {
    changeAline(gIdxText, val);
    drawImage(gCuurImg);

}

function onChangeY(val) {
    changeY(gIdxText, val)
    drawImage(gCuurImg);
}

function onChangeColor(color) {
    changeColor(gIdxText, color)
    drawImage(gCuurImg);

}

function onChangeStrokeColor(color) {
    changeStrokeColor(gIdxText, color)
    drawImage(gCuurImg);

}

function onDeleteTxt() {
    deleteTxt(gIdxText);
    drawImage(gCuurImg);
    clearTextBox()
}
