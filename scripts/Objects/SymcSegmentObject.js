//************************************************
//*************** Symetric Segment OBJECT ****************
//************************************************
function SymcSegmentObject(_construction, _name, _P, _S) {
	P=_P;
	var simcPuntos=_construction.getAllObjectsFromType("point");
	Ref=[];
	ptos=[_S.getP1(),_S.getP2()];
	
	
	for (var i = 0, len = 2; i < len; i++) {
	  var ptoExistente=-1;
	  for (var j = 0, len2 = simcPuntos.length; j < len2; j++) {
		  
		  if (simcPuntos[j].isChild(P)&&simcPuntos[j].isChild(ptos[i])){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){var ext=simcPuntos[ptoExistente]}
	  if (ptoExistente==-1) {var ext = new SymcPointObject(_construction, "_P", P, ptos[i]);_construction.add(ext);}
	  Ref.push(ext);
  }
	  
	ext1=Ref[0];
	
	
	ext2= Ref[1];
	
	
	
	
	
	$U.extend(this, new SegmentObject(_construction, _name, ext1, ext2)); // Herencia
  var P = _P;
  var S = _S;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(S, P, ext1, ext2);
  
 

  this.getCode = function() {
    return "segment";
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
  

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Symmetry", P.getVarName(), S.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + S.getVarName() + $L.object_syma_description_wrto + P.getVarName();
      parents = [S.getVarName(), P.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
