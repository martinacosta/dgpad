Blockly.Blocks['dgpad_style_fix'] = {
    init: function() {
        this.appendDummyInput('obj_name')
            .appendField($L.blockly.turtle.fixaspect_1)
            .appendField(Blockly.dgpad.objectPopup("any"), "OBJECT")
            // .appendField(new Blockly.FieldDropdown([["moi", "OPTIONNAME"], ["option", "OPTIONNAME"], ["option", "OPTIONNAME"]]), "OBJECT")
            .appendField($L.blockly.turtle.fixaspect_2);
        this.appendValueInput("NAME")
            .setCheck("style");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('');
    },
    getName: function(_o) {
        this.getInput('obj_name').fieldRow[1].setValue(_o.getName());
    }
};




Blockly.Blocks['dgpad_object_style_fix'] = {
  init: function() {
    this.appendDummyInput()
        .appendField($L.blockly.turtle.fixaspect_1);
    this.appendValueInput("OBJECT")
        .setCheck(null);
    this.appendDummyInput()
        .appendField($L.blockly.turtle.fixaspect_2);
    this.appendValueInput("NAME")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['dgpad_style_color_rgb'] = {
    init: function() {
        var me = this;
        this.getVal = function(_c) {
            var inp = me.getInputTargetBlock(_c).getFieldValue('NUM');
            return (inp === null) ? 0 : parseInt(inp);
        };
        this.fixColorMenu = function() {
            var r = me.getInputTargetBlock('R').getFieldValue('NUM');
            var g = me.getInputTargetBlock('G').getFieldValue('NUM');
            var b = me.getInputTargetBlock('B').getFieldValue('NUM');
            if (r && g && b) {
                if (!me.getInput('rgb')) {
                    me.appendDummyInput("rgb")
                        .appendField(new Blockly.FieldColour("#ff0000", function(option) {
                            var bigint = parseInt(option.replace(/^#/, ""), 16);
                            var r = (bigint >> 16) & 255;
                            var g = (bigint >> 8) & 255;
                            var b = bigint & 255;
                            me.getInputTargetBlock('R').setFieldValue(r, 'NUM');
                            me.getInputTargetBlock('G').setFieldValue(g, 'NUM');
                            me.getInputTargetBlock('B').setFieldValue(b, 'NUM');

                        }), "RGB_col");
                }
                r = parseInt(r);
                g = parseInt(g);
                b = parseInt(b);
                var c = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                // Ne surtout pas utiliser de "me.setFieldValue(c, "RGB_col")"
                // ici, cela enverrait un onchange event catastrophique ! :
                me.getField("RGB_col").colour_ = c;
                if (me.getField("RGB_col").borderRect_) {
                    me.getField("RGB_col").borderRect_.style.fill = c;
                }
            } else {
                me.removeInput('rgb');
            }
        };

        this.appendDummyInput()
            .appendField("RGB");
        this.appendValueInput("R")
            .setCheck("Number");
        this.appendValueInput("G")
            .setCheck("Number");
        this.appendValueInput("B")
            .setCheck("Number");
        this.appendDummyInput("rgb")
            .appendField(new Blockly.FieldColour("#ff0000", function(option) {
                var bigint = parseInt(option.replace(/^#/, ""), 16);
                var r = (bigint >> 16) & 255;
                var g = (bigint >> 8) & 255;
                var b = bigint & 255;
                me.getInputTargetBlock('R').setFieldValue(r, 'NUM');
                me.getInputTargetBlock('G').setFieldValue(g, 'NUM');
                me.getInputTargetBlock('B').setFieldValue(b, 'NUM');

            }), "RGB_col");
        this.setInputsInline(true);
        this.setOutput(true, "style");
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('');
    },
    onchange: function(event) {
        this.fixColorMenu()
    }
};


// Blockly.Blocks['dgpad_style_general'] = {
//     init: function() {
//         this.appendValueInput("NAME")
//             .appendField(new Blockly.FieldDropdown([
//                 ["caché", "setHidden"],
//                 ["taille", "setSize"],
//                 ["calque", "setLayer"],
//                 ["police", "setFontSize"],
//                 ["précision", "setPrecision"],
//                 ["incrément", "setIncrement"],
//                 ["calque", "setLayer"],
//                 ["calque", "setLayer"]
//             ]), "NAME");
//         this.setOutput(true, "style");
//         this.setColour(65);
//         this.setTooltip('');
//         this.setHelpUrl('');
//     }
// };

Blockly.dgpad_style_block = function(_v) {
    return ({
        init: function() {
            this.appendValueInput("NAME")
                .appendField(_v);
            this.setOutput(true, "style");
            this.setColour(65);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    });
}

Blockly.Blocks['dgpad_style_opacity'] = Blockly.dgpad_style_block($L.blockly.turtle.opacity);
// Blockly.Blocks['dgpad_style_visibility'] = Blockly.dgpad_style_block($L.blockly.turtle.hidden);
Blockly.Blocks['dgpad_style_visibility'] = {
    init: function () {
      this.appendDummyInput()
          
          .appendField(new Blockly.FieldDropdown([
            [$L.blockly.turtle.hidden, "1"],
            [$L.blockly.turtleInput_Display, "0"],
            [$L.blockly.aspect_superHide, "2"]
          ]), "VISIBILITY");
      
      this.setOutput(true, "style");
      this.setColour(65);
      this.setTooltip("Oculta o muestra el objeto");
      this.setHelpUrl("");
    }
  };


Blockly.Blocks['dgpad_style_size'] = Blockly.dgpad_style_block($L.blockly.turtle.size);
Blockly.Blocks['dgpad_style_layer'] = Blockly.dgpad_style_block($L.blockly.turtle.layer);
Blockly.Blocks['dgpad_style_font'] = Blockly.dgpad_style_block($L.blockly.turtle.font);
Blockly.Blocks['dgpad_style_precision'] = Blockly.dgpad_style_block($L.blockly.turtle.precision);
Blockly.Blocks['dgpad_style_increment'] = Blockly.dgpad_style_block($L.blockly.turtle.increment);
Blockly.Blocks['dgpad_style_dash'] = Blockly.dgpad_style_block($L.blockly.turtle.dash);
Blockly.Blocks['dgpad_style_nomouse'] = Blockly.dgpad_style_block($L.blockly.turtle.inanimate);


Blockly.Blocks['dgpad_style_arrow'] = {
  init: function() {
    this.appendDummyInput()
        .appendField($L.blockly.turtle.arrow);
    this.appendValueInput("w")
        .setCheck(null);
    this.appendValueInput("h")
        .setCheck(null);
    this.setInputsInline(true);
    
    this.setOutput(true, "style");
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};



Blockly.Blocks["dgpad_inputs_deleteValue"] = {
  init: function () {
    this.appendDummyInput()
      .appendField($L.blockly.aspect_deleteValue1)
      .appendField(new Blockly.FieldDropdown(() => DG.aspect.buildInputOptions()), "ID");

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(47);
    this.setTooltip("Borra el contenido de una casilla de entrada");
    this.setHelpUrl("");

    this.updateDropdownOptions();
  },

  updateDropdownOptions: function () {
    const inputs = window.$U?.inputs || {};
    const ids = Object.keys(inputs);

    if (!ids.length) return [[$L.blockly.aspect_deleteValue2, ""]];

    const parseNew = (id) => {
      const m = /^casilla(\d+)(P\d+)$/i.exec(String(id));
      if (!m) return null;
      return { n: Number(m[1]), point: m[2].toUpperCase() };
    };

    const items = ids.map((id) => {
      const info = parseNew(id);
      if (info) {
        return { id, label: `casilla ${info.n} ${info.point}`, point: info.point, n: info.n };
      }
      // fallback legacy/otros ids
      return { id, label: id, point: "ZZZ", n: Number.POSITIVE_INFINITY };
    });

    items.sort((a, b) => {
      if (a.point !== b.point) return a.point.localeCompare(b.point);
      if (a.n !== b.n) return a.n - b.n;
      return a.id.localeCompare(b.id);
    });

    return items.map((x) => [x.label, x.id]); // value = id real
  },

  getSelectedId: function () {
    return this.getFieldValue("ID");
  },
};
 

window.DG = window.DG || {};
DG.aspect = DG.aspect || {};

DG.aspect.buildInputOptions = function buildInputOptions() {
  const inputs = window.$U?.inputs || {};
  const meta = window.$U?.inputMeta || {};
  const ids = Object.keys(inputs);

  if (!ids.length) return [[$L.blockly.aspect_deleteValue2, ""]];

  const items = ids.map((id) => {
    const m = meta[id];
    const label = (m?.n && m?.pointName) ? `casilla ${m.n} ${m.pointName}` : id;
    const point = m?.pointName || "ZZZ";
    const n = Number(m?.n ?? Number.POSITIVE_INFINITY);
    return { id, label, point, n };
  });

  items.sort((a, b) => {
    if (a.point !== b.point) return a.point.localeCompare(b.point);
    if (a.n !== b.n) return a.n - b.n;
    return a.id.localeCompare(b.id);
  });

  return items.map((x) => [x.label, x.id]);
};

Blockly.Blocks["dgpad_inputs_showHide"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          [$L.blockly.aspect_Show, "true"],
          [$L.blockly.aspect_Hide, "false"],
        ]),
        "ACTION"
      )
      .appendField($L.blockly.aspect_input)
      .appendField(new Blockly.FieldDropdown(() => DG.aspect.buildInputOptions()), "ID");

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(47);
    this.setTooltip("Muestra u oculta una casilla de entrada");
    this.setHelpUrl("");

    this.updateDropdownOptions();
  },

  updateDropdownOptions: function () {
    const inputs = window.$U?.inputs || {};
    const ids = Object.keys(inputs);

    if (!ids.length) return [["(sin casillas)", ""]];

    const parseNew = (id) => {
      const m = /^casilla(\d+)(P\d+)$/i.exec(String(id));
      if (!m) return null;
      return { n: Number(m[1]), point: m[2].toUpperCase() };
    };

    const items = ids.map((id) => {
      const info = parseNew(id);
      if (info) {
        return { id, label: `casilla ${info.n} ${info.point}`, point: info.point, n: info.n };
      }
      return { id, label: id, point: "ZZZ", n: Number.POSITIVE_INFINITY };
    });

    items.sort((a, b) => {
      if (a.point !== b.point) return a.point.localeCompare(b.point);
      if (a.n !== b.n) return a.n - b.n;
      return a.id.localeCompare(b.id);
    });

    return items.map((x) => [x.label, x.id]);
  },

  getSelectedId: function () {
    return this.getFieldValue("ID");
  },

  getActionValue: function () {
    return this.getFieldValue("ACTION");
  },
};

Blockly.Blocks["dgpad_speakers_showHide"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          [$L.blockly.aspect_Show, "true"],
          [$L.blockly.aspect_Hide, "false"],
        ]),
        "ACTION"
      )
      
      .appendField(new Blockly.FieldDropdown(() => DG.buildSpeakerOptions()), "ID");

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(47);
    this.setTooltip("Muestra u oculta un altoparlante");
    this.setHelpUrl("");
  },

  updateDropdownOptions: function () {
    const meta = window.$U?.speakerMeta || {};
    const ids = Object.keys(meta);

    if (!ids.length) return [["(sin altoparlantes)", ""]];

    const items = ids.map((id) => {
      const m = meta[id] || {};
      const point = String(m.pointName || "ZZZ").toUpperCase();
      const n = Number(m.n);
      const label = (Number.isFinite(n) && n > 0)
        ? ` ${n} ${point}`
        : ` ${id} ${point}`;
      return { id, label, point, n: Number.isFinite(n) ? n : Number.POSITIVE_INFINITY };
    });

    items.sort((a, b) => {
      if (a.point !== b.point) return a.point.localeCompare(b.point);
      if (a.n !== b.n) return a.n - b.n;
      return a.id.localeCompare(b.id);
    });

    return items.map((x) => [x.label, x.id]);
  },

  getSelectedId: function () {
    return this.getFieldValue("ID");
  },

  getActionValue: function () {
    return this.getFieldValue("ACTION");
  },
};


DG.buildSpeakerOptions = function () {
  // const U = window.parent?.$U || window.$U; // <- clave
  const meta = window.$U?.speakerMeta || {};
  // const meta = U?.speakerMeta || {};
  const ids = Object.keys(meta);

  if (!ids.length) return [["(sin altoparlantes)", ""]];

  const items = ids.map((id) => {
    const m = meta[id] || {};
    const point = String(m.pointName || "ZZZ").toUpperCase();
    const n = Number(m.n);

    // etiqueta bonita:
    const label =
      Number.isFinite(n) && n > 0 ? `altoparlante ${n} ${point}` : `altoparlante ${point}`;

    return { id, label, point, n: Number.isFinite(n) ? n : Number.POSITIVE_INFINITY };
  });

  items.sort((a, b) => {
    if (a.point !== b.point) return a.point.localeCompare(b.point);
    if (a.n !== b.n) return a.n - b.n;
    return a.id.localeCompare(b.id);
  });

  return items.map((x) => [x.label, x.id]);
};

Blockly.Blocks["mathlive_clear"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("borrar casillas de MathLive")
      .appendField(
        new Blockly.FieldDropdown(() => DG.expressions.buildMathLiveOptions()),
        "ID"
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(47);
    this.setTooltip("Restaura las casillas de una fórmula MathLive a su contenido original.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["mathlive_visibility"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("fórmula MathLive")
      .appendField(
        new Blockly.FieldDropdown(() => DG.expressions.buildMathLiveOptions()),
        "ID"
      )
      .appendField(
        new Blockly.FieldDropdown([
          ["mostrar", "show"],
          ["ocultar", "hide"]
        ]),
        "ACTION"
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(47);
    this.setTooltip("Muestra u oculta una fórmula MathLive.");
    this.setHelpUrl("");
  }
};



  

 