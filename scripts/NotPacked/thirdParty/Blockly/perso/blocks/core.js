Blockly.Blocks['math_constant'] = {
    init: function() {
        var CONSTANTS = [
            ['\u03c0', 'PI'],
            ['e', 'E'],
            ['i', 'CPLX'],
            ['\u03c6', 'GOLDEN_RATIO'],
            ['sqrt(2)', 'SQRT2'],
            ['sqrt(\u00bd)', 'SQRT1_2'],
            ['\u221e', 'INFINITY']
        ];
        this.setHelpUrl(Blockly.Msg.MATH_CONSTANT_HELPURL);
        this.setColour(Blockly.Blocks.math.HUE);
        this.setOutput(true, 'Number');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(CONSTANTS), 'CONSTANT');
        this.setTooltip(Blockly.Msg.MATH_CONSTANT_TOOLTIP);
    }
};


Blockly.Blocks['controls_repeatuntil'] = {
    init: function() {
        this.appendStatementInput("DO")
            .setCheck(null)
            .appendField($L.blockly.do);
        this.appendValueInput("BOOL")
            .setCheck("Boolean")
            .appendField(new Blockly.FieldDropdown([
                [$L.blockly.while, "while"],
                [$L.blockly.until, "until"]
            ]), "MODE");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

// if ($U.lang() === "FR") {
//     Blockly.Msg.TEXT_PROMPT_TYPE_NUMBER = "attendre un nombre avec";
//     Blockly.Msg.TEXT_PROMPT_TYPE_TEXT = "attendre un texte avec";
// }

Blockly.Blocks['number_prompt'] = {
    /**
     * Block for prompt function (external message).
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_PROMPT_HELPURL);
        this.setColour(20);
        this.appendValueInput('TEXT')
            .appendField($L.blockly.waitfor);
        this.setOutput(true, 'Number');
    }
};

Blockly.Blocks['text_prompt'] = {
    /**
     * Block for prompt function (external message).
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_PROMPT_HELPURL);
        this.setColour(20);
        this.appendValueInput('TEXT')
            .appendField($L.blockly.waitfor2);
        this.setOutput(true, 'text');
    }
};

Blockly.Blocks['text_alert'] = {
    /**
     * Block for prompt function (external message).
     * @this Blockly.Block
     */
    init: function() {
        // this.setHelpUrl(Blockly.Msg.TEXT_PROMPT_HELPURL);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.appendValueInput('TEXT')
            .appendField($L.blockly.displayalert);
        // this.setOutput(true, 'Number');
    }
};

Blockly.Blocks['text_confirm'] = {
    /**
     * Block for prompt function (external message).
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_PROMPT_HELPURL);
        this.setColour(40);
        this.appendValueInput('TEXT')
            .appendField($L.blockly.waitfor2);
        this.setOutput(true, 'text');
    }
};



Blockly.Blocks['procedures_defnoreturn'] = {
    /**
    * Block for defining a procedure with a return value.
    * @this Blockly.Block
    */
    init: function() {
        var nameField = new Blockly.FieldTextInput(Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE,
            Blockly.Procedures.rename);
        nameField.setSpellcheck(false);
        this.appendDummyInput()
            .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_TITLE)
            .appendField(nameField, 'NAME')
            .appendField('', 'PARAMS')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField('Async:')
            .appendField(new Blockly.FieldCheckbox(true), 'ASYNC');
        this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
        if ((this.workspace.options.comments ||
             (this.workspace.options.parentWorkspace &&
              this.workspace.options.parentWorkspace.options.comments)) &&
            Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT) {
          this.setCommentText(Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT);
        }
        this.setColour(Blockly.Blocks.procedures.HUE);
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL);
        this.arguments_ = [];
        this.setStatements_(true);
        // this.statementConnection_ = null;
    },
    setStatements_: Blockly.Blocks['procedures_defreturn'].setStatements_,
    updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
    mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
    domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
    decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
    compose: Blockly.Blocks['procedures_defnoreturn'].compose,
    getProcedureDef: Blockly.Blocks['procedures_defnoreturn'].getProcedureDef,
    /**
    * Return the signature of this procedure definition.
    * @return {!Array} Tuple containing three elements:
    *     - the name of the defined procedure,
    *     - a list of all its arguments,
    *     - that it DOES have a return value.
    * @this Blockly.Block
    */
    // getProcedureDef: function() {
    //     return [this.getFieldValue('NAME'), this.arguments_, true];
    // },
    getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
    renameVar: Blockly.Blocks['procedures_defnoreturn'].renameVar,
    customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu,
    callType_: 'procedures_callnoreturn'
};


Blockly.Blocks['mostrar_tabla'] = {
    init: function() {
      this.appendValueInput("ARRAY")
          .setCheck("Array")
          .appendField("mostrar los datos de")
      this.appendDummyInput()
          .appendField("en una tabla");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Muestra el array en un modal.");
      this.setHelpUrl("");
    }
  };

  