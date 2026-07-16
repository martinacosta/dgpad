Blockly.JavaScript['text_append'] = function(block) {
    // Append to a variable in place.
    var varName = "blockly_var_" + Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var argument0 = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    return varName + ' = String(' + varName + ') + String(' + argument0 + ');\n';
};



Blockly.JavaScript['text'] = function(block) {
    var text = block.getFieldValue('TEXT');

    // Codificar correctamente el texto como string JavaScript válido
    var code = JSON.stringify(text);

    return ["TURTLE_TEXT(" + code + ")", Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dgpad_object_name'] = function(block) {
    var code = Blockly.JavaScript.quote_("dgpad_object_" + block.getFieldValue('TEXT'));

    // unicode parsing :
    code = code.replace(/\\\\u([A-F\d]{4})/g, function(m, _s) {
        return String.fromCharCode(parseInt(_s, 16))
    });
    code = "TURTLE_TEXT(" + code + ")";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dgpad_tex_2'] = function(block) {
    var dropdown_name = block.getFieldValue('NAME');
    var value_first = Blockly.JavaScript.valueToCode(block, 'FIRST', Blockly.JavaScript.ORDER_ATOMIC);
    var value_second = Blockly.JavaScript.valueToCode(block, 'SECOND', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "TURTLE_TEXT('\\\\" + dropdown_name + "{'+" + value_first + "+'}{'+" + value_second + "+'}')";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['dgpad_tex_1'] = function(block) {
    var dropdown_name = block.getFieldValue('NAME');
    var value_first = Blockly.JavaScript.valueToCode(block, 'FIRST', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "TURTLE_TEXT('\\\\" + dropdown_name + "{'+" + value_first + "+'}')";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['dgpad_tex_0'] = function(block) {
    var dropdown_name = block.getFieldValue('NAME');
    // TODO: Assemble JavaScript into code variable.
    var code = "TURTLE_TEXT('\\\\" + dropdown_name + "')";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['dgpad_tex'] = function(block) {
    var result = Blockly.JavaScript['text_join'](block);
    result[0] = "'$$'+" + result[0] + "+'$$'";
    return result;
};

Blockly.JavaScript['dgpad_output_precision'] = function(block) {
  var number_val = block.getFieldValue('VAL');
  // TODO: Assemble JavaScript into code variable.
  var code = 'SET_NUM_PRECISION('+number_val+');\n';
  return code;
};

Blockly.JavaScript['text_newline'] = function (block) {
  return ['"\\n"', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["mathlive_latex_text"] = function (block) {
  var text = block.getFieldValue("TEXT") || "";
  return [JSON.stringify(text), Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["mathlive_latex_join"] = function (block) {
  var a = Blockly.JavaScript.valueToCode(block, "A", Blockly.JavaScript.ORDER_ADDITION) || '""';
  var b = Blockly.JavaScript.valueToCode(block, "B", Blockly.JavaScript.ORDER_ADDITION) || '""';
  return ["(" + a + " + " + b + ")", Blockly.JavaScript.ORDER_ADDITION];
};

Blockly.JavaScript["mathlive_latex_cmd_0"] = function (block) {
  var name = block.getFieldValue("NAME");
  return ["'\\\\" + name + "'", Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["mathlive_latex_cmd_1"] = function (block) {
  var name = block.getFieldValue("NAME");
  var arg = Blockly.JavaScript.valueToCode(block, "ARG", Blockly.JavaScript.ORDER_NONE) || '""';
  var code = "'\\\\" + name + "{' + " + arg + " + '}'";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["mathlive_latex_cmd_2"] = function (block) {
  var name = block.getFieldValue("NAME");
  var arg1 = Blockly.JavaScript.valueToCode(block, "ARG1", Blockly.JavaScript.ORDER_NONE) || '""';
  var arg2 = Blockly.JavaScript.valueToCode(block, "ARG2", Blockly.JavaScript.ORDER_NONE) || '""';
  var code = "'\\\\" + name + "{' + " + arg1 + " + '}{' + " + arg2 + " + '}'";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["mathlive_latex_superscript"] = function (block) {
  var base = Blockly.JavaScript.valueToCode(block, "BASE", Blockly.JavaScript.ORDER_NONE) || '""';
  var exp = Blockly.JavaScript.valueToCode(block, "EXP", Blockly.JavaScript.ORDER_NONE) || '""';
  return ["('{' + " + base + " + '}^{' + " + exp + " + '}')", Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["mathlive_latex_subscript"] = function (block) {
  var base = Blockly.JavaScript.valueToCode(block, "BASE", Blockly.JavaScript.ORDER_NONE) || '""';
  var sub = Blockly.JavaScript.valueToCode(block, "SUB", Blockly.JavaScript.ORDER_NONE) || '""';
  return ["('{' + " + base + " + '}_{' + " + sub + " + '}')", Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["mathlive_latex_group"] = function (block) {
  var value = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_NONE) || '""';
  return ["('{' + " + value + " + '}')", Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript["mathlive_latex_parens"] = function (block) {
  var value = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_NONE) || '""';
  return ["('\\\\left(' + " + value + " + '\\\\right)')", Blockly.JavaScript.ORDER_NONE];
};

