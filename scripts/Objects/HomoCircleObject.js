//************************************************
//*************** Homothety Circle OBJECT ****************
//************************************************
function HomoCircleObject(_construction, _name, _E, _C, _P) {
	var homoPuntos=_construction.getAllObjectsFromType("point"); 
	  
  var E = _E;
  var C = _C;
  var P = _P;
  M = C.getP1();
  r=C.getR();
  var ptoExistente=-1;
	  for (var j = 0, len2 = homoPuntos.length; j < len2; j++) {
		  
		  if (homoPuntos[j].isChild(E)&&homoPuntos[j].isChild(M)){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){var N=homoPuntos[ptoExistente]}
	  if (ptoExistente==-1) {var N = new HomoPointObject(_construction, "_P", E, M, P);_construction.add(N);}
  
  // MEAG start
  var Cn = _construction;
  // MEAG end
  $U.extend(this, new Circle1Object(_construction, _name, N, r));
  // _construction.add(this);
	this.setParent(E, C, P, N);
	// this.setR(r);
	
	this.setExp(C.getName());
  this.getCode = function() {
    return "circle";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
	 
	N.compute();
	r=C.getR()*E.getValue();
	this.setR(r); 
	this.setExp(C.getName());
    // me.R = me.getCn().coordsSystem.lx(RX.value()); 
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };
  
  // M.setParent(this);

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Homothety", E.getVarName(), C.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_homothety_description_of + C.getVarName() + $L.object_homothety_description_wrto + P.getVarName()+$L.object_homothety_description_ratio + E.getValue();
      parents = [P.getVarName(), E.getVarName(), C.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
