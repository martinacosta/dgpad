
/**
 * BlocklyButtonObject
 * - Unifica métricas (escala) para dibujo y hit-test.
 * - Mantiene un GAP (px) entre el borde izquierdo del botón y el borde derecho del texto.
 *   => Evita superposición independiente del tamaño de fuente.
 */
function BlocklyButtonObject(_construction, _name, _display_name, _x, _y) {
  $U.extend(this, new ConstructionObject(_construction, _name));
  var me = this;
  var Cn = _construction;
  var X = _x;
  var Y = _y;
  var W = 0; // ancho del label medido en canvas
  var BTN = { x: 0, y: 0, w: 40, h: 35, mouseInside: false };
  var LABEL = _display_name;

  this.blocks.setMode(["onprogram", "oninit"], "onprogram");

  this.getAssociatedTools = function() { return "@callproperty,@dgscriptname,@blockly,@calltrash"; };
  this.getCode = function() { return "blockly_button"; };
  this.getFamilyCode = function() { return "blockly_button"; };

  me.run = function() { this.blocks.evaluate("onprogram"); };

  me.setLabel = function(_m) { LABEL = _m; };
  me.getLabel = function() { return LABEL; };

  var drawButton = function(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.stroke();
    ctx.fill();

    // triángulo "play"
    ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle;
    var d = 5;
    ctx.moveTo(x + w / d, y + h / d);
    ctx.lineTo(x + w / d, y + (d - 1) * h / d);
    ctx.lineTo(x + (d - 1) * w / d, y + h / 2);
    ctx.lineTo(x + w / d, y + h / d);
    ctx.fill();
  };

  // --- Métricas unificadas ---
  var getScale = () => this.getFontSize() * 0.05;
  var getGap = () => Math.max(8, 12 * getScale()); // por qué: asegura separación visual al escalar
  var getBtnMetrics = () => {
    var s = getScale();
    var w = BTN.w * s;
    var h = BTN.h * s;
    var x = X - w;            // botón anclado a X por su borde derecho
    var y = Y - (40 * s) / 2; // respeta offset vertical original
    return { x, y, w, h };
  };

  this.paintObject = function(ctx) {
    if (BTN.mouseInside) ctx.strokeStyle = this.getColor().getRGB();

    W = ctx.measureText(LABEL).width;

    var m = getBtnMetrics();
    BTN.x = m.x; BTN.y = m.y;

    var fs = ctx.fillStyle;
    ctx.fillStyle = ctx.strokeStyle;

    // Texto: anclado al borde izquierdo del botón menos GAP (right-aligned)
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    var GAP = getGap();
    ctx.fillText(LABEL, m.x - GAP, Y);

    ctx.strokeStyle = this.getColor().getRGB();
    ctx.lineWidth = BTN.mouseInside ? this.getSize() * 1.5 : this.getSize();
    ctx.fillStyle = fs;

    drawButton(ctx, m.x, m.y, m.w, m.h, 10);

    ctx.textBaseline = "alphabetic";
  };

  me.setXY = function(x, y) { X = x; Y = y; };

  var dragX, dragY, OldX, OldY;
  this.startDrag = function(_x, _y) { dragX = _x; dragY = _y; OldX = X; OldY = Y; };
  this.dragTo = function(_x, _y) {
    this.setXY(OldX + Math.round((_x - dragX) / 10) * 10,
               OldY + Math.round((_y - dragY) / 10) * 10);
  };

  this.compute = function() {};

  this.getSource = function(src) {
    var x = Cn.coordsSystem.x(X);
    var y = Cn.coordsSystem.y(Y);
    src.geomWrite(true, this.getName(), "BlocklyButton", $U.native2ascii(LABEL), x, y);
  };

  this.insideButton = function(ev) {
    var mx = this.mouseX(ev), my = this.mouseY(ev);
    var m = getBtnMetrics();
    return (mx >= m.x) && (mx <= m.x + m.w) && (my >= m.y) && (my <= m.y + m.h);
  };

  this.mouseInside = function(ev) {
    var mx = this.mouseX(ev), my = this.mouseY(ev);
    var m = getBtnMetrics();
    var GAP = getGap();

    // Rectángulo del texto basado en el mismo anclaje usado para pintar
    var textRight = m.x - GAP;
    var textLeft  = textRight - W;
    var textTop   = Y - this.getFontSize() / 2;
    var textBot   = Y + this.getFontSize() / 2;

    var insideText = (mx >= textLeft) && (mx <= textRight) && (my >= textTop) && (my <= textBot);

    BTN.mouseInside = this.insideButton(ev);
    return insideText || BTN.mouseInside;
  };

  this.setDefaults("blockly_button");

  // MEAG start
  this.getTextCons = function() { return ""; };
  // MEAG end
}

