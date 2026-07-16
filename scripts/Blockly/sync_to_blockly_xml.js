// syncToBlocklyXML.js + bloqueador visual con coordenadas auto

const blockRegistry = {};

function genId() {
  return Math.random().toString(36).substring(2, 10);
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function parseArguments(str) {
  const result = [];
  let balance = 0, current = '', inStr = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '"') inStr = !inStr;
    if (!inStr) {
      if (ch === '(') balance++;
      if (ch === ')') balance--;
      if (ch === ',' && balance === 0) {
        result.push(current.trim());
        current = '';
        continue;
      }
    }
    current += ch;
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

let YOFFSET = 0;
function nextY(step = 60) {
  const y = YOFFSET;
  YOFFSET += step;
  return y;
}

function parseExpression(expr) {
  expr = expr.trim();
  if (/^[-+]?\d+(\.\d+)?$/.test(expr)) {
    return `<block type="math_number" id="${genId()}"><field name="NUM">${expr}</field></block>`;
  }
  if (/^"[^"]*"$/.test(expr)) {
    const val = expr.slice(1, -1);
    return `<block type="dgpad_get_point_short" id="${genId()}"><field name="NAME">${val}</field></block>`;
  }
  const match = expr.match(/^(\w+(?:\.\w+)*)\((.*)\)$/);
  if (!match) throw new Error(`Expresión inválida: ${expr}`);
  const [_, funcName, argStr] = match;
  const args = parseArguments(argStr);
  const parts = funcName.split('.');
  if (parts.length === 2 && blockRegistry[parts[0]]?.[parts[1]]) {
    const block = blockRegistry[parts[0]][parts[1]];
    const a = parseExpression(args[0]);
    const b = parseExpression(args[1]);
    return `
<block type="${block.type}" id="${genId()}" x="10" y="${nextY()}">
  <field name="OP">${block.op}</field>
  <value name="A">${a}</value>
  <value name="B">${b}</value>
</block>
    `.trim();
  }
  const def = blockRegistry[funcName];
  if (!def) throw new Error(`Bloque no registrado: ${funcName}`);
  const fields = def.args.map((type, i) => {
    const arg = args[i];
    if (type === "point") {
      return `<field name="NAME">${arg.slice(1, -1)}</field>`;
    }
    if (type === "axis") {
      return `<field name="type">${arg}</field>`;
    }
    return '';
  }).join('\n');
  return `<block type="${def.type}" id="${genId()}" x="10" y="${nextY()}">${fields}</block>`;
}

function syncToBlocklyXML(sync) {
  YOFFSET = 20;
  const match = sync.trim().match(/^([\w\.]+)\((.*)\);?$/);
  if (!match) throw new Error("sync inválido");
  const funcName = match[1];
  const args = parseArguments(match[2]);
  const def = blockRegistry[funcName];
  if (!def) throw new Error(`Función raíz no reconocida: ${funcName}`);
  const objBlock = `<block type="dgpad_get_point_short" id="${genId()}" x="10" y="${nextY()}"><field name="NAME">${args[0].slice(1, -1)}</field></block>`;
  const xBlock = parseExpression(args[1]);
  const yBlock = parseExpression(args[2]);
  return `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="${def.type}" id="${genId()}" x="20" y="${nextY()}">
    <value name="OBJ1">${objBlock}</value>
    <value name="CorX">
      <shadow type="math_number" id="${genId()}"><field name="NUM">0</field></shadow>
      ${xBlock}
    </value>
    <value name="CorY">
      <shadow type="math_number" id="${genId()}"><field name="NUM">0</field></shadow>
      ${yBlock}
    </value>
  </block>
</xml>
  `.trim();
}
