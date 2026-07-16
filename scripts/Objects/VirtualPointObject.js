

function VirtualPointObject(_x, _y) {
  var X = _x;
  var Y = _y;
  var alpha = 0;
  var is_3D = false;

  // --- Magnet/exclusive state (por target):
  var exclusiveMagnetTarget = false;
  var magnetLockOwner = null;

  // Compat con magnetsSortFilter / objetos DGPad
this.isInstanceType = function(_c) {
  // Un virtual point NO es "list", "segment", etc.
  // Si te conviene tratarlo como punto:
  return (_c === "point");
};

this.getCode = function() {
  return "point"; // o "virtualPoint" si prefieres, pero "point" evita sorpresas
};

this.getFamilyCode = function() {
  return "point";
};

this.isNoSource = function() { return true; };


  this.getX = function () {
    return X;
  };

  this.getY = function () {
    return Y;
  };

  this.setXY = function (x, y) {
    X = x;
    Y = y;
  };

  this.setAlpha = function (_a) {
    alpha = _a;
  };

  this.getAlpha = function () {
    return alpha;
  };

  this.getCode = function () {
    return "virtualPoint";
  };

  this.near = function (_x, _y) {
    return (Math.abs(X - _x) < 1e-10) && (Math.abs(Y - _y) < 1e-10);
  };

  this.is3D = function () {
    return is_3D;
  };

  this.set3D = function (_b) {
    is_3D = _b;
  };

  // ---------------------------
  // Magnet target “interface”
  // ---------------------------

  /**
   * Proyección trivial: este target ya es un punto.
   * Debe devolver un array [x, y] como otros objetos magnetizables.
   */
  this.projectXY = function (_x, _y) {
    return [X, Y];
  };

  /**
   * Compat con pipeline de magnet alpha.
   * En virtualPoint no transformamos nada.
   */
  this.setMagnetAlpha = function (_pt) {
    // no-op
  };

  this.projectMagnetAlpha = function (_pt) {
    // no-op
  };

  // // ---------------------------
  // // Exclusive magnet target API
  // // ---------------------------

  // this.setExclusiveMagnetTarget = function (b) {
  //   exclusiveMagnetTarget = !!b;
  //   if (!exclusiveMagnetTarget) magnetLockOwner = null;
  // };

  // this.isExclusiveMagnetTarget = function () {
  //   return !!exclusiveMagnetTarget;
  // };

  // this.lockMagnet = function (owner) {
  //   if (!exclusiveMagnetTarget) return;
  //   if (magnetLockOwner === null) magnetLockOwner = owner;
  // };

  // this.unlockMagnet = function (owner) {
  //   if (!exclusiveMagnetTarget) return;
  //   if (magnetLockOwner === owner) magnetLockOwner = null;
  // };

  // this.getMagnetLockOwner = function () {
  //   return magnetLockOwner;
  // };

  // // ---------------------------
  // // Exclusive magnet target API
  // // ---------------------------

  // this.setExclusiveMagnetTarget = function (b) {
  //   exclusiveMagnetTarget = !!b;
  //   if (!exclusiveMagnetTarget) magnetLockOwner = null;
  // };

  // function isAliveOwner(o) {
  //   if (!o) return false;

  //   // En tu código existe V (array de objetos en la construcción)
  //   if (typeof V !== "undefined" && Array.isArray(V)) {
  //     return V.indexOf(o) !== -1;
  //   }

  //   // fallback conservador si no podemos comprobar
  //   return true;
  // }

  // function cleanupOrphanOwner() {
  //   if (magnetLockOwner && !isAliveOwner(magnetLockOwner)) {
  //     magnetLockOwner = null;
  //   }
  // }

  // this.isExclusiveMagnetTarget = function () {
  //   return !!exclusiveMagnetTarget;
  // };

  // this.lockMagnet = function (owner) {
  //   if (!exclusiveMagnetTarget) return true;

  //   cleanupOrphanOwner();

  //   // ocupado por otro
  //   if (magnetLockOwner && magnetLockOwner !== owner) return false;

  //   magnetLockOwner = owner;
  //   return true;
  // };

  // this.unlockMagnet = function (owner) {
  //   if (!exclusiveMagnetTarget) return;

  //   cleanupOrphanOwner();

  //   if (magnetLockOwner === owner) magnetLockOwner = null;
  // };

  // this.getMagnetLockOwner = function () {
  //   cleanupOrphanOwner();
  //   return magnetLockOwner;
  // };
  // ---------------------------
// Exclusive magnet target API
// ---------------------------

this.setExclusiveMagnetTarget = function (b) {
  exclusiveMagnetTarget = !!b;
  if (!exclusiveMagnetTarget) magnetLockOwner = null;
};

this.isExclusiveMagnetTarget = function () {
  return !!exclusiveMagnetTarget;
};

// function isAliveOwner(owner) {
//   if (!owner) return false;

//   // ✅ solo revisar puntos existentes
//   if (typeof Cn !== "undefined" && Cn && typeof Cn.getAllObjectsFromType === "function") {
//     var pts = Cn.getAllObjectsFromType("point") || [];
//     return pts.indexOf(owner) !== -1;
//   }

//   // fallback conservador
//   return true;
// }

function isAliveOwner(owner) {
  if (!owner) return false;

  var C = this.__Cn;
  if (C && typeof C.getAllObjectsFromType === "function") {
    var pts = C.getAllObjectsFromType("point") || [];
    return pts.indexOf(owner) !== -1;
  }

  // Si no tenemos Construction, no podemos comprobar: asumimos vivo
  return true;
}

function cleanupOrphanOwner() {
  if (magnetLockOwner && !isAliveOwner.call(this, magnetLockOwner)) {
    magnetLockOwner = null;
  }
}



this.lockMagnet = function (owner) {
  if (!exclusiveMagnetTarget) return true;

  cleanupOrphanOwner.call(this);

  // ocupado por otro
  if (magnetLockOwner && magnetLockOwner !== owner) return false;

  magnetLockOwner = owner;
  return true;
};

this.unlockMagnet = function (owner) {
  if (!exclusiveMagnetTarget) return;

  cleanupOrphanOwner.call(this);

  if (magnetLockOwner === owner) magnetLockOwner = null;
};

this.getMagnetLockOwner = function () {
  cleanupOrphanOwner.call(this);
  return magnetLockOwner;
};
}

