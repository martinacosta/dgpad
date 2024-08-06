Blockly.JavaScript['dgpad_create_list'] = function(block) {
    var variable_varname = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'blockly_var_' + variable_varname + ' = [];\n';
};

Blockly.JavaScript['dgpad_stop_list'] = function(block) {
    var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
    // TODO: Assemble JavaScript into code variable.
    var code = 'blockly_var_' + variable_name + '.push([NaN,NaN,NaN]);\n';
    return code;
};

Blockly.JavaScript['dgpad_get_list'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var value_index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC);
    var code = value_name + '[' + value_index + ']';
    
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['dgpad_set_list'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var value_index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC);
    var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    var code = value_name + '[' + value_index + '] = ' + value_value + ';\n';
    return code;
};
Blockly.JavaScript['dgpad_push'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var variable_varname = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VARNAME'), Blockly.Variables.NAME_TYPE);
    value_name = value_name.replace(/^\((.*)\)$/, "$1");
    value_name=value_name.replace(/^"setRGBColor",\[(\d*),(\d*),(\d*)\]$/,"[0,$1,$2,$3]");
    var code = 'blockly_var_' + variable_varname + '.push(' + value_name + ');\n';
    return code;
};

Blockly.JavaScript['remove_item_from_named_list'] = function(block) {
    var index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    var listName = Blockly.JavaScript.valueToCode(block, 'LIST_NAME', Blockly.JavaScript.ORDER_ATOMIC) || '""';
  
    // Genera el código JavaScript para eliminar el elemento
    var code = listName + '.splice(' + index + ', 1);\n';
    return code;
  };
  
  

Blockly.JavaScript['dgpad_lista_objetos_tipo'] = function(block) {
	var variable_varname = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
	var type = block.getFieldValue('OBJECTTYPE');
	return 'blockly_var_' + variable_varname + ' = me.Z.getConstruction().getAllObjectsFromType("'+type+'");\n';
	
	
};

Blockly.JavaScript['dgpad_lista_NombresObjetos_tipo'] = function(block) {
	var variable_varname = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
	var type = block.getFieldValue('OBJECTTYPE');
    
	return 'blockly_var_' + variable_varname + ' = me.Z.getConstruction().getAllObjectsNamesFromType("'+type+'");\n';
	
	
};
