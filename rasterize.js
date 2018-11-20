/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0; const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0; const WIN_TOP = 1;  // default top and bottom y coords in world space
const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog4/triangles.json"; // triangles file loc
const INPUT_SPHERES_URL = "https://ncsucgclass.github.io/prog4/spheres.json"; // spheres file loc
const BASE_URL = "https://ncsucgclass.github.io/prog4/";
var Eye = new vec4.fromValues(0.5,0.5,-0.5,1.0); // default eye position in world space
//var inputTriangles;
var triangles = [];
/* webgl globals */
var gl = null; // the all powerful gl object. It's all here folks!
var vertexBuffer = []; // this contains vertex coordinates in triples
var normalBuffer = [];
var triangleBuffer = []; // this contains indices into vertexBuffer in triples
var ambientBuffer = [];
var diffuseBuffer = [];
var specularBuffer = [];
var nBuffer = [];
var triBufferSize = []; // the number of indices in the triangle buffer
var vertexPositionAttrib; // where to put position for vertex shader
var vertexNormalAttrib;
var textureCoordAttribute
var numSets;

var eye = vec3.fromValues(0.5,0.5,-0.5);
var center = vec3.fromValues(0.5,0.5,0.0);
var up = vec3.fromValues(0,1,0);
var right = vec3.fromValues(1,0,0);

var xAxis = vec3.fromValues(1,0,0);
var yAxis = vec3.fromValues(0,1,0);
var zAxis = vec3.fromValues(0,0,1);
var lookAt = vec3.fromValues(0,0,1);
var lookUp = vec3.fromValues(0,1,0);
var rotate = Math.PI/180;
var viewDelta = Math.PI/180;


var lightAmbient = vec3.fromValues(1,1,1);
var lightDiffuse = vec3.fromValues(1,1,1);
var lightSpecular = vec3.fromValues(1,1,1);
var lightPosition = vec3.fromValues(-3,1,-0.5);
var lightOn = true;

var eyePositionUniformLoc;
var lightAmbientUniformLoc;
var lightDiffuseUniformLoc;
var lightSpecularUniformLoc;
var lightPositionUniformLoc;


var ambientUniformLoc;
var diffuseUniformLoc;
var specularUniformLoc;
var alphaUniformLoc;
var nUniformLoc;
var lightOnUniformLoc;

var colorSamplerUniformLoc;

var vPosAttributeLoc;
var vNormAttribLoc;
var mMatrixUniformLoc;
var pvmMatrixUniformLoc;

var currModelIndex = null;

const cube = [
    // Front face
    [-1.0, -1.0,  1.0],
     [1.0, -1.0,  1.0],
     [1.0,  1.0,  1.0],
    [-1.0,  1.0,  1.0],

    // Back face
    [-1.0, -1.0, -1.0],
    [-1.0,  1.0, -1.0],
     [1.0,  1.0, -1.0],
     [1.0, -1.0, -1.0],

    // Top face
    [-1.0,  1.0, -1.0],
    [-1.0,  1.0,  1.0],
     [1.0,  1.0,  1.0],
     [1.0,  1.0, -1.0],

    // Bottom face
    [-1.0, -1.0, -1.0],
    [ 1.0, -1.0, -1.0],
    [ 1.0, -1.0,  1.0],
    [-1.0, -1.0,  1.0],

    // Right face
     [1.0, -1.0, -1.0],
     [1.0,  1.0, -1.0],
     [1.0,  1.0,  1.0],
     [1.0, -1.0,  1.0],

    // Left face
    [-1.0, -1.0, -1.0],
    [-1.0, -1.0,  1.0],
    [-1.0,  1.0,  1.0],
    [-1.0,  1.0, -1.0],
  ];
const normals = [
	[0, 0, -1], [0, 0,-1], [0, 0,-1], // front
	[0, 0, 1], [0, 0, 1], [0, 0, 1], //back
	[0, 0, -1], [0, 0,-1], [0, 0,-1], //
	[0, 0, -1], [0, 0,-1], [0, 0,-1],
	[0, 0, -1], [0, 0,-1], [0, 0,-1],
	[0, 0, -1], [0, 0,-1], [0, 0,-1],
]
var inputTriangles = [
  {
    "material": {"ambient": [0.1,0.1,0.1], "diffuse": [1.0, 1.0, 1.0], "specular": [0.3,0.3,0.3], "n": 11, "alpha": 0.9, "texture": "abe.png"}, 
    "vertices": cube,
    "normals": [[0, 0, -1],[0, 0,-1],[0, 0,-1]],
    "uvs": [[0,0], [0.5,1], [1,0]],
    "triangles": [
    [0,  1,  2],      [0,  2,  3],    // front
    [4,  5,  6],      [4,  6,  7],    // back
    [8,  9,  10],     [8,  10, 11],   // top
    [12, 13, 14],     [12, 14, 15],   // bottom
    [16, 17, 18],     [16, 18, 19],   // right
    [20, 21, 22],     [20, 22, 23],   // left
	]
  }
];


// ASSIGNMENT HELPER FUNCTIONS

// get the JSON file from the passed URL
function getJSONFile(url,descr) {
    try {
        if ((typeof(url) !== "string") || (typeof(descr) !== "string"))
            throw "getJSONFile: parameter not a string";
        else {
            var httpReq = new XMLHttpRequest(); // a new http request
            httpReq.open("GET",url,false); // init the request
            httpReq.send(null); // send the request
            var startTime = Date.now();
            while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                if ((Date.now()-startTime) > 3000)
                    break;
            } // until its loaded or we time out after three seconds
            if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                throw "Unable to open "+descr+" file!";
            else
                return JSON.parse(httpReq.response);
        } // end if good params
    } // end try

    catch(e) {
        console.log(e);
        return(String.null);
    }
} // end get input spheres

function handleKeyDown(event){
    const dir = {"left": -1, "cw":1, "ccw":-1, "right":1, "forward":1, "backward":-1};

    var viewRight = vec3.create(),
        temp = vec3.create();
/*
    function translateModel(model){
        vec3.scale(viewRight,viewDelta)
        vec3.add(model.translation,model.translation,offset);
    } */
    function rotateModel(model, direction, axis){
		var rotation = mat4.create();

		mat4.fromRotation(rotation, direction * rotate, axis);
		vec3.transformMat4(model.xAxis, model.xAxis, rotation);
		vec3.transformMat4(model.yAxis, model.yAxis, rotation);
		vec3.transformMat4(model.zAxis, model.zAxis, rotation);
    }
    vec3.normalize(viewRight, vec3.cross(viewRight, lookAt, lookUp));

    switch(event.key){
        // change view
        case "w":
			vec3.add(eye,eye,vec3.scale(temp,lookUp,viewDelta));
            break;
        case "a":
			vec3.add(eye,eye,vec3.scale(temp,viewRight,-viewDelta));
            break;
        case "s":
			vec3.add(eye,eye,vec3.scale(temp,lookUp,-viewDelta));
            break;
        case "d":
			vec3.add(eye,eye,vec3.scale(temp,viewRight,viewDelta));
            break;
        case "W":
            vec3.rotateX(lookAt, lookAt, eye, -viewDelta);
			vec3.rotateX(lookUp, lookUp, eye, -viewDelta);
            break;
        case "A":
            vec3.rotateY(lookAt, lookAt, eye, -viewDelta);
            break;
        case "S":
            vec3.rotateX(lookAt, lookAt, eye, viewDelta);
			vec3.rotateX(lookUp, lookUp, eye, viewDelta);
            break;
        case "D":
            vec3.rotateY(lookAt, lookAt, eye, viewDelta);
            break;


        // select model
        case "ArrowLeft":
            currModelIndex = (currModelIndex - 1 + inputTriangles.length) % inputTriangles.length;
            break;
        case "ArrowRight":
            currModelIndex = (currModelIndex + 1) % inputTriangles.length;
            break;
        case " ":
            inputTriangles[currModelIndex].highlight = !inputTriangles[currModelIndex].highlight;
            break;

        // change lighting
        case "b":
            lightOn = !lightOn;
			console.log(lightOn);
            break;
        case "n":
            inputTriangles[currModelIndex].material.n = (inputTriangles[currModelIndex].material.n + 1) % 21;
            break;
        case "1":
            inputTriangles[currModelIndex].material.ambient[0] = (inputTriangles[currModelIndex].material.ambient[0] + 0.10).toFixed(2) % 1.1;
            inputTriangles[currModelIndex].material.ambient[1] = (inputTriangles[currModelIndex].material.ambient[1] + 0.10).toFixed(2) % 1.1;
            inputTriangles[currModelIndex].material.ambient[2] = (inputTriangles[currModelIndex].material.ambient[2] + 0.10).toFixed(2) % 1.1;
            break;
        case "2":
            inputTriangles[currModelIndex].material.diffuse[0] = (inputTriangles[currModelIndex].material.diffuse[0] + 0.10).toFixed(2) % 1.1;
            inputTriangles[currModelIndex].material.diffuse[1] = (inputTriangles[currModelIndex].material.diffuse[1] + 0.10).toFixed(2) % 1.1;
            inputTriangles[currModelIndex].material.diffuse[2] = (inputTriangles[currModelIndex].material.diffuse[2] + 0.10).toFixed(2) % 1.1;
            break;
        case "3":
            inputTriangles[currModelIndex].material.specular[0] = (inputTriangles[currModelIndex].material.specular[0] + 0.10).toFixed(2) % 1.1;
            inputTriangles[currModelIndex].material.specular[1] = (inputTriangles[currModelIndex].material.specular[1] + 0.10).toFixed(2) % 1.1;
            inputTriangles[currModelIndex].material.specular[2] = (inputTriangles[currModelIndex].material.specular[2] + 0.10).toFixed(2) % 1.1;
            break;
        case "k":
            vec3.add(inputTriangles[currModelIndex].translation, inputTriangles[currModelIndex].translation, vec3.scale(temp, right, viewDelta));
            break;
        case ";":
            vec3.add(inputTriangles[currModelIndex].translation, inputTriangles[currModelIndex].translation, vec3.scale(temp, right, -viewDelta));
            break;
        case "o":
            vec3.add(inputTriangles[currModelIndex].translation, inputTriangles[currModelIndex].translation, vec3.scale(temp, lookAt, viewDelta));
            break;
        case "l":
            vec3.add(inputTriangles[currModelIndex].translation, inputTriangles[currModelIndex].translation, vec3.scale(temp, lookAt, -viewDelta));
            break;
        case "i":
            vec3.add(inputTriangles[currModelIndex].translation, inputTriangles[currModelIndex].translation, vec3.scale(temp, lookUp, viewDelta));
            break;
        case "p":
            vec3.add(inputTriangles[currModelIndex].translation, inputTriangles[currModelIndex].translation, vec3.scale(temp, lookUp, -viewDelta));
            break;
        case "K":
			rotateModel(inputTriangles[currModelIndex], dir.left, yAxis);
			break;
		case ":":
			rotateModel(inputTriangles[currModelIndex], dir.right, yAxis);
			break;
        case "O":
			rotateModel(inputTriangles[currModelIndex], dir.forward, xAxis);
			break;
        case "L":
			rotateModel(inputTriangles[currModelIndex], dir.backward, xAxis);
			break;
        case "I":
			rotateModel(inputTriangles[currModelIndex], dir.cw, zAxis);
			break;
        case "P":
			rotateModel(inputTriangles[currModelIndex], dir.ccw, zAxis);
			break;
    }



	vec3.normalize(lookAt, lookAt); // sanity check
	vec3.normalize(lookUp, lookUp);

}


// set up the webGL environment
function setupWebGL() {
	
	
	document.onkeydown = handleKeyDown; // call this when key pressed
	 // Get the image canvas, render an image in it
     var imageCanvas = document.getElementById("myImageCanvas"); // create a 2d canvas
      var cw = imageCanvas.width, ch = imageCanvas.height; 
      imageContext = imageCanvas.getContext("2d"); 
      var bkgdImage = new Image(); 
      bkgdImage.crossOrigin = "Anonymous";
      bkgdImage.src = "https://ncsucgclass.github.io/prog4/sky.jpg";
      bkgdImage.onload = function(){
          var iw = bkgdImage.width, ih = bkgdImage.height;
          imageContext.drawImage(bkgdImage,0,0,iw,ih,0,0,cw,ch);   
     } // end onload callback
    
     // create a webgl canvas and set it up
     var webGLCanvas = document.getElementById("myWebGLCanvas"); // create a webgl canvas
     gl = webGLCanvas.getContext("webgl"); // get a webgl object from it
    try {
      if (gl == null) {
        throw "unable to create gl context -- is your browser gl ready?";
      } else {
        //gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
        gl.clearDepth(1.0); // use max when we clear the depth buffer
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
      }
    } // end try

    catch(e) {
      console.log(e);
    } // end catch

} // end setupWebGL

// read triangles in, load them into webgl buffers
function loadTriangles() {
    if (inputTriangles != String.null) {
        var whichSetVert; // index of vertex in current triangle set
        var whichSetTri; // index of triangle in current triangle set
        //var vertexBufferSize = 0;
        numSets = inputTriangles.length;
        if (numSets > 0)
            currModelIndex = 0;
		for (var whichSet=0; whichSet < inputTriangles.length; whichSet++) {
            /*
            // ************************************************************************
            var currSet = inputTriangles[whichSet];
            for (var triangle = 0; triangle < currSet.triangles.length; triangle++){
                var coordArray = []; // 1D array of vertex coords for WebGL
                var indexArray = []; // 1D array of vertex indices for triangles
                var normalArray = [];
                var uvsArray = [];
                var tri = vec3.create();
                triangles.push(new Object());

                //triBufferSize[whichSet] = 0;

    			// initialize initial translation, rotation, scale values
    			triangles[triangle].scale = vec3.create();
    			triangles[triangle].translation = vec3.fromValues(0,0,0);
    			triangles[triangle].xAxis = vec3.fromValues(1,0,0);
    			triangles[triangle].yAxis = vec3.fromValues(0,1,0);
    			triangles[triangle].zAxis = vec3.fromValues(0,0,1);
    			triangles[triangle].center = vec3.create();
                triangles[triangle].highlight = false;

                // set up the vertex coord array
                for (whichSetVert=0; whichSetVert<currSet.triangles[triangle].length; whichSetVert++){

                    var vtx = currSet.vertices[currSet.triangles[triangle][whichSetVert]];
                    var normalToAdd = currSet.normals[currSet.triangles[triangle][whichSetVert]];
                    var uvsToAdd = currSet.uvs[currSet.triangles[triangle][whichSetVert]]

    				coordArray = coordArray.concat(vtx);
                    normalArray = normalArray.concat(normalToAdd);
                    uvsArray = uvsArray.concat(uvsToAdd)
    				vec3.add(triangles[triangle].center, triangles[triangle].center, vtx);
                }
    			vec3.scale(triangles[triangle].center,triangles[triangle].center,1/3);
                // set up the triangle indicies array
    			for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].triangles.length; whichSetTri++){
                    indexArray = indexArray.concat(inputTriangles[whichSet].triangles[whichSetTri]);
                }


                triBufferSize[triangle] = 3; // total number of indices

                inputTriangles[whichSet].coordArray = coordArray;
                inputTriangles[whichSet].normalArray = normalArray;
                inputTriangles[whichSet].uvsArray = uvsArray;
                inputTriangles[whichSet].indexArray = indexArray;
                inputTriangles[whichSet].triBufferSize = triBufferSize;

                // send the vertex coords to webGL
                inputTriangles[whichSet].vertexBuffer = gl.createBuffer(); // init empty vertex coord buffer
                gl.bindBuffer(gl.ARRAY_BUFFER,inputTriangles[whichSet].vertexBuffer); // activate that buffer
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].coordArray),gl.STATIC_DRAW); // coords to that buffer

                // send normals to webGL
                inputTriangles[whichSet].normalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, inputTriangles[whichSet].normalBuffer); // activate that buffer
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].normalArray),gl.STATIC_DRAW); // coords to that buffer

                inputTriangles[whichSet].textureBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, inputTriangles[whichSet].textureBuffer); // activate that buffer
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].uvsArray),gl.STATIC_DRAW);

        		// send the triangle coords to webGL
                inputTriangles[whichSet].triangleBuffer = gl.createBuffer(); // init empty vertex coord buffer
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, inputTriangles[whichSet].triangleBuffer); // activate that buffer
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(inputTriangles[whichSet].indexArray),gl.STATIC_DRAW); // coords to that buffer
            }
                */

                var coordArray = []; // 1D array of vertex coords for WebGL
                var indexArray = []; // 1D array of vertex indices for triangles
                var normalArray = [];
                var uvsArray = [];
                var tri = vec3.create();

                triBufferSize[whichSet] = 0;

    			// initialize initial translation, rotation, scale values
    			inputTriangles[whichSet].scale = vec3.create();
    			inputTriangles[whichSet].translation = vec3.fromValues(0,0,0);
    			inputTriangles[whichSet].xAxis = vec3.fromValues(1,0,0);
    			inputTriangles[whichSet].yAxis = vec3.fromValues(0,1,0);
    			inputTriangles[whichSet].zAxis = vec3.fromValues(0,0,1);
    			inputTriangles[whichSet].center = vec3.create();
                inputTriangles[whichSet].highlight = false;

                // set up the vertex coord array
                for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++){
                    var vtx = inputTriangles[whichSet].vertices[whichSetVert]
    				coordArray = coordArray.concat(vtx);
                    normalArray = normalArray.concat(inputTriangles[whichSet].normals[whichSetVert]);
                    uvsArray = uvsArray.concat(inputTriangles[whichSet].uvs[whichSetVert])
    				vec3.add(inputTriangles[whichSet].center, inputTriangles[whichSet].center, vtx);
                }
    			vec3.scale(inputTriangles[whichSet].center,inputTriangles[whichSet].center,1/inputTriangles[whichSet].vertices.length);
                // set up the triangle indicies array

                for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].triangles.length; whichSetTri++){
                    indexArray = indexArray.concat(inputTriangles[whichSet].triangles[whichSetTri]);
                }

                //vertexBufferSize += inputTriangles[whichSet].vertices.length;
    			triBufferSize[whichSet] += inputTriangles[whichSet].triangles.length; // number of triangles

                triBufferSize[whichSet] *= 3; // total number of indices

                inputTriangles[whichSet].coordArray = coordArray;
                inputTriangles[whichSet].normalArray = normalArray;
                inputTriangles[whichSet].uvsArray = uvsArray;
                inputTriangles[whichSet].indexArray = indexArray;
                inputTriangles[whichSet].triBufferSize = triBufferSize;

                // send the vertex coords to webGL
                inputTriangles[whichSet].vertexBuffer = gl.createBuffer(); // init empty vertex coord buffer
                gl.bindBuffer(gl.ARRAY_BUFFER,inputTriangles[whichSet].vertexBuffer); // activate that buffer
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].coordArray),gl.STATIC_DRAW); // coords to that buffer

                // send normals to webGL
                inputTriangles[whichSet].normalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, inputTriangles[whichSet].normalBuffer); // activate that buffer
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].normalArray),gl.STATIC_DRAW); // coords to that buffer

                inputTriangles[whichSet].textureBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, inputTriangles[whichSet].textureBuffer); // activate that buffer
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].uvsArray),gl.STATIC_DRAW);

                inputTriangles[whichSet].triangleBuffer = [];
                //console.log( inputTriangles[whichSet].triangles.length);
                for (var i = 0; i < inputTriangles[whichSet].triangles.length; i++){
                    // send the triangle coords to webGL
                    inputTriangles[whichSet].triangleBuffer[i] = gl.createBuffer(); // init empty vertex coord buffer
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, inputTriangles[whichSet].triangleBuffer[i]); // activate that buffer
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(inputTriangles[whichSet].triangles[i]),gl.STATIC_DRAW); // coords to that buffer
                }

            //*****************************
            /*
            var coordArray = []; // 1D array of vertex coords for WebGL
            var indexArray = []; // 1D array of vertex indices for triangles
            var normalArray = [];
            var uvsArray = [];
            var tri = vec3.create();

            triBufferSize[whichSet] = 0;

			// initialize initial translation, rotation, scale values
			inputTriangles[whichSet].scale = vec3.create();
			inputTriangles[whichSet].translation = vec3.fromValues(0,0,0);
			inputTriangles[whichSet].xAxis = vec3.fromValues(1,0,0);
			inputTriangles[whichSet].yAxis = vec3.fromValues(0,1,0);
			inputTriangles[whichSet].zAxis = vec3.fromValues(0,0,1);
			inputTriangles[whichSet].center = vec3.create();
            inputTriangles[whichSet].highlight = false;

            // set up the vertex coord array
            for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++){
                var vtx = inputTriangles[whichSet].vertices[whichSetVert]
				coordArray = coordArray.concat(vtx);
                normalArray = normalArray.concat(inputTriangles[whichSet].normals[whichSetVert]);
                uvsArray = uvsArray.concat(inputTriangles[whichSet].uvs[whichSetVert])
				vec3.add(inputTriangles[whichSet].center, inputTriangles[whichSet].center, vtx);
            }
			vec3.scale(inputTriangles[whichSet].center,inputTriangles[whichSet].center,1/inputTriangles[whichSet].vertices.length);
            // set up the triangle indicies array
			for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].triangles.length; whichSetTri++){
                indexArray = indexArray.concat(inputTriangles[whichSet].triangles[whichSetTri]);
            }

            //vertexBufferSize += inputTriangles[whichSet].vertices.length;
			triBufferSize[whichSet] += inputTriangles[whichSet].triangles.length; // number of triangles

            triBufferSize[whichSet] *= 3; // total number of indices

            inputTriangles[whichSet].coordArray = coordArray;
            inputTriangles[whichSet].normalArray = normalArray;
            inputTriangles[whichSet].uvsArray = uvsArray;
            inputTriangles[whichSet].indexArray = indexArray;
            inputTriangles[whichSet].triBufferSize = triBufferSize;

            // send the vertex coords to webGL
            inputTriangles[whichSet].vertexBuffer = gl.createBuffer(); // init empty vertex coord buffer
            gl.bindBuffer(gl.ARRAY_BUFFER,inputTriangles[whichSet].vertexBuffer); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].coordArray),gl.STATIC_DRAW); // coords to that buffer

            // send normals to webGL
            inputTriangles[whichSet].normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, inputTriangles[whichSet].normalBuffer); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].normalArray),gl.STATIC_DRAW); // coords to that buffer

            inputTriangles[whichSet].textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, inputTriangles[whichSet].textureBuffer); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(inputTriangles[whichSet].uvsArray),gl.STATIC_DRAW);

    		// send the triangle coords to webGL
            inputTriangles[whichSet].triangleBuffer = gl.createBuffer(); // init empty vertex coord buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, inputTriangles[whichSet].triangleBuffer); // activate that buffer
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(inputTriangles[whichSet].indexArray),gl.STATIC_DRAW); // coords to that buffer
            */
        } // end for each triangle set

    } // end if triangles found
} // end load triangles

// setup the webGL shaders
function setupShaders() {

    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        precision mediump float;

        uniform vec3 uAmbient;
        uniform vec3 uDiffuse;
        uniform vec3 uSpecular;
        uniform float uN;

        uniform vec3 uAmbientLight;
        uniform vec3 uDiffuseLight;
        uniform vec3 uSpecularLight;
        uniform vec3 uPositionLight;

        uniform float alpha;

        uniform sampler2D uColorSampler;

        uniform vec3 uEyePosition;
        uniform vec3 uLightPosition;

        varying vec3 vWorldPosition;
        varying vec3 vVertexNormal;
        varying vec2 vTextureCoord;

        uniform bool uLighting;

        void main(void) {
            //vec4 fragColor =  vec4(1.0, 1.0, 1.0, 1.0);
            vec4 fragColor = texture2D(uColorSampler, vec2(vTextureCoord.s, vTextureCoord.t));

            vec3 n = normalize(vVertexNormal);
            vec3 l = normalize(uLightPosition - vWorldPosition);
            float nl = abs(dot(n, l));

            // ambient
            vec3 ambient = uAmbient * uAmbientLight;

            // diffuse
            vec3 diffuse = uDiffuse * uDiffuseLight * nl;

            //specular
            float specFactor;
            vec3 V = normalize(uEyePosition - vWorldPosition);
			vec3 H = normalize(abs(l + V));
            specFactor = pow(max(0.0, dot(n,H)), uN);
            vec3 specular = uSpecular * uSpecularLight * specFactor;
			
			if (uLighting){
				gl_FragColor = vec4(fragColor.rgb * (ambient + diffuse + specular), fragColor.a * alpha);
			} else {
				
				gl_FragColor = vec4(fragColor.rgb, fragColor.a);
			}
		}
    `;

    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        attribute vec3 vertexPosition;
        attribute vec3 vertexNormal;
        attribute vec2 textureCoord;

        uniform mat4 mMatrix;
        uniform mat4 pvmMatrix;

        varying vec3 vWorldPosition;
		varying vec3 vVertexNormal;
        varying vec2 vTextureCoord;

        void main(void) {
			vec4 mvPosition = mMatrix * vec4(vertexPosition, 1.0);
			vWorldPosition = vec3(mvPosition.x, mvPosition.y, mvPosition.z);
			vec4 vWorldNormal = mMatrix * vec4(vertexNormal, 0.0);
			vVertexNormal = normalize(vec3(vWorldNormal.x,vWorldNormal.y, vWorldNormal.z ));
            vTextureCoord = textureCoord;

            gl_Position = pvmMatrix * vec4(vertexPosition, 1.0);
        }
    `;

    try {
        // console.log("fragment shader: "+fShaderCode);
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
        gl.shaderSource(fShader,fShaderCode); // attach code to shader
        gl.compileShader(fShader); // compile the code for gpu execution

        // console.log("vertex shader: "+vShaderCode);
        var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
        gl.shaderSource(vShader,vShaderCode); // attach code to shader
        gl.compileShader(vShader); // compile the code for gpu execution

        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);
            gl.deleteShader(vShader);
        } else { // no compile errors
            var shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)
                vertexPositionAttrib = gl.getAttribLocation(shaderProgram, "vertexPosition");
                gl.enableVertexAttribArray(vertexPositionAttrib); // input to shader from array
				vertexNormalAttrib = gl.getAttribLocation(shaderProgram, "vertexNormal");
                gl.enableVertexAttribArray(vertexNormalAttrib);
                textureCoordAttribute = gl.getAttribLocation(shaderProgram, "textureCoord");
                gl.enableVertexAttribArray(textureCoordAttribute);

                mMatrixUniformLoc = gl.getUniformLocation(shaderProgram, "mMatrix");
                pvmMatrixUniformLoc = gl.getUniformLocation(shaderProgram, "pvmMatrix");


                eyePositionUniformLoc = gl.getUniformLocation(shaderProgram, "uEyePosition");
                lightAmbientUniformLoc = gl.getUniformLocation(shaderProgram, "uAmbientLight");
                lightDiffuseUniformLoc = gl.getUniformLocation(shaderProgram, "uDiffuseLight");
                lightSpecularUniformLoc = gl.getUniformLocation(shaderProgram, "uSpecularLight");
                lightPositionUniformLoc = gl.getUniformLocation(shaderProgram, "uLightPosition");

                ambientUniformLoc = gl.getUniformLocation(shaderProgram, "uAmbient");
                diffuseUniformLoc = gl.getUniformLocation(shaderProgram, "uDiffuse");
                specularUniformLoc = gl.getUniformLocation(shaderProgram, "uSpecular");
                alphaUniformLoc = gl.getUniformLocation(shaderProgram, "alpha");
                nUniformLoc = gl.getUniformLocation(shaderProgram, "uN");
                lightOnUniformLoc = gl.getUniformLocation(shaderProgram, "uLighting");

                colorSamplerUniformLoc = gl.getUniformLocation(shaderProgram, "uColorSampler");

                gl.uniform3fv(eyePositionUniformLoc,eye);
                gl.uniform3fv(lightAmbientUniformLoc,lightAmbient);
                gl.uniform3fv(lightDiffuseUniformLoc,lightDiffuse);
                gl.uniform3fv(lightSpecularUniformLoc,lightSpecular);
                gl.uniform3fv(lightPositionUniformLoc,lightPosition);
            } // end if no shader program link errors
        } // end if no compile errors
    } // end try

    catch(e) {
        console.log(e);
    } // end catch
} // end setup shaders

// render the loaded model
function renderTriangles() {
	// helper function for performing transforms
    function generateModelMatrixTransform(model){
		//var z = vec3.create();
		var rotation = mat4.create();
		var pos = mat4.create();
		var temp = mat4.create();
        model.mMatrix = mat4.create();
		// move model to center
		mat4.fromTranslation(model.mMatrix,vec3.negate(vec3.create(),model.center));

		//vec3.normalize(z, vec3.cross(z,model.yAxis,model.xAxis));
		
        if (model.highlight){
            mat4.multiply(model.mMatrix, mat4.fromScaling(pos, vec3.fromValues(1.2, 1.2, 1.2)), model.mMatrix);
        }

		// create rotation model
		mat4.set(
			rotation,
			model.xAxis[0], model.yAxis[0], model.zAxis[0], 0,
			model.xAxis[1], model.yAxis[1], model.zAxis[1], 0,
			model.xAxis[2], model.yAxis[2], model.zAxis[2], 0,
			0,0,0,1
			);
		mat4.multiply(model.mMatrix, rotation, model.mMatrix);

		// move back to model's center
		mat4.multiply(model.mMatrix, mat4.fromTranslation(pos, model.center), model.mMatrix);
        // apply interactive model translations
		mat4.multiply(model.mMatrix, mat4.fromTranslation(pos, model.translation), model.mMatrix);
	}

	var pvMatrix = mat4.create();
	var vMatrix = mat4.create();
	var pvmMatrix = mat4.create();
	var temp = vec3.create();

	mat4.perspective(pvMatrix, Math.PI / 2, 1 ,0.1 , 5); // create perspective matrix
	mat4.lookAt(vMatrix, eye, vec3.add(temp, eye,lookAt), lookUp); // view matrix
	mat4.multiply(pvMatrix, pvMatrix, vMatrix);


	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers
    requestAnimationFrame(renderTriangles);
    // organize triangles based on z
    // depth sorting by model
	for (var i = 0; i < inputTriangles.length; i++){
		generateModelMatrixTransform(inputTriangles[i]);
	}
    let render_triangles = [];

    // depth sorting: get all triangles and sort based on distance from eye-z to z value
    for (var i = 0; i < numSets; i++){
        let currSet = inputTriangles[i];
        for (var t = 0; t < currSet.triangles.length; t++){
            var triangle = currSet.triangles[t];
            var center = (currSet.vertices[triangle[0]][2] + currSet.vertices[triangle[1]][2] + currSet.vertices[triangle[2]][2]) / 3;
            render_triangles.push({'setIndex': i, 'depth': currSet.mMatrix[14], 'z':center, "triangleIndex":t})
        }

    }
	
	render_triangles.sort((x,y) => {
		return y.depth - x.depth;
	});
	
	//console.log(render_triangles);
    for ( var i = 0; i < render_triangles.length; i++){
        let currSet = inputTriangles[render_triangles[i]['setIndex']];
        if (currSet.material.alpha !== undefined && currSet.material.alpha < 1){
            gl.depthMask(false);
        }
        mat4.multiply(pvmMatrix, pvMatrix, currSet.mMatrix );
        gl.uniformMatrix4fv(mMatrixUniformLoc, false, currSet.mMatrix);
        gl.uniformMatrix4fv(pvmMatrixUniformLoc, false, pvmMatrix);


        gl.uniform3fv(ambientUniformLoc, currSet.material.ambient);
        gl.uniform3fv(diffuseUniformLoc, currSet.material.diffuse);
        gl.uniform3fv(specularUniformLoc, currSet.material.specular);
        gl.uniform1f(alphaUniformLoc, currSet.material.alpha);
        gl.uniform1f(nUniformLoc, currSet.material.n);
        gl.uniform1i(lightOnUniformLoc, lightOn);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, currSet.texture);

        // vertex buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, currSet.vertexBuffer); // activate
        gl.vertexAttribPointer(vertexPositionAttrib,3,gl.FLOAT,false,0,0); // feed

		gl.bindBuffer(gl.ARRAY_BUFFER, currSet.normalBuffer);
		gl.vertexAttribPointer(vertexNormalAttrib,3,gl.FLOAT,false,0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, currSet.textureBuffer);
        gl.vertexAttribPointer(textureCoordAttribute,2,gl.FLOAT,false,0,0);
		/*
        for (var j = 0; j < currSet.triangles.length; j++){
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, currSet.triangleBuffer[j]);
            gl.drawElements(gl.TRIANGLES,3,gl.UNSIGNED_SHORT,0); // render
        }
		*/
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, currSet.triangleBuffer[render_triangles[i]['triangleIndex']]);
        gl.drawElements(gl.TRIANGLES,3,gl.UNSIGNED_SHORT,0); // render
    }

} // end render triangles

function loadTextures(){
    // this was found at https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
    // ¯\_(ツ)_/¯
    function isPowerOf2(value) {
      return (value & (value - 1)) == 0;
    }

    function loadTexture(filename){
        const texture = gl.createTexture();
        //gl.bindTexture(gl.TEXTURE_2D, texture);
		const level = 0;
		  const internalFormat = gl.RGBA;
		  const width = 1;
		  const height = 1;
		  const border = 0;
		  const srcFormat = gl.RGBA;
		  const srcType = gl.UNSIGNED_BYTE;
		  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
		  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
						width, height, border, srcFormat, srcType,
						pixel);
		
          //gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,width, height, border, srcFormat, srcType,pixel);
        /*const image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = (() => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
               // Yes, it's a power of 2. Generate mips.
               gl.generateMipmap(gl.TEXTURE_2D);

            } else {
               // No, it's not a power of 2. Turn of mips and set
               // wrapping to clamp to edge
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        });
        image.src = BASE_URL + filename;*/
        return texture;
    }
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue

    for (var whichSet=0; whichSet < inputTriangles.length; whichSet++){
        inputTriangles[whichSet].texture = loadTexture(inputTriangles[whichSet].material.texture);
    }
}

/* MAIN -- HERE is where execution begins after window load */

function main() {
  //document.onkeydown = handleKeyDown;
  
  setupWebGL(); // set up the webGL environment
  loadTriangles(); // load in the triangles from tri file
  loadTextures();
  setupShaders(); // setup the webGL shaders
  renderTriangles(); // draw the triangles using webGL

} // end main
