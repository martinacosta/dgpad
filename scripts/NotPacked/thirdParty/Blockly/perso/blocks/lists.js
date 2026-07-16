// Blockly.Blocks['dgpad_create_list'] = {
//     init: function() {
//         this.appendDummyInput()
//             .appendField($L.blockly.list_new); 
//         this.appendValueInput("VAR")
//             .setCheck("Variable")
//         this.appendDummyInput()
//             .appendField($L.blockly.list_new2);

//         this.setPreviousStatement(true, null);
//         this.setNextStatement(true, null);
//         this.setColour(260);
//         this.setTooltip('Creates a list variable for the connected variable.');
//         this.setHelpUrl('');
//     }
// };

// Definir el bloque "lista vacía"
Blockly.Blocks['dgpad_create_list'] = {
    init: function() {
        this.appendDummyInput()
            .appendField($L.blockly.list_new);
        
        this.setOutput(true, "Array"); // El bloque puede conectarse a entradas de tipo "Array"
        this.setColour(260); // Color del bloque
        this.setTooltip("A list that is initially empty.");
        this.setHelpUrl("");
    }
};

// Blockly.Blocks['dgpad_stop_list'] = {
//     init: function() {
//         this.appendDummyInput()
//             .appendField($L.blockly.stop_list)
//             .appendField(new Blockly.FieldVariable("item"), "NAME");
//         this.setInputsInline(true);
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//         this.setColour(260);
//         this.setTooltip('');
//         this.setHelpUrl('');
//     }
// };
Blockly.Blocks['dgpad_stop_list'] = {
    init: function() {
        this.appendDummyInput()
            .appendField($L.blockly.stop_list); // Texto inicial

        this.appendValueInput("NAME")
            .setCheck("Variable") // Permite conectar una variable
            

        this.setInputsInline(true); // Mantener todo en una sola línea
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(260);
        this.setTooltip('Stops the specified list.');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['dgpad_get_list'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("[");
        this.appendValueInput("INDEX")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("]");
        this.setOutput(true, null);
        this.setColour(260);
        this.setTooltip(Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM + '  ' + Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP.replace('%1', '#1'));
        this.setHelpUrl('');
    }
};

Blockly.Blocks['dgpad_set_list'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("[");
        this.appendValueInput("INDEX")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("] = ");
        this.appendValueInput("VALUE")
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
        this.setTooltip(Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM + '  ' + Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP.replace('%1', '#1'));
        this.setHelpUrl('');
    }
};




Blockly.Blocks['dgpad_push'] = {
    init: function() {
        this.appendDummyInput()
          .appendField($L.blockly.push_add);
        this.appendValueInput("ITEM")
            .setCheck(null)
        this.appendDummyInput()
            .appendField($L.blockly.push_end);    

        this.appendValueInput("LIST")
            .setCheck("Variable")
            
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
        this.setTooltip('Push an item to a list variable.');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['remove_item_from_named_list'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Eliminar la posición");
      this.appendValueInput("INDEX")
          .setCheck("Number");
      this.appendDummyInput()
          .appendField("de la lista");
      this.appendValueInput("LIST_NAME")
          .setCheck("String");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip("Elimina el elemento en la posición indicada de la lista especificada por nombre");
      this.setHelpUrl("");
    }
  };
  
  


Blockly.Blocks['dgpad_lista_objetos_tipo'] = {
    init: function() {
        this.appendDummyInput()
            .appendField($L.blockly.lists_objetosTipo1);
        this.appendDummyInput()
            .appendField($L.blockly.lists_objetosTipo2)
            .appendField(new Blockly.FieldDropdown([
                [$L.object.point, "point"],
                [$L.object.line, "line"],
                [$L.object.segment, "segment"],
                [$L.object.ray, "ray"],
                [$L.object.circle, "circle"],
                [$L.object.expression, "expression"],
                [$L.object.list, "list"],
                [$L.object.angle,"angle"]
            ]), "OBJECTTYPE");

        this.setOutput(true, "Array"); // El bloque ahora tiene salida de tipo "Array"
        this.setColour(260);
        this.setTooltip('Returns a list of objects of a specific type.');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['dgpad_lista_NombresObjetos_tipo'] = {
    init: function() {
        this.appendDummyInput()
            .appendField($L.blockly.lists_objetosTipo1); // Texto inicial
        this.appendDummyInput()
            .appendField($L.blockly.lists_NombresObjetosTipo2a);
        this.appendDummyInput()
            .appendField($L.blockly.lists_NombresObjetosTipo2b)
            .appendField(new Blockly.FieldDropdown([
                [$L.object.point, "point"],
                [$L.object.line, "line"],
                [$L.object.segment, "segment"],
                [$L.object.ray, "ray"],
                [$L.object.circle, "circle"],
                [$L.object.expression, "expression"],
                [$L.object.list, "list"],
                [$L.object.angle,"angle"]
            ]), "OBJECTTYPE"); // Menú desplegable para tipo de objeto

        this.setOutput(true, "Array"); // El bloque ahora tiene salida de tipo "Array"
        this.setColour(260);
        this.setTooltip('Returns the names of objects of a specific type.');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['dgpad_lista_puntos_prefijo'] = {
  init: function () {
    this.appendDummyInput().appendField($L.blockly.lists_NombresPuntos1);
    this.appendDummyInput().appendField($L.blockly.lists_NombresPuntos2);
    this.appendDummyInput().appendField($L.blockly.lists_NombresPuntos3);
    this.appendValueInput("PREFIX").setCheck("String");

    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.setColour(260);
    this.setTooltip("Devuelve la lista de puntos cuyo nombre comienza con el prefijo dado.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks['dgpad_lista_nombres_puntos_prefijo'] = {
  init: function () {
    this.appendDummyInput().appendField($L.blockly.lists_NombresPuntos1);
    this.appendDummyInput().appendField($L.blockly.lists_NombresPuntos2);
    this.appendDummyInput().appendField($L.blockly.lists_NombresPuntos3);
    this.appendValueInput("PREFIX").setCheck("String");

    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.setColour(260);
    this.setTooltip("Devuelve los nombres de los puntos cuyo nombre comienza con el prefijo dado.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks['dgpad_lista_exclusiva_ocupantes_nombres'] = {
  init: function () {
    this.appendDummyInput().appendField("Nombres de puntos pegados");
    this.appendValueInput("LIST").setCheck(null).appendField("lista"); // normalmente sale de dgpad_get_object_short
    this.setInputsInline(false);
    this.setOutput(true, "Array");
    this.setColour(260);
    this.setTooltip('Devuelve ["A", null, ...] con los nombres de puntos pegados en cada slot.');
    this.setHelpUrl("");
  },
};

Blockly.Blocks['dgpad_lista_exclusiva_ocupantes_nombres_sin_null'] = {
  init: function () {
    this.appendDummyInput().appendField($L.blockly.lists_NumeroPuntosPegados1);
    
    this.appendValueInput("LIST").setCheck(null).appendField("lista");
    this.setInputsInline(false);
    this.setOutput(true, "Number"); 
    this.setColour(260);
    this.setTooltip("Devuelve cuántas posiciones (slots) están ocupadas en la lista exclusiva.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks['shuffle_list'] = {
    init: function() {
      this.appendValueInput("LIST")
          .setCheck("Array")
          .appendField($L.blockly.lists_shuffle);
      this.setOutput(true, "Array");
      this.setColour(230);
      this.setTooltip("Desordena aleatoriamente los elementos de una lista.");
      this.setHelpUrl("");
    }
  };

  Blockly.Blocks['for_each'] = {
    init: function() {
      this.appendValueInput("LIST")
          .setCheck("Array")
          .appendField("Para cada elemento en");
      this.appendDummyInput()
          .appendField("como")
          .appendField(new Blockly.FieldVariable("item"), "VAR");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("hacer");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Itera sobre cada elemento de una lista y ejecuta las instrucciones dentro.");
      this.setHelpUrl("");
    }
  };

  Blockly.Blocks['order_list'] = {
    init: function() {
      this.appendValueInput("LISTA")
          .setCheck("Array")
          .appendField($L.blockly.lists_order);
      this.appendDummyInput()
          .appendField("en orden")
          .appendField(new Blockly.FieldDropdown([
            [$L.blockly.lists_order1, "ASC"],
            [$L.blockly.lists_order2, "DESC"]
          ]), "ORDEN");
      this.setOutput(true, "Array");
      this.setColour(230);
      this.setTooltip("Ordena una lista de números.");
      this.setHelpUrl("");
    }
  };
  
