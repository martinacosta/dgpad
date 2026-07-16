
function BlocklyManager(_canvas) {
    var me = this;
    var canvas = _canvas;
    var Cn = canvas.getConstruction();
    var panel = null;
    var path1 = $APP_PATH + "NotPacked/thirdParty/Blockly/";
    var path2 = $APP_PATH + "Blockly/";
    var scripts = [
        path1 + "blockly_compressed.js",
        path1 + "blocks_compressed.js",
        path1 + "javascript_compressed.js",
        path1 + "msg/js/" + $L.blockly.lang,
        path1 + "perso/hacks.js",
        path1 + "perso/blocks/core.js",
        // MEAG start menús acciones y restricciones
        path1 + "perso/blocks/actions.js",
        path1 + "perso/blocks/restrictions.js",
        // MEAG end
        path1 + "perso/blocks/aspect.js",
        path1 + "perso/blocks/geometry.js",
        path1 + "perso/blocks/expressions.js",
        path1 + "perso/blocks/lists.js",
        path1 + "perso/blocks/turtle.js",
        path1 + "perso/blocks/globals.js",
        path1 + "perso/blocks/text.js",
        path1 + "perso/js/core.js",
        // MEAG start menús acciones y restricciones
        path1 + "perso/js/actions.js",
        path1 + "perso/js/restrictions.js",
        // MEAG end
        path1 + "perso/js/aspect.js",
        path1 + "perso/js/geometry.js",
        path1 + "perso/js/expressions.js",
        path1 + "perso/js/lists.js",
        path1 + "perso/js/turtle.js",
        path1 + "perso/js/globals.js",
        path1 + "perso/js/text.js",
    ];

    var source = "";
    var selected = "";
    var workspace = null;
    var OBJ = null;
    var from_edit = false;
    var turtle = new TurtleObject(canvas);

    // *******************************************************
    // ****************** PRINT SOURCE ***********************
    // *******************************************************

    var printPanel = null;

    var closePrint = function () {
        if (printPanel) printPanel.close();
        printPanel = null;
    };

    me.print = function (_m) {
        if (!printPanel) printPanel = new PrintPanel(_canvas, closePrint);
        printPanel.setText(_m);
    };

    // *******************************************************
    // **************** END PRINT SOURCE *********************
    // *******************************************************

    var workspace2SVG = function () {
        var aleph = Blockly.mainWorkspace.svgBlockCanvas_.cloneNode(true);
        aleph.removeAttribute("width");
        aleph.removeAttribute("height");
        if (aleph.children[0] !== undefined) {
            aleph.removeAttribute("transform");
            aleph.children[0].removeAttribute("transform");
            aleph.children[0].children[0].removeAttribute("transform");
            var styleTXT = ".blocklyDraggable {}\n";
            styleTXT += Blockly.Css.CONTENT.join("\n");
            styleTXT = styleTXT.replace(/<<<PATH>>>/g, "");
            styleTXT = styleTXT.replace(/&gt;/g, " ");
            styleTXT = styleTXT.replace(/>/g, " ");
            var linkElm = document.createElement("style");
            var cssTextNode = document.createTextNode(styleTXT);
            linkElm.appendChild(cssTextNode);
            aleph.insertBefore(linkElm, aleph.firstChild);
            var bbox = document.getElementsByClassName("blocklyBlockCanvas")[0].getBBox();
            var svg = new XMLSerializer().serializeToString(aleph);
            svg =
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' +
                bbox.width +
                '" height="' +
                bbox.height +
                '" viewBox="0 0 ' +
                bbox.width +
                " " +
                bbox.height +
                '">' +
                svg +
                "</svg>";
            svg = svg.replace(/<style[^>]*>/g, "<style>");
            svg = svg.replace(/&nbsp;/g, " ");
            return svg;
        }
        return null;
    };

    // ---------------------------
    // Blockly init / globals
    // ---------------------------
    var initBlockly = function () {
        Blockly.Block.prototype.firstadd = true;

        Blockly.Block.prototype.name = function () {
            return this.getFieldValue("name");
        };

        Blockly.getObj = function () {
            return OBJ;
        };

        Blockly.Block.prototype.isInConstruction = function () {
            return this.getSurroundParent() && this.getSurroundParent().type === "dgpad_construction";
        };

        // GLOBALS flyout (custom="GLOBAL" en toolbox)
        Blockly.Globals = {
            NAME_TYPE: "GLOBAL",
            NAMES: Cn.getInterpreter().BLK_GLOB_TAB,
            RENAME: Cn.getInterpreter().BLK_GLOB_RENAME,
        };

        Blockly.Globals.flyoutCategory = function (workspace) {
            var variableList = Blockly.Globals.NAMES();
            variableList.sort(goog.string.caseInsensitiveCompare);
            goog.array.remove(variableList, Blockly.Msg.VARIABLES_DEFAULT_NAME);
            variableList.unshift(Blockly.Msg.VARIABLES_DEFAULT_NAME);

            var xmlList = [];

            var block0 = goog.dom.createDom("block");
            block0.setAttribute("type", "dgpad_global_inc");
            block0.setAttribute("gap", 24);
            xmlList.push(block0);

            for (var i = 0; i < variableList.length; i++) {
                if (Blockly.Blocks["dgpad_global_set"]) {
                    var bSet = goog.dom.createDom("block");
                    bSet.setAttribute("type", "dgpad_global_set");
                    if (Blockly.Blocks["dgpad_global_get"]) bSet.setAttribute("gap", 8);
                    var fSet = goog.dom.createDom("field", null, variableList[i]);
                    fSet.setAttribute("name", "VAR");
                    bSet.appendChild(fSet);
                    xmlList.push(bSet);
                }
                if (Blockly.Blocks["dgpad_global_get"]) {
                    var bGet = goog.dom.createDom("block");
                    bGet.setAttribute("type", "dgpad_global_get");
                    if (Blockly.Blocks["dgpad_global_set"]) bGet.setAttribute("gap", 24);
                    var fGet = goog.dom.createDom("field", null, variableList[i]);
                    fGet.setAttribute("name", "VAR");
                    bGet.appendChild(fGet);
                    xmlList.push(bGet);
                }
            }
            return xmlList;
        };

        // DGPad helpers
        Blockly.dgpad = new (function () {
            var me2 = this;
            var NMS = [];
            me2.VARS = [];
            me2.PARS = [];
            me2.ZC = canvas;
            me2.CN = canvas.getConstruction();
            me2.getBounds = panel.getBounds;

            me2.pushVARS = function (_n) {
                var o = me2.CN.find(_n);
                if (o) me2.VARS.push(o.getVarName());
            };
            me2.pushPARS = function (_n) {
                var o = me2.CN.find(_n);
                if (o) me2.PARS.push(o.getVarName());
            };
            me2.getNames = function () {
                return NMS;
            };
            me2.getObj = function () {
                return OBJ;
            };
            me2.addName = function (_n) {
                NMS.push(_n);
            };
            me2.getObjectsFromType = function (_t) {
                return me2.CN.getObjectsFromType(_t);
            };

            me2.popupArray = function (_t) {
                var props = me2.CN.getAllObjectsFromType(_t);
                var tab = [];
                var mod = OBJ.blocks.getMode()[panel.getMode()];

                // NO actualizar toolbox aquí (se llama muchísimo y generaba “pisadas”)

                for (var i = 0; i < props.length; i++) {
                    if (mod !== "oncompute" || OBJ != props[i]) {
                        const internalName = props[i].getName();
                        const varName = props[i].getVarName();

                        let displayName = internalName;
                        if (internalName.startsWith("blk_btn")) {
                            displayName = $L.blockly.expressions_button + internalName.substring(7);
                        } else if (internalName.startsWith("blk_turtle_exp_")) {
                            displayName = $L.blockly.expressions_trtlExp + internalName.substring(15);
                        } else if (internalName.startsWith("blk_turtle_list_")) {
                            displayName = $L.blockly.expressions_trtlList + internalName.substring(15);
                        }

                        tab.push([displayName, varName]);
                    }
                }

                if (tab.length === 0) tab.push(["? ", ""]);
                return tab;
            };

            me2.objectPopup = function (_t) {
                return new Blockly.FieldDropdown(me2.popupArray(_t));
            };

            me2.getName = canvas.namesManager.getName;
            me2.refresh = canvas.namesManager.refresh;
        })();

        Blockly.bindEvent_(panel.DIV, "mouseup", null, onmouseup);
        canvas.namesManager.setObserver(Blockly.dgpad.getNames);

        Blockly.custom_menu_printSource = function () {
            me.print(
                Blockly.JavaScript.workspaceToCode(workspace)
                    .replace(/^\s*var\s*\w+\s*;/gm, "")
                    .replace(/blockly_var_/g, "")
                    .trim() + "\n"
            );
        };

        Blockly.custom_menu_copyAll = function () {
            var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
            xml = Blockly.Xml.domToText(xml);
            localStorage.setItem("blockly_clipboard", xml);
        };

        Blockly.custom_menu_print = function () {
            var svg = workspace2SVG();
            var svgsrc =
                '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
            svgsrc += svg;

            if (window.$OS_X_APPLICATION) {
                interOp.saveBlocklySVG(svgsrc);
            } else {
                var lnk = $iOS_APPLICATION ? "data-svg:" : "data:image/svg+xml,";
                lnk += $iOS_APPLICATION ? $U.base64_encode(svgsrc) : encodeURIComponent(svgsrc);
                var txt =
                    '<br><br><a href="' +
                    lnk +
                    '" style="-webkit-touch-callout:default;font-size:18px;font-family:Helvetica, Arial, sans-serif;color:#252525;" target="_blank" download="DgpadSvgImage.svg" ><b>' +
                    $L.blockly.downloadSVG +
                    "</b></a>.";
                $U.alert(txt);
            }
        };

        Blockly.custom_menu_copySel = function () {
            if (Blockly.selected) {
                var xml = goog.dom.createDom("xml");
                var blks = Blockly.Xml.blockToDom(Blockly.selected);
                var xy = Blockly.selected.getRelativeToSurfaceXY();
                blks.setAttribute("x", Math.round(xy.x) + 5);
                blks.setAttribute("y", Math.round(xy.y) + 5);
                xml.appendChild(blks);
                localStorage.setItem("blockly_clipboard", Blockly.Xml.domToText(xml));
            }
        };

        Blockly.custom_menu_paste = function () {
            from_edit = false;
            var xml = localStorage.getItem("blockly_clipboard");
            var elt = Blockly.Xml.textToDom(xml);
            Blockly.Xml.domToWorkspace(elt, Blockly.mainWorkspace);
        };

        canvas.setMode(0);

        // Registrar GLOBAL custom flyout si la API existe
        if (Blockly && Blockly.Extensions && typeof Blockly.Extensions.registerToolboxCategoryCallback === "function") {
            Blockly.Extensions.registerToolboxCategoryCallback("GLOBAL", Blockly.Globals.flyoutCategory);
        } else if (Blockly && typeof Blockly.registerToolboxCategoryCallback === "function") {
            Blockly.registerToolboxCategoryCallback("GLOBAL", Blockly.Globals.flyoutCategory);
        }
    };

    // ---------------------------
    // UI helpers
    // ---------------------------
    var changeCSS = function (cname, property, value) {
        var cols = document.getElementsByClassName(cname);
        for (i = 0; i < cols.length; i++) {
            cols[i].style[property] = value;
        }
    };

    var modifyCSSRule = function (className, property, value) {
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            var rules = ss[i].cssRules || ss[i].rules;
            for (var j = 0; j < rules.length; j++) {
                if (rules[j].selectorText === className) {
                    rules[j].style[property] = value;
                }
            }
        }
    };

    // ---------------------------
    // Turtle visibility
    // ---------------------------
    function syncTurtleVisibility() {
        if (panel && typeof panel.isHidden === "function" && panel.isHidden()) {
            turtle.hide();
            canvas.paint();
            return;
        }

        var mod = OBJ && OBJ.blocks ? OBJ.blocks.getMode()[panel.getMode()] : null;
        var isTurtleTab = mod === "onlogo";

        if (isTurtleTab) turtle.show(OBJ);
        else turtle.hide();

        canvas.paint();
    }

    // ---------------------------
    // Toolbox dynamic (UNIFICADO)
    // ---------------------------
    function cloneToolboxRoot() {
        const root =
            (panel && panel.XML && panel.XML.firstElementChild) ? panel.XML.firstElementChild :
            (panel && panel.XML ? panel.XML.querySelector("xml") : null);

        return root ? root.cloneNode(true) : null;
    }

    function removeCategoriesById(toolboxRoot, ids) {
        if (!ids || !ids.length) return;

        const hidden = new Set(ids);
        const categories = toolboxRoot.getElementsByTagName("category");
        const toRemove = [];

        for (let i = 0; i < categories.length; i++) {
            const id = categories[i].getAttribute("id");
            if (id && hidden.has(id)) toRemove.push(categories[i]);
        }

        for (const node of toRemove) {
            node.parentNode && node.parentNode.removeChild(node);
        }
    }

    function removeBlocksByType(toolboxRoot, typeName) {
        var blocks = toolboxRoot.getElementsByTagName("block");
        var toRemove = [];
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].getAttribute("type") === typeName) toRemove.push(blocks[i]);
        }
        for (var j = 0; j < toRemove.length; j++) {
            if (toRemove[j].parentNode) toRemove[j].parentNode.removeChild(toRemove[j]);
        }
    }

    function is3DOrOrigin3D() {
        const obj3d = !!(OBJ && typeof OBJ.is3D === "function" && OBJ.is3D());
        const origin3d = !!(Cn && typeof Cn.isOrigin3D === "function" && Cn.isOrigin3D(OBJ));
        return obj3d || origin3d;
    }

    function updateToolboxDynamic(mod) {
        if (!workspace) return;

        const toolboxRoot = cloneToolboxRoot();
        if (!toolboxRoot) return;

        // Categorías por modo
        let hiddenIds = [];
        if (mod === "onlogo") {
            hiddenIds = ["actions", "restrictions", "io", "functions"];
        } else if (mod === "onprogram" || mod === "onmouseup") {
            hiddenIds = ["turtle"];
        } else if (mod === "ondrag" || mod === "onmousedown") {
            hiddenIds = ["turtle", ,"restrictions","actions","io"];
        } else if (mod === "oninit" || mod === "oncompute") {
            hiddenIds = ["turtle", "io"];
        }

        removeCategoriesById(toolboxRoot, hiddenIds);

        // turtle_rotate: solo en onlogo y si 3D u origen 3D
        const allowRotate = mod === "onlogo" && is3DOrOrigin3D();
        if (!allowRotate) removeBlocksByType(toolboxRoot, "turtle_rotate");

        if (typeof workspace.updateToolbox === "function") {
            workspace.updateToolbox(toolboxRoot);
        } else if (Blockly?.mainWorkspace?.updateToolbox) {
            Blockly.mainWorkspace.updateToolbox(toolboxRoot);
        }
    }

    // ---------------------------
    // Lifecycle
    // ---------------------------
    var onload = function () {
        setTimeout(function () {
            workspace = Blockly.inject(panel.DIV, {
                media: $APP_PATH + "NotPacked/thirdParty/Blockly/media/",
                toolbox: (panel && panel.XML && panel.XML.firstElementChild) ? panel.XML.firstElementChild : panel.XML.firstChild,
                zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 1.0,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.1,
                },
                useModalInputs: true,
                trashcan: true,
            });

            initBlockly();
            workspace.addChangeListener(onchanged);

            changeCSS("blocklyToolboxDiv", "z-index", "9001");
            changeCSS("blocklyMainBackground", "fill-opacity", "0.0");
            changeCSS("blocklySvg", "background-color", "rgba(0,0,0,0)");
            modifyCSSRule(".blocklyText", "font-family", "Verdana, Geneva, sans-serif");
            changeCSS("blocklyTreeLabel", "font-family", "Verdana, Geneva, sans-serif");
            modifyCSSRule(".blocklyWidgetDiv", "z-index", "9002");
            modifyCSSRule(".blocklyWidgetDiv .goog-menu", "border-radius", "10px");
            modifyCSSRule(".blocklyWidgetDiv .goog-menu", "border", "1px solid gray");
            modifyCSSRule(".blocklyWidgetDiv .goog-menu", "background", "rgba(250,250,250,0.9)");
            modifyCSSRule(".blocklyWidgetDiv .goog-menuitem-content", "font", "normal 16px Verdana, Geneva, sans-serif");
            modifyCSSRule(".blocklyWidgetDiv .goog-menuitem-hover", "padding-bottom", "4px");
            modifyCSSRule(".blocklyWidgetDiv .goog-menuitem-hover", "padding-top", "4px");
            modifyCSSRule(".blocklyWidgetDiv .goog-menuitem-content", "padding-bottom", "4px");
            modifyCSSRule(".blocklyWidgetDiv .goog-menuitem-content", "padding-top", "4px");
            modifyCSSRule(".blocklyHighlightedConnectionPath", "stroke", "#fc3");
            modifyCSSRule(".blocklySelected > .blocklyPath", "stroke", "#fc3");
            modifyCSSRule(".blocklyFlyoutBackground", "fill", "#777");
            modifyCSSRule(".blocklyFlyoutBackground", "fill-opacity", "0.5");

            showCallback();
        }, 200);
    };

    var onmouseup = function () {
        if (Blockly.selected && Blockly.selected.onselect && selected != Blockly.selected) {
            Blockly.selected.onselect();
            selected = Blockly.selected;
        } else if (selected != Blockly.selected) {
            selected = "";
        }
    };

    // ---------------------------
    // Workspace change listener
    // ---------------------------
    var onchanged = function (e) {
        if (from_edit) {
            from_edit = false;
            return;
        }

        if (e.type === Blockly.Events.DELETE) {
            let inputs = canvas.getInputs();
            var deletedBlockIds = e.ids || [e.blockId];
            const ws = Blockly.getMainWorkspace();

            for (var i = 0; i < deletedBlockIds.length; i++) {
                var blockId = deletedBlockIds[i];
                parent.postMessage({ action: "delete-speaker", id: `spk_${blockId}` }, "*");
                parent.postMessage({ action: "delete-mathlive", id: `ml_${blockId.replace(/[^a-zA-Z0-9_-]/g, "_")}` }, "*");

                let inputid = blockId + "A";
                const selector = `#${CSS.escape(inputid)}`;
                let input = canvas.getDocObject().parentNode.querySelector(selector);

                if (!Blockly.getObj().blocks.getSource().includes(blockId)) {
                    if (input) {
                        delete inputs[input.name];
                        canvas.setInputs(inputs);
                        input.remove();
                        input = null;
                    }
                }

                if (e.oldXml) {
                    if (typeof e.oldXml === "object") {
                        e.oldXml = new XMLSerializer().serializeToString(e.oldXml);
                    }

                    const xmlContent = `<xml>${e.oldXml}</xml>`;
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

                    const parseError = xmlDoc.getElementsByTagName("parsererror");
                    if (parseError.length > 0) {
                        console.error("Error en el análisis del XML:", parseError[0].textContent);
                        return;
                    }

                    const blocks = xmlDoc.getElementsByTagName("block");

                    for (let k = 0; k < blocks.length; k++) {
                        const block = blocks[k];
                        const blockType = block.getAttribute("type");

                        if (blockType === "dgpad_actions_iman") {
                            const fields = block.getElementsByTagName("field");
                            let imantadoObj = null;
                            let imantadoPto = null;

                            for (let j = 0; j < fields.length; j++) {
                                const field = fields[j];
                                const fieldName = field.getAttribute("name");
                                const fieldValue = field.textContent;

                                if (fieldName === "NAME") {
                                    if (!imantadoObj) imantadoObj = fieldValue;
                                    else imantadoPto = fieldValue;
                                }
                            }

                            const valueNodes = block.getElementsByTagName("value");
                            for (let n = 0; n < valueNodes.length; n++) {
                                const nestedBlock = valueNodes[n].getElementsByTagName("block")[0];
                                if (nestedBlock) {
                                    const nestedFields = nestedBlock.getElementsByTagName("field");
                                    for (let m = 0; m < nestedFields.length; m++) {
                                        const nf = nestedFields[m];
                                        if (nf.getAttribute("name") === "NAME") {
                                            imantadoPto = nf.textContent;
                                        }
                                    }
                                }
                            }

                            if (imantadoObj && imantadoPto) {
                                Cn.getInterpreter().Interpret(`imantar("${imantadoPto}", "${imantadoObj}", 0);`);
                            } else {
                                console.error("Error: Los valores del bloque no son válidos.", imantadoObj, imantadoPto);
                            }
                        }

                        const deletableInputBlocks = ["turtle_input", "turtle_input_number"];
                        if (deletableInputBlocks.includes(blockType)) {
                            const bid = block.getAttribute("id");
                            const inputId = `inp_${bid}`;
                            parent.postMessage({ action: "delete-input", id: inputId }, "*");
                        }
                    }
                }
            }
        }

        if (OBJ) {
            var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
            var mod = OBJ.blocks.getMode()[panel.getMode()];

            updateToolboxDynamic(mod);

            if (xml.innerHTML === "") {
                OBJ.blocks.setBehavior(mod, null, null, null);
                me.resetTurtle(OBJ.getVarName());
            } else {
                xml = Blockly.Xml.domToText(xml);
                Blockly.dgpad.VARS = [];
                Blockly.dgpad.PARS = [];
                var snc = Blockly.JavaScript.workspaceToCode(workspace);
                OBJ.blocks.setBehavior(mod, xml, snc, null);
                OBJ.blocks.setChilds(mod, Blockly.dgpad.VARS);
                OBJ.blocks.setParents(mod, Blockly.dgpad.PARS);
            }

            Cn.orderObjects();

            if (mod !== "onprogram") {
                OBJ.blocks.evaluate(mod);
                Cn.computeAll();
                canvas.paint();
            }
        }
    };

    // ---------------------------
    // Script loader
    // ---------------------------
    var addScript = function (_scpnum) {
        var next = _scpnum + 1;
        var parent = document.getElementsByTagName("head")[0];
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = scripts[_scpnum];
        s.onload = next === scripts.length ? onload : function () { addScript(next); };
        parent.appendChild(s);
    };

    // ---------------------------
    // Panel / toolbox load
    // ---------------------------
    var loadBlockly = function () {
        panel = new BlocklyPanel(
            window.document.body,
            canvas,
            hideCallback,
            currentTabCallBack,
            canvas.getHeight() - canvas.prefs.controlpanel.size
        );

        var request = new XMLHttpRequest();
        request.open("GET", path1 + "perso/Blockly_toolbox.xml", true);
        request.send(null);
        request.onload = function () {
            var xml = request.responseText;
            for (var obj in $L.blockly) {
                var key = "$L.blockly." + obj.toString();
                xml = xml.split(key).join($L.blockly[obj]);
            }
            panel.XML.innerHTML = xml;
            addScript(0);
        };
    };

    // ---------------------------
    // Tabs / panel callbacks
    // ---------------------------
    var showCurrentTab = function () {
        Blockly.mainWorkspace.clear();
        panel.setMode(OBJ.blocks.getMode(), OBJ.blocks.getCurrent());
        var xml = OBJ.blocks.getCurrentXML();
        if (xml) {
            var elt = Blockly.Xml.textToDom(xml);
            Blockly.Xml.domToWorkspace(elt, workspace);
        }
        setTimeout(function () {
            var mod = OBJ.blocks.getMode()[panel.getMode()];
            updateToolboxDynamic(mod);
            syncTurtleVisibility();
        }, 300);
    };

    var currentTabCallBack = function () {
        Blockly.mainWorkspace.clear();
        if (OBJ) {
            var mod = OBJ.blocks.getMode()[panel.getMode()];
            OBJ.blocks.setCurrent(mod);
            var xml = OBJ.blocks.getXML(mod);
            if (xml) {
                var elt = Blockly.Xml.textToDom(xml);
                Blockly.Xml.domToWorkspace(elt, workspace);
            }
            updateToolboxDynamic(mod);
            syncTurtleVisibility();
        }
        from_edit = true;
    };

    me.reload_workspace = function () {
        currentTabCallBack();
    };

    var hideCallback = function () {
        changeCSS("blocklyToolboxDiv", "visibility", "hidden");
        Blockly.ContextMenu.hide();
        turtle.hide();
        canvas.paint();
    };

    var showCallback = function () {
        setTimeout(function () {
            changeCSS("blocklyToolboxDiv", "visibility", "visible");
            panel.setTitle(OBJ.getName());
        }, 320);
        showCurrentTab();
    };

    var show = function () {
        if (panel === null) loadBlockly();
        else {
            panel.show();
            showCallback();
        }
    };

    // ---------------------------
    // Public turtle API
    // ---------------------------
    me.paintTurtle = function () {
        turtle.paint();
    };

    me.changeTurtleUVW = function (_n, _u, _v, _w) {
        turtle.changeUVW(_n, _u, _v, _w);
    };

    me.changeTurtlePT = function (_name, _pt) {
        turtle.changePT(_name, _pt);
    };

    me.resetTurtle = function (_name) {
        turtle.reset(_name);
    };

    // ---------------------------
    // Edit object hook
    // ---------------------------
    me.tryEdit = function (_o) {
        if (panel && !panel.isHidden()) {
            if (Blockly.selected && Blockly.selected.getName) {
                Blockly.selected.getName(_o);
            } else {
                me.edit(_o);
            }
            return true;
        }
        return false;
    };

    me.edit = function (_o) {
        OBJ = _o;
        from_edit = true;
        show();
    };
}
