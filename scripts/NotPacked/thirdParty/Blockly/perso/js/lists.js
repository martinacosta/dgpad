
Blockly.JavaScript['dgpad_create_list'] = function(block) {
    // Retorna el valor "[]"
    return ["[]", Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dgpad_stop_list'] = function(block) {
    // Obtener el nombre de la variable desde la entrada dinámica "NAME"
    var variable_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC) || 'undefined';
    
    // Generar el código JavaScript
    var code = variable_name + '.push([NaN, NaN, NaN]);\n';
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
    var listVar = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'undefined';
    var itemVar = Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.ORDER_ATOMIC) || 'undefined';
    
    
    return `${listVar}.push(${itemVar}); // Push item to list\n`;
};

Blockly.JavaScript['remove_item_from_named_list'] = function(block) {
    var index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    var listName = Blockly.JavaScript.valueToCode(block, 'LIST_NAME', Blockly.JavaScript.ORDER_ATOMIC) || '""';
  
    // Genera el código JavaScript para eliminar el elemento
    var code = listName + '.splice(' + index + ', 1);\n';
    return code;
  };
  
  


Blockly.JavaScript['dgpad_lista_objetos_tipo'] = function(block) {
    // Obtener el nombre de la variable conectada
    

    // Obtener el tipo de objeto seleccionado
    var type = block.getFieldValue('OBJECTTYPE');

    // Generar el código que retorna la lista de objetos del tipo seleccionado
    var code = `me.Z.getConstruction().getAllObjectsFromType("${type}")`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dgpad_lista_NombresObjetos_tipo'] = function(block) {
    

    // Obtener el tipo de objeto seleccionado
    var type = block.getFieldValue('OBJECTTYPE');

    // Generar el código que retorna los nombres de los objetos del tipo seleccionado
    var code = `me.Z.getConstruction().getAllObjectsNamesFromType("${type}")`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dgpad_lista_nombres_puntos_prefijo'] = function (block) {
  const prefix =
    Blockly.JavaScript.valueToCode(block, 'PREFIX', Blockly.JavaScript.ORDER_ATOMIC) || '""';

  const code = `(() => {
    const pref = String(${prefix});
    const names = me.Z.getConstruction().getAllObjectsNamesFromType("point") || [];
    return names.filter(n => String(n).startsWith(pref));
  })()`;

  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['dgpad_lista_puntos_prefijo'] = function (block) {
  const prefix =
    Blockly.JavaScript.valueToCode(block, 'PREFIX', Blockly.JavaScript.ORDER_ATOMIC) || '""';

  const code = `(() => {
    const pref = String(${prefix});
    const cons = me.Z.getConstruction();
    const objs = cons.getAllObjectsFromType("point") || [];
    const names = cons.getAllObjectsNamesFromType("point") || [];

    const out = [];
    for (let i = 0; i < objs.length; i++) {
      const o = objs[i];
      const n =
        (o && (typeof o.getName === "function" ? o.getName() : undefined)) ??
        (o && (typeof o.getVarName === "function" ? o.getVarName() : undefined)) ??
        names[i];

      if (String(n).startsWith(pref)) out.push(o);
    }
    return out;
  })()`;

  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['dgpad_lista_exclusiva_ocupantes_nombres'] = function (block) {
  const listCode =
    Blockly.JavaScript.valueToCode(block, "LIST", Blockly.JavaScript.ORDER_NONE) || '""';

  const isSimpleName = /^[A-Za-z_]\w*$/.test(listCode);
  const listExpr = isSimpleName ? JSON.stringify(listCode) : listCode;

  const code = `(() => {
    const cons = me.Z.getConstruction();
    const v = ${listExpr};

    // Caso 1: ya es el objeto lista
    if (v && typeof v.getExclusiveSlotOccupants === "function") {
      return v.getExclusiveSlotOccupants() || [];
    }

    // Caso 2: es nombre (string) o algo convertible a string
    const name = typeof v === "string" ? v : String(v);
    const obj = cons && typeof cons.find === "function" ? cons.find(name) : null;
    if (!obj || typeof obj.getExclusiveSlotOccupants !== "function") return [];
    return obj.getExclusiveSlotOccupants() || [];
  })()`;

  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['dgpad_lista_exclusiva_ocupantes_nombres_sin_null'] = function (block) {
  const listCode =
    Blockly.JavaScript.valueToCode(block, "LIST", Blockly.JavaScript.ORDER_NONE) || '""';

  const isSimpleName = /^[A-Za-z_]\w*$/.test(listCode);
  const listExpr = isSimpleName ? JSON.stringify(listCode) : listCode;

  const code = `(() => {
    const cons = me.Z.getConstruction();
    const v = ${listExpr};

    let obj = null;
    if (v && typeof v.getExclusiveSlotOccupants === "function") {
      obj = v;
    } else {
      const name = typeof v === "string" ? v : String(v);
      obj = cons && typeof cons.find === "function" ? cons.find(name) : null;
    }

    if (!obj || typeof obj.getExclusiveSlotOccupants !== "function") return 0;

    const occ = obj.getExclusiveSlotOccupants() || [];
    let count = 0;
    for (let i = 0; i < occ.length; i++) {
      if (occ[i] != null) count++;
    }
    return count;
  })()`;

  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['shuffle_list'] = function(block) {
    var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  
    var code = `(() => {
      let array = ${list}.slice(); // Copia la lista para evitar modificar la original
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    })()`;
  
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };

  Blockly.JavaScript['order_list'] = function(block) {
    const lista = Blockly.JavaScript.valueToCode(block, 'LISTA', Blockly.JavaScript.ORDER_ATOMIC);
    const orden = block.getFieldValue('ORDEN');
  
    let codigo = '';
    if (orden === 'ASC') {
      codigo = `${lista}.slice().sort(function(a, b) { return a - b; })`;
    } else {
      codigo = `${lista}.slice().sort(function(a, b) { return b - a; })`;
    }
  
    return [codigo, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };
  



Blockly.JavaScript['for_each'] = function (block) {
  const list =
    Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_NONE) || '[]';

  const itemVar = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE
  );

  const statements = Blockly.JavaScript.statementToCode(block, 'DO');

  // Índice único para evitar colisiones entre loops anidados
  const indexVar = Blockly.JavaScript.variableDB_.getDistinctName(
    'i',
    Blockly.Variables.NAME_TYPE
  );

  // Evalúa la lista una sola vez por seguridad (si LIST es expresión)
  const listVar = Blockly.JavaScript.variableDB_.getDistinctName(
    'list',
    Blockly.Variables.NAME_TYPE
  );

  const code =
    `var ${listVar} = ${list};\n` +
    `for (var ${indexVar} = 0; ${indexVar} < ${listVar}.length; ${indexVar}++) {\n` +
    `  ${itemVar} = ${listVar}[${indexVar}];\n` +
    `${statements}` +
    `}\n`;

  return code;
};
