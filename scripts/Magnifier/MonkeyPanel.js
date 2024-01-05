function MonkeyPanel(_canvas) {
    $U.extend(this, new Panel(_canvas.getDocObject()));
    var me = this;
    var _l = $P.MonkeyBounds.l,
        _t = $P.MonkeyBounds.t,
        _w = $P.MonkeyBounds.w,
        _h = $P.MonkeyBounds.w;
    var cW = $P.MonkeyBounds.captureWidth;
    me.setStyles("position:absolute;overflow:hidden;z-index:8;background-size:" + _w + "px " + _h + "px");
    me.setStyle("background-image", "url('" + $APP_PATH + "NotPacked/images/tools/mico.svg')");
    me.transition("scale", 0.2);

    var cnvs = new GUIElement(me, "canvas");
    cnvs.setStyles("position:absolute");
    cnvs.width = _w;
    cnvs.height = _h;
    me.addContent(cnvs);
    var ctx = cnvs.getDocObject().getContext('2d');

    var xx = 0,
        yy = 0;

    var dragmove = function(ev) {
        _l += (ev.pageX - xx);
        _t += (ev.pageY - yy);
        me.setStyle("left", _l + "px");
        me.setStyle("top", _t + "px");
        xx = ev.pageX;
        yy = ev.pageY;
    };

    var dragdown = function(ev) {
        xx = ev.pageX;
        yy = ev.pageY;
        me.addMoveEvent(dragmove, window);
        me.addUpEvent(dragup, window);
    };

    var dragup = function(ev) {
        me.removeMoveEvent(dragmove, window);
        me.removeUpEvent(dragup, window);
    };
	
	
	
	sacudir=function(freePoints,alea1,alea2){
		
		
			for (i=0;i<freePoints.length;i++){
				num1=alea1[i];
				num2=alea2[i];
				
				
				freePoints[i].setXY(freePoints[i].getX()+num1,freePoints[i].getY()+num2);
				freePoints[i].compute();
				freePoints[i].computeChilds();
				_canvas.paint();
				if(freePoints[i].getX()<0){
					
					num1=Math.round(Math.random()*10);
					freePoints[i].setXY(freePoints[i].getX()+num1,freePoints[i].getY()+num2);
					freePoints[i].compute();
					freePoints[i].computeChilds();
					_canvas.paint();
					alea1[i]=num1
				}
				if(freePoints[i].getX()>_canvas.getConstruction().coordsSystem.wWindow()){
					
					num1=-Math.round(Math.random()*10);
					freePoints[i].setXY(freePoints[i].getX()+num1,freePoints[i].getY()+num2);
					freePoints[i].compute();
					freePoints[i].computeChilds();
					_canvas.paint();
					alea1[i]=num1
				}
				if(freePoints[i].getY()<0){
					
					num2=Math.round(Math.random()*10);
					freePoints[i].setXY(freePoints[i].getX()+num1,freePoints[i].getY()+num2);
					freePoints[i].compute();
					freePoints[i].computeChilds();
					_canvas.paint();
					alea2[i]=num2;
				}
				if(freePoints[i].getY()>_canvas.getConstruction().coordsSystem.hWindow()){
					
					num2=-Math.round(Math.random()*10);
					freePoints[i].setXY(freePoints[i].getX()+num1,freePoints[i].getY()+num2);
					freePoints[i].compute();
					freePoints[i].computeChilds();
					_canvas.paint();
					
					alea2[i]=num2;
				};
				
			};
		
		
		
		
	}
		
		var mico=function(freePoints){mico2=setInterval(sacudir, 100, freePoints,alea1,alea2)};

	var alea1=[];
		var alea2=[];
	var onmousedown = function(ev) {

		points=_canvas.getConstruction().getAllObjectsFromType("point");
		
		var freePoints=[];
		for (i=0;i<points.length;i++){
			if(points[i].getParent().length==0){
				freePoints.push(points[i])
			}
		}
		
		for (i=0;i<freePoints.length;i++){
			alea1.push(Math.round(Math.random()*10));
			alea2.push(Math.round(Math.random()*10));
		}
		mico(freePoints);
		
	};
	
	
	
	var onmouseup = function(ev) {
		clearInterval(mico2); 
	};
	
	var mousemove = function(ev) {console.log("se movió");
		clearInterval(mico2); 
	};
	
	


    me.addDownEvent(onmousedown);
	me.addUpEvent(onmouseup);
	me.addMoveEvent(mousemove);

    _canvas.getDocObject().parentNode.appendChild(me.getDocObject());
    me.applyTransitionIN();


    me.getBounds = function() {
        return {
            "left": _l,
            "top": _t,
            "width": _w,
            "height": _h
        };
    };

    me.init = function() {
        me.setBounds(_l, _t, _w, _h);
    };

    me.magnifierPaint = function(coords) {
        ctx.beginPath();
        ctx.clearRect(0, 0, _w, _h);
		
    };


    me.init();

}
