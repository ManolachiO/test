// var stickers = document.getElementsByClassName('sticker');
var journal = document.getElementById('jour');
var coordsJournal = getCoords(journal);


function moveElem(elem, e) {
    var coords = getCoords(elem);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    positionFront(elem);
    moveAt(e);

    function moveAt(e) {
        elem.style.left = e.pageX - shiftX + 'px';
        elem.style.top = e.pageY - shiftY + 'px';
    }

    document.onmousemove = function (e) {
        moveAt(e);
    };
}

function getCoords(elem) {   // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        bottom: box.top + box.height,
        left: box.left + pageXOffset,
        right: box.left + box.width
    };
}

function positionFront(elem) {  //To the Front side of page
    elem.style.position = 'absolute';
    document.body.appendChild(elem);
    elem.style.zIndex = 1000;
}

//Event mousedown
document.addEventListener('mousedown', function (e) {
    if ((e.target.classList.contains('sticker')) || (e.target.parentNode.classList.contains('sticker'))) {
        if (e.target.classList.contains('sticker')) {
            var sticker = e.target;
        }
        else {
            var sticker = e.target.parentNode;
        }
        var stickParent = sticker.parentNode;
        sticker.classList.toggle('selected');
        // двигаем стикер за мышью
        var defCoords = getCoords(sticker);
        var shiftX = e.pageX - defCoords.left;
        var shiftY = e.pageY - defCoords.top;
        moveElem(sticker, e);

        //при отпускании
        sticker.onmouseup = function (e) {

            var placedLeft = getCoords(sticker).left;
            var placedTop = getCoords(sticker).top;
            var placedRight = getCoords(sticker).right;
            var placedBottom = getCoords(sticker).bottom;

            showInfo(placedLeft + ' ' + placedTop);

            //Если находится в пределах зоны журнала, то
            if (((placedLeft > coordsJournal.left) && (placedRight < coordsJournal.right)) && ((placedTop > coordsJournal.top) && (placedBottom < coordsJournal.bottom))) {
                //Если это новый стикер - клонирую в зону журнала и ставлю куда надо.
                if (!sticker.classList.contains('placed')) {
                    placedSticker = sticker.cloneNode(true);
                    journal.appendChild(placedSticker);
                    placedSticker.classList.add('placed');
                    placedSticker.style.left = placedLeft - shiftX;
                    placedSticker.style.top = placedTop - shiftY;
                    placedSticker.classList.remove('selected');

                    //Возвращаю на место
                    sticker.style.position = 'static';
                    stickParent.appendChild(sticker);
                }
                sticker.classList.remove('selected');
            }
            //Если находится вне зоны журнала, то отправяю на место в ассеты
            else {
                sticker.className += ' moving';
                sticker.style.left = defCoords.left + 'px';
                sticker.style.top = defCoords.top + 'px';
                setTimeout(
                    function () {
                        sticker.classList.remove('moving', 'selected')
                    }, 200);
            }
            document.onmousemove = null;
            sticker.onmouseup = null;
        };

        sticker.ondragstart = function () {
            return false;
        };

        //для стикеров в рабочей зоне

        if (sticker.classList.contains('placed')) {
            var plSticker = sticker;

            var optionsDropdown = document.createElement("div");
            optionsDropdown.classList.add('options');
            optionsDropdown.innerHTML = '<a href="#" class="js-del">Delete</a>' +
                '<a href="#" class="js-flip">Flip</a>' +
                '<a href="#" class="js-fw">Forward</a>' +
                '<a href="#" class="js-back">Backward</a>';

            var selectBox = document.createElement("div");
            selectBox.classList.add('selection');
            selectBox.innerHTML = '<div class="selection__anchor selection__anchor--tl"></div>' +
                '<div class="selection__anchor selection__anchor--tr"></div>' +
                '<div class="selection__anchor selection__anchor--br"></div>' +
                '<div class="selection__anchor selection__anchor--bl"></div>';

            if (!plSticker.contains(selectBox)) {
                plSticker.appendChild(selectBox);
            }
            if (!plSticker.contains(optionsDropdown)) {
                plSticker.appendChild(optionsDropdown);
            }
        }
    }
});

function showInfo(info) {
    var infoDiv = document.getElementById('info');
    infoDiv.innerHTML += 'Coords of journal:' + coordsJournal.left + ',' + coordsJournal.top + '<br>';
    infoDiv.innerHTML += info + '<br>';
}