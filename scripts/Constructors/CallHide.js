/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * Herramienta de menú contextual para ocultar/mostrar
 */

function CallHide() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "callhide";
    };

    // MEAG obtener el valor de _title
    this.getTitle = function() {
      return $L.tool_title_callhide;
    };

    // Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
    this.getType = function() {
        return 1;
    };

    this.isAcceptedInitial = function(o) {
        return true;
    };

    this.isInstantTool = function() {
        return true;
    };

    // this.createObj = function(zc, ev) {
    //     this.getC(0).setHidden(1);
    // };
    this.createObj = function(zc, ev) {
        const obj = this.getC(0);
        if (!obj || obj.isSuperHidden()) return;

        // Si ya estaba oculto, no registres nada
        if (obj.isHidden()) return;

        // Obtener el canvas real (ajusta si zc no es el canvas en tu app)
        const canvas = zc?.canvas || zc?.getCanvas?.() || zc;
        const um = canvas?.undoManager;

        if (um && !um.isApplying && typeof um.recordVisibility === "function") {
            um.recordVisibility(obj, true); // old: visible -> new: hidden
        }

        obj.setHidden(1);
        };

    this.selectCreatePoint = function(zc, ev) {};

    this.preview = function(ev, zc) {};


}
