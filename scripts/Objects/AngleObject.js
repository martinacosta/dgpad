//************************************************
//************ Angle OBJECT ******************
//************************************************
function AngleObject(_construction, _name, _P1, _P2, _P3) {
  var parent = $U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
  $U.extend(this, new MoveableObject(_construction)); // Héritage
  var me = this;
  var A = _P1;
  var O = _P2;
  var C = _P3;
  var R = 30;
  var AOC = 0; // medida del ángulo AOC orientado positivo (en [0;2π[) :
  var AOC180 = 0; // medida del ángulo AOC (en [0;π[) :
  var fromAngle = 0; // Comienzo del arco (xOA sentido trigo en [0;2π[)
  var toAngle = 0; // Fin del arco (xOC sentido trigo en [0;2π[)
  var trigo = true; // sentido de dibujo del arco ( cómo ir de A a C)
  var valid = true;
  var Cn = _construction;
  var deg_coef = 180 / Math.PI;
  var mode360 = false;
  var modeRad = false;
  // === Config etiqueta ===
  var LABEL_OFFSET_PX = 18; // distancia fija desde el arco
  var LABEL_GAP_PX = 8; // separación entre nombre y valor
  var SMALL_ANGLE_DEG = 25; // umbral ángulo pequeño
  var SMALL_ANGLE_Y_OFFSET = 6; // offset vertical extra
  this._labelDrawn = false; // flag de pintado único
  var LABEL_ANCHOR_MARGIN_PX = 6; // margen desde el centro de la marca
  var LABEL_FROM_ARC_FACTOR = 1.0; // múltiplo del tamaño de fuente para despejar del arco




  this.setParent(A, O, C);

  this.redefine = function(_old, _new) {
    if (_old === A) {
      this.addParent(_new);
      A = _new;
    } else if (_old === O) {
      this.addParent(_new);
      O = _new;
    } else if (_old === C) {
      this.addParent(_new);
      C = _new;
    }
  };
  this.is360 = function() {
    return mode360;
  };
  this.set360 = function(_360) {
    mode360 = _360;
  };
  this.getAOC = function() {
    return AOC;
  };
  this.setRad = function() {
	  this.modeRad= true;
  };
  this.setDeg = function() {
	  this.modeRad= false;
  };
  this.getValue = function() {
    var a = mode360 ? AOC : AOC180;
	if (!modeRad){
		return (Cn.isDEG()) ? (a * deg_coef) : a;
	}
	else {
		return (Cn.isDEG()) ? ((a * deg_coef))*(Math.Pi()/180) : a*(Math.Pi()/180);
		
	}
  };
  this.getCode = function() {
    return "angle";
  };
  this.getFamilyCode = function() {
    return "angle";
  };

  this.isMoveable = function() {
    return true;
  };
  //Obsolete :
  this.dragObject = function(_x, _y) {
    // console.log("dragObject");
    var vx = _x - O.getX();
    var vy = _y - O.getY();
    R = Math.sqrt(vx * vx + vy * vy);
  };
  this.compute_dragPoints = function(_x, _y) {
    // console.log("compute_dragPoints");
    var vx = _x - O.getX();
    var vy = _y - O.getY();
    R = Math.sqrt(vx * vx + vy * vy);
  };
  this.computeDrag = function() {
    // console.log("computeDrag");
  };
  this.getArcRay = function() {
    return R;
  };
  this.setArcRay = function(_r) {
    R = _r;
  };

  this.getAssociatedTools = function() {
    
    var at = "@namemover,@callproperty,@calltrash,@callhide" ;
	//JDIAZ
    if (this.getShowName()===true)
      at += ",@removename";
    
    //JDIAZ
    return (at);
  };

  // ======= Etiqueta horizontal =======
  function computeLabelAnchor() {
    // bisectriz del ángulo AOC
    var phi = trigo ? -toAngle + AOC / 2 : Math.PI - toAngle + AOC / 2;
    phi = phi - Math.floor(phi / $U.doublePI) * $U.doublePI;


    // punto a distancia fija desde el arco
    var r = R + LABEL_OFFSET_PX;
    var x = O.getX() + Math.cos(phi) * r;
    var y = O.getY() + Math.sin(phi) * r;


    // leve offset vertical en ángulos pequeños
    var ang = mode360 ? AOC : AOC180;
    var th = SMALL_ANGLE_DEG * Math.PI / 180;
    if (ang < th) {
    y += (Math.sin(phi) >= 0 ? -SMALL_ANGLE_Y_OFFSET : SMALL_ANGLE_Y_OFFSET);
    }
    return { x: x, y: y, phi: phi };
  }

  

  function paintUnifiedLabel(ctx) {
      var a = computeLabelAnchor();

      // valor numérico del ángulo (AOC o AOC180) → grados si no está en radianes
      var ang = mode360 ? AOC : AOC180;
      var isRad = (me.modeRad === true);
      var display = isRad ? ang : (ang * Math.PI ? (ang * 180 / Math.PI) : 0); // evita NaN si algo raro
      var prec = me.getPrecision();
      display = Math.round(display * prec) / prec;

      var valueStr = $L.number(display) + (isRad ? "" : "°");
      var showName = me.getShowName();
      var nameStr  = me.getSubName() + ":";

      if (me.getFont) ctx.font = me.getFont();
      ctx.textBaseline = "middle";
      ctx.fillStyle = ctx.strokeStyle;

      if (showName) {
        // nombre anclado en el centro de la marca, valor a continuación
        ctx.textAlign = "left";
        ctx.fillText(nameStr, a.x, a.y);
        var nameW = ctx.measureText(nameStr).width;
        ctx.fillText(valueStr, a.x + nameW + LABEL_GAP_PX, a.y);
      } else {
        // solo valor centrado en la marca
        ctx.textAlign = "center";
        ctx.fillText(valueStr, a.x, a.y);
      }
    }

  

this.paintLength = function (ctx) {
  if (!valid) return;

  var a = computeLabelAnchor();
  var toRight = Math.cos(a.phi) >= 0;

  var ang = mode360 ? AOC : AOC180;
  var display = (this.modeRad === true) ? ang : (ang * 180 / Math.PI);
  var prec = this.getPrecision();
  display = Math.round(display * prec) / prec;

  var valueStr = $L.number(display) + (this.modeRad ? "" : "°");
  var nameStr  = this.getSubName() + ":";

  ctx.save();
  if (this.getFont) ctx.font = this.getFont();
  var fontSize = this.getFontSize ? this.getFontSize() : 12;
  var clear = Math.max(LABEL_ANCHOR_MARGIN_PX, LABEL_FROM_ARC_FACTOR * fontSize);

  ctx.textBaseline = "middle";
  ctx.fillStyle = ctx.strokeStyle;

  if (this.getShowName()) {
    if (toRight) {
      // → nombre primero, luego valor
      ctx.textAlign = "left";
      var x0 = a.x + clear;
      ctx.fillText(nameStr, x0, a.y);                         // NOMBRE
      var wName = ctx.measureText(nameStr).width;
      ctx.fillText(valueStr, x0 + wName + LABEL_GAP_PX, a.y); // VALOR
    } else {
  // ← escribir hacia la izquierda: NOMBRE primero, luego VALOR sin solape
  ctx.textAlign = "right";
  var xEnd = a.x - clear;                         // borde cercano a la marca
  var wVal = ctx.measureText(valueStr).width;     // reserva el ancho del valor

  ctx.fillText(nameStr, xEnd - LABEL_GAP_PX - wVal, a.y); // NOMBRE termina antes del valor
  ctx.fillText(valueStr, xEnd, a.y);                       // VALOR termina en xEnd
}

  } else {
    // solo valor, despejado del arco
    if (toRight) {
      ctx.textAlign = "left";
      ctx.fillText(valueStr, a.x + clear, a.y);
    } else {
      ctx.textAlign = "right";
      ctx.fillText(valueStr, a.x - clear, a.y);
    }
  }
  ctx.restore();
};


  

var paintTxt = function (ctx, txt) {
  ctx.save();
  var a = computeLabelAnchor();
  if (this && this.getFont) ctx.font = this.getFont();

  var nameStr = txt + ":";
  var nameW = ctx.measureText(nameStr).width;
  var drawToLeft = Math.cos(a.phi) >= 0;

  ctx.textBaseline = "middle";
  ctx.fillStyle = ctx.strokeStyle;

  if (drawToLeft) {           // nombre a la izquierda del valor
    ctx.textAlign = "right";
    ctx.fillText(nameStr, a.x - (nameW + LABEL_GAP_PX), a.y);
  } else {                    // nombre en el ancla
    ctx.textAlign = "left";
    ctx.fillText(nameStr, a.x, a.y);
  }
  ctx.restore();
}.bind(this);


  
  this.paintName = function (ctx) {
  
  };

  this.paintObject = function(ctx) {
    if (valid) {
      ctx.beginPath();
      if ($U.approximatelyEqual(AOC180, $U.halfPI)) {
        var cto = R * Math.cos(-toAngle),
          sto = R * Math.sin(-toAngle);
        var cfrom = R * Math.cos(-fromAngle),
          sfrom = R * Math.sin(-fromAngle);
        ctx.moveTo(O.getX() + cto, O.getY() + sto);
        ctx.lineTo(O.getX() + cto + cfrom, O.getY() + sto + sfrom);
        ctx.lineTo(O.getX() + cfrom, O.getY() + sfrom);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(O.getX(), O.getY());
        ctx.lineTo(O.getX() + cto, O.getY() + sto);
        ctx.lineTo(O.getX() + cfrom, O.getY() + sfrom);
        ctx.fill();
      } else {
        ctx.arc(O.getX(), O.getY(), R, -fromAngle, -toAngle, trigo);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(O.getX() + R * Math.cos(-toAngle), O.getY() + R * Math.sin(-toAngle));
        ctx.lineTo(O.getX(), O.getY());
        ctx.lineTo(O.getX() + R * Math.cos(-fromAngle), O.getY() + R * Math.sin(-fromAngle));
        ctx.fill();
      }
    }

  };

  this.compute = function() {
    var t = $U.computeAngleParams(A.getX(), A.getY(), O.getX(), O.getY(), C.getX(), C.getY());
    fromAngle = t.startAngle;
    toAngle = t.endAngle;
    trigo = mode360 ? true : t.Trigo;
    AOC = t.AOC;
    AOC180 = t.AOC180;
    valid = !isNaN(AOC);
    // valid = !isNaN(fromAngle);
    // console.log("fromA="+fromAngle+" toA="+toAngle+" trig="+trigo+" AOC="+AOC);
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    this._labelDrawn = false; // reinicia por frame// MEAG end
  };


  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Angle", A.getVarName(), O.getVarName(), C.getVarName());
  };

  this.mouseInside = function(ev) {
    return $U.isNearToArc(O.getX(), O.getY(), AOC, fromAngle, toAngle, trigo, R, this.mouseX(ev), this.mouseY(ev), this.getOversize());
  };

  this.setDefaults("angle");

  // Sobrecarga de getStyle para tratar
  // un caso particular:
  this.getStyle = function(src) {
    var s = this.getStyleString();
    if (isNaN(this.getRealPrecision())) s += ";p:-1";
    src.styleWrite(true, this.getName(), "STL", s);
  };
  

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_angle_description + A.getVarName() + O.getVarName() + C.getVarName();
      parents = [A.getVarName(), O.getVarName(), C.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

  //JDIAZ start
  this.nameMover = function(ev, zc) {
    me.setShowName(true);
  }
  //JDIAZ end
}
