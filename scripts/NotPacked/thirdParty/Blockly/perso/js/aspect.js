Blockly.JavaScript['dgpad_style_fix'] = function(block) {
    var dropdown_object = block.getFieldValue('OBJECT');
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_name === "") return "";
    value_name = value_name.replace(/^\((.*)\)$/, "$1");
    var code = 'BLK_STL("' + dropdown_object + '",' + value_name + ");\n"
    return code;
};

Blockly.JavaScript['dgpad_object_style_fix'] = function(block) {

    var value_object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC);
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_name === "") return "";
    value_name = value_name.replace(/^\((.*)\)$/, "$1");
    value_object=value_object.replace(/^\'(.*)\'$/, "\"$1\"");
    // TODO: Assemble JavaScript into code variable.
    var code = 'BLK_STL(' + value_object+ ',' + value_name + ");\n";
 
    return code;
};


Blockly.JavaScript['dgpad_style_color_rgb'] = function(block) {
    var value_r = Blockly.JavaScript.valueToCode(block, 'R', Blockly.JavaScript.ORDER_ATOMIC);
    var value_g = Blockly.JavaScript.valueToCode(block, 'G', Blockly.JavaScript.ORDER_ATOMIC);
    var value_b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC);
    var code = '"setRGBColor",[' + value_r + ',' + value_g + ',' + value_b + ']';
    return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.dgpad_style_block_js = function(_cmd) {
    return (function(block) {
        var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
        var code = '"' + _cmd + '",[' + value_name + ']';
        return [code, Blockly.JavaScript.ORDER_NONE];
    });
}
// Blockly.JavaScript['dgpad_style_visibility'] = Blockly.dgpad_style_block_js("setHidden");
Blockly.JavaScript['dgpad_style_visibility'] = function (block) {
    const hidden = block.getFieldValue("VISIBILITY");
    return [`"setHidden", [${hidden}]`, Blockly.JavaScript.ORDER_ATOMIC];
  };

Blockly.JavaScript['dgpad_style_size'] = Blockly.dgpad_style_block_js("setSize");
Blockly.JavaScript['dgpad_style_layer'] = Blockly.dgpad_style_block_js("setLayer");
Blockly.JavaScript['dgpad_style_font'] = Blockly.dgpad_style_block_js("setFontSize");
Blockly.JavaScript['dgpad_style_precision'] = Blockly.dgpad_style_block_js("setPrecision");
Blockly.JavaScript['dgpad_style_increment'] = Blockly.dgpad_style_block_js("setIncrement");
Blockly.JavaScript['dgpad_style_dash'] = Blockly.dgpad_style_block_js("setDash");
Blockly.JavaScript['dgpad_style_nomouse'] = Blockly.dgpad_style_block_js("setNoMouseInside");
Blockly.JavaScript['dgpad_style_opacity'] = Blockly.dgpad_style_block_js("setOpacity");


Blockly.JavaScript['dgpad_style_arrow'] = function(block) {
  var value_w = Blockly.JavaScript.valueToCode(block, 'w', Blockly.JavaScript.ORDER_ATOMIC);
  var value_h = Blockly.JavaScript.valueToCode(block, 'h', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '"setArrow",[[' + value_w + ',' + value_h + ']]';
  return [code, Blockly.JavaScript.ORDER_NONE];
};







Blockly.JavaScript["dgpad_inputs_deleteValue"] = function (block) {
  const id = String(block.getSelectedId?.() || block.getFieldValue?.("ID") || "");

  if (!id) return "";

  return (
    `;\n(() => {\n` +
    `  const id = ${JSON.stringify(id)};\n` +
    `  if (window.$U?.inputValues) window.$U.inputValues[id] = "";\n` +
    `  (window.parent || window).postMessage({\n` +
    `    action: "clear-custom-input",\n` +
    `    id\n` +
    `  }, "*");\n` +
    `})();\n`
  );
};




Blockly.JavaScript["dgpad_inputs_showHide"] = function (block) {
  const id = block.getFieldValue("ID") || "";
  const visible = block.getFieldValue("ACTION") === "true";

  // Nota: empieza con ';' para evitar “pegado” con la línea anterior
  return (
    `;\nparent.postMessage({` +
    ` action: "toggle-custom-input-visibility",` +
    ` id: ${JSON.stringify(id)},` +
    ` visible: ${visible}` +
    ` }, "*");\n`
  );
};


Blockly.JavaScript["dgpad_speakers_showHide"] = function (block) {
  const id = block.getSelectedId() || "";
  const visible = block.getActionValue() === "true";

  return `
(() => {
  parent.postMessage({
    action: "toggle-custom-speaker-visibility",
    id: ${Blockly.JavaScript.quote_(id)},
    visible: ${visible}
  }, "*");
})();
`;
};

 Blockly.JavaScript["mathlive_clear"] = function (block) {
  const id = block.getFieldValue("ID") || "";
  return "DG.clearMathLive(" + JSON.stringify(id) + ");\n";
}; 

Blockly.JavaScript["mathlive_visibility"] = function (block) {
  const id = block.getFieldValue("ID") || "";
  const action = block.getFieldValue("ACTION") || "show";

  if (action === "hide") {
    return "DG.hideMathLive(" + JSON.stringify(id) + ");\n";
  }

  return "DG.showMathLive(" + JSON.stringify(id) + ");\n";
};

