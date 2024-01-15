//************************************************
//*************** Rotation arc OBJECT ****************
//************************************************
function RotationArcObject(_construction, _name, _E, _A, _P) {
	E=_E;
	P=_P;
	var rotaPuntos=_construction.getAllObjectsFromType("point");
	Ref=[];
	ptos=[];
	ptos.push(_A.getA(),_A.getB(),_A.getC());
	
	for (var i = 0, len = 3; i < len; i++) {
	  var ptoExistente=-1;
	  for (var j = 0, len2 = rotaPuntos.length; j < len2; j++) {
		  
		  if (rotaPuntos[j].isChild(E)&&rotaPuntos[j].isChild(ptos[i])){ptoExistente=j}
		  
	  }
	  if (ptoExistente>-1){var ext=rotaPuntos[ptoExistente]}
	  if (ptoExistente==-1) {var ext = new RotationPointObject(_construction, "_P", E, ptos[i],P);_construction.add(ext);}
	  Ref.push(ext);
  }
	  
	ext1=Ref[0];
	
	
	ext2= Ref[1];
	
	
	ext3= Ref[2];
	
	
	
	var arc=new Arc3ptsObject(_construction, _name, ext1, ext2, ext3);
	var superObject = arc;
	$U.extend(this, superObject); // Herencia
	_construction.add(arc);
  var E = _E;
  var A = _A;
  var P= _P;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(E,A,P,ext1, ext2,ext3);
  
 

  this.getCode = function() {
    return "arc3pts";
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
	ext1.compute();
	ext2.compute();
	ext3.compute();
	var t = $U.computeArcParams(arc.getA().getX(), arc.getA().getY(), arc.getB().getX(), arc.getB().getY(), arc.getC().getX(), arc.getC().getY());
    arc.getM().setXY(t.centerX, t.centerY);
    fromAngle = t.startAngle;
    toAngle = t.endAngle;
    trigo = t.Trigo;
    AOC = t.AOC;
	 superObject.compute();
    
  };
  // ext1.setParent(this);
  // ext2.setParent(this);

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Rotation", E.getVarName(), A.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_Rotation_description_of + A.getVarName() + $L.object_Rotation_description_wrto + E.getVarName();
      parents = [A.getVarName(), E.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
