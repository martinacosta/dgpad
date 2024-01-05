//************************************************
//*************** Reflection OBJECT ****************
//************************************************
function SymaAreaObject(_construction, _name, _L, _P) {
   // Herencia
  var L = _L;
  var P = _P;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  var polRef=[];
  var puntos=P.getPtab();
  var simPuntos=Cn.getAllObjectsFromType("point");
  
  
  for (var i = 0, len = puntos.length; i < len; i++) {
	  var ptoExistente=-1;
	  for (var j = 0, len2 = simPuntos.length; j < len2; j++) {
		  
		  if (simPuntos[j].isChild(L)&&simPuntos[j].isChild(P.getPt(i))){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){var vertice=simPuntos[ptoExistente]}
	  if (ptoExistente==-1) {var vertice = new SymaPointObject(_construction, "_P", L, P.getPt(i));_construction.add(vertice);}
	  polRef.push(vertice);
	  
	 
	  
  }
  /* polRef.push(new TransPointObject(_construction, _name, V, P.getPt(0))); */
  polRef.push(polRef[0]);
  var a=new AreaObject(_construction, _name, polRef)
  // $U.extend(this, new AreaObject(_construction, _name, polRef));
	a.setOpacity(0.2);
	$U.extend(this, a);
	
	this.setParent(L, P);
		for (var i = 0, len = polRef.length-1; i < len; i++) {
		this.addParent(polRef[i]);
	};
  this.getCode = function() {
    return "area";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
	 
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Reflection", L.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + P.getVarName() + $L.object_syma_description_wrto + L.getVarName();
      parents = [P.getVarName(), L.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
