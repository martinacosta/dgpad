

Blockly.JavaScript['controls_for'] = function(block) {
    var variable0 = "blockly_var_" + Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var increment = Blockly.JavaScript.valueToCode(block, 'BY',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
    // console.log(branch);
    var code = "for (var " + variable0 + " = " + argument0 + " ; " + variable0 + " <= " + argument1 + " ; " + variable0 + " = " + variable0 + " + " + increment + "){\n";
    code += branch;
    code += "};\n";
    return code;
};


Blockly.JavaScript['controls_repeat_ext'] = function(block) {
    // Repeat n times.
    if (block.getField('TIMES')) {
        // Internal number.
        var repeats = String(Number(block.getFieldValue('TIMES')));
    } else {
        // External number.
        var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
            Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    }
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
    var loopVar = 'blockly_var_' + Blockly.JavaScript.variableDB_.getDistinctName(
        'count', Blockly.Variables.NAME_TYPE);

    var code = "for (var " + loopVar + " = 1 ; " + loopVar + " <= " + repeats + " ; " + loopVar + "++){\n";
    code += branch;
    code += "};\n";
    return code;
};

Blockly.JavaScript['controls_repeat'] =
    Blockly.JavaScript['controls_repeat_ext'];

Blockly.JavaScript['controls_whileUntil'] = function(block) {
    // Do while/until loop.
    var until = block.getFieldValue('MODE') == 'UNTIL';
    var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
        until ? Blockly.JavaScript.ORDER_LOGICAL_NOT : Blockly.JavaScript.ORDER_NONE);
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    if ((branch === "") || (argument0 === "")) return "";
    branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
    if (until) {
        argument0 = '!' + argument0;
    }
    return 'while (' + argument0 + ') {\n' + branch + '}\n';
};


Blockly.JavaScript['controls_repeatuntil'] = function(block) {
    var until = block.getFieldValue('MODE') == 'until';
    var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
        until ? Blockly.JavaScript.ORDER_LOGICAL_NOT : Blockly.JavaScript.ORDER_NONE);
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    if ((branch === "") || (argument0 === "")) return "";
    if (until) {
        argument0 = '!' + argument0;
    }
    return 'do {\n' + branch + '} while (' + argument0 + ')\n';
};


Blockly.JavaScript['math_arithmetic'] = function(block) {
    // Basic arithmetic operators, and power.
    var OPERATORS = {
        'ADD': ['Math.plus', Blockly.JavaScript.ORDER_ADDITION],
        'MINUS': ['Math.minus', Blockly.JavaScript.ORDER_SUBTRACTION],
        'MULTIPLY': ['Math.times', Blockly.JavaScript.ORDER_MULTIPLICATION],
        'DIVIDE': ['Math.quotient', Blockly.JavaScript.ORDER_DIVISION],
        'POWER': ['Math.power', Blockly.JavaScript.ORDER_COMMA] // Handle power separately.
    };
    var tuple = OPERATORS[block.getFieldValue('OP')];
    var operator = tuple[0];
    var order = tuple[1];
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
    var code = operator + "(" + argument0 + "," + argument1 + ")";
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['math_random_int'] = function(block) {
    // Random integer between [X] and [Y].
    var a0 = Blockly.JavaScript.valueToCode(block, 'FROM',
        Blockly.JavaScript.ORDER_COMMA) || '0';
    var b0 = Blockly.JavaScript.valueToCode(block, 'TO',
        Blockly.JavaScript.ORDER_COMMA) || '0';
    var code = 'Math.floor(Math.random()*(Math.abs(' + a0 + '-' + b0 + ')+1)+(' + a0 + '+' + b0 + '-Math.abs(' + a0 + '-' + b0 + '))/2)';
    
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['calcular_mcd'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'NUM1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'NUM2', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `(function mcd(a, b) { while (b !== 0) { [a, b] = [b, a % b]; } return Math.abs(a); })(${value_num1}, ${value_num2})`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['calcular_mcm'] = function(block) {
  var value_num1 = Blockly.JavaScript.valueToCode(block, 'NUM1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_num2 = Blockly.JavaScript.valueToCode(block, 'NUM2', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `(function mcm(a, b) { if (a === 0 || b === 0) return 0; return Math.abs(a * b) / (function mcd(x, y) { while (y !== 0) { [x, y] = [y, x % y]; } return Math.abs(x); })(a, b); })(${value_num1}, ${value_num2})`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['variables_get'] = function(block) {
    // Variable getter.
    var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    code = "blockly_var_" + code;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['variables_set'] = function(block) {
    // Variable setter.
    var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    // console.log('blockly_var_' + varName + ' = ' + argument0 + ';\n');
    return 'blockly_var_' + varName + ' = ' + argument0 + ';\n';
    // return varName + ' = ' + argument0 + ';\n';
};


// Incrémentation :
Blockly.JavaScript['math_change'] = function(block) {
    // Add to a variable in place.
    var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
        Blockly.JavaScript.ORDER_ADDITION) || '0';
    var varName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    return 'blockly_var_' + varName + ' = ' + 'blockly_var_' + varName + ' + ' + argument0 + ';\n';
};





Blockly.JavaScript['math_constant'] = function(block) {
    // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
    var CONSTANTS = {
        'PI': ['Math.PI', Blockly.JavaScript.ORDER_MEMBER],
        'E': ['Math.E', Blockly.JavaScript.ORDER_MEMBER],
        'CPLX': ['[0,1]', Blockly.JavaScript.ORDER_MEMBER],
        'GOLDEN_RATIO': ['(1 + Math.sqrt(5)) / 2', Blockly.JavaScript.ORDER_DIVISION],
        'SQRT2': ['Math.SQRT2', Blockly.JavaScript.ORDER_MEMBER],
        'SQRT1_2': ['Math.SQRT1_2', Blockly.JavaScript.ORDER_MEMBER],
        'INFINITY': ['Infinity', Blockly.JavaScript.ORDER_ATOMIC]
    };
    return CONSTANTS[block.getFieldValue('CONSTANT')];
};

Blockly.JavaScript['math_single'] = function(block) {
    // Math operators with single operand.
    var operator = block.getFieldValue('OP');
    var code;
    var arg;
    if (operator == 'NEG') {
        // Negation is a special case given its different operator precedence.
        arg = Blockly.JavaScript.valueToCode(block, 'NUM',
            Blockly.JavaScript.ORDER_UNARY_NEGATION) || '0';
        if (arg[0] == '-') {
            // --3 is not legal in JS.
            arg = ' ' + arg;
        }
        code = '-' + arg;
        return [code, Blockly.JavaScript.ORDER_UNARY_NEGATION];
    }
    if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
        arg = Blockly.JavaScript.valueToCode(block, 'NUM',
            Blockly.JavaScript.ORDER_DIVISION) || '0';
    } else {
        arg = Blockly.JavaScript.valueToCode(block, 'NUM',
            Blockly.JavaScript.ORDER_NONE) || '0';
    }
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
        case 'ABS':
            code = 'Math.abs(' + arg + ')';
            break;
        case 'ROOT':
            code = 'Math.sqrt(' + arg + ')';
            break;
        case 'LN':
            code = 'Math.log(' + arg + ')';
            break;
        case 'EXP':
            code = 'Math.exp(' + arg + ')';
            break;
        case 'POW10':
            code = 'Math.pow(10,' + arg + ')';
            break;
        case 'ROUND':
            code = 'Math.round(' + arg + ')';
            break;
        case 'ROUNDUP':
            code = 'Math.ceil(' + arg + ')';
            break;
        case 'ROUNDDOWN':
            code = 'Math.floor(' + arg + ')';
            break;
        case 'SIN':
            code = 'Math.sin(' + arg + ')';
            break;
        case 'COS':
            code = 'Math.cos(' + arg + ')';
            break;
        case 'TAN':
            code = 'Math.tan(' + arg + ')';
            break;
    }
    if (code) {
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }
    // Second, handle cases which generate values that may need parentheses
    // wrapping the code.
    switch (operator) {
        case 'LOG10':
            code = 'Math.log(' + arg + ') / Math.log(10)';
            break;
        case 'ASIN':
            code = 'Math.asin(' + arg + ')';
            break;
        case 'ACOS':
            code = 'Math.acos(' + arg + ')';
            break;
        case 'ATAN':
            code = 'Math.atan(' + arg + ')';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    return [code, Blockly.JavaScript.ORDER_DIVISION];
};

// Rounding functions have a single operand.
Blockly.JavaScript['math_round'] = Blockly.JavaScript['math_single'];
// Trigonometry functions have a single operand.
Blockly.JavaScript['math_trig'] = Blockly.JavaScript['math_single'];

Blockly.JavaScript['procedures_defreturn'] = function(block) {
    // Define a procedure with a return value.
    var funcName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
        branch = Blockly.JavaScript.prefixLines(
            Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
                '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
    }
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
        branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
            '\'' + block.id + '\'') + branch;
    }
    var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
        Blockly.JavaScript.ORDER_NONE) || '';
    if (returnValue) {
        returnValue = '  return ' + returnValue + ';\n';
    }
    var args = [];
    for (var x = 0; x < block.arguments_.length; x++) {
        args.push(Blockly.JavaScript.variableDB_.getName(block.arguments_[x],
            Blockly.Variables.NAME_TYPE));
        var re = new RegExp("blockly_var_" + args[x] + "([^\\w]+)", "g");
        branch = branch.replace(re, "blockly_local_" + args[x] + "$1");
        if (returnValue) returnValue = returnValue.replace(re, "blockly_local_" + args[x] + "$1");
        args[x] = "blockly_local_" + args[x];
    }

    // Recherche dans le corps de la fonction de toutes les variables
    // susceptibles d'être locale. Une première affectation "myvar = 2"
    // sera ainsi remplacée par "var myvar = 2" :
    var rg = new RegExp("(^\\s*)(blockly_var_\\w+)(\\s*=\\s*)", "gm");
    var m;
    var myvars = [];
    while ((m = rg.exec(branch)) !== null) {
        if ((re) && (m.index === re.lastIndex)) {
            re.lastIndex++;
        }
        if (myvars.indexOf(m[2]) === -1) {
            myvars.push(m[2]);
        }
    }
    for (var i = 0; i < myvars.length; i++) {
        var reg = new RegExp("(^\\s*)(" + myvars[i] + ")(\\s*=\\s*)", "m");
        branch = branch.replace(reg, "$1 var $2$3");
    }
    var code = '';
    if (block.getFieldValue('ASYNC') === "TRUE") {
        code += 'async ';
    }
    code = code + 'function ' + funcName + '(' + args.join(',') + ') {\n' + branch + returnValue + '}';
    code = Blockly.JavaScript.scrub_(block, code);
    Blockly.JavaScript.definitions_[funcName] = code;
    return null;
};

Blockly.JavaScript['await_delay'] = function(block) {
    var delay = block.getFieldValue('DELAY');
    var code = `await new Promise(resolve => setTimeout(resolve, ${delay}));\n`;
    return code;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.JavaScript['procedures_defnoreturn'] =
    Blockly.JavaScript['procedures_defreturn'];

Blockly.JavaScript['number_prompt'] = function(block) {
    var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    var code = 'window.prompt(' + msg + ')';
    // code = 'parseFloat($L.number2(' + code + '))';
    
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['text_prompt'] = function(block) {
    var msg = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';
    var code = 'window.prompt(' + msg + ')';
    
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};






Blockly.JavaScript['text_alert'] = function(block) {
  var msg = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || "''";

  var font = "Arial";
  var fontSize = "16";
  var fontStyle = "normal";
  var fontAlign = "center";

  var previousBlock = block.previousConnection && block.previousConnection.targetBlock();
  if (previousBlock && previousBlock.type === "turtle_font") {
    font = previousBlock.getFieldValue('FONT') || "Arial";
    fontSize = Blockly.JavaScript.valueToCode(previousBlock, 'FONTSIZE', Blockly.JavaScript.ORDER_ATOMIC) || "16";
    fontStyle = previousBlock.getFieldValue('FONTSTYLE') || "normal";
    fontAlign = previousBlock.getFieldValue('FONTALIGN') || "center";
  }

  const speakerEnabled = block.getFieldValue("SPEAKER") === "TRUE";

  const code = `
    alertModal({
      text: (${msg}),
      font: "${font}",
      size: "${fontSize}",
      style: "${fontStyle}",
      align: "${fontAlign}",
      speaker: ${speakerEnabled ? "true" : "false"} // ✅ nuevo
    });
  `;
  return code;
};

  

  

// Blockly.JavaScript['text_confirm'] = function (block) {
//   const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '"¿Estás seguro?"';
//   const yes = Blockly.JavaScript.valueToCode(block, 'YES_TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '"Sí"';
//   const no = Blockly.JavaScript.valueToCode(block, 'NO_TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '"No"';
//   const varName = block.getFieldValue('VAR_NAME') || 'elemento';

//   const speakerEnabled = block.getFieldValue("SPEAKER") === "TRUE"; // ✅ nuevo

//   let font = '"Arial"', size = '"16"', style = '"normal"', align = '"center"';
//   const prevBlock = block.previousConnection?.targetBlock?.() || (block.previousConnection && block.previousConnection.targetBlock && block.previousConnection.targetBlock());
//   if (prevBlock && prevBlock.type === 'turtle_font') {
//     font = `"${prevBlock.getFieldValue('FONT') || 'Arial'}"`;
//     size = Blockly.JavaScript.valueToCode(prevBlock, 'FONTSIZE', Blockly.JavaScript.ORDER_ATOMIC) || '"16"';
//     style = `"${prevBlock.getFieldValue('FONTSTYLE') || 'normal'}"`;
//     align = `"${prevBlock.getFieldValue('FONTALIGN') || 'center'}"`;
//   }

//   return `
//     parent.postMessage({
//       action: "dgpad-confirm",
//       content: {
//         message: ${message},
//         yes: ${yes},
//         no: ${no},
//         font: ${font},
//         size: ${size},
//         style: ${style},
//         align: ${align},
//         speaker: ${speakerEnabled ? "true" : "false"}, // ✅ nuevo
//         varName: "${varName}"
//       }
//     }, "*");
//   `;
// };

Blockly.JavaScript['text_confirm'] = function (block) {
  const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '"Estas seguro?"';
  const yes = Blockly.JavaScript.valueToCode(block, 'YES_TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '"Si"';
  const no = Blockly.JavaScript.valueToCode(block, 'NO_TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '"No"';
  const varName = block.getFieldValue('VAR_NAME') || 'elemento';
  const speakerEnabled = block.getFieldValue("SPEAKER") === "TRUE";

  let font = '"Arial"', size = '"16"', style = '"normal"', align = '"center"';
  const prevBlock = block.previousConnection?.targetBlock?.() || (block.previousConnection && block.previousConnection.targetBlock && block.previousConnection.targetBlock());
  if (prevBlock && prevBlock.type === 'turtle_font') {
    font = `"${prevBlock.getFieldValue('FONT') || 'Arial'}"`;
    size = Blockly.JavaScript.valueToCode(prevBlock, 'FONTSIZE', Blockly.JavaScript.ORDER_ATOMIC) || '"16"';
    style = `"${prevBlock.getFieldValue('FONTSTYLE') || 'normal'}"`;
    align = `"${prevBlock.getFieldValue('FONTALIGN') || 'center'}"`;
  }

  return `
    var __dg_confirm_res__ = await CONFIRM(${message}, 350, 165, ${font}, ${size}, ${style}, ${align}, ${yes}, ${no}, ${speakerEnabled ? "true" : "false"});
    GLOBAL_SET("${varName}", __dg_confirm_res__);
  `;
};


// Inyecta runtime global para insertar un botón 🔊 en el modal visible
Blockly.JavaScript.definitions_ = Blockly.JavaScript.definitions_ || Object.create(null);

Blockly.JavaScript.definitions_["__dgpad_tts_modal_runtime__"] = `
(function(){
  if (window.__dgpadTTS_modal_inited) return;
  window.__dgpadTTS_modal_inited = true;

  function supported(){
    return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  }

  function normalizeText(t){
    return String(t == null ? "" : t).replace(/\\s+/g, " ").trim();
  }

  function findActiveDialog(){
    const selectors = [
      '[role="dialog"]',
      '.modal.show', '.modal[style*="display"]',
      '.swal2-popup', '.swal2-container',
      '.ui-dialog',
      '[data-dgpad-modal]', '[data-modal-root]'
    ];
    const els = [];
    selectors.forEach(s => els.push(...document.querySelectorAll(s)));

    const visibles = els.filter(el => {
      if (!el || !el.getBoundingClientRect) return false;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      const st = getComputedStyle(el);
      return st.display !== "none" && st.visibility !== "hidden" && st.opacity !== "0";
    });

    return visibles.length ? visibles[visibles.length - 1] : null;
  }

  function ensureFooter(dialog){
    let footer =
      dialog.querySelector('[data-modal-footer]') ||
      dialog.querySelector('.modal-footer') ||
      dialog.querySelector('.swal2-actions') ||
      dialog.querySelector('.ui-dialog-buttonpane') ||
      dialog.querySelector('footer');

    if (footer) return footer;

    footer = document.createElement("div");
    footer.setAttribute("data-dgpad-tts-footer", "true");
    footer.style.display = "flex";
    footer.style.justifyContent = "flex-end";
    footer.style.gap = "8px";
    footer.style.marginTop = "12px";
    dialog.appendChild(footer);
    return footer;
  }

  function buildButton(){
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("data-dgpad-tts-btn", "true");
    b.setAttribute("aria-label", "Leer en voz alta");
    b.title = "Leer en voz alta";
    b.style.border = "0";
    b.style.cursor = "pointer";
    b.style.padding = "6px 10px";
    b.style.borderRadius = "10px";
    b.style.background = "rgba(255,255,255,.9)";
    b.style.boxShadow = "0 4px 14px rgba(0,0,0,.12)";
    b.style.display = "inline-flex";
    b.style.alignItems = "center";
    b.style.gap = "8px";
    b.innerHTML = '<span data-i style="font-size:18px">🔊</span><span data-l style="font-size:13px">Escuchar</span>';
    return b;
  }

  function toggleSpeak(state, text, opts){
    if (!supported()) return;
    text = normalizeText(text);
    if (!text) return;

    if (state.speaking) {
      speechSynthesis.cancel();
      state.speaking = false;
      state.onState(false);
      return;
    }

    const u = new SpeechSynthesisUtterance(text);
    opts = opts || {};
    u.lang = opts.lang || "es-CO";
    u.rate = Number(opts.rate || 1);
    u.pitch = Number(opts.pitch || 1);
    u.volume = Number(opts.volume || 1);

    u.onend = () => { state.speaking = false; state.onState(false); };
    u.onerror = () => { state.speaking = false; state.onState(false); };

    speechSynthesis.cancel();
    state.speaking = true;
    state.onState(true);
    speechSynthesis.speak(u);
  }

  window.__dgpadTTS_modal_upsertButton = function(cfg){
    cfg = cfg || {};
    const text = cfg.text;
    const opts = cfg.opts || { lang:"es-CO", rate:1, pitch:1, volume:1 };

    if (!supported()) return false;

    const dialog = findActiveDialog();
    if (!dialog) return false;

    const footer = ensureFooter(dialog);

    let btn = footer.querySelector('[data-dgpad-tts-btn="true"]');
    if (!btn) {
      btn = buildButton();
      footer.appendChild(btn);
    }

    const icon = btn.querySelector("[data-i]");
    const label = btn.querySelector("[data-l]");

    const state = { speaking:false, onState:(s)=> {
      if (icon) icon.textContent = s ? "⏹️" : "🔊";
      if (label) label.textContent = s ? "Detener" : "Escuchar";
    }};

    state.onState(false);

    btn.onclick = (ev) => {
      ev.preventDefault();
      toggleSpeak(state, text, opts);
    };

    return true;
  };
})();`.trim();








Blockly.JavaScript['dgpad_tts_speak'] = function(block) {
  const text =
    Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_ATOMIC) || "''";

  const lang = block.getFieldValue("LANG") || "es-CO";
  const rate = Number(block.getFieldValue("RATE") || 1);

  return `
    parent.postMessage({
      action: "dgpad-tts-speak",
      content: {
        text: (${text}),
        lang: "${lang}",
        rate: ${rate},
        pitch: 1,
        volume: 1
      }
    }, "*");
  `;
};




    

Blockly.JavaScript['async_function'] = function(block) {
    // Define a procedure with a return value.
    var funcName = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);

    var branch = Blockly.JavaScript.statementToCode(block, 'STACK');

    if (Blockly.JavaScript.STATEMENT_PREFIX) {
        branch = Blockly.JavaScript.prefixLines(
            Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
                '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
    }
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
        branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
            '\'' + block.id + '\'') + branch;
    }
    var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
        Blockly.JavaScript.ORDER_NONE) || '';
    if (returnValue) {
        returnValue = '  return ' + returnValue + ';\n';
    }
    var args = [];
    for (var x = 0; x < block.arguments_.length; x++) {
        args.push(Blockly.JavaScript.variableDB_.getName(block.arguments_[x],
            Blockly.Variables.NAME_TYPE));
        var re = new RegExp("blockly_var_" + args[x] + "([^\\w]+)", "g");
        branch = branch.replace(re, "blockly_local_" + args[x] + "$1");
        if (returnValue) returnValue = returnValue.replace(re, "blockly_local_" + args[x] + "$1");
        args[x] = "blockly_local_" + args[x];
    }

    // Recherche dans le corps de la fonction de toutes les variables
    // susceptibles d'être locale. Une première affectation "myvar = 2"
    // sera ainsi remplacée par "var myvar = 2" :
    var rg = new RegExp("(^\\s*)(blockly_var_\\w+)(\\s*=\\s*)", "gm");
    var m;
    var myvars = [];
    while ((m = rg.exec(branch)) !== null) {
        if ((re) && (m.index === re.lastIndex)) {
            re.lastIndex++;
        }
        if (myvars.indexOf(m[2]) === -1) {
            myvars.push(m[2]);
        }
    }
    for (var i = 0; i < myvars.length; i++) {
        var reg = new RegExp("(^\\s*)(" + myvars[i] + ")(\\s*=\\s*)", "m");
        branch = branch.replace(reg, "$1 var $2$3");
    }


    var code = 'async function ' + funcName + '(' + args.join(',') + ') {\n' + branch + returnValue + '}';
    code = Blockly.JavaScript.scrub_(block, code);

    

    Blockly.JavaScript.definitions_[funcName] = code;
    return null;
};

Blockly.JavaScript['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  var functionName = Blockly.JavaScript.provideFunction_(
      'listsRepeat',
      ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
          '(blockly_local_value, blockly_local_n) {',
       '  var blockly_var_array = [];',
       '  for (var blockly_var_i = 0; blockly_var_i < blockly_local_n; blockly_var_i++) {',
       '    blockly_var_array[blockly_var_i] = blockly_local_value;',
       '  }',
       '  return blockly_var_array;',
       '}']);
  var element = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_COMMA) || 'null';
  var repeatCount = Blockly.JavaScript.valueToCode(block, 'NUM',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var code = functionName + '(' + element + ', ' + repeatCount + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


  
  Blockly.JavaScript['mostrar_tabla'] = function(block) {
    var arrayName = Blockly.JavaScript.valueToCode(block, 'ARRAY', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `mostrarTablaDatos(${arrayName});`;
    
    return code;
  };
  

// Blockly: Generador JavaScript para "switch_case" con mutador
Blockly.JavaScript['switch_case'] = function (block) {
  const switchValue = Blockly.JavaScript.valueToCode(block, 'SWITCH', Blockly.JavaScript.ORDER_NONE) || '0';
  let code = `switch (${switchValue}) {\n`;
  for (let i = 0; i < block.caseCount_; i++) {
    const caseVal = Blockly.JavaScript.valueToCode(block, 'CASE' + i, Blockly.JavaScript.ORDER_NONE) || '0';
    const caseDo = Blockly.JavaScript.statementToCode(block, 'DO' + i);
    code += `  case ${caseVal}:\n${caseDo}    break;\n`;
  }
  if (block.hasDefault_) {
    const defaultDo = Blockly.JavaScript.statementToCode(block, 'DEFAULT');
    code += `  default:\n${defaultDo}    break;\n`;
  }
  code += '}\n';
  return code;
};