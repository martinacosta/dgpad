Blockly.JavaScript['dgpad_actions_anchor'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  var value_obj2 = block.getFieldValue('NAME');
  // console.log(value_obj1);
  // console.log(value_obj2);
  if ((value_obj1 === "") || (value_obj2 === "")) return "";
  var code = 'Anchor("' + value_obj1 + '", "' + value_obj2 + '");';
  return code;
};

Blockly.JavaScript['dgpad_actions_unanchor'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  
  if (value_obj1 === "")  return "";
  var code = 'Unanchor("' + value_obj1 + '");';
  return code;
};



Blockly.JavaScript['dgpad_actions_iman'] = function(block) {
  var targetBlock = block.getInputTargetBlock('OBJ1');
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  var value_obj2 = block.getFieldValue('NAME');
  var value_im = Blockly.JavaScript.valueToCode(block, 'im', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_unit = block.getFieldValue('UNIT') || 'px';

  if (!value_obj1 || !value_obj2) return '';

  var obj1Code = value_obj1;

  if (targetBlock && targetBlock.type === 'dgpad_get_object_short') {
    obj1Code = '"' + value_obj1 + '"';
  }

  return 'imantar(' + obj1Code + ',"' + value_obj2 + '",' + value_im + ',"' + value_unit + '");';
};

Blockly.JavaScript['dgpad_actions_fixToPoint'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
    var value_obj2 = Blockly.JavaScript.valueToCode(block, 'OBJ2', Blockly.JavaScript.ORDER_NONE);
	
	
	if ((value_obj1 === "") || (value_obj2 === "")) return "";
	var code = 'FixPointToPoint("' + value_obj1 + '","' + value_obj2 +  '");';
	
	return code;
	
};

Blockly.JavaScript['dgpad_actions_fix'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'FixPoint("' + value_obj1 + '");';
	
	return code;
	
};

Blockly.JavaScript['dgpad_actions_exclusive'] = function(block) {
  const obj = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  if (!obj) return '';

  // statement block -> terminar en ; y newline
  return 'Find("'+obj + '").setExclusiveMagnetTarget(true);\n';
};

// Blockly.JavaScript['dgpad_actions_exclusiveList'] = function(block) {
//   const obj = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
//   if (!obj) return '';

//   // statement block -> terminar en ; y newline
//   return 'Find("'+obj + '").setMagnetSlotsExclusive(true);\n';
// };

Blockly.JavaScript['dgpad_actions_exclusiveList'] = function(block) {
  var obj = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  var mode = block.getFieldValue('MODE');

  if (!obj) return '';

  return 'Find("' + obj + '").setMagnetSlotsExclusive(' + mode + ');\n';
};

Blockly.JavaScript['dgpad_actions_free'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  
  if (value_obj1 === "")  return "";
  var code = 'FreePoint("' + value_obj1 + '");';
  return code;
};


Blockly.JavaScript['dgpad_actions_move'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  var value_corx = Blockly.JavaScript.valueToCode(block, 'CorX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_cory = Blockly.JavaScript.valueToCode(block, 'CorY', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_obj1 === "" || value_corx === "" || value_cory === "") return "";

  // Si es un identificador simple (A, B12, U_1), lo tratamos como nombre fijo y lo "citamos".
  // Si no, asumimos que ya es una expresión que evalúa a string (puntosU[i], "U"+i, etc.).
  var isSimpleName = /^[A-Za-z_]\w*$/.test(value_obj1);
  var nameExpr = isSimpleName ? JSON.stringify(value_obj1) : value_obj1;

  return 'Move(' + nameExpr + ', ' + value_corx + ', ' + value_cory + ');';
};

Blockly.JavaScript['dgpad_actions_animPause'] = function(block) {
  var code = 'AnimationPause();';
  return code;
};

Blockly.JavaScript['dgpad_actions_animStart'] = function(block) {
  var code = 'AnimationStart();';
  return code;
};

Blockly.JavaScript['dgpad_actions_audio'] = function(block) {
  var archivoAudio = Blockly.JavaScript.valueToCode(block, 'ArchivoAudio', Blockly.JavaScript.ORDER_NONE);
  var code = 'var AUDIO=document.createElement("audio"); AUDIO.src=' + archivoAudio + '; document.body.appendChild(AUDIO); AUDIO.play();\n';
  return code;
};



Blockly.JavaScript['dgpad_cronometro_startstop'] = function (block) {
  const id = `"${block.getSelectedId()}"`;
  const action = block.getActionValue();

  // Llama a funciones ya definidas en el sandbox
  var code = `${action}Cronometro(${id});\n` +
         `parent.postMessage({ action: "cronometro-${action}", id: ${id} }, "*");\n`;
         
         return code;
};

Blockly.JavaScript['tiempo_actual'] = function(block) {
  const code = 'Date.now()';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['tiempo_actual_formato_legible'] = function(block) {
  const timestamp = Blockly.JavaScript.valueToCode(block, 'TIMESTAMP', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `Math.floor(${timestamp} / 1000) + ' segundos'`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

