Blockly.Blocks['dgpad_actions_anchor'] = {
  init: function() {
	var types = [];
        var me = this;
        for (key in $L.blockly.o3) {
            types.push([$L.blockly.o3[key], key])
        }
        // Avoid blockly to automatically transform dropdown menu :
        types[0][0] = " " + types[0][0];
        var drop = new Blockly.FieldDropdown(types, function(option) {
            this.sourceBlock_.updateShape_(option);
        });
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_anchor);
	
	this.appendDummyInput('obj_type')
		.appendField($L.blockly.actions_anchor_2)
            .appendField(drop, "TYPE");   
    this.appendDummyInput()
            .appendField(" ");
        this.appendDummyInput('obj_name')
            .appendField(Blockly.dgpad.objectPopup("expression"), "NAME");
			
		
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
	setTimeout(function() {
            var tpe = me.getInput('obj_type').fieldRow[0].getValue();
            var nme = me.getInput('obj_name').fieldRow[0].getValue();
            me.removeInput('obj_name');
            me.appendDummyInput('obj_name')
                .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
            me.getInput('obj_name').fieldRow[0].setValue(nme);
        }, 0);
    },
    updateShape_: function(tpe) {
        if (this.getInput('obj_name')) {
            this.removeInput('obj_name');
        };
        try {
            this.appendDummyInput('obj_name')
                .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
        } catch (e) {}
    },
    getName: function(_o) {
        this.getInput('obj_type').fieldRow[0].setValue(_o.getCode());
        this.updateShape_(_o.getCode());
        this.getInput('obj_name').fieldRow[0].setValue(_o.getName());
    }
  
  
};

Blockly.Blocks['dgpad_actions_unanchor'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_unanchor);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_iman'] = {
  init: function() {
	var types = [];
        var me = this;
        for (key in $L.blockly.o3) {
            types.push([$L.blockly.o3[key], key])
        }
        // Avoid blockly to automatically transform dropdown menu :
        types[0][0] = " " + types[0][0];
        var drop = new Blockly.FieldDropdown(types, function(option) {
            this.sourceBlock_.updateShape_(option);
        });  
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_iman);
	this.appendDummyInput()
        .appendField($L.blockly.actions_anchor_2);
    this.appendDummyInput('obj_type')
		.appendField(drop, "TYPE");   
    // this.appendDummyInput()
        // .appendField(" ");
    this.appendDummyInput('obj_name')
        .appendField(Blockly.dgpad.objectPopup("expression"), "NAME");
	
	this.appendValueInput("im")
	  .setCheck('Number')
	  .appendField($L.blockly.actions_iman_2);  
	this.appendDummyInput("unit_type")
      .appendField(new Blockly.FieldDropdown([
        ["píxeles", "px"],
        ["unidades", "u"]
      ]), "UNIT");
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
	
  setTimeout(function() {
    var tpe = me.getInput('obj_type').fieldRow[0].getValue();
    var nme = me.getInput('obj_name').fieldRow[0].getValue();
    // Eliminar el campo "NAME" directamente desde el Input
    me.getInput('obj_name').removeField("NAME");
    me.getInput('obj_name').appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
    me.getInput('obj_name').fieldRow[0].setValue(nme);
}, 0);

    },
    updateShape_: function(tpe) {
        
		if (this.getInput('obj_name')) {
            this.getInput('obj_name').removeField("NAME",true);
			//this.removeInput('obj_name');
        };
        try {
            this.getInput('obj_name').appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
			//this.appendDummyInput('obj_name')
              // .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
        } catch (e) {}
    },
    getName: function(_o) {
        this.getInput('obj_type').fieldRow[0].setValue(_o.getCode());
        this.updateShape_(_o.getCode());
        this.getInput('obj_name').fieldRow[0].setValue(_o.getName());
    }
  
};

Blockly.Blocks['dgpad_actions_fixToPoint'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_fix);
    this.appendValueInput("OBJ2")
	  .appendField($L.blockly.actions_fix_2);
	this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_fix'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_fix);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_exclusive'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
      .appendField($L.blockly.actions_exclusive);
    this.appendValueInput("OBJ1")
      
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

// Blockly.Blocks['dgpad_actions_exclusiveList'] = {
//   init: function() {
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.appendDummyInput()
//       .appendField($L.blockly.actions_exclusiveList);
//     this.appendValueInput("OBJ1")
      
//     this.setInputsInline(true);
//     this.setOutput(false);
//     this.setColour(320);
//     this.setTooltip('');
//     this.setHelpUrl('');
//   }
// };

Blockly.Blocks['dgpad_actions_exclusiveList'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.appendDummyInput()
      .appendField($L.blockly.actions_exclusiveList);

    this.appendValueInput("OBJ1");

    this.appendDummyInput("exclusive_mode")
      .appendField(new Blockly.FieldDropdown([
        ["activar", "true"],
        ["desactivar", "false"]
      ]), "MODE");

    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_free'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_free);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_move'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput('OBJ1')
      .appendField($L.blockly.actions_move_1);
    this.appendDummyInput()
      .appendField($L.blockly.actions_move_2)
      
    this.appendValueInput('CorX')
      //.setCheck('Number');
	this.appendValueInput('CorY')
      //.setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_animPause'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	this.appendDummyInput()
        .appendField("Pausar animaciones");
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_animStart'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	this.appendDummyInput()
        .appendField("Reanudar animaciones");
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_audio'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("ArchivoAudio")
      .appendField($L.blockly.actions_audio);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};



Blockly.Blocks['dgpad_cronometro_startstop'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        [$L.blockly.actions_cronStart, "start"],
        [$L.blockly.actions_cronStop, "stop"],
        [$L.blockly.actions_cronReset, "reset"]
      ]), "ACTION")
      .appendField("cronómetro")
      .appendField(new Blockly.FieldDropdown(this.updateDropdownOptions.bind(this)), "ID");

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(320);
    this.setTooltip("Inicia o detiene un cronómetro");
    this.setHelpUrl("");

    this.updateDropdownOptions();
  },

  updateDropdownOptions: function() {
    if (window.$U && window.$U.cronometros && Object.keys(window.$U.cronometros).length > 0) {
      const crons = window.$U.cronometros;
      const keys = Object.keys(crons);

      const counts = {};
      const options = keys.map((fullId) => {
        const parts = fullId.split("-");
        const pointName = parts[0];

        counts[pointName] = (counts[pointName] || 0) + 1;
        const number = counts[pointName];
        const label = `cronómetro ${number} ${pointName}`;
        return [label, fullId];
      });

      return options;
    } else {
      return [["(sin cronómetros)", ""]];
    }
  },

  getSelectedId: function() {
    return this.getFieldValue("ID");
  },

  getActionValue: function() {
    return this.getFieldValue("ACTION");
  }
};

Blockly.Blocks['tiempo_actual'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("tiempo actual (ms)");
    this.setOutput(true, "Number");
    this.setColour(320);
    this.setTooltip("Devuelve la hora actual en milisegundos desde 1970");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['tiempo_actual_formato_legible'] = {
  init: function() {
    this.appendValueInput("TIMESTAMP")
        .setCheck("Number")
        .appendField("formato legible de tiempo (segundos)");
    this.setOutput(true, "String");
    this.setColour(320);
    this.setTooltip("Convierte un timestamp a formato legible");
    this.setHelpUrl("");
  }
};

