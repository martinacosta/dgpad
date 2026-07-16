Blockly.JavaScript['dgpad_construction'] = function(block) {
    var statements = Blockly.JavaScript.statementToCode(block, 'CONTENT');
    return "@CONST@" + statements + "@CONST@"
}

// Blockly.JavaScript['dgpad_point'] = function(block) {
    
//     var name = block.getFieldValue('name');
    
//     var cod = name + "=Point(\"" + name + "\"," + Math.random() + "," + Math.random() + ");\n";
//     console.log("uno")
//     switch (block.blocktype) {
//         case "pointon":
//             cod = name + "=PointOn(\"" + name + "\"," + block.getFieldValue('obj1') + ",0);\n";
//             break;
//         case "intersect":
//             cod = name + "=OrderedIntersection(\"" + name + "\"," + block.getFieldValue('obj1') + "," + block.getFieldValue('obj2') + ",0);\n";
//             break;
//         case "coords":
//             cod = name + "=Point(\"" + name + "\"," + block.getFieldValue('obj1') + "," + block.getFieldValue('obj2') + ");\n";
//             break;
//         case "exp":
//             cod = name + "=Point(\"" + name + "\",\"" + block.getFieldValue('obj1') + "\",\"0\");\n";
//             break;
//     }
//     cod += "STL(" + name + ",\"sn:true\");\n";
//     return cod;
// }
Blockly.JavaScript['dgpad_point'] = function(block) {
  
    var nom = Blockly.JavaScript.valueToCode(block, 'NOM',
        Blockly.JavaScript.ORDER_MEMBER) || "''";
    var vble = Blockly.JavaScript.valueToCode(block, 'VAR',
        Blockly.JavaScript.ORDER_MEMBER) || "''";
    // return "p=Point(" + nom + ", Math.random()*10-5, Math.random()*10-5);console.log("+vble+");p=Find(p);console.log(p.getName());GLOBAL_SET("+vble+",p.getName());\n"; 
    var code = `
        var p = Point(${nom}, Math.random() * 10 - 5, Math.random() * 10 - 5);
        console.log('Variable global antes de asignar:', ${vble});
        p = Find(p);
        console.log('Nombre del punto:', p.getName());
        GLOBAL_SET(${vble},p.getName()); // Asignar el nombre del punto a la variable global
    `;
    
    return code;
    
  };

// Blockly.JavaScript['dgpad_point'] = function(block) {
//     var nom = Blockly.JavaScript.valueToCode(block, 'NOM',
//         Blockly.JavaScript.ORDER_ATOMIC) || "''";
//     var vble = Blockly.JavaScript.valueToCode(block, 'VAR',
//         Blockly.JavaScript.ORDER_ATOMIC) || null;
//         console.log("a"+vble);
//     // Si la variable contiene GLOBAL_GET, extraer el nombre
//     if (vble && vble.startsWith('GLOBAL_GET')) {
//         vble = vble.match(/GLOBAL_GET\("(.+?)"\)/)[1]; // Extrae "elemento"
//         console.log(vble);
//     } else if (!vble) {
//         console.error('Variable no válida:', vble);
//         return "console.error('Variable no válida.');\n";
//     }

//     // Código generado
//     var code = `
//         var p = Point(${nom}, Math.random() * 10 - 5, Math.random() * 10 - 5);
//         p = Find(p);
//         console.log(p.getName());
//         ${vble} = p.getName(); // Asignar el nombre del punto a la variable
//         console.log('Nombre del punto asignado a la variable "${vble}":', ${vble});
//     `;
//     return code;
// };




Blockly.JavaScript['dgpad_segment'] = function(block) {
    var A = block.getFieldValue('a'),
        B = block.getFieldValue('b');
    var name = "_s";
   // name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
//    var cod = name + "=Segment(\"" + name + "\"," + A + "," + B + ");\n";  //linea original
    var cod = name + "=Segment(\"" + name + "\", \"" + A + "\", \"" + B + "\");\n";
    return cod;
}

Blockly.JavaScript['segmento'] = function(block) {
  var A = Blockly.JavaScript.valueToCode(block, 'ext1', Blockly.JavaScript.ORDER_ATOMIC);
  var B = Blockly.JavaScript.valueToCode(block, 'ext2', Blockly.JavaScript.ORDER_ATOMIC);
  var name = "_s";
    //name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
//    var cod = name + "=Segment(\"" + name + "\"," + A + "," + B + ");\n";  //linea original
    var cod = name + "=Segment(\"" + name + "\", \"" + A + "\", \"" + B + "\");\n";
    return cod;
}


Blockly.JavaScript['dgpad_droite'] = function(block) {
    var A = block.getFieldValue('a'),
        B = block.getFieldValue('b');
    var name = "_r" ;
    //name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
    var cod = name + "=Line(\"" + name + "\",\"" + A + "\",\"" + B + "\");\n";
    return cod;
}

Blockly.JavaScript['dgpad_anglebiss'] = function(block) {
    var A = block.getFieldValue('a'),
        B = block.getFieldValue('b'),
        C = block.getFieldValue('c');
    var name = "_sr";
    //name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
    var cod = name + "=AngleBisector(\"" + name + "\",\"" + A + "\",\"" + B + "\",\"" + C + "\");\n";
    return cod;
}

Blockly.JavaScript['dgpad_plumb'] = function(block) {
    var AB = block.getFieldValue('a'),
        C = block.getFieldValue('c');
    var name = "_r";
    //name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
    var cod = name + "=Plumb(\"" + name + "\",\""+ AB + "\",\"" + C + "\");\n";
    return cod;
}

Blockly.JavaScript['dgpad_circle'] = function(block) {
    var A = block.getFieldValue('a'),
        B = block.getFieldValue('b'),
        C = block.getFieldValue('c');
    // var name = "T("+AB+" "+C+")";
    // name="A_"+$U.base32.encode(name).replace(/\=/g,"")
    var cod = A + "=Circle(\"" + A + "\"," + B + "," + C + ");\n";
    return cod;
}





