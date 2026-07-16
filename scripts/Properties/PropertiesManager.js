/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function PropertiesManager(_canvas) {
    var me = this;
    var canvas = _canvas;

    var propsPanel = null;
    // ✅ estado del panel: último objeto editado/mostrado
    var currentObj = null;


    // On a cliqué sur l'icône Properties :
    me.showPanel = function() {
        if (!propsPanel) {
            propsPanel = new PropertiesPanel(canvas);
        }
    };

    me.hidePanel = function() {
        if (propsPanel) {
            propsPanel.close();
            propsPanel = null;
            me.clearEditMode();
        }
    };

    me.clearEditMode = function() {
        var Cn = canvas.getConstruction();
        var v = Cn.elements();
        for (var i = 0, len = v.length; i < len; i++) {
            v[i].setEditMode(0);
        }
    };

    me.edit = function(_obj) {
        me.clearEditMode();
        if (propsPanel) {
            _obj.setEditMode(1);
            propsPanel.showProperties(_obj);
        }

    };

    /**
         * Rehidrata el panel con los valores actuales tras Undo/Redo.
         * Úsalo después de restaurar el estado del objeto/construcción.
         */
        me.refresh = function(_obj) {
            
            if (!propsPanel) return;

            if (_obj) currentObj = _obj;

            // Preferimos el último objeto conocido
            if (currentObj) {
                propsPanel.showProperties(currentObj);
                return;
            }

            // Fallback: intenta encontrar el objeto en editMode=1
            var Cn = canvas.getConstruction();
            var v = Cn.elements();
            for (var i = 0, len = v.length; i < len; i++) {
                var o = v[i];
                if (o && typeof o.getEditMode === "function" && o.getEditMode() === 1) {
                    me.currentObj = o;
                    propsPanel.showProperties(o);
                    return;
                }
            }
        
    };

};
