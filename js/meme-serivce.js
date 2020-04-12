'use strict'

var gKeywords = { 'happy': 12, 'funny puk': 1 }

var gImgs = [
        { id: 1, url: "meme-imgs/1.jpg", keywords: ['happy', 'sad'] },
        { id: 2, url: 'meme-imgs/2.jpg', keywords: ['happy'] },
        { id: 3, url: 'meme-imgs/3.jpg', keywords: ['happy'] },
        { id: 4, url: 'meme-imgs/4.jpg', keywords: ['happy'] },
        { id: 5, url: 'meme-imgs/5.jpg', keywords: ['happy'] },
        { id: 6, url: 'meme-imgs/6.jpg', keywords: ['happy'] },
        { id: 7, url: 'meme-imgs/7.jpg', keywords: ['happy'] },
        { id: 8, url: 'meme-imgs/8.jpg', keywords: ['happy'] },
        { id: 9, url: 'meme-imgs/9.jpg', keywords: ['happy'] },
        { id: 10, url: 'meme-imgs/10.jpg', keywords: ['happy'] },
        { id: 11, url: 'meme-imgs/11.jpg', keywords: ['happy'] },
        { id: 12, url: 'meme-imgs/12.jpg', keywords: ['happy'] },
        { id: 13, url: 'meme-imgs/13.jpg', keywords: ['happy'] },
        { id: 14, url: 'meme-imgs/14.jpg', keywords: ['happy'] },
        { id: 15, url: 'meme-imgs/15.jpg', keywords: ['happy'] },
        { id: 16, url: 'meme-imgs/16.jpg', keywords: ['happy'] },
        { id: 17, url: 'meme-imgs/17.jpg', keywords: ['happy'] },
        { id: 18, url: 'meme-imgs/18.jpg', keywords: ['happy'] }
];

var gMeme = {
        selectedImgId: 5,
        selectedLineIdx: 0,
        showBorder: false,
        lines: [{
                txt: '',
                size: 40,
                align: 'center',
                color: 'gray',
                posX: 200,
                posY: 50,
                font: 'impact',
                stroke: 'black',
                letterCount: 0

        }]
}


function getGmeme() {
        return gMeme
}

function getGImgs() {
        return gImgs
}

function updateTxtBox(txt, textBox) {
        gMeme.lines[textBox].letterCount++
        gMeme.lines[textBox].txt += txt
        drawImage()
}


function addTxtBox(textSettings) {
        gMeme.lines.push(
                {
                        txt: '',
                        size: 40,
                        align: 'center',
                        color: textSettings.textColor,
                        posX: 200,
                        posY: textSettings.posY,
                        font: 'impact',
                        stroke: textSettings.strokeColor,
                        letterCount: 0

                })
}

function updateFont(textBox, font) {
        gMeme.lines[textBox].font = font;
}

function changeSize(textBox, val) {
        if (val === '+') { gMeme.lines[textBox].size += 5; }
        else { gMeme.lines[textBox].size -= 5; }
}

function changeAline(textBox, val) {
        gMeme.lines[textBox].align = val;
}

function changeY(textBox, val) {
        if (val === 'up') { gMeme.lines[textBox].posY += 5; }
        else { gMeme.lines[textBox].posY -= 5; }
}

function changeColor(textBox, val) {
        gMeme.lines[textBox].color = val;
}

function changeStrokeColor(textBox, val) {
        gMeme.lines[textBox].stroke = val;

}

function deleteTxt(textBox) {

        if (gIdxText !== 0) {

                gMeme.lines.splice(textBox, 1)
        } else {
                gMeme.lines[textBox].txt = ""
        }
}

function changeBorderStatus(val) {

        gMeme.showBorder = val;
        // return gMeme.lines.border
}

// function getBorderStatus() {

//         return gMeme.lines.border;
// }
