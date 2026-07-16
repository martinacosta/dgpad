//************************************************
//************ FIXED ANGLE OBJECT ****************
//************************************************
function FixedAngleObject(_construction, _name, _sr1, _trigo) {
	var O = _sr1.P1;
    var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, O));
    $U.extend(this, new MoveableObject(_construction)); // Héritage
    var me = this;
    var A = _sr1.P2;
    
    var C = new VirtualPointObject(0, 0);
    var E1 = null;
    var VALUE = 0;
    var Cn = _construction;
    var R = 30;
    var AOC = 0; // mesure de l'angle AOC orienté positif (dans [0;2π[) :
    var fromAngle = 0; // Début de l'arc (xOA sens trigo dans [0;2π[)
    var toAngle = 0; // Fin de l'arc (xOC sens trigo dans [0;2π[)
    var trigo = _trigo; // Sens de l'angle
    var sel_arc, sel_ray = true;
    var LABEL_OFFSET_PX = 18; // distancia fija desde el arco (px)
    var LABEL_GAP_PX = 8;     // separación horizontal entre nombre y valor (px)
    var SMALL_ANGLE_DEG = 25;      // umbral para “ángulo pequeño”
    var SMALL_ANGLE_Y_OFFSET = 6;  // desplazamiento vertical extra (px)
    var LABEL_ANCHOR_MARGIN_PX = 6; // margen desde el centro de la marca
    var LABEL_FROM_ARC_FACTOR = 1.0; // múltiplo del tamaño de fuente para despejar del arco


    this.setParent(A, O);
    this.blocks.setMode(["oncompute"], "oncompute");

    this.redefine = function(_old, _new) {
        if (_old === A) {
            this.addParent(_new);
            A = _new;
        } else if (_old === O) {
            this.addParent(_new);
            O = _new;
        }
    };
    this.isTrigo = function() {
        return trigo;
    };
    this.setTrigo = function(_t) {
        trigo = _t;
    };

    this.getValue = function() {
        return E1.value();
    };
    this.getCode = function() {
        return "fixedangle";
    };
    this.getFamilyCode = function() {
        return "fixedangle";
    };
    this.setTrigo = function(_t) {
        trigo = _t
    };
    this.getTrigo = function() {
        return trigo;
    };

    this.getAssociatedTools = function() {
        var at = superObject.getAssociatedTools();
        at += ",@callcalc,@blockly";
		//JDIAZ
    if (this.getShowName()===true)
      at += "@removename";
    
    //JDIAZ
    
    
        return at;
    };

    this.getAlphaBounds = function(anim) {
        var t = superObject.getAlphaBounds(anim);
        t[0] = 0;
        return t;
    };

    this.setAlpha = function(p) {
        superObject.setAlpha(p);
        var a = p.getAlpha();
        if (a < 0) {
            p.setAlpha(0);
        }
    };

    // see if point inside ray
    this.checkIfValid = function(_P) {
        var dx = this.getDX();
        var dy = this.getDY();
        var xAP = _P.getX() - O.getX();
        var yAP = _P.getY() - O.getY();
        if ((xAP * dx < 0) || (yAP * dy < 0)) {
            _P.setXY(NaN, NaN);
        }
    };

    // Pour Blockly :
    this.getRoot().setExpression = this.setExpression = function(exy) {
        me.setExp(exy);
    }

    // setExp pour les widgets :
    me.setExp = me.setE1 = function(_t) {
        E1 = Expression.delete(E1);
        E1 = new Expression(me, _t);
    };
    me.getExp = function() {
        return me.getE1().getSource();
    };
    me.getE1 = function() {
        return E1;
    };

    this.isMoveable = function() {
        return true;
    };

    this.compute_dragPoints = function(_x, _y) {
        if (sel_arc) {
            var vx = _x - O.getX();
            var vy = _y - O.getY();
            R = Math.sqrt(vx * vx + vy * vy);
        }
    };
    this.computeDrag = function() {};

    this.getArcRay = function() {
        return R;
    };
    this.setArcRay = function(_r) {
        R=_r;
    };

    

    this.paintLength = function (ctx) {
        var a = computeLabelAnchor();
        var toRight = Math.cos(a.phi) >= 0;

        var prec = this.getPrecision();
        var display = Math.round(VALUE * prec) / prec;
        var valueStr = $L.number(display) + "°";
        var nameStr  = this.getSubName() + ":";

        ctx.save();
        if (this.getFont) ctx.font = this.getFont();
        var fontSize = this.getFontSize ? this.getFontSize() : 12;
        var clear = Math.max(LABEL_ANCHOR_MARGIN_PX, LABEL_FROM_ARC_FACTOR * fontSize);

        ctx.textBaseline = "middle";
        ctx.fillStyle = ctx.strokeStyle;

        if (this.getShowName()) {
            if (toRight) {
            ctx.textAlign = "left";
            var x0 = a.x + clear;
            ctx.fillText(nameStr, x0, a.y);                         // NOMBRE
            var wName = ctx.measureText(nameStr).width;
            ctx.fillText(valueStr, x0 + wName + LABEL_GAP_PX, a.y); // VALOR
            } else {
        // ← escribir hacia la izquierda: NOMBRE primero, luego VALOR sin solape
        ctx.textAlign = "right";
        var xEnd = a.x - clear;
        var wVal = ctx.measureText(valueStr).width;

        ctx.fillText(nameStr, xEnd - LABEL_GAP_PX - wVal, a.y);
        ctx.fillText(valueStr, xEnd, a.y);
        }
        } else {
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


    
	
	this.paintObject = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(O.getX(), O.getY());
    ctx.lineTo(superObject.getXmax(), superObject.getYmax());
    ctx.stroke();
    ctx.moveTo(O.getX(), O.getY());
    ctx.beginPath();
    ctx.lineTo(O.getX() + R * Math.cos(-fromAngle), O.getY() + R * Math.sin(-fromAngle));
    ctx.lineWidth = ctx.lineWidth * 3;
    ctx.arc(O.getX(), O.getY(), R, -fromAngle, -toAngle, trigo);
    ctx.stroke();
    ctx.lineTo(O.getX(), O.getY());
    ctx.fill();
	
  };
    
  function computeLabelAnchor() {
        var phi = trigo ? -toAngle + AOC / 2 : Math.PI - toAngle + AOC / 2;
        phi = phi - Math.floor(phi / $U.doublePI) * $U.doublePI;

        var r = R + LABEL_OFFSET_PX;          // distancia fija al arco
        var x = O.getX() + Math.cos(phi) * r; // ancla básico
        var y = O.getY() + Math.sin(phi) * r;

        // si el ángulo es pequeño, aplica leve desplazamiento vertical
        var th = SMALL_ANGLE_DEG * Math.PI / 180;
        if (AOC < th) {
            // why: mover en el sentido vertical del bisector para despegar del rayo
            y += (Math.sin(phi) >= 0 ? -SMALL_ANGLE_Y_OFFSET : SMALL_ANGLE_Y_OFFSET);
        }
        return { x: x, y: y, phi: phi };
    }
	
	

    var paintTxt = function (ctx, txt) {
        ctx.save();
        var a = computeLabelAnchor();

        if (this && this.getFont) ctx.font = this.getFont();
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillStyle = ctx.strokeStyle;

        // ancla el borde izquierdo del NOMBRE al punto a distancia fija del arco
        ctx.fillText(txt + ":", a.x, a.y);
        ctx.restore();
        }.bind(this);
  //JDIAZ end
  
    //LLamar a la función painTxt para dibujar el nombre
    this.paintName = function(ctx) {
        
    };

    this.compute = function() {
        E1.compute();
        VALUE = AOC = E1.value();
        if (Cn.isDEG())
            AOC = AOC * Math.PI / 180;
        else
            VALUE = VALUE * 180 / Math.PI;
        if (!trigo)
            AOC = -AOC;
        AOC = AOC - Math.floor(AOC / $U.doublePI) * $U.doublePI; // AOC in [0,2π[
        var x = (A.getX() - O.getX()) * Math.cos(AOC) + (A.getY() - O.getY()) * Math.sin(AOC);
        var y = (O.getX() - A.getX()) * Math.sin(AOC) + (A.getY() - O.getY()) * Math.cos(AOC);
        this.setDXDY(0, 0, x, y);
        superObject.compute();
        C.setXY(O.getX() + x, O.getY() + y);
        fromAngle = $U.angleH(A.getX() - O.getX(), A.getY() - O.getY());
        toAngle = $U.angleH(C.getX() - O.getX(), C.getY() - O.getY());
		// MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    } else {
      Cn.getFrame().updateTextCons(this);
    }
    // MEAG end
    };

    this.getSource = function(src) {
        var _ex = "\"" + E1.getUnicodeSource().replace(/\n/g, "\\n") + "\"";
        src.geomWrite(false, this.getName(), "FixedAngle", _sr1.getName(), _ex, trigo);
    };

    this.mouseInside = function(ev) {
        sel_ray = $U.isNearToRay(O.getX(), O.getY(), C.getX(), C.getY(), this.mouseX(ev), this.mouseY(ev), this.getOversize());
        sel_arc = $U.isNearToArc(O.getX(), O.getY(), AOC, fromAngle, toAngle, trigo, R, this.mouseX(ev), this.mouseY(ev), this.getOversize());
        return sel_arc || sel_ray
    };


    this.setDefaults("fixedangle");
	// MEAG start
    this.getTextCons = function() {
        if (this.getParentLength()) {
        var _ex = E1.getUnicodeSource().replace(/\n/g, "\\n");
        texto = "";
        if(trigo){
        texto = this.getName() + $L.object_fixedAngle_description0+O.getVarName()+ $L.object_fixedAngle_description_measure + _ex + $L.object_fixedAngle_description1+_sr1.getVarName()+$L.tool_FixedAngle_help_2_sentidoA;}
        else {
            texto = this.getName() + $L.object_fixedAngle_description0+O.getVarName()+ $L.object_fixedAngle_description_measure + _ex + $L.object_fixedAngle_description1+_sr1.getVarName()+$L.tool_FixedAngle_help_2_sentidoB;}
        parents = [O.getVarName()];
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