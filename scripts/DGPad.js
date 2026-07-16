//$NAMESPACE = {};
//for (var key in window) {
//    $NAMESPACE[key] = key;
//}


CanvasRenderingContext2D.prototype.arc2 = function (x, y, r, a, b, c) {
    // if (r < 1128406) {
    if (r < 1000000) {
        this.arc(x, y, r, a, b, c);
    } else {
        var w = this.canvas.width;
        var h = this.canvas.height;
        var inters = [];
        var t = r * r - x * x;
        if (t > 0) {
            t = Math.sqrt(t);
            if ((y + t >= 0) && (y + t < h)) inters.push([0, y + t]);
            if ((y - t >= 0) && (y - t < h)) inters.push([0, y - t]);
        }
        t = r * r - (x - w) * (x - w);
        if (t > 0) {
            t = Math.sqrt(t);
            if ((y + t >= 0) && (y + t < h)) inters.push([w, y + t]);
            if ((y - t >= 0) && (y - t < h)) inters.push([w, y - t]);
        }
        t = r * r - y * y;
        if (t > 0) {
            t = Math.sqrt(t);
            if ((x + t >= 0) && (x + t < w)) inters.push([x + t, 0]);
            if ((x - t >= 0) && (x - t < w)) inters.push([x - t, 0]);
        }
        t = r * r - (y - h) * (y - h);
        if (t > 0) {
            t = Math.sqrt(t);
            if ((x + t >= 0) && (x + t < w)) inters.push([x + t, h]);
            if ((x - t >= 0) && (x - t < w)) inters.push([x - t, h]);
        }
        if (inters.length === 2) {
            this.beginPath();
            this.moveTo(inters[0][0], inters[0][1]);
            this.lineTo(inters[1][0], inters[1][1]);
            this.closePath();
        }
    }
}


var $BODY_SCRIPT = document.getElementsByTagName("script");

$BODY_SCRIPT = $BODY_SCRIPT[$BODY_SCRIPT.length - 1];


if (!$APP_PATH) {
    // Si le script est le premier script DGPad trouvé dans la page :
    var $ECHO_SOURCE = false;
    // Désactive toutes les alertes sur cette fenêtre pour éviter que l'uiwebview
    // soit polluée par une alerte "popup" de filepicker :
    window.$ALERT = window.alert;
    window.alert = function () { }
    // Indique si DGPad s'ouvre dans l'application iOS/Android ou bien dans le navigateur :
    window.$APPLICATION = false;
    window.$iOS_APPLICATION = false;
    try {
        window.$APPLICATION = (window.parent && window.parent.$APPLICATION);
        window.$iOS_APPLICATION = (window.parent && window.parent.$iOS_APPLICATION);
    } catch (er) { }

    // Only for standard android keyboard :
    window.$STANDARD_KBD = {};

    // Seulement pour la plateforme Android, true dans ce cas :
    var $STOP_MOUSE_EVENTS = (navigator.userAgent.toLowerCase().indexOf("android") > -1);
    //    var $STOP_MOUSE_EVENTS = false;
    var $SCALE = 1;
    var $FPICKERFRAME = null;
    // Détermination sans autre globale du chemin
    // de ce script (dans quel dossier il se trouve) :
    var $APP_PATH = document.getElementsByTagName("script");
    $APP_PATH = $APP_PATH[$APP_PATH.length - 1];
    $APP_PATH = $APP_PATH.src.split('/');
    $APP_PATH.pop();
    $APP_PATH = $APP_PATH.join("/") + "/";
    // $APP_PATH = $APP_PATH[$APP_PATH.length - 2] + '/';



    var $INCLUDED_FILES = [];

    var $HEADSCRIPT = function (_path) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = _path;
        script.async = false;
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;
    }

    // Uniquement utilisé en mode developpement :
    var $INCLUDE = function (_fname, _external) {
        var purename = _fname;
        var files = "," + $INCLUDED_FILES.join(",") + ",";
        if (files.indexOf("," + _fname + ",") > -1) {
            // Le fichier a déjà été chargé précédemment :
            return;
        }
        //        if (arguments.length === 1) {
        //            // Il s'agit d'un fichier js local (propre à l'appli) :
        //            _fname = $APP_PATH + _fname;
        //
        //            // On teste si le fichier local existe :
        //            var request = new XMLHttpRequest();
        //            try {
        //                request.open("GET", _fname, false);
        //                request.send();
        //            } catch (e) {
        //                return;
        //            }
        //        }
        _fname = $APP_PATH + _fname;
        $HEADSCRIPT(_fname);
        $INCLUDED_FILES.push(purename);
    };


    var $LOADMAIN = function () {
        $HEADSCRIPT($APP_PATH + "Main.js");
    }

    // Le ou les fichiers de langues doivent être chargées en premier
    // le reste (Main.js) doit donc attendre que ces fichiers soient
    // interprétés. _proc est la fonction appelée lorsque ces scripts
    // sont chargés (onload) :
    var $LOADLANGUAGE = function () {
        // Charger le module de langue standard (anglais) :
        var scp = $HEADSCRIPT($APP_PATH + "NotPacked/lang/LocalStrings.js");



        // Puis surcharger si la langue du navigateur est reconnue :
        var language_Code = navigator.language || navigator.userLanguage;
        language_Code = language_Code.toUpperCase().split("-")[0];
        // Trouver éventuellement un paramètre de langue dans le script du body :
        if ($BODY_SCRIPT.hasAttribute("data-lang"))
            language_Code = $BODY_SCRIPT.getAttribute("data-lang").toUpperCase();

        $HEADSCRIPT($APP_PATH + "NotPacked/lang/LocalStrings_" + language_Code + ".js");
    };



    var $MAIN_INIT = function () {
        var tags = document.getElementsByTagName("canvas");

        var Elts = [];
        for (var i = 0, len = tags.length; i < len; i++) {
            Elts.push(tags[i]);
        }
        for (var i = 0, len = Elts.length; i < len; i++) {
            var myID = Elts[i].getAttribute("ID");
            if (myID !== null) {
                if (myID.startsWith("DGPad")) {
                    $U.initCanvas(myID);
                }
            }
        }
    };

    var $ECHOSRC = function () {
        var k = 0;
        for (var i = 0, len = $INCLUDED_FILES.length; i < len; i++) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", $APP_PATH + $INCLUDED_FILES[i], true);
            xhr.send();
            xhr.order = i;
            xhr.onload = function (e) {
                k++;
                $INCLUDED_FILES[e.target.order] = e.target.responseText;
                if (k === $INCLUDED_FILES.length) {
                    $INCLUDED_FILES.push("var $MAIN_INIT = " + $MAIN_INIT.toString());
                    $INCLUDED_FILES.push("window.onload = function() {\n$MAIN_INIT();\n};");
                }
            }
        }
    };

    var $GETCSS = function (ruleName, deleteFlag) {
        ruleName = ruleName.toLowerCase();
        if (document.styleSheets) {
            for (var i = 0; i < document.styleSheets.length; i++) {
                var styleSheet = document.styleSheets[i];
                var ii = 0;
                var cssRule = false;
                do {
                    if (styleSheet.cssRules) {
                        cssRule = styleSheet.cssRules[ii];
                    } else {
                        cssRule = styleSheet.rules[ii];
                    }
                    if (cssRule) {
                        if (cssRule.selectorText.toLowerCase() == ruleName) {
                            if (deleteFlag == 'delete') {
                                if (styleSheet.cssRules) {
                                    styleSheet.deleteRule(ii);
                                } else {
                                    styleSheet.removeRule(ii);
                                }
                                return true;
                            } else {
                                return cssRule;
                            }
                        }
                    }
                    ii++;
                } while (cssRule)
            }
        }
        return false;
    };

    var $SCALECSS = function (_r, _p) {
        var c = $GETCSS(_r);
        if (c) {
            var props = _p.split(",");
            for (var i = 0, len = props.length; i < len; i++) {
                var n = parseInt(c.style.getPropertyValue(props[i])) * $SCALE;
                c.style.setProperty(props[i], n + "px");
            };
        }
    };


    // Seulement pour l'application Androïd : le java doit gérer les mouse et touch events.
    (function () {
        if ($STOP_MOUSE_EVENTS) {
            var orig_addEventListener = Element.prototype.addEventListener;
            Element.prototype.addEventListener = function (type, listener, useCapture) {
                switch (type) {
                    case "mousedown":
                        break;
                    case "mouseup":
                        break;
                    case "mousemove":
                        break;
                    default:
                        return orig_addEventListener.call(this, type, listener, useCapture);
                }
            };
        }
    }());

    (function () {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.rel = "stylesheet";
        style.type = "text/css";
        style.href = $APP_PATH + "NotPacked/styles.css";
        head.appendChild(style);
        // ******** Décommenter le jour où on met en place un "scale" : *********
        //        var img=document.createElement('img');
        //        img.onerror = function() {
        //            $SCALECSS(".pluginsListDIV", "width,height,left,top,border-radius");
        //            $SCALECSS(".toolsListDIV", "width,height,left,top,border-radius");
        //            $SCALECSS(".macroLIclass", "padding,font-size");
        //            $SCALECSS(".macroLIclassComment", "margin-top,margin-left,font-size");
        //            $SCALECSS(".macroPropsDIV", "width,left,height,border-radius");
        //            $SCALECSS(".macroLabelDiv", "padding");
        //            $SCALECSS(".macroLabelImage", "width,height");
        //            $SCALECSS(".macroLabelSpan", "margin-left,font-size");
        //            $SCALECSS(".macroExecInput", "width,height,font-size");
        //            $SCALECSS(".macroAddImage", "width,top,right");
        //            $SCALECSS(".macroPropsNameDIV", "left,top,right,height,border-radius");
        //            $SCALECSS(".macroPropsNameINPUT", "width,top,left,height,border-radius,font-size");
        //            $SCALECSS(".macroPropsViewport", "width,top,left,bottom");
        //            $SCALECSS(".macroPropsInnerDIV", "width,top,left,bottom");
        //            $SCALECSS(".macroListViewport", "width,top,left,bottom");
        //            $SCALECSS(".macroLIclassComment", "margin-top,margin-bottom,margin-left,font-size");
        //            $SCALECSS(".macroLIclass", "padding,font-size");
        //            $SCALECSS(".macroLIclassSel", "padding,font-size");
        //        };
        //        img.src=style.href;
        $LOADLANGUAGE();
        $LOADMAIN();

        var standalone = window.navigator.standalone;
        var userAgent = window.navigator.userAgent.toLowerCase();
        var safari = /safari/.test(userAgent);
        var ios = /iphone|ipod|ipad/.test(userAgent);
        /* if (!standalone && !safari) {
            // DGPad s'ouvre dans l'iApp :
            window.open = function(url) {
                // $FPICKERFRAME = new windowOpenIFrame(url);
            }; */
        // }
    })();


    // Est-ce une tablette tactile ? :
    Object.touchpad = false;
    if ((navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPhone|iPad|iPod/i))) {
        //iOS & android
        Object.touchpad = true;
    } else if (window.navigator.msPointerEnabled) {
        //Win8
        Object.touchpad = true;
    }

    String.prototype.startsWith = function (str) {
        return (this.indexOf(str) === 0);
    };

    window.onload = function () {
        $MAIN_INIT();
        if ($ECHO_SOURCE) {
            $ECHOSRC();
        }
        
    };
}

// Création du canvas associé :
(function () {


    // Inicio Prueba Google Analytics
    var imported = document.createElement('script')
    imported.src = 'https://www.googletagmanager.com/gtag/js?id=G-5J95Z4Y54W';
    document.head.appendChild(imported);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'G-5J95Z4Y54W');
    // Final Prueba Google Analytics


    // On crée le canvas :
    var canvas = document.createElement("canvas");
    // Transfert sur le canvas de la largeur et hauteur éventuelle :
    if (($BODY_SCRIPT.hasAttribute("data-width")) && ($BODY_SCRIPT.hasAttribute("data-height"))) {
        canvas.setAttribute("width", $BODY_SCRIPT.getAttribute("data-width"));
        canvas.setAttribute("height", $BODY_SCRIPT.getAttribute("data-height"));
    }
    // Transfert sur le canvas du contenu de la figure (base64) :
    if ($BODY_SCRIPT.hasAttribute("data-source")) {
        canvas.setAttribute("data-source", $BODY_SCRIPT.getAttribute("data-source"));
    }
    // Transfert sur le canvas de l'adresse de la figure :
    if ($BODY_SCRIPT.hasAttribute("data-url")) {
        canvas.setAttribute("data-url", $BODY_SCRIPT.getAttribute("data-url"));
    }
    // Affichage du tableau de bord :
    if ($BODY_SCRIPT.hasAttribute("data-hidectrlpanel")) {
        canvas.setAttribute("data-hidectrlpanel", $BODY_SCRIPT.getAttribute("data-hidectrlpanel"));
    }
    // Transfert sur le canvas du mode de présentation :
    if ($BODY_SCRIPT.hasAttribute("data-presentation")) {
        canvas.setAttribute("data-presentation", $BODY_SCRIPT.getAttribute("data-presentation"));
    }
    // Transfert sur le canvas de l'état du mode 1 (mode construction ou non) :
    if ($BODY_SCRIPT.hasAttribute("data-tools")) {
        canvas.setAttribute("data-tools", $BODY_SCRIPT.getAttribute("data-tools"));
    }
    // Transfert sur le canvas de l'appli google Apps qui appelle :
    if ($BODY_SCRIPT.hasAttribute("data-googleapps")) {
        canvas.setAttribute("data-googleapps", $BODY_SCRIPT.getAttribute("data-googleapps"));
    }
    // Transfert sur le canvas de l'ID du fichier google drive cible :
    if ($BODY_SCRIPT.hasAttribute("data-googleid")) {
        canvas.setAttribute("data-googleid", $BODY_SCRIPT.getAttribute("data-googleid"));
    }
    // MEAG start para diferenciar version profesores/estudiantes

    if ($BODY_SCRIPT.hasAttribute("data-version")) {
        canvas.setAttribute("data-version", $BODY_SCRIPT.getAttribute("data-version"));
    }
    // MEAG end


    var num = document.getElementsByTagName("canvas").length;
    canvas.setAttribute("id", "DGPad" + num);

    $BODY_SCRIPT.parentNode.insertBefore(canvas, $BODY_SCRIPT);

})();

window.addEventListener("message", function (e) {
    
    const message = e.data;
   

    switch (message.action) {
        case "get_SVG":
            parent.postMessage(window.$CANVAS.exportSVG(), "*");
            break;

        case "get_PNG":
            parent.postMessage(window.$CANVAS.exportPNG(), "*");
            break;

        case "get_Source":
            parent.postMessage(window.$CANVAS.getSource(), "*");
            break;

        case "get_Original_Dims":
            parent.postMessage(window.$CANVAS.getConstruction().getOriginalDims(), "*");
            break;

        case "set_Full_Screen":
            window.$CANVAS.setFullScreen();
            break;

        case "repaint":
            window.$CANVAS.paint();
            break;

        // case "dgpad-alert": {
        //     const cfg = message.content;
        //     const texto = String(cfg?.text ?? "Mensaje");
        //     const font = cfg?.font ?? "Arial";
        //     const size = cfg?.size ?? "16";
        //     const style = cfg?.style ?? "normal";
        //     const align = cfg?.align ?? "center";

        //     $U.alert(texto, 350, 165, font, size, style, align);
        //     break;
        // }

        // en DGPad: case "dgpad-alert"
        case "dgpad-alert": {
        const cfg = message.content;
        const texto = String(cfg?.text ?? "Mensaje");
        const font = cfg?.font ?? "Arial";
        const size = cfg?.size ?? "16";
        const style = cfg?.style ?? "normal";
        const align = cfg?.align ?? "center";
        const speaker = !!cfg?.speaker; // ✅ nuevo

        $U.alert(texto, 350, 165, font, size, style, align, speaker); // ✅ nuevo param
        break;
        }


        
        case "dgpad-confirm": {
            
        const {
            message: msg,
            yes,
            no,
            font: dlgFont,
            size: dlgSize,
            style: dlgStyle,
            align: dlgAlign,
            varName,
            speaker // ✅ nuevo
        } = message.content || {};

        $U.confirm(msg, 350, 165, dlgFont, dlgSize, dlgStyle, dlgAlign, yes, no, !!speaker) // ✅ nuevo arg
            .then((result) => {
            const iframe = document.querySelector('iframe[name=DGPad0]');
            iframe.contentWindow.postMessage({
                action: "set-global-variable",
                name: varName,
                value: result
            }, "*");
            });
        break;
        }


        case "create-custom-input": {
            

            const inputId = message.id;
            
            const x = window.$CANVAS.getConstruction().coordsSystem.px(message.xVal)+3;
            
            
            const y = window.$CANVAS.getConstruction().coordsSystem.py(message.yVal) - message.fontSize / 2;
            

            

            if (!$U.inputs) $U.inputs = {};
            const inputs = $U.inputs || {};
            if (!inputs[inputId]) {
                $U.createCustomInput(inputId, x, y, message.width, message.fs, message.fontSize);
                $U.inputs[inputId] = document.getElementById(inputId);
            } else {
                const inputEl = inputs[inputId];
                const escala = $U.escala || 1; // o la que realmente uses
                inputEl.style.width = `${message.width * escala}px`;
                inputEl.style.fontSize = `${message.fontSize * escala}px`;
                
                
                // inputEl.style.verticalAlign = "middle";
                inputEl.style.left = `${x}px`;
                inputEl.style.top = `${y-12}px`;
                
                
                const paddingY = 6;
                let totalHeight = message.fontSize + paddingY;
                inputEl.style.height = `${totalHeight}px`;
            }
            // Necesario para tener un id único y un nombre comprensible y al renombrar los puntos mantener el nombre
            if (!$U.inputMeta) $U.inputMeta = Object.create(null);
            $U.inputMeta[inputId] = { pointName: String(message.pointName || ""), n: Number(message.n) || 0 };
            const inputEl = document.getElementById(inputId);
            if (inputEl && !inputEl.dataset.listenerAdded) {
                inputEl.addEventListener("input", () => {
                    const iframe = document.querySelector("iframe[name=DGPad0]");
                    iframe?.contentWindow?.postMessage({
                        action: "update-input-value",
                        id: inputEl.id,
                        value: inputEl.value
                    }, "*");
                });
                inputEl.dataset.listenerAdded = "true";
            }

            break;
        }

        case "move-custom-input": {
            const inputId = message.id;
            const inputEl =
                ($U.inputs && $U.inputs[inputId]) ||
                document.getElementById(inputId);

            if (!inputEl) break;

            const x = window.$CANVAS.getConstruction().coordsSystem.px(message.xVal) + 3;
            const y = window.$CANVAS.getConstruction().coordsSystem.py(message.yVal);

            const width = inputEl.offsetWidth || parseFloat(inputEl.style.width) || 50;
            const height = inputEl.offsetHeight || parseFloat(inputEl.style.height) || 31;

            inputEl.style.left = (x - width / 2) + "px";
            inputEl.style.top = (y - height / 2) + "px";

            break;
        }

        case "delete-input": {
            


            const target = $U.inputs?.[message.id];
            if (target) {
                target.remove(); // Elimina del DOM
                delete $U.inputs[message.id]; // Elimina del registro interno
            } else {
                console.warn("⚠️ No se encontró la casilla a eliminar:", message.id);
            }
            

            break;
        }


        case "toggle-custom-input-visibility": {
            const el = $U.inputs?.[message.id];
            if (el) {
                el.style.display = message.visible ? "block" : "none";
            } else {
                console.warn("⚠️ Casilla no encontrada:", message.id);
            }
            break;
        }

        

        case "clear-custom-input": {
            const targetInput = $U.inputs?.[message.id];
            if (targetInput) {
                targetInput.value = "";
        
                // 🔄 Enviar valor actualizado (vacío) al DGPad interno
                const iframe = document.querySelector("iframe[name=DGPad0]");
                iframe?.contentWindow?.postMessage({
                    action: "update-input-value",
                    id: targetInput.id,
                    value: ""
                }, "*");
            } else {
                console.warn("⚠️ Casilla no encontrada:", message.id);
            }
            break;
        }
        

        
        
        case "create-custom-number-input": {
        const inputId = String(message.id || "");
        if (!inputId) break;

        // Ensure registries
        if (!window.$U) window.$U = {};
        if (!$U.inputs) $U.inputs = {};
        if (!$U.inputMeta) $U.inputMeta = Object.create(null);

        const inputs = $U.inputs;

        // Coords (px)
        const cs = window.$CANVAS.getConstruction().coordsSystem;
        const x = cs.px(message.xVal) + 3;
        const y = cs.py(message.yVal) - (Number(message.fontSize) || 25) / 2;

        // --- Create/update input (prefer idempotent helper for consistent scale) ---
        // Your signature: (id, x, y, width, fontSize, min, max, step)
        $U.createCustomNumberInput(
            inputId,
            x,
            y,
            Number(message.width) || 50,
            Number(message.fontSize) || 25,
            message.min,
            message.max,
            message.step
        );

        // Refresh stored element reference
        inputs[inputId] = document.getElementById(inputId);
        const inputEl = inputs[inputId];
        if (!inputEl) break;

        // Optional: if you still need the vertical tweak
        inputEl.style.top = `${y - 12}px`;
        inputEl.style.left = `${x}px`;

        // --- Expression internal key + visible text ---
        const safeId = inputId.replace(/[^a-zA-Z0-9_]/g, "_");
        const exprKey = `E_num_${safeId}`; // internal stable name
        const pointName = String(message.pointName || "");
        const n = Number(message.n) || 0;
        const exprText = `ValorListaNumeros${pointName} ${n}=`; // visible text

        // --- Meta (always) ---
        $U.inputMeta[inputId] = { pointName, n, type: "number", exprKey };

        // --- Ensure ExpressionObject exists + update its visible text ---
        try {
            const construction = window.$CANVAS.getConstruction();
            let exprObj = construction.find(exprKey);

            if (!exprObj) {
            const initialValue = parseFloat(inputEl.value) || 0;
            exprObj = new ExpressionObject(
                construction,
                exprKey,     // internal name
                exprText,    // visible text (T)
                "", "",      // other text fields
                String(initialValue),
                x + (Number(message.width) || 50) + 10,
                y
            );
            construction.add(exprObj);
            } else if (typeof exprObj.setT === "function") {
            exprObj.setT(exprText);
            }

            exprObj.setShowName?.(true);
            exprObj.compute?.();
        } catch (e) {
            console.warn("No se pudo crear/actualizar ExpressionObject:", e);
        }

        // --- Listener (once) -> updates iframe cache + expression value ---
        if (!inputEl.dataset.listenerAdded) {
            inputEl.addEventListener("input", () => {
            const iframe = document.querySelector("iframe[name=DGPad0]");
            iframe?.contentWindow?.postMessage(
                {
                action: "update-input-value",
                id: inputEl.id,
                value: inputEl.value,
                expression: exprKey,
                },
                "*"
            );
            });
            inputEl.dataset.listenerAdded = "true";
        }

        break;
        }



            
    

      
      
  
      case "custom-input-request": {
        const inputEl = document.getElementById(message.id);
        const value = inputEl?.value || "";
        const iframe = document.querySelector("iframe[name=DGPad0]");

        iframe.contentWindow.postMessage({
            action: "custom-input-response",
            id: message.id,
            value: value
        }, "*");
        break;
    }
  
      case "get-input-list": {
        const response = Object.entries($U.inputs || {}).map(([fullKey, obj]) => {
            const label = fullKey.split("-")[0];
            return {
                id: obj.id,
                label
            };
        });

        const sandbox = document.querySelector("iframe[name=DGPad0]");
        sandbox?.contentWindow?.postMessage({
            action: "input-list-response",
            inputs: response
        }, "*");
        break;
    }

    case "create-cronometro": {
        
    const id = message.id;
    const x = window.$CANVAS.getConstruction().coordsSystem.px(message.xVal);
    const y = window.$CANVAS.getConstruction().coordsSystem.py(message.yVal);
    
    $U.createCustomCronometro(id, x, y, message.fontSize);
    break;
    }

    
    case "cronometro-start":{
            
            const id = message.id;
            const action = message.action.split("-")[1];
            const cron = $U.cronometros?.[id];

            if (cron && typeof cron[action] === "function") {
                cron[action]();
            } else {
                console.warn(`⚠️ Acción '${action}' no disponible para el cronómetro '${id}'`);
            }
            break;
        }
        case "cronometro-stop":{
            
            const id = message.id;
            const action = message.action.split("-")[1];
            const cron = $U.cronometros?.[id];

            if (cron && typeof cron[action] === "function") {
                cron[action]();
            } else {
                console.warn(`⚠️ Acción '${action}' no disponible para el cronómetro '${id}'`);
            }
            break;
        }
        case "cronometro-reset":{
            
            const id = message.id;
            const action = message.action.split("-")[1];
            const cron = $U.cronometros?.[id];

            if (cron && typeof cron[action] === "function") {
                cron[action]();
            } else {
                console.warn(`⚠️ Acción '${action}' no disponible para el cronómetro '${id}'`);
            }
            break;
        }
        case "cronometro-show":{
            
            const id = message.id;
            const action = message.action.split("-")[1];
            const cron = $U.cronometros?.[id];

            if (cron && typeof cron[action] === "function") {
                cron[action]();
            } else {
                console.warn(`⚠️ Acción '${action}' no disponible para el cronómetro '${id}'`);
            }
            break;
        }
        case "cronometro-hide": {
            
            const id = message.id;
            const action = message.action.split("-")[1];
            const cron = $U.cronometros?.[id];

            if (cron && typeof cron[action] === "function") {
                cron[action]();
            } else {
                console.warn(`⚠️ Acción '${action}' no disponible para el cronómetro '${id}'`);
            }
            break;
        }

        

            case "create-custom-speaker": {
            const speakerId = String(message.id || "");
            if (!speakerId) break;

            const coords = window.$CANVAS.getConstruction().coordsSystem;
            const x = coords.px(message.xVal) + 3;
            const size = Number(message.size) || 56;
            const y = coords.py(message.yVal) - (size / 2);

            const el = $U.createCustomSpeaker(speakerId, x, y, size);
            if (!el) break;

            el.__ttsState = { text: message.text, opts: message.opts || {} };

            if (!$U.speakerMeta) $U.speakerMeta = Object.create(null);
            $U.speakerMeta[speakerId] = {
                pointName: String(message.pointName || ""),
                n: Number(message.n) || 0
            };

            break;
            }

            case "toggle-custom-speaker-visibility": {
                const el = $U.speakers?.[message.id];
                if (el) {
                    // "flex" porque tu speaker usa display:flex en createCustomSpeaker
                    el.style.display = message.visible ? "flex" : "none";
                } else {
                    console.warn("⚠️ Altoparlante no encontrado:", message.id);
                }
                break;
                }


            // (opcional) alias si ya lo usaste en otros lados:
            case "set-custom-speaker-visible": {
            __setSpeakerVisible(message.id, message.visible);
            break;
            }

            case "remove-custom-speaker": {
            const id = String(message.id || "");
            $U.removeCustomSpeaker(id);
            if ($U.speakerMeta) delete $U.speakerMeta[id];
            break;
            }

            case "delete-speaker": {
                const id = String(message.id || message.content?.id || "");
                if (!id) break;

                const el = document.getElementById(id);
                if (el) el.remove();

                if ($U?.speakers) delete $U.speakers[id];
                break;
            }

            case "clear-speakers": {
                $U.clearCustomSpeakers();
                break;
            }


        case "dgpad-tts-speak": {
            const cfg = message.content || {};
            const text = String(cfg.text ?? "").replace(/\s+/g, " ").trim();
            if (!text) break;

            const lang = cfg.lang || "es-CO";
            const rate = Number(cfg.rate ?? 1);
            const pitch = Number(cfg.pitch ?? 1);
            const volume = Number(cfg.volume ?? 1);

            if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) break;

            try { window.speechSynthesis.cancel(); } catch (e) {}

            const u = new SpeechSynthesisUtterance(text);
            u.lang = lang;
            u.rate = rate;
            u.pitch = pitch;
            u.volume = volume;

            window.speechSynthesis.speak(u);
            break;
            }

        
        

        case "create-mathlive": {
            if ($U.__suppressMathLiveUntil && Date.now() < $U.__suppressMathLiveUntil && !$U.__loadingFile) {
                console.log("[dgpad] CREATE mathlive suprimido =", message.id);
                break;
            }

            if ($U.__loadingFile) {
                console.log("[dgpad] CREATE mathlive permitido durante carga =", message.id);
            } else {
                console.log("[dgpad] CREATE mathlive", message.id, message);
            }

            const fieldId = String(message.id || "");
            if (!fieldId) break;

    


            function extractMathLivePrompts(latex) {
                var text = String(latex || "");
                var re = /\\placeholder\[([^\]]+)\]/g;
                var prompts = [];
                var m;

                while ((m = re.exec(text)) !== null) {
                    if (prompts.indexOf(m[1]) === -1) {
                        prompts.push(m[1]);
                    }
                }

                return prompts;
            }

            const prompts = extractMathLivePrompts(message.latex);

            const x = window.$CANVAS.getConstruction().coordsSystem.px(message.xVal) + 3;
            const y = window.$CANVAS.getConstruction().coordsSystem.py(message.yVal) - (Number(message.height) || 40) / 2;

            $U.createCustomMathLive(
                fieldId,
                x,
                y,
                Number(message.width) || 120,
                Number(message.height) || 40,
                String(message.latex || ""),
                {
                    readOnly: message.readOnly !== false,
                    virtualKeyboardMode: "manual",
                    promptNames: prompts,
                    colorIndex: Number(message.colorIndex) || 7,
                    fontFamily: String(message.fontFamily || "Arial"),
                    fontSize: Number(message.fontSize) || 28,
                    fontStyle: String(message.fontStyle || "normal"),
                    fontAlign: String(message.fontAlign || "izquierda"),
                    visible: message.visible !== false
                }
            );

            $U.mathLiveMeta[fieldId] = {
                pointName: String(message.pointName || ""),
                n: Number(message.n) || 0,
                prompts: prompts.slice(),
                latex: String(message.latex || ""),
                x: x,
                y: y,
                width: Number(message.width) || 120,
                height: Number(message.height) || 40,
                readOnly: message.readOnly !== false,
                colorIndex: Number(message.colorIndex) || 7,
                fontFamily: String(message.fontFamily || "Arial"),
                fontSize: Number(message.fontSize) || 28,
                fontStyle: String(message.fontStyle || "normal"),
                fontAlign: String(message.fontAlign || "izquierda"),
                visible: message.visible !== false
            };

            break;
        }

        case "delete-mathlive": {
            $U.deleteCustomMathLiveById(message.id);
            break;
        }

        case "clear-mathlive": {
            $U.resetCustomMathLive(message.id);
            break;
        }

        case "show-mathlive": {
            $U.showCustomMathLive(message.id);
            break;
        }

        case "hide-mathlive": {
            $U.hideCustomMathLive(message.id);
            break;
        }

        case "begin-file-load": {
            $U.__loadingFile = true;
            console.log("[dgpad] begin-file-load");
            break;
        }

        case "end-file-load": {
            $U.__loadingFile = false;
            console.log("[dgpad] end-file-load");

            setTimeout(function () {
                $U.refreshAllCustomMathLives();
            }, 200);

            break;
        }

      case "set_Source":
        if (message.content && typeof message.content === "string") {
            try {
                window.$CANVAS.load64(message.content);
                window.$CANVAS.paint();
            } catch (err) {
                console.error("❌ Error en set_Source con load64:", err);
            }
        }
        break;
    }
    });

  







