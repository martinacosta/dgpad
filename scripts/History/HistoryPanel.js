let autosaveIntervalId = null;
let autosaveLastMinutes = null;

function HistoryPanel(_canvas, _closeProc) {
    var me = this;
    var canvas = _canvas;
    var width = canvas.getWidth() - 50;
    var height = $P.localstorage.iconwidth + 240;
    $U.extend(this, new CenterPanel(canvas, width, height));

    var closePanel = function() {
        canvas.setNoMouseEvent(true);
        _closeProc();
    }

    me.show();
    new CloseBox(me, closePanel);

    var wout = new GUIElement(me, "div");
    wout.setAbsolute();
    wout.setColor("rgba(0,0,0,0)");
    wout.setBounds(10, height - $P.localstorage.iconwidth - 180, width - 20, $P.localstorage.iconwidth + 50);
    wout.setStyle("overflow-x", "scroll");
    var d = wout.getDocObject();
    var mwheel = function(ev) {
        d.scrollLeft += $U.extractDelta(ev);
        ev.preventDefault();
    };
    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    d.addEventListener(mousewheelevt, mwheel, false);

    var win = new GUIElement(me, "div");
    win.setAbsolute();
    win.setColor("rgba(0,0,0,0)");

    var winW = 0;
    for (var i = 1; i < ($P.localstorage.max + 1); i++) {
        if (localStorage.getItem($P.localstorage.base + i)) {
            winW += $P.localstorage.iconwidth + $P.localstorage.iconmargin;
            new HistoryPanel_Elt(win, canvas, i, _closeProc);
        }
    }
    win.setBounds(0, (wout.getBounds().height - $P.localstorage.iconwidth) / 2, winW, $P.localstorage.iconwidth);

    var com = new Label(me);
    com.setBounds(20, 0, width - 40, 30);
    com.setText("<p style='line-height:100%'>" + $L.history_title + "</p>");
    com.setStyles("font-size:18px;color:#222222");
    wout.addContent(win);
    me.addContent(wout);
    me.addContent(com);

    var exe = function(ev) {
        canvas.saveToLocalStorage();
        canvas.paint();
        _closeProc();
    }

    var add = new Button(me);
    add.setText("<span style='font-size:15px'>" + $L.history_save + "</span>");
    add.setBounds((width - 400) / 2, height - 125, 400, 30);
    add.addDownEvent(exe);
    me.addContent(add);

    var clear = new Button(me);
    clear.setText("<span style='font-size:14px'>🗑️ Borrar histórico</span>");
    clear.setBounds((width - 400) / 2, height - 90, 400, 30);
    clear.addDownEvent(function() {
        for (let i = 1; i <= $P.localstorage.max; i++) {
            const key = $P.localstorage.base + i;
            const val = localStorage.getItem(key);
            if (val) {
                try {
                    const obj = JSON.parse(val);
                    if (!obj.lock) localStorage.removeItem(key);
                } catch(e) {
                    localStorage.removeItem(key);
                }
            }
        }
        closePanel();
    });
    me.addContent(clear);

    var autosavePanel = new GUIElement(me, "div");
    autosavePanel.setAbsolute();
    autosavePanel.setBounds((width - 400) / 2, height - 55, 400, 25);

    var localKey = "dgpad_autosave_interval";
    var savedVal = localStorage.getItem(localKey) || 0;

    var wrapper = autosavePanel.getDocObject();
    wrapper.innerHTML = `
      <span style="font-size:14px">
        Guardar automáticamente cada 
        <input type="number" id="autosaveInput" style="width: 50px; margin: 0 6px; font-size:14px;" value="${savedVal}" /> 
        minutos
      </span>
    `;

    me.addContent(autosavePanel);

    function setAutoSave(mins) {
        mins = parseInt(mins);
        

        // if (isNaN(mins) || mins <= 0) {
        //     console.log("DEBUG: Valor inválido, cancelando auto-guardado");
        //     return;
        // }

        // if (Number(mins) === Number(autosaveLastMinutes)) {
        //     console.log("DEBUG: Misma cantidad de minutos, no se reinicia.");
        //     return;
        // }

        if (autosaveIntervalId) {
            clearInterval(autosaveIntervalId);
            
        }

        autosaveLastMinutes = mins;
        const delay = mins * 60 * 1000;
        

        autosaveIntervalId = setInterval(() => {
            
            canvas.saveToLocalStorage();

            
                canvas.getConstruction().computeAll();
                canvas.paint();
           
        }, delay);
    }

    setAutoSave(parseInt(savedVal));

    document.getElementById("autosaveInput").addEventListener("change", function() {
        var mins = parseInt(this.value);
        if (!isNaN(mins)) {
            localStorage.setItem(localKey, mins);
            setAutoSave(mins);
        }
    });
}

function HistoryPanel_Elt(_owner, _canvas, _i, _closeProc) {
    $U.extend(this, new GUIElement(_owner, "div"));
    var me = this;
    var canvas = _canvas;
    var c = JSON.parse(localStorage.getItem($P.localstorage.base + _i));
    me.setStyles("position:absolute;border-radius:10px;border: 1px solid #b4b4b4");
    me.setStyle("left", ((_i - 1) * ($P.localstorage.iconwidth + $P.localstorage.iconmargin)) + "px");
    me.setStyle("width", $P.localstorage.iconwidth + "px");
    me.setStyle("height", $P.localstorage.iconwidth + "px");
    me.setColor("#FAFAFA");

    var load = function() {
        canvas.load64(c.src);
        _closeProc();
    }

    var img = new GUIElement(me, "img");
    img.setAttr("src", c.img);
    img.setAbsolute();
    img.setBounds(0, 0, $P.localstorage.iconwidth, $P.localstorage.iconwidth);

    me.addContent(img);

    var cloneBtn = new Button(me);
    cloneBtn.setStyles("line-height:27px;vertical-align: middle;padding: 2px;text-align: center;font: 14px Arial, Helvetica, sans-serif;border-radius: 5px;color: #252525;border: 1px solid #b4b4b4;background-color: #EEEEEE");
    cloneBtn.setText($L.history_open);
    cloneBtn.setBounds(($P.localstorage.iconwidth - 100) / 2, $P.localstorage.iconwidth - 35, 100, 27);
    cloneBtn.addUpEvent(load);

    var dateLbl = new Label(me);
    dateLbl.setText(c.date);
    dateLbl.setStyle("color", "#999999");
    dateLbl.setBounds(0, 3, $P.localstorage.iconwidth, 30);

    var imgwp = new GUIElement(me, "div");
    imgwp.setBounds(10, 5, 28, 28);
    imgwp.setAbsolute();
    imgwp.setColor("rgba(0,0,0,0)");
    imgwp.setStyles("cursor: pointer");
    var setImage = function() {
        imgwp.clearContent();
        imgwp.addImage($APP_PATH + "NotPacked/images/history/" + ((c.lock) ? "lock.svg" : "unlock.svg"));
    };
    setImage();
    var changeLock = function() {
        if ((!c.lock) && $U.isFullLocalStorage()) {
            alert($L.history_full);
            return;
        }
        c.lock = !c.lock;
        localStorage.setItem($P.localstorage.base + _i, JSON.stringify(c));
        setImage();
    };
    imgwp.addDownEvent(changeLock);

    me.addContent(dateLbl);
    me.addContent(cloneBtn);
    me.addContent(imgwp);
    _owner.addContent(me);
}






