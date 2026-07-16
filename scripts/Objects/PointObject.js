//************************************************
//*************** POINT OBJECT *******************
//************************************************
function PointObject(_construction, _name, _x, _y) {
  var parent = $U.extend(this, new ConstructionObject(_construction, _name)); // Herencia
  $U.extend(this, new MoveableObject(_construction)); // Herencia


  var Cn = _construction;
  var me = this;
  var shape = 0; // 0 for circle, 1 for cross,
  var X = _x,
    Y = _y;
  var X_old = 0,
    ORG3D = null;
  var X3D = NaN,
    Y3D = NaN,
    Z3D = NaN;
  var X3D_OLD = NaN,
    Y3D_OLD = NaN,
    Z3D_OLD = NaN;
  var pt3D = Cn.getInterpreter().getEX().EX_point3D;

  var EXY = null;

  var lastX = _x,
    lastY = _y; // For TrackObject;
  var order = 0; // order, only for Intersection points
  var inc = 0; // increment
  var macrosource = null;
  var away = null;
  var fillStyle = this.prefs.color.point_free;
  var aTXT, cosTXT, sinTXT; // ángulo para la posición del nombre alrededor del punto
  var isStr = $U.isStr;
  var isArray = $U.isArray;




  var currentMagnet = null; // Para controlar los cambios de magnetismo: usado para
  // las trazas de objetos.
  // path: PointObject.js

  // --- Exclusive magnet target (lock) ---------------------------------------
  var exclusiveMagnetTarget = false;
  var magnetLockOwner = null;

  this.setExclusiveMagnetTarget = function(_b) {
    exclusiveMagnetTarget = !!_b;
    
    if (!exclusiveMagnetTarget) magnetLockOwner = null;
  };

  this.isExclusiveMagnetTarget = function() {
    return exclusiveMagnetTarget;
  };

  this.getMagnetLockOwner = function() {
    return magnetLockOwner;
  };

  // this.lockMagnet = function(_owner) {
  //   if (!exclusiveMagnetTarget) return;
  //   magnetLockOwner = _owner || null;
  // };

  // this.unlockMagnet = function(_owner) {
  //   if (!exclusiveMagnetTarget) return;
  //   if (magnetLockOwner === _owner) magnetLockOwner = null;
  // };

  this.lockMagnet = function(_owner) {
  if (!exclusiveMagnetTarget) return;

  var changed = magnetLockOwner !== (_owner || null);
    magnetLockOwner = _owner || null;

    if (changed) {
      this.computeChilds();
    }
  };

  this.unlockMagnet = function(_owner) {
    if (!exclusiveMagnetTarget) return;

    if (magnetLockOwner === _owner) {
      magnetLockOwner = null;
      this.computeChilds();
    }
  };
  
  this.isOccupied = function() {
    return !!magnetLockOwner;
  };

  this.getOccupant = function() {
    return magnetLockOwner;
  };

  this.getOccupantName = function() {
    return magnetLockOwner ? magnetLockOwner.getName() : null;
  };

  var xMinBound = null,
    xMaxBound = null,
    yMinBound = null,
    yMaxBound = null;

  var normalizeBound = function(v) {
    return (typeof v === "number" && !isNaN(v)) ? v : null;
  };

  var sortBounds = function(minv, maxv) {
    if (minv !== null && maxv !== null && minv > maxv) {
      var t = minv;
      minv = maxv;
      maxv = t;
    }
    return [minv, maxv];
  };

  var clampIncrement = function(px, py) {
    if (me.getParentLength() !== 0) return [px, py];

    var x = Cn.coordsSystem.x(px);
    var y = Cn.coordsSystem.y(py);

    if (xMinBound !== null && x < xMinBound) x = xMinBound;
    if (xMaxBound !== null && x > xMaxBound) x = xMaxBound;
    if (yMinBound !== null && y < yMinBound) y = yMinBound;
    if (yMaxBound !== null && y > yMaxBound) y = yMaxBound;

    return [Cn.coordsSystem.px(x), Cn.coordsSystem.py(y)];
  };

  this.setBounds = function(xmin, xmax, ymin, ymax) {
    xMinBound = normalizeBound(xmin);
    xMaxBound = normalizeBound(xmax);
    yMinBound = normalizeBound(ymin);
    yMaxBound = normalizeBound(ymax);

    var xb = sortBounds(xMinBound, xMaxBound);
    var yb = sortBounds(yMinBound, yMaxBound);

    xMinBound = xb[0];
    xMaxBound = xb[1];
    yMinBound = yb[0];
    yMaxBound = yb[1];
  };

  this.setXBounds = function(xmin, xmax) {
    xmin = normalizeBound(xmin);
    xmax = normalizeBound(xmax);
    var xb = sortBounds(xmin, xmax);
    xMinBound = xb[0];
    xMaxBound = xb[1];
  };

  this.setYBounds = function(ymin, ymax) {
    ymin = normalizeBound(ymin);
    ymax = normalizeBound(ymax);
    var yb = sortBounds(ymin, ymax);
    yMinBound = yb[0];
    yMaxBound = yb[1];
  };

  this.clearBounds = function() {
    xMinBound = null;
    xMaxBound = null;
    yMinBound = null;
    yMaxBound = null;
  };

  this.getBounds = function() {
    return {
      xmin: xMinBound,
      xmax: xMaxBound,
      ymin: yMinBound,
      ymax: yMaxBound
    };
  };

  
  this.pointsIn=0;
  
  this.getPointsIn= function () {
	  return this.pointsIn;
  };

  // this.blocks.setMode(["onlogo", "onmousedown", "ondrag", "onmouseup", "oncompute"], "ondrag");
  this.blocks.setMode(["onlogo", "onmousedown", "ondrag", "onmouseup"], "ondrag");

  // ****************************************
  // **** Unicamente para las animaciones ****
  // ****************************************

  this.isAnimationPossible = function() {
    return ((this.getParentLength() === 1) && (this.getParentAt(0).getAlphaBounds));
  }

  this.getAnimationSpeedTab = function() {
    return this.getParentAt(0).getAnimationSpeedTab();
  }

  this.getAnimationParams = function(mx, my) {
    return this.getParentAt(0).getAnimationParams(X, Y, mx, my);
  }

  this.incrementAlpha = function(anim) {
    var v = anim.speed;
    var s = anim.direction;
    var ar = anim.ar;
    var d = new Date();
    anim.delay = d.getTime() - anim.timestamp;
    anim.timestamp = d.getTime();
    // b[0] y b[1] indican el intervalo Alpha
    // b[2] indica el incremento
    var b = me.getParentAt(0).getAlphaBounds(anim, me);
    // console.log(b[2]);
    if (b) {
      Alpha += b[2];
      if (Alpha < b[0]) {
        if (ar) {
          anim.direction *= -1;
          Alpha = 2 * b[0] - Alpha;
        } else {
          Alpha = b[1] + Alpha - b[0];
        }
      }
      if (Alpha > b[1]) {
        if (ar) {
          anim.direction *= -1;
          Alpha = 2 * b[1] - Alpha;
        } else {
          Alpha = b[0] + Alpha - b[1];
        }
      }
      if (Alpha < b[0]) Alpha = b[0];
      if (Alpha > b[1]) Alpha = b[1];
    }
    me.blocks.evaluate("ondrag");
  };

  // ****************************************
  // ****************************************


  this.getValue = function() {

    if (EXY)
      return EXY.value();
    if (Cn.is3D()) {
      //            if (me === ORG3D)
      if (Cn.isOrigin3D(me))
        return [0, 0, 0];
      else if (me.is3D())
        return me.coords3D();
      //            else return me.coords3D();
    }
    return [me.getCn().coordsSystem.x(X), me.getCn().coordsSystem.y(Y)];
  };


  this.isMoveable = function() {
    return (this.getParentLength() < 2);
  };

  this.isCoincident = function(_C) {
    if (_C.isInstanceType("point")) {
      // Si los puntos coinciden:
      if ($U.approximatelyEqual(X, _C.getX()) && $U.approximatelyEqual(Y, _C.getY())) {
        return true;
      }
    }
    return false;
  };

  this.setNamePosition = function(_a) {
    aTXT = _a;
    cosTXT = Math.cos(_a);
    sinTXT = Math.sin(_a);
  };

  this.getNamePosition = function() {
    return aTXT;
  };

  this.setNamePosition(0);


  this.setAway = function(_P) {
    away = _P;
  };

  this.getAway = function() {
    return away;
  };

  this.setFillStyle = function() {
    var len = this.getParentLength();
    switch (len) {
      case 0:
        // Punto libre :
        fillStyle = this.prefs.color.point_free;
        break;
      case 1:
        // Punto sobre objeto:
        fillStyle = this.prefs.color.point_on;
        break;
      case 2:
        // Punto de intersección:
        fillStyle = this.prefs.color.point_inter;
        break;
    }
  }

  this.forceFillStyle = function(_fs) {
    fillStyle = this.prefs.color.point_inter;
  };

  this.setMacroSource = function(_p) {
    macrosource = _p;
  };
  this.execMacroSource = function(_src) {
    if (!macrosource)
      return false;
    macrosource(_src);
    return true;
  };

  this.getAssociatedTools = function() {
    //var at = "@namemover,@callproperty,@calltrash,@callhide,@callvalue,segment,line,ray,midpoint,symc,perpbis,anglebiss,vector,BR,circle,circle1,circle3,circle3pts,arc3pts,area,angle,fixedangle";
    var at = "@namemover,@callproperty,@calltrash,@callhide,segment,line,ray,midpoint,symc,perpbis,anglebiss,vector,BR,circle,circle1,circle3,";
    if (Cn.getCanvas().version() == "profesores") {
		at+="circle3pts,";
	}
	at+="arc3pts,area,angle";
    //JDIAZ 
    if (this.getPrecision() === -1)
      at += ",@callvalue";
    else 
      at += ",@removevalue";
    //JDIAZ
	//JDIAZ
    if (this.getShowName()===true)
      at += ",@removename";
    
    //JDIAZ
    if (this.isMoveable())
      at += ",@objectmover";
    if (this.getParentLength() === 0)
      at += ",@anchor";
    else
      at += ",@noanchor";
    if ((this.getEXY()) || ((this.getParentLength() === 0) && (!this.getFloat())))
      at += ",@callcalc";
    at += ",@blockly";
    if (this.isMoveable()) {
      at += ",@pushpin";
      at += ",@magnet";
    }
    if (this.isAnimationPossible())
      at += ",@spring";
    if (this.getCn().findPtOn(this) !== null)
      at += ",locus";
    


    return at;
  };

  this.setIncrement = function(_i) {
    if (this.getParentLength() < 2) {
      inc = _i;
      this.computeIncrement(X, Y);
    }
  };
  this.getIncrement = function() {
    return inc;
  };

  

  this.computeIncrement = function(_x, _y) {
  var px = _x, py = _y;

  if (inc) {
    var x = this.getCn().coordsSystem.x(_x);
    var y = this.getCn().coordsSystem.y(_y);
    x = inc * Math.round(x / inc);
    y = inc * Math.round(y / inc);
    px = this.getCn().coordsSystem.px(x);
    py = this.getCn().coordsSystem.py(y);
  }

  var p = clampIncrement(px, py);
    this.setXY(p[0], p[1]);
  };

  this.isInstanceType = function(_c) {
    return (_c === "point");
  };
  this.getCode = function() {
    return "point";
  };
  this.getFamilyCode = function() {
    return "point";
  };


  this.setShape = function(_shape) {
    shape = _shape;
    switch (shape) {
      case 0:
        paintProc = paintCircle;
        break;
      case 1:
        paintProc = paintCross;
        break;
      case 2:
        paintProc = paintDiamond;
        break;
      case 3:
        paintProc = paintSquare;
        break;
    }
  };
  this.getShape = function() {
    return shape;
  };

  this.isPointOn = function() {
    return (this.getParentLength() === 1);
  };


  this.setOrder = function(_n) {
    order = _n;
  };
  this.getOrder = function() {
    return order;
  };

  // Alpha represents relative coord for point on object M :
  // For lines by two points, and segments, it's P1M= Alpha x P1P2
  // For lines by one point (parallel, perpendicular), it's PM= Alpha x U (U=unit vector of line)
  // For Circle, it's a radian in [0;2π[
  var Alpha = 0;
  this.setAlpha = function(_a) {
    // console.log("Alpha="+_a);
    Alpha = _a;
  };
  this.getAlpha = function() {
    // console.log(Alpha);
    return Alpha;
  };

  // Para la redefinición de objeto (por ejemplo Punto libre/Punto sobre) :
  this.attachTo = function(_o) {
    this.setParentList(_o.getParent());
    this.setXY(_o.getX(), _o.getY());
    var childs = _o.getChildList();
    for (var i = 0, len = childs.length; i < len; i++) {
      childs[i].redefine(_o, this);
    }
    Cn.remove(_o);
    this.setFillStyle();
    Cn.reconstructChilds();
    this.computeChilds();
  };
  this.deleteAlpha = function() {
    var parents = this.getParent();
    this.setXY(this.getX() + 25, this.getY() - 25);
    for (var i = 0, len = parents.length; i < len; i++) {
      parents[i].deleteChild(this);
    }
    this.setParent();
    this.setFillStyle();
    Cn.reconstructChilds();
    this.computeChilds();
  };

  this.getX = function() {
    return X;
  };
  this.getY = function() {
    return Y;
  };

  this.setXY = function(x, y) {
    X = x;
    Y = y;
  };

  this.setxy = function(x, y) {
    X = Cn.coordsSystem.px(x);
    Y = Cn.coordsSystem.py(y);
  };
  this.getx = function() {
    return Cn.coordsSystem.x(X);
  };
  this.gety = function() {
    return Cn.coordsSystem.y(Y);
  };

  // Solamente para los puntos magnéticos:
  this.projectMagnetAlpha = function(p) {};
  this.setMagnetAlpha = function(p) {};

  /*************************************
   *************************************
   ***********  3D part  ***************
   *************************************
   *************************************/

  this.setXYZ = function(_coords) {
    X3D = _coords[0];
    Y3D = _coords[1];
    Z3D = _coords[2];
    if (ORG3D === null) {
      ORG3D = Cn.get3DOrigin(me);
    }
    var c2d = pt3D([Cn.coordsSystem.x(ORG3D.getX()), Cn.coordsSystem.y(ORG3D.getY())], _coords);
    X = Cn.coordsSystem.px(c2d[0]);
    Y = Cn.coordsSystem.py(c2d[1]);
  }

  this.getXYZ = function() {
    return [X3D, Y3D, Z3D];
  };

  // Abscisa guardada para la primera vuelta
  // de compute, correspondiente a phi=phi+delta :
  this.storeX = function() {
    X_old = X;
  };

  this.getOldcoords = function() {
    return [X3D_OLD, Y3D_OLD, Z3D_OLD];
  };

  this.coords3D = function() {
    if (!isNaN(X3D))
      return [X3D_OLD = X3D, Y3D_OLD = Y3D, Z3D_OLD = Z3D];
    if (ORG3D === null) {
      ORG3D = Cn.get3DOrigin(me);
      if (ORG3D === null)
        return [NaN, NaN, NaN];
    }
    var phi = Cn.getPhi();
    var theta = Cn.getTheta();
    var stheta = Cn.sin(theta);
    var ctheta = Cn.cos(theta);
    var sphi = Cn.sin(phi[0]),
      sphid = Cn.sin(phi[1]);
    var cphi = Cn.cos(phi[0]),
      cphid = Cn.cos(phi[1]);
    var dis = sphi * cphid - sphid * cphi;
    var xO = ORG3D.getX();
    X3D_OLD = ((X_old - xO) * cphid - (X - xO) * cphi) / dis;
    Y3D_OLD = (sphi * (X - xO) - sphid * (X_old - xO)) / dis;
    Z3D_OLD = (X3D_OLD * cphid * stheta - Y3D_OLD * sphid * stheta + ORG3D.getY() - Y) / ctheta;
    X3D_OLD = Cn.coordsSystem.l(X3D_OLD);
    Y3D_OLD = Cn.coordsSystem.l(Y3D_OLD);
    Z3D_OLD = Cn.coordsSystem.l(Z3D_OLD);
    return [X3D_OLD, Y3D_OLD, Z3D_OLD];
  };

  this.coords2D = function() {
    return [Cn.coordsSystem.x(this.getX()), Cn.coordsSystem.y(this.getY())];
  };




  this.getEXY = function() {
    return EXY;
  };

  // Para Blockly :
  parent.setExpression = this.setExpression = function(exy) {
    var elt;
    try {
      elt = JSON.parse(exy);
    } catch (e) {
      elt = exy;
    }
    if ((elt.constructor === Array) && (elt.length === 2)) {
      me.setExp(Cn.coordsSystem.px(elt[0]), Cn.coordsSystem.py(elt[1]));
    } else {
      me.setExp(exy);
    }
  }
  parent.getExpression = this.getExpression = function() {
    return me.getExp();
  }

  // exy es una fórmula (string), o un número. Si es 
  // un número, es la abscisa y el segundo  param
  // es la ordenada. Si es una fórmula, y si tiene un segundo
  // param, este es un buleano que indica si es o no un punto 3D.
  // si no hay un segundo param, el software determina si se trata de un
  // punto 2d o 3d.
  // setExp para los widgets  :
  this.setExp = this.setEXY = function(exy, ey) {
    // console.log(exy);
    if (isStr(exy)) {
      // Si ex y ey son expresiones:
      me.setParent();
      EXY = Expression.delete(EXY);
      EXY = new Expression(me, exy);
      fillStyle = me.prefs.color.point_fixed;
      me.isMoveable = function() {
        return false;
      };
      me.setXY = function(_x, _y) {};
      me.compute = computeFixed;
      me.getSource = getSourceFixed;

      var t = EXY.value();
      me.set3D((isArray(t)) && (t.length === 3));

    } else {
      // Si ex y ey son números:
      EXY = Expression.delete(EXY);
      X = exy;
      Y = ey;
      fillStyle = me.prefs.color.point_free;
      me.isMoveable = function() {
        return true;
      };
      me.setXY = function(x, y) {
        X = x;
        Y = y;
      };
      me.compute = computeGeom;
      me.getSource = getSourceGeom;
      me.setParent()
    }
  };

  this.getExp = function() {
    if ((this.getEXY) && (this.getEXY()) && this.getEXY().getSource && this.getEXY().getSource()) {
      return this.getEXY().getSource();
    } else {
      return "";
    }
  };
  
  this.isFixed = function() {
	  if (this.EXY) {return true}
	  else {return false};
  }

  this.near = function(_x, _y) {
    return ((Math.abs(X - _x) < 1E-10) && (Math.abs(Y - _y) < 1E-10));
  }

  this.dragObject = function(_x, _y) {
    this.computeIncrement(_x, _y);
    if (this.getParentLength() === 1) {
      this.getParentAt(0).project(this);
      this.getParentAt(0).setAlpha(this);
      return;
    }
  };

    

  this.computeDrag = function() {
    this.compute();
    this.computeChilds();
  };



  var magnetsSortFilter = function(a, b) {
    var ap = a[0].isInstanceType("point");
    var bp = b[0].isInstanceType("point");
    if (ap && bp)
      return (a[1] - b[1]);
    else if (ap)
      return -1;
    else if (bp)
      return 1;
    else
      return (a[1] - b[1]);
  }

  
var getNearestSlotIndexByXY = function(listObj, x, y) {
  if (!listObj || !listObj.getMagnetSlotCount || !listObj.getMagnetSlotXY) return null;

  var n = listObj.getMagnetSlotCount();
  if (!n) return null;

  var best = null, bestD2 = Infinity;
  for (var i = 0; i < n; i++) {
    var xy = listObj.getMagnetSlotXY(i);
    if (!xy) continue;
    var dx = xy[0] - x, dy = xy[1] - y;
    var d2 = dx*dx + dy*dy;
    if (d2 < bestD2) { bestD2 = d2; best = i; }
  }
  return best;
};



this.computeMagnets = function () {
  var mgObj = null;
  var t = this.getMagnets();
  if (!t || t.length === 0) return;

  var reps = [];
  var lastDirX = 1,
    lastDirY = 0;

  // Dirección estable basada en el último movimiento (fallback si d=0)
  var dxm = X - lastX;
  var dym = Y - lastY;
  var l2m = dxm * dxm + dym * dym;
  if (l2m > 1e-12) {
    var lm = Math.sqrt(l2m);
    lastDirX = dxm / lm;
    lastDirY = dym / lm;
  }

  function isAreaObj(obj) {
    return (
      obj &&
      obj.getCode &&
      obj.getCode() === "area" &&
      typeof obj.containsXY === "function" &&
      typeof obj.projectXY === "function"
    );
  }

  function normalizeDir(dx, dy, fallbackX, fallbackY) {
    var l2 = dx * dx + dy * dy;
    if (l2 > 1e-12) {
      var l = Math.sqrt(l2);
      return [dx / l, dy / l];
    }
    // fallback
    var f2 = fallbackX * fallbackX + fallbackY * fallbackY;
    if (f2 > 1e-12) {
      var f = Math.sqrt(f2);
      return [fallbackX / f, fallbackY / f];
    }
    return [1, 0];
  }

  // Desde un punto de borde (bx,by), intenta empujar epsilon hacia adentro (4 direcciones).
  function pushInsideFromBoundary(areaObj, bx, by, eps) {
    var cand = [
      [bx + eps, by],
      [bx - eps, by],
      [bx, by + eps],
      [bx, by - eps],
    ];
    for (var i = 0; i < cand.length; i++) {
      var cx = cand[i][0],
        cy = cand[i][1];
      if (areaObj.containsXY(cx, cy)) return [cx, cy];
    }
    return [bx, by]; // fallback: borde
  }

  // Garantiza: si (nx,ny) queda dentro del área y estamos en repulsión, lo expulsa.
  function clampOutsideArea(areaObj, nx, ny, absR) {
    if (!areaObj.containsXY(nx, ny)) return [nx, ny];

    // Proyecta el punto "malo" al borde más cercano
    var b = areaObj.projectXY(nx, ny);

    // Vector desde borde hacia punto (si está dentro, apunta hacia adentro)
    var inx = nx - b[0];
    var iny = ny - b[1];

    // Dirección hacia afuera = - (hacia adentro)
    var dir = normalizeDir(-inx, -iny, -lastDirX, -lastDirY);
    var dirX = dir[0],
      dirY = dir[1];

    // Empujar hacia afuera garantizado
    var eps = 0.5;
    var maxIters = 16;

    var ox = b[0] + dirX * (absR + eps);
    var oy = b[1] + dirY * (absR + eps);

    for (var k = 0; k < maxIters && areaObj.containsXY(ox, oy); k++) {
      eps *= 2;
      ox = b[0] + dirX * (absR + eps);
      oy = b[1] + dirY * (absR + eps);
    }

    return [ox, oy];
  }

  function evalTarget(obj, r) {
    if (!obj) return;

    var rr = Math.abs(r);

    // Exclusividad (punto exclusivo con lock de otro => repulsión)
    if (obj.isExclusiveMagnetTarget && obj.isExclusiveMagnetTarget()) {
      var owner = obj.getMagnetLockOwner && obj.getMagnetLockOwner();
      if (owner && owner !== me) r = -rr;
      else r = rr;
    }

    // Elegir ancla (c) según target
    var c;
    var isArea = isAreaObj(obj);

    
    if (isArea) {
      var inside = obj.containsXY(X, Y);

      if (r >= 0) {
        // ATRACCIÓN: dentro => identidad, fuera => epsilon adentro desde borde
        if (inside) {
          c = [X, Y];
        } else {
          var e = (typeof obj.projectXYEdge === "function") ? obj.projectXYEdge(X, Y) : null;

          if (!e) {
            // fallback viejo
            var b = obj.projectXY(X, Y);
            c = pushInsideFromBoundary(obj, b[0], b[1], 10);
          } else {
            // normal del segmento ganador
            var sx = e.x2 - e.x1;
            var sy = e.y2 - e.y1;
            var n2 = sx * sx + sy * sy;

            if (n2 < 1e-12) {
              c = [e.x, e.y];
            } else {
              var inv = 1 / Math.sqrt(n2);
              // normal unitaria (dos posibles sentidos)
              var nx = -sy * inv;
              var ny = sx * inv;

              var margin = 10; // tu margen deseado en px
              var ax = e.x + nx * margin, ay = e.y + ny * margin;
              var bx = e.x - nx * margin, by = e.y - ny * margin;

              if (obj.containsXY(ax, ay)) c = [ax, ay];
              else if (obj.containsXY(bx, by)) c = [bx, by];
              else {
                // si 10 es mucho/poco, intenta acercarte con “búsqueda” hacia adentro
                var ok = false;
                var m = margin;
                for (var k = 0; k < 10; k++) {
                  m *= 0.5;
                  ax = e.x + nx * m; ay = e.y + ny * m;
                  bx = e.x - nx * m; by = e.y - ny * m;
                  if (obj.containsXY(ax, ay)) { c = [ax, ay]; ok = true; break; }
                  if (obj.containsXY(bx, by)) { c = [bx, by]; ok = true; break; }
                }
                if (!ok) c = [e.x, e.y]; // último fallback: borde
              }
            }
          }
        }
      } else {
        // ✅ REPULSIÓN: si estás dentro, que SIEMPRE active el imán (d2=0)
        if (inside) {
          c = [X, Y];           // d2 = 0 => siempre entra al radio rr
        } else {
          c = obj.projectXY(X, Y);
        }
      }
    } else {
      c = obj.projectXY(X, Y);
    }

    // Mantiene alpha/slot behavior
    var pt = new VirtualPointObject(c[0], c[1]);
    if (obj.setMagnetAlpha) obj.setMagnetAlpha(pt);
    if (obj.projectMagnetAlpha) obj.projectMagnetAlpha(pt);
    c[0] = pt.getX();
    c[1] = pt.getY();

    // Si está dentro del radio, agrega candidato
    var vx = X - c[0];
    var vy = Y - c[1];
    var d2 = vx * vx + vy * vy;

    if (d2 < rr * rr) {
      reps.push([obj, d2, c[0], c[1], r, rr]);
    }
  }

  
  // Evalúa targets
  for (var i = 0; i < t.length; i++) {
    var obj = t[i][0];

    var r_raw = t[i][1];          // puede ser positivo o negativo
    var unit = t[i][2] || "px";   // "px" | "u"

    var r = r_raw;

    // ✅ Runtime conversion: u -> px según zoom actual
    if (unit === "u") {
      var cs =
        (Cn && typeof Cn.getCoordsSystem === "function" ? Cn.getCoordsSystem() : null) ||
        (Cn && Cn.coordsSystem ? Cn.coordsSystem : null);

      var ppu = cs && typeof cs.getUnit === "function" ? Number(cs.getUnit()) : 1; // px/u

      if (isFinite(ppu) && ppu > 0) r = r_raw * ppu;
    }

    // Si el target es lista con slots, evaluar slots
    if (obj && typeof obj.getMagnetTargets === "function") {
      var targets = obj.getMagnetTargets();
      if (targets && targets.length) {
        for (var j = 0; j < targets.length; j++) evalTarget(targets[j], r);
        continue;
      }
    }

    evalTarget(obj, r);
  }

  if (reps.length === 0) {
  // ✅ si ya no hay magnet activo, liberar el lock del anterior
    if (
      currentMagnet &&
      currentMagnet.isExclusiveMagnetTarget &&
      currentMagnet.isExclusiveMagnetTarget()
    ) {
      currentMagnet.unlockMagnet(me);
    }
    currentMagnet = null;
    return;
  }

  reps.sort(magnetsSortFilter);
  mgObj = reps[0][0];

  var projX = reps[0][2];
  var projY = reps[0][3];
  var signedR = reps[0][4];
  var absR = reps[0][5];

  if (signedR >= 0) {
    // ATRACCIÓN
    this.setXY(projX, projY);
  } else {
    // REPULSIÓN
    var vx2 = X - projX;
    var vy2 = Y - projY;

    var dir = normalizeDir(vx2, vy2, lastDirX, lastDirY);
    var dirX = dir[0],
      dirY = dir[1];

    // Propuesta inicial
    var nx = projX + dirX * absR;
    var ny = projY + dirY * absR;

    // Regla dura: si el target es área, NO puede terminar dentro
    if (isAreaObj(mgObj)) {
      var out = clampOutsideArea(mgObj, nx, ny, absR);
      nx = out[0];
      ny = out[1];
    }

    this.setXY(nx, ny);
  }

  // Lock/Unlock solo si el imán activo ES punto exclusivo
  if (mgObj && mgObj.isExclusiveMagnetTarget && mgObj.isExclusiveMagnetTarget()) {
    if (signedR >= 0) mgObj.lockMagnet(me);
    else mgObj.unlockMagnet(me);
  }

  this.computeChilds();

  if (
    currentMagnet &&
    currentMagnet !== mgObj &&
    currentMagnet.isExclusiveMagnetTarget &&
    currentMagnet.isExclusiveMagnetTarget()
  ) {
    currentMagnet.unlockMagnet(me);
  }

  if (currentMagnet != mgObj) {
    currentMagnet = mgObj;
    lastX = X;
    lastY = Y;
    for (var k = 0, len = this.getChildLength(); k < len; k++) {
      this.getChildAt(k).beginTrack();
    }
  }
};







  this.checkMagnets = function() {
    if (this.getMagnets().length) {
      this.computeMagnets();
      //            this.dragObject(X, Y);
      if (this.getParentLength() === 1) {
        this.getParentAt(0).project(this);
        this.getParentAt(0).setAlpha(this);
      }
    }
  }

  this.projectXY = function(_x, _y) {
    return [X, Y];
  };

  this.mouseInside = function(ev) {
    if (isNaN(X + Y))
      return false;
    if (((Math.abs(this.mouseX(ev) - X) < this.getOversize())) && (Math.abs(this.mouseY(ev) - Y) < this.getOversize())) {
      return true;
    }
    return false;
  };


  var computeGeom = function() {
    
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
    var len = this.getParentLength();
    if (len === 0)
      return;
    if (len === 1) {
      // This is a point on object :
      this.getParentAt(0).projectAlpha(this);
    } else if (len === 2) {
      // This is an intersection point :
      this.getParentAt(0).intersect(this.getParentAt(1), this);
      this.getParentAt(0).checkIfValid(this);
      this.getParentAt(1).checkIfValid(this);
    }
  };


  var computeFixed = function() {
    EXY.compute();
    var t = EXY.value();
    
    if (isArray(t)) {
      // Si es un punto 3D :
      if (t.length === 3) {
        if (ORG3D === null) {
          ORG3D = Cn.get3DOrigin(me);
        }
        X3D = t[0];
        Y3D = t[1];
        Z3D = t[2];
        var c2d = pt3D([Cn.coordsSystem.x(ORG3D.getX()), Cn.coordsSystem.y(ORG3D.getY())], t);
        X = Cn.coordsSystem.px(c2d[0]);
        Y = Cn.coordsSystem.py(c2d[1]);
      } else {
        // Si no, estamos en 2D :
        X3D = NaN;
        Y3D = NaN;
        Z3D = NaN;
        X = Cn.coordsSystem.px(t[0]);
        Y = Cn.coordsSystem.py(t[1]);
      }
    } else {
      X = NaN;
      Y = NaN;
    }
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.compute = computeGeom;

  this.refreshNames = function() {
    if (EXY)
      EXY.refreshNames();
  };


  var paintTxt = function(ctx, txt) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";
    var sz = 2 * me.getRealsize();
    var xtxt = sz * cosTXT + ctx.measureText(txt).width * (cosTXT - 1) / 2;
    var ytxt = sz * sinTXT + me.getFontSize() * (sinTXT - 1) / 2;
    ctx.fillText(txt, X + xtxt, Y - ytxt);
  }

  this.paintLength = function(ctx) {
    var prec = this.getPrecision();
    var x = $L.number(Math.round(this.getCoordsSystem().x(X) * prec) / prec);
    var y = $L.number(Math.round(this.getCoordsSystem().y(Y) * prec) / prec);
    var txt = this.getShowName() ? this.getSubName() : "";
    txt += "(" + x + $L.separator_coords + y + ")";
    paintTxt(ctx, txt);
  };

  this.paintName = function(ctx) {
    // Si una medida debe mostrarse, paintLength se encargará
    // de mostrar el nombre con:

    if (this.getPrecision() === -1)
      paintTxt(ctx, this.getSubName());
  };


  var paintCircle = function(ctx) {
    if (me.getOpacity() === 0)
      ctx.fillStyle = fillStyle;
    ctx.lineWidth = me.prefs.size.pointborder;
    ctx.beginPath();
    ctx.arc(X, Y, me.getRealsize(), 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
  };
  var paintCross = function(ctx) {
    var sz = me.getRealsize() * 0.9;
    ctx.lineWidth = me.prefs.size.pointborder;
    ctx.beginPath();
    ctx.moveTo(X - sz, Y + sz);
    ctx.lineTo(X + sz, Y - sz);
    ctx.moveTo(X - sz, Y - sz);
    ctx.lineTo(X + sz, Y + sz);
    ctx.stroke();
  };
  var paintSquare = function(ctx) {
    var sz = me.getRealsize() * 1.8;
    if (me.getOpacity() === 0)
      ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.lineWidth = me.prefs.size.pointborder;
    ctx.beginPath();
    ctx.rect(X - sz / 2, Y - sz / 2, sz, sz);
    ctx.fill();
    ctx.stroke();
  };
  var paintDiamond = function(ctx) {
    var sz = me.getRealsize() * 1.3;
    if (me.getOpacity() === 0)
      ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.lineWidth = me.prefs.size.pointborder;
    ctx.beginPath();
    ctx.moveTo(X, Y - sz);
    ctx.lineTo(X - sz, Y);
    ctx.lineTo(X, Y + sz);
    ctx.lineTo(X + sz, Y);
    ctx.lineTo(X, Y - sz);
    ctx.fill();
    ctx.stroke();
  };

  this.beginTrack = function() {
    lastX = X;
    lastY = Y;
  };

  this.drawTrack = function(ctx) {
    if (!isNaN(X) && !isNaN(Y) && !this.isHidden()) {
      if ((X !== lastX) || (Y != lastY)) {
        ctx.strokeStyle = this.getColor().getRGBA();
        ctx.lineWidth = this.getSize();
        ctx.lineCap = 'round';
        if (!isNaN(lastX) && !isNaN(lastY)) {
          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(X, Y);
          ctx.stroke();
        }
      }
    }
    lastX = X;
    lastY = Y;
  };

  var paintProc = paintCircle;

  this.paintObject = function(ctx) {
    paintProc(ctx);
  };

  var getSourceGeom = function(src) {
    if (this.execMacroSource(src))
      return;
    var len = this.getParentLength();
    var x = this.getCn().coordsSystem.x(this.getX());
    var y = this.getCn().coordsSystem.y(this.getY());
    switch (len) {
      case 0:
        src.geomWrite(false, this.getName(), "Point", x, y);
        break;
      case 1:
        // punto sobre objeto:
        src.geomWrite(false, this.getName(), "PointOn", this.getParentAt(0).getVarName(), Alpha);
        
        break;
      case 2:
        // punto de intersección:
        if (away) {
			if(away.getCode()=="virtualPoint"){
			src.geomWrite(false, this.getName(), "OrderedIntersection", this.getParentAt(0).getVarName(), this.getParentAt(1).getVarName(), order);} else {
			src.geomWrite(false, this.getName(), "OrderedIntersection", this.getParentAt(0).getVarName(), this.getParentAt(1).getVarName(), order, away.getVarName());
			}
        } else {
          src.geomWrite(false, this.getName(), "OrderedIntersection", this.getParentAt(0).getVarName(), this.getParentAt(1).getVarName(), order);
        }
        break;
    }
  };

  var getSourceFixed = function(src) {
    if (this.execMacroSource(src))
      return;
    var _ex = EXY.getUnicodeSource().replace(/\n/g, "\\n");
    src.geomWrite(true, this.getName(), "Point", _ex, (me.is3D()) ? 1 : 0);
  };

  this.getSource = getSourceGeom;

  this.setDefaults("point");

  // MEAG start
  this.getTextCons = function() {
    len = this.getParentLength();
    texto = "";
    switch (len) {
      case 0:
        texto = this.getName() + $L.object_point_description;
        parents = [];
        break;
      case 1:
        texto = this.getName() + $L.object_pointon_description + this.getParentAt(0).getVarName();
        parents = [this.getParentAt(0).getVarName()];
        break;
      case 2:
        if (away) {
			if (away.getCode()=="virtualPoint"){
			texto = this.getName() + $L.object_intersectionpoint_description + this.getParentAt(0).getVarName() + $L.object_intersectionpoint_description_secondObjetc + this.getParentAt(1).getVarName()}else{
			texto = this.getName() + $L.object_intersectionpoint_description + this.getParentAt(0).getVarName() + $L.object_intersectionpoint_description_secondObjetc + this.getParentAt(1).getVarName()+$L.object_intersectionpoint_description_away+away.getName();}
        } else {
          texto = this.getName() + $L.object_intersectionpoint_description + this.getParentAt(0).getVarName() + $L.object_intersectionpoint_description_secondObjetc + this.getParentAt(1).getVarName();
        }
        parents = [this.getParentAt(0).getVarName(), this.getParentAt(1).getVarName()];
        break;
    }
    return {
      "texto": texto,
      "parents": parents
    };
  };

  this.nameMover = function(ev, zc) {
    var a = $U.angleH(this.getX() - zc.mouseX(ev), this.getY() - zc.mouseY(ev));
    this.setNamePosition(a);
    this.setShowName(true);
  }
  // MEAG end

};
