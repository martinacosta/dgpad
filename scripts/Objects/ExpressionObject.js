function ExpressionObject(_construction, _name, _txt, _min, _max, _exp, _x, _y) {
  //    console.log("start create : "+_name);
  var parent = $U.extend(this, new ConstructionObject(_construction, _name)); // Herencia
  $U.extend(this, new MoveableObject(_construction));
  var me = this;
  me.Flag = false;
  var Cn = _construction;
  var X = (_x < 0) ? 0 : _x,
    Y = (_y < 0) ? 25 : _y,
    W = 0,
    H = 0;
  var arrow = String.fromCharCode(0x27fc); // Solo para engañar jscompress que convierte abusivamente...
  var OldX, OldY;
  var T = _txt;
  var E1 = new Expression(me, ""),
    min = null,
    max = null;
  var cLength = 200; // Longitud inicial de un cursor en pixeles
  var cOffsetY = 20; // Separación del cursor bajo la expresión
  var anchor = null; // PointObject al que está atada la expresión
  var cPT = new PointObject(Cn, me.getName() + ".cursor", 0, 0);

  this.blocks.setMode(["oncompute", "onchange", "oninit"], "oncompute");


  
  cPT.getCode = function() {
    return "expression_cursor";
  };
  cPT.getAssociatedTools = function() {
    return "@callproperty"
  };
  cPT.getSource = function() {};
  cPT.getStyle = function() {};
  cPT.compute = function() {};
  cPT.free = function() {
    return false;
  };
  cPT.getMacroMode = function() {
    return -1
  };
  cPT.setH = cPT.setHidden;
  cPT.setHidden = function(_sel) {
    me.setH(_sel);
    cPT.setH(_sel);
  };
  cPT.increment = 0;
  cPT.setIncrement = function(_i) {
    cPT.increment = _i;
    cPT.dragTo(cPT.getX(), cPT.getY());
  };
  cPT.getIncrement = function() {
    return cPT.increment;
  };
  cPT.startDrag = function(_x, _y) {};
  cPT.dragTo = function(_x, _y) {
    if (!isNaN(_x) && !isNaN(_y)) {
      if (_x < X)
        _x = X;
      if (_x > (X + cLength))
        _x = X + cLength;
      var val = min.value() + (max.value() - min.value()) * (_x - X) / cLength;

      if (cPT.increment) {
        var inc = 1 / cPT.increment;
        val = min.value() + Math.round((val - min.value()) * inc) / inc;
        while (val > max.value())
          val -= cPT.increment;
        _x = X + cLength * (val - min.value()) / (max.value() - min.value());
      }
      cPT.setXY(_x, Y + cOffsetY);
      E1.setValue(val);
      if ((Cn.is3D())) {
        Cn.computeAll();
      } else {
        this.computeChilds();
      }
    }
  };
  // var initCursorPos = function() {
  //   var cmin = min.value();
  //   var cmax = max.value();
  //   var ce = E1.value();
  //   if (ce < cmin)
  //     ce = cmin;
  //   if (ce > cmax)
  //     ce = cmax;
  //   cPT.setXY(X + cLength * (ce - cmin) / (cmax - cmin), Y + cOffsetY);
  // };

  var initCursorPos = function() {
  var cmin = min.value();
  var cmax = max.value();
  var ce = E1.value();

  if (ce < cmin) ce = cmin;
  if (ce > cmax) ce = cmax;

  E1.setValue(ce);

  if (cmax === cmin) {
    cPT.setXY(X, Y + cOffsetY);
  } else {
    cPT.setXY(X + cLength * (ce - cmin) / (cmax - cmin), Y + cOffsetY);
  }

  if (Cn.is3D()) {
    Cn.computeAll();
  } else {
    cPT.computeChilds();
  }
};

  cPT.setDefaults("expression_cursor");
  Cn.add(cPT);
  // Cuidado, dependencia circular! :
  
  me.setIncrement = function(_i) {
    cPT.setIncrement(_i);
  };
  me.getIncrement = function() {
    return cPT.getIncrement();
  };
  me.getcPTName = function() {
    return cPT.getName();
  };
  me.getcPT = function() {
    return cPT;
  };
  me.setH = me.setHidden;
  me.setHidden = function(_sel) {
    cPT.setH(_sel);
    me.setH(_sel);
  };
  me.setXY = function(x, y) {
    var oldX = X;
    X = x;
    Y = y;
    if (me.isCursor()) {
      if (isNaN(cPT.getX()) || isNaN(cPT.getX()))
        initCursorPos();
      else
        cPT.setXY(cPT.getX() + (X - oldX), Y + cOffsetY);
    }
  };
  me.getX = function() {
    return X;
  };
  me.getY = function() {
    return Y;
  };
  me.getW = function() {
    return W;
  };
  me.is3D = function() {
    return E1.is3DArray();
  };


  // ****************************************
  // **** Unicamente para las animaciones ****
  // ****************************************

  // var hashtab = [];

  // me.inithashtab = function(_speed) {
  //     hashtab = [true];
  //     var inc = 100 / _speed;
  //     for (var i = 1; i < 100; i++) {
  //         if (i > inc) {
  //             hashtab.push(true);
  //             inc += 100 / _speed;
  //         } else {
  //             hashtab.push(false);
  //         }
  //     }
  //     console.log(hashtab)
  // };


  me.isAnimationPossible = function() {
    return ((E1 != null) && (E1.isNum()));
  }

  me.getAnimationSpeedTab = function() {
    return [0, 1, 2, 3, 5, 10, 25, 50, 75, 90, 100];
  }

  me.getAnimationParams = function(x1, y1) {
    var x0 = X;
    var y0 = Y;

    var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    var fce = this.getAnimationSpeedTab();
    var f = Math.floor(d / (500 / fce.length));
    if (f >= fce.length) f = fce.length - 1;
    var mess = fce[f] + "%";
    var ang = $U.angleH(x1 - x0, y1 - y0);
    var dir = ((ang > Math.PI / 2) && (ang < 3 * Math.PI / 2)) ? 1 : -1;
    var aller_retour = false;

    if (this.isCursor()) {
      aller_retour = ((ang > Math.PI / 4) && (ang < 3 * Math.PI / 4)) || ((ang > 5 * Math.PI / 4) && (ang < 7 * Math.PI / 4));
    };
    return {
      message: aller_retour ? mess + " \u21C4" : mess,
      speed: fce[f],
      direction: dir,
      ar: aller_retour
    }
  }

  

  me.incrementAlpha = function(anim) {
    
    var v = anim.speed;
    var s = anim.direction;
    var ar = anim.ar;
    var d = new Date();
    anim.delay = d.getTime() - anim.timestamp;
    anim.timestamp = d.getTime();
    var inc = s * (v * anim.delay / 1000);
    
    if (me.isCursor()) {
      inc = inc * (max.value() - min.value()) / 50;

      if (cPT.increment) {
        anim.incsum += inc;
        var inc2 = cPT.increment;
        if (Math.abs(anim.incsum) < inc2) {
          return;
        };
        inc = s * inc2 * Math.floor(Math.abs(anim.incsum) / inc2);
        anim.incsum = 0;
      }
     
      var e1 = E1.value();
      e1 += inc;

      if (e1 < min.value()) {
        if (ar) {
          anim.direction *= -1;
          e1 = 2 * min.value() - e1;
        } else {
          e1 = max.value() + e1 - min.value();
        }
      }
      if (e1 > max.value()) {
        if (ar) {
          anim.direction *= -1;
          e1 = 2 * max.value() - e1;
        } else {
          e1 = min.value() + e1 - max.value();
        }
      }
      if (e1 < min.value()) e1 = min.value();
      if (e1 > max.value()) e1 = max.value();
      if (Math.abs(e1) < 1e-13) e1 = 0;

      



      initCursorPos();
      E1.setValue(e1);

      
    } else {
      var val = E1.value() + inc;
      if (Math.abs(val) < 1e-13) val = 0;
      E1.setValue(val);
    }
    
  };

  // ****************************************
  // ****************************************


  // Utilizado para anclar una expresión a un punto (anchor) :
  var Alpha = [30, -10];
  me.attachTo = function(_o) {
    if (anchor === null) {
      anchor = _o;
      this.addParent(anchor);
      this.setXY(anchor.getX() + Alpha[0], anchor.getY() + Alpha[1]);
      
    }
  };
  this.setAlpha = function(_a) {
    Alpha = _a;
  };
  this.getAlpha = function() {
    return Alpha;
  };
  this.computeAlpha = function() {
    if (anchor !== null) {
      Alpha[0] = X - anchor.getX();
      Alpha[1] = Y - anchor.getY();
    }
  };
  this.deleteAlpha = function() {
    if (anchor !== null) {
      var _x = 10 * Math.round((anchor.getX() + Alpha[0] + 20) / 10);
      var _y = 10 * Math.round((anchor.getY() + Alpha[1] - 20) / 10);
      this.setXY(_x, _y);
      anchor = null;
      Alpha = [30, -10];
      me.refresh();
    }
  };

  me.setDefaults("expression");

  this.isInstanceType = function(_c) {
    return (_c === "expression");
  };
  this.getCode = function() {
    return "expression";
  };
  this.getFamilyCode = function() {
    return "expression";
  };

  this.getAssociatedTools = function() {
    var s = "@callproperty,@calltrash,@objectmover,@anchor,@callcalc,@doceval,@calleditw,rot,homotecia";
    if (anchor)
      s = "@callproperty,@calltrash,@objectmover,@noanchor,@callcalc,@doceval,rot,homotecia";
    
    if ((E1 !== null) && (E1.isNum())) s += ",@spring";
    s += ",@blockly";
    return s;
  };


  this.getValue = function(x, y, z, t) {
    return E1.value(x, y, z, t);
  };



  me.compute = function() {

    if (E1)
      E1.compute();
    if (min)
      min.compute();
    if (max)
      max.compute();
    if (anchor) {
      this.setXY(anchor.getX() + Alpha[0], anchor.getY() + Alpha[1]);
    }
  };

  var agrandirCursor = false;

  var dragX, dragY;
  this.startDrag = function(_x, _y) {
    dragX = _x;
    dragY = _y;
    OldX = X;
    OldY = Y;
    
  };

  this.dragTo = function(_x, _y) {
    if (agrandirCursor) {
      var bar = (cPT.getX() - X) / cLength
      cLength = Math.max(20 * Math.round((_x - X) / 20), 30);
      var x = X + cLength * bar;
      cPT.setXY(x, cPT.getY());
    } else {
      
      this.setXY(OldX + Math.round((_x - dragX) / 10) * 10, OldY + Math.round((_y - dragY) / 10) * 10);
      
    }
    this.computeAlpha();
  };

  this.computeDrag = function() {};

  this.mouseInside = function(ev) {
    agrandirCursor = false;
    var mx = this.mouseX(ev),
      my = this.mouseY(ev);
    var inside = ((mx > X) && (mx < X + W) && (my < Y) && (my > Y - this.getFontSize()));
    if ((!inside) && (me.isCursor())) {
      var l = X + cLength - 20;
      var sz = me.getSize();
      inside = (mx > l) && (mx < X + cLength + 20) && (my > Y + cOffsetY - sz / 2 - 5) && (my < Y + cOffsetY + sz / 2 + 5);
      agrandirCursor = inside;
    }
    return inside;
  };

  var paintFunction = function(ctx) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";

    var val = this.getVarName() + "(" + E1.getVars() + ") = " + E1.get();
    W = ctx.measureText(val).width;
    ctx.fillText(val, X, Y);
  };

  var paintDxyztFunc = function(ctx) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";

    var val = E1.get() + " : " + E1.value().getVars() + " " + arrow + " " + E1.value().get();

    
    W = ctx.measureText(val).width;
    ctx.fillText(val, X, Y);
  };

  var paintDxyztDef = function(ctx) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";
    var val = this.getVarName() + "(" + E1.getVars() + ") = " + E1.get() + " = " + E1.getDxyzt();
    
    W = ctx.measureText(val).width;
    ctx.fillText(val, X, Y);
  };

  var parseText = function(_s) {
    if (typeof _s === "string") {
      var prec = me.getPrecision();
      _s = _s.replace(/(\d+(.\d+)?)/g, function(m, v) {
        return ($L.number(Math.round(parseFloat(v) * prec) / prec))
      });
    }
    return _s;
  };

  
  var paintText = function(ctx) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";

    var raw = E1.value();
    var prec = me.getPrecision();

    // 1) convierte a string seguro (array/num/string)
    var txt;
    if (Object.is(raw, NaN)) {
      txt = "NaN";
    } else if (typeof raw === "string") {
      txt = raw; // editable por usuario
    } else {
      txt = parseArray(raw, prec); // tu helper para arrays/números
    }

    // 2) aplica parseText para respetar comillas, etc.
    var val = parseText(txt);

    // 3) pinta con nombre
    var label = me.getName() + "=" + val;

    W = ctx.measureText(label).width;
    ctx.fillText(label, X, Y);
  };
  



    //  var isArray = function(_a) {
    //      return (Object.prototype.toString.call(_a) === '[object Array]');
    //  };
  
  
    //  var parseArray = function(tab, prec) {
    //      if (isArray(tab)) {
    //          var elts = [];
    //          for (var i = 0, len = tab.length; i < len; i++) {
    //              elts.push(parseArray(tab[i], prec));
    //          }
    //          return "[" + elts.join($L.comma) + "]";
    //      } else {
    //          if (isNaN(tab))
    //              return "???";
    //          else
    //              return ($L.number(Math.round(tab * prec) / prec));
    //      }
    //  };
    // var parseArray = function(tab, prec) {
    //   if (isArray(tab)) {
    //     var elts = [];
    //     for (var i = 0; i < tab.length; i++) elts.push(parseArray(tab[i], prec));
    //     return "[" + elts.join($L.comma) + "]";
    //   }

    //   if (typeof tab === "string") {
    //     return '"' + tab.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    //   }

    //   if (typeof tab === "number") {
    //     if (isNaN(tab)) return "NaN";
    //     return $L.number(Math.round(tab * prec) / prec);
    //   }

    //   if (tab == null) return "null";
    //   return String(tab);
    // };

    var isListLike = function(v) {
  if (v == null) return false;
  if (typeof v === "string") return false;
  if (typeof v === "function") return false;

  // Array real:
  if (Object.prototype.toString.call(v) === "[object Array]") return true;

  // Array-like (listas internas DGPad suelen caer aquí):
  return (typeof v.length === "number") && (v.length >= 0) && (Math.floor(v.length) === v.length);
};

var parseArray = function(tab, prec) {
  if (isListLike(tab)) {
    var elts = [];
    for (var i = 0; i < tab.length; i++) {
      elts.push(parseArray(tab[i], prec));
    }
    return "[" + elts.join($L.comma) + "]";
  }

  if (typeof tab === "string") {
    return '"' + tab.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }

  if (typeof tab === "number") {
    if (isNaN(tab)) return "NaN";
    return $L.number(Math.round(tab * prec) / prec);
  }

  if (tab == null) return "null";
  return String(tab);
};

  

  var paintNum = function(ctx) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";

    var prec = me.getPrecision();
    var t = (T === "") ? me.getName() + " = " : T;
    var v = E1.value();

    var val;
    if (prec > -1) {
      // ✅ Si es lista (array o array-like), usa nuestro serializer que soporta strings
      if (isListLike(v)) {
        val = t + parseArray(v, prec);
      } else {
        // ✅ Si no es lista, conserva el comportamiento original
        val = t + $U.parseList(v, prec);
      }
    } else {
      val = t;
    }

    W = ctx.measureText(val).width;
    ctx.fillText(val, X, Y);
  };

  var drawRoundRect = function(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  var drawSemiRoundRect = function(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };


  var paintCursor = function(ctx) {
    paintNum(ctx);
    var y = Y + cOffsetY;
    var s = me.getSize();
    ctx.lineWidth = me.prefs.size.pointborder;
    drawSemiRoundRect(ctx, X, y - s / 2, cPT.getX() - X, s, s / 2);
    ctx.fill();
    drawRoundRect(ctx, X, y - s / 2, cLength, s, s / 2);
    ctx.stroke();
    cPT.paint(ctx);
  };

  this.paintObject = function(ctx) {};

  this.getSource = function(src) {
    var _ex = E1.getUnicodeSource().replace(/\n/g, "\\n");
    if (anchor) {
      var mn = (min === null) ? "\"\"" : "\"" + min.getSource() + "\"";
      var t = "\"" + $U.native2ascii(T) + "\"";
      var mx = (max === null) ? "\"\"" : "\"" + max.getSource() + "\"";
      var ex = "\"" + _ex + "\"";
      src.geomWrite(false, this.getName(), "ExpressionOn", t, mn, mx, ex, anchor.getVarName(), Alpha);
    } else {
      var mn = (min === null) ? "" : min.getSource();
      var mx = (max === null) ? "" : max.getSource();
      var x = Cn.coordsSystem.x(X);
      var y = Cn.coordsSystem.y(Y);
      src.geomWrite(true, this.getName(), "Expression", $U.native2ascii(T), mn, mx, _ex, x, y);
    }

  };

  this.setCursorLength = function(_cl) {
    var bar = (cPT.getX() - X) / cLength
    cLength = _cl;
    var x = X + cLength * bar;
    cPT.setXY(x, cPT.getY());
  };

  this.getStyle = function(src) {
    var s = me.getStyleString();
    if (this.getPrecision() === -1)
      s += ";p:-1";
    s += ";cL:" + cLength;
    s += ";cPT:" + $U.base64_encode(cPT.getStyleString());

    src.styleWrite(true, me.getName(), "STL", s);
  };

  me.isCursor = function() {
    return ((E1 !== null) && (min !== null) && (max !== null) &&
      ((E1.isEmpty()) || (E1.isNum())) && (min.isNum()) && (max.isNum()));
  };



  this.objToDelete = function() {
    if (me.isCursor())
      return cPT;
    else
      return this;
  };





  var setMethods = function() {
    
    me.dx = E1.dx;
    me.dy = E1.dy;
    me.dz = E1.dz;
    me.dt = E1.dt;

    


    if (E1.isText()) {
      me.paintObject = paintText;
      
      cPT.setXY(NaN, NaN);
    } else if (E1.isDxyztFunc()) {
      
      me.paintObject = paintDxyztFunc;
      cPT.setXY(NaN, NaN);
    } else if (E1.isDxyztDef()) {
      
      E1.setDxyzt();
      me.paintObject = paintDxyztDef;
      cPT.setXY(NaN, NaN);
    } else if (E1.isFunc()) {
      me.paintObject = paintFunction;
      cPT.setXY(NaN, NaN);
    } else if (me.isCursor()) {
      me.setParent(cPT);
      me.paintObject = paintCursor;
      if (E1.isEmpty()) {
        cPT.setXY(X + cLength / 2, Y + cOffsetY);
      } else {
        initCursorPos();
      }
    } else {
      me.paintObject = paintNum;
      cPT.setXY(NaN, NaN);
    }
  };

  // Para Blockly :
  parent.setExpression = this.setExpression = function(exy) {
    me.setExp(exy);
  }
  parent.getExpression = this.getExpression = function() {
    return me.getExp();
  }


  // setExp para los widgets y para blockly :
  me.setExp = me.setE1 = function(_t) {
    
    if (E1.getSource() !== _t) {
      E1 = Expression.delete(E1);
      E1 = new Expression(me, _t);
      setMethods();
    }
    
  };
  me.getExp = function() {
    return me.getE1().getSource();
  };
  me.getE1 = function() {
    return E1;
  };

  me.setT = function(_t) {
    T = _t;
  };
  me.getText = function() {
    return T;
  };
  // me.setMin = function(_t) {
  //   min = Expression.delete(min);
  //   min = new Expression(me, _t);
  //   setMethods();
  // };
  me.setMin = function(_t) {
    min = Expression.delete(min);
    min = new Expression(me, _t);
    setMethods();

    if (me.isCursor()) {
      initCursorPos();
    }
  };
  me.getMinSource = function() {
    if (min)
      return min.getSource();
    return "";
  };
  // me.setMax = function(_t) {
  //   max = Expression.delete(max);
  //   max = new Expression(me, _t);
  //   setMethods();
  // };
  me.setMax = function(_t) {
    max = Expression.delete(max);
    max = new Expression(me, _t);
    setMethods();

    if (me.isCursor()) {
      initCursorPos();
    }
  };
  me.getMaxSource = function() {
    if (max)
      return max.getSource();
    return "";
  };

  // Reconstruye la lista de parents :
  me.refreshNames = function() {
    if (E1)
      E1.refreshNames();
    if (min)
      min.refreshNames();
    if (max)
      max.refreshNames();
  };


  // Reconstruye la lista de parents :
  me.refresh = function() {
    
    me.setParentList((me.isCursor()) ? [cPT] : []);
    if (E1)
      E1.refresh();
    if (min)
      min.refresh();
    if (max)
      max.refresh();
    if (anchor !== null) me.addParent(anchor);
    
  };


  if (_exp !== "")
    me.setE1(_exp);
  if (_min !== "")
    me.setMin(_min);
  if (_max !== "")
    me.setMax(_max);

  // MEAG start
  this.getTextCons = function() {
    return "";
  }

  cPT.getTextCons = function() {
    return "";
  }
  // MEAG end

}
