/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function ControlPanel(_canvas) {
    var me = this;
    var canvas = _canvas;
    var SCALE = (canvas.getDocObject().clientWidth<810)? Math.round(100*canvas.getDocObject().clientWidth/810)/100:1;
    $U.extend(this, new HorizontalBorderPanel(canvas, canvas.prefs.controlpanel.size*SCALE, false));

    me.addDownEvent(function() {});
    me.setStyle("background", canvas.prefs.controlpanel.color);
    me.setStyle("border-top", "1px solid hsla(0,0%,0%,.1)");
    me.setStyle("border-radius", "0px");
    me.show();
	me.buttons={};


    var left = 10 * SCALE;
    var size = 30 * SCALE;
    var margintop = 5 * SCALE;
    var right = me.getBounds().width - left - size;
    var hspace = 15 * SCALE;
    var smallhspace = 5 * SCALE;
    var copyDlog = null;
    var historyDlog = null;

    var addBtnLeft = function(_code, _sel, _group, _proc, _title) {
        var btn = new ControlButton(me, left, margintop, size, size, "NotPacked/images/controls/" + _code + ".png", _sel, _group, _proc, _title, _code); //MEAG agrego parametro title
        left += size;
		me.buttons[_code]=btn;
        return btn;
    };
    var addSpaceLeft = function(h) {
        left += h;
    };
    var addSepLeft = function() {
        var btn = new ControlButton(me, left, margintop, size, size, "NotPacked/images/controls/sep.png", true, null, null);
        left += size;
    };
    var addNullLeft = function() {
        var btn = new ControlButton(me, left, margintop, 0, size, "NotPacked/images/controls/sep.png", true, null, null);
    };
    var addBtnRight = function(_code, _sel, _group, _proc, _title, _alive) {
        var btn = new ControlButton(me, right, margintop, size, size, "NotPacked/images/controls/" + _code + ".png", _sel, _group, _proc, _title); //MEAG agrego parametro title
        right -= size;
        return btn;
    };
    var addSpaceRight = function(h) {
        right -= h;
    };

    var modeGroup = new BtnGroup();

    var checkMode = function(_i) {
        if (canvas.getMode() === _i) {
            modeGroup.deselect();
            if(canvas.getMode()!==1){
                canvas.setMode(1);
                arrowBtn.setActive(1);
            }else{canvas.setMode(0)};
            canvas.paint();
            // Al cambiar de modo, eliminar objetos ocultos si salimos del modo 2
        if (!_i === 2) {
            var frame = canvas.getConstruction().getFrame();
            if (frame && typeof frame.removeHiddenObjectsFromProtocol === 'function') {
                frame.removeHiddenObjectsFromProtocol();  // Eliminar los objetos ocultos del protocolo
            }
        }
            return true;
        } else
            return false;
    };

    var arrowMode = function() {
        //        if (checkMode(1))
        //        arrowBtn.select();
        if (checkMode(1))
            return;
        canvas.setMode(1);
        canvas.paint();
        var frame = canvas.getConstruction().getFrame();
        if (frame && typeof frame.showHiddenObjectsInProtocol === 'function') {
            frame.removeHiddenObjectsFromProtocol();  // Eliminar los objetos ocultos del protocolo
        }
    };
    var fingerMode = function() {
        //        fingerBtn.select();
        if (checkMode(7))
            return;
        canvas.setMode(7);
        canvas.paint();
        var frame = canvas.getConstruction().getFrame();
        if (frame && typeof frame.showHiddenObjectsInProtocol === 'function') {
            frame.removeHiddenObjectsFromProtocol();  // Eliminar los objetos ocultos del protocolo
        }
    };
    

    var hideMode = function() {
        if (checkMode(2)) return;
    
        // Cambiar al modo 2 (mostrar objetos ocultos)
        canvas.setMode(2);
        canvas.paint();
    
        // Después de cambiar la visibilidad, actualizar el protocolo
        var frame = canvas.getConstruction().getFrame();
        if (frame && typeof frame.showHiddenObjectsInProtocol === 'function') {
            frame.showHiddenObjectsInProtocol();  // Añadir los objetos ocultos al protocolo
        }
    };
    
    var trashMode = function() {
        if (checkMode(3))
            return;
        canvas.setMode(3);
        canvas.paint();
    };
    var macroMode = function() {
        if (checkMode(4))
            return;
        // if (canvas.namesManager.isVisible())
        //     nameProc();
        if (historyDlog)
            historyProc();
        if (copyDlog)
            exportProc();
        canvas.setMode(4);
        canvas.paint();
    };
    var calcMode = function() {
        if (checkMode(8))
            return;
        // if (canvas.namesManager.isVisible())
        //     nameProc();
        if (historyDlog)
            historyProc();
        if (copyDlog)
            exportProc();
        canvas.setMode(8);
        canvas.paint();
    };
    var texMode = function() {
        if (checkMode(10))
            return;
        // if (canvas.namesManager.isVisible())
        //     nameProc();
        if (historyDlog)
            historyProc();
        if (copyDlog)
            exportProc();
        canvas.setMode(10);
        canvas.paint();
    };
    var propsMode = function() {
        if (checkMode(6))
            return;
        // if (canvas.namesManager.isVisible())
        //     nameProc();
        if (historyDlog)
            historyProc();
        if (copyDlog)
            exportProc();
        canvas.setMode(6);
        canvas.paint();
    };

    var undoProc = function() {
        canvas.undoManager.undo();
        canvas.refreshKeyboard();
    };
    var redoProc = function() {
        canvas.undoManager.redo();
        canvas.refreshKeyboard();
    };



    var nameProc = function() {
		
        if (canvas.namesManager.isVisible()) {
            canvas.namesManager.hide();
            nameBtn.deselect();
        } else {
            canvas.namesManager.show();
            nameBtn.select();
        }
    };
	
    var historyProc = function() {
        if (historyDlog) {
            historyDlog.close();
            historyDlog = null;
            historyBtn.deselect();
        } else {
            if (!canvas.getConstruction().isConsultOrArrowMode()) {
                arrowBtn.select();
                arrowMode();
            }
            if (copyDlog)
                exportProc();
            historyDlog = new HistoryPanel(canvas, historyProc);
            historyBtn.select();
        }
    }

    var gridProc = function() {
        if (canvas.isCS()) {
            canvas.showCS(false);
            gridBtn.deselect();
        } else {
            canvas.showCS(true);
            gridBtn.select();
        }
    };

    //MEAG deshacer el zoom
    var zoomProc = function() {
      var Cn = canvas.getCn();
      var width = canvas.getWidth();
      var height = canvas.getHeight();
      var _zoom = Cn.coordsSystem.isCenterZoom() ? true : false;
      Cn.coordsSystem.setCenterZoom(true);
      Cn.zoom(width / 2, height / 2, 40/Cn.coordsSystem.getUnit());
      Cn.computeAll();
      canvas.paint();
      Cn.coordsSystem.setCenterZoom(_zoom);
    };

    var exportProc = function() {
        if (copyDlog) {
            copyDlog.close();
            copyDlog = null;
            copyBtn.deselect();
        } else {
            if (historyDlog)
                historyProc();
            if (!canvas.getConstruction().isConsultOrArrowMode()) {
                arrowBtn.select();
                arrowMode();
            }
            copyDlog = new ExportPanel(canvas, exportProc);
            copyBtn.select();
        }
    };

    //JDIAZ begin
    var longPressProc = function(){
        y = me.getBounds();
        x =  SCALE * (15 * 11 + 5 * 3 + 30 * 14) //12 buttons, 11 hspaces, 3 smalspaces, 2 separators
        var eventReplica = {pageX: x, pageY: y.top - y.height - 100};
        canvas.longpressManager.show(eventReplica);
    }

 
    //JDIAZ end


    



    var arrowBtn = addBtnLeft("arrow", true, modeGroup, arrowMode, $L.button_title_arrow, true);
    addSpaceLeft(hspace);
//    var fingerBtn = addBtnLeft("finger", false, modeGroup, fingerMode, $L.button_title_finger);
//    addSpaceLeft(hspace);
    var gommeBtn = addBtnLeft("hide", false, modeGroup, hideMode, $L.button_title_gomme, true);
    addSpaceLeft(hspace);
    var trashBtn = addBtnLeft("trash", false, modeGroup, trashMode, $L.button_title_trash, true);
    addSpaceLeft(hspace);
    var macrosBtn = addBtnLeft("macros", false, modeGroup, macroMode, $L.button_title_macros, true);
    addSpaceLeft(hspace);
    var calcBtn = addBtnLeft("calc", false, modeGroup, calcMode, $L.button_title_calc, true);
    addSpaceLeft(hspace);
    // if (!$U.isMobile.mobilePhone()) {
    var texBtn = addBtnLeft("tex", false, modeGroup, texMode, $L.button_title_tex, true);
    addSpaceLeft(hspace);
    // }
    var propBtn = addBtnLeft("properties", false, modeGroup, propsMode, $L.button_title_properties, true);
    addSpaceLeft(smallhspace);
    addSepLeft();
    addSpaceLeft(smallhspace);
    var historyBtn = addBtnLeft("history", false, null, historyProc, $L.button_title_history,true);
    addSpaceLeft(hspace);
    // if (!$U.isMobile.mobilePhone()) {
    var copyBtn = addBtnLeft("copy", false, null, exportProc, $L.button_title_copy, true);
    addSpaceLeft(hspace);
    // }

    // MEAG start -- retira botones
    // addBtnLeft("download", false, null, downloadProc, $L.button_title_download);
    // addSpaceLeft(hspace);
    // addBtnLeft("upload", false, null, uploadProc, $L.button_title_upload);
    // MEAG end
    addSpaceLeft(smallhspace);
    addSepLeft();
    addSpaceLeft(smallhspace);
    var nameBtn = addBtnLeft("name", false, null, nameProc, $L.button_title_name, true);
    addSpaceLeft(hspace);
    var gridBtn = addBtnLeft("grid", false, null, gridProc, $L.button_title_grid, true);
    addSpaceLeft(hspace);
    //MEAG
    var zoomBtn = addBtnLeft("zoom", false, null, zoomProc, $L.button_title_zoom, true);
    addSpaceLeft(hspace);

    //JDIAZ
    addSpaceLeft(hspace);
    var longpBtn = addBtnLeft("OtherTools", false, null, longPressProc, $L.button_title_lPress, true);

    
    //JDIAZ

    var redoBtn = addBtnRight("redo", true, null, redoProc, $L.button_title_redo, true);
    addSpaceRight(hspace);
    var undoBtn = addBtnRight("undo", true, null, undoProc, $L.button_title_undo, true);

    
    this.selectPropBtn = function() {
        
		propBtn.select();
        propsMode();
    };
    this.selectCalcBtn = function() {
        calcBtn.select();
        calcMode();
    };
    this.setUndoBtn = function(_active) {
        undoBtn.setActive(_active);
    };
    this.setRedoBtn = function(_active) {
        redoBtn.setActive(_active);
    };
    this.selectArrowBtn = function() {
        arrowBtn.select();
        arrowMode();
    };
    this.forceArrowBtn = function() {
        arrowBtn.select();
        canvas.setMode(1);
        canvas.paint();
    };
    this.deselectPointer = function() {
        arrowBtn.deselect();
    };
    this.deselectAll = function() {
        modeGroup.deselect();
    };
    this.selectNameBtn = function(_b) {
        if (_b) nameBtn.select()
        else nameBtn.deselect();
    };

	this.disableButton = function (name){
		me.buttons[name].setActive(false);
	};
	
	this.enableButton = function (name){
		me.buttons[name].setActive(true);
	};
}





function windowOpenIFrame(url) {
    var me = this;
    var FPDiv = document.createElement("div");
    FPDiv.setAttribute('width', window.innerWidth);
    FPDiv.setAttribute('height', window.innerHeight);
    FPDiv.style.position = "absolute";
    FPDiv.style.left = "0px";
    FPDiv.style.top = "0px";

    FPDiv.style.width = window.innerWidth + "px";
    FPDiv.style.height = window.innerHeight + "px";

    FPDiv.style.backgroundColor = "rgba(0,0,0,0.75)";

    var FPsize = {
        width: window.innerWidth - 50,
        height: window.innerHeight - 50
    };
    var FPFrame = document.createElement("iframe");
    //    FPFrame.setAttribute("ID", "FP_" + canvas.getID());
    FPFrame.setAttribute('width', FPsize.width);
    FPFrame.setAttribute('height', FPsize.height);
    FPFrame.setAttribute('frameborder', 0);
    FPFrame.setAttribute('marginheight', 0);
    FPFrame.setAttribute('marginwidth', 0);
    FPFrame.style.position = "absolute";
    FPFrame.style.left = (window.innerWidth - FPsize.width) / 2 + "px";
    FPFrame.style.top = (window.innerHeight - FPsize.height) / 2 + "px";
    FPFrame.style.width = FPsize.width + "px";
    FPFrame.style.height = FPsize.height + "px";
    FPFrame.style.overflow = "scroll";
    FPFrame.addEventListener('message', function(ev) {
        //        console.log("couosuuujrljsr");
    }, false);

    var FPClose = document.createElement("img");
    FPClose.style.position = "absolute";
    FPClose.style.margin = "0px";
    FPClose.style.padding = "0px";
    FPClose.setAttribute('src', $APP_PATH + "NotPacked/images/dialog/closebox.svg");
    FPClose.style.left = ((window.innerWidth + FPsize.width) / 2 - 10) + "px";
    FPClose.style.top = ((window.innerHeight - FPsize.height) / 2 - 20) + "px";
    FPClose.style.width = "30px";
    FPClose.style.height = "30px";
    FPClose.addEventListener('click', function(ev) {
        document.body.removeChild(FPDiv);
    });

    FPDiv.appendChild(FPFrame);
    FPDiv.appendChild(FPClose);

    me.div = function() {
        return FPDiv;
    };

    me.frame = function() {
        return FPFrame;
    };

    me.show = function() {
        document.body.appendChild(FPDiv);
    };

    me.close = function() {
        document.body.removeChild(FPDiv);
    };

    me.reload = function() {
        FPFrame.contentDocument.location.reload(true);
    };

    me.show();
    FPFrame.src = url;

}
