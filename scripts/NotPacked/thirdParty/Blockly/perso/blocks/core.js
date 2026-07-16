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

// mcm_mcd_block_blockly.js

Blockly.Blocks['calcular_mcd'] = {
  init: function() {
    this.appendValueInput("NUM1")
        .setCheck("Number")
        .appendField("MCD de");
    this.appendValueInput("NUM2")
        .setCheck("Number")
        .appendField("y");
    this.setOutput(true, "Number");
    this.setColour(Blockly.Blocks.math.HUE);
    this.setTooltip("Calcula el Máximo Común Divisor de dos números.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['calcular_mcm'] = {
  init: function() {
    this.appendValueInput("NUM1")
        .setCheck("Number")
        .appendField("MCM de");
    this.appendValueInput("NUM2")
        .setCheck("Number")
        .appendField("y");
    this.setOutput(true, "Number");
    this.setColour(Blockly.Blocks.math.HUE);
    this.setTooltip("Calcula el Mínimo Común Múltiplo de dos números.");
    this.setHelpUrl("");
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



// Blockly.Blocks['text_alert'] = {
//   init: function() {
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(20);

//     this.appendValueInput('TEXT')
//       .appendField($L.blockly.displayalert);

//     // ✅ nuevo
//     this.appendDummyInput()
//       .appendField("$L.blockly.turtle.Loudspeaker")
//       .appendField(new Blockly.FieldCheckbox("FALSE"), "SPEAKER");
//   }
// };

Blockly.Blocks['text_alert'] = {
  init: function () {
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);

    // Fuerza que cada input vaya en su propia fila (TEXT arriba, checkbox abajo)
    this.setInputsInline(false);

    this.appendValueInput('TEXT')
      .appendField($L.blockly.displayalert);

    this.appendDummyInput('SPEAKER_ROW')
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField($L.blockly.turtle.Loudspeaker) 
      .appendField(new Blockly.FieldCheckbox("FALSE"), "SPEAKER");
  }
};




Blockly.Blocks['text_confirm'] = {
    init: function () {
      this.appendValueInput("MESSAGE")
          .setCheck("String")
          .appendField($L.blockly.msgconfirm1);
  
      this.appendValueInput("YES_TEXT")
          .setCheck("String")
          .appendField($L.blockly.msgconfirm2);
  
      this.appendValueInput("NO_TEXT")
          .setCheck("String")
          .appendField($L.blockly.msgconfirm3);
  
      const menu = new Blockly.FieldDropdown(Blockly.getGlobalDropdown(), function (option) {
        Blockly.globalDropdownChange(menu, option);
      });
  
      this.appendDummyInput()
          .appendField($L.blockly.msgconfirm4)
          .appendField(menu, "VAR_NAME");

      this.appendDummyInput()
      .appendField("altoparlante")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "SPEAKER");
  
      this.setInputsInline(false); // diseño vertical
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Muestra una pregunta al usuario y guarda la respuesta en una variable global.");
      this.setHelpUrl("");
    }
  };

  
// Blockly.Blocks["dgpad_tts_speaker_overlay"] = {
//     init: function () {
//       this.appendDummyInput()
//         .appendField("altoparlante (overlay)")
//         .appendField(
//           new Blockly.FieldDropdown([
//             ["crear/actualizar", "upsert"],
//             ["mostrar", "show"],
//             ["ocultar", "hide"],
//             ["borrar", "remove"],
//           ]),
//           "ACTION"
//         );

//       this.appendValueInput("TEXT")
//         .setCheck(null)
//         .appendField("texto");

//       this.appendDummyInput()
//         .appendField("idioma")
//         .appendField(
//           new Blockly.FieldDropdown([
//             ["auto", "auto"],
//             ["es-CO", "es-CO"],
//             ["es-ES", "es-ES"],
//             ["en-US", "en-US"],
//           ]),
//           "LANG"
//         );

//       this.appendDummyInput()
//         .appendField("velocidad")
//         .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), "RATE")
//         .appendField("tono")
//         .appendField(new Blockly.FieldNumber(1, 0, 2, 0.1), "PITCH")
//         .appendField("volumen")
//         .appendField(new Blockly.FieldNumber(1, 0, 1, 0.1), "VOLUME");

//       this.appendDummyInput()
//         .appendField("posición")
//         .appendField(
//           new Blockly.FieldDropdown([
//             ["arriba-derecha", "top-right"],
//             ["arriba-izquierda", "top-left"],
//             ["abajo-derecha", "bottom-right"],
//             ["abajo-izquierda", "bottom-left"],
//           ]),
//           "POS"
//         )
//         .appendField("tamaño")
//         .appendField(new Blockly.FieldNumber(56, 32, 128, 1), "SIZE");

//       this.appendDummyInput()
//         .appendField("leer al ejecutar")
//         .appendField(
//           new Blockly.FieldDropdown([
//             ["no", "no"],
//             ["sí", "yes"],
//           ]),
//           "AUTOPLAY"
//         );

//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//       this.setColour(285);
//       this.setTooltip("Crea un botón altoparlante HTML que al tocarlo lee el texto.");
//       this.setHelpUrl("");
//     },
//   };

  Blockly.Blocks['dgpad_tts_speak'] = {
  init: function() {
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);

    this.appendValueInput("TEXT")
      .setCheck("String")
      .appendField($L.blockly.speaker);

    this.appendDummyInput()
      .appendField($L.blockly.turtle.Loudspeaker1)
      .appendField(new Blockly.FieldTextInput("es-CO"), "LANG");

    this.appendDummyInput()
      .appendField($L.blockly.turtle.Loudspeaker2)
      .appendField(new Blockly.FieldNumber(1, 0.1, 3, 0.1), "RATE");

    this.setTooltip("Lee en voz alta el texto cuando se ejecuta el script.");
    this.setHelpUrl("");
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

Blockly.Blocks['await_delay'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Esperar (ms):")
            .appendField(new Blockly.FieldNumber(1000), "DELAY");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("Espera el tiempo especificado en milisegundos antes de continuar.");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['mostrar_tabla'] = {
    init: function() {
      this.appendValueInput("ARRAY")
          .setCheck("Array")
          .appendField($L.blockly.inputouputBloqueTabla1)
      this.appendDummyInput()
          .appendField($L.blockly.inputouputBloqueTabla2);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Muestra el array en un modal.");
      this.setHelpUrl("");
    }
  };


  
// Blockly: Definición del bloque "switch_case" con mutador para casos dinámicos y default opcional
// Blockly.Blocks['switch_case'] = {
//   init: function () {
//     this.appendValueInput('SWITCH')
//       .setCheck(null)
//       .appendField($L.blockly.switch1);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setMutator(new Blockly.Mutator(['case_mutator', 'default_mutator']));
//     this.caseCount_ = 3;
//     this.hasDefault_ = false;
//     this.updateShape_();
//     this.setColour(210);
//     this.setTooltip('Bloque switch con casos múltiples y default opcional');
//     this.setHelpUrl('');
//   },
//   mutationToDom: function () {
//     const container = document.createElement('mutation');
//     container.setAttribute('cases', this.caseCount_);
//     container.setAttribute('default', this.hasDefault_);
//     return container;
//   },
//   domToMutation: function (xmlElement) {
//     this.caseCount_ = parseInt(xmlElement.getAttribute('cases'), 10);
//     this.hasDefault_ = xmlElement.getAttribute('default') === 'true';
//     this.updateShape_();
//   },
//   decompose: function (workspace) {
//     const containerBlock = workspace.newBlock('case_container');
//     containerBlock.initSvg();
//     let connection = containerBlock.getInput('STACK').connection;
//     for (let i = 0; i < this.caseCount_; i++) {
//       const caseBlock = workspace.newBlock('case_mutator');
//       caseBlock.initSvg();
//       connection.connect(caseBlock.previousConnection);
//       connection = caseBlock.nextConnection;
//     }
//     if (this.hasDefault_) {
//       const defaultBlock = workspace.newBlock('default_mutator');
//       defaultBlock.initSvg();
//       connection.connect(defaultBlock.previousConnection);
//     }
//     return containerBlock;
//   },
//   compose: function (containerBlock) {
//     let clauseBlock = containerBlock.getInputTargetBlock('STACK');
//     const connections = [];
//     this.hasDefault_ = false;
//     while (clauseBlock) {
//       if (clauseBlock.type === 'case_mutator') {
//         connections.push(clauseBlock);
//       } else if (clauseBlock.type === 'default_mutator') {
//         this.hasDefault_ = true;
//       }
//       clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
//     }
//     this.caseCount_ = connections.length;
//     this.updateShape_();
//   },
//   updateShape_: function () {
//     let i = 0;
//     while (this.getInput('CASE' + i)) {
//       this.removeInput('CASE' + i);
//       this.removeInput('DO' + i);
//       i++;
//     }
//     if (this.getInput('DEFAULT')) this.removeInput('DEFAULT');

//     for (let j = 0; j < this.caseCount_; j++) {
//       this.appendValueInput('CASE' + j)
//         .setCheck(null)
//         .appendField($L.blockly.switch2);
//       this.appendStatementInput('DO' + j)
//         .setCheck(null)
//         .appendField($L.blockly.switch3);
//     }

//     if (this.hasDefault_) {
//       this.appendStatementInput('DEFAULT')
//         .setCheck(null)
//         .appendField('si no');
//     }
//   },
// };

// // Mutator container, case y default
// Blockly.Blocks['case_container'] = {
//   init: function () {
//     this.appendDummyInput().appendField($L.blockly.switch4);
//     this.appendStatementInput('STACK');
//     this.setColour(260);
//     this.setTooltip('Contenedor de casos switch');
//     this.contextMenu = false;
//   },
// };

// Blockly.Blocks['case_mutator'] = {
//   init: function () {
//     this.appendDummyInput().appendField($L.blockly.switch5);
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setColour(200);
//     this.contextMenu = false;
//   },
// };

// Blockly.Blocks['default_mutator'] = {
//   init: function () {
//     this.appendDummyInput().appendField($L.blockly.switch6);
//     this.setPreviousStatement(true);
//     this.setColour(200);
//     this.contextMenu = false;
//   },
// };
//aquí termina programación de switch-case

// switch_case.js - Definición completa del bloque Blockly tipo switch-case

Blockly.Blocks['switch_case'] = {
  init: function () {
    this.appendValueInput('SWITCH')
      .setCheck(null)
      .appendField($L.blockly.switch1);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['case_mutator', 'default_mutator']));
    this.caseCount_ = 3;
    this.hasDefault_ = false;
    this.updateShape_();
    this.setColour(210);
    this.setTooltip('Bloque switch con casos múltiples y default opcional');
    this.setHelpUrl('');
  },

  mutationToDom: function () {
    const container = document.createElement('mutation');
    container.setAttribute('cases', this.caseCount_);
    container.setAttribute('default', this.hasDefault_);
    return container;
  },

  domToMutation: function (xmlElement) {
    this.caseCount_ = parseInt(xmlElement.getAttribute('cases'), 10);
    this.hasDefault_ = xmlElement.getAttribute('default') === 'true';
    this.updateShape_();
  },

  decompose: function (workspace) {
    const containerBlock = workspace.newBlock('case_container');
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK').connection;
    for (let i = 0; i < this.caseCount_; i++) {
      const caseBlock = workspace.newBlock('case_mutator');
      caseBlock.initSvg();
      connection.connect(caseBlock.previousConnection);
      connection = caseBlock.nextConnection;
    }
    if (this.hasDefault_) {
      const defaultBlock = workspace.newBlock('default_mutator');
      defaultBlock.initSvg();
      connection.connect(defaultBlock.previousConnection);
    }
    return containerBlock;
  },

  compose: function (containerBlock) {
    let clauseBlock = containerBlock.getInputTargetBlock('STACK');
    const connections = [];
    this.hasDefault_ = false;

    const caseValueConnections = [];
    const caseDoConnections = [];
    for (let i = 0; this.getInput('CASE' + i); i++) {
      caseValueConnections[i] = this.getInput('CASE' + i).connection.targetConnection;
      caseDoConnections[i] = this.getInput('DO' + i).connection.targetConnection;
    }

    while (clauseBlock) {
      if (clauseBlock.type === 'case_mutator') {
        connections.push(clauseBlock);
      } else if (clauseBlock.type === 'default_mutator') {
        this.hasDefault_ = true;
      }
      clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
    }

    this.caseCount_ = connections.length;
    this.updateShape_();

    for (let i = 0; i < this.caseCount_; i++) {
      if (caseValueConnections[i]) {
        this.getInput('CASE' + i).connection.connect(caseValueConnections[i]);
      }
      if (caseDoConnections[i]) {
        this.getInput('DO' + i).connection.connect(caseDoConnections[i]);
      }
    }
  },

  updateShape_: function () {
    let i = 0;
    while (this.getInput('CASE' + i)) {
      this.removeInput('CASE' + i);
      this.removeInput('DO' + i);
      i++;
    }
    if (this.getInput('DEFAULT')) this.removeInput('DEFAULT');

    for (let j = 0; j < this.caseCount_; j++) {
      this.appendValueInput('CASE' + j)
        .setCheck(null)
        .appendField($L.blockly.switch2);
      this.appendStatementInput('DO' + j)
        .setCheck(null)
        .appendField($L.blockly.switch3);
    }

    if (this.hasDefault_) {
      this.appendStatementInput('DEFAULT')
        .setCheck(null)
        .appendField('si no');
    }
  },
};

Blockly.Blocks['case_container'] = {
  init: function () {
    this.appendDummyInput().appendField($L.blockly.switch4);
    this.appendStatementInput('STACK');
    this.setColour(260);
    this.setTooltip('Contenedor de casos switch');
    this.contextMenu = false;
  },
};

Blockly.Blocks['case_mutator'] = {
  init: function () {
    this.appendDummyInput().appendField($L.blockly.switch5);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(200);
    this.contextMenu = false;
  },
};

Blockly.Blocks['default_mutator'] = {
  init: function () {
    this.appendDummyInput().appendField($L.blockly.switch6);
    this.setPreviousStatement(true);
    this.setColour(200);
    this.contextMenu = false;
  },
};

  