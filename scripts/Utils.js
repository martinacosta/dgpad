// Global utils object "$U" accessible from everywhere :
var $U = {};

$U.doublePI = 2 * Math.PI;
$U.halfPI = Math.PI / 2;
$U.DE_width = (localStorage.getItem("doceval_width")) ? parseInt(localStorage.getItem("doceval_width")) : 800; // DocEval applet width
$U.DE_height = (localStorage.getItem("doceval_height")) ? parseInt(localStorage.getItem("doceval_height")) : 600; // DocEval applet width
$U.DE_question = (localStorage.getItem("doceval_question")) ? localStorage.getItem("doceval_question") : ""; // DocEval question
$U.nullproc = function() {};

//escala para que las figuras conserven las proporciones en pantallas diferentes
$U.escala=1; 

$U.lang = function() {
    var language_Code = navigator.language || navigator.userLanguage;
    language_Code = language_Code.toUpperCase().split("-")[0];
    // Trouver éventuellement un paramètre de langue dans le script du body :
    if ($BODY_SCRIPT.hasAttribute("data-lang"))
        language_Code = $BODY_SCRIPT.getAttribute("data-lang").toUpperCase();
    return language_Code
}


$U.katexLoaded = function(_callback, _args) {
    

    if (typeof katex === 'undefined') {
        if ((_callback) && ($U.katexLoaded.callbacks.indexOf(_callback) === -1)) {
            $U.katexLoaded.callbacks.push(_callback);
            
            $U.katexLoaded.args.push(_args);
        }
        if (!$U.katexLoaded.loaded) {
            
            var parent = document.getElementsByTagName("head")[0];
            var lnk = document.createElement("link");
            lnk.rel = "stylesheet";
            lnk.href = $APP_PATH + "NotPacked/thirdParty/katex.min.css";
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = $APP_PATH + "NotPacked/thirdParty/katex.min.js";
            script.onload = function() {
                for (var i = 0; i < $U.katexLoaded.callbacks.length; i++) {
                    if ($U.katexLoaded.callbacks[i]) {
                        var proc = $U.katexLoaded.callbacks[i];
                        var args = $U.katexLoaded.args[i];
                        // callback will be call twice because
                        // of dynamic font loading :
                        proc.apply(null, args);
                        setTimeout(function() {
                            proc.apply(null, args);
                        }, 500);
                    }
                }
            }
            parent.appendChild(lnk);
            parent.appendChild(script);
            $U.katexLoaded.loaded = true;
            
        }
        return false;
    }
    return true;
}

$U.katexLoaded.loaded = false;
$U.katexLoaded.callbacks = [];
$U.katexLoaded.args = [];





$U.native2ascii = function(str) {
    var out = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) < 0x80) {
            out += str.charAt(i);
        } else {
            var u = "" + str.charCodeAt(i).toString(16);
            out += "\\u" + (u.length === 2 ? "00" + u : u.length === 3 ? "0" + u : u);
        }
    }
    return out;
};

// Convert numéric string with 0->a, 1->b, 2->c, etc...
$U.number2letter = function(_n) {
    var a = "a".charCodeAt(0);
    var z = "0".charCodeAt(0);
    var st = "";
    for (var i = 0; i < _n.length; i++) {
        st += String.fromCharCode(a + _n.charCodeAt(i) - z);
    }
    return st;
};

$U.isStr = function(_x) {
    return (typeof _x === "string");
};
$U.isArray = function(_x) {
    return (Object.prototype.toString.call(_x) === '[object Array]');
};
$U.parseList = function(tab, prec) {
    if ($U.isArray(tab)) {
        var elts = [];
        var len = tab.length;
        var maxlen = (len < 3) ? len : 3;
        var sep = "[???" + $L.comma + "???" + $L.comma + "???]";
        var elt;
        for (var i = 0; i < maxlen; i++) {
            elt = $U.parseArray(tab[i], prec);
            if (elt === sep) elts.push("\u2702")
            else elts.push(elt);
        }
        if (len > maxlen) {
            elts.push("... (" + len + " " + $L.expression_item + ")")
        }
        return "[" + elts.join(" " + $L.comma + " ") + "]";
    } else {
        if (isNaN(tab))
            return "???";
        else
            return ($L.number(Math.round(tab * prec) / prec));
    }
};
$U.parseArray = function(tab, prec) {
    if ($U.isArray(tab)) {
        var elts = [];
        for (var i = 0, len = tab.length; i < len; i++) {
            elts.push($U.parseArray(tab[i], prec));
        }
        return "[" + elts.join($L.comma) + "]";
    } else {
        if (isNaN(tab))
            return "???";
        else
            return ($L.number(Math.round(tab * prec) / prec));
    }
};
$U.parseArrayEnglish = function(tab, prec) {
    if ($U.isArray(tab)) {
        var elts = [];
        for (var i = 0, len = tab.length; i < len; i++) {
            elts.push($U.parseArrayEnglish(tab[i], prec));
        }
        return "[" + elts.join(",") + "]";
    } else {
        if (isNaN(tab))
            return "???";
        else
            return (prec ? (Math.round(tab * prec) / prec) : tab);
    }
};
$U.addTextToInput = function(_field, _n, _tpe) {
    switch (_tpe) {
        case "replace":
            _field.value = _n;
            break;
        case "add":
            var startPos = _field.selectionStart;
            var endPos = _field.selectionEnd;
            _field.value = _field.value.substring(0, startPos) + _n + _field.value.substring(endPos, _field.value.length);
            _field.selectionStart = startPos + _n.length;
            _field.selectionEnd = startPos + _n.length;
            break;
    }
};

$U.isPoint = function(_t) {
    if (!$U.isArray(_t))
        return false;
    if ((isNaN(_t[0])) || (isNaN(_t[1])))
        return false;
    if ((_t.length === 2) || (_t.length === 3))
        return true;
    return false;
};
$U.isPointArray = function(_t) {
    if (!$U.isArray(_t))
        return false;
    if (_t.length === 0)
        return false;
    for (var i = 0; i < _t.length; i++) {
        if (!$U.isPoint(_t[i]))
            return false;
    }
    return true;
};
$U.isPointArrayWithNaN = function(_t) {
    if (!$U.isArray(_t))
        return false;
    if (_t.length === 0)
        return false;
    for (var i = 0; i < _t.length; i++) {
        if ((!$U.isArray(_t[i])) || (_t[i].length < 2) || (_t[i].length > 3))
            return false;
    }
    return true;
};

$U.isVar = function(_s, _v) {
    return (new RegExp("(\\W|^)" + _v + "([^\\(]|$)").test(_s));
};

// Récupère les variables eventuelles d'une formule
// sous forme de chaine :
// Recupera las variables eventuales de una fórmula en forma de cadena :
$U.getVars = function(_s) {
    var vars = [];
    if ($U.isVar(_s, "x"))
        vars.push("x");
    if ($U.isVar(_s, "y"))
        vars.push("y");
    if ($U.isVar(_s, "z"))
        vars.push("z");
    if ($U.isVar(_s, "t"))
        vars.push("t");
    return vars.join(",");
};

$U.startChrono = function() {
    var d = new Date();
    $U.startTime = d.getTime();
};
$U.getChrono = function() {
    var d = new Date();
    return (d.getTime() - $U.startTime);
};
$U.getTime = function() {
    var d = new Date();
    return (d.getTime());
};


$U.preloadImage = function(_p) {
    var img = new Image();
    img.src = _p;
};

$U.log = function(_x) {
    return Math.log(_x) / Math.LN10;
};

// Distance entre deux points :
// Distancia entre dos puntos :
$U.d = function(p1, p2) {
    return Math.sqrt((p2.getX() - p1.getX()) * (p2.getX() - p1.getX()) + (p2.getY() - p1.getY()) * (p2.getY() - p1.getY()));
};


// Renvoie l'angle que forme un vecteur (x;y) avec l'horizontale
// dans l'intervalle [0;2π[ orienté dans le sens trigo :
// Devuelve el ángulo que forma un vector (x;y) con la horizontal en el intervalo [0;2π[ en el sentido trigo :
$U.angleH = function(x, y) {
    if (y < 0)
        return Math.atan2(-y, x);
    else
        return Math.atan2(-y, x) + $U.doublePI;
};

// Compare en dessous de la précision du logiciel (1E-10) :
// compara por debajo de la precisión del software (1E-10) :
$U.approximatelyEqual = function(a, b) {
    return (Math.abs(a - b) < 1E-10);
};

// Renvoie les coordonnées du vecteur AB normé :
// Devuelve las coordenadas del vector AB normado :
$U.normalize = function(xA, yA, xB, yB) {
    var l = Math.sqrt((xB - xA) * (xB - xA) + (yB - yA) * (yB - yA));
    return {
        x: (xB - xA) / l,
        y: (yB - yA) / l
    };
};

// For line objects :
$U.computeBorderPoints = function(xA, yA, dx, dy, W, H) {
    // On centre un cercle autour de A d'un rayon supérieur à la diagonale
    // du canvas (W+H). Forcément les point (xmin,ymin) et (xmax,ymax) de
    // ce cercle seront à l'extérieur du canvas
	// Se centra un círculo alrededor de A con un radio superior a la diagonal
	// del canvas (W+H). Forzosamente los puntos (xmin,ymin) y (xmax,ymax) de
	// ese círculo estan por fuera del canvas.
    var l = W + H + Math.abs(xA) + Math.abs(yA);
    return [xA - l * dx, yA - l * dy, xA + l * dx, yA + l * dy];
};

// For circle objects :
$U.computeRay = function(xA, yA, xB, yB) {
    var x = (xB - xA);
    var y = (yB - yA);
    return Math.sqrt(x * x + y * y);
};

// For circle3 objects :
$U.computeCenter = function(xA, yA, xB, yB, xC, yC) {
    var xAC = xC - xA,
        xCB = xB - xC,
        xBA = xA - xB;
    var yAC = yC - yA,
        yCB = yB - yC,
        yBA = yA - yB;
    var d = 2 * (xB * yAC + xC * yBA + xA * yCB);

    var x = (xB * xB * yAC + xC * xC * yBA + xA * xA * yCB - yAC * yBA * yCB) / d;
    var y = (xAC * xBA * xCB - xCB * yA * yA - xAC * yB * yB - xBA * yC * yC) / d;

    return [x, y];
};

$U.computeArcParams = function(xA, yA, xB, yB, xC, yC) {
    var xAC = xC - xA,
        xCB = xB - xC,
        xBA = xA - xB;
    var yAC = yC - yA,
        yCB = yB - yC,
        yBA = yA - yB;
    var d = 2 * (xB * yAC + xC * yBA + xA * yCB);

    // Coordonnées du centre du cercle :
	// coordenadas del centro del círculo:
    var xO = (xB * xB * yAC + xC * xC * yBA + xA * xA * yCB - yAC * yBA * yCB) / d;
    var yO = (xAC * xBA * xCB - xCB * yA * yA - xAC * yB * yB - xBA * yC * yC) / d;


    var startangle = $U.angleH(xA - xO, yA - yO);
    var endangle = $U.angleH(xC - xO, yC - yO);
    var trigo = (xBA * yCB < yBA * xCB);

    // Calcul de la mesure de l'angle AOC (dans [0;2π]) :
	// Cálculo de la medida del ángulo AOC (en [0;2π]) :
    var AOC = (trigo) ? (endangle - startangle) : ($U.doublePI - endangle + startangle);
    AOC += ((AOC < 0) - (AOC > $U.doublePI)) * $U.doublePI;

    return {
        centerX: xO,
        centerY: yO,
        startAngle: startangle,
        endAngle: endangle,
        Trigo: trigo,
        AOC: AOC
    };
};

$U.computeAngleParams = function(xA, yA, xO, yO, xC, yC) {
    
    var xOC = xC - xO,
        xOA = xA - xO;
    var yOC = yC - yO,
        yOA = yA - yO;

    var startangle = $U.angleH(xOA, yOA);
    
    var endangle = $U.angleH(xOC, yOC);
    
    var trigo = (xOA * yOC < yOA * xOC);



    var AOC180;

    // Calcul de la mesure de l'angle AOC orienté trigo (dans [0;2π]) :
	// Cálculo de la medida del ángulo AOC orientado trigo (en [0;2π]) :
    //  if(Math.abs(xA-xO+yA-yO)<0.01||Math.abs(xC-xO+yC-yO)<0.01){var AOC=NaN} else{
	//  AOC = endangle - startangle;}
    AOC = endangle - startangle;
     
    AOC += ((AOC < 0) - (AOC > $U.doublePI)) * $U.doublePI;

    // Calcul de la mesure de l'angle AOC (dans [0;π]) :
	// Cálculo de la medida del ángulo AOC (en [0;2π]) :
    if (AOC > Math.PI)
        AOC180 = $U.doublePI - AOC;
    else
        AOC180 = AOC;

    return {
        startAngle: startangle,
        endAngle: endangle,
        Trigo: trigo,
        AOC: AOC,
        AOC180: AOC180
    };
};

// d est la distance en dessous de laquelle on est jugé "near" :
// d es la distancia por debajo de la cual se considera "near" :
$U.isNearToPoint = function(xA, yA, xB, yB, d) {
    if (isNaN(xA + yA + xB + yB))
        return false;
    var xab = xB - xA;
    var yab = yB - yA;
    return ((xab * xab + yab * yab) < (d * d));
};

// d est la distance en dessous de laquelle on est jugé "near" :
// d es la distancia por debajo de la cual se considera "near" :
$U.isNearToCircle = function(xA, yA, r, xM, yM, d) {
    if (isNaN(xA + yA + r))
        return false;
    var x = (xM - xA);
    var y = (yM - yA);
    return (Math.abs(x * x + y * y - r * r - d * d) < (2 * d * r));
};


$U.ptOnArc = function(xO, yO, xM, yM, fromAngle, toAngle, trigo) {
    var m = $U.angleH(xM - xO, yM - yO);
    var e_a = (trigo) ? (toAngle - fromAngle) : ($U.doublePI - toAngle + fromAngle);
    if (e_a > $U.doublePI)
        e_a -= $U.doublePI;
    if (e_a < 0)
        e_a += $U.doublePI;
    //        if (!trigo) e_a=-e_a;

    var e_m = (trigo) ? (m - fromAngle) : ($U.doublePI - toAngle + m);
    if (e_m > $U.doublePI)
        e_m -= $U.doublePI;
    if (e_m < 0)
        e_m += $U.doublePI;

    return (e_m < e_a);
};


// d est la distance en dessous de laquelle on est jugé "near" :
// d es la distancia por debajo de la cual se considera "near" :
$U.isNearToArc = function(xO, yO, AOC, fromAngle, toAngle, trigo, r, xM, yM, d) {
    if (isNaN(xO + yO + r))
        return false;

    var x = (xM - xO);
    var y = (yM - yO);
    if (Math.abs(x * x + y * y - r * r - d * d) > (2 * d * r))
        return false;

    var m = $U.angleH(xM - xO, yM - yO);
    var GOM = (trigo) ? m - fromAngle : ($U.doublePI - toAngle + m);
    GOM += ((GOM < 0) - (GOM > $U.doublePI)) * $U.doublePI;

    if (GOM > AOC)
        return false;
    return true;
};


// d est la distance en dessous de laquelle on est jugé "near" :
// d es la distancia por debajo de la cual se considera "near" :
$U.isNearToLine = function(xA, yA, dx, dy, xM, yM, d) {
    if (isNaN(xA + yA + dx + dy))
        return false;
    var a = dy * (xM - xA) + dx * (yA - yM);
    var MH2 = (a * a) / (dx * dx + dy * dy);
    return (MH2 < (d * d));
};

// d est la distance en dessous de laquelle on est jugé "near" :
// d es la distancia por debajo de la cual se considera "near" :
$U.isNearToSegment = function(xA, yA, xB, yB, xM, yM, d) {
    if (isNaN(xA + yA + xB + yB))
        return false;
    var a = xM * (yB - yA) + xB * (yA - yM) + xA * (yM - yB);
    var xab = xB - xA;
    var yab = yB - yA;
    var dab = xab * xab + yab * yab;
    if (dab < 1e-13)
        return false;
    var MH2 = (a * a) / dab;
    // Le point est loin de la droite :
    if (MH2 > (d * d))
        return false;
    var MAMB = (xA - xM) * (xB - xM) + (yA - yM) * (yB - yM);
    // Le point dépasse des extrémités du segment :
	// El punto sobrepasa los extremos del segmento :
    if (MAMB > MH2)
        return false;
    return true;
};

// d est la distance en dessous de laquelle on est jugé "near" :
// d es la distancia por debajo de la cual se considera "near" :
$U.isNearToRay = function(xA, yA, xB, yB, xM, yM, d) {
    if (isNaN(xA + yA + xB + yB))
        return false;
    var a = xM * (yB - yA) + xB * (yA - yM) + xA * (yM - yB);
    var xab = xB - xA;
    var yab = yB - yA;
    var dab = xab * xab + yab * yab;
    if (dab < 1e-13)
        return false;
    var MH2 = (a * a) / dab;
    // Le point est loin de la droite :
	// el punto está lejos de la recta :
    if (MH2 > (d * d))
        return false;
    var MAMB = (xA - xM) * (xB - xM) + (yA - yM) * (yB - yM);
    // Le point dépasse des extrémités du segment [AB] :
	// El punto sobrepasa los extremos del segmento [AB] :
    if (MAMB > MH2) {
        var MA2 = (xA - xM) * (xA - xM) + (yA - yM) * (yA - yM);
        var MB2 = (xB - xM) * (xB - xM) + (yB - yM) * (yB - yM);
        if (MA2 < MB2) {
            return false;
        }
    }
    return true;
};

$U.drawPartialLine = function(ctx, xA, yA, xB, yB, iA, iB) {
    var sStyle = ctx.strokeStyle;
    var d = $U.normalize(xA, yA, xB, yB);
    var spc = $P.size.partiallines;
    var xa = xA - iA * spc * d.x,
        ya = yA - iA * spc * d.y;
    var xb = xB + iB * spc * d.x,
        yb = yB + iB * spc * d.y;
    if (iA) {
        var xinf = xA - 3 * spc * d.x,
            yinf = yA - 3 * spc * d.y;
        var grd1 = ctx.createLinearGradient(xinf, yinf, xa, ya);
        grd1.addColorStop(0, "white");
        grd1.addColorStop(1, sStyle);
        ctx.beginPath();
        ctx.strokeStyle = grd1;
        ctx.moveTo(xinf, yinf);
        ctx.lineTo(xa, ya);
        ctx.closePath();
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.strokeStyle = sStyle;
    ctx.moveTo(xa, ya);
    ctx.lineTo(xb, yb);
    ctx.closePath();
    ctx.stroke();
    if (iB) {
        var xsup = xB + 3 * spc * d.x,
            ysup = yB + 3 * spc * d.y;
        var grd2 = ctx.createLinearGradient(xb, yb, xsup, ysup);
        grd2.addColorStop(0, sStyle);
        grd2.addColorStop(1, "white");
        ctx.beginPath();
        ctx.strokeStyle = grd2;
        ctx.moveTo(xb, yb);
        ctx.lineTo(xsup, ysup);
        ctx.closePath();
        ctx.stroke();
    }
};



$U.extend = function(_obj, _superObject) {    
    for (var sProperty in _superObject) {        
        _obj[sProperty] = _superObject[sProperty];    
    }
    return _superObject;
};

//$U.MOUSEEVENT = document.createEvent("MouseEvent");

$U.PadToMouseEvent = function(_touch) {
    var ev = document.createEvent("MouseEvent");
    ev.initMouseEvent("mouseup", true, true, window, 1,
        _touch.screenX, _touch.screenY,
        _touch.clientX, _touch.clientY, false,
        false, false, false, 0, null);
    return ev;
};

//$U.PadToMouseEvent = function(_touch) {
//    $U.MOUSEEVENT.initMouseEvent("mouseup", true, true, window, 1,
//            _touch.screenX, _touch.screenY,
//            _touch.clientX, _touch.clientY, false,
//            false, false, false, 0, null);
//    return $U.MOUSEEVENT;
//};




$U.hexToRGB = function(h) {
    if (h.charAt(0) === "#") {
        var cut = h.substring(1, 7);
        var r = parseInt(cut.substring(0, 2), 16);
        var g = parseInt(cut.substring(2, 4), 16);
        var b = parseInt(cut.substring(4, 6), 16);
        return {
            "r": r,
            "g": g,
            "b": b
        };
    } else {
        return {
            "r": 0,
            "g": 0,
            "b": 0
        };
    }
};

$U.hexToHSV = function(h) {
    var rgb = $U.hexToRGB(h);
    var rr, gg, bb,
        r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c) {
            return (v - c) / 6 / diff + 1 / 2;
        };
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        } else if (g === v) {
            h = (1 / 3) + rr - bb;
        } else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

// Associe une liste de styles (séparés par ;) à un élément DOM :
// Asocia una lista de estilos (separados por ;) a un elemento DOM :
$U.STL = function(_dom, _st) {
    var t = _st.split(";");
    for (var i = 0, len = t.length; i < len; i++) {
        var a = t[i].split(":");
        _dom.style.setProperty(a[0].replace(/^\s+|\s+$/g, ''), a[1].replace(/^\s+|\s+$/g, ''));
    }
};

// Associe une liste d'attributs (séparés par ;) à un élément DOM :
// Asocia una lista de atributos (separados por ;) a un elemento DOM :
$U.ATT = function(_dom, _st) {
    var t = _st.split(";");
    for (var i = 0, len = t.length; i < len; i++) {
        var a = t[i].split(":");
        _dom.setAttribute(a[0].replace(/^\s+|\s+$/g, ''), a[1].replace(/^\s+|\s+$/g, ''));
    }
};

$U.getElementOffset = function(obj) {
    var obj2 = obj;
    var curtop = 0;
    var curleft = 0;
    if (document.getElementById || document.all) {
        do {
            curleft += obj.offsetLeft - obj.scrollLeft;
            curtop += obj.offsetTop - obj.scrollTop;
            obj = obj.offsetParent;
            obj2 = obj2.parentNode;
            while (obj2 !== obj) {
                curleft -= obj2.scrollLeft;
                curtop -= obj2.scrollTop;
                obj2 = obj2.parentNode;
            }
        } while (obj.offsetParent)
    } else if (document.layers) {
        curtop += obj.y;
        curleft += obj.x;
    }
    return {
        "left": curleft,
        "top": curtop
    };
};


// Renvoie "-moz" ou "-webkit" ou "-o" en fonction du navigateur :
// Devuelve "-moz" o "-webkit" o "-o" en función del navegador :
$U.browserCode = function() {
    if (navigator.appVersion.indexOf("MSIE 10") != -1)
        return "-ms";
    if ('MozBoxSizing' in document.documentElement.style)
        return "-moz";
    if ('WebkitTransform' in document.documentElement.style)
        return "-webkit";
    return "-o";
};

$U.scolor = function(h) {
    var c = $U.hexToRGB(h);
    return (c.r + ",," + c.g + ",," + c.b);
};



$U.loadFile = function(fileName) {
    var request = new XMLHttpRequest();
    try {
        request.open("GET", fileName, false);
        request.send();
        return request.responseText;
    } catch (e) {
        return "";
    }
};



$U.leaveAccents = function(s) {
    var r = s.replace(new RegExp("\\s", 'g'), "");
    // r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
    // r = r.replace(new RegExp("æ", 'g'), "ae");
    // r = r.replace(new RegExp("ç", 'g'), "c");
    // r = r.replace(new RegExp("[èéêë]", 'g'), "e");
    // r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
    // r = r.replace(new RegExp("ñ", 'g'), "n");
    // r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
    // r = r.replace(new RegExp("œ", 'g'), "oe");
    // r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
    // r = r.replace(new RegExp("[ýÿ]", 'g'), "y");

    // r = r.replace(new RegExp("[ÀÁÂÃÄÅ]", 'g'), "A");
    // r = r.replace(new RegExp("Æ", 'g'), "AE");
    // r = r.replace(new RegExp("Ç", 'g'), "C");
    // r = r.replace(new RegExp("[ÈÉÊË]", 'g'), "E");
    // r = r.replace(new RegExp("[ÌÍÎÏ]", 'g'), "I");
    // r = r.replace(new RegExp("Ñ", 'g'), "N");
    // r = r.replace(new RegExp("[ÒÓÔÕÖ]", 'g'), "O");
    // r = r.replace(new RegExp("Œ", 'g'), "OE");
    // r = r.replace(new RegExp("[ÙÚÛÜ]", 'g'), "U");
    // r = r.replace(new RegExp("[ÝŸ]", 'g'), "Y");
    // r = r.replace(new RegExp("\\W", 'g'), "");
    r = r.replace(new RegExp("[^àáâãäåæçèéêëìíîïñòóôõöœùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖŒÙÚÛÜÝŸΆΈ-ώἀ-ῼa-zA-Z0-9_]", 'g'), "");
    return r;
};

//$U.leaveAccents = function(s, _uppercase) {
//    var r = s.toLowerCase();
//    r = r.replace(new RegExp("\\s", 'g'), "");
//    r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
//    r = r.replace(new RegExp("æ", 'g'), "ae");
//    r = r.replace(new RegExp("ç", 'g'), "c");
//    r = r.replace(new RegExp("[èéêë]", 'g'), "e");
//    r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
//    r = r.replace(new RegExp("ñ", 'g'), "n");
//    r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
//    r = r.replace(new RegExp("œ", 'g'), "oe");
//    r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
//    r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
//    r = r.replace(new RegExp("\\W", 'g'), "");
//    if (_uppercase)
//        r = r.toUpperCase();
//    return r;
//};

$U.utf8_encode = function(string) {
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
};

$U.utf8_decode = function(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
};


// source : https://developer.mozilla.org/fr/docs/D%C3%A9coder_encoder_en_base64
$U.base64_encode = function(_data) {
    return window.btoa(unescape(encodeURIComponent(_data)));
};

$U.base64_decode = function(_data) {
    return decodeURIComponent(escape(window.atob(_data)));
};


$U.extractDelta = function(e) {
    var n = null;
    if (e.wheelDelta)
        n = e.wheelDelta;
    else if (e.detail)
        n = e.detail * -40;
    else if (e.originalEvent && e.originalEvent.wheelDelta)
        n = e.originalEvent.wheelDelta;
    return isNaN(n) ? 0 : n;
};

$U.isFullLocalStorage = function() {
    var n = 0;
    for (var i = $P.localstorage.max; i > 0; i--) {
        var c = JSON.parse(localStorage.getItem($P.localstorage.base + i));
        if (c && c.lock)
            n++;
    }
    return (n >= ($P.localstorage.max - 1));
};

$U.addDomUtils = function(el) {
    el.event_proc = [];
    el.stl = function(_p, _v) {
        el.style.setProperty(_p, _v);
    };
    el.att = function(_a, _v) {
        el[_a] = _v;
    };
    
    el.stls = function(_st) {
        if (typeof _st !== "string") {
            console.warn("❗️stls recibió valor no válido:", _st);
            return;
        }
        var t = _st.split(";");
        for (var i = 0; i < t.length; i++) {
            var a = t[i].split(":");
            if (a.length === 2) {
                el.stl(a[0].trim(), a[1].trim());
            }
        }
    };
    
    el.bnds = function(l, t, w, h) {
        el.stls("left:" + l + "px;top:" + t + "px;width:" + w + "px;height:" + h + "px");
    };
    el.center = function(w, h) {
        var winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        el.bnds((winW - w) / 2, (winH - h) / 2, w, h);
    };
    el.add = function(_ch) {
        el.appendChild(_ch);
    };
    el.rmv = function(_ch) {
        el.removeChild(_ch);
    };
    el.md = function(_p) {
        el.addEventListener('touchstart', _p, false);
        el.addEventListener('mousedown', _p, false);
        el.event_proc.push(_p);
    };
    el.mm = function(_p) {
        el.addEventListener('touchmove', _p, false);
        el.addEventListener('mousemove', _p, false);
        el.event_proc.push(_p);
    };
    el.mu = function(_p) {
        el.addEventListener('touchend', _p, false);
        el.addEventListener('mouseup', _p, false);
        el.event_proc.push(_p);
    };
    el.kd = function(_p) {
        el.addEventListener('keydown', _p, false);
        el.event_proc.push(_p);
    };
    el.ku = function(_p) {
        el.addEventListener('keyup', _p, false);
        el.event_proc.push(_p);
    };
    el.rmevt = function() {
        for (var i = 0; i < el.event_proc.length; i++) {
            el.removeEventListener('touchstart', el.event_proc[i], false);
            el.removeEventListener('mousedown', el.event_proc[i], false);
            el.removeEventListener('touchmove', el.event_proc[i], false);
            el.removeEventListener('mousemove', el.event_proc[i], false);
            el.removeEventListener('touchend', el.event_proc[i], false);
            el.removeEventListener('mouseup', el.event_proc[i], false);
            el.removeEventListener('keydown', el.event_proc[i], false);
            el.removeEventListener('keyup', el.event_proc[i], false);
        }
        el.event_proc = [];
    };
    return el;
}

$U.createDiv = function(_otherType) {
    var el = document.createElement((_otherType === undefined) ? "div" : _otherType);
    return $U.addDomUtils(el);
};

$U.button = function(_mess, _proc) {
    var wrapper = $U.createDiv();
    wrapper.stls("position:absolute;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;width:250px;height:30px;line-height:30px;top:5px;left:50%;transform:translate(-50%,0);text-align:center;vertical-align:middle;background-color:#8CD4FF;color:blaxk;border:none;box-shadow:none;font-size:17px;font-weight:500;-webkit-border-radius:4px;border-radius:5px;cursor: pointer");
    wrapper.innerText = _mess;
    wrapper.mu(_proc);
    window.document.body.appendChild(wrapper);
};


// $U.alert = function(_mess, _w, _h, _font, _size, _style, _align) {
//     const font = _font || "Arial";
//     const size = _size || "24";
//     const style = _style || "normal";
//     const align = _align || "center";

//     const scrn = $U.createDiv();
//     const wp = $U.createDiv();
//     const msg = $U.createDiv();
//     const ok = $U.createDiv();

//     scrn.stls(`
//         position:fixed;
//         z-index:10000;
//         overflow:auto;
//         background-color:rgba(50,50,50,0.7);
//         left:0;
//         top:0;
//         width:100vw;
//         height:100vh;
//         display:flex;
//         justify-content:center;
//         align-items:center;
//     `);

//     wp.stls(`
//         background-color:white;
//         border-radius:10px;
//         padding:20px;
//         font-family:${font};
//         font-style:${style};
//         color:#444;
//         text-align:${align};
//         max-width:90vw;
//         min-width:300px;
//         box-shadow:0 2px 8px rgba(0,0,0,0.2);
//     `);

//     msg.stls(`
//         font-size:${size}px;
//         margin-bottom:20px;
//         white-space:pre-wrap;
//         word-wrap:break-word;
//     `);

//     msg.innerHTML = _mess.replace(/\\n/g, "<br>");

//     ok.stls(`
//         display:inline-block;
//         padding:10px 20px;
//         background-color:#8CD4F5;
//         color:white;
//         border:none;
//         font-size:17px;
//         font-weight:500;
//         border-radius:5px;
//         cursor:pointer;
//     `);
//     ok.innerHTML = $L.blockly.prompt_ok || "Ok";

//     ok.onclick = () => {
//         scrn.innerHTML = "";
//         document.body.removeChild(scrn);
//     };

//     wp.add(msg);
//     wp.add(ok);
//     scrn.add(wp);
//     document.body.appendChild(scrn);
// };

// utils: $U.alert
$U.alert = function(_mess, _w, _h, _font, _size, _style, _align, _speaker) {
  const font = _font || "Arial";
  const size = _size || "24";
  const style = _style || "normal";
  const align = _align || "center";
  const speakerEnabled = !!_speaker;

  const scrn = $U.createDiv();
  const wp = $U.createDiv();
  const msg = $U.createDiv();
  const ok = $U.createDiv();

  // ✅ nuevo (botón altoparlante)
  const spk = $U.createDiv();

  let speaking = false;

  function ttsSupported() {
    return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  }

  function normalizeText(t) {
    return String(t == null ? "" : t).replace(/\s+/g, " ").trim();
  }

  function setSpeakerUI() {
    spk.innerHTML = speaking ? "⏹️" : "🔊";
    spk.setAttribute("title", speaking ? "Detener lectura" : "Leer en voz alta");
    spk.setAttribute("aria-label", speaking ? "Detener lectura" : "Leer en voz alta");
  }

  function stopSpeak() {
    try { window.speechSynthesis.cancel(); } catch(e) {}
    speaking = false;
    setSpeakerUI();
  }

  function toggleSpeak() {
    if (!ttsSupported()) return;
    const text = normalizeText(_mess);
    if (!text) return;

    if (speaking) {
      stopSpeak();
      return;
    }

    stopSpeak();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-CO";
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;

    u.onend = () => { speaking = false; setSpeakerUI(); };
    u.onerror = () => { speaking = false; setSpeakerUI(); };

    speaking = true;
    setSpeakerUI();
    window.speechSynthesis.speak(u);
  }

  scrn.stls(`
    position:fixed;
    z-index:10000;
    overflow:auto;
    background-color:rgba(50,50,50,0.7);
    left:0;
    top:0;
    width:100vw;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
  `);

  wp.stls(`
    background-color:white;
    border-radius:10px;
    padding:20px;
    font-family:${font};
    font-style:${style};
    color:#444;
    text-align:${align};
    max-width:90vw;
    min-width:300px;
    box-shadow:0 2px 8px rgba(0,0,0,0.2);
  `);

  msg.stls(`
    font-size:${size}px;
    margin-bottom:20px;
    white-space:pre-wrap;
    word-wrap:break-word;
  `);

  msg.innerHTML = String(_mess).replace(/\\n/g, "<br>");

  ok.stls(`
    display:inline-block;
    padding:10px 20px;
    background-color:#8CD4F5;
    color:white;
    border:none;
    font-size:17px;
    font-weight:500;
    border-radius:5px;
    cursor:pointer;
  `);
  ok.innerHTML = $L.blockly.prompt_ok || "Ok";

  // ✅ footer row para OK + 🔊
  const footer = $U.createDiv();
  footer.stls(`
    display:flex;
    justify-content:flex-end;
    align-items:center;
    gap:10px;
  `);

  if (speakerEnabled && ttsSupported()) {
    spk.stls(`
      display:inline-flex;
      width:40px;
      height:40px;
      border-radius:10px;
      justify-content:center;
      align-items:center;
      cursor:pointer;
      user-select:none;
      background:rgba(140,212,245,0.2);
      font-size:18px;
    `);
    setSpeakerUI();
    spk.onclick = () => toggleSpeak();
    footer.add(spk);
  }

  ok.onclick = () => {
    stopSpeak(); // ✅ por si está leyendo
    scrn.innerHTML = "";
    document.body.removeChild(scrn);
  };

  wp.add(msg);
  footer.add(ok);
  wp.add(footer);
  scrn.add(wp);
  document.body.appendChild(scrn);
};





$U.prompt = function(_mess, _default, _type, _proc, _w, _h, _inp_w) {
    var w = _w ? _w : 350;
    var h = _h ? _h : 165;
    var t = 40;
    var msg_height = 50; // Message height
    var msg_width = 300; // Message width
    var msg_top = 0; // Distance from message to top
    var inp_height = 36; // Input height
    var inp_width = _inp_w ? _inp_w : 300; // Input width
    var inp_top = 55; // Distance from input to top
    var ok_top = 120; // Ok btn top
    var ok_width = 80; // Ok btn width
    var ok_height = 30; // Ok btn height
    var ok_right = 23; // Ok btn right margin
    var cancel_left = 23; // Cancel btn left margin

    var scrn = $U.createDiv();
    var wp = $U.createDiv();
    var msg = $U.createDiv();
    var inw = $U.createDiv(); // Input wrapper div
    var inp = null; // Real input
    var ok = $U.createDiv();
    var cancel = $U.createDiv();

    scrn.stls("position:absolute;z-index:10000;overflow:hidden;background-color:rgba(50,50,50,0.7)");
    wp.stls("position:absolute;border-radius:5px;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-weight: 300;letter-spacing: 1.2px;overflow:hidden;border: 1px solid #b4b4b4;transition:transform 0.2s linear;transform:translate(0px,-200px);background-color:rgba(255,255,255,1)");
    msg.stls("position:relative;text-align:center;display:table-cell;vertical-align:bottom;color:#797979;font-size:16px;white-space: pre-wrap;margin:0px;overflow:hidden");
    inw.stls("position:absolute;border: 0px;border: 1px solid #555");
    ok.stls("position:absolute;text-align:center;vertical-align:middle;background-color:#8CD4F5;color:white;border:none;box-shadow:none;font-size:17px;font-weight:500;-webkit-border-radius:4px;border-radius:5px;cursor: pointer");
    cancel.stls("position:absolute;text-align:center;vertical-align:middle;background-color:#C1C1C1;color:white;border:none;box-shadow:none;font-size:17px;font-weight:500;-webkit-border-radius:4px;border-radius:5px;cursor: pointer");
    inw.stl("line-height", inp_height + "px");
    var winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    scrn.bnds(0, 0, winW, winH);
    wp.bnds((winW - w) / 2, t, w, h);
    msg.bnds((w - msg_width) / 2, msg_top, msg_width, msg_height);
    msg.innerHTML = _mess;
    inw.bnds((w - inp_width) / 2, inp_top, inp_width, inp_height);
    ok.bnds(w - ok_width - ok_right, ok_top, ok_width, ok_height);
    ok.innerHTML = $L.blockly.prompt_ok;
    ok.stl("line-height", ok_height + "px");
    cancel.bnds(cancel_left, ok_top, ok_width, ok_height);
    cancel.innerHTML = $L.blockly.prompt_cancel;
    cancel.stl("line-height", ok_height + "px");

    var valid = function(ev) {
        ev.preventDefault();
        if (inp.value !== "")
            _proc(_default, inp.value);
        inp.blur();
        window.document.body.removeChild(scrn);
    };
    var fixOkColor = function() {
        if (inp.value === "") ok.stl("background-color", "#8CD4F5")
        else ok.stl("background-color", "#4BB6DB")
    };
    scrn.kd(function(ev) {
        if (ev.keyCode === 13) valid(ev);
    });
    scrn.ku(function(ev) {
        fixOkColor()
    });
    scrn.md(function(ev) {
        ev.stopPropagation();
    });
    ok.mu(valid);
    ok.mm(function(ev) {
        ok.stl("background-color", "#1EAAD0");
        ev.stopPropagation();
    });
    cancel.mm(function(ev) {
        cancel.stl("background-color", "#b9b9b9");
        ev.stopPropagation();
    });
    cancel.mu(function() {
        window.document.body.removeChild(scrn);
    });
    wp.mm(function() {
        fixOkColor();
        cancel.stl("background-color", "#C1C1C1");
    });
    wp.add(msg);
    wp.add(inw);
    wp.add(ok);
    wp.add(cancel);
    scrn.add(wp);
    window.document.body.appendChild(scrn);
    setTimeout(function() {
        wp.stls("transform:translate(0px,0px)");
    }, 1);
    setTimeout(function() {
        // Tout ceci pour changer le clavier iOS : sans correcteur ortho, sans capitales en standard, etc...
        inw.innerHTML = '<input type="' + _type + '" id="dgpad_prompt_area" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">';
        inp = $U.addDomUtils(document.getElementById("dgpad_prompt_area"));
        inp.stls("position:absolute;padding:0px;margin:0px;-webkit-appearance: none;border-radius: 0;-webkit-user-select: text;user-select: text;overflow: hidden;font-weight: 600;border: 0px solid #555;font-size: 24px;text-align: center;white-space: pre-wrap;margin: 0px;vertical-align:middle;color: rgb(50,50,50);outline:none");
        inp.bnds(0, 0, inp_width, inp_height);
        inp.value = _default;
        inp.onfocus = function(e) {
            e.preventDefault();
            setTimeout(function() {
                inp.setSelectionRange(0, 9999);
            }, 0)
        };
        if (!Object.touchpad) inp.focus();
    }, 200);
}
//MEAG



$U.confirm = function (_mess, _w, _h, _font, _size, _style, _align, _yes = "Sí", _no = "No", _speaker = false) {
  return new Promise((resolve) => {
    const w = _w || 450;
    const h = _h || 200;

    const font = _font || "Arial";
    const size = _size || "24";
    const style = _style || "normal";
    const align = _align || "center";
    const speakerEnabled = !!_speaker;

    const scrn = $U.createDiv();
    const wp = $U.createDiv();
    const msg = $U.createDiv();
    const btnContainer = $U.createDiv();
    const ok = $U.createDiv();
    const cancel = $U.createDiv();

    // Speaker (centro)
    const spk = $U.createDiv();
    let speaking = false;

    function ttsSupported() {
      return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
    }

    function normalizeText(t) {
      return String(t == null ? "" : t).replace(/\s+/g, " ").trim();
    }

    function setSpeakerUI() {
      spk.innerHTML = speaking ? "⏹️" : "🔊";
      spk.setAttribute("title", speaking ? "Detener lectura" : "Leer en voz alta");
      spk.setAttribute("aria-label", speaking ? "Detener lectura" : "Leer en voz alta");
    }

    function stopSpeak() {
      try { window.speechSynthesis.cancel(); } catch (e) {}
      speaking = false;
      setSpeakerUI();
    }

    function toggleSpeak() {
      if (!ttsSupported()) return;
      const text = normalizeText(_mess);
      if (!text) return;

      if (speaking) {
        stopSpeak();
        return;
      }

      stopSpeak();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-CO";
      u.rate = 1;
      u.pitch = 1;
      u.volume = 1;

      u.onend = () => { speaking = false; setSpeakerUI(); };
      u.onerror = () => { speaking = false; setSpeakerUI(); };

      speaking = true;
      setSpeakerUI();
      window.speechSynthesis.speak(u);
    }

    scrn.stls("position:fixed;z-index:10000;overflow:hidden;background-color:rgba(50,50,50,0.7);left:0;top:0;width:100vw;height:100vh;");

    wp.stls(`position:absolute;border-radius:5px;font-family:${font};font-style:${style};overflow:hidden;
      border:1px solid #b4b4b4;transition:transform 0.2s linear;background-color:white;text-align:${align};
      padding:20px;min-height:${h}px;min-width:${w}px;display:flex;flex-direction:column;justify-content:space-between;`);

    msg.stls(`text-align:${align};color:#444;font-size:${size}px;font-style:${style};white-space:pre-wrap;
      font-family:${font};margin-bottom:20px;`);

    // ✅ Contenedor con 3 columnas: No | 🔊 | Sí
    btnContainer.stls("display:flex;align-items:center;width:100%;");

    const btnCommon = `text-align:center;border:none;box-shadow:none;font-weight:500;border-radius:5px;cursor:pointer;
      font-family:${font};font-size:${size}px;font-style:${style};padding:10px 20px;`;

    ok.stls(`${btnCommon}background-color:#1EAAD0;color:white;`);
    cancel.stls(`${btnCommon}background-color:#C1C1C1;color:white;`);

    msg.innerHTML = String(_mess).replace(/\\n/g, "<br>");
    ok.innerHTML = _yes;
    cancel.innerHTML = _no;

    function closeWith(val) {
      stopSpeak();
      document.body.removeChild(scrn);
      resolve(val);
    }

    ok.onclick = function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      closeWith(true);
    };

    cancel.onclick = function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      closeWith(false);
    };

    scrn.md(ev => ev.stopPropagation());

    // ✅ 3 columnas con flex para centrar el speaker respecto a la caja modal
    const left = $U.createDiv();
    const center = $U.createDiv();
    const right = $U.createDiv();

    left.stls("flex:1;display:flex;justify-content:flex-start;align-items:center;");
    center.stls("flex:0;display:flex;justify-content:center;align-items:center;min-width:60px;");
    right.stls("flex:1;display:flex;justify-content:flex-end;align-items:center;");

    left.add(cancel);
    right.add(ok);

    if (speakerEnabled && ttsSupported()) {
      spk.stls(`
        display:inline-flex;
        width:40px;height:40px;
        border-radius:10px;
        justify-content:center;
        align-items:center;
        cursor:pointer;
        user-select:none;
        background:rgba(140,212,245,0.2);
        font-size:18px;
      `);
      setSpeakerUI();
      spk.onclick = () => toggleSpeak();
      center.add(spk);
    }

    btnContainer.add(left);
    btnContainer.add(center);
    btnContainer.add(right);

    wp.add(msg);
    wp.add(btnContainer);
    scrn.add(wp);
    document.body.appendChild(scrn);

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    wp.stl("left", `${(winW - wp.offsetWidth) / 2}px`);
    wp.stl("top", `${(winH - wp.offsetHeight) / 2}px`);

    setTimeout(() => {
      wp.stls(wp.style.cssText + "transform:translate(0px,0px);");
    }, 1);
  });
};




$U.createCustomInput = function(id, x, y, width, height, fontSize) {
    let input;
    const escala = $U.escala || 1; // Asegura que haya un valor

    if (!document.getElementById(id)) {
        input = document.createElement("input");
        input.type = "text";
        input.id = id;
        document.body.appendChild(input);
        if (!$U.inputs) $U.inputs = {};
        $U.inputs[id] = input;
        

    } else {
        input = $U.inputs[id];
    }

    // 🔧 Asignar todos los estilos juntos
    input.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: ${width * escala}px;
        font-size: ${fontSize * escala}px;
        height: ${(fontSize * escala) + 6}px;
        line-height: ${fontSize * escala}px;
        padding: 3px 6px;
        border: 1px solid #888;
        border-radius: 4px;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        text-align: center;
        display: block;
    `;

    // 📡 Listener para enviar mensaje
    if (!input.dataset.listenerAdded) {
        input.addEventListener("input", () => {
            const iframe = document.querySelector("iframe[name=DGPad0]");
            iframe?.contentWindow?.postMessage({
                action: "update-input-value",
                id: input.id,
                value: input.value
            }, "*");
        });
        input.dataset.listenerAdded = "true";
    }
};




$U.createCustomNumberInput = function (id, x, y, width, fontSize, min, max, step) {
  const escala = $U.escala || 1;

  const inputId = String(id || "");
  if (!inputId) return null;

  let input = document.getElementById(inputId);

  if (!input) {
    input = document.createElement("input");
    input.type = "number";
    input.title = "";
    input.id = inputId;

    input.autocomplete = "off";
    input.setAttribute("autocomplete", "off");
    input.setAttribute("name", "fake" + Math.random()); // evita autofill

    document.body.appendChild(input);
  }

  if (!$U.inputs) $U.inputs = {};
  $U.inputs[inputId] = input;

  // attrs numéricos
  if (min != null) input.min = String(min);
  if (max != null) input.max = String(max);
  if (step != null) input.step = String(step);

  // valor inicial razonable si está vacío
  if (input.value === "" && min != null && max != null) {
    const mn = Number(min);
    const mx = Number(max);
    if (Number.isFinite(mn) && Number.isFinite(mx)) {
      input.value = String(Math.round((mn + mx) / 2));
    }
  }

  // estilo
  input.style.cssText = `
    position: absolute;
    top: ${y}px;
    left: ${x}px;
    width: ${Number(width) * escala}px;
    font-size: ${Number(fontSize) * escala}px;
    height: ${(Number(fontSize) * escala) + 6}px;
    line-height: ${Number(fontSize) * escala}px;
    padding: 3px 6px;
    border: 1px solid #888;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    text-align: center;
    display: block;
  `;

  return input;
};



//MEAG
$U.inputs={};

$U.cronometros = {};


$U.renamePointInInputMeta = function renamePointInInputMeta(oldName, newName) {
  if (!$U.inputMeta) return;

  const oldN = String(oldName || "");
  const newN = String(newName || "");
  if (!oldN || !newN || oldN === newN) return;

  // 1) actualizar meta (labels de dropdowns)
  for (const id of Object.keys($U.inputMeta)) {
    const meta = $U.inputMeta[id];
    if (meta && meta.pointName === oldN) meta.pointName = newN;
  }

  // 2) actualizar texto visible de expresiones numéricas (NO cambiar exprKey)
  try {
    const construction = window.$CANVAS?.getConstruction?.();
    if (construction) {
      for (const id of Object.keys($U.inputMeta)) {
        const meta = $U.inputMeta[id];
        if (!meta || meta.type !== "number" || !meta.exprKey) continue;

        // solo las del punto renombrado (ya actualizado a newN)
        if (meta.pointName !== newN) continue;

        const exprObj = construction.find(meta.exprKey);
        if (exprObj && typeof exprObj.setT === "function") {
          exprObj.setT(`ValorListaNumeros${meta.pointName} ${meta.n}=`);
          exprObj.compute?.();
        }
      }
    }
  } catch (e) {
    console.warn("No se pudieron actualizar textos de expresiones numéricas:", e);
  }

  // 3) opcional: avisar al iframe para actualizar TAB (numeración)
  const iframe = document.querySelector('iframe[name="DGPad0"]');
  iframe?.contentWindow?.postMessage({
    action: "rename-point-for-tab",
    oldName: oldN,
    newName: newN
  }, "*");
};

$U.renamePointInMathLiveMeta = function renamePointInMathLiveMeta(oldName, newName) {
  if (!$U.mathLiveMeta) return;

  const oldN = String(oldName || "");
  const newN = String(newName || "");
  if (!oldN || !newN || oldN === newN) return;

  // 1) actualizar meta local (labels de dropdowns)
  for (const id of Object.keys($U.mathLiveMeta)) {
    const meta = $U.mathLiveMeta[id];
    if (meta && meta.pointName === oldN) {
      meta.pointName = newN;
    }
  }

  // 2) avisar al iframe para actualizar TURTLE_VARS.TAB
  const iframe = document.querySelector('iframe[name="DGPad0"]');
  iframe?.contentWindow?.postMessage({
    action: "rename-point-for-tab",
    oldName: oldN,
    newName: newN
  }, "*");
};


$U.deleteCustomInputById = function deleteCustomInputById(id) {
    

  const inputId = String(id || "");
  if (!inputId) return;

  const meta = $U.inputMeta?.[inputId];
  const exprKey = meta?.exprKey;

  // 1) borrar input DOM
  const el = ($U.inputs && $U.inputs[inputId]) || document.getElementById(inputId);
  if (el?.parentNode) el.parentNode.removeChild(el);

  // 2) borrar expresión asociada (si existe)
  try {
    const construction = window.$CANVAS?.getConstruction?.();
    if (construction && exprKey) {
      const exprObj = construction.find(exprKey);
      if (exprObj) {
        // Mejor: remove (evita recursión). Fallback: safelyDelete.
        if (typeof construction.remove === "function") construction.remove(exprObj);
        else construction.safelyDelete?.(exprObj);
      }
    }
  } catch (e) {
    console.warn("No se pudo borrar la expresión asociada:", exprKey, e);
  }

  // 3) limpiar registries
  if ($U.inputs) delete $U.inputs[inputId];
  if ($U.inputMeta) delete $U.inputMeta[inputId];

  // 4) limpiar cache iframe
  const iframe = document.querySelector('iframe[name="DGPad0"]');
  iframe?.contentWindow?.postMessage({ action: "delete-input", id: inputId }, "*");
};



// Borra TODAS las casillas asociadas a un punto por nombre visible
$U.deleteInputsForPointName = function deleteInputsForPointName(pointName) {
  const name = String(pointName || "");
  if (!name) return;

  const meta = $U.inputMeta || {};
  const idsToDelete = [];

  for (const id of Object.keys(meta)) {
    if (meta[id]?.pointName === name) idsToDelete.push(id);
  }

  for (const id of idsToDelete) $U.deleteCustomInputById(id);
};

$U.createCustomCronometro = function(id, x, y, fontSize = 20) {
    const escala = $U.escala || 1;
    if (!$U.cronometros) $U.cronometros = {};

    let cronometro = document.getElementById(id);
    const isNew = !cronometro;

    if (isNew) {
        cronometro = document.createElement("div");
        cronometro.id = id;
        document.body.appendChild(cronometro);

        cronometro.dataset.time = "0";
        cronometro.dataset.running = "false";
        cronometro.dataset.startTime = "";
        cronometro.textContent = "00:00";
    }

    // Siempre adjuntar los métodos, nuevo o no
    function formatTime(ms) {
        const totalSec = Math.floor(ms / 1000);
        const min = Math.floor(totalSec / 60).toString().padStart(2, "0");
        const sec = (totalSec % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    }

    cronometro.start = function () {
        if (this.dataset.running === "false") {
            this.dataset.startTime = Date.now().toString();
            this.dataset.running = "true";
        }
    };

    cronometro.stop = function () {
        if (this.dataset.running === "true") {
            const now = Date.now();
            const start = parseInt(this.dataset.startTime);
            const elapsed = now - start;
            this.dataset.time = (parseInt(this.dataset.time) + elapsed).toString();
            this.dataset.running = "false";
        }
    };

    cronometro.reset = function () {
        this.dataset.time = "0";
        this.dataset.startTime = "";
        this.dataset.running = "false";
        this.textContent = "00:00";
    };

    cronometro.show = function () {
        this.style.display = "block";
    };

    cronometro.hide = function () {
        this.style.display = "none";
    };

    // Actualizar estilo y posición
    cronometro.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        padding: 4px 10px;
        font-size: ${fontSize * escala}px;
        font-family: Arial, sans-serif;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 6px;
        text-align: center;
        display: block;
        z-index: 10000;
    `;

    // Iniciar el intervalo una sola vez
    if (!$U.cronometroInterval) {
        $U.cronometroInterval = setInterval(() => {
            for (const id in $U.cronometros) {
                const el = $U.cronometros[id];
                if (el.dataset.running === "true") {
                    const start = parseInt(el.dataset.startTime);
                    const now = Date.now();
                    const elapsed = parseInt(el.dataset.time) + (now - start);
                    el.textContent = formatTime(elapsed);
                }
            }
        }, 250);
    }

    $U.cronometros[id] = cronometro;
};



$U.createCustomSpeaker = function (id, x, y, size) {
    if ($U.__suppressSpeakersUntil && Date.now() < $U.__suppressSpeakersUntil) return null;


  let btn;
  const escala = $U.escala || 1;

  id = String(id || "");
  if (!id) return null;

  if (!$U.speakers) $U.speakers = {};

  if (!document.getElementById(id)) {
    btn = document.createElement("button");
    btn.type = "button";
    btn.id = id;

    // ✅ marcas para poder borrarlos por selector
    btn.dataset.dgpadSpeaker = "true";
    btn.dataset.speakerId = id;

    $U.speakers[id] = btn;

    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="70%" height="70%" aria-hidden="true" focusable="false">' +
      '<path d="M3 10v4c0 .55.45 1 1 1h3l4 3c.66.5 1.6.03 1.6-.8V6.8c0-.83-.94-1.3-1.6-.8L7 9H4c-.55 0-1 .45-1 1z"></path>' +
      '<path d="M16.5 8.5a1 1 0 0 1 1.41 0 7 7 0 0 1 0 9.9 1 1 0 1 1-1.41-1.41 5 5 0 0 0 0-7.07 1 1 0 0 1 0-1.42z"></path>' +
      '<path d="M18.8 6.2a1 1 0 0 1 1.41 0 10 10 0 0 1 0 14.1 1 1 0 0 1-1.41-1.41 8 8 0 0 0 0-11.3 1 1 0 0 1 0-1.39z"></path>' +
      "</svg>";

    btn.setAttribute("aria-label", "Leer texto en voz alta");
    btn.title = "Leer texto en voz alta";
    document.body.appendChild(btn);
  } else {
    btn = $U.speakers[id] || document.getElementById(id);
    $U.speakers[id] = btn;

    // ✅ por si existía de antes sin dataset
    btn.dataset.dgpadSpeaker = "true";
    btn.dataset.speakerId = id;
  }

  const px = Number(x) || 0;
  const py = Number(y) || 0;
  const baseSize = Math.max(24, Number(size) || 56);
  const scaledSize = baseSize * escala;

  btn.style.cssText = `
    position: absolute;
    left: ${px}px;
    top: ${py}px;
    width: ${scaledSize}px;
    height: ${scaledSize}px;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0,0,0,.18);
    background: rgba(255,255,255,.92);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    z-index: 999999;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    touch-action: manipulation;
  `;

  if (!btn.dataset.listenerAdded) {
    let lastFire = 0;

    const speakNow = (ev) => {
      const now = Date.now();
      if (now - lastFire < 350) return;
      lastFire = now;

      if (ev && ev.type !== "click") ev.preventDefault?.();

      const st = btn.__ttsState || {};
      const text = String(st.text || "").trim();
      if (!text) return;

      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

      const u = new SpeechSynthesisUtterance(text);
      const opts = st.opts || {};

      if (opts.lang && opts.lang !== "auto") u.lang = opts.lang;

      u.rate = Math.max(0.1, Math.min(10, Number(opts.rate || 1)));
      u.pitch = Math.max(0, Math.min(2, Number(opts.pitch || 1)));
      u.volume = Math.max(0, Math.min(1, Number(opts.volume || 1)));

      try {
        speechSynthesis.cancel();
        speechSynthesis.resume?.();
        setTimeout(() => speechSynthesis.speak(u), 0);
      } catch (_) {}
    };

    btn.addEventListener("pointerdown", speakNow, { passive: false });
    btn.addEventListener("touchend", speakNow, { passive: false });
    btn.addEventListener("click", speakNow, { passive: true });

    btn.dataset.listenerAdded = "true";
  }

  return btn;
};

// ✅ NUEVO: borrar uno por id (limpia DOM + registry)
$U.removeCustomSpeaker = function (id) {
  id = String(id || "");
  if (!id) return;

  const btn = ($U.speakers && $U.speakers[id]) || document.getElementById(id);
  if (btn && btn.parentNode) btn.parentNode.removeChild(btn);

  if ($U.speakers) delete $U.speakers[id];
};




$U.clearCustomSpeakers = function () {
  // ✅ evita recreaciones durante deleteAll/refresh/computeAll
  $U.__suppressSpeakersUntil = Date.now() + 1500;

  const hardRemove = () => {
    // borra por registry
    if ($U?.speakers) {
      Object.keys($U.speakers).forEach((id) => {
        const el = $U.speakers[id];
        try { el?.parentNode?.removeChild(el); } catch (_) {}
      });
      $U.speakers = {};
    }

    // borra por DOM (huérfanos)
    try {
      document.querySelectorAll('button[id^="spk_"]').forEach(el => el.remove());
      document.querySelectorAll('button[data-dgpad-speaker="true"]').forEach(el => el.remove());
    } catch (_) {}
  };

  hardRemove();

  // ✅ por si computeAll/refresh re-crea en el siguiente tick
  setTimeout(hardRemove, 0);
  setTimeout(hardRemove, 50);
  setTimeout(hardRemove, 250);

  try { window.speechSynthesis?.cancel?.(); } catch (_) {}
};




$U.renamePointInSpeakerMeta = function renamePointInSpeakerMeta(oldName, newName) {
  if (!$U.speakerMeta) return;

  const oldN = String(oldName || "");
  const newN = String(newName || "");
  if (!oldN || !newN || oldN === newN) return;

  for (const id of Object.keys($U.speakerMeta)) {
    const meta = $U.speakerMeta[id];
    if (meta && meta.pointName === oldN) meta.pointName = newN;
  }
};

$U.deleteCustomSpeakerById = function deleteCustomSpeakerById(id) {
  const speakerId = String(id || "");
  if (!speakerId) return;

  const el = ($U.speakers && $U.speakers[speakerId]) || document.getElementById(speakerId);
  if (el?.parentNode) el.parentNode.removeChild(el);

  if ($U.speakers) delete $U.speakers[speakerId];
  if ($U.speakerMeta) delete $U.speakerMeta[speakerId];

  const iframe = document.querySelector('iframe[name="DGPad0"]');
  iframe?.contentWindow?.postMessage({ action: "delete-speaker", id: speakerId }, "*");
};

$U.deleteSpeakersForPointName = function deleteSpeakersForPointName(pointName) {
  const name = String(pointName || "");
  if (!name) return;

  const meta = $U.speakerMeta || {};
  const idsToDelete = [];

  for (const id of Object.keys(meta)) {
    if (meta[id]?.pointName === name) idsToDelete.push(id);
  }

  for (const id of idsToDelete) $U.deleteCustomSpeakerById(id);
};



$U.setCustomSpeakerVisible = function (id, visible) {
  if (!$U.speakers) $U.speakers = {};
  const el = $U.speakers[id] || document.getElementById(id);
  if (!el) return;
  el.style.display = visible ? "flex" : "none";
};

$U.removeCustomSpeaker = function (id) {
  if (!$U.speakers) $U.speakers = {};
  const el = $U.speakers[id] || document.getElementById(id);
  if (el) el.remove();
  delete $U.speakers[id];
};

$U.mathLiveLoaded = function(_callback, _args) {
    if (typeof MathfieldElement === 'undefined') {
        if ((_callback) && ($U.mathLiveLoaded.callbacks.indexOf(_callback) === -1)) {
            $U.mathLiveLoaded.callbacks.push(_callback);
            $U.mathLiveLoaded.args.push(_args);
        }

        if (!$U.mathLiveLoaded.loaded) {
            var parent = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = $APP_PATH + "NotPacked/thirdParty/mathlive.min.js";

            script.onload = function() {
                if (typeof MathfieldElement !== "undefined") {
                    MathfieldElement.fontsDirectory = $APP_PATH + "NotPacked/thirdParty/fonts";
                }
                for (var i = 0; i < $U.mathLiveLoaded.callbacks.length; i++) {
                    if ($U.mathLiveLoaded.callbacks[i]) {
                        var proc = $U.mathLiveLoaded.callbacks[i];
                        var args = $U.mathLiveLoaded.args[i];
                        proc.apply(null, args || []);
                    }
                }
            };

            parent.appendChild(script);
            $U.mathLiveLoaded.loaded = true;
        }
        return false;
    }
    return true;
};

$U.mathLiveLoaded.loaded = false;
$U.mathLiveLoaded.callbacks = [];
$U.mathLiveLoaded.args = [];



$U.mathLiveFields = $U.mathLiveFields || {};
$U.mathLiveMeta = $U.mathLiveMeta || Object.create(null);





$U.setMathLivePartsColor = function(id, color) {
    const styleId = "mathlive-style-" + id;
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
        math-field#${id}::part(content) {
            color: ${color};
        }
        math-field#${id}::part(prompt) {
            color: ${color};
        }
    `;
};


// $U.createCustomMathLive = function(id, x, y, width, height, latex, options) {
    

//     const fieldId = String(id || "");
//     if (!fieldId) return null;

//     const escala = $U.escala || 1;
//     const opts = options || {};
//     const readOnly = !!opts.readOnly;
//     const virtualKeyboardMode = opts.virtualKeyboardMode || "manual";
//     const promptNames = Array.isArray(opts.promptNames) ? opts.promptNames : [];

//     function dgpadColorIndexToCss(index) {
//         const COLS = 7;
//         const PALETTE = [
//             ["#ffffff", "#cccccc", "#c0c0c0", "#999999", "#666666", "#333333", "#000000"],
//             ["#ffcccc", "#ff6666", "#ff0000", "#cc0000", "#990000", "#660000", "#330000"],
//             ["#ffcc99", "#ff9966", "#ff9900", "#ff6600", "#cc6600", "#993300", "#663300"],
//             ["#ffff99", "#ffff66", "#ffcc66", "#ffcc33", "#cc9933", "#996633", "#663333"],
//             ["#ffffcc", "#ffff33", "#ffff00", "#ffcc00", "#999900", "#666600", "#333300"],
//             ["#99ff99", "#66ff99", "#33ff33", "#33cc00", "#009900", "#006600", "#003300"],
//             ["#99ffff", "#33ffff", "#66cccc", "#00cccc", "#339999", "#336666", "#003333"],
//             ["#ccffff", "#66ffff", "#33ccff", "#3366ff", "#3333ff", "#000099", "#000066"],
//             ["#ccccff", "#9999ff", "#6666cc", "#6633ff", "#6600cc", "#333399", "#330099"],
//             ["#ffccff", "#ff99ff", "#cc66cc", "#cc33cc", "#993399", "#663366", "#330033"]
//         ];
//         const raw = Number(index);
//         const n = Math.max(1, Math.min(Number.isFinite(raw) ? raw : 1, PALETTE.length * COLS));
//         const zeroBased = n - 1;
//         const row = Math.floor(zeroBased / COLS);
//         const col = zeroBased % COLS;
//         return PALETTE[row][col];
//     }

//     const color = dgpadColorIndexToCss(opts.colorIndex);
    

//     const fontFamily = opts.fontFamily || "Arial";
//     const fontSize = Number(opts.fontSize) || 28;
//     const fontStyle = opts.fontStyle || "normal";
//     const fontAlign = opts.fontAlign || "izquierda";

//     const cssFontStyle = fontStyle === "cursiva" ? "italic" : "normal";
//     const cssFontWeight = fontStyle === "negrita" ? "bold" : "normal";
//     const cssTextAlign =
//         fontAlign === "centrado" ? "center" :
//         fontAlign === "derecha" ? "right" :
//         "left";

//     const applyMathLive = function() {
        

//         if (typeof MathfieldElement === "undefined") {
//             console.error("[Utils] MathfieldElement undefined");
//             return;
//         }

//         let mf = document.getElementById(fieldId);
//         if (mf) mf.remove();

//         mf = document.createElement("math-field");
//         mf.id = fieldId;

//         if (readOnly) mf.setAttribute("read-only", "");
//         else mf.removeAttribute("read-only");

//         const coloredLatex = `\\textcolor{${color}}{${String(latex || "")}}`;
        

//         mf.textContent = coloredLatex;
//         document.body.appendChild(mf);

        

//         $U.mathLiveFields[fieldId] = mf;
//         mf.virtualKeyboardMode = virtualKeyboardMode;

//         const finalFontSize = fontSize * escala;
//         const minWidth = Math.max(Number(width) * escala, finalFontSize * 2);
//         const minHeight = Math.max(Number(height) * escala, finalFontSize * 1.6);

//         mf.style.cssText = `
//             position: absolute;
//             left: ${x}px;
//             top: ${y}px;
//             min-width: ${minWidth}px;
//             min-height: ${minHeight}px;
//             box-sizing: border-box;
//             display: inline-block;
//             background: transparent;
//             border: none;
//             outline: none;
//             z-index: 9999;
//             color: ${color};
//             font-family: ${fontFamily};
//             font-size: ${finalFontSize}px;
//             font-style: ${cssFontStyle};
//             font-weight: ${cssFontWeight};
//             text-align: ${cssTextAlign};
//             overflow: visible;
//             padding: 4px 6px;
//             white-space: nowrap;
//         `;

//         requestAnimationFrame(function() {
//             const rect = mf.getBoundingClientRect();
            

//             const finalWidth = Math.max(minWidth, Math.ceil(rect.width));
//             const finalHeight = Math.max(minHeight, Math.ceil(rect.height));

//             mf.style.width = finalWidth + "px";
//             mf.style.height = finalHeight + "px";
//             mf.style.top = (y - finalHeight / 2) + "px";

//             if (mf.executeCommand) {
//                 mf.executeCommand("moveToNextPlaceholder");
//             }
//         });

//         if (!mf.dataset.listenerAdded) {
//             mf.addEventListener("input", function() {
//                 const iframe = document.querySelector('iframe[name="DGPad0"]');
//                 if (!iframe || !iframe.contentWindow) return;

//                 const payload = {
//                     action: "update-mathlive-value",
//                     id: mf.id,
//                     value: mf.value,
//                     prompts: {}
//                 };

//                 if (typeof mf.getPromptValue === "function" && promptNames.length) {
//                     for (let i = 0; i < promptNames.length; i++) {
//                         const name = String(promptNames[i]);
//                         payload.prompts[name] = mf.getPromptValue(name);
//                     }
//                 }

//                 iframe.contentWindow.postMessage(payload, "*");
//             });

//             mf.dataset.listenerAdded = "true";
//         }
//     };

//     if ($U.mathLiveLoaded(null, [])) {
        
//         applyMathLive();
//     } else {
        
//         $U.mathLiveLoaded(applyMathLive, []);
//     }

//     return fieldId;
// };

$U.createCustomMathLive = function(id, x, y, width, height, latex, options) {
    const fieldId = String(id || "");
    if (!fieldId) return null;

    const escala = $U.escala || 1;
    const opts = options || {};
    const readOnly = !!opts.readOnly;
    const virtualKeyboardMode = opts.virtualKeyboardMode || "manual";
    const promptNames = Array.isArray(opts.promptNames) ? opts.promptNames : [];
    const isVisible = opts.visible !== false;

    function dgpadColorIndexToCss(index) {
        const COLS = 7;

        const PALETTE = [
            ["#ffffff", "#cccccc", "#c0c0c0", "#999999", "#666666", "#333333", "#000000"],
            ["#ffcccc", "#ff6666", "#ff0000", "#cc0000", "#990000", "#660000", "#330000"],
            ["#ffcc99", "#ff9966", "#ff9900", "#ff6600", "#cc6600", "#993300", "#663300"],
            ["#ffff99", "#ffff66", "#ffcc66", "#ffcc33", "#cc9933", "#996633", "#663333"],
            ["#ffffcc", "#ffff33", "#ffff00", "#ffcc00", "#999900", "#666600", "#333300"],
            ["#99ff99", "#66ff99", "#33ff33", "#33cc00", "#009900", "#006600", "#003300"],
            ["#99ffff", "#33ffff", "#66cccc", "#00cccc", "#339999", "#336666", "#003333"],
            ["#ccffff", "#66ffff", "#33ccff", "#3366ff", "#3333ff", "#000099", "#000066"],
            ["#ccccff", "#9999ff", "#6666cc", "#6633ff", "#6600cc", "#333399", "#330099"],
            ["#ffccff", "#ff99ff", "#cc66cc", "#cc33cc", "#993399", "#663366", "#330033"]
        ];

        const raw = Number(index);
        const n = Math.max(1, Math.min(Number.isFinite(raw) ? raw : 1, PALETTE.length * COLS));
        const zeroBased = n - 1;
        const row = Math.floor(zeroBased / COLS);
        const col = zeroBased % COLS;

        return PALETTE[row][col];
    }

    const color = dgpadColorIndexToCss(opts.colorIndex);
    const fontFamily = opts.fontFamily || "Arial";
    const fontSize = Number(opts.fontSize) || 28;
    const fontStyle = opts.fontStyle || "normal";
    const fontAlign = opts.fontAlign || "izquierda";

    const cssFontStyle =
        fontStyle === "cursiva" ? "italic" : "normal";

    const cssFontWeight =
        fontStyle === "negrita" ? "bold" : "normal";

    const cssTextAlign =
        fontAlign === "centrado" ? "center" :
        fontAlign === "derecha" ? "right" :
        "left";

    const applyMathLive = function() {
        if (typeof MathfieldElement === "undefined") {
            console.error("MathLive no está disponible");
            return;
        }

        let mf = document.getElementById(fieldId);
        if (mf) {
            mf.remove();
        }

        mf = document.createElement("math-field");
        mf.id = fieldId;

        if (readOnly) {
            mf.setAttribute("read-only", "");
        } else {
            mf.removeAttribute("read-only");
        }

        const coloredLatex = `\\textcolor{${color}}{${String(latex || "")}}`;
        mf.textContent = coloredLatex;
        document.body.appendChild(mf);

        $U.mathLiveFields = $U.mathLiveFields || {};
        $U.mathLiveFields[fieldId] = mf;

        mf.virtualKeyboardMode = virtualKeyboardMode;

        const finalFontSize = fontSize * escala;
        const minWidth = Math.max(Number(width) * escala, finalFontSize * 2);
        const minHeight = Math.max(Number(height) * escala, finalFontSize * 1.6);

        mf.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            min-width: ${minWidth}px;
            min-height: ${minHeight}px;
            box-sizing: border-box;
            display: inline-block;
            background: transparent;
            border: none;
            outline: none;
            z-index: 9999;
            color: ${color};
            font-family: ${fontFamily};
            font-size: ${finalFontSize}px;
            font-style: ${cssFontStyle};
            font-weight: ${cssFontWeight};
            text-align: ${cssTextAlign};
            overflow: visible;
            padding: 4px 6px;
            white-space: nowrap;
        `;

        mf.style.display = isVisible ? "inline-block" : "none";

        const updateBox = function() {
            const rect = mf.getBoundingClientRect();
            const finalWidth = Math.max(minWidth, Math.ceil(rect.width));
            const finalHeight = Math.max(minHeight, Math.ceil(rect.height));

            mf.style.width = finalWidth + "px";
            mf.style.height = finalHeight + "px";
            mf.style.top = (y - finalHeight / 2) + "px";
        };

        requestAnimationFrame(function() {
            updateBox();

            if (mf.executeCommand) {
                mf.executeCommand("moveToNextPlaceholder");
            }

            requestAnimationFrame(updateBox);

            setTimeout(updateBox, 50);
            setTimeout(updateBox, 150);
            setTimeout(updateBox, 300);
        });

        if (!mf.dataset.listenerAdded) {
            mf.addEventListener("input", function() {
                const iframe = document.querySelector('iframe[name="DGPad0"]');
                if (!iframe || !iframe.contentWindow) return;

                const payload = {
                    action: "update-mathlive-value",
                    id: mf.id,
                    value: mf.value,
                    prompts: {}
                };

                if (typeof mf.getPromptValue === "function" && promptNames.length) {
                    for (let i = 0; i < promptNames.length; i++) {
                        const name = String(promptNames[i]);
                        payload.prompts[name] = mf.getPromptValue(name);
                    }
                }

                iframe.contentWindow.postMessage(payload, "*");
            });

            mf.dataset.listenerAdded = "true";
        }
    };

    if ($U.mathLiveLoaded(null, [])) {
        applyMathLive();
    } else {
        $U.mathLiveLoaded(applyMathLive, []);
    }

    return fieldId;
};

$U.refreshAllCustomMathLives = function () {
    const meta = $U.mathLiveMeta || {};
    const ids = Object.keys(meta);

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const m = meta[id];
        if (!m) continue;

        $U.createCustomMathLive(
            id,
            Number(m.x) || 0,
            Number(m.y) || 0,
            Number(m.width) || 120,
            Number(m.height) || 40,
            String(m.latex || ""),
            {
                readOnly: !!m.readOnly,
                virtualKeyboardMode: "manual",
                promptNames: Array.isArray(m.prompts) ? m.prompts.slice() : [],
                colorIndex: Number(m.colorIndex) || 7,
                fontFamily: String(m.fontFamily || "Arial"),
                fontSize: Number(m.fontSize) || 28,
                fontStyle: String(m.fontStyle || "normal"),
                fontAlign: String(m.fontAlign || "izquierda"),
                visible: m.visible !== false
            }
        );
    }
};

$U.setCustomMathLiveValue = function (id, latex, readOnly) {
  const fieldId = String(id || "");
  if (!fieldId) return;

  $U.mathLiveLoaded(function () {
    const mf = $U.mathLiveFields[fieldId] || document.getElementById(fieldId);
    if (!mf) return;

    if (typeof readOnly === "boolean") {
      mf.readOnly = readOnly;
    }

    mf.value = String(latex || "");
    $U.mathLiveFields[fieldId] = mf;
  }, []);
};

$U.moveCustomMathLive = function (id, x, y, width, height) {
  const fieldId = String(id || "");
  if (!fieldId) return;

  const escala = $U.escala || 1;
  const mf = $U.mathLiveFields[fieldId] || document.getElementById(fieldId);
  if (!mf) return;

  if (x != null) mf.style.left = `${x}px`;
  if (y != null) mf.style.top = `${y}px`;
  if (width != null) mf.style.width = `${Number(width) * escala}px`;
  if (height != null) mf.style.height = `${Number(height) * escala}px`;
};

$U.deleteCustomMathLiveById = function (id) {
  const fieldId = String(id || "");
  if (!fieldId) return;

  const el = $U.mathLiveFields[fieldId] || document.getElementById(fieldId);
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }

  delete $U.mathLiveFields[fieldId];
  delete $U.mathLiveMeta[fieldId];

  const iframe = document.querySelector('iframe[name="DGPad0"]');
  iframe?.contentWindow?.postMessage({
    action: "delete-mathlive",
    id: fieldId
  }, "*");
};

$U.deleteMathLiveForPointName = function (pointName) {
    
  const name = String(pointName || "");
  if (!name) return;

  const meta = $U.mathLiveMeta || {};
  const idsToDelete = [];

  for (const id of Object.keys(meta)) {
    if (meta[id] && meta[id].pointName === name) {
      idsToDelete.push(id);
    }
  }

  for (let i = 0; i < idsToDelete.length; i++) {
    $U.deleteCustomMathLiveById(idsToDelete[i]);
  }
};



$U.deleteAllCustomMathLives = function () {
    const fields = document.querySelectorAll("math-field");
    

    for (let i = 0; i < fields.length; i++) {
        const el = fields[i];
        const id = el.id || "";

        

        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }

        if ($U.mathLiveFields && id) delete $U.mathLiveFields[id];
        if ($U.mathLiveMeta && id) delete $U.mathLiveMeta[id];
    }

    

    

    if ($U.mathliveValues) {
        const ids = Object.keys($U.mathliveValues);
        for (let j = 0; j < ids.length; j++) {
            delete $U.mathliveValues[ids[j]];
        }
    }

    const iframe = document.querySelector('iframe[name="DGPad0"]');
    iframe?.contentWindow?.postMessage({
        action: "delete-all-mathlive"
    }, "*");
};

$U.resetCustomMathLive = function(id) {
    const fieldId = String(id || "");
    if (!fieldId) return;

    const meta = $U.mathLiveMeta && $U.mathLiveMeta[fieldId];
    if (!meta) return;

    $U.createCustomMathLive(
        fieldId,
        Number(meta.x) || 0,
        Number(meta.y) || 0,
        Number(meta.width) || 120,
        Number(meta.height) || 40,
        String(meta.latex || ""),
        {
            readOnly: !!meta.readOnly,
            virtualKeyboardMode: "manual",
            promptNames: Array.isArray(meta.prompts) ? meta.prompts.slice() : [],
            colorIndex: Number(meta.colorIndex) || 7,
            fontFamily: String(meta.fontFamily || "Arial"),
            fontSize: Number(meta.fontSize) || 28,
            fontStyle: String(meta.fontStyle || "normal"),
            fontAlign: String(meta.fontAlign || "izquierda")
        }
    );

    const iframe = document.querySelector('iframe[name="DGPad0"]');
    iframe?.contentWindow?.postMessage({
        action: "delete-mathlive",
        id: fieldId
    }, "*");
};

$U.setCustomMathLiveVisible = function(id, visible) {
    const fieldId = String(id || "");
    if (!fieldId) return;

    const el = ($U.mathLiveFields && $U.mathLiveFields[fieldId]) || document.getElementById(fieldId);
    if (!el) return;

    el.style.display = visible ? "inline-block" : "none";

    if ($U.mathLiveMeta && $U.mathLiveMeta[fieldId]) {
        $U.mathLiveMeta[fieldId].visible = !!visible;
    }
};

$U.showCustomMathLive = function(id) {
    $U.setCustomMathLiveVisible(id, true);
};

$U.hideCustomMathLive = function(id) {
    $U.setCustomMathLiveVisible(id, false);
};

$U.clearOneLocalStorage = function() {
    // On parcours le localstorage tant qu'on rencontre un élément verrouillé :
	// Se recorre el localstorage hasta encontrar un elemento cerrado :
    var m = localStorage.length;
    var c = JSON.parse(localStorage.getItem($P.localstorage.base + m));
    while ((m > 0) && (!c || c.lock)) {
        m--;
        c = JSON.parse(localStorage.getItem($P.localstorage.base + m));
    }

    if (m === 0) {
        // Si tous les éléments sont verrouillés, on supprime le dernier verrouillé :
		// Si todos los elementos estan cerrados, se suprime el último cerrado :
        localStorage.removeItem($P.localstorage.base + localStorage.length);
    } else {
        // Sinon, on supprime l'élement m :
		// si no, se suprime el elemento m :
        localStorage.removeItem($P.localstorage.base + m);
    }
};


$U.shiftLocalStorages = function() {
    for (var i = localStorage.length + 1; i > 1; i--) {
        var k0 = $P.localstorage.base + i;
        var k1 = $P.localstorage.base + (i - 1);
        if (localStorage.getItem(k1)) {
            var c1 = JSON.parse(localStorage.getItem(k1));
            localStorage.setItem(k0, JSON.stringify(c1));
            localStorage.removeItem(k1);
        }
    }
};




$U.timer = function(_proc, _delay, _param) {
    var delay = _delay,
        proc = _proc,
        param = _param,
        runnable = true,
        id = NaN;
    var myproc = function(_p) {
        runnable = false;
        proc(_p);
    };
    this.start = function() {
        if (runnable)
            id = setTimeout(myproc, delay, param);
    };
    this.isRunnable = function() {
        return runnable;
    };
    this.getProc = function() {
        return proc;
    };
    this.getParam = function() {
        return param;
    };
    this.getID = function() {
        return id;
    };
    this.clear = function() {
        clearTimeout(id);
    };
    this.setDelay = function(_d) {
        clearTimeout(id);
        delay = _d;
        this.start();
    };
};

$U.timers = function(_dlay) {
    var currentDelay = 0,
        delay = _dlay,
        tab = [];
    this.push = function(_proc, _param) {
        currentDelay += delay;
        tab.push(new $U.timer(_proc, currentDelay, _param));
    };
    this.start = function() {
        for (var i = 0; i < tab.length; i++) {
            tab[i].start();
        }
    };
    this.stop = function() {
        for (var i = 0; i < tab.length; i++) {
            tab[i].clear();
        }
    };
    this.restart = function() {
        this.setDelay(delay)
    };
    this.getIDs = function() {
        var t = [];
        for (var i = 0; i < tab.length; i++) {
            t.push(tab[i].getID());
        }
        return t;
    };
    this.clear = function() {
        for (var i = 0; i < tab.length; i++) {
            tab[i].clear();
        }
        currentDelay = 0;
        tab = [];
    };
    this.setDelay = function(_d) {
        delay = parseInt(_d);
        currentDelay = 0;
        var newtab = [];
        for (var i = 0; i < tab.length; i++) {
            tab[i].clear();
            if (tab[i].isRunnable())
                newtab.push(tab[i]);
        }
        tab = [];
        for (var i = 0; i < newtab.length; i++) {
            currentDelay += delay;
            tab.push(new $U.timer(newtab[i].getProc(), currentDelay, newtab[i].getParam()));
        }
        this.start();
    };
};

//cronómetro
(function () {
    let interval = null;
    let startTime = null;
    let visible = false;

    const div = document.createElement("div");
    div.id = "dgpad-cronometro";
    div.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        font-family: Arial, sans-serif;
        font-size: 20px;
        padding: 5px 10px;
        border-radius: 6px;
        display: none;
        z-index: 9999;
    `;
    document.body.appendChild(div);

    function updateDisplay() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const min = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const sec = String(elapsed % 60).padStart(2, "0");
        div.textContent = `${min}:${sec}`;
    }

    $U.cronometro = {
        start: function () {
            if (interval) clearInterval(interval);
            startTime = Date.now();
            interval = setInterval(updateDisplay, 1000);
            div.style.display = "block";
            visible = true;
        },
        stop: function () {
            clearInterval(interval);
            interval = null;
        },
        reset: function () {
            $U.cronometro.stop();
            startTime = Date.now();
            div.textContent = "00:00";
        },
        hide: function () {
            div.style.display = "none";
            visible = false;
        },
        show: function () {
            if (visible) div.style.display = "block";
        },
        getSeconds: function () {
            if (!startTime) return 0;
            return Math.floor((Date.now() - startTime) / 1000);
        }
    };
})();
//fin cronómetro



// ------------------------------------------------------------
// Magnet locks (global shared state)
// ------------------------------------------------------------
$U.magnet = $U.magnet || {};

// List slot owners: WeakMap<ListObject, Map<slotIndex, PointObject>>
$U.magnet.listSlotOwners = $U.magnet.listSlotOwners || new WeakMap();

$U.magnet.getSlotMap = function(listObj) {
  var wm = $U.magnet.listSlotOwners;
  var m = wm.get(listObj);
  if (!m) {
    m = new Map();
    wm.set(listObj, m);
  }
  return m;
};

$U.magnet.getSlotOwner = function(listObj, idx) {
  var m = $U.magnet.listSlotOwners.get(listObj);
  return m ? (m.get(idx) || null) : null;
};



$U.magnet.lockSlot = function(listObj, idx, owner) {
  var m = $U.magnet.getSlotMap(listObj);
  var cur = m.get(idx);

  // Si ya está ocupado por otro, NO se puede lockear:
  if (cur && cur !== owner) {
    console.log("[MAGNET][LOCK-FAIL] list=", listObj.getName?.(), "slot=", idx,
                "owner=", owner.getName?.(), "occupiedBy=", cur.getName?.());
    return false;
  }

  m.set(idx, owner);
  console.log("[MAGNET][LOCK-OK] list=", listObj.getName?.(), "slot=", idx, "owner=", owner.getName?.());
  return true;
};




$U.magnet.unlockSlot = function(listObj, idx, owner) {
  var m = $U.magnet.listSlotOwners.get(listObj);
  if (!m) return false;
  if (m.get(idx) === owner) {
    m.delete(idx);
    
    return true;
  }
  return false;
};



$U.TimeOut = function(_delay, _function) {
    var time = 0;
    var delay = _delay;
    var func = _function;
    var tOut = null;

    this.startChrono = function() {
        this.stopChrono();
        time = Date.now();
        tOut = setTimeout(func, delay);
    };
    this.stopChrono = function() {
        if (tOut !== null) {
            clearTimeout(tOut);
            tOut = null;
        }
        time = 0;
    };
    this.isTimeout = function() {
        return ((Date.now() - time) > delay);
    };
};


$U.isMobile = {
    android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    blackberry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    ios: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    mobilePhone: function() {
        return $MOBILE_PHONE;
    },
    
    any: function() {
        return ($U.isMobile.android() || $U.isMobile.blackberry() || $U.isMobile.ios() || $U.isMobile.opera() || $U.isMobile.windows());
    }
};



$U.isOldAndroid = function() {
    var ua = navigator.userAgent;
    return ((ua.indexOf("Android") >= 0) && (parseFloat(ua.slice(ua.indexOf("Android") + 8)) < 4.4));
};

$U.isBrowser = {
    firefox: function() {
        return (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1);
    }
};

$U.scaleViewportOnMobile = function() {
    if ($U.isMobile.mobilePhone()) {
        var viewport = document.getElementById('wholeViewport');
        viewport.setAttribute("content", "width=device-width, maximum-scale=1.0, initial-scale=0.65 ,user-scalable=no");
    }
};

$U.initEvents = function(ZC, cTag) {
    cTag.canvas = ZC;
    window.$CANVAS = ZC;
    cTag.oncontextmenu = function() {
        return false;
    };
	window.addEventListener('message', function(e) {
        var message = e.data;
        switch (message) {
            case "get_SVG":
                parent.postMessage(window.$CANVAS.exportSVG(), "*")
                break;
            case "get_PNG":
                parent.postMessage(window.$CANVAS.exportPNG(), "*")
                break;
            case "get_Source":
                parent.postMessage(window.$CANVAS.getSource(), "*")
                break;
            case "get_Original_Dims":
                parent.postMessage(window.$CANVAS.getConstruction().getOriginalDims(), "*")
                break;
            case "set_Full_Screen":
                window.$CANVAS.setFullScreen();
                break;
            case "repaint":
                //MEAG comienzo
                setTimeout(function() {
                    window.$CANVAS.setFullScreen();
                    window.$CANVAS.getConstruction().computeAll();
                    //MEAG fin
                    window.$CANVAS.paint();
                }, 500);
                break;
        }
    });

    cTag.addEventListener('touchmove', ZC.touchMoved, false);
    cTag.addEventListener('touchstart', ZC.touchStart, false);
    cTag.addEventListener('touchend', ZC.touchEnd, false);
    cTag.addEventListener('touchcancel', ZC.touchEnd, false);
    cTag.addEventListener('mousemove', ZC.mouseMoved, false);
    cTag.addEventListener('mousedown', ZC.mousePressed, false);
    cTag.addEventListener('mouseup', ZC.mouseReleased, false);

    cTag.addEventListener('click', ZC.mouseClicked, false);
    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    cTag.addEventListener(mousewheelevt, ZC.mouseWheel, false);
    cTag.addEventListener('dragover', ZC.dragOver, false);
    cTag.addEventListener('drop', ZC.drop, false);



    // if (!Object.touchpad) {
    //     window.addEventListener("keypress", ZC.keypress, false);
    //     window.addEventListener("keydown", ZC.keydown, false);
    // }
}

// Valeur changée par les fonctions d'ouverture des figures
// Il s'agit d'éviter des change events pendant l'ouverture :
$U.isloading = false

// This function is called each time something happend in construction.
// (add, remove, drag, zoom, etc...). This is usefull for python and OS X
// wrapped webview :
$U.changed = function() {
    if (!$U.isloading) {
        // Pour l'appli Linux :
        window.status = "changed"
            // Pour l'appli OS X :
        if (window.$OS_X_APPLICATION) {
            interOp.somethingChanged("");
        };
    }
}
$U.AllCanvas = [];



$U.initCanvas = function(_id) {
    var ZC = new Canvas(_id);
    $U.AllCanvas.push(ZC);
    var cTag = document.getElementById(_id);

    $U.initEvents(ZC, cTag);

    Event.prototype.cursor = "default";
    Event.prototype.getCursor = function() {
        return (this.cursor);
    };
    Event.prototype.setCursor = function(cur) {
        this.cursor = cur;
    };

    if (cTag.hasAttribute("data-presentation")) {
        ZC.demoModeManager.setDemoMode(cTag.getAttribute("data-presentation").toLowerCase() === "true");
    };
    //variables para ancho y alto de ventana
		$U.winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        $U.winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // ZC.setMode(1);

    ZC.addTool(new PointConstructor());
    ZC.addTool(new SegmentConstructor());
    ZC.addTool(new LineConstructor());
    ZC.addTool(new RayConstructor());
    ZC.addTool(new MidPointConstructor());
    ZC.addTool(new CircleConstructor());
    ZC.addTool(new Circle1Constructor());
    ZC.addTool(new Circle3Constructor());
    ZC.addTool(new ParallelConstructor());
    ZC.addTool(new PlumbConstructor());
    ZC.addTool(new AreaConstructor());
    ZC.addTool(new PerpBisectorConstructor());
    ZC.addTool(new SymcConstructor());
    ZC.addTool(new SymaConstructor());
    ZC.addTool(new Circle3ptsConstructor());
    ZC.addTool(new Arc3ptsConstructor());
    ZC.addTool(new AngleBisectorConstructor());
    ZC.addTool(new LocusConstructor());
    ZC.addTool(new AngleConstructor());
    ZC.addTool(new FixedAngleConstructor());
    ZC.addTool(new NameMover());
    ZC.addTool(new CallProperty());
    ZC.addTool(new ObjectMover());
    ZC.addTool(new CallCalc());
    ZC.addTool(new FloatingObjectConstructor());
    ZC.addTool(new CallMagnet());
    ZC.addTool(new CallDepends());
    ZC.addTool(new CallList());
    ZC.addTool(new CallTrash());
    ZC.addTool(new AnchorConstructor());
    ZC.addTool(new NoAnchorConstructor());
    ZC.addTool(new VectorConstructor());
    ZC.addTool(new SpringConstructor());
    ZC.addTool(new BlocklyConstructor());
    ZC.addTool(new DocEvalConstructor());
    ZC.addTool(new DGScriptNameConstructor());
    // MEAG start herramientas ocultar, medida, traslación, widget de Edición
    ZC.addTool(new CallHide());
    ZC.addTool(new CallEditWidget());
    ZC.addTool(new CallValue());
	ZC.addTool(new TranslationConstructor());
    // MEAG end

    //JDIAZ herramientas quitar medida, quitar nombre, rotación homotecia
    ZC.addTool(new RemoveValue());
	ZC.addTool(new RemoveName());
    ZC.addTool(new RotationConstructor());
    ZC.addTool(new HomothetyConstructor());
    //JDIAZ end
    //JDIAZ 12/15
    ZC.addTool(new IntersectionConstructor());
    ZC.clearBackground();



    


};
