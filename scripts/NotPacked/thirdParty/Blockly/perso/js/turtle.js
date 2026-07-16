Blockly.JavaScript['turtle_angle_input'] = function(block) {
    var angle_angle = block.getFieldValue('ANGLE');
    // TODO: Assemble JavaScript into code variable.
    var code = angle_angle;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['turtle_move'] = function(block) {
    var dir = block.getFieldValue('DIR');
    var units = block.getFieldValue('UNITS');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    value = (dir === "moveBackward") ? ("-" + value) : value;
	if (units==="px"){value=value+'*GetCanvas().getEscala()'};
    var cod = "TURTLE_MV(" + value + "," + (units === "px") + ");\n";
    // Blockly.dgpad.ZC.blocklyManager()
    return cod;
};


Blockly.JavaScript['turtle_turn'] = function(block) {
    var dir = block.getFieldValue('DIR');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    value = (dir === "turnRight") ? ("-" + value) : value;
    var cod = "TURTLE_TURN(" + value + ");\n";
    return cod;
};


Blockly.JavaScript['turtle_rotate'] = function(block) {
    var dir = block.getFieldValue('DIR');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    value = (dir === "rotate_bottom") ? ("-" + value) : value;
    value = (dir === "rotate_left") ? ("-" + value) : value;
    var cod = "TURTLE_ROTATE(" + value + "," + ((dir === "rotate_top") || (dir === "rotate_bottom")) + ");\n";
    
    return cod;
};



Blockly.JavaScript['turtle_pen'] = function(block) {
    var dir = block.getFieldValue('PEN');
    var cod = "TURTLE_UP(" + (dir === "penUp") + ");\n";
    return cod;
};



Blockly.JavaScript['turtle_colour'] = function(block) {
    var value = Blockly.JavaScript.valueToCode(block, 'ColorCode', Blockly.JavaScript.ORDER_ATOMIC);
    var cod = "TURTLE_COLOUR(" + value + ");\n";
    return cod;
};

Blockly.JavaScript['turtle_fill'] = function(block) {
    var value = Blockly.JavaScript.valueToCode(block, 'OP', Blockly.JavaScript.ORDER_ATOMIC);
    value = (value < 0) ? 0 : ((value > 100) ? 100 : value);
    var cod = "TURTLE_FILL(" + value + ");\n";
    return cod;
};

Blockly.JavaScript['turtle_colour_increment'] = function(block) {
    var value = Blockly.JavaScript.valueToCode(block, 'COL', Blockly.JavaScript.ORDER_ATOMIC);
    var cod = "TURTLE_COLOUR_INCREMENT(" + value + ");\n";
    return cod;
};

Blockly.JavaScript['turtle_width'] = function(block) {
    var what = block.getFieldValue('WHAT');
    var value = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_ATOMIC);
    if (value <= 0) value = "1e-13";
    var inst = (what === "pen") ? "TURTLE_WIDTH" : "TURTLE_POINTS_WIDTH";
    var cod = inst + "(" + value + ");\n";
    return cod;
};


Blockly.JavaScript['turtle_width_increment'] = function(block) {
    var what = block.getFieldValue('WHAT');

    var value = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_ATOMIC);
    var inst = (what === "pen") ? "TURTLE_WIDTH_INCREMENT" : "TURTLE_POINTS_WIDTH_INCREMENT";
    var cod = cod = inst + "(" + value + ");\n";
    return cod;
};


Blockly.JavaScript['turtle_turn_pt'] = function(block) {
    var dropdown_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    var cod = "TURTLE_ROTATE_PT(" + dropdown_name + ");\n";
    return cod;
};

Blockly.JavaScript['turtle_join_pt'] = function(block) {
    var dropdown_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    var cod = "TURTLE_JOIN_PT(" + dropdown_name + ");\n";
    return cod;
};


Blockly.JavaScript['turtle_position'] = function(block) {
    var code = 'TURTLE_POS()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['turtle_reset_angles'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'TURTLE_RESET();\n';
    return code;
};

Blockly.JavaScript['turtle_get'] = function(block) {
    var value_num = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_name = block.getFieldValue('NAME');
    var code = 'TURTLE_GET("' + dropdown_name + '",' + value_num + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['turtle_length'] = function(block) {
    var dropdown_name = block.getFieldValue('NAME');
    var code = 'TURTLE_LENGTH("' + dropdown_name + '")';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['turtle_print'] = function(block) {
    var txt = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
    
    var code = `TURTLE_PRINT(${txt});\n`;
    
    
    return code;
};



Blockly.JavaScript['turtle_font'] = function(block) {
    var font = block.getFieldValue('FONT');
    var size = Blockly.JavaScript.valueToCode(block, 'FONTSIZE', Blockly.JavaScript.ORDER_ATOMIC);
    var face = block.getFieldValue('FONTSTYLE');
    var align = block.getFieldValue('FONTALIGN');
    // var cod = "TURTLE_FONT('" + font + "'," + size+'*GetCanvas().getEscala' + ",'" + face + "','" + align + "');\n";
    var cod = `TURTLE_FONT('${font}', ${size} * GetCanvas().getEscala(), '${face}', '${align}');\n`;



    
    return cod;
};


Blockly.JavaScript['turtle_img'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'url', Blockly.JavaScript.ORDER_ATOMIC);
    var value_w = Blockly.JavaScript.valueToCode(block, 'w', Blockly.JavaScript.ORDER_ATOMIC);
    var value_h = Blockly.JavaScript.valueToCode(block, 'h', Blockly.JavaScript.ORDER_ATOMIC);
    var value_z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC);
    var value_o = Blockly.JavaScript.valueToCode(block, 'o', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "TURTLE_PRINT_IMG(" + value_url + "," + value_w + "," + value_h + "," + value_z + "," + value_o + ");\n";
    return code;
};


Blockly.JavaScript["turtle_input"] = function (block) {
  const width =
    Blockly.JavaScript.valueToCode(block, "width", Blockly.JavaScript.ORDER_ATOMIC) || "50";
  const fontSize =
    Blockly.JavaScript.valueToCode(block, "FontSize", Blockly.JavaScript.ORDER_ATOMIC) || "25";

  // const stableId = `inp_${block.id}`; // ✅ estable
  function safeInputId(block) {
  return "inp_" + String(block.id).replace(/[^a-zA-Z0-9_]/g, "_");
}

const stableId = safeInputId(block);

  return `
(() => {
  const OP_INPUT = 91;
  const t = TURTLE_VARS;
  const pos = TURTLE_POS();

  const tab = t.TAB || (t.TAB = []);
  const pointName = String(t.NAME || "P?");

  function nextN(tabRef, pName) {
    let maxN = 0;
    for (const cmd of tabRef) {
      if (!Array.isArray(cmd) || cmd[0] !== OP_INPUT) continue;
      const meta = cmd[3];
      if (!meta || meta.point !== pName) continue;
      const n = Number(meta.n) || 0;
      if (n > maxN) maxN = n;
    }
    return maxN + 1;
  }

  const n = nextN(tab, pointName);

  // Insertar comando justo antes del punto actual (patrón TURTLE_FONT)
  const last = tab.length ? tab.pop() : t.LAST;
  tab.push([OP_INPUT, pos[0], pos[1], { id: "${stableId}", point: pointName, n }]);
  if (last) tab.push(last);

  parent.postMessage({
    action: "create-custom-input",
    id: "${stableId}",
    xVal: pos[0],
    yVal: pos[1],
    width: Number(${width}) || 50,
    fontSize: Number(${fontSize}) || 25,

    // 👇 meta para labels
    pointName,
    n
  }, "*");
})();
TURTLE_UP(true);
TURTLE_MV((${width}) * GetCanvas().getEscala() + 8, true);
`;
};

Blockly.JavaScript["turtle_input_number"] = function (block) {
  const width =
    Blockly.JavaScript.valueToCode(block, "width", Blockly.JavaScript.ORDER_ATOMIC) || "50";
  const fontSize =
    Blockly.JavaScript.valueToCode(block, "FontSize", Blockly.JavaScript.ORDER_ATOMIC) || "25";
  const min =
    Blockly.JavaScript.valueToCode(block, "min", Blockly.JavaScript.ORDER_ATOMIC) || "0";
  const max =
    Blockly.JavaScript.valueToCode(block, "max", Blockly.JavaScript.ORDER_ATOMIC) || "10";
  const step =
    Blockly.JavaScript.valueToCode(block, "step", Blockly.JavaScript.ORDER_ATOMIC) || "1";

  // ✅ ID estable: NO depende del nombre del punto
  const stableId = `num_${block.id}`;

  return `
(() => {
  const OP_NUM_INPUT = 92;
  const t = TURTLE_VARS;
  const pos = TURTLE_POS();
  const tab = t.TAB || (t.TAB = []);
  const pointName = String(t.NAME || "");

  function nextN(tabRef, pName) {
    let maxN = 0;
    for (const cmd of tabRef) {
      if (!Array.isArray(cmd) || cmd[0] !== OP_NUM_INPUT) continue;
      const meta = cmd[3];
      if (!meta || meta.point !== pName) continue;
      const n = Number(meta.n) || 0;
      if (n > maxN) maxN = n;
    }
    return maxN + 1;
  }

  const n = pointName ? nextN(tab, pointName) : 1;

  // Guardar en TAB antes del último punto (patrón TURTLE_FONT)
  const last = tab.length ? tab.pop() : t.LAST;
  tab.push([OP_NUM_INPUT, pos[0], pos[1], { id: "${stableId}", point: pointName, n }]);
  if (last) tab.push(last);

  parent.postMessage({
    action: "create-custom-number-input",
    id: "${stableId}",
    xVal: pos[0],
    yVal: pos[1],
    width: Number(${width}) || 50,
    fontSize: Number(${fontSize}) || 25,
    fs: Number(${fontSize}) || 25,

    min: ${min},
    max: ${max},
    step: ${step},

    // ✅ claves para label y expresión visible
    pointName,
    n
  }, "*");
})();
TURTLE_UP(true);
TURTLE_MV((${width}) * GetCanvas().getEscala() + 8, true);
`;
};




  


Blockly.JavaScript['dgpad_cronometro_create'] = function (block) {
  const pointNameCode = 'TURTLE_VARS.NAME';
  const blockId = block.id;
  const idExpr = `${pointNameCode} + "-${blockId}"`;
  const fontSize = block.getFieldValue("FONTSIZE") || 20;

  const code = `
(() => {
  const pointName = ${pointNameCode};
  const id = ${idExpr};

  if (!cronometroContadores) cronometroContadores = {};
  const count = (cronometroContadores[pointName] = (cronometroContadores[pointName] || 0) + 1);
  const label = "cronómetro " + count + " " + pointName;

  if (!cronometrosLegibles) cronometrosLegibles = {};
  cronometrosLegibles[id] = label;

  crearCronometro(id); // 👈 esta es la línea clave

  const pos = TURTLE_POS();
  parent.postMessage({
    action: "create-cronometro",
    id: id,
    xVal: pos[0],
    yVal: pos[1],
    fontSize: ${fontSize}
  }, "*");
})();
`;

  return code;
};



Blockly.JavaScript["turtle_speaker_tts"] = function (block) {
  
  const textCode =
    Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_ATOMIC) || "''";
  const sizeCode =
    Blockly.JavaScript.valueToCode(block, "SIZE", Blockly.JavaScript.ORDER_ATOMIC) || "56";

  const lang = block.getFieldValue("LANG") || "auto";
  const rate = Number(block.getFieldValue("RATE") || 1);
  const pitch = Number(block.getFieldValue("PITCH") || 1);
  const volume = Number(block.getFieldValue("VOLUME") || 1);

  // ID estable como input (pero speaker)
  const stableId = `spk_${block.id}`;

  

  return `
(() => {
  const OP_SPEAKER = 191;
  const t = TURTLE_VARS;
  const pos = TURTLE_POS();

  const tab = t.TAB || (t.TAB = []);
  const pointName = String(t.NAME || "P?");

  function nextN(tabRef, pName) {
    let maxN = 0;
    for (const cmd of tabRef) {
      if (!Array.isArray(cmd) || cmd[0] !== OP_SPEAKER) continue;
      const meta = cmd[3];
      if (!meta || meta.point !== pName) continue;
      const n = Number(meta.n) || 0;
      if (n > maxN) maxN = n;
    }
    return maxN + 1;
  }

  const n = nextN(tab, pointName);

  // Mantener patrón: insertar antes del último comando
  const last = tab.length ? tab.pop() : t.LAST;
  tab.push([OP_SPEAKER, pos[0], pos[1], { id: "${stableId}", point: pointName, n }]);
  if (last) tab.push(last);

  parent.postMessage({
    action: "create-custom-speaker",
    id: "${stableId}",
    xVal: pos[0],
    yVal: pos[1],
    size: Number(${sizeCode}) || 56,
    text: ${textCode},
    opts: { lang: ${JSON.stringify(lang)}, rate: ${rate}, pitch: ${pitch}, volume: ${volume} },

    // ✅ meta para labels/dropdown
    pointName,
    n
  }, "*");
})();
TURTLE_UP(true);
TURTLE_MV((Number(${sizeCode}) || 56) * GetCanvas().getEscala() + 8, true);
`;
};

Blockly.JavaScript['dgpad_input_ref'] = function (block) {
  const id = block.getFieldValue("ID") || "";

  const code = `({
    kind: "INPUT",
    id: ${JSON.stringify(id)}
  })`;

  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};



Blockly.JavaScript["dgpad_content_obj"] = function (block) {
  const value =
    Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ATOMIC) || '""';

  const code = `({
    kind: "CONTENT",
    value: ${value}
  })`;

  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript["turtle_mathlive"] = function (block) {
  var width =
    Blockly.JavaScript.valueToCode(block, "width", Blockly.JavaScript.ORDER_ATOMIC) || "120";
  var height =
    Blockly.JavaScript.valueToCode(block, "height", Blockly.JavaScript.ORDER_ATOMIC) || "40";
  var latex =
    Blockly.JavaScript.valueToCode(block, "latex", Blockly.JavaScript.ORDER_ATOMIC) ||
    '"\\\\frac{\\\\placeholder[ph_default_n]{?}}{\\\\placeholder[ph_default_d]{?}}"';

  var stableId = "ml_" + String(block.id).replace(/[^a-zA-Z0-9_-]/g, "_");

  var code = ""
    + "var __ml_pos = TURTLE_POS();\n"
    + "var __ml_tab = TURTLE_VARS.TAB || [];\n"
    + "var __ml_colorIndex = 7;\n"
    + "var __ml_fontFamily = 'Arial';\n"
    + "var __ml_fontSize = 28;\n"
    + "var __ml_fontStyle = 'normal';\n"
    + "var __ml_fontAlign = 'izquierda';\n"

    + "for (var __i = __ml_tab.length - 1; __i >= 0; __i--) {\n"
    + "  var __cmd = __ml_tab[__i];\n"
    + "  if (!Array.isArray(__cmd)) continue;\n"
    + "  if (__cmd[0] === 2) {\n"
    + "    __ml_colorIndex = __cmd[3];\n"
    + "    break;\n"
    + "  }\n"
    + "}\n"

    + "for (var __j = __ml_tab.length - 1; __j >= 0; __j--) {\n"
    + "  var __fcmd = __ml_tab[__j];\n"
    + "  if (!Array.isArray(__fcmd)) continue;\n"
    + "  if (__fcmd[0] === 21 && Array.isArray(__fcmd[3])) {\n"
    + "    __ml_fontFamily = __fcmd[3][0] || 'Arial';\n"
    + "    __ml_fontSize = Number(__fcmd[3][1]) || 28;\n"
    + "    __ml_fontStyle = __fcmd[3][2] || 'normal';\n"
    + "    __ml_fontAlign = __fcmd[3][3] || 'izquierda';\n"
    + "    break;\n"
    + "  }\n"
    + "}\n"

    + "parent.postMessage({\n"
    + "  action: 'create-mathlive',\n"
    + "  id: " + JSON.stringify(stableId) + ",\n"
    + "  xVal: __ml_pos[0],\n"
    + "  yVal: __ml_pos[1],\n"
    + "  width: Number(" + width + ") || 120,\n"
    + "  height: Number(" + height + ") || 40,\n"
    + "  latex: " + latex + ",\n"
    + "  readOnly: true,\n"
    + "  colorIndex: Number(__ml_colorIndex) || 7,\n"
    + "  fontFamily: __ml_fontFamily,\n"
    + "  fontSize: Number(__ml_fontSize) || 28,\n"
    + "  fontStyle: __ml_fontStyle,\n"
    + "  fontAlign: __ml_fontAlign,\n"
    + "  pointName: String(TURTLE_VARS.NAME || 'P?'),\n"
    + "  n: 1,\n"
    + "  visible: true\n"
    + "}, '*');\n"
    + "TURTLE_UP(true);\n"
    + "TURTLE_MV((Number(" + width + ") || 120) * GetCanvas().getEscala() + 8, true);\n";

  return code;
};



Blockly.JavaScript["mathlive_placeholder"] = function (block) {
  var value =
    Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_NONE) || '"?"';

  var autoName = "ph_" + String(block.id).replace(/[^a-zA-Z0-9_-]/g, "_");
  var code = "'\\\\placeholder[" + autoName + "]{' + " + value + " + '}'";

  return [code, Blockly.JavaScript.ORDER_NONE];
};



  