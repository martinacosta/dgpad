//************************************************
//*************** Homothety Vector OBJECT ****************
//************************************************
function HomoVectorObject(_construction, _name, _E, _S, _P) {
	E=_E;
	P=_P;
	var homoPuntos=_construction.getAllObjectsFromType("point");
	var puntos=[_S.getP1(),_S.getP2()];
	
	
	
	
		var ptoExistente=-1;
	  for (var j = 0, len2 = homoPuntos.length; j < len2; j++) {
		  
		  if (homoPuntos[j].isChild(E)&&homoPuntos[j].isChild(puntos[0])){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){homo1=homoPuntos[ptoExistente]}
	  if (ptoExistente==-1) {homo1=new HomoPointObject(_construction, "_P", E, puntos[0], P);_construction.add(homo1);}
var ptoExistente=-1;
	  for (var j = 0, len2 = homoPuntos.length; j < len2; j++) {
		  
		  if (homoPuntos[j].isChild(E)&&homoPuntos[j].isChild(puntos[1])){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){homo2=homoPuntos[ptoExistente]}
	  if (ptoExistente==-1) {homo2=new HomoPointObject(_construction, "_P", E, puntos[1], P);_construction.add(homo2);}
	
	
	
	$U.extend(this, new VectorObject(_construction, _name, homo1, homo2)); // Herencia
  var E = _E;
  var S = _S;
  var center = _P;
  // MEAG start
  var Cn = _construction;
  
  
 this.setParent(E, S, center, homo1, homo2);

  this.getCode = function() {
    return "vector";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    homo1.compute();
	homo2.compute()
	
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };
  

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Homothety", E.getVarName(), S.getVarName(), center.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_homothety_description_of + S.getVarName() + $L.object_homothety_description_wrto+center.getVarName()+ $L.object_homothety_description_ratio+ E.getValue();
      parents = [S.getVarName(), E.getVarName(), center.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
