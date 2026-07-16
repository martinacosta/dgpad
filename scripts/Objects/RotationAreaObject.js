//************************************************
//*************** rotation Area OBJECT ****************
//************************************************
function RotationAreaObject(_construction, _name, _E, _pol, _P) {
  const Cn = _construction;
  const E = _E;
  const pol = _pol;
  const P = _P;

  const polRef = [];
  const puntos = pol.getPtab();
  const rotPuntos = Cn.getAllObjectsFromType("point");

  function yaExisteRotacionDe(A, E, P) {
    const nombreA = A.getVarName();
    const nombreE = E.getVarName();
    const nombreP = P.getVarName();
    const textoBuscado = $L.object_rotate_description_of + nombreA + $L.object_rotate_description_wrto + nombreP + $L.object_rotate_description_angle + E.getValue();

    for (let i = 0; i < rotPuntos.length; i++) {
      const tc = rotPuntos[i].getTextCons?.();
     
      if (tc && tc.texto && tc.texto.includes(textoBuscado)) {
        return rotPuntos[i].getName();
      }
    }
    return null;
  }

  for (let i = 0, len = puntos.length; i < len; i++) {
    const A = pol.getPt(i);
    let vertice = null;

    const nombreExistente = yaExisteRotacionDe(A, E, P);
    if (nombreExistente) {
      vertice = Cn.find(nombreExistente);
    } else {
      vertice = new RotationPointObject(Cn, "_P", E, A, P);
      Cn.add(vertice);
    }

    polRef.push(vertice);
  }

  polRef.push(polRef[0]);

  const a = new AreaObject(Cn, "pol", polRef);
  a.setOpacity(0.2);
  $U.extend(this, a);

  this.setParent(E, pol, P);
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
    src.geomWrite(false, this.getName(), "Rotation", E.getVarName(), pol.getVarName(), P.getVarName());
  };

  this.getTextCons = function () {
    if (this.getParentLength()) {
      const texto =
        this.getName() +
        $L.object_rotate_description_of +
        pol.getVarName() +
        $L.object_rotate_description_wrto +
        P.getVarName()+$L.object_rotate_description_angle+E.getValue();
      const parents = [P.getVarName(), pol.getVarName()];
      return {
        texto,
        parents,
      };
    }
  };
};
