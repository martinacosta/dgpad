function MagnetManager(_z) {
  var me = this;
  var zc = _z;
  var C = zc.getConstruction();

  var O = null; // origin object
  var T = null; // target object
  var M = null; // Magnets objects
  var PXY = new VirtualPointObject(0, 0); // proyección ortogonal de O sobre T

  // UI state (lo que el usuario ve)
  var standardM = 20; // valor UI
  var standardUnit = "px"; // "px" | "u"

  var P = null;

  function getPxPerUnit() {
    try {
      var cs =
        (C && typeof C.getCoordsSystem === "function" ? C.getCoordsSystem() : null) ||
        (C && C.coordsSystem ? C.coordsSystem : null);

      var ppu = cs && typeof cs.getUnit === "function" ? Number(cs.getUnit()) : 1; // px/u
      if (isFinite(ppu) && ppu > 0) return ppu;
    } catch (e) {}
    return 1;
  }

  function toPxForce(uiVal, unit) {
    var v = Number(uiVal);
    if (!isFinite(v)) return NaN;
    return unit === "u" ? v * getPxPerUnit() : v;
  }

  function unpackPayload(_payload) {
    if (_payload && typeof _payload === "object") {
      return {
        uiVal: Number(_payload.value),
        unit: _payload.unit === "u" ? "u" : "px",
      };
    }
    return { uiVal: Number(_payload), unit: standardUnit };
  }

  var valueChanged = function (_payload) {
    if (O === null || T === null) return;

    var u = unpackPayload(_payload);
    if (!isFinite(u.uiVal)) return;

    // 0 (en ambas unidades) desactiva el imán
    if (u.uiVal === 0) {
      O.removeMagnet(T[0]);
      setPaintMode();
      zc.paint();
      return;
    }

    
    var forcepaint = O.getMagnet(T[0]) === null;

    // ✅ Guardar en la unidad elegida (sin convertir aquí)
    var force = u.uiVal;
    var unit = u.unit; // "px" | "u"

    // El motor almacena [obj, force, unit] y PointObject hará u->px en runtime
    T = O.addMagnet(T[0], force);
    T[1] = force;
    T[2] = unit;

    // Metadata UI (opcional; ya coincide con lo guardado)
    T._uiVal = u.uiVal;
    T._uiUnit = u.unit;

    standardM = u.uiVal;
    standardUnit = u.unit;

    T[0].setMacroMode(3);
    if (forcepaint) {
    setPaintMode();
    zc.paint();
    }
  };

  var setPaintMode = function () {
    var V = C.elements();
    for (var i = 0, len = V.length; i < len; i++) {
      V[i].setMacroMode(0);
    }
    if (O) O.setMacroMode(2);

    M = O.getMagnets();
    for (var j = 0; j < M.length; j++) {
      var tgt = M[j][0];
      if (tgt && typeof tgt.setMacroMode === "function") tgt.setMacroMode(3);
    }
  };

  me.edit = function (_o) {
    O = _o;
    zc.setMode(9);
    setPaintMode();
    T = null;

    P = new MagnetPanel(zc, valueChanged);
    P.setXY(-300, -300);

    standardM = 20;
    standardUnit = "px";
    P.setUnit(standardUnit);
    P.setValue(standardM);
  };

  me.add = function (_o) {
    if (_o === O) return;
    if (_o.projectXY(0, 0) === undefined) return;

    var valPx = toPxForce(standardM, standardUnit);
    if (!isFinite(valPx) || valPx === 0) return;

    // Motor SIEMPRE en px
    T = O.addMagnet(_o, valPx);
    T[1] = valPx;
    T[2] = "px";

    // Metadata UI
    T._uiVal = standardM;
    T._uiUnit = standardUnit;

    setPaintMode();
    zc.paint();

    P.setUnit(T._uiUnit || "px");
    P.setValue(T._uiVal != null ? T._uiVal : standardM);
  };

  me.paint = function (ctx) {
    if (O === null || T === null) return;

    switch (T[0].getCode()) {
      case "arc3pts":
        PXY.setXY(T[0].getB().getX(), T[0].getB().getY());
        break;
      case "segment":
        PXY.setXY(
          (T[0].getP1().getX() + T[0].getP2().getX()) / 2,
          (T[0].getP1().getY() + T[0].getP2().getY()) / 2
        );
        break;
      case "point":
        PXY.setXY(T[0].getX(), T[0].getY());
        break;
      default:
        var t = T[0].projectXY(O.getX(), O.getY());
        PXY.setXY(t[0], t[1]);
    }

    P.setXY(PXY.getX() - 152, PXY.getY() + 17);
  };

  me.quit = function () {
    if (P) P.quit();
  };
}

function MagnetPanel(_zc, _proc) {
  var me = this;
  $U.extend(this, new Panel(_zc.getDocObject()));
  me.setAttr("className", "magnetDIV bulleM");
  _zc.getDocObject().parentNode.appendChild(me.getDocObject());

  var currentUnit = "px"; // "px" | "u"

  function sliderToUiValue(v) {
    var n = Number(v);
    return currentUnit === "u" ? n / 100 : n;
  }

  function uiValueToSlider(v) {
    var n = Number(v);
    return currentUnit === "u" ? Math.round(n * 100) : n;
  }

  function applyUnitToSlider(unit) {
    currentUnit = unit === "u" ? "u" : "px";

    if (currentUnit === "u") {
      // slider interno: -1000..1000 => UI: -10.00..10.00
      S.setTabValues([
        [-1000, "-10"],
        [-500, "-5"],
        [-200, "-2"],
        [-100, "-1"],
        [-50, "-0.5"],
        [-20, "-0.2"],
        [-10, "-0.1"],
        [0, $L.magnet_without],
        [10, "0.1"],
        [20, "0.2"],
        [50, "0.5"],
        [100, "1"],
        [200, "2"],
        [500, "5"],
        [1000, "10"],
      ]);
    } else {
      S.setTabValues([
        [-1000, "-1000"],
        -500,
        -200,
        -100,
        -50,
        -30,
        -20,
        -15,
        -10,
        -5,
        -2,
        -1,
        [0, $L.magnet_without],
        1,
        2,
        5,
        10,
        15,
        20,
        30,
        50,
        100,
        200,
        500,
        [1000, "1000"],
      ]);
    }
  }

  // Slider (siempre -1000..1000 internamente)
  var S = new slider(me.getDocObject(), 20, 5, 280, 30, -1000, 1000, 0, function (v) {
    var payload = { value: sliderToUiValue(v), unit: U.getValue() };
    _proc(payload);
  });

  S.setValueWidth(80);
  S.setTextColor("#BBBBBB");
  S.setBackgroundColor("rgba(0,0,0,0)");
  S.setWindowsEvents();

  // Dropdown unidad
  var U = (function () {
    var sel = document.createElement("select");
    sel.style.position = "absolute";
    sel.style.left = "310px";
    sel.style.top = "5px";
    sel.style.height = "30px";
    sel.style.background = "rgba(0,0,0,0.35)";
    sel.style.color = "#BBBBBB";
    sel.style.border = "1px solid rgba(255,255,255,0.15)";
    sel.style.borderRadius = "6px";
    sel.style.padding = "0 6px";
    sel.style.outline = "none";

    var optPx = document.createElement("option");
    optPx.value = "px";
    optPx.textContent = "px";
    sel.appendChild(optPx);

    var optU = document.createElement("option");
    optU.value = "u";
    optU.textContent = "u";
    sel.appendChild(optU);

    sel.addEventListener("change", function () {
      applyUnitToSlider(sel.value);
      _proc({ value: sliderToUiValue(S.getValue()), unit: sel.value });
    });

    me.getDocObject().appendChild(sel);

    return {
      getValue: function () {
        return sel.value === "u" ? "u" : "px";
      },
      setValue: function (v) {
        sel.value = v === "u" ? "u" : "px";
      },
    };
  })();

  // Init
  applyUnitToSlider("px");
  S.setValue(20);

  this.quit = function () {
    S.removeWindowsEvents();
    if (me.getDocObject().parentNode !== null) {
      _zc.getDocObject().parentNode.removeChild(me.getDocObject());
    }
  };

  this.setXY = function (_x, _y) {
    this.setStyles("left:" + _x + "px;top:" + _y + "px");
  };

  // Set UI value (en px: entero; en u: decimal permitido)
  this.setValue = function (uiVal) {
    S.setValue(uiValueToSlider(uiVal));
  };

  this.setUnit = function (unit) {
    U.setValue(unit);
    applyUnitToSlider(unit);
  };
}