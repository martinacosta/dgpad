function ExportPanel(_canvas, _closeProc) {
    var me = this;
    var canvas = _canvas;
    var www = 450;
    var hhh = 300;
    var hidectrlpanel = false;
	var fixwidgets=false;
	var disablezoom=false;
	var fixdgscripts=false;
	var local=false;
	var version=false;
    var sel = -1;
    var btns = null;
    $U.extend(this, new CenterPanel(canvas, www, hhh));
    var JSZipReady = false;

    me.show();

    var close = function() {
        _closeProc();
        canvas.setNoMouseEvent(true);
    };

    var setText = function(_t) {
        textarea.setAttr("innerHTML", _t);
    };

    var setComment = function(_t) {
        comment.setAttr("innerHTML", _t);
    };

    var typeCallback = function(_val) {
        sel = _val;
        switch (_val) {
            case 0:
                setText(getSRC());
                var lnk = ($iOS_APPLICATION) ? "data-txt:" : "data:text/plain;base64,";
                lnk += $U.base64_encode(canvas.getSource(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version));
                setComment($L.export_sourcecomment + '<br><br><a download="DGPad_file.txt" href="' + lnk + '" style="-webkit-touch-callout:default;font-size:13px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank"><b>' + $L.export_source_download + '</b></a>');
				dgversion.setDisplay("none");
				localversion.setDisplay("none");
                break;
            case 1:
                setText(getHTMLJS());
                setComment($L.export_htmljscomment);
				dgversion.setDisplay("inline");
				localversion.setDisplay("inline");
                break;
            case 2:
                setText(getHTML());
                setComment($L.export_htmlcomment);
				dgversion.setDisplay("inline");
				localversion.setDisplay("inline");
                break;
            case 3:
                setText(getPAGE());
				var lnk = ($iOS_APPLICATION) ? "data-html:" : "data:text/plain;base64,";
				lnk += $U.base64_encode(getPAGE());
				setComment($L.export_htmlstandalonecomment1 + '<br><br><a download="DGPad_file.html" href="' + lnk + '" style="-webkit-touch-callout:default;font-size:13px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank"><b>' + $L.export_htmlstandalonecomment + '</b></a>');
                // setComment($L.export_htmlstandalonecomment);
				dgversion.setDisplay("inline");
				localversion.setDisplay("inline");
                break;
            case 4:
                var svgsrc = canvas.exportSVG();
                var lnk = ($iOS_APPLICATION) ? "data-svg:" : "data:image/svg+xml,";
                lnk += ($iOS_APPLICATION) ? $U.base64_encode(svgsrc) : encodeURIComponent(svgsrc);
                setText(svgsrc);
                setComment($L.export_svgimage + '<br><br><a download="DgpadSvgImage.svg" href="' + lnk + '" style="-webkit-touch-callout:default;font-size:13px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank"><b>' + $L.export_svgimage2 + '</b></a>');
                break;
            case 5:
                canvas.loadZipPackage(iBookStuff);
                break;
        }
        if (!Object.touchpad)
            textarea.getDocObject().select();
    };

    var iBookStuff = function() {
        setText("");
        canvas.getiBookPlugin(hidectrlpanel, "", function(_c) {
            var url = window.URL.createObjectURL(_c);
            setComment($L.export_ibook + '<br><br><a download="iBookPlugin.zip" href="' + url + '" style="-webkit-touch-callout:default;font-size:13px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank"><b>' + $L.export_ibook2 + '</b></a>');
        });
    };

    var getHTML = function() {
        return canvas.getHTML(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version);
    };

    var getHTMLJS = function() {
        return canvas.getHTMLJS(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version);
    };
	
	var getHTMLJS1 = function() {
        return canvas.getHTMLJS1(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version);
    };

    var getSRC = function() {
        var s = canvas.getSource(hidectrlpanel,fixwidgets,fixdgscripts,disablezoom,local,version);
        return s;
    };

    

	var getPAGE = function() {
		var s = '<!DOCTYPE html>\n';
		s += '<head>\n';
		s += '<title></title>\n';
		s += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n';
		s += '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no" />';
		s += '</head>\n';
		
		s += '<body onload="init()">\n';
		
		// Formulario que envía el contenido generado al servidor
		s += '<form id="geomForm" action="https://dgpad-colombia.udistrital.edu.co/estudiantes.html" target="frame" method="post">\n';
		s += '<input type="hidden" name="file_content" value="';  // Asegúrate de que los datos de la figura están aquí
		s += getHTMLJS1(hidectrlpanel, fixwidgets, fixdgscripts, disablezoom, local, version);  // Aquí se genera el contenido de la figura
		s += '">\n';
		s += '</form>';
	
		// Iframe donde se muestra la figura
		s += '<iframe id="frame" name="frame" style="display: block; position: relative; left: 0px; top: 0px; z-index:1; overflow:hidden; margin:0; padding:0; border:none"></iframe>\n';
		
		// Script para el redimensionamiento y la inicialización
		s += '<script>';
		// s += 'var $WIDTH = '+window.innerWidth+'-100, $HEIGHT = '+window.innerHeight+';';  // Tamaños iniciales
        s += 'var $WIDTH = '+window.innerWidth+', $HEIGHT = '+window.innerHeight+';';  // Tamaños iniciales
		s += 'var resize = function() {';
		s += 'var frame = document.getElementById("frame");';
		s += 'frame.width = 0;';  // Reinicia el tamaño del iframe
		s += 'frame.height = 0;';
		s += 'var ww = window.innerWidth;';
		s += 'var wh = window.innerHeight;';
		s += 'var scale = Math.min(ww / $WIDTH, wh / $HEIGHT);';  // Calcula el escalado
		s += 'frame.style.left = (ww - $WIDTH * scale) / 2 + "px";';  // Centra el iframe
		s += 'frame.width = $WIDTH;';
		s += 'frame.height = $HEIGHT;';
		s += 'frame.style.transformOrigin = "0 0";';  // Fija el punto de origen de la transformación
		s += 'frame.style.transform = "scale(" + scale + ")";';  // Aplica el escalado
		s += '};';
		
		// Manejadores de eventos para redimensionar la ventana y manejar la orientación
		s += 'window.onresize = resize;';
		s += 'window.addEventListener("orientationchange", resize);';
		
		// Inicializa la página y carga la figura
		s += 'var init = function() {';
		s += 'resize();';  // Ajusta el tamaño al cargar
		s += 'document.getElementById("geomForm").submit();';  // Envía el formulario para cargar la figura
		s += '};';
		
		s += 'document.addEventListener("DOMContentLoaded", init);';  // Ejecuta init al cargar el DOM
		s += '</script>';
		
		s += '</body>\n';
		s += '</html>\n';
		
		return s;
	};

    // var getPAGE = function() {
	// 	var s = '<!DOCTYPE html>\n';
	// 	s += '<head>\n';
	// 	s += '<title></title>\n';
	// 	s += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n';
	// 	s += '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no" />';
	// 	s += '</head>\n';
		
	// 	s += '<body onload="init()">\n';
		
	// 	// Formulario que envía el contenido generado al servidor
	// 	s += '<form id="geomForm" action="https://dgpad-colombia.udistrital.edu.co/estudiantes.html" target="frame" method="post">\n';
	// 	s += '<input type="hidden" name="file_content" value="';  // Asegúrate de que los datos de la figura están aquí
	// 	s += getHTMLJS1(hidectrlpanel, fixwidgets, fixdgscripts, disablezoom, local, version);  // Aquí se genera el contenido de la figura
	// 	s += '">\n';
	// 	s += '</form>';
	
	// 	// Iframe donde se muestra la figura
	// 	s += '<iframe id="frame" name="frame" style="display: block; position: relative; left: 0px; top: 0px; z-index:1; overflow:hidden; margin:0; padding:0; border:none"></iframe>\n';
		
	// 	// Script para el redimensionamiento y la inicialización
	// 	s += '<script>';
    //     // Tomamos como BASE el tamaño real de la ventana al cargar.
    //     // Luego, cualquier cambio de ventana se escala contra este BASE.
    //     s += 'var $BASE_W = 0, $BASE_H = 0;';
    //     s += 'function setBaseFromWindow(){';
    //     s += '  $BASE_W = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);';
    //     s += '  $BASE_H = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);';
    //     s += '}';

    //     s += 'function resize(){';
    //     s += '  var frame = document.getElementById("frame");';
    //     s += '  var ww = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);';
    //     s += '  var wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);';
    //     s += '  var scale = Math.min(ww / $BASE_W, wh / $BASE_H);';
        
    //     s += '  frame.width  = $BASE_W;';
    //     s += '  frame.height = $BASE_H;';
    //     s += '  // centrado y escala'
    //     s += '  frame.style.position = "absolute";';
    //     s += '  frame.style.transformOrigin = "0 0";';
    //     s += '  frame.style.transform = "scale(" + scale + ")";';
    //     s += '  frame.style.left = ((ww - $BASE_W * scale) / 2) + "px";';
    //     s += '  frame.style.top  = ((wh - $BASE_H * scale) / 2) + "px";';
    //     s += '}';

    //     s += 'window.addEventListener("resize", resize);';
    //     s += 'window.addEventListener("orientationchange", resize);';

    //     s += 'function init(){';
    //     s += '  setBaseFromWindow();   // <-- base = ventana actual';
    //     s += '  resize();';
    //     s += '  document.getElementById("geomForm").submit();';
    //     s += '}';

    //     s += 'document.addEventListener("DOMContentLoaded", init, { once:true });';
    //     s += '</script>';

		
	// 	s += '</body>\n';
	// 	s += '</html>\n';
		
	// 	return s;
	// };
	
	

    new CloseBox(me, close);


    var textarea_wrapper = new GUIElement(me, "div");
    textarea_wrapper.setStyles("position:absolute;background-color:rgba(0,0,0,1);left:10px;top:140px;right:10px;bottom:10px;resize:none;overflow:hidden");

    var textarea = new GUIElement(me, "textarea");
    textarea.setStyles("width:100%;height:100%;margin:0;border:0;wrap:on");
    textarea_wrapper.addContent(textarea);
    me.addContent(textarea_wrapper);

    btns = new ImageGroup(me.getDocObject(), 10, 10, www - 20, 40, $APP_PATH + "NotPacked/images/dialog/bgOff.svg", $APP_PATH + "NotPacked/images/dialog/bgOn.svg", typeCallback);
    btns.setImageSize(36);
    btns.setHspace(3);
    btns.addImage($APP_PATH + "NotPacked/images/dialog/download.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/htmljs.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/html.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/safari.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/svg.svg");
    btns.addImage($APP_PATH + "NotPacked/images/dialog/ibook.svg");

    var comment = new GUIElement(me, "div");
    comment.setStyles("position:absolute;background-color:#FEFEFE;font-size:12px;font-family:Helvetica, Arial, sans-serif;color:#252525;border: 1px solid #b4b4b4;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:5px;border-radius:10px");
    comment.setBounds(10, 80, www - 20, 55);
    setComment($L.export_standardcomment);
    me.addContent(comment);

    var addtoolsCBACK = function(_v) {
        hidectrlpanel = _v;
        typeCallback(sel);
    };

    var cbshowCS = new Checkbox(me.getDocObject(), 250, 5, 200, 30, hidectrlpanel, $L.export_istools, addtoolsCBACK);
    cbshowCS.setTextColor("#000000");
	
	var fixwidCBACK = function(_v) {
        fixwidgets = _v;
        typeCallback(sel);
    };
	
	var fixWid = new Checkbox(me.getDocObject(), 250, 27, 200, 30, fixwidgets, $L.export_fixWid, fixwidCBACK);
    fixWid.setTextColor("#000000");

	var fixdgsCBACK = function(_v) {
        fixdgscripts = _v;
        typeCallback(sel);
    };
	
	var fixDGscr = new Checkbox(me.getDocObject(), 10, 50, 200, 30, fixdgscripts, $L.export_fixDGs, fixdgsCBACK);
    fixDGscr.setTextColor("#000000");
	
	var diszoomCBACK = function(_v) {
        disablezoom = _v;
        typeCallback(sel);
    };
	
	var disZoom = new Checkbox(me.getDocObject(), 145, 50, 200, 30, disablezoom, $L.export_disZoom, diszoomCBACK);
    disZoom.setTextColor("#000000");
	
	var localCBACK = function(_v) {
        local = _v;
        typeCallback(sel);
    };
	
	var localversion = new Checkbox(me.getDocObject(), 270, 50, 80, 30, local, $L.export_local, localCBACK);
    localversion.setTextColor("#0000CD");
	
	var versionCBACK = function(_v) {
        version = _v;
        typeCallback(sel);
    };
	
	var dgversion = new Checkbox(me.getDocObject(), 340, 50, 200, 30, version, $L.export_version, versionCBACK);
   dgversion.setTextColor("#0000CD");
   dgversion.setDisplay("none");
	
    setTimeout(function() {
        btns.select(0);
        typeCallback(0);
    }, 0);


}
