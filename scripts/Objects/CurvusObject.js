// function CurvusObject(_construction, _name, _a, _b, _f1) {
//   $U.extend(this, new ConstructionObject(_construction, _name)); // Herencia
//   var me = this;
//   var Cn = _construction;
//   //    var min = new Expression(this, _a), max = new Expression(this, _b);
//   var MIN = 0,
//     MAX = 0,
//     STEP = 0;
//   var E1 = null,
//     min = null,
//     max = null;
//   var CX = 0; // rrepresenta la aabscisa (pixel) del origen del sistema
//   var CZ = 1; // representa el valor del zoom

//   var NB = 1000; // numero de latos del polígono (modificado cada compute para las cartesianas)


//   // Tabla de objetos de 3 propiedades: x para abscisa
//   // y para ordenada, d para discontinuidad identificada
//   var Ptab = [];
//   for (var i = 0; i < 10000; i++) {
//     Ptab.push({
//       x: 0,
//       y: 0,
//       d: false
//     });
//   }


//   this.setDefaults("function");

//   this.isInstanceType = function(_c) {
//     return (_c === "function");
//   };
//   this.getCode = function() {
//     return "function";
//   };
//   this.getFamilyCode = function() {
//     return "function";
//   };

//   this.getAssociatedTools = function() {
//     return "point,@callproperty,@calltrash,@callcalc";
//   };


//   this.mouseInside = function(ev) {
//     var mx = this.mouseX(ev),
//       my = this.mouseY(ev);
//     for (var i = 0; i < NB; i++) {
//       if ($U.isNearToPoint(Ptab[i].x, Ptab[i].y, mx, my, this.getOversize()))
//         return true;
//     }
//     return false;
//   };


//   //  // ****************************************
//   // // **** Uniquement pour les animations ****
//   // // ****************************************


//   // this.getAlphaBounds = function(anim) {
//   //     var inc = 5 * Math.round(anim.direction * (anim.speed * anim.delay / 1000));
//   //     return [0, Ptab.length - 1, inc]
//   // };

//   // this.getAnimationSpeedTab = function() {
//   //     return [0, 20, 25, 50, 100, 200, 400, 500, 750, 1000];
//   // };

//   // this.getAnimationParams = function(x0, y0, x1, y1) {
//   //     var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
//   //     var fce = this.getAnimationSpeedTab();
//   //     var f = Math.floor(d / (300 / fce.length));
//   //     if (f >= fce.length) f = fce.length - 1;

//   //     var xAB = (Ptab[0].x - x0),
//   //         yAB = (Ptab[0].y - y0);
//   //     var d2 = xAB * xAB + yAB * yAB,
//   //         d1 = 0;
//   //     var k = 0;
//   //     for (var i = 1; i < NB; i++) {
//   //         xAB = (Ptab[i].x - x0);
//   //         yAB = (Ptab[i].y - y0);
//   //         d1 = xAB * xAB + yAB * yAB;
//   //         if ((d1 < d2) || isNaN(d2)) {
//   //             k = i;
//   //             d2 = d1;
//   //         }
//   //     }
//   //     var xp = Ptab[k - 1].x;
//   //     var yp = Ptab[k - 1].y;
//   //     var ps = (xp - x0) * (x1 - x0) + (yp - y0) * (y1 - y0);
//   //     var dir = (ps > 0) ? 1 : -1;
//   //     var dop = Math.sqrt((xp - x0) * (xp - x0) + (yp - y0) * (yp - y0));
//   //     var dom = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
//   //     var cs = ps / (dop * dom);
//   //     var aller_retour = (Math.abs(cs) < 0.707);
//   //     var pcent = Math.round(100 * fce[f] / fce[fce.length - 1])+"%";

//   //     return {
//   //         message: aller_retour ? pcent + " \u21C4" : pcent + "",
//   //         speed: fce[f],
//   //         direction: dir,
//   //         ar: aller_retour
//   //     }
//   // }

//   // // ****************************************
//   // // ****************************************


//   this.projectXY = function(_x, _y) {
//     var xAB = (Ptab[0].x - _x),
//       yAB = (Ptab[0].y - _y);
//     var d2 = xAB * xAB + yAB * yAB,
//       d1 = 0;
//     var k = 0;
//     for (var i = 1; i < NB; i++) {
//       xAB = (Ptab[i].x - _x);
//       yAB = (Ptab[i].y - _y);
//       d1 = xAB * xAB + yAB * yAB;
//       if ((isNaN(d2)) || (d1 < d2)) {
//         k = i;
//         d2 = d1;
//       }
//     }
//     return [Ptab[k].x, Ptab[k].y];
//   };

//   this.project = function(p) {
//     //        console.log("this.project");
//     var coords = this.projectXY(p.getX(), p.getY());
//     p.setXY(coords[0], coords[1]);
//   };

//   this.projectAlpha = function(p) {
//     var k = (me.compute === computeCartesian) ? Math.round(Cn.coordsSystem.px(p.getAlpha())) : p.getAlpha();
//     if ((k >= 0) && (k < NB))
//       p.setXY(Ptab[k].x, Ptab[k].y);
//     else
//       p.setXY(k, Cn.coordsSystem.py(E1.value(p.getAlpha())));
//   };

//   this.setAlpha = function(p) {
//     var xAB = 0,
//       yAB = 0;
//     for (var i = 0; i < NB; i++) {
//       xAB = (Ptab[i].x - p.getX()), yAB = (Ptab[i].y - p.getY());
//       if ((xAB === 0) && (yAB === 0)) {
//         //                console.log("CX=" + CX + "  i=" + i + "  p.setAlpha(" + (i - CX) + ")");
//         //                console.log("Cn.coordsSystem.x(i/2)=" + (Cn.coordsSystem.x(i / 2)));
//         if (me.compute === computeCartesian)
//           p.setAlpha(Cn.coordsSystem.x(i));
//         else
//           p.setAlpha(i);
//         return;
//       }
//     }
//   };

//   var computeMinMaxStepCartesian = function() {
//     var mn = min ? min.value() : NaN;
//     var mx = max ? max.value() : NaN;
//     var x0 = Cn.coordsSystem.x(0);
//     var x1 = Cn.coordsSystem.x(Cn.getBounds().width);
//     MIN = (isNaN(mn)) ? x0 : Math.max(mn, x0);
//     MAX = (isNaN(mx)) ? x1 : Math.min(mx, x1);
//     NB = Cn.coordsSystem.lx(MAX - MIN);
//     STEP = (MAX - MIN) / NB;
//   };


//   var computeCartesian = function() {
//     if (E1)
//       E1.compute();
//     if (min)
//       min.compute();
//     if (max)
//       max.compute();
//     computeMinMaxStepCartesian();
//     var k = MIN;
//     for (var i = 0; i < NB; i++) {
//       Ptab[i].x = Cn.coordsSystem.px(k);
//       Ptab[i].y = Cn.coordsSystem.py(E1.value(k));
//       // Petit problème d'affichage sur certains navigateur lorsque
//       // l'ordonnée (en pixel) est trop grande :
//       if (Math.abs(Ptab[i].y) > 20000000)
//         Ptab[i].y = NaN;

//       k += STEP;
//     }
//   };


//   // En chantier ci-dessous : étude naïve de la discontinuité :
//   //    var computeCartesian = function() {
//   //        if (E1) E1.compute();
//   //        if (min) min.compute();
//   //        if (max) max.compute();
//   //        computeMinMaxStepCartesian();
//   //        var k = MIN;
//   //        var y0 = NaN;
//   //        var y1 = NaN;
//   //        var y2 = NaN;
//   //        for (var i = 0; i < NB; i++) {
//   //            y2 = E1.value(k);
//   //            Ptab[i].x = Cn.coordsSystem.px(k);
//   //            Ptab[i].y = Cn.coordsSystem.py(y2);
//   //            Ptab[i].d = false;
//   //            if (isNaN(y0)) {
//   //                y0 = y2;
//   //            } else if (isNaN(y1)) {
//   //                y1 = y2;
//   //            } else if (Math.abs((y0 + y2) / 2 - y1) > 1e-1) {
//   //                // Discontinuité repérée :
//   //                Ptab[i].d = true;
//   //                y0 = NaN;
//   //                y1 = NaN;
//   //            } else {
//   //                y0 = y1;
//   //                y1 = y2;
//   //            }
//   //            k += STEP;
//   //        }
//   //    };

//   var computeMinMaxStepParam = function() {
//     var mn = min ? min.value() : NaN;
//     var mx = max ? max.value() : NaN;
//     MIN = (isNaN(mn)) ? 0 : mn;
//     MAX = (isNaN(mx)) ? 1 : mx;
//     STEP = (MAX - MIN) / NB;
//   };

//   var computeParametric = function() {
//     if (E1)
//       E1.compute();
//     if (min)
//       min.compute();
//     if (max)
//       max.compute();
//     computeMinMaxStepParam();
//     var k = MIN;
//     for (var i = 0; i < NB; i++) {
//       var t = E1.value(k);
//       Ptab[i].x = Cn.coordsSystem.px(t[0]);
//       Ptab[i].y = Cn.coordsSystem.py(t[1]);
//       k += STEP;
//     }
//   };

//   me.compute = null;

//   this.paintObject = function(ctx) {
//     ctx.beginPath();
//     ctx.moveTo(Ptab[0].x, Ptab[0].y);
//     for (var i = 1; i < NB; i++) {
//       ctx.lineTo(Ptab[i].x, Ptab[i].y);
//       //            if (Ptab[i].d) ctx.moveTo(Ptab[i].x, Ptab[i].y);
//       //            else ctx.lineTo(Ptab[i].x, Ptab[i].y);
//     }
//     ctx.stroke();
//     if ((me.compute === computeCartesian) && (max) && (min)) {
//       ctx.lineTo(Cn.coordsSystem.px(max.value()), Cn.coordsSystem.py(0));
//       ctx.lineTo(Cn.coordsSystem.px(min.value()), Cn.coordsSystem.py(0));
//     }
//     ctx.fill();

//   };

//   this.getSource = function(src) {
//     var e1 = (E1 === null) ? "" : E1.getSource();
//     var mn = (min === null) ? "" : min.getSource();
//     var mx = (max === null) ? "" : max.getSource();
//     src.geomWrite(true, this.getName(), "Curvus", mn, mx, e1);
//   };

//   me.setE1 = function(_f) {
//     E1 = Expression.delete(E1);
//     E1 = new Expression(me, _f);
//     me.dx = E1.dx;
//     me.dy = E1.dy;
//     me.dz = E1.dz;
//     me.dt = E1.dt;
//     if (E1.isArray()) {
//       me.compute = computeParametric;
//     } else {
//       me.compute = computeCartesian;
//     }
//   };
//   me.getE1 = function() {
//     return E1;
//   };
//   me.setMin = function(_t) {
//     min = Expression.delete(min);
//     min = new Expression(me, _t);
//     me.compute();
//   };
//   me.getMinSource = function() {
//     if (min)
//       return min.getSource();
//     return "";
//   };
//   me.setMax = function(_t) {
//     max = Expression.delete(max);
//     max = new Expression(me, _t);
//     me.compute();
//   };
//   me.getMaxSource = function() {
//     if (max)
//       return max.getSource();
//     return "";
//   };

//   me.getValue = function(x) {
//     return E1.value(x);
//   };

//   me.refreshNames = function() {
//     if (E1)
//       E1.refreshNames();
//     if (min)
//       min.refreshNames();
//     if (max)
//       max.refreshNames();
//   };

//   if (_f1 !== "")
//     me.setE1(_f1);
//   if (_a !== "")
//     me.setMin(_a);
//   if (_b !== "")
//     me.setMax(_b);

//   // MEAG start
//   this.getTextCons = function() {
//     return "";
//   }
//   // MEAG end

// }

function CurvusObject(_construction, _name, _a, _b, _f1) {
  $U.extend(this, new ConstructionObject(_construction, _name)); // Herencia
  var me = this;
  var Cn = _construction;
  //    var min = new Expression(this, _a), max = new Expression(this, _b);
  var MIN = 0,
    MAX = 0,
    STEP = 0;
  var E1 = null,
    min = null,
    max = null;
  var CX = 0; // rrepresenta la aabscisa (pixel) del origen del sistema
  var CZ = 1; // representa el valor del zoom

  var NB = 1000; // numero de latos del polígono (modificado cada compute para las cartesianas)


  // Tabla de objetos de 3 propiedades: x para abscisa
  // y para ordenada, d para discontinuidad identificada
  var Ptab = [];
  for (var i = 0; i < 10000; i++) {
    Ptab.push({
      x: 0,
      y: 0,
      d: false
    });
  }


  this.setDefaults("function");

  this.isInstanceType = function(_c) {
    return (_c === "function");
  };
  this.getCode = function() {
    return "function";
  };
  this.getFamilyCode = function() {
    return "function";
  };

  this.getAssociatedTools = function() {
    // añadido @callintersections para exponer acción en UI si aplica
    return "point,circle_int,@callproperty,@calltrash,@callcalc";
  };


  this.mouseInside = function(ev) {
    var mx = this.mouseX(ev),
      my = this.mouseY(ev);
    for (var i = 0; i < NB; i++) {
      if ($U.isNearToPoint(Ptab[i].x, Ptab[i].y, mx, my, this.getOversize()))
        return true;
    }
    return false;
  };


  


  this.projectXY = function(_x, _y) {
    var xAB = (Ptab[0].x - _x),
      yAB = (Ptab[0].y - _y);
    var d2 = xAB * xAB + yAB * yAB,
      d1 = 0;
    var k = 0;
    for (var i = 1; i < NB; i++) {
      xAB = (Ptab[i].x - _x);
      yAB = (Ptab[i].y - _y);
      d1 = xAB * xAB + yAB * yAB;
      if ((isNaN(d2)) || (d1 < d2)) {
        k = i;
        d2 = d1;
      }
    }
    return [Ptab[k].x, Ptab[k].y];
  };

  this.project = function(p) {
    //        console.log("this.project");
    var coords = this.projectXY(p.getX(), p.getY());
    p.setXY(coords[0], coords[1]);
  };

  this.projectAlpha = function(p) {
    var k = (me.compute === computeCartesian) ? Math.round(Cn.coordsSystem.px(p.getAlpha())) : p.getAlpha();
    if ((k >= 0) && (k < NB))
      p.setXY(Ptab[k].x, Ptab[k].y);
    else
      p.setXY(k, Cn.coordsSystem.py(E1.value(p.getAlpha())));
  };

  this.setAlpha = function(p) {
    var xAB = 0,
      yAB = 0;
    for (var i = 0; i < NB; i++) {
      xAB = (Ptab[i].x - p.getX()), yAB = (Ptab[i].y - p.getY());
      if ((xAB === 0) && (yAB === 0)) {
        //                console.log("CX=" + CX + "  i=" + i + "  p.setAlpha(" + (i - CX) + ")");
        //                console.log("Cn.coordsSystem.x(i/2)=" + (Cn.coordsSystem.x(i / 2)));
        if (me.compute === computeCartesian)
          p.setAlpha(Cn.coordsSystem.x(i));
        else
          p.setAlpha(i);
        return;
      }
    }
  };

  var computeMinMaxStepCartesian = function() {
    var mn = min ? min.value() : NaN;
    var mx = max ? max.value() : NaN;
    var x0 = Cn.coordsSystem.x(0);
    var x1 = Cn.coordsSystem.x(Cn.getBounds().width);
    MIN = (isNaN(mn)) ? x0 : Math.max(mn, x0);
    MAX = (isNaN(mx)) ? x1 : Math.min(mx, x1);
    NB = Cn.coordsSystem.lx(MAX - MIN);
    STEP = (MAX - MIN) / NB;
  };


  var computeCartesian = function() {
    if (E1)
      E1.compute();
    if (min)
      min.compute();
    if (max)
      max.compute();
    computeMinMaxStepCartesian();
    var k = MIN;
    for (var i = 0; i < NB; i++) {
      Ptab[i].x = Cn.coordsSystem.px(k);
      Ptab[i].y = Cn.coordsSystem.py(E1.value(k));
      // Petit problème d'affichage sur certains navigateur lorsque
      // l'ordonnée (en pixel) est trop grande :
      if (Math.abs(Ptab[i].y) > 20000000)
        Ptab[i].y = NaN;

      k += STEP;
    }
  };


  

  var computeMinMaxStepParam = function() {
    var mn = min ? min.value() : NaN;
    var mx = max ? max.value() : NaN;
    MIN = (isNaN(mn)) ? 0 : mn;
    MAX = (isNaN(mx)) ? 1 : mx;
    STEP = (MAX - MIN) / NB;
  };

  var computeParametric = function() {
    if (E1)
      E1.compute();
    if (min)
      min.compute();
    if (max)
      max.compute();
    computeMinMaxStepParam();
    var k = MIN;
    for (var i = 0; i < NB; i++) {
      var t = E1.value(k);
      Ptab[i].x = Cn.coordsSystem.px(t[0]);
      Ptab[i].y = Cn.coordsSystem.py(t[1]);
      k += STEP;
    }
  };

  me.compute = null;

  this.paintObject = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(Ptab[0].x, Ptab[0].y);
    for (var i = 1; i < NB; i++) {
      ctx.lineTo(Ptab[i].x, Ptab[i].y);
      //            if (Ptab[i].d) ctx.moveTo(Ptab[i].x, Ptab[i].y);
      //            else ctx.lineTo(Ptab[i].x, Ptab[i].y);
    }
    ctx.stroke();
    if ((me.compute === computeCartesian) && (max) && (min)) {
      ctx.lineTo(Cn.coordsSystem.px(max.value()), Cn.coordsSystem.py(0));
      ctx.lineTo(Cn.coordsSystem.px(min.value()), Cn.coordsSystem.py(0));
    }
    ctx.fill();

  };

  this.getSource = function(src) {
    var e1 = (E1 === null) ? "" : E1.getSource();
    var mn = (min === null) ? "" : min.getSource();
    var mx = (max === null) ? "" : max.getSource();
    src.geomWrite(true, this.getName(), "Curvus", mn, mx, e1);
  };

  me.setE1 = function(_f) {
    E1 = Expression.delete(E1);
    E1 = new Expression(me, _f);
    me.dx = E1.dx;
    me.dy = E1.dy;
    me.dz = E1.dz;
    me.dt = E1.dt;
    if (E1.isArray()) {
      me.compute = computeParametric;
    } else {
      me.compute = computeCartesian;
    }
  };
  me.getE1 = function() {
    return E1;
  };
  me.setMin = function(_t) {
    min = Expression.delete(min);
    min = new Expression(me, _t);
    me.compute();
  };
  me.getMinSource = function() {
    if (min)
      return min.getSource();
    return "";
  };
  me.setMax = function(_t) {
    max = Expression.delete(max);
    max = new Expression(me, _t);
    me.compute();
  };
  me.getMaxSource = function() {
    if (max)
      return max.getSource();
    return "";
  };

  me.getValue = function(x) {
    return E1.value(x);
  };

  me.refreshNames = function() {
    if (E1)
      E1.refreshNames();
    if (min)
      min.refreshNames();
    if (max)
      max.refreshNames();
  };

  if (_f1 !== "")
    me.setE1(_f1);
  if (_a !== "")
    me.setMin(_a);
  if (_b !== "")
    me.setMax(_b);

  // ==========================
  // === Intersections API ====
  // ==========================
  // Métodos orientados a: rectas DGPad y otras CurvusObject cartesianas.
  // Trabaja en píxeles para coincidir con el render y convertir a coords del mundo al final.

  // Devuelve una copia superficial de la polilínea actual [0..NB)
  this.getPolyline = function() {
    var out = [];
    for (var k = 0; k < NB; k++) out.push({ x: Ptab[k].x, y: Ptab[k].y });
    return out;
  };

  // Cálculo robusto de intersección de segmentos, con parámetros t/u
  var _segIntersect = function(ax, ay, bx, by, cx, cy, dx, dy) {
    var bax = bx - ax, bay = by - ay;
    var dcx = dx - cx, dcy = dy - cy;
    var acx = ax - cx, acy = ay - cy;
    var den = bax * dcy - bay * dcx;
    if (den === 0) return null; // paralelos o colineales (ignoramos colineales)
    var t = (dcx * acy - dcy * acx) / den;
    var u = (bax * acy - bay * acx) / den;
    if (t < 0 || t > 1 || u < 0 || u > 1) return null;
    var x = ax + t * bax;
    var y = ay + t * bay;
    if (isNaN(x) || isNaN(y)) return null;
    return { x: x, y: y, t: t, u: u };
  };

  // Elimina duplicados cercanos (en píxeles)
  var _dedupPix = function(arr, eps) {
    if (!arr || arr.length === 0) return [];
    var res = [];
    for (var i = 0; i < arr.length; i++) {
      var p = arr[i], keep = true;
      for (var j = 0; j < res.length; j++) {
        var q = res[j];
        var dx = p.px - q.px, dy = p.py - q.py;
        if (dx * dx + dy * dy < eps * eps) { keep = false; break; }
      }
      if (keep) res.push(p);
    }
    return res;
  };

  // Obtiene un segmento "largo" de la recta en coordenadas de pantalla
  var _getLineScreenSegment = function(line) {
    // se intentan varias convenciones comunes de DGPad
    var P1 = line && (line.P1 || (line.getP1 && line.getP1()) || (line.A) || (line.getA && line.getA()));
    var P2 = line && (line.P2 || (line.getP2 && line.getP2()) || (line.B) || (line.getB && line.getB()));
    if (!P1 || !P2 || !P1.getX || !P2.getX) return null;
    var x1 = P1.getX(), y1 = P1.getY();
    var x2 = P2.getX(), y2 = P2.getY();
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;
    dx /= len; dy /= len;
    var b = Cn.getBounds();
    var M = Math.max(b.width, b.height) * 4; // margen grande para cubrir pantalla
    return [ { x: x1 - dx * M, y: y1 - dy * M }, { x: x1 + dx * M, y: y1 + dy * M } ];
  };

  // Intersecciones con recta
  this.findIntersectionsWithLine = function(line) {
    var seg = _getLineScreenSegment(line);
    if (!seg) return [];
    var a = seg[0], b = seg[1];
    var out = [];
    for (var i = 0; i < NB - 1; i++) {
      var p0 = Ptab[i], p1 = Ptab[i + 1];
      var it = _segIntersect(p0.x, p0.y, p1.x, p1.y, a.x, a.y, b.x, b.y);
      if (it) {
        out.push({ px: it.x, py: it.y, X: Cn.coordsSystem.x(it.x), Y: Cn.coordsSystem.y(it.y) });
      }
    }
    return _dedupPix(out, 2.0);
  };

  // Intersecciones con otra CurvusObject cartesiana (O(N)) usando barrido en x
  this.findIntersectionsWithFunction = function(other) {
    if (!other || typeof other.getPolyline !== 'function') return [];
    // aseguramos que ambas estén actualizadas
    if (typeof me.compute === 'function') me.compute();
    if (typeof other.compute === 'function') other.compute();

    var Q = other.getPolyline();
    var out = [];

    // índices de barrido suponiendo x creciente para funciones cartesianas
    var i = 0, j = 0;
    var n1 = NB - 1, n2 = Q.length - 1;
    // avanzar hasta tener segmentos válidos (no NaN)
    var _valid = function(p) { return !(isNaN(p.x) || isNaN(p.y)); };

    while (i < n1 && j < n2) {
      var p0 = Ptab[i], p1 = Ptab[i + 1];
      var q0 = Q[j], q1 = Q[j + 1];
      if (!_valid(p0) || !_valid(p1)) { i++; continue; }
      if (!_valid(q0) || !_valid(q1)) { j++; continue; }

      var pminx = Math.min(p0.x, p1.x), pmaxx = Math.max(p0.x, p1.x);
      var qminx = Math.min(q0.x, q1.x), qmaxx = Math.max(q0.x, q1.x);

      // si no hay solape en x, avanza el segmento que termina antes
      if (pmaxx < qminx) { i++; continue; }
      if (qmaxx < pminx) { j++; continue; }

      // probar intersección
      var it = _segIntersect(p0.x, p0.y, p1.x, p1.y, q0.x, q0.y, q1.x, q1.y);
      if (it) {
        out.push({ px: it.x, py: it.y, X: Cn.coordsSystem.x(it.x), Y: Cn.coordsSystem.y(it.y) });
      }

      // avanza según el extremo derecho en x
      if (pmaxx <= qmaxx) i++; else j++;
    }

    return _dedupPix(out, 2.0);
  };

  // Crea puntos de intersección en la construcción si es posible; devuelve lista de puntos/coords
  this.buildIntersections = function(target, options) {
    options = options || {};
    var pts = [];

    // decidir tipo
    var isFunc = target && (target === me ? false : (typeof target.isInstanceType === 'function' && target.isInstanceType('function')));

    if (isFunc) pts = me.findIntersectionsWithFunction(target);
    else pts = me.findIntersectionsWithLine(target);

    // Si no hay soporte para crear puntos, devolver sólo coordenadas
    if (options.onlyCoords === true) return pts;

    // creación best-effort
    var created = [];
    var canCreate = (typeof PointObject === 'function');
    var addFn = Cn.add || Cn.addObject || null; // tolera dos APIs comunes

    for (var k = 0; k < pts.length; k++) {
      var P = null;
      if (canCreate) {
        try {
          var nm = (Cn.getUnusedName) ? Cn.getUnusedName("I") : ("I" + (k + 1));
          // Nota: PointObject suele esperar coords en sistema del mundo
          P = new PointObject(Cn, nm, pts[k].X, pts[k].Y);
          if (typeof P.setPinned === 'function' && options.pin === true) P.setPinned(true);
          if (addFn) addFn.call(Cn, P);
        } catch (e) {
          // si falla, no interrumpir; el consumidor aún recibe coords
          P = null;
        }
      }
      created.push(P || pts[k]);
    }
    return created;
  };

  // MEAG start
  this.getTextCons = function() {
    return "";
  }
  // MEAG end

}

