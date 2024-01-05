function LongpressManager(_canvas) {
  var canvas = _canvas;
  var Cn = canvas.getConstruction();
  var me = this;
  var panel = null;
  var x = 0;
  var y = 0;

  var newExp = function(_ex) {
    var OBJ = new ExpressionObject(Cn, "_a", "", "", "", _ex, x, y);
    if (canvas.namesManager.isVisible())
      canvas.namesManager.setName(OBJ);
    else
      OBJ.setName(getName("abcdefghijklmnopqrsuvw"));
    OBJ.setT("");
    var r = Math.random() * 128;
    var g = Math.random() * 128;
    var b = Math.random() * 128;
    OBJ.setRGBColor(r, g, b);
    canvas.addObject(OBJ);
    return OBJ;
  };

  var newList = function(_ex) {
    var OBJ = new ListObject(Cn, "_l", _ex);
    OBJ.setSegmentsSize(0);
    var c = _ex.getColor();
    OBJ.setRGBColor(c.getR(), c.getG(), c.getB());
    canvas.addObject(OBJ);
    return OBJ;
  };

  var getList = function() {
    var cx = Cn.coordsSystem.x(Cn.getWidth() / 2);
    var cy = Cn.coordsSystem.y(Cn.getHeight() / 2);
    var l = Cn.coordsSystem.l(Cn.getHeight()) / 4;
    var L = l * (1 + Math.sqrt(5)) / 2;
    // var str="["+(cx-L/2)+","+(cy-l/2)+"]";
    var t = [
      [cx - L / 2, cy - l / 2],
      [cx + L / 2, cy - l / 2],
      [cx + L / 2, cy + l / 2],
      [cx - L / 2, cy + l / 2],
      [cx - L / 2, cy - l / 2]
    ];
    for (var i = 0; i < t.length; i++) {
      t[i] = "[" + t[i].toString() + "]";
    };
    return "[" + t.toString() + "]";
  };

  var createExp = function() {
    newExp("(1+sqrt(5))/2");
    Cn.compute();
    canvas.paint();
  };

  var createExpPts = function() {
    newList(newExp(getList()));
    Cn.compute();
    canvas.paint();
  };

  var createExpSegs = function() {
    var OBJ = newList(newExp(getList()));
    OBJ.setSegmentsSize(1);
    Cn.compute();
    canvas.paint();
  };

  var getName = function(_t) {
    var t = _t.match(/.{1,1}/g);
    for (var i = 0; i < t.length; i++) {
      if (!Cn.find(t[i])) return t[i];
    }
    return t[0];
  }

  var createIntCursor = function() {
    var OBJ = newExp("");
    if (!canvas.namesManager.isVisible()) OBJ.setName(getName("nmkabcuvwrst"));
    OBJ.setMin("0");
    OBJ.setMax("10");
    OBJ.setIncrement(1);
    Cn.compute();
    canvas.paint();
  };

  var createContCursor = function() {
    var OBJ = newExp("0");
    if (!canvas.namesManager.isVisible()) OBJ.setName(getName("nmkabcuvwrst"));
    OBJ.setMin("-10");
    OBJ.setMax("10");
    Cn.compute();
    canvas.paint();
  };

  var createEditWidget = function() {
    canvas.addText($L.edit_widget_name + " : <input id=\"exp_name\" interactiveinput=\"replace\">\n\n\u00a7  name=\"" + $L.edit_widget_edit + "\" style=\"font-size:18px;padding: 5px 10px;background: #4479BA;color: #FFF;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;border: solid 1px #20538D;text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);-moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\"\nvar exp_n=Find(\"exp_name\");\nvar exp_e=Find(\"exp_edit\");\nexp_e.setAttribute(\"target\",exp_n.value);\nRefreshInputs();\n\n\u00a7\n\n<textarea id=\"exp_edit\" target=\"aa\" style=\"width:500px;height:400px\"></textarea>\n", x, y, 550, 530, "c:rgba(59,79,115,0.18);s:3;r:15;p:4");
  };
  
  var createConstrucWidget = function() {
    canvas.addText($L.construc_widget_help+'<textarea id="construc" style="width:300px;height:200px"></textarea> § name="Construir" style="font-size:24px;color:blue" var Objetos=me.C.getListObject(); Puntos=[]; for (let i=0; i<Objetos.length; i++) { if (Objetos[i].getCode()=="point"|Objetos[i].getCode()=="expression_cursor") {Puntos.push(Objetos[i])} } for (let i=0; i<Puntos.length; i++) { me.C.safelyDelete(Puntos[i]) } var nombres=[]; var puntos=[]; var rectas=[]; var circulos=[]; var poligonos=[]; const pto = /Punto/i; const ptocualq= /Punto cualquiera/i; const ptomedio= /Punto medio/i; const ptointer= /Punto de intersecci\u00D3n/i; const ptosobre= /Punto sobre/i; const segmento= /Segmento/i; const circulo= /C\u00EDrculo/i; const circcentro=/C\u00EDrculo de centro/i; const circ3ptos=/C\u00EDrculo por/i; const circradio=/C\u00EDrculo de radio/i; const recta=/Recta/i; const semirrecta=/Semirrecta/i; const bisect=/Bisectriz/i; const mediat=/Mediatriz/i; const arco=/Arco/i; const paralela=/Paralela/i; const perp=/Perpendicular/i; const poligo=/Pol\u00EDgono/i; const simetria=/Sim\u00E9trico de/i; const angulo=/forma un ángulo de/i; const rotacion=/Rotaci\u00D3n/i; const homotecia=/Homot\u00E9tico/i; const traslacion=/Traslaci\u00D3n/i; const vector=/Vector/i; texto=Find("construc").value; lineas=texto.split("\\n"); lineas=lineas.filter(Boolean); for (let i = 0; i < lineas.length; i++) { if (lineas[i].indexOf(":")==-1){ alert("falta el nombre en "+lineas[i]); break; } nombre=lineas[i].split(":")[0]; nombres.push(nombre); predicado=lineas[i].split(":")[1].trim(); palabrasPredicado=predicado.split(" "); if (pto.test(predicado)){ if (palabrasPredicado.length<2){alert("no entiendo "+lineas[i])} if (ptocualq.test(predicado)) { if(palabrasPredicado.length==2){ p=Point(nombre,Math.random()*10-5,Math.random()*10-5); Find(p).setShowName(1); puntos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_anyPoint);}; } if(ptosobre.test(predicado)) { if(palabrasPredicado.length==3&&(rectas.includes(predicado.split(" ")[2])|circulos.includes(predicado.split(" ")[2]))){ p=PointOn(nombre, predicado.split(" ")[2],0.5); Find(p).setShowName(1); puntos.push(nombre); } else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_pointOn);}; } if (ptomedio.test(predicado)) { if(palabrasPredicado.length==6&&puntos.includes(predicado.split(" ")[3])&&puntos.includes(predicado.split(" ")[5])){ p=MidPoint(nombre,predicado.split(" ")[3],predicado.split(" ")[5]); Find(p).setShowName(1); puntos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_midPoint);}; } if (ptointer.test(predicado)) { if(palabrasPredicado.length==7&&((rectas.includes(predicado.split(" ")[4])&&rectas.includes(predicado.split(" ")[6]))|(circulos.includes(predicado.split(" ")[4])&&circulos.includes(predicado.split(" ")[6]))|(rectas.includes(predicado.split(" ")[4])&&circulos.includes(predicado.split(" ")[6]))|(circulos.includes(predicado.split(" ")[4])&&rectas.includes(predicado.split(" ")[6])))){ p=OrderedIntersection(nombre,predicado.split(" ")[4],predicado.split(" ")[6],1); Find(nombre).compute(); Find(p).setShowName(1); puntos.push(nombre); } else if(palabrasPredicado.length==10&&(predicado.includes("diferente de")&&((rectas.includes(predicado.split(" ")[4])&&rectas.includes(predicado.split(" ")[6]))|(circulos.includes(predicado.split(" ")[4])&&circulos.includes(predicado.split(" ")[6]))|(rectas.includes(predicado.split(" ")[4])&&circulos.includes(predicado.split(" ")[6]))|(circulos.includes(predicado.split(" ")[4])&&rectas.includes(predicado.split(" ")[6]))))){ p=OrderedIntersection(nombre,predicado.split(" ")[4],predicado.split(" ")[6],1,predicado.split(" ")[9]); Find(nombre).compute(); Find(p).setShowName(1); puntos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_interPoint);}; } } if (segmento.test(predicado)) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.includes(nombres[i])&&predicado.indexOf(nombres[i])>8) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==2&&nombres2.length==2&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])){ Segment(nombre,nombres2[0],nombres2[1]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_segment);}; } if (vector.test(palabrasPredicado[0])) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.includes(nombres[i])&&predicado.indexOf(nombres[i])>6) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==2&&nombres2.length==2&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])){ Vector(nombre,nombres2[0],nombres2[1]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_vector);}; } if (recta.test(predicado)&&predicado.indexOf("ecta")==1) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.includes(nombres[i])&&predicado.indexOf(nombres[i])>5) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==2&&nombres2.length==2&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])){ Line(nombre,nombres2[0],nombres2[1]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_line);}; } if (semirrecta.test(predicado)&&palabrasPredicado.length<16) { if(palabrasPredicado.length==8&&puntos.includes(palabrasPredicado[3])&&puntos.includes(palabrasPredicado[7])){ Ray(nombre,predicado.split(" ")[3],predicado.split(" ")[7]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_ray);}; } if (bisect.test(predicado)) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.includes(nombres[i])&&predicado.indexOf(nombres[i])>8) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==4&&nombres2.length==3&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])&&puntos.includes(nombres2[2])){ AngleBisector(nombre,nombres2[0],nombres2[1],nombres2[2]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_angleBis);}; } if (circcentro.test(predicado)&&predicado.includes("que pasa por")) { if(palabrasPredicado.length==8&&puntos.includes(predicado.split(" ")[3])&&puntos.includes(predicado.split(" ")[7])){ Circle(nombre,predicado.split(" ")[3],predicado.split(" ")[7]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_circle);}; } if (circcentro.test(predicado)&&predicado.includes("y radio")) { if(palabrasPredicado.length==7&&puntos.includes(predicado.split(" ")[3])&&predicado.split(" ")[6]>0){ Circle1(nombre,predicado.split(" ")[3],predicado.split(" ")[6]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_circle1);}; } if (circradio.test(predicado)) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.split(" ")[3].includes(nombres[i])) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==7&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])&&puntos.includes(predicado.split(" ")[6])){ Circle3(nombre,nombres2[0],nombres2[1],predicado.split(" ")[6]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_circle3);}; } if (circ3ptos.test(predicado)) { if(palabrasPredicado.length==6&&puntos.includes(predicado.split(" ")[2].slice(0,-1))&&puntos.includes(predicado.split(" ")[3])&&puntos.includes(predicado.split(" ")[5])){ Circle3pts(nombre,predicado.split(" ")[2].slice(0,-1),predicado.split(" ")[3],predicado.split(" ")[5]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]);}; } if (arco.test(predicado)) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.split(" ")[1].includes(nombres[i])) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==2&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])&&puntos.includes(nombres2[2])){ Arc3pts(nombre,nombres2[0],nombres2[1],nombres2[2]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_arc);}; } if (paralela.test(predicado)) { if(palabrasPredicado.length==5&&rectas.includes(palabrasPredicado[2])&&puntos.includes(palabrasPredicado[4])){ Parallel(nombre,palabrasPredicado[2],palabrasPredicado[4]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_parallel);}; } if (perp.test(predicado)) { if(palabrasPredicado.length==5&&rectas.includes(palabrasPredicado[2])&&puntos.includes(palabrasPredicado[4])){ Perpendicular(nombre,palabrasPredicado[2],palabrasPredicado[4]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_perp);}; } if (mediat.test(predicado)) { if(palabrasPredicado.length==5&&puntos.includes(palabrasPredicado[2])&&puntos.includes(palabrasPredicado[4])){ PerpendicularBisector(nombre,palabrasPredicado[2],palabrasPredicado[4]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_perpBis);}; } if (poligo.test(predicado)) { var nombres2=[]; poligono=predicado.split(" ")[1]; for (let i = 0; i < nombres.length; i++) { if (poligono.includes(nombres[i])&&puntos.includes(nombres[i])) { nombres2.push(nombres[i]); nombres2.push(predicado.split(" ")[1].indexOf(nombres[i])); poligono=poligono.slice(0,poligono.indexOf(nombres[i])+nombres[i].length)+","+poligono.slice(poligono.indexOf(nombres[i])+nombres[i].length) } } poligono=poligono.slice(0,poligono.length-1); p=Polygon(nombre,poligono); Find(p).setOpacity(0.2); poligonos.push(nombre); } if(simetria.test(predicado)){ if(palabrasPredicado.length==7){ if(puntos.includes(palabrasPredicado[6])){ p=Symmetry(nombre,palabrasPredicado[6],palabrasPredicado[2]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } if(rectas.includes(palabrasPredicado[6])){ p=Reflection(nombre,palabrasPredicado[6],palabrasPredicado[2]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_csym+$L.construc_widget_help_asym);}; } if(angulo.test(predicado)){ if(palabrasPredicado.length==19){ if(puntos.includes(palabrasPredicado[3])&&nombres.includes(palabrasPredicado[15])){ amplitud=Number(palabrasPredicado[9].slice(0,-1));sentido=(palabrasPredicado[18]=="antihorario"); FixedAngle(nombre,palabrasPredicado[15],amplitud,sentido); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_fixedAngle);}; }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_fixedAngle);}; } if(rotacion.test(predicado)){ if(palabrasPredicado.length==9){ if(puntos.includes(palabrasPredicado[5])&&palabrasPredicado[8]>0){ er=Expression("Er","","","",palabrasPredicado[8],"-13.958333333333334","5.5625"); centro=palabrasPredicado[2]; p=Rotation(nombre,Find(er).getName(),centro,palabrasPredicado[5]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_rot);}; } if(homotecia.test(predicado)){ if(palabrasPredicado.length==10){ if(puntos.includes(palabrasPredicado[6])&&palabrasPredicado[9]>0){ eh=Expression("Eh","","","",palabrasPredicado[9],"-13.958333333333334","5.5625"); centro=palabrasPredicado[2]; p=Homothety(nombre,Find(eh).getName(),centro,palabrasPredicado[6]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_homot);}; } if(traslacion.test(predicado)){ if(palabrasPredicado.length==7&&rectas.includes(palabrasPredicado[6])){ p=Translation(nombre,palabrasPredicado[6],palabrasPredicado[2]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } if(!(palabrasPredicado.length==7&&rectas.includes(palabrasPredicado[6]))){ alert("no entiendo "+lineas[i]+$L.construc_widget_help_trans);}; } } §  ', x, y, 350, 350, "c:rgba(59,79,115,0.18);s:3;r:15;p:4");
  };

  // MEAG start
  var createFrameConstruction = function() {
    Cn.getFrame().drawFrame(_canvas, x, y);
    Cn.getFrame().draw();
  };
  // MEAG end

  var createBlocklyButton = function() {
    $U.prompt($L.create_blockly_program_change_message, $L.create_blockly_program_name, "text", function(_old, _new) {
      if (_new === "") _new = _old;
      var OBJ = new BlocklyButtonObject(Cn, "blk_btn", _new, x, y);
      OBJ.setOpacity(canvas.prefs.opacity.blockly_button);
      canvas.addObject(OBJ);
      Cn.compute();
      canvas.paint();
      canvas.blocklyManager.edit(OBJ);
    }, 450, 165, 430);
  };

var duplicateFig = function(){
	source=canvas.getSource();
	source=btoa(unescape(encodeURIComponent(source)));
	var target="popupform"+Math.random()*100000000;
	var FORM=document.createElement("form");
	FORM.target=target;
	FORM.method="post";
	// FORM.action="estudiantes"
	INPUT=document.createElement("input");
	INPUT.type="hidden";
	INPUT.name="file_content";
	
	INPUT.value=source;

	FORM.appendChild(INPUT);
	canvas.getDocObject().parentNode.appendChild(FORM);
	window.open("",target);
	FORM.submit();
	}
var leer = function (ev){
	
	canvas.load64($U.base64_encode(ev.target.result));
	}
	
var OpenFile = function (){
	
		var select=document.createElement("input");
		select.type="file";
		select.onchange = function (ev) {
			
			var arch=new FileReader();
			arch.readAsText(ev.target.files[0]);
			arch.addEventListener('load',leer,false);
			
			
		}
		
		document.body.appendChild(select);
		select.click();
		
		
		}

var SaveFile = async () => {
	const options = {
	   types: [
		 {
		   description: "archivos dgpad-colombia",
		   accept: {
			 "text/plain": [".txt"],
		   },
		 },
	   ],
	 };
 
 const handle = await window.showSaveFilePicker(options);
 const writable = await handle.createWritable();
 
 await writable.write(canvas.getSource());
 await writable.close();
 
 return handle;
};

	
  var tab = [];
    // MEAG start
  tab.push([$L.create_construccion_frame, createFrameConstruction]);
  tab.push([$L.create_duplicate_figure, duplicateFig]);
  tab.push([$L.create_open_file, OpenFile]);
  tab.push([$L.create_save_file, SaveFile]);
  tab.push([$L.create_widget_construc,createConstrucWidget]);
  if (canvas.version() == "profesores") {
	  
    tab.push([$L.create_blockly_button, createBlocklyButton]);
    tab.push([$L.create_exp, createExp]);
    tab.push([$L.create_exp_pts, createExpPts]);
    tab.push([$L.create_exp_segs, createExpSegs]);
    tab.push([$L.create_cursor_int, createIntCursor]);
    tab.push([$L.create_cursor_cont, createContCursor]);
    tab.push([$L.create_widget_edit, createEditWidget]);
  }
  // MEAG end

  var close = function() {
    panel = null;
  };

  var exec = function(_proc) {
    _proc();
  };

  me.isVisible = function() {
    return (panel && panel.isVisible());
  };

  me.show = function(ev) {
    x = canvas.mouseX(ev);
    y = canvas.mouseY(ev);
    x = Math.round(x / 10) * 10;
    y = Math.round(y / 10) * 10;
    panel = new BubblePanel(canvas, exec, close, ev, tab, $L.longpress_message, 270, 240, 30);
  };




}
