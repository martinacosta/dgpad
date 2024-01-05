//************************************************
//*************** Rotation vector OBJECT ****************
//************************************************
function RotationVectorObject(_construction, _name, _E, _V, _P) {
	E=_E;
	P=_P;
	var rotaPuntos=_construction.getAllObjectsFromType("point");
	var puntos=[_S.getP1(),_S.getP2()];
	
	
	
	
		var ptoExistente=-1;
	  for (var j = 0, len2 = rotaPuntos.length; j < len2; j++) {
		  
		  if (rotaPuntos[j].isChild(E)&&rotaPuntos[j].isChild(puntos[0])){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){rot1=rotaPuntos[ptoExistente]}
	  if (ptoExistente==-1) {rot1=new RotationPointObject(_construction, "_P", E, puntos[0], P);_construction.add(rot1);}
var ptoExistente=-1;
	  for (var j = 0, len2 = rotaPuntos.length; j < len2; j++) {
		  
		  if (rotaPuntos[j].isChild(E)&&rotaPuntos[j].isChild(puntos[1])){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){rot2=rotaPuntos[ptoExistente]}
	  if (ptoExistente==-1) {rot2=new RotationPointObject(_construction, "_P", E, puntos[1], P);_construction.add(rot2);}
	
	// ext1.setFillStyle(2);
	// ext2.setFillStyle(2);
	$U.extend(this, new VectorObject(_construction, "_v", ext1, ext2)); // Herencia
  var E = _E;
  var V = _V;
  var P= _P;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  // this.setParent(E, P);
  this.setParent(E, V, P, ext1, ext2);
 

  this.getCode = function() {
    return "vector";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    ext1.compute();
	ext2.compute();
	
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };
  // ext1.setParent(this);
  // ext2.setParent(this);

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Rotation", E.getVarName(), V.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_rotation_description_of + V.getVarName() + $L.object_rotation_description_wrto + E.getVarName();
      parents = [V.getVarName(), E.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
