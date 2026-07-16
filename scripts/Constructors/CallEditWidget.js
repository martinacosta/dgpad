function CallEditWidget() {
    $U.extend(this, new ObjectConstructor());
  
    this.getCode = function() {
        return "calleditw";
      };
  
    this.getTitle = () => $L.tool_title_editwidget || "Editar widget";
  
    this.getType = () => 1;
  
    this.isAcceptedInitial = function(obj) {
      return obj.getCode() === "expression";
    };
  
    this.isInstantTool = () => true;
  
    this.createObj = function(zc, ev) {
      const obj = this.getC(0);
      if (obj && obj.getCode() === "expression") {
        const x = obj.getX();
        const y = obj.getY();
        const name = obj.getName();
        const widget = zc.addText(
          `<textarea id="exp_edit" target="${name}" style="width:500px;height:400px"></textarea>`,
          x, y, 550, 430,
          "c:rgba(59,79,115,0.18);s:3;r:15;p:4"
        );
        widget.refreshInputs?.(); // por si está disponible, actualiza input binding
      }
    };
  
    this.selectCreatePoint = function(zc, ev) {};
    this.preview = function(ev, zc) {};
  }
  
  