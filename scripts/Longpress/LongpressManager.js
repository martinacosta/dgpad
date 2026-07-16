function LongpressManager(_canvas) {
  var canvas = _canvas;
  var Cn = canvas.getConstruction();
  var me = this;
  var panel = null;
  var x = 0;
  var y = 0;

  var newExp = function(_ex) {
    var OBJTablero = new ExpressionObject(Cn, "_a", "", "", "", _ex, x, y);
    if (canvas.namesManager.isVisible())
      canvas.namesManager.setName(OBJTablero);
    else
      OBJTablero.setName(getName("abcdefghijklmnopqrsuvw"));
    OBJTablero.setT("");
    var r = Math.random() * 128;
    var g = Math.random() * 128;
    var b = Math.random() * 128;
    OBJTablero.setRGBColor(r, g, b);
    canvas.addObject(OBJTablero);
    return OBJTablero;
  };

  var newList = function(_ex) {
    var OBJTablero = new ListObject(Cn, "_l", _ex);
    OBJTablero.setSegmentsSize(0);
    var c = _ex.getColor();
    OBJTablero.setRGBColor(c.getR(), c.getG(), c.getB());
    canvas.addObject(OBJTablero);
    return OBJTablero;
  };

  var getList = function() {
    var cx = Cn.coordsSystem.x(Cn.getWidth() / 2);
    var cy = Cn.coordsSystem.y(Cn.getHeight() / 2);
    var l = Cn.coordsSystem.l(Cn.getHeight()) / 4;
    var L = l * (1 + Math.sqrt(5)) / 2;
    // var str="["+(cx-L/2)+","+(cy-l/2)+"]";
    var t = [
      [cx - L / 2, cy - l / 2],
      [cx + L / 2, cy - l / 2],
      [cx + L / 2, cy + l / 2],
      [cx - L / 2, cy + l / 2],
      [cx - L / 2, cy - l / 2]
    ];
    for (var i = 0; i < t.length; i++) {
      t[i] = "[" + t[i].toString() + "]";
    };
    return "[" + t.toString() + "]";
  };

  var createExp = function() {
    newExp("(1+sqrt(5))/2");
    Cn.compute();
    canvas.paint();
  };

  var createExpPts = function() {
    newList(newExp(getList()));
    Cn.compute();
    canvas.paint();
  };

  var createExpSegs = function() {
    var OBJTablero = newList(newExp(getList()));
    OBJTablero.setSegmentsSize(1);
    Cn.compute();
    canvas.paint();
  };


var createTableroPuntos = function () {
  // -------------------------
  // Helpers
  // -------------------------
  function genId() {
    return Math.random().toString(36).slice(2, 6) + Date.now().toString(36);
  }

  function forceComputeRotulosSync() {
    // 1) Recalcula coords (si existe)
    var e = Cn.getInterpreter().Interpret(
      'var e=Find("FichasCoords");' +
      'if(e&&e.compute)e.compute();'
    );

    // 2) Recalcula el turtle list del rotulador
    Cn.getInterpreter().Interpret(
      'var t=Find("blk_turtle_list_rotulaFichas");' +
      'if(t&&t.compute)t.compute();'
    );

    // 3) IMPORTANTÍSIMO: repintar para que el TURTLE_PRINT se vea
    canvas.paint();
  }

  // -------------------------
  // Tablero + Textos
  // -------------------------
  var OBJTablero = new ExpressionObject(Cn, "Tablero", "", "", "", "[[0,0],[1,0],[0,1],[1,1]]", x, y);
  canvas.addObject(OBJTablero);

  var OBJlistaTextos = new ExpressionObject(Cn, "Textos", "", "", "", "['1','2','3','4']", x, y + 30);
  
  canvas.addObject(OBJlistaTextos);

  var OBJTableroPtos = new ListObject(Cn, "TableroPtos", OBJTablero);
  OBJTableroPtos.setSegmentsSize(0);
  OBJTableroPtos.setHidden(1);
  OBJTableroPtos.setMagnetSlotsExclusive(true);
  canvas.addObject(OBJTableroPtos);

  // -------------------------
  // Control + Script -> fichasT
  // -------------------------
  var OBJControl = new ExpressionObject(Cn, "Control", "", "", "", "0", x, y + 20);
  OBJControl.setHidden(true);
  canvas.addObject(OBJControl);

  var OBJScript = new ExpressionObject(
    Cn,
    "Script",
    "",
    "",
    "",
    `
    if (Control) {
      var L = Find("TableroPtos");
      var occ = L.getExclusiveSlotOccupants(); // nombres de fichas en slots

      // Mapa ficha -> texto usando el mismo orden de FichasCoords
      var fichas = [];
      var puntos = me.C.getObjectsFromType("point");
      for (var i = 0; i < puntos.length; i++) {
        var nm = puntos[i].getName();
        if (nm && nm.indexOf("ficha") === 0 && nm.length > 5 && nm !== "ficha0") fichas.push(nm);
      }
      fichas.sort();

      var textos = Textos;
      if (!textos || typeof textos.length !== "number") textos = [];

      var map = {};
      var n = fichas.length;
      if (textos.length < n) n = textos.length;
      for (var j = 0; j < n; j++) map[fichas[j]] = "" + textos[j];

      // Convertir ocupantes -> textos
      var out = [];
      for (var k = 0; k < occ.length; k++) {
        var name = occ[k];
        out.push(map.hasOwnProperty(name) ? map[name] : "");
      }

      GLOBAL_SET("fichasT", out);
    };

    0
    `,
    x,
    y + 40
  );
  OBJScript.setHidden(true);
  canvas.addObject(OBJScript);

  // -------------------------
  // Reservar nombres ficha / ficha0
  // -------------------------
  var PtoOculto1 = new PointObject(Cn, "ficha", 5000, 500);
  var PtoOculto2 = new PointObject(Cn, "ficha0", 5000, 500);
  PtoOculto1.setHidden(true);
  PtoOculto2.setHidden(true);
  canvas.addObject(PtoOculto1);
  canvas.addObject(PtoOculto2);

  // -------------------------
  // Fichas iniciales
  // -------------------------
  var OBJficha1 = new PointObject(Cn, "ficha1", x, y - 100);
  var OBJficha2 = new PointObject(Cn, "ficha2", x, y - 200);
  var OBJficha3 = new PointObject(Cn, "ficha3", x, y - 300);
  var OBJficha4 = new PointObject(Cn, "ficha4", x, y - 400);

  var fichasInit = [OBJficha1, OBJficha2, OBJficha3, OBJficha4];
  for (var i = 0; i < fichasInit.length; i++) {
    fichasInit[i].setShowName(0);
    fichasInit[i].setSize(18);
    fichasInit[i].setLayer(-1);
    fichasInit[i].setColor("#f6f6f9");
    fichasInit[i].addMagnet(OBJTableroPtos, 100);
    canvas.addObject(fichasInit[i]);
  }

  // -------------------------
  // Expresión: coords2D de fichas (ordenadas)
  // -------------------------
  var OBJFichasCoords = new ExpressionObject(
    Cn,
    "FichasCoords",
    "",
    "",
    "",
    "var fichas=[];\n" +
      "var fichasCoords=[];\n" +
      "\n" +
      "puntos=me.C.getObjectsFromType(\"point\");\n" +
      "puntos.sort();\n" +
      "for (i=0; i<puntos.length; i++){\n" +
      " if(puntos[i].getName().includes(\"ficha\") && puntos[i].getName().length>5 && puntos[i].getName()!=\"ficha0\"){fichas.push(puntos[i].getName())}\n" +
      "};\n" +
      "fichas.sort();\n" +
      "\n" +
      "for (i=0; i<fichas.length; i++){\n" +
      " fichasCoords.push(Find(fichas[i]).coords2D())\n" +
      "};\n" +
      "\n" +
      "fichasCoords",
    x,
    y - 40
  );
  OBJFichasCoords.setHidden(true);
  canvas.addObject(OBJFichasCoords);

  // -------------------------
  // Punto rotulador + BLK
  // -------------------------
  var rotulaFichas = new PointObject(Cn, "rotulaFichas", x + 2, y + 2);
  rotulaFichas.setShowName(0);
  rotulaFichas.setSize(10);
  rotulaFichas.setHidden(1);
  
  canvas.addObject(rotulaFichas);

  var xmlRotulaFichas = `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="turtle_pen" id="${genId()}" x="25" y="-8">
    <field name="PEN">penUp</field>
    <next>
      <block type="controls_for" id="${genId()}">
        <field name="VAR">i</field>
        <value name="FROM"><block type="math_number" id="${genId()}"><field name="NUM">0</field></block></value>
        <value name="TO">
          <block type="math_arithmetic" id="${genId()}">
            <field name="OP">MINUS</field>
            <value name="A">
              <block type="lists_length" id="${genId()}">
                <value name="VALUE">
                  <block type="dgpad_get_object_short" id="${genId()}">
                    <field name="NAME">FichasCoords</field>
                  </block>
                </value>
              </block>
            </value>
            <value name="B"><block type="math_number" id="${genId()}"><field name="NUM">1</field></block></value>
          </block>
        </value>
        <value name="BY"><block type="math_number" id="${genId()}"><field name="NUM">1</field></block></value>
        <statement name="DO">
          <block type="turtle_join_pt" id="${genId()}">
            <value name="VALUE">
              <shadow type="dgpad_get_point_short_turtle" id="${genId()}"><field name="NAME">ficha1</field></shadow>
              <block type="math_arithmetic" id="${genId()}">
                <field name="OP">ADD</field>
                <value name="A">
                  <block type="dgpad_get_list" id="${genId()}">
                    <value name="NAME">
                      <block type="dgpad_get_object_short" id="${genId()}"><field name="NAME">FichasCoords</field></block>
                    </value>
                    <value name="INDEX"><block type="variables_get" id="${genId()}"><field name="VAR">i</field></block></value>
                  </block>
                </value>
                <value name="B">
                  <block type="dgpad_pt2d" id="${genId()}">
                    <value name="a0"><block type="math_number" id="${genId()}"><field name="NUM">0</field></block></value>
                    <value name="a1"><block type="math_number" id="${genId()}"><field name="NUM">-0.2</field></block></value>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <block type="turtle_reset_angles" id="${genId()}">
                <next>
                  <block type="turtle_print" id="${genId()}">
                    <value name="TEXT">
                      <shadow type="text" id="${genId()}"><field name="TEXT">...</field></shadow>
                      <block type="dgpad_get_list" id="${genId()}">
                        <value name="NAME">
                          <block type="dgpad_get_object_short" id="${genId()}"><field name="NAME">Textos</field></block>
                        </value>
                        <value name="INDEX"><block type="variables_get" id="${genId()}"><field name="VAR">i</field></block></value>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>`;

  var syncRotula ="TURTLE_UP(true);\nfor (var blockly_var_i = 0 ; blockly_var_i <= Math.minus((FichasCoords).length,1) ; blockly_var_i = blockly_var_i + 1){\n  TURTLE_JOIN_PT((Math.plus(((FichasCoords)[blockly_var_i]),([0,-0.2]))));\n  TURTLE_RESET();\n  TURTLE_PRINT(((Textos)[blockly_var_i]));\n};"
  ;

  Cn.getInterpreter().BLK(rotulaFichas.getName(), {
    onlogo: { xml: xmlRotulaFichas, sync: syncRotula, parents: ["FichasCoords", "Textos"] },
    current: "onlogo",
  });

  Cn.getInterpreter().Interpret(
    'var t=Find("blk_turtle_list_' + rotulaFichas.getName() + '");' +
    'if(t&&t.compute)t.compute();'
  );
  // -------------------------
  // Dibujo fichas (solo cuadrado) + ondrag/onmouseup recompute rotulos
  // -------------------------
  function turtleXMLForFicha(nombrePunto, lado, offset, fill) {
    var ids = [];
    for (var i = 0; i < 17; i++) ids.push(genId());
    return `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="turtle_pen" id="${ids[0]}" x="9" y="3">
    <field name="PEN">penUp</field>
    <next>
      <block type="turtle_join_pt" id="${ids[1]}">
        <value name="VALUE">
          <shadow type="dgpad_get_point_short_turtle" id="${ids[2]}"><field name="NAME">${nombrePunto}</field></shadow>
          <block type="math_arithmetic" id="${ids[3]}">
            <field name="OP">ADD</field>
            <value name="A"><block type="dgpad_get_object_short" id="${ids[4]}"><field name="NAME">${nombrePunto}</field></block></value>
            <value name="B">
              <block type="dgpad_pt2d" id="${ids[5]}">
                <value name="a0"><block type="math_number" id="${ids[6]}"><field name="NUM">${offset}</field></block></value>
                <value name="a1"><block type="math_number" id="${ids[7]}"><field name="NUM">${offset}</field></block></value>
              </block>
            </value>
          </block>
        </value>
        <next>
          <block type="turtle_reset_angles" id="${ids[8]}">
            <next>
              <block type="turtle_pen" id="${ids[9]}">
                <field name="PEN">penDown</field>
                <next>
                  <block type="controls_repeat_ext" id="${ids[10]}">
                    <value name="TIMES"><block type="math_number" id="${ids[11]}"><field name="NUM">4</field></block></value>
                    <statement name="DO">
                      <block type="turtle_turn" id="${ids[12]}">
                        <field name="DIR">turnRight</field>
                        <value name="VALUE"><shadow type="turtle_angle_input" id="${ids[13]}"><field name="ANGLE">90</field></shadow></value>
                        <next>
                          <block type="turtle_move" id="${ids[14]}">
                            <field name="DIR">moveForward</field>
                            <field name="UNITS">un</field>
                            <value name="VALUE"><shadow type="math_number" id="${ids[15]}"><field name="NUM">${lado}</field></shadow></value>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="turtle_fill" id="${ids[16]}">
                        <value name="OP"><shadow type="math_number" id="${genId()}"><field name="NUM">${fill}</field></shadow></value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`;
  }

  function turtleSYNCForFicha(nombrePunto, lado, offset, fill) {
    return (
      "TURTLE_UP(true);" +
      "TURTLE_JOIN_PT((Math.plus((" + nombrePunto + "),([" + offset + "," + offset + "]))));" +
      "TURTLE_RESET();" +
      "TURTLE_UP(false);" +
      "for (var k=1;k<=4;k++){TURTLE_TURN(-90);TURTLE_MV(" + lado + ",false);};" +
      "TURTLE_FILL(" + fill + ");" +
      "TURTLE_UP(true);"
    );
  }

  function fichaOnDragXml(nombrePunto) {
    var a = genId(), b = genId()
    return `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="dgpad_compute" id="${a}" x="18" y="18">
    <field name="OBJECT">FichasCoords</field>
    <next>
      <block type="dgpad_compute" id="${b}">
        <field name="OBJECT">blk_turtle_list_rotulaFichas</field>
      </block>
    </next>
  </block>
  
</xml>`;
  }

  function fichaOnDragSync() {
    return (
      "FichasCoords.compute();" +
      "FichasCoords.compute();" +
    "var t=Find('blk_turtle_list_rotulaFichas'); if(t&&t.compute) t.compute();" +
    "canvas.paint();"

      
    );
  }

  function fichaOnMouseUpXml() {
    var a = genId(), b = genId(), c = genId(), d = genId(), e = genId(), f = genId();
    return `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="dgpad_set_object" id="${a}" x="33" y="261">
    <field name="TYPE">expression</field>
    <field name="NAME">Control</field>
    <value name="obj_val"><block type="math_number" id="${b}"><field name="NUM">1</field></block></value>
    <next>
      <block type="dgpad_set_object" id="${c}">
        <field name="TYPE">expression</field>
        <field name="NAME">Control</field>
        <value name="obj_val"><block type="math_number" id="${d}"><field name="NUM">0</field></block></value>
        <next>
          <block type="dgpad_compute" id="${e}">
            <field name="OBJECT">FichasCoords</field>
            <next>
              <block type="dgpad_compute" id="${f}">
                <field name="OBJECT">blk_turtle_list_rotulaFichas</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`;
  }

  function fichaOnMouseUpSync() {
    return (
      "var blockly_var_temp_var = 1;\n" +
      "SET_EXP(\"Control\",blockly_var_temp_var);\n" +
      "var blockly_var_temp_var2 = 0;\n" +
      "SET_EXP(\"Control\",blockly_var_temp_var2);\n" +
      "FichasCoords.compute();\n" +
      
      "canvas.paint();"
    );
  }

  function setFichaBLK(punto) {
    var name = punto.getName();
    Cn.getInterpreter().BLK(name, {
      onlogo: {
        xml: turtleXMLForFicha(name, 0.8, 0.4, 80),
        sync: turtleSYNCForFicha(name, 0.8, 0.4, 80),
      },
      ondrag: {
        xml: fichaOnDragXml(name),
        sync: fichaOnDragSync(),
        childs: ["blk_turtle_list_rotulaFichas","FichasCoords"]
      },
      onmouseup: {
        xml: fichaOnMouseUpXml(),
        sync: fichaOnMouseUpSync(),
        childs: ["Control"],
      },
      current: "onlogo",
    });
    
  }
  

  

  setFichaBLK(OBJficha1);
  setFichaBLK(OBJficha2);
  setFichaBLK(OBJficha3);
  setFichaBLK(OBJficha4);

  
  
  

  

  // -------------------------
  // Punto que dibuja el tablero
  // -------------------------
  var dibujaTablero = new PointObject(Cn, "dibujaTablero", -10, -6);
  canvas.addObject(dibujaTablero);

  var xmlTablero = `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="turtle_pen" id="${genId()}" x="25" y="-8">
    <field name="PEN">penUp</field>
    <next>
      <block type="controls_for" id="${genId()}">
        <field name="VAR">i</field>
        <value name="FROM"><block type="math_number" id="${genId()}"><field name="NUM">0</field></block></value>
        <value name="TO">
          <block type="math_arithmetic" id="${genId()}">
            <field name="OP">MINUS</field>
            <value name="A">
              <block type="lists_length" id="${genId()}">
                <value name="VALUE">
                  <block type="dgpad_get_object_short" id="${genId()}"><field name="NAME">Tablero</field></block>
                </value>
              </block>
            </value>
            <value name="B"><block type="math_number" id="${genId()}"><field name="NUM">1</field></block></value>
          </block>
        </value>
        <value name="BY"><block type="math_number" id="${genId()}"><field name="NUM">1</field></block></value>
        <statement name="DO">
          <block type="turtle_join_pt" id="${genId()}">
            <value name="VALUE">
              <shadow type="dgpad_get_point_short_turtle" id="${genId()}"><field name="NAME">ficha1</field></shadow>
              <block type="math_arithmetic" id="${genId()}">
                <field name="OP">ADD</field>
                <value name="A">
                  <block type="dgpad_get_list" id="${genId()}">
                    <value name="NAME">
                      <block type="dgpad_get_object_short" id="${genId()}"><field name="NAME">Tablero</field></block>
                    </value>
                    <value name="INDEX"><block type="variables_get" id="${genId()}"><field name="VAR">i</field></block></value>
                  </block>
                </value>
                <value name="B">
                  <block type="dgpad_pt2d" id="${genId()}">
                    <value name="a0"><block type="math_number" id="${genId()}"><field name="NUM">0.5</field></block></value>
                    <value name="a1"><block type="math_number" id="${genId()}"><field name="NUM">0.5</field></block></value>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <block type="turtle_reset_angles" id="${genId()}">
                <next>
                  <block type="turtle_pen" id="${genId()}">
                    <field name="PEN">penDown</field>
                    <next>
                      <block type="controls_repeat_ext" id="${genId()}">
                        <value name="TIMES"><block type="math_number" id="${genId()}"><field name="NUM">4</field></block></value>
                        <statement name="DO">
                          <block type="turtle_turn" id="${genId()}">
                            <field name="DIR">turnRight</field>
                            <value name="VALUE"><shadow type="turtle_angle_input" id="${genId()}"><field name="ANGLE">90</field></shadow></value>
                            <next>
                              <block type="turtle_move" id="${genId()}">
                                <field name="DIR">moveForward</field>
                                <field name="UNITS">un</field>
                                <value name="VALUE"><shadow type="math_number" id="${genId()}"><field name="NUM">1</field></shadow></value>
                              </block>
                            </next>
                          </block>
                        </statement>
                        <next><block type="turtle_pen" id="${genId()}"><field name="PEN">penUp</field></block></next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>`;

  var syncTablero =
    "TURTLE_UP(true);" +
    "for (var i=0;i<=Math.minus((Tablero).length,1);i=i+1){" +
      "TURTLE_JOIN_PT((Math.plus(((Tablero)[i]),([0.5,0.5]))));" +
      "TURTLE_RESET();" +
      "TURTLE_UP(false);" +
      "for (var c=1;c<=4;c++){TURTLE_TURN(-(90));TURTLE_MV(1,false);};" +
      "TURTLE_UP(true);" +
    "};";

  Cn.getInterpreter().BLK(dibujaTablero.getName(), {
    onlogo: { xml: xmlTablero, sync: syncTablero, parents: ["Tablero"] },
    current: "onlogo",
  });

  // -------------------------
  // Botón crear ficha + DGScript (crea ficha + agrega texto + recomputa rotulos)
  // -------------------------
  var OBJcontrolFichas = new ExpressionObject(Cn, "controlFichas", "", "", "", "0", x, y + 80);
  OBJcontrolFichas.setHidden(true);
  canvas.addObject(OBJcontrolFichas);

  var OBJcreaFicha = new BlocklyButtonObject(Cn, "creaFicha", "creaNuevaFicha", x - 40, y);
  canvas.addObject(OBJcreaFicha);
  Cn.getInterpreter().BLK(OBJcreaFicha.getName(), {
    onprogram: {
      xml: "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"dgpad_set_object\" id=\"a\" x=\"38\" y=\"159\"><field name=\"TYPE\">expression</field><field name=\"NAME\">controlFichas</field><value name=\"obj_val\"><block type=\"math_number\" id=\"b\"><field name=\"NUM\">1</field></block></value><next><block type=\"dgpad_set_object\" id=\"c\"><field name=\"TYPE\">expression</field><field name=\"NAME\">controlFichas</field><value name=\"obj_val\"><block type=\"math_number\" id=\"d\"><field name=\"NUM\">0</field></block></value></block></next></block></xml>",
      sync:
        'var blockly_var_temp_var = 1 ;\n' +
        'SET_EXP("controlFichas",blockly_var_temp_var);\n' +
        'var blockly_var_temp_var2 = 0 ;\n' +
        'SET_EXP("controlFichas",blockly_var_temp_var2);\n',
        
      childs: ["controlFichas"],
      
    },
    current: "onprogram",
  });
  

  var OBJscriptFichas = new ExpressionObject(Cn, "scriptFichas", "", "", "", "0", x, y - 60);
  OBJscriptFichas.setHidden(true);
  canvas.addObject(OBJscriptFichas);


var script = `
if (controlFichas) {
  var nm = Point("ficha", Math.random()*3-4, Math.random()*3-4);
  var p = Find(nm);
  p.setShowName(0);
  p.setSize(18);
  p.setLayer(-1);
  p.setColor("#f6f6f9");
  p.addMagnet(Find("TableroPtos"), 100);

  


// -------------------------
// Actualizar Textos (robusto: limpia \"...\" y fuerza operadores como string)
// -------------------------
var txt = Find("Textos");
var src = (txt && txt.getE1 && txt.getE1().getSource) ? txt.getE1().getSource() : "[]";

function parseListLiteral(s) {
  if (typeof s !== "string") return [];
  s = s.trim();

  // si viene como Textos=[...]
  var eq = s.indexOf("=");
  if (eq !== -1) s = s.slice(eq + 1).trim();

  if (!(s[0] === "[" && s[s.length - 1] === "]")) return [];

  var body = s.slice(1, -1);
  var out = [];
  var token = "";
  var inQ = false;
  var q = "";

  function pushTok(t) {
    t = (t || "").trim();
    if (!t) return;

    var bs = String.fromCharCode(92); // '\'

    // ✅ des-escapar \"  ->  "
    t = t.split(bs + '"').join('"');

    // ✅ si quedó quoted, es string
    var a0 = t[0], a1 = t[t.length - 1];
    if ((a0 === "'" && a1 === "'") || (a0 === '"' && a1 === '"')) {
      out.push(t.slice(1, -1));
      return;
    }

    if (t === "null") { out.push(null); return; }
    if (t === "NaN") { out.push(NaN); return; }

    // ✅ operadores sueltos => string
    if (t === "+" || t === "-" || t === "*" || t === "/") { out.push(t); return; }

    var n = Number(t);
    if (!Number.isNaN(n)) { out.push(n); return; }

    out.push(t);
  }

  for (var i = 0; i < body.length; i++) {
    var ch = body[i];

    if (inQ) {
      token += ch;
      if (ch === q) inQ = false;
      continue;
    }

    if (ch === "'" || ch === '"') {
      inQ = true;
      q = ch;
      token += ch;
      continue;
    }

    if (ch === "," || ch === ";") {
      pushTok(token);
      token = "";
      continue;
    }

    token += ch;
  }

  pushTok(token);
  return out;
}

var arr = parseListLiteral(src);

// ✅ añade nuevo texto (string)
arr.push(String(arr.length + 1));

// ✅ guardar SIEMPRE con comillas simples (sin escapes; usuario sin caracteres especiales)
function toListLiteral(a) {
  var out = [];
  for (var i = 0; i < a.length; i++) {
    var x = a[i];
    if (typeof x === "string") out.push("'" + x + "'");
    else if (typeof x === "number") out.push(isNaN(x) ? "NaN" : String(x));
    else if (x == null) out.push("null");
    else out.push("'" + String(x) + "'");
  }
  return "[" + out.join(",") + "]";
}

if (txt && txt.setE1) {
  txt.setE1(toListLiteral(arr)); // -> ['A','(',')','+','-','6','7','8']
  if (txt.compute) txt.compute();
}
    

  // aplica BLK base (cuadrado) + ondrag/onmouseup con recompute de rotulos
  var id = function(){return Math.random().toString(36).substr(2,4)+Date.now().toString(36);};

  var onlogoXml =
    '<xml xmlns="http://www.w3.org/1999/xhtml">' +
    '<block type="turtle_pen" id="'+id()+'" x="9" y="3"><field name="PEN">penUp</field><next>' +
      '<block type="turtle_join_pt" id="'+id()+'"><value name="VALUE">' +
        '<shadow type="dgpad_get_point_short_turtle" id="'+id()+'"><field name="NAME">'+nm+'</field></shadow>' +
        '<block type="math_arithmetic" id="'+id()+'"><field name="OP">ADD</field>' +
          '<value name="A"><block type="dgpad_get_object_short" id="'+id()+'"><field name="NAME">'+nm+'</field></block></value>' +
          '<value name="B"><block type="dgpad_pt2d" id="'+id()+'">' +
            '<value name="a0"><block type="math_number" id="'+id()+'"><field name="NUM">0.4</field></block></value>' +
            '<value name="a1"><block type="math_number" id="'+id()+'"><field name="NUM">0.4</field></block></value>' +
          '</block></value>' +
        '</block>' +
      '</value><next>' +
        '<block type="turtle_reset_angles" id="'+id()+'"><next>' +
          '<block type="turtle_pen" id="'+id()+'"><field name="PEN">penDown</field><next>' +
            '<block type="controls_repeat_ext" id="'+id()+'">' +
              '<value name="TIMES"><block type="math_number" id="'+id()+'"><field name="NUM">4</field></block></value>' +
              '<statement name="DO"><block type="turtle_turn" id="'+id()+'"><field name="DIR">turnRight</field>' +
                '<value name="VALUE"><shadow type="turtle_angle_input" id="'+id()+'"><field name="ANGLE">90</field></shadow></value><next>' +
                  '<block type="turtle_move" id="'+id()+'"><field name="DIR">moveForward</field><field name="UNITS">un</field>' +
                    '<value name="VALUE"><shadow type="math_number" id="'+id()+'"><field name="NUM">0.8</field></shadow></value>' +
                  '</block>' +
                '</next></block></statement>' +
              '<next><block type="turtle_fill" id="'+id()+'"><value name="OP"><shadow type="math_number" id="'+id()+'"><field name="NUM">80</field></shadow></value></block></next>' +
            '</block>' +
          '</next></block>' +
        '</next></block>' +
      '</next></block>' +
    '</next></block></xml>';

  var onlogoSync =
    'TURTLE_UP(true);' +
    'TURTLE_JOIN_PT((Math.plus((' + nm + '),([0.4,0.4]))));' +
    'TURTLE_RESET();' +
    'TURTLE_UP(false);' +
    'for (var k=1;k<=4;k++){TURTLE_TURN(-90);TURTLE_MV(0.8,false);};' +
    'TURTLE_FILL(80);' +
    'TURTLE_UP(true);';

  var ondragXml =
    '<xml xmlns="http://www.w3.org/1999/xhtml">' +
      '<block type="dgpad_compute" id="'+id()+'" x="18" y="18">' +
        '<field name="OBJECT">FichasCoords</field>' +
        '<next><block type="dgpad_compute" id="'+id()+'"><field name="OBJECT">blk_turtle_list_rotulaFichas</field></block></next>' +
      '</block>' +
    '</xml>';

  var ondragSync =
    "FichasCoords.compute();blk_turtle_list_rotulaFichas.compute();";

  var onmouseupXml =
    '<xml xmlns="http://www.w3.org/1999/xhtml">' +
      '<block type="dgpad_set_object" id="'+id()+'" x="33" y="261">' +
        '<field name="TYPE">expression</field><field name="NAME">Control</field>' +
        '<value name="obj_val"><block type="math_number" id="'+id()+'"><field name="NUM">1</field></block></value>' +
        '<next><block type="dgpad_set_object" id="'+id()+'">' +
          '<field name="TYPE">expression</field><field name="NAME">Control</field>' +
          '<value name="obj_val"><block type="math_number" id="'+id()+'"><field name="NUM">0</field></block></value>' +
          '<next><block type="dgpad_compute" id="'+id()+'"><field name="OBJECT">FichasCoords</field>' +
            '<next><block type="dgpad_compute" id="'+id()+'"><field name="OBJECT">blk_turtle_list_rotulaFichas</field></block></next>' +
          '</block></next>' +
        '</block></next>' +
      '</block>' +
    '</xml>';

  var onmouseupSync =
    "var v=1;SET_EXP('Control',v);var w=0;SET_EXP('Control',w);" +
    "FichasCoords.compute();blk_turtle_list_rotulaFichas.compute();";

  me.BLK(nm, {
    onlogo: { xml: onlogoXml, sync: onlogoSync },
    ondrag: { xml: ondragXml, sync: ondragSync },
    onmouseup: { xml: onmouseupXml, sync: onmouseupSync, childs: ["Control"] },
    current: "onlogo"
  });
  me.BLK(nm, { current: "ondrag" });
me.BLK(nm, { current: "onlogo" });
  var pp = Find(nm);
  if (pp && pp.compute) pp.compute();
  var te = Find("blk_turtle_exp__" + nm);
if (te) {
  if (te.compute) te.compute();
  if (te.run) te.run(); // algunas builds lo necesitan
}
  var tl = Find("blk_turtle_list_" + nm);
if (tl) {
  if (tl.compute) tl.compute();
  if (tl.run) tl.run();
}
  // refresca rótulos también (porque Textos/FichasCoords cambian)
var fc = Find("FichasCoords");
if (fc && fc.compute) fc.compute();

var tr = Find("blk_turtle_list_rotulaFichas");
if (tr) {
  if (tr.compute) tr.compute();
  if (tr.run) tr.run();
}

// y repinta
canvas.paint();

  // fuerza el rotulador ya que Textos cambió
  FichasCoords.compute();
  
};
0

`;
  OBJscriptFichas.setE1(script);

  
  Cn.computeAll();
  // canvas.paint();
  forceComputeRotulosSync();
  $U.alert("TABLERO Y FICHAS\nUsted acaba de seleccionar la opci\u00f3n\n'crear Tablero y Fichas'. Esta opci\u00f3n\ncrea un tablero con cuatro casillas \nque est\u00e1n en la expresi\u00f3n 'Tablero', y\ncuatro puntos con el nombre 'ficha'.\nLas fichas est\u00e1n programadas para pegarse\na las casillas del tablero, de manera que\ndos fichas no pueden ocupar la misma casilla.\n\nPuede modificar, a\u00f1adir o eliminar casillas\neditando la expresi\u00f3n 'Tablero'.\nTambi\u00e9n puede a\u00f1adir m\u00e1s fichas con el botón creaFichaNueva\n\nTambién puede modificar la expresión 'Textos' para asignarle a cada ficha un n\u00famero o un s\u00edmbolo.\nEn la variable global 'FichasT' queda guardada una lista \ncon las posiciones de las casillas y el texto de la ficha\nque est\u00e1 en esa posici\u00f3n.")
  
};

var createContenedorQ = function () {
  

  

  var OP1 = new PointObject(Cn, "P", 100,100);
  canvas.addObject(OP1);
  var nP1 = OP1.getName();

  

  var OP2 = new PointObject(Cn, "P", 200,100);
  canvas.addObject(OP2);
  var nP2 = OP2.getName();
  OP2.setExp("[windowcx()+windoww()/2,y(" + nP1 + ")]");
  OP2.setHidden(2);

  var OP3 = new PointObject(Cn, "P", 200,100);
  canvas.addObject(OP3);
  var nP3 = OP3.getName();
  OP3.setExp("[x(" + nP1 + "),windowcy()-windowh()/2]");
  OP3.setHidden(2);

  var OP4 = new PointObject(Cn, "P", 200,100);
  canvas.addObject(OP4);
  var nP4 = OP4.getName();
  OP4.setExp("[windowcx()+windoww()/2,windowcy()-windowh()/2]");
  OP4.setHidden(2);
  

  var OMax = new ExpressionObject(Cn, "maximo", "", "", "", "3", x, y);
  canvas.addObject(OMax);
  var nMax = OMax.getName();
  OMax.attachTo(OP1);

  var OPol1 = new AreaObject(Cn, "pol", [OP1, OP2, OP4, OP3, OP1]);
  canvas.addObject(OPol1);
  var nPol1 = OPol1.getName();
  OPol1.setHidden(2);

  var OP5 = new PointObject(Cn, "P", 300, 250);
  canvas.addObject(OP5);
  var nP5 = OP5.getName();

  OP5.setParent(OPol1);
  OP5.setAlpha([-0.13465465512433, 0.3440352670069771]);
  OP5.compute();

  var OP6 = new PointObject(Cn, "P", 200,100);
  canvas.addObject(OP6);
  var nP6 = OP6.getName();
  OP6.setExp("[x(" + nP1 + "),y(" + nP5 + ")]");
  OP6.setHidden(2);

  var OP7 = new PointObject(Cn, "P", 200,100);
  canvas.addObject(OP7);
  var nP7 = OP7.getName();
  OP7.setExp("[x(" + nP5 + "),y(" + nP1 + ")]");
  OP7.setHidden(2);

  var OPol2 = new AreaObject(Cn, "container", [OP1, OP6, OP5, OP7, OP1]);
  canvas.addObject(OPol2);
  var nPol2 = OPol2.getName();
  OPol2.setOpacity(0.3);



  
  Cn.computeAll();
  canvas.paint();
  

  

  Cn.computeAll();
  canvas.paint();
};

  var getName = function(_t) {
    var t = _t.match(/.{1,1}/g);
    for (var i = 0; i < t.length; i++) {
      if (!Cn.find(t[i])) return t[i];
    }
    return t[0];
  }

  var createIntCursor = function() {
    var OBJTablero = newExp("");
    if (!canvas.namesManager.isVisible()) OBJTablero.setName(getName("nmkabcuvwrst"));
    OBJTablero.setMin("0");
    OBJTablero.setMax("10");
    OBJTablero.setIncrement(1);
    Cn.compute();
    canvas.paint();
  };

  var createContCursor = function() {
    var OBJTablero = newExp("0");
    if (!canvas.namesManager.isVisible()) OBJTablero.setName(getName("nmkabcuvwrst"));
    OBJTablero.setMin("-10");
    OBJTablero.setMax("10");
    Cn.compute();
    canvas.paint();
  };

  var createEditWidget = function() {
    canvas.addText($L.edit_widget_name + " : <input id=\"exp_name\" interactiveinput=\"replace\">\n\n\u00a7  name=\"" + $L.edit_widget_edit + "\" style=\"font-size:18px;padding: 5px 10px;background: #4479BA;color: #FFF;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;border: solid 1px #20538D;text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);-moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\"\nvar exp_n=Find(\"exp_name\");\nvar exp_e=Find(\"exp_edit\");\nexp_e.setAttribute(\"target\",exp_n.value);\nRefreshInputs();\n\n\u00a7\n\n<textarea id=\"exp_edit\" target=\"aa\" style=\"width:500px;height:400px\"></textarea>\n", x, y, 550, 530, "c:rgba(59,79,115,0.18);s:3;r:15;p:4");
  };
  
  var createConstrucWidget = function() {
    canvas.addText($L.construc_widget_help+'<textarea id="construc" style="width:300px;height:200px"></textarea> § name="Construir" style="font-size:24px;color:blue" var Objetos=me.C.getListObject(); Puntos=[]; for (let i=0; i<Objetos.length; i++) { if (Objetos[i].getCode()=="point"|Objetos[i].getCode()=="expression_cursor") {Puntos.push(Objetos[i])} } for (let i=0; i<Puntos.length; i++) { me.C.safelyDelete(Puntos[i]) } var nombres=[]; var puntos=[]; var rectas=[]; var circulos=[]; var poligonos=[]; const pto = /Punto/i; const ptocualq= /Punto cualquiera/i; const ptomedio= /Punto medio/i; const ptointer= /Punto de intersecci\u00D3n/i; const ptosobre= /Punto sobre/i; const segmento= /Segmento/i; const circulo= /C\u00EDrculo/i; const circcentro=/C\u00EDrculo de centro/i; const circ3ptos=/C\u00EDrculo por/i; const circradio=/C\u00EDrculo de radio/i; const recta=/Recta/i; const semirrecta=/Semirrecta/i; const bisect=/Bisectriz/i; const mediat=/Mediatriz/i; const arco=/Arco/i; const paralela=/Paralela/i; const perp=/Perpendicular/i; const poligo=/Pol\u00EDgono/i; const simetria=/Sim\u00E9trico de/i; const angulo=/forma un ángulo de/i; const rotacion=/Rotaci\u00D3n/i; const homotecia=/Homot\u00E9tico/i; const traslacion=/Traslaci\u00D3n/i; const vector=/Vector/i; texto=Find("construc").value; lineas=texto.split("\\n"); lineas=lineas.filter(Boolean); for (let i = 0; i < lineas.length; i++) { if (lineas[i].indexOf(":")==-1){ alert("falta el nombre en "+lineas[i]); break; } nombre=lineas[i].split(":")[0]; nombres.push(nombre); predicado=lineas[i].split(":")[1].trim(); palabrasPredicado=predicado.split(" "); if (pto.test(predicado)){ if (palabrasPredicado.length<2){alert("no entiendo "+lineas[i])} if (ptocualq.test(predicado)) { if(palabrasPredicado.length==2){ p=Point(nombre,Math.random()*10-5,Math.random()*10-5); Find(p).setShowName(1); puntos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_anyPoint);}; } if(ptosobre.test(predicado)) { if(palabrasPredicado.length==3&&(rectas.includes(predicado.split(" ")[2])|circulos.includes(predicado.split(" ")[2]))){ p=PointOn(nombre, predicado.split(" ")[2],0.5); Find(p).setShowName(1); puntos.push(nombre); } else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_pointOn);}; } if (ptomedio.test(predicado)) { if(palabrasPredicado.length==6&&puntos.includes(predicado.split(" ")[3])&&puntos.includes(predicado.split(" ")[5])){ p=MidPoint(nombre,predicado.split(" ")[3],predicado.split(" ")[5]); Find(p).setShowName(1); puntos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_midPoint);}; } if (ptointer.test(predicado)) { if(palabrasPredicado.length==7&&((rectas.includes(predicado.split(" ")[4])&&rectas.includes(predicado.split(" ")[6]))|(circulos.includes(predicado.split(" ")[4])&&circulos.includes(predicado.split(" ")[6]))|(rectas.includes(predicado.split(" ")[4])&&circulos.includes(predicado.split(" ")[6]))|(circulos.includes(predicado.split(" ")[4])&&rectas.includes(predicado.split(" ")[6])))){ p=OrderedIntersection(nombre,predicado.split(" ")[4],predicado.split(" ")[6],1); Find(nombre).compute(); Find(p).setShowName(1); puntos.push(nombre); } else if(palabrasPredicado.length==10&&(predicado.includes("diferente de")&&((rectas.includes(predicado.split(" ")[4])&&rectas.includes(predicado.split(" ")[6]))|(circulos.includes(predicado.split(" ")[4])&&circulos.includes(predicado.split(" ")[6]))|(rectas.includes(predicado.split(" ")[4])&&circulos.includes(predicado.split(" ")[6]))|(circulos.includes(predicado.split(" ")[4])&&rectas.includes(predicado.split(" ")[6]))))){ p=OrderedIntersection(nombre,predicado.split(" ")[4],predicado.split(" ")[6],1,predicado.split(" ")[9]); Find(nombre).compute(); Find(p).setShowName(1); puntos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_interPoint);}; } } if (segmento.test(predicado)) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.includes(nombres[i])&&predicado.indexOf(nombres[i])>8) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==2&&nombres2.length==2&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])){ Segment(nombre,nombres2[0],nombres2[1]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_segment);}; } if (vector.test(palabrasPredicado[0])) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.includes(nombres[i])&&predicado.indexOf(nombres[i])>6) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==2&&nombres2.length==2&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])){ Vector(nombre,nombres2[0],nombres2[1]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_vector);}; } if (recta.test(predicado)&&predicado.indexOf("ecta")==1) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.includes(nombres[i])&&predicado.indexOf(nombres[i])>5) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==2&&nombres2.length==2&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])){ Line(nombre,nombres2[0],nombres2[1]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_line);}; } if (semirrecta.test(predicado)&&palabrasPredicado.length<16) { if(palabrasPredicado.length==8&&puntos.includes(palabrasPredicado[3])&&puntos.includes(palabrasPredicado[7])){ Ray(nombre,predicado.split(" ")[3],predicado.split(" ")[7]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_ray);}; } if (bisect.test(predicado)) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.includes(nombres[i])&&predicado.indexOf(nombres[i])>8) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==4&&nombres2.length==3&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])&&puntos.includes(nombres2[2])){ AngleBisector(nombre,nombres2[0],nombres2[1],nombres2[2]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_angleBis);}; } if (circcentro.test(predicado)&&predicado.includes("que pasa por")) { if(palabrasPredicado.length==8&&puntos.includes(predicado.split(" ")[3])&&puntos.includes(predicado.split(" ")[7])){ Circle(nombre,predicado.split(" ")[3],predicado.split(" ")[7]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_circle);}; } if (circcentro.test(predicado)&&predicado.includes("y radio")) { if(palabrasPredicado.length==7&&puntos.includes(predicado.split(" ")[3])&&predicado.split(" ")[6]>0){ Circle1(nombre,predicado.split(" ")[3],predicado.split(" ")[6]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_circle1);}; } if (circradio.test(predicado)) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.split(" ")[3].includes(nombres[i])) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==7&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])&&puntos.includes(predicado.split(" ")[6])){ Circle3(nombre,nombres2[0],nombres2[1],predicado.split(" ")[6]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_circle3);}; } if (circ3ptos.test(predicado)) { if(palabrasPredicado.length==6&&puntos.includes(predicado.split(" ")[2].slice(0,-1))&&puntos.includes(predicado.split(" ")[3])&&puntos.includes(predicado.split(" ")[5])){ Circle3pts(nombre,predicado.split(" ")[2].slice(0,-1),predicado.split(" ")[3],predicado.split(" ")[5]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]);}; } if (arco.test(predicado)) { var nombres2=[]; for (let i = 0; i < nombres.length; i++) { if (predicado.split(" ")[1].includes(nombres[i])) { nombres2.push(nombres[i]); } } if(palabrasPredicado.length==2&&puntos.includes(nombres2[0])&&puntos.includes(nombres2[1])&&puntos.includes(nombres2[2])){ Arc3pts(nombre,nombres2[0],nombres2[1],nombres2[2]); circulos.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_arc);}; } if (paralela.test(predicado)) { if(palabrasPredicado.length==5&&rectas.includes(palabrasPredicado[2])&&puntos.includes(palabrasPredicado[4])){ Parallel(nombre,palabrasPredicado[2],palabrasPredicado[4]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_parallel);}; } if (perp.test(predicado)) { if(palabrasPredicado.length==5&&rectas.includes(palabrasPredicado[2])&&puntos.includes(palabrasPredicado[4])){ Perpendicular(nombre,palabrasPredicado[2],palabrasPredicado[4]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_perp);}; } if (mediat.test(predicado)) { if(palabrasPredicado.length==5&&puntos.includes(palabrasPredicado[2])&&puntos.includes(palabrasPredicado[4])){ PerpendicularBisector(nombre,palabrasPredicado[2],palabrasPredicado[4]); rectas.push(nombre); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_perpBis);}; } if (poligo.test(predicado)) { var nombres2=[]; poligono=predicado.split(" ")[1]; for (let i = 0; i < nombres.length; i++) { if (poligono.includes(nombres[i])&&puntos.includes(nombres[i])) { nombres2.push(nombres[i]); nombres2.push(predicado.split(" ")[1].indexOf(nombres[i])); poligono=poligono.slice(0,poligono.indexOf(nombres[i])+nombres[i].length)+","+poligono.slice(poligono.indexOf(nombres[i])+nombres[i].length) } } poligono=poligono.slice(0,poligono.length-1); p=Polygon(nombre,poligono); Find(p).setOpacity(0.2); poligonos.push(nombre); } if(simetria.test(predicado)){ if(palabrasPredicado.length==7){ if(puntos.includes(palabrasPredicado[6])){ p=Symmetry(nombre,palabrasPredicado[6],palabrasPredicado[2]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } if(rectas.includes(palabrasPredicado[6])){ p=Reflection(nombre,palabrasPredicado[6],palabrasPredicado[2]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_csym+$L.construc_widget_help_asym);}; } if(angulo.test(predicado)){ if(palabrasPredicado.length==19){ if(puntos.includes(palabrasPredicado[3])&&nombres.includes(palabrasPredicado[15])){ amplitud=Number(palabrasPredicado[9].slice(0,-1));sentido=(palabrasPredicado[18]=="antihorario"); FixedAngle(nombre,palabrasPredicado[15],amplitud,sentido); }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_fixedAngle);}; }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_fixedAngle);}; } if(rotacion.test(predicado)){ if(palabrasPredicado.length==9){ if(puntos.includes(palabrasPredicado[5])&&palabrasPredicado[8]>0){ er=Expression("Er","","","",palabrasPredicado[8],"-13.958333333333334","5.5625"); centro=palabrasPredicado[2]; p=Rotation(nombre,Find(er).getName(),centro,palabrasPredicado[5]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_rot);}; } if(homotecia.test(predicado)){ if(palabrasPredicado.length==10){ if(puntos.includes(palabrasPredicado[6])&&palabrasPredicado[9]>0){ eh=Expression("Eh","","","",palabrasPredicado[9],"-13.958333333333334","5.5625"); centro=palabrasPredicado[2]; p=Homothety(nombre,Find(eh).getName(),centro,palabrasPredicado[6]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } }else{alert("no entiendo "+lineas[i]+$L.construc_widget_help_homot);}; } if(traslacion.test(predicado)){ if(palabrasPredicado.length==7&&rectas.includes(palabrasPredicado[6])){ p=Translation(nombre,palabrasPredicado[6],palabrasPredicado[2]); if (puntos.includes(palabrasPredicado[2])){ Find(p).setShowName(1); puntos.push(nombre); } } if(!(palabrasPredicado.length==7&&rectas.includes(palabrasPredicado[6]))){ alert("no entiendo "+lineas[i]+$L.construc_widget_help_trans);}; } } §  ', x, y, 350, 350, "c:rgba(59,79,115,0.18);s:3;r:15;p:4");
  };

  // MEAG start
  var createFrameConstruction = function() {
    Cn.getFrame().drawFrame(_canvas, x, y);
    Cn.getFrame().draw();
  };
  // MEAG end

  var createBlocklyButton = function() {
    $U.prompt($L.create_blockly_program_change_message, $L.create_blockly_program_name, "text", function(_old, _new) {
      if (_new === "") _new = _old;
      var OBJTablero = new BlocklyButtonObject(Cn, "blk_btn", _new, x, y);
      OBJTablero.setOpacity(canvas.prefs.opacity.blockly_button);
      canvas.addObject(OBJTablero);
      Cn.compute();
      canvas.paint();
      canvas.blocklyManager.edit(OBJTablero);
    }, 450, 165, 430);
  };

var duplicateFig = function(){
	source=canvas.getSource();
	source=btoa(unescape(encodeURIComponent(source)));
	var target="popupform"+Math.random()*100000000;
	var FORM=document.createElement("form");
	FORM.target=target;
	FORM.method="post";
	// FORM.action="estudiantes"
	INPUT=document.createElement("input");
	INPUT.type="hidden";
	INPUT.name="file_content";
	
	INPUT.value=source;

	FORM.appendChild(INPUT);
	canvas.getDocObject().parentNode.appendChild(FORM);
	window.open("",target);
	FORM.submit();
	}
var leer = function (ev){
	
	canvas.load64($U.base64_encode(ev.target.result));
	}
	
var OpenFile = function (){
	
		var select=document.createElement("input");
		select.type="file";
		select.onchange = function (ev) {
			
			var arch=new FileReader();
			arch.readAsText(ev.target.files[0]);
			arch.addEventListener('load',leer,false);
			
			
		}
		
		document.body.appendChild(select);
		select.click();
		
		
		}



var SaveFile = async () => {
	const fileContent = canvas.getSource();

	if (window.showSaveFilePicker) {
		const options = {
			suggestedName: "archivo-dgpad.txt",
			types: [
				{
					description: "archivos dgpad-colombia",
					accept: { "text/plain": [".txt"] },
				},
			],
		};

		const handle = await window.showSaveFilePicker(options);
		const writable = await handle.createWritable();
		await writable.write(fileContent);
		await writable.close();
		return handle;
	} else {
		// Fallback: pedir nombre del archivo
		let fileName = prompt("Nombre del archivo:", "archivo-dgpad.txt");
		if (!fileName) return null; // cancelado

		if (!fileName.endsWith(".txt")) fileName += ".txt";

		const blob = new Blob([fileContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		return null;
	}
};


	
  var tab = [];
    // MEAG start
  tab.push([$L.create_construccion_frame, createFrameConstruction]);
  tab.push([$L.create_duplicate_figure, duplicateFig]);
  tab.push([$L.create_open_file, OpenFile]);
  tab.push([$L.create_save_file, SaveFile]);
  tab.push([$L.create_widget_construc,createConstrucWidget]);
  if (canvas.version() == "profesores") {
	  
    tab.push([$L.create_blockly_button, createBlocklyButton]);
    tab.push([$L.create_exp, createExp]);
    tab.push([$L.create_exp_pts, createExpPts]);
    tab.push([$L.create_exp_segs, createExpSegs]);
    tab.push([$L.create_tableroPtos, createTableroPuntos]);
    tab.push([$L.create_Contenedor, createContenedorQ]);
    tab.push([$L.create_cursor_int, createIntCursor]);
    tab.push([$L.create_cursor_cont, createContCursor]);
    tab.push([$L.create_widget_edit, createEditWidget]);
  }
  // MEAG end

  var close = function() {
    panel = null;
  };

  var exec = function(_proc) {
    _proc();
  };

  me.isVisible = function() {
    return (panel && panel.isVisible());
  };

  me.show = function(ev) {
    x = canvas.mouseX(ev);
    y = canvas.mouseY(ev);
    x = Math.round(x / 10) * 10;
    y = Math.round(y / 10) * 10;
    panel = new BubblePanel(canvas, exec, close, ev, tab, $L.longpress_message, 270, 240, 30);
  };




}
