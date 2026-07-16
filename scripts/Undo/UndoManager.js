// UndoManager.js - versión extendida con acciones MODIFY

function UndoManager(_canvas) {
    const canvas = _canvas;
    const Cn = canvas.getConstruction();
    const actions = [];
    let cursor = 0;
    const me = this;
    this.isApplying = false; //para no registrar cambios al deshacer

    const ADD = 'ADD', REMOVE = 'REMOVE', MODIFY = 'MODIFY', VISIBILITY = 'VISIBILITY';

    let Cmarker = null, Tmarker = null;

    const refreshCanvas = () => {
        
        const simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent("mouseup", true, true, window, 1, -100, -100, -100, -100, false,
            false, false, false, 0, null);
        Cn.validate(simulatedEvent);
        Cn.computeAll();
        canvas.paint(simulatedEvent);
        if (typeof canvas.propertiesPanel?.refreshValues === "function") {
        canvas.propertiesPanel.refreshValues();
        }

        me.setBtns();
        //para actualizar los valores en el panel de propiedades
        // después de undo_redo(...) y antes de showProperties/refreshValues:
            const p = canvas.propertiesPanel;
            const obj = p?.obj;
            if (obj?.getSize) console.log('[undo] size after apply =', obj.getSize());

        if (typeof canvas.propertiesPanel?.showProperties === 'function') {
            const obj = canvas.propertiesPanel.obj || canvas.propertiesPanel.getObj?.();
            if (obj) canvas.propertiesPanel.showProperties(obj);
        }
        if (typeof canvas.propertiesPanel?.refreshValues === "function") {
        canvas.propertiesPanel.refreshValues();
        }
        canvas.propertiesManager.refresh();

    };

    const add = (_o) => {
        return (_o instanceof TextObject) ? canvas.textManager.add(_o) : (Cn.add(_o), _o.setParentList(_o.getParent()), _o);
    };

    const remove = (_o) => {
        (_o instanceof TextObject) ? canvas.textManager.deleteTeX(_o) : Cn.remove(_o);
    };

    

    const applyProperty = (obj, prop, value) => {
        if (!obj) return;


        // 1) Intentar llamar el método EXACTO que recibimos:
        const direct = obj[prop];
        if (typeof direct === "function") {
        direct.call(obj, value);
        return;
        }
    }


    

    const undo_redo = (k) => {
        const t = actions[k];

        switch (t.type) {
            case ADD: {
            (Array.isArray(t.target) ? t.target : [t.target]).forEach(remove);
            t.type = REMOVE;                 // ✅ toggle para que redo lo añada
            break;
            }

            case REMOVE: {
            t.target = (Array.isArray(t.target) ? t.target : [t.target]).map(add);
            t.type = ADD;                    // ✅ toggle para que redo lo quite
            break;
            }

            case MODIFY: {
            applyProperty(t.target, t.prop, t.oldValue);
            [t.oldValue, t.newValue] = [t.newValue, t.oldValue];
            break;
            }
            case VISIBILITY: {
            for (let i = 0; i < t.targets.length; i++) {
                setHiddenState(t.targets[i], t.oldStates[i]);
            }
            [t.oldStates, t.newStates] = [t.newStates, t.oldStates];
            break;
            }
        }
        };
    const getHiddenState = (o) => !!o?.isHidden?.(); // en tu motor sí existe
    const setHiddenState = (o, h) => o?.setHidden?.(!!h);

    this.recordVisibility = (obj, nextHidden) => {
    actions.splice(cursor);
    actions.push({
        type: VISIBILITY,
        targets: [obj],
        oldStates: [getHiddenState(obj)],
        newStates: [!!nextHidden],
    });
    cursor++;
    this.setBtns();
    };

    this.recordAdd = (elts) => {
        actions.splice(cursor);
        actions.push({ type: ADD, target: elts });
        cursor++;
        this.setBtns();
    };

    this.recordRemove = (elts) => {
        actions.splice(cursor);
        actions.push({ type: REMOVE, target: elts });
        cursor++;
        this.setBtns();
    };

    this.recordPropertyChange = (obj, prop, oldValue, newValue) => {
        actions.splice(cursor);
        actions.push({
            type: MODIFY,
            target: obj,
            prop,
            oldValue,
            newValue
        });
        
        cursor++;
        this.setBtns();
    };

    this.undo = function () {
        me.isApplying = true;
        if (cursor > 0) {
            cursor--;
            undo_redo(cursor);
            refreshCanvas();
        }
        me.isApplying = false;
    };

    this.redo = function () {
        me.isApplying = true;
        if (cursor < actions.length) {
            undo_redo(cursor);
            cursor++;
            refreshCanvas();
        }
        me.isApplying = false;
    };

    this.beginAdd = () => {
        Cmarker = Cn.elements().length;
        Tmarker = canvas.textManager.elements().length;
    };

    this.endAdd = () => {
        if (Cmarker === null && Tmarker === null) return;
        const newObjs = Cn.elements().slice(Cmarker).concat(canvas.textManager.elements().slice(Tmarker));
        if (newObjs.length > 0) this.recordAdd(newObjs);
        Cmarker = null;
        Tmarker = null;
    };

    this.clear = () => {
        actions.length = 0;
        cursor = 0;
        refreshCanvas();
    };

    // this.deleteObjs = function(_t) {
    //     if (_t.length > 0) this.record(_t, REMOVE);
    //     };

    this.deleteObjs = function (_t) {
        if (_t?.length > 0) this.recordRemove(_t);
        };


    this.setBtns = () => {
        canvas.setUndoBtn(cursor > 0);
        canvas.setRedoBtn(cursor < actions.length);
    };

    this.swap = (_o) => {
        for (const act of actions) {
            const tab = Array.isArray(act.target) ? act.target : [act.target];
            if (tab.length === 1 && tab[0] === _o) act.type = act.type === ADD ? REMOVE : ADD;
        }
    };
}


