Blockly.Blocks['dgpad_window_props'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [$L.blockly.turtle.windoww, "windoww"],
                [$L.blockly.turtle.windowh, "windowh"],
                [$L.blockly.turtle.centerx, "windowcx"],
                [$L.blockly.turtle.centery, "windowcy"],
                [$L.blockly.turtle.pixel, "pixel"],
                [$L.blockly.turtle.phiangle, "phi"],
                [$L.blockly.turtle.thetaangle, "theta"]
            ]), "NAME");
        this.setOutput(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
        this.count = 0;
    }
};

Blockly.Blocks['dgpad_mouse'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Object.touchpad ? $L.blockly.touch_position : $L.blockly.mouse_position);
    this.setOutput(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_distance'] = {
    init: function() {
        this.appendValueInput("FROM")
            .appendField($L.blockly.turtle.distance);
        this.appendValueInput("TO");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['dgpad_angle'] = {
    init: function() {
        this.appendValueInput("A1")
            .appendField($L.blockly.turtle.angle)
            .appendField(new Blockly.FieldDropdown([
                [$L.blockly.turtle.angle180, "a180"],
                [$L.blockly.turtle.angle360, "a360"]
            ]), "TYPE")
            .appendField(" ");
        this.appendValueInput("A2");
        this.appendValueInput("A3");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['dgpad_coordinate'] = {
    init: function() {
        this.appendDummyInput('obj_type')
            .appendField(new Blockly.FieldDropdown([
                [$L.blockly.turtle.xcoord, "0"],
                [$L.blockly.turtle.ycoord, "1"],
                [$L.blockly.turtle.zcoord, "2"]
            ]), "type");
        var t1 = Blockly.dgpad.popupArray("point");
        for (var i = 0; i < t1.length; i++) {
            t1[i][0] = $L.blockly.turtle.ofpoint + " " + t1[i][0];
        }
        var t2 = Blockly.dgpad.popupArray("vector");
        for (var i = 0; i < t2.length; i++) {
            t2[i][0] = $L.blockly.turtle.ofvector + " " + t2[i][0];
        }
        var popup = new Blockly.FieldDropdown(t1.concat(t2));

        // this.appendDummyInput()
        //     .appendField($L.blockly.turtle.ofpoint);
        this.appendDummyInput('obj_name')
            .appendField(popup, "NAME");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    },
    getName: function(_o) {
        if ((_o.getCode() === "point") || (_o.getCode() === "vector")) {
            this.setFieldValue(_o.getVarName(), "NAME")
        }
    }
};


Blockly.Blocks['dgpad_return'] = {
    init: function() {
        this.appendValueInput("NAME")
            .appendField($L.blockly.var_return);
        this.setPreviousStatement(true);
        // this.setInputsInline(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['dgpad_set_object'] = {
    init: function() {
        var types = [];
        var me = this;
        for (key in $L.blockly.o2) {
            types.push([$L.blockly.o2[key], key])
        }
        // Avoid blockly to automatically transform dropdown menu :
        types[0][0] = " " + types[0][0];
        var drop = new Blockly.FieldDropdown(types, function(option) {
            this.sourceBlock_.updateShape_(option);
        });
        this.appendDummyInput()
            .appendField($L.blockly.fixvalue);
        this.appendDummyInput('obj_type')
            .appendField(drop, "TYPE");
        this.appendDummyInput()
            .appendField(" ");
        this.appendDummyInput('obj_name')
            .appendField(Blockly.dgpad.objectPopup("expression"), "NAME");
        this.appendValueInput('obj_val')
            .appendField($L.blockly.fixvalue2);
        this.setInputsInline(true);
        // this.setOutput(true, null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');

        // Le menu déroulant des objets n'est pas le bon dans la plupart
        // des cas. Ce sparadrap règle le problème :
		// el menú desplegable de los objetos no está bien en muchos casos.
		// Esta corrección corrige el problema:
        setTimeout(function() {
            var tpe = me.getInput('obj_type').fieldRow[0].getValue();
            var nme = me.getInput('obj_name').fieldRow[0].getValue();
            var inp = me.getInputTargetBlock('obj_val');
            var cnx = (inp === null) ? null : inp.outputConnection;
            me.removeInput('obj_name');
            me.removeInput('obj_val');
            me.appendDummyInput('obj_name')
                .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
            me.appendValueInput('obj_val')
                .appendField($L.blockly.fixvalue2);
            me.getInput('obj_name').fieldRow[0].setValue(nme);
            // Connexion de l'enfant éventuel :
            if (cnx) me.getInput('obj_val').connection.connect(cnx);
        }, 0);
    },
    updateShape_: function(tpe) {
        var inp = this.getInputTargetBlock('obj_val');
        var cnx = (inp === null) ? null : inp.outputConnection;
        if (this.getInput('obj_name')) {
            this.removeInput('obj_name');
        };
        if (this.getInput('obj_val')) {
            this.removeInput('obj_val');
        };
        try {
            this.appendDummyInput('obj_name')
                .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
            this.appendValueInput('obj_val')
                .appendField($L.blockly.fixvalue2);
            // Connexion de l'enfant éventuel :
            if (cnx) this.getInput('obj_val').connection.connect(cnx);
        } catch (e) {}
    },
    getName: function(_o) {
        this.getInput('obj_type').fieldRow[0].setValue(_o.getCode());
        this.updateShape_(_o.getCode());
        this.getInput('obj_name').fieldRow[0].setValue(_o.getName());
    }
};


Blockly.dgpad_get_short = function(_v, _col) {
    return ({
        init: function() {
            this.appendDummyInput('obj_name')
                .appendField(Blockly.dgpad.objectPopup(_v), "NAME")
            this.setOutput(true, null);
            this.setColour(_col);
            this.setTooltip('');
            this.setHelpUrl('');
        },
        getName: function(_o) {
            this.setFieldValue(_o.getName(), "NAME");
        }
    });
};

Blockly.Blocks['dgpad_get_object_short'] = Blockly.dgpad_get_short("any", 20);
Blockly.Blocks['dgpad_get_point_short'] = Blockly.dgpad_get_short("point", 20);
Blockly.Blocks['dgpad_get_point_short_turtle'] = Blockly.dgpad_get_short("point", 180);


Blockly.Blocks['dgpad_get_object'] = {
    init: function() {
        var types = [];
        var me = this;
        for (key in $L.blockly.o) {
            types.push([$L.blockly.o[key], key])
        }
        // Avoid blockly to automatically transform dropdown menu :
        types[0][0] = " " + types[0][0];
        var drop = new Blockly.FieldDropdown(types, function(option) {
            this.sourceBlock_.updateShape_(option);
        });
        this.appendDummyInput()
            .appendField($L.blockly.value);
        this.appendDummyInput('obj_type')
            .appendField(drop, "TYPE");
        this.appendDummyInput()
            .appendField(" ");
        this.appendDummyInput('obj_name')
            .appendField(Blockly.dgpad.objectPopup("expression"), "NAME");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');

        // Le menu déroulant des objets n'est pas le bon dans la plupart
        // des cas. Ce sparadrap règle le problème :
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

Blockly.Blocks['dgpad_expression_input'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(" Expression")
            .appendField(new Blockly.FieldTextInput("(1+sqrt(5))/2"), "NAME");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['dgpad_pt2d'] = {
    init: function() {
        this.appendValueInput("a0")
            .setCheck(null);
        this.appendValueInput("a1")
            .setCheck(null);
        this.setOutput(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['dgpad_pt3d'] = {
    init: function() {
        this.appendValueInput("a0")
            .setCheck(null);
        this.appendValueInput("a1")
            .setCheck(null);
        this.appendValueInput("a2")
            .setCheck(null);
        this.setOutput(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};





Blockly.Blocks['dgpad_print'] = {
    init: function() {
        this.appendValueInput("NAME")
            .appendField($L.blockly.print);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [$L.blockly.withlf, "a"],
                [$L.blockly.withoutlf, "b"]
            ]), "NAME");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};



Blockly.Blocks['dgpad_inputs_value'] = {
    init: function() {
        this.appendDummyInput()
            .appendField($L.blockly.expressions_InputValue)
            .appendField(new Blockly.FieldDropdown(this.updateDropdownOptions.bind(this)), "NAME");

        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(47);
        this.setTooltip('Selecciona el valor de una casilla disponible');
        this.setHelpUrl('');

        this.listaInputs = [];
        this.listaIds = [];
        this.listaNumerados = [];
        this.updateDropdownOptions();
    },

   
    updateDropdownOptions: function() {
        if (parent.$U.inputs && Object.keys(parent.$U.inputs).length > 0) {
            let nombreInput = Object.keys(parent.$U.inputs);
            this.listaInputs = [];
            this.listaIds = [];
    
            nombreInput.forEach(nom => {
                let [input, id] = nom.split("-");
                this.listaInputs.push(input);
                this.listaIds.push(id);
            });
    
            this.listaNumerados = this.listaInputs.map((item, index) => {
                let count = this.listaInputs.slice(0, index).filter(x => x === item).length;
                return count > 0 ? `${item}_${count}` : item;
            });
    
            return this.listaNumerados.map(inputName => [inputName, inputName]);
        } else {
            return [[$L.blockly.aspect_deleteValue2, $L.blockly.aspect_deleteValue2]];
        }
    },
    

    getSelectedId: function() {
        let selectedValue = this.getFieldValue("NAME");
        let index = this.listaNumerados.indexOf(selectedValue);
        if (index !== -1) {
            return this.listaIds[index];
        } else {
            return null;
        }
    }
};

  Blockly.Blocks['dgpad_compute'] = {
    init: function() {
        this.appendDummyInput('obj_name')
            .appendField($L.blockly.expressions_compute)
            .appendField(Blockly.dgpad.objectPopup("any"), "OBJECT")
          
        
        this.setInputsInline(true);
        this.setOutput(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
    },
    
};

