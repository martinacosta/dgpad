//************************************************
//*****************INTERSECTION OBJECT ***********
//************************************************
// function IntersectionObject(_construction, _name, _O1, _O2, _near) {
//     $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
    
//     var _near = _near;
//     var o1 = _O1;
//     var o2 = _O2;
//     var Cn = _construction;

//     this.setParent(o1, o2);
//     this.setParent(o1, o2, this);
//     this.setFillStyle(2);
//     this.forceFillStyle(2);

//     this.getCode = function() {
//       return "circle_int";
//     };
  
//     this.isMoveable = function() {
//       return false;
//     };

//     this.circle_intersection = function() {
//         // Determine Circle/Circle intersection :
//         var xC1 = o1.getP1().getX(),
//         yC1 = o1.getP1().getY();

//         var xC2 = o2.getP1().getX(),
//         yC2 = o2.getP1().getY();

//         var dx = xC2 - xC1,
//         dy = yC2 - yC1;
//         var r = Math.sqrt(dx * dx + dy * dy);
//         var r1 = o1.getR(),
//         r2 = o2.getR();
//         if (r > (r1 + r2)) {
//             this.setXY(NaN, NaN);
//             return;
//         }
//         if (r === 0) {}
//         var l = (r * r + r1 * r1 - r2 * r2) / (2 * r);
//         dx /= r;
//         dy /= r;
//         var x = xC1 + l * dx,
//         y = yC1 + l * dy;
//         var h = r1 * r1 - l * l;
//         if (h < 0) {
//             this.setXY(NaN, NaN);
//             //p2.setXY(NaN, NaN);
//             return;
//         }
//         h = Math.sqrt(h);
//         if (_near == true)
//             this.setXY(x - h * dy, y + h * dx);
//         else
//             this.setXY(x + h * dy, y - h * dx);
//         o1.checkIfValid(this)
//         o2.checkIfValid(this)
//     };

//     this.line_intersection = function(o1, o2) {
//         NDY = o1.getNDY();
//         NDX = o1.getNDX();

//         var x = o2.getP1().getX(),
//         y = o2.getP1().getY();
//         var r = o2.getR();
//         var d = (x - o1.getP1().getX()) * NDY - (y - o1.getP1().getY()) * NDX;

//         // Si el círculo y la recta son tangentes:
//         if (Math.abs(r - Math.abs(d)) < 1e-12) {
//             var c = o1.projectXY(x, y);
//             this.setXY(c[0], c[1]);
//             return;
//         }

//         x -= d * NDY;
//         y += d * NDX;
//         var h = r * r - d * d;
//         var _xmax, _ymax, _xmin, _xmin;
//         _xmax = Math.max(o1.getXmax(), o1.getXmin());
//         _xmin = Math.min(o1.getXmax(), o1.getXmin());
//         _ymax = Math.max(o1.getYmax(), o1.getYmin());
//         _ymin = Math.min(o1.getYmax(), o1.getYmin());

//         if (h >= 0) {
//             h = Math.sqrt(h);
//             var hDX = h * NDX,
//             hDY = h * NDY;
//             if (_near == true) {
//                 if (x - hDX < _xmin || x -hDX > _xmax || y - hDY < _ymin || y -hDY > _ymax)
//                     this.setXY(NaN, NaN);
//                 else
//                     this.setXY(x - hDX, y - hDY);
//             }
//             else {
//                 if (x + hDX < _xmin || x + hDX > _xmax || y + hDY < _ymin || y + hDY > _ymax)
//                     this.setXY(NaN, NaN);
//                 else
//                     this.setXY(x + hDX, y + hDY);
//             }
//         } else {
//             this.setXY(NaN, NaN);
//         }
//         o1.checkIfValid(this)
//         o2.checkIfValid(this)
//     };

//     this.compute = function() {
//         if (o1.isInstanceType("line")) {
//             this.line_intersection(o1, o2);
//         }
//         else if (o2.isInstanceType("line")) {
//             this.line_intersection(o2, o1);
//         }
//         else {
//             this.circle_intersection();
//         }
//         if (!Cn.getFrame().ifObject(this.getName())) {
//             Cn.getFrame().getTextCons(this);
//           }
//     };
  
//     this.getSource = function(src) {
//       if (this.execMacroSource(src)) return;
//       src.geomWrite(false, this.getName(), "Intersect", o1.getVarName(), o2.getVarName());
//     };
  
//     // MEAG start
//     this.getTextCons = function() {
//       if (this.getParentLength()) {
//         texto = "";
//         texto = this.getName() + $L.object_intersectionpoint_description + this.getParentAt(0).getVarName() + $L.object_intersectionpoint_description_secondObjetc + this.getParentAt(1).getVarName();
//         parents = [o1.getVarName(), o2.getVarName()];
//         return {
//           "texto": texto,
//           "parents": parents
//         };
//       }
//     }
//   };

//************************************************
//*****************INTERSECTION OBJECT (DEBUG) ****
//************************************************
// Objetivo: MISMO COMPORTAMIENTO que tu versión "que sí crea puntos",
// pero con trazas de depuración para localizar el solapamiento.
// No toca el constructor (getCode = "circle_int").

function IntersectionObject(_construction, _name, _O1, _O2, _near) {
  $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia

  // === DEBUG helper ===
  var __DBG_ON = (typeof window !== 'undefined') ? !!window.__DBG_INT__ : true; // activa con window.__DBG_INT__=true
  var __DBG = function(){ if (!__DBG_ON) return; try { console.log.apply(console, arguments); } catch(e){} };

  // Mantener exactamente la misma API: NO cambies símbolos usados por el constructor
  var _near = _near; // <- dejamos el símbolo tal cual para reproducir el comportamiento actual
  var o1 = _O1;
  var o2 = _O2;
  var Cn = _construction;

  this.setParent(o1, o2);
  this.setParent(o1, o2, this);
  this.setFillStyle(2);
  this.forceFillStyle(2);

  this.getCode = function () { return "circle_int"; };
  this.isMoveable = function () { return false; };

  // ===== Utilidades de log de puntos =====
  var _pt = function(x,y){ return isNaN(x)||isNaN(y) ? 'NaN' : '('+x.toFixed(2)+','+y.toFixed(2)+')'; };
  var _name = (typeof this.getName === 'function') ? this.getName() : '[no-name]';
  __DBG('[INT:new]', _name, { near:_near, o1:(o1.getCode?o1.getCode():o1.getFamilyCode?o1.getFamilyCode():''), o2:(o2.getCode?o2.getCode():o2.getFamilyCode?o2.getFamilyCode():'') });

  // ====== Geometría básica ======
  var _segIntersect = function(ax,ay,bx,by,cx,cy,dx,dy){
    var bax=bx-ax, bay=by-ay, dcx=dx-cx, dcy=dy-cy, acx=ax-cx, acy=ay-cy;
    var den=bax*dcy-bay*dcx; if(den===0) return null;
    var t=(dcx*acy-dcy*acx)/den, u=(bax*acy-bay*acx)/den;
    if(t<0||t>1||u<0||u>1) return null;
    return {x:ax+t*bax, y:ay+t*bay, t:t, u:u};
  };
  var _segCircleIntersect=function(ax,ay,bx,by,cx,cy,r){
    var dx=bx-ax,dy=by-ay,fx=ax-cx,fy=ay-cy,A=dx*dx+dy*dy,B=2*(fx*dx+fy*dy),C=fx*fx+fy*fy-r*r;
    var D=B*B-4*A*C; if(D<0||A===0) return []; var s=Math.sqrt(D);
    var t1=(-B-s)/(2*A),t2=(-B+s)/(2*A),out=[];
    if(t1>=0&&t1<=1) out.push({x:ax+t1*dx,y:ay+t1*dy,t:t1});
    if(D>0&&t2>=0&&t2<=1) out.push({x:ax+t2*dx,y:ay+t2*dy,t:t2});
    return out;
  };
  var _dedup=function(arr,eps){ if(!arr||!arr.length) return []; eps=Math.max(4,eps||6); var cells=Object.create(null);
    function key(x,y){return Math.round(x/eps)+","+Math.round(y/eps);} var i,p,k,c; for(i=0;i<arr.length;i++){p=arr[i];k=key(p.x,p.y);c=cells[k]; if(!c) cells[k]=c={sx:0,sy:0,n:0}; c.sx+=p.x; c.sy+=p.y; c.n++;}
    var out=[]; for(k in cells){ if(!Object.prototype.hasOwnProperty.call(cells,k)) continue; c=cells[k]; out.push({x:c.sx/c.n,y:c.sy/c.n}); } out.sort(function(a,b){return a.x-b.x;}); return out; };

  var _lineSeg=function(line){
    var P1=line&&(line.P1||(line.getP1&&line.getP1())||line.A||(line.getA&&line.getA()));
    var P2=line&&(line.P2||(line.getP2&&line.getP2())||line.B||(line.getB&&line.getB()));
    if(!P1||!P2||!P1.getX||!P2.getX) return null; var x1=P1.getX(),y1=P1.getY(),x2=P2.getX(),y2=P2.getY();
    var dx=x2-x1,dy=y2-y1,L=Math.sqrt(dx*dx+dy*dy); if(L===0) return null; dx/=L; dy/=L; var b=Cn.getBounds(),M=Math.max(b.width,b.height)*4;
    return [{x:x1-dx*M,y:y1-dy*M},{x:x1+dx*M,y:y1+dy*M}]; };

  var _funcPolyline=function(F){
    if(F&&typeof F.getPolyline==='function'){var poly=F.getPolyline(); return Array.isArray(poly)?poly:[];}
    if(!F||typeof F.getE1!=='function') return []; var E=F.getE1();
    if(!E||(typeof E.isArray==='function'&&E.isArray())||typeof E.value!=='function') return [];
    if(typeof F.compute==='function') F.compute(); var W=Cn.getBounds().width,N=Math.max(32,Math.min(1024,W));
    var step=W/(N-1),out=new Array(N); for(var i=0;i<N;i++){var px=i*step,Xw=Cn.coordsSystem.x(px),Yw=E.value(Xw),py=Cn.coordsSystem.py(Yw); out[i]={x:px,y:py}; }
    return out; };

  // ===== Selección de candidato =====
  var _firstPick = true;
  var _choose = function(cands){
    __DBG('[INT:choose]', _name, 'near?', _near, 'first?', _firstPick, 'cands=', cands.map(function(p){return _pt(p.x,p.y);}));
    if(!cands||cands.length===0) return null;
    if(_firstPick){ cands.sort(function(a,b){return a.x-b.x;}); var pick = (_near===true)? cands[0] : cands[cands.length-1]; __DBG('[INT:choose:first]', _name, 'pick=', _pt(pick.x,pick.y)); return pick; }
    var x0=this.getX(),y0=this.getY(); if(!isNaN(x0)&&!isNaN(y0)){ var best=0,bd=Infinity; for(var i=0;i<cands.length;i++){ var dx=cands[i].x-x0,dy=cands[i].y-y0,d=dx*dx+dy*dy; if(d<bd){bd=d;best=i;} } __DBG('[INT:choose:re]', _name, 'pick=', _pt(cands[best].x,cands[best].y)); return cands[best]; }
    cands.sort(function(a,b){return a.x-b.x;}); var pk = (_near===true)? cands[0] : cands[cands.length-1]; __DBG('[INT:choose:fallback]', _name, 'pick=', _pt(pk.x,pk.y)); return pk;
  }.bind(this);

  // ===== Intersecciones existentes =====
  this.circle_intersection = function(){
    var xC1=o1.getP1().getX(), yC1=o1.getP1().getY();
    var xC2=o2.getP1().getX(), yC2=o2.getP1().getY();
    var dx=xC2-xC1, dy=yC2-yC1; var r=Math.sqrt(dx*dx+dy*dy); var r1=o1.getR(), r2=o2.getR();
    __DBG('[INT:circle-circle]', _name, {near:_near, r:r, r1:r1, r2:r2});
    if(r>r1+r2){ this.setXY(NaN,NaN); __DBG('[INT:circle-circle:no-solution]', _name); return; }
    if(r===0){}
    var l=(r*r+r1*r1-r2*r2)/(2*r); dx/=r; dy/=r; var x=xC1+l*dx, y=yC1+l*dy; var h=r1*r1-l*l; if(h<0){ this.setXY(NaN,NaN); __DBG('[INT:circle-circle:imag]', _name); return; }
    h=Math.sqrt(h); if(_near===true) this.setXY(x-h*dy,y+h*dx); else this.setXY(x+h*dy,y-h*dx);
    __DBG('[INT:circle-circle:set]', _name, 'setXY=', _pt(this.getX(),this.getY()));
    o1.checkIfValid(this); o2.checkIfValid(this);
  };

  this.line_intersection = function(line, circle){
    var NDY=line.getNDY(), NDX=line.getNDX();
    var x=circle.getP1().getX(), y=circle.getP1().getY(), r=circle.getR();
    var d=(x-line.getP1().getX())*NDY-(y-line.getP1().getY())*NDX;
    __DBG('[INT:line-circle]', _name, {near:_near, d:d, r:r});
    if(Math.abs(r-Math.abs(d))<1e-12){ var c=line.projectXY(x,y); this.setXY(c[0],c[1]); __DBG('[INT:line-circle:tangent]', _name, 'setXY=', _pt(this.getX(),this.getY())); return; }
    x-=d*NDY; y+=d*NDX; var h=r*r-d*d;
    var _xmax=Math.max(line.getXmax(),line.getXmin()), _xmin=Math.min(line.getXmax(),line.getXmin());
    var _ymax=Math.max(line.getYmax(),line.getYmin()), _ymin=Math.min(line.getYmax(),line.getYmin());
    if(h>=0){ h=Math.sqrt(h); var hDX=h*NDX, hDY=h*NDY; if(_near===true){ if(x-hDX<_xmin||x-hDX>_xmax||y-hDY<_ymin||y-hDY>_ymax) this.setXY(NaN,NaN); else this.setXY(x-hDX,y-hDY); }
      else { if(x+hDX<_xmin||x+hDX>_xmax||y+hDY<_ymin||y+hDY>_ymax) this.setXY(NaN,NaN); else this.setXY(x+hDX,y+hDY); } }
    else this.setXY(NaN,NaN);
    __DBG('[INT:line-circle:set]', _name, 'setXY=', _pt(this.getX(),this.getY()));
    line.checkIfValid(this); circle.checkIfValid(this);
  };

  // ===== Nuevas (si existen funciones) =====
  var _isFunction = function (obj) { return obj && typeof obj.isInstanceType === 'function' && obj.isInstanceType('function'); };
  var _F_line = function(F,line){ var seg=_lineSeg(line); if(!seg) return []; var A=seg[0],B=seg[1],P=_funcPolyline(F),out=[]; for(var i=0;i<P.length-1;i++){ var p0=P[i],p1=P[i+1]; if(isNaN(p0.x)||isNaN(p0.y)||isNaN(p1.x)||isNaN(p1.y)) continue; var it=_segIntersect(p0.x,p0.y,p1.x,p1.y,A.x,A.y,B.x,B.y); if(it) out.push({x:it.x,y:it.y}); } return _dedup(out,6); };
  var _F_circle=function(F,circle){ var cx=circle.getP1().getX(),cy=circle.getP1().getY(),r=circle.getR(); var P=_funcPolyline(F),out=[]; for(var i=0;i<P.length-1;i++){ var p0=P[i],p1=P[i+1]; if(isNaN(p0.x)||isNaN(p0.y)||isNaN(p1.x)||isNaN(p1.y)) continue; var its=_segCircleIntersect(p0.x,p0.y,p1.x,p1.y,cx,cy,r); for(var k=0;k<its.length;k++) out.push({x:its[k].x,y:its[k].y}); } return _dedup(out,6); };
  var _F_F=function(F1,F2){ var P=_funcPolyline(F1),Q=_funcPolyline(F2),out=[],i=0,j=0; while(i<P.length-1&&j<Q.length-1){ var p0=P[i],p1=P[i+1],q0=Q[j],q1=Q[j+1]; if([p0,p1,q0,q1].some(function(u){return isNaN(u.x)||isNaN(u.y);})){ if(isNaN(p0.x)||isNaN(p0.y)||isNaN(p1.x)||isNaN(p1.y)) i++; if(isNaN(q0.x)||isNaN(q0.y)||isNaN(q1.x)||isNaN(q1.y)) j++; continue; } var pminx=Math.min(p0.x,p1.x),pmaxx=Math.max(p0.x,p1.x),qminx=Math.min(q0.x,q1.x),qmaxx=Math.max(q0.x,q1.x); if(pmaxx<qminx){ i++; continue; } if(qmaxx<pminx){ j++; continue; } var it=_segIntersect(p0.x,p0.y,p1.x,p1.y,q0.x,q0.y,q1.x,q1.y); if(it) out.push({x:it.x,y:it.y}); if(pmaxx<=qmaxx) i++; else j++; } return _dedup(out,6); };

  this.compute = function(){
    // Log entrada
    __DBG('[INT:compute:begin]', _name, { near:_near, x:this.getX(), y:this.getY() });

    var isF1=_isFunction(o1), isF2=_isFunction(o2);
    if(isF1 && isF2){ var c=_F_F(o1,o2); __DBG('[INT:FF:cands]', _name, c.map(function(p){return _pt(p.x,p.y);})); var p=_choose(c); if(p) this.setXY(p.x,p.y); else this.setXY(NaN,NaN); }
    else if(isF1 && o2.isInstanceType && o2.isInstanceType('line')){ var c1=_F_line(o1,o2); __DBG('[INT:FL:cands]', _name, c1.map(function(p){return _pt(p.x,p.y);})); var p1=_choose(c1); if(p1) this.setXY(p1.x,p1.y); else this.setXY(NaN,NaN); }
    else if(isF2 && o1.isInstanceType && o1.isInstanceType('line')){ var c2=_F_line(o2,o1); __DBG('[INT:LF:cands]', _name, c2.map(function(p){return _pt(p.x,p.y);})); var p2=_choose(c2); if(p2) this.setXY(p2.x,p2.y); else this.setXY(NaN,NaN); }
    else if(isF1 && typeof o2.getR==='function' && typeof o2.getP1==='function'){ var c3=_F_circle(o1,o2); __DBG('[INT:FC:cands]', _name, c3.map(function(p){return _pt(p.x,p.y);})); var p3=_choose(c3); if(p3) this.setXY(p3.x,p3.y); else this.setXY(NaN,NaN); }
    else if(isF2 && typeof o1.getR==='function' && typeof o1.getP1==='function'){ var c4=_F_circle(o2,o1); __DBG('[INT:CF:cands]', _name, c4.map(function(p){return _pt(p.x,p.y);})); var p4=_choose(c4); if(p4) this.setXY(p4.x,p4.y); else this.setXY(NaN,NaN); }
    else if(o1.isInstanceType && o1.isInstanceType('line')){ __DBG('[INT:branch]', _name, 'line_circle (o1,line)'); this.line_intersection(o1,o2); }
    else if(o2.isInstanceType && o2.isInstanceType('line')){ __DBG('[INT:branch]', _name, 'line_circle (o2,line)'); this.line_intersection(o2,o1); }
    else { __DBG('[INT:branch]', _name, 'circle_circle'); this.circle_intersection(); }

    __DBG('[INT:compute:end]', _name, 'setXY=', _pt(this.getX(),this.getY()));

    if (!Cn.getFrame().ifObject(this.getName())) Cn.getFrame().getTextCons(this);
    if (o1 && typeof o1.checkIfValid === 'function') o1.checkIfValid(this);
    if (o2 && typeof o2.checkIfValid === 'function') o2.checkIfValid(this);
  };

  this.getSource = function(src){ if(this.execMacroSource(src)) return; src.geomWrite(false, this.getName(), 'Intersect', o1.getVarName(), o2.getVarName()); };

  // MEAG start
  this.getTextCons = function(){ if(this.getParentLength()){ var texto = this.getName() + $L.object_intersectionpoint_description + this.getParentAt(0).getVarName() + $L.object_intersectionpoint_description_secondObjetc + this.getParentAt(1).getVarName(); var parents=[o1.getVarName(),o2.getVarName()]; return {texto:texto, parents:parents}; } };
  // MEAG end
}
