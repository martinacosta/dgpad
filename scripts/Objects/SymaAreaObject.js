//************************************************
//*************** Reflection OBJECT ****************
//************************************************
function SymaAreaObject(_construction, _name, _L, _P) {
  const Cn = _construction;
  const L = _L;
  const P = _P;
  const polRef = [];
  const puntos = P.getPtab();
  const simPuntos = Cn.getAllObjectsFromType("point");

  function yaExisteSimetricoAxialDe(A, L) {
    const nombreA = A.getVarName();
    const nombreL = L.getVarName();
    const textoBuscado = $L.object_syma_description_of + nombreA + $L.object_syma_description_wrto + nombreL;

    for (let i = 0; i < simPuntos.length; i++) {
      const tc = simPuntos[i].getTextCons?.();
      if (tc && tc.texto && tc.texto.includes(textoBuscado)) {
        return simPuntos[i].getName();
      }
    }
    return null;
  }

  for (let i = 0; i < puntos.length; i++) {
    const A = P.getPt(i);
    let vertice = null;

    const nombreExistente = yaExisteSimetricoAxialDe(A, L);
    if (nombreExistente) {
      vertice = Cn.find(nombreExistente);
    } else {
      vertice = new SymaPointObject(_construction, "_P", L, A);
      _construction.add(vertice);
    }

    polRef.push(vertice);
  }

  polRef.push(polRef[0]);
  const a = new AreaObject(_construction, "pol", polRef);
  a.setOpacity(0.2);
  $U.extend(this, a);

  this.setParent(L, P);
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
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
  };

  this.getSource = function (src) {
    src.geomWrite(false, this.getName(), "Reflection", L.getVarName(), P.getVarName());
  };

  this.getTextCons = function () {
    if (this.getParentLength()) {
      const texto =
        this.getName() +
        $L.object_syma_description_of +
        P.getVarName() +
        $L.object_syma_description_wrto +
        L.getVarName();
      const parents = [P.getVarName(), L.getVarName()];
      return {
        texto,
        parents,
      };
    }
  };
};
