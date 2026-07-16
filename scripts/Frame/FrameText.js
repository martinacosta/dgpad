
function FrameText(_construction) {
  var me = this;
  var Cn = _construction;
  var M = [];
  var frame2 = null;

  me.getList = function() {
    return M;
  }

  me.ifObject = function(_name) {
    if (typeof _name === "string") {
      for (var i = 0, len = M.length; i < len; i++) {
        if (M[i].name === _name) {
          return true;
        }
      }
      return false;
    }
  }

  

me.getTextCons = function(_obj) {
  // Verificación de que la función se está llamando
  // console.log("getTextCons llamado para el objeto: " + _obj.getName());

  if (typeof _obj === "object" && !_obj.isSuperHidden()&&!_obj.isHidden()) {
      var tC = _obj.getTextCons();
      
      if (typeof tC === 'object') {
          
          // Añadir el objeto con el texto actualizado a la lista M
          M.push({
              "name": _obj.getName(),
              "texto": tC.texto,
              "parents": tC.parents
          });
      }
  }
  
  // Redibujar el protocolo después de añadir el objeto
  me.draw();
};



  me.removeTextCons = function(_obj) {
    for (var i = 0, len = M.length; i < len; i++) {
      if (M[i].name == _obj.getName()) {
        break;
      }
    }
    M.splice(i, 1);
    me.draw();
  };

  me.fixTextCons = function(_old, _new) {
    for (var i = 0, len = M.length; i < len; i++) {
      var id = "",
        V = Cn.getListObject();
      if (M[i].name == _old || M[i].parents.indexOf(_old) >= 0) {

        if (M[i].name == _old) {
          M[i].name = _new;
          id = _old;
        }

        for (var k = 0, lov = V.length; k < lov; k++) {
          var name = V[k].getName();
          if (V[k].getName() == M[i].name) {
            var tC = V[k].getTextCons();
            M[i].name = name;
            M[i].texto = tC.texto;
            M[i].parents = tC.parents;
            break;
          }
        }
      }
    }
    me.draw();
  };

  me.updateTextCons = function(_obj) {
    for (var i = 0, len = M.length; i < len; i++) {
      if (M[i].name == _obj.getName()) {
        var tC = _obj.getTextCons();
        if (typeof tC === 'object') {
        //   if (_obj.isHidden()) {
        //     tC.texto = tC.texto + ' (oculto)';  // Añadir "(oculto)" al texto
        //     console.log("Modificando texto de " + _obj.getName() + " a: " + tC.texto);
        // }
          M[i].texto = tC.texto;
          M[i].parents = tC.parents;
          break;
        }
      }
    }
    me.draw();
  };

  me.showHiddenObjectsInProtocol = function() {
    // Obtener todos los objetos de la construcción
    var allObjects = Cn.getListObject();
    
    // Recorrer todos los objetos y añadir al protocolo los que están ocultos
    for (var i = 0, len = allObjects.length; i < len; i++) {
        var obj = allObjects[i];
        
        // Si el objeto está oculto y no es superoculto, añadirlo al protocolo
        if (obj.isHidden() && !obj.isSuperHidden()) {
            var tC = obj.getTextCons();
            if (typeof tC === 'object') {
                // Verificar si ya está en el protocolo, para evitar duplicados
                if (!me.ifObject(obj.getName())) {
                    M.push({
                        "name": obj.getName(),
                        "texto": tC.texto + " (oculto)",
                        "parents": tC.parents
                    });
                }
            }
        }
    }

    // Redibujar el protocolo con los objetos ocultos añadidos
    me.draw();
};


me.removeHiddenObjectsFromProtocol = function() {
  // Recorrer el protocolo (lista M) y eliminar los objetos ocultos
  M = M.filter(function(item) {
      var obj = Cn.find(item.name);
      return !obj.isHidden();  // Mantener solo los objetos que no están ocultos
  });

  // Redibujar el protocolo después de eliminar los objetos ocultos
  me.draw();
};

  

  me.removeAll = function() {
    M = [];  // Vaciar la lista de objetos del protocolo
    if (frame2) {
        me.cleanFrame();  // Limpiar el contenido del frame
        frame2 = null;    // Eliminar la referencia al frame para evitar que se vuelva a dibujar
    }
};


  

  me.setList=function(list){
    M=list;
    me.draw();
  }


me.draw = function() {
  if (frame2) {
      var contenido = "";
      for (var k = 0, len = M.length; k < len; k++) {
          // Verificamos si el objeto tiene nombre y texto válido antes de crear el <li>
          if (M[k].name && M[k].texto) {
              contenido += "<li id='" + M[k].name + "' style='cursor: pointer;'>" + M[k].texto + "</li>";
          } else {
              console.warn("Objeto con nombre o texto inválido:", M[k]);
          }
      }
      frame2.setText(contenido);
      // console.log("Protocolo dibujado con contenido:", contenido);

      // Solo adjuntamos los eventos si el contenido es válido
      if (contenido.trim() !== "") {
          attachHoverEventsToText();
      }
  }
};



  

function attachHoverEventsToText() {
  if (frame2) {
      var wrapper = document.getElementById("ConsText");
      var listItems = wrapper.querySelectorAll('li');

      listItems.forEach(function(item) {
          // Aseguramos que el texto sea seleccionable y que el hover cambie el color
          item.style.userSelect = 'text';  // Permitir selección de texto nativa

          // Evento hover (mouse) para pantallas no táctiles
          item.addEventListener('mouseover', function() {
              item.style.backgroundColor = '#f0f0f0'; // Cambiar el color de fondo para indicar selección
              var objName = item.id;  // El id del <li> corresponde al nombre del objeto
              highlightObjectInConstruction(objName);  // Seleccionar el objeto en la construcción
          });

          item.addEventListener('mouseleave', function() {
              item.style.backgroundColor = '';  // Limpiar el fondo cuando el cursor se va
              var objName = item.id;
              clearObjectHighlight(objName);  // Desmarcar el objeto en la construcción
          });

          // Eventos táctiles para pantallas táctiles
          item.addEventListener('touchstart', function() {
              item.style.backgroundColor = '#f0f0f0';  // Cambiar el color de fondo para indicar selección táctil
              var objName = item.id;  // El id del <li> corresponde al nombre del objeto
              highlightObjectInConstruction(objName);  // Seleccionar el objeto en la construcción
          });

          item.addEventListener('touchend', function() {
              item.style.backgroundColor = '';  // Limpiar el fondo cuando se termina el toque
              var objName = item.id;
              clearObjectHighlight(objName);  // Desmarcar el objeto en la construcción
          });

          // Evento de clic para pantallas táctiles y no táctiles
          item.addEventListener('click', function() {
              var objName = item.id;  // El id del <li> corresponde al nombre del objeto
              highlightObjectInConstruction(objName);  // Seleccionar el objeto en la construcción
          });
      });
  }
}



 


function highlightObjectInConstruction(objName) {
  var obj = Cn.find(objName);
  if (obj) {
      // Verificar si el modo 2 está activado y el objeto está oculto
      if (Cn.getCanvas().getMode() === 2 && obj.isHidden()) {
          console.log("Modo 2 activo: resaltando el objeto oculto.");
          // Resaltar el objeto sin cambiar su visibilidad (ya se muestra en gris)
          obj.setIndicated(true);  // Resaltar el objeto (cambia de aspecto)
          obj.setShowName(true);   // Mostrar el nombre del objeto
          Cn.getCanvas().paint();  // Redibujar el canvas
          return;  // No cambiar la visibilidad del objeto
      }

      // Si no está en modo 2 o el objeto no está oculto, procedemos normalmente
      // obj.setHidden(false);  // Mostrar el objeto si no está oculto o si no estamos en modo 2
      obj.setIndicated(true); // Resaltar el objeto
      obj.setShowName(true);  // Mostrar el nombre del objeto
      Cn.getCanvas().paint(); // Redibujar el canvas
  }
}




function clearObjectHighlight(objName) {
  var obj = Cn.find(objName);
  if (obj) {
      // Verificar si el modo 2 está activado y el objeto está oculto
      if (Cn.getCanvas().getMode() === 2 && obj.isHidden()) {
          console.log("Modo 2 activo: no cambiar visibilidad de objetos ocultos al deseleccionarlos.");
          // Solo quitar el resaltado sin cambiar la visibilidad
          obj.setIndicated(false); // Quitar el resaltado del objeto
          obj.setShowName(false);   // Ocultar el nombre del objeto
          Cn.getCanvas().paint();   // Redibujar el canvas
          return;  // No cambiar la visibilidad del objeto
      }

      // Si no está en modo 2, procedemos normalmente
      // obj.setHidden(true);  // Volver a ocultar el objeto si estaba visible
      obj.setIndicated(false); // Quitar el resaltado del objeto
      obj.setShowName(false);  // Ocultar el nombre del objeto
      Cn.getCanvas().paint();  // Redibujar el canvas
  }
}




  me.cleanFrame = function() {
    if (frame2) {
      frame2.setText("");
    }
  };

  

  me.drawFrame = function(_canvas, x, y) {
    if (!frame2) {
        frame2 = new FrameWrapper(_canvas, x, y, 'protocol'); // Crear frame de tipo protocolo
        Cn.setProtocolFrame(frame2); // Asignar el frame de protocolo a la construcción
    } else {
        me.cleanFrame();
        me.draw();
        frame2 = new FrameWrapper(_canvas, x, y, 'protocol'); // Crear de nuevo el frame de tipo protocolo
        Cn.setProtocolFrame(frame2); // Asignar de nuevo el frame de protocolo
    }
};
}
