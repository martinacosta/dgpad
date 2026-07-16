Blockly.JavaScript['dgpad_restrictions_ShowCtrl'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'showCtrlPanel(' + value_obj1 + ');';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_Mode'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'setMode(' + value_obj1 + ');';
	
	return code;
	
};

// Blockly.JavaScript['dgpad_restrictions_disableButton'] = function(block) {
	
// 	var button = block.getFieldValue('BUTTON');
	
// 	var code = 'disableButton("' + button + '");';
	
// 	return code;
	
// };

// Blockly.JavaScript['dgpad_restrictions_enableButton'] = function(block) {
	
// 	var button = block.getFieldValue('BUTTON');
	
// 	var code = 'enableButton("' + button + '");';
	
// 	return code;
	
// };

Blockly.JavaScript['dgpad_restrictions_setButton'] = function(block) {
  var action = block.getFieldValue('ACTION');
  var button = block.getFieldValue('BUTTON');

  if (action === 'disable') {
    return 'disableButton("' + button + '");';
  }
  return 'enableButton("' + button + '");';
};

Blockly.JavaScript['dgpad_restrictions_Zoom'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'enableZoom(' + value_obj1 + ');';
	
	return code;
	
};

// Blockly.JavaScript['dgpad_restrictions_disableTool'] = function(block) {
	
// 	var tool = block.getFieldValue('TOOL');
	
// 	var code = 'disableOneTool("' + tool + '");';
	
// 	return code;
	
// };

// Blockly.JavaScript['dgpad_restrictions_enableTool'] = function(block) {
	
// 	var tool = block.getFieldValue('TOOL');
	
// 	var code = 'enableTool("' + tool + '");';
	
// 	return code;
	
// };

Blockly.JavaScript['dgpad_restrictions_setTool'] = function(block) {
  var action = block.getFieldValue('ACTION');
  var tool = block.getFieldValue('TOOL');

  if (action === 'disable') {
    return 'disableOneTool("' + tool + '");';
  }
  return 'enableTool("' + tool + '");';
};

Blockly.JavaScript['dgpad_restrictions_fixOx'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'fixOx(' + value_obj1 + ');';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_fixOy'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'fixOy(' + value_obj1 + ');';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_fixOxOy'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'fixOxOy(' + value_obj1 + ');';
	
	return code;
	
};

// Blockly.JavaScript['dgpad_restrictions_SystemProperties'] = function(block) {
	
// 	var font = Blockly.JavaScript.valueToCode(block, 'font', Blockly.JavaScript.ORDER_NONE);
// 	var axesWidth = Blockly.JavaScript.valueToCode(block, 'axesWidth', Blockly.JavaScript.ORDER_NONE);
// 	var gridWidth = Blockly.JavaScript.valueToCode(block, 'gridWidth', Blockly.JavaScript.ORDER_NONE);
//     var gridShow = Blockly.JavaScript.valueToCode(block, 'gridShow', Blockly.JavaScript.ORDER_NONE);
// 	var oxShow = Blockly.JavaScript.valueToCode(block, 'oxShow', Blockly.JavaScript.ORDER_NONE);
// 	var oyShow = Blockly.JavaScript.valueToCode(block, 'oyShow', Blockly.JavaScript.ORDER_NONE);
// 	var fixOx = Blockly.JavaScript.valueToCode(block, 'fixOx', Blockly.JavaScript.ORDER_NONE);
//     var fixOy = Blockly.JavaScript.valueToCode(block, 'fixOy', Blockly.JavaScript.ORDER_NONE);
// 	var onlyPos = Blockly.JavaScript.valueToCode(block, 'onlyPos', Blockly.JavaScript.ORDER_NONE);
// 	var zoomOrigin = Blockly.JavaScript.valueToCode(block, 'zoomOrigin', Blockly.JavaScript.ORDER_NONE);
	
	
// 	var code = 'me.C.coordsSystem.setFontSize(' + font +');me.C.coordsSystem.setAxisWidth('+axesWidth+');me.C.coordsSystem.setGridWidth('+gridWidth+');me.C.coordsSystem.showGrid('+gridShow+');me.C.coordsSystem.showOx('+oxShow+');me.C.coordsSystem.showOy('+oyShow+');me.C.coordsSystem.setLockOx('+fixOx+');me.C.coordsSystem.setLockOy('+fixOy+');me.C.coordsSystem.setOnlyPos('+onlyPos+');me.C.coordsSystem.setCenterZoom('+zoomOrigin+')';
	
// 	return code;
	
// };

Blockly.JavaScript['dgpad_restrictions_SystemProperties'] = function(block) {
  // Numéricos (siguen viniendo desde conexiones Blockly)
  var font = Blockly.JavaScript.valueToCode(block, 'font', Blockly.JavaScript.ORDER_NONE) || '0';
  var axesWidth = Blockly.JavaScript.valueToCode(block, 'axesWidth', Blockly.JavaScript.ORDER_NONE) || '0';
  var gridWidth = Blockly.JavaScript.valueToCode(block, 'gridWidth', Blockly.JavaScript.ORDER_NONE) || '0';

  // Checkboxes: Blockly devuelve "TRUE" / "FALSE"
  function cb01(name) {
    return (block.getFieldValue(name) === 'TRUE') ? '1' : '0';
  }

  var gridShow = cb01('gridShow');
  var oxShow = cb01('oxShow');
  var oyShow = cb01('oyShow');
  var fixOx = cb01('fixOx');
  var fixOy = cb01('fixOy');
  var onlyPos = cb01('onlyPos');
  var zoomOrigin = cb01('zoomOrigin');

  var code =
    'me.C.coordsSystem.setFontSize(' + font + ');' +
    'me.C.coordsSystem.setAxisWidth(' + axesWidth + ');' +
    'me.C.coordsSystem.setGridWidth(' + gridWidth + ');' +
    'me.C.coordsSystem.showGrid(' + gridShow + ');' +
    'me.C.coordsSystem.showOx(' + oxShow + ');' +
    'me.C.coordsSystem.showOy(' + oyShow + ');' +
    'me.C.coordsSystem.setLockOx(' + fixOx + ');' +
    'me.C.coordsSystem.setLockOy(' + fixOy + ');' +
    'me.C.coordsSystem.setOnlyPos(' + onlyPos + ');' +
    'me.C.coordsSystem.setCenterZoom(' + zoomOrigin + ');\n';

  return code;
};

Blockly.JavaScript['dgpad_restrictions_setSystem'] = function(block) {
	
	var minAbs = Blockly.JavaScript.valueToCode(block, 'min_abs', Blockly.JavaScript.ORDER_NONE);
	var maxAbs = Blockly.JavaScript.valueToCode(block, 'max_abs', Blockly.JavaScript.ORDER_NONE);
	var maxOrds = Blockly.JavaScript.valueToCode(block, 'max_ords', Blockly.JavaScript.ORDER_NONE);
    
	var code = 'SetSystem(' + minAbs + ','+maxAbs+','+maxOrds+');';
	
	return code;
	
};

Blockly.JavaScript['dgpad_protect_object'] = function(block) {
    var obj = block.getFieldValue('OBJECT');
    var val = block.getFieldValue('PROTECT');
	var code = 'ProtectObject("' + obj + '", ' + val + ');\n';
    return code;
};
