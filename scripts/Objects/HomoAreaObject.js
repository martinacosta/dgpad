//************************************************
//*************** Homothety Area OBJECT ****************
//************************************************
function HomoAreaObject(_construction, _name, _E, _pol, _P) {
  const Cn = _construction;
  const E = _E;
  const pol = _pol;
  const P = _P;

  const polRef = [];
  const puntos = pol.getPtab();
  const homoPuntos = Cn.getAllObjectsFromType("point");

  function yaExisteHomoteciaDe(A, E, P) {
    const nombreA = A.getVarName();
    const nombreE = E.getVarName();
    const nombreP = P.getVarName();
    const textoBuscado = $L.object_homothety_description_of + nombreA + $L.object_homothety_description_wrto + nombreP + $L.object_homothety_description_ratio + E.getValue();

    for (let i = 0; i < homoPuntos.length; i++) {
      const tc = homoPuntos[i].getTextCons?.();
      if (tc && tc.texto && tc.texto.includes(textoBuscado)) {
        return homoPuntos[i].getName();
      }
    }
    return null;
  }

  for (let i = 0; i < puntos.length; i++) {
    const A = pol.getPt(i);
    let vertice = null;

    const nombreExistente = yaExisteHomoteciaDe(A, E, P);
    if (nombreExistente) {
      vertice = Cn.find(nombreExistente);
    } else {
      vertice = new HomoPointObject(Cn, "_P", E, A, P);
      Cn.add(vertice);
    }
    polRef.push(vertice);
  }

  polRef.push(polRef[0]);

  const a = new AreaObject(Cn, "pol", polRef);
  a.setOpacity(0.2);
  $U.extend(this, a);

  this.setParent(pol, E, P);
  for (let i = 0; i < polRef.length - 1; i++) {
    this.addParent(polRef[i]);
  }

  this.getCode = function () {
    return "area";
  };

  this.isMoveable = function () {
    return false;
  };

  this.compute = function () {
    for (let i = 0; i < puntos.length; i++) {
      polRef[i].compute();
    }
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
  };

  this.getSource = function (src) {
    src.geomWrite(false, this.getName(), "Homothety", E.getVarName(), pol.getVarName(), P.getVarName());
  };

  this.getTextCons = function () {
    if (this.getParentLength()) {
      const texto =
        this.getName() +
        $L.object_homothety_description_of +
        pol.getVarName() +
        $L.object_homothety_description_wrto +
        P.getVarName() +
        $L.object_homothety_description_ratio +
        E.getValue();
      const parents = [P.getVarName(), pol.getVarName(), E.getVarName()];
      return {
        texto,
        parents,
      };
    }
  };
};
