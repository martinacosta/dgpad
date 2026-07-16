/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// function CallTrash() {
//     $U.extend(this, new ObjectConstructor()); //Héritage

//     this.getCode = function() {
//         return "calltrash";
//     };

//     // MEAG obtener el valor de _title
//     this.getTitle = function() {
//       return $L.tool_title_calltrash;
//     };

//     // Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
//     this.getType = function() {
//         return 1;
//     };

//     this.isAcceptedInitial = function(o) {
//         return true;
//     };

//     this.isInstantTool = function() {
//         return true;
//     };

//     this.createObj = function(zc, ev) {
//         zc.undoManager.deleteObjs(zc.getConstruction().safelyDelete(this.getC(0)));
//         // ✅ refrescar inmediatamente el estado de indicado/seleccionado
//         zc.getConstruction().validate(ev);
//         zc.getConstruction().computeAll();
//         zc.getCanvas().paint(ev);
//     };

//     this.selectCreatePoint = function(zc, ev) {};

//     this.preview = function(ev, zc) {};


// }

function CallTrash() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "calltrash";
    };

    this.getTitle = function() {
      return $L.tool_title_calltrash;
    };

    this.getType = function() {
        return 1;
    };

    this.isAcceptedInitial = function(o) {
        return true;
    };

    this.isInstantTool = function() {
        return true;
    };

    this.createObj = function(zc, ev) {
        var DEBUG = (typeof window !== "undefined") && !!window.DGPAD_UNDO_DEBUG;
        var dbg = function() {
            if (!DEBUG || typeof console === "undefined") return;
            try {
                var args = Array.prototype.slice.call(arguments);
                args.unshift("[CallTrash]");
                console.log.apply(console, args);
            } catch (e) {}
        };

        var target = this.getC(0);
        dbg("trash:target", target);

        var deleted;
        try {
            deleted = zc.getConstruction().safelyDelete(target);
            dbg("trash:safelyDelete:return", deleted);
        } catch (e) {
            dbg("trash:safelyDelete:error", e);
            throw e;
        }

        try {
            zc.undoManager.deleteObjs(deleted);
            if (zc.undoManager && zc.undoManager.debugDump) zc.undoManager.debugDump();
        } catch (e) {
            dbg("trash:undoManager.deleteObjs:error", e);
            throw e;
        }
    };

    this.selectCreatePoint = function(zc, ev) {};

    this.preview = function(ev, zc) {};
}
