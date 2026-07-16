//************************************************
//************* INTERSECTION CONSTRUCTOR *********
//************************************************
function IntersectionConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    

    this.getCode = function() {
        return "circle_int";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_intersect;
    }

    this.getInitials = function() {
        return ["line,circle,circle3pts3D,function"];
    };

    this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 2);
    };

    this.newObj = function(_zc, _C) {
        if (_C[0].isInstanceType("line") && _C[1].isInstanceType("line")) {
            return new LineIntersectionObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        }
        else {
            var near = new IntersectionObject(_zc.getConstruction(), "_P", _C[0], _C[1], true);
            _zc.addObject(near);
            near.compute();
            return new IntersectionObject(_zc.getConstruction(), "_P", _C[0], _C[1], false);
        }
        
        //NEED TO ADD OBJECT
    };

    var _isLine = o => o && o.isInstanceType && o.isInstanceType('line');
    var _isCircle = o => o && ((o.isInstanceType && o.isInstanceType('circle')) || (o.getR && o.getP1));
    var _isFunctionObj = o => o && o.isInstanceType && o.isInstanceType('function');
    this._isAcceptable = o => _isLine(o) || _isCircle(o) || _isFunctionObj(o);

    this.selectCreatePoint = function (zc, ev) {
    this.isSelectCreatePoint = true;
    var sel = zc.getConstruction().getIndicated();
    if (sel.length > 0) {
        var o = sel[0];
        if ((!o.isInstanceType || !o.isInstanceType('point')) && this._isAcceptable(o)) {
        this.addC(o);
        }
    }
    };


    // this.selectCreatePoint = function(zc, ev) {
    //     this.isSelectCreatePoint = true;
    //     var cn = zc.getConstruction();
    //     var selection = cn.getIndicated();
    //     var len = selection.length;
        
    //     if (len > 0 && !selection[0].isInstanceType("point")) {
    //         this.addC(selection[0]);
    //     }        
    // };

    this.preview = function(ev, zc) {
       
        var size = zc.prefs.size.point;
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }

        var c = this.getCList();
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.pointborder;
        ctx.fillStyle = zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText(c[0].getName() + $L.tool_Intersect_help, zc.mouseX(ev)+40, zc.mouseY(ev));    
    }
}