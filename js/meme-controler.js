'use strict'

var gCanvas;
var gCtx;
var gCanvasHeight
var gCanvasWidth
var gCanvasBackGround;
var gImgs
var gCuurImg
var gTextBoxLength
var gIdxText = 0
var gKey = 'meme-settings'
var gShowSavedImgs = true;
var gSavedImgs = []


function onInit() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');
    gCanvasHeight = gCanvas.height
    gCanvasWidth = gCanvas.width
    rederGallery()
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

function rederGallery() {

    gImgs = getGImgs()

    var strHTML = gImgs.map(img => {
        return `<img  id=${img.id} class='img img${img.id}' src="${img.url}" alt="${img.keywords}" onclick="onPickedImg(this)"
        onmouseover = "animateImg(this)" </img> `
    })

    var elImg = document.querySelector('.gallery')
    elImg.innerHTML = strHTML.join('')
}



function onShowMemes() {
    var localData = loadFromStorage(gKey)
    gSavedImgs.push(localData)
    rederSavedImgs()
}


function rederSavedImgs() {
    var strHTML = ''

    gSavedImgs.forEach(savedImg => {
        strHTML += `<img  id=${savedImg.selectedImgId} class='img img${savedImg.selectedImgId}' src="${savedImg.url}" onmouseover = "animateImg(this)" </img> `
    })

    var elImg = document.querySelector('.savedImgs-gallery')
    elImg.innerHTML = strHTML
}


function onPickedImg(el) {
    gCuurImg = el
    updateGmeme(el)
    drawCurrImage(el)
}

function drawCurrImage() {
    var gMeme = getGmeme()

    var img = new Image();
    img.src = gCuurImg.src;

    img.onload = function () {
        gCtx.drawImage(img, 0, 0, gCanvasHeight, gCanvasWidth);
        renderText()

        // check with or without border//
        if (!gMeme.showBorder) {
            downloadImg();
        } else { getFocus() }
    };
    onShowPage("editor")
}


function renderText() {
    var gMeme = getGmeme()

    gTextBoxLength = gMeme.lines.length - 1

    var lines = gMeme.lines
    lines.forEach(line => {

        gCtx.font = `${line.size}px ${line.font}  `;
        gCtx.fillStyle = line.color;
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, line.posX, line.posY);
        gCtx.setLineDash([])
        gCtx.strokeStyle = line.stroke;
        gCtx.strokeText(line.txt, line.posX, line.posY);
    })
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
    var gMeme = getGmeme()

    var widthX = gMeme.lines[gIdxText].posX
    var widthY = gMeme.lines[gIdxText].posY
    var xLength = gMeme.lines[gIdxText].letterCount
    var size = gMeme.lines[gIdxText].size

    var fromX = widthX - (10 * xLength * (size / 20)) / 2
    var fromY = widthY - (size)
    var toX = (xLength * size / 2)
    var toY = size + 20

    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.rect(fromX, fromY, toX, toY)
    gCtx.setLineDash([10, 10])
    gCtx.stroke()
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
    var gMeme = getGmeme()
    gSavedImgs.push(gMeme)

    ///save to local storage////
    saveToStorage(gKey, gSavedImgs)

    changeBorderStatus(false)
    drawCurrImage();
}


function downloadImg() {

    var canvas = document.querySelector('.my-canvas')
    var image = canvas.toDataURL();
    // create temporary link      
    var tmpLink = document.createElement('a');
    tmpLink.download = 'image.jpg';
    // set the name of the download file     
    tmpLink.href = image;
    tmpLink.click();

    changeBorderStatus(true)

}


function clearTextBox() {
    var txtBox = document.querySelector('.txt-box')
    txtBox.value = '';
}



function getPositionY() {
    if (gIdxText === 0) return 50
    else if (gIdxText === 1) return 400
    else return (gCanvasHeight / 2)
}


function onUpdateTxt(el) {
    updateTxtBox(el.value.slice(-1), gIdxText)
    drawCurrImage()

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
    drawCurrImage()
}


function onAddText() {
    gIdxText += 1;
    var textSetting = getTextSettings()
    clearTextBox()
    addTxtBox(textSetting)

}

function onGetFont(fontStyle) {
    updateFont(gIdxText, fontStyle)
    drawCurrImage()

}

function onChangeSize(val) {
    changeSize(gIdxText, val);
    drawCurrImage()
}

function onChangeAline(val) {
    changeAline(gIdxText, val);
    drawCurrImage();

}

function onChangeY(val) {
    changeY(gIdxText, val)
    drawCurrImage();
}

function onChangeColor(color) {
    changeColor(gIdxText, color)
    drawCurrImage();

}

function onChangeStrokeColor(color) {
    changeStrokeColor(gIdxText, color)
    drawCurrImage();

}

function onDeleteTxt() {
    deleteTxt(gIdxText);
    gIdxText--;
    drawCurrImage();
    clearTextBox()
}
