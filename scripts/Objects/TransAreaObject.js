//************************************************
//*************** Translated Area OBJECT ****************
//************************************************
function TransAreaObject(_construction, _name, _V, _P) {
  const Cn = _construction;
  const V = _V;
  const P = _P;
  const polRef = [];
  const puntos = P.getPtab();

  function yaExisteTrasladoDe(A, V) {
    const nombreA = A.getVarName();
    const nombreV = V.getVarName();
    const textoBuscado = $L.object_trans_description_of + nombreA + $L.object_trans_description_wrto + nombreV;
    const lista = Cn.getAllObjectsFromType("point");

    for (let i = 0; i < lista.length; i++) {
      const tc = lista[i].getTextCons?.();
      if (tc && tc.texto && tc.texto.includes(textoBuscado)) {
        return lista[i].getName();
      }
    }
    return null;
  }

  for (let i = 0; i < puntos.length; i++) {
    const A = P.getPt(i);
    let vertice = null;

    const nombreExistente = yaExisteTrasladoDe(A, V);
    if (nombreExistente) {
      vertice = Cn.find(nombreExistente);
    } else {
      vertice = new TransPointObject(Cn, "_P", A, V);
      Cn.add(vertice);
    }

    if (vertice) {
      polRef.push(vertice);
    }
  }

  polRef.push(polRef[0]);

  const a = new AreaObject(Cn, "pol", polRef);
  a.setOpacity(0.2);
  $U.extend(this, a);

  this.setParent(P, V);
  for (let i = 0; i < polRef.length - 1; i++) {
    this.addParent(polRef[i]);
    this.addParent(V);
  }

  this.getCode = function () {
    return "area";
  };

  this.isMoveable = function () {
    return false;
  };

  this.compute = function () {
    for (let i = 0; i < puntos.length; i++) {
      if (polRef[i]) polRef[i].compute();
    }
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
  };

  this.getSource = function (src) {
    src.geomWrite(false, this.getName(), "Translation", V.getVarName(), P.getVarName());
  };

  this.getTextCons = function () {
    if (this.getParentLength()) {
      const texto =
        this.getName() +
        $L.object_trans_description_of +
        P.getVarName() +
        $L.object_trans_description_wrto +
        V.getVarName();
      const parents = [P.getVarName(), V.getVarName()];
      return {
        texto,
        parents,
      };
    }
  };
}
