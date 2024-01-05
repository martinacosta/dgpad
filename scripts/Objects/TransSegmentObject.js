//************************************************
//*************** Translation Segment OBJECT ****************
//************************************************
function TransSegmentObject(_construction, _name, _V, _S) {
	
	V=_V;
	var trasPuntos=_construction.getAllObjectsFromType("point");
	Ref=[];
	ptos=[_S.getP1(),_S.getP2()];
	
	
	for (var i = 0, len = 2; i < len; i++) {
	  var ptoExistente=-1;
	  for (var j = 0, len2 = trasPuntos.length; j < len2; j++) {
		  
		  if (trasPuntos[j].isChild(V)&&trasPuntos[j].isChild(ptos[i])){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){var ext=trasPuntos[ptoExistente]}
	  if (ptoExistente==-1) {var ext = new TransPointObject(_construction, "_P", V, ptos[i]);_construction.add(ext);}
	  Ref.push(ext);
  }
	  
	ext1=Ref[0];
	
	
	ext2= Ref[1];
	
	
	
	$U.extend(this, new SegmentObject(_construction, _name, ext1, ext2)); // Herencia
  var V = _V;
  var S = _S;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(V, S, ext1, ext2);
  
 

  this.getCode = function() {
    return "segment";
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
    src.geomWrite(false, this.getName(), "Translation", V.getVarName(), S.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_trans_description_of + S.getVarName() + $L.object_trans_description_wrto + V.getVarName();
      parents = [S.getVarName(), V.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
