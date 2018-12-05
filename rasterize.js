/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0; const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0; const WIN_TOP = 1;  // default top and bottom y coords in world space
const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog4/triangles.json"; // triangles file loc
const INPUT_SPHERES_URL = "https://ncsucgclass.github.io/prog4/spheres.json"; // spheres file loc
const BASE_URL = "https://ncsucgclass.github.io/prog4/";
var Eye = new vec4.fromValues(0.5,0.5,-10,1.0); // default eye position in world space
//var snake;
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
var continuousAdd = false;

var speed = 0.25
const PLAYER = -2;
const EMPTY = -1;
const WALL = -3;
const ENEMY = -4;

var eye = vec3.fromValues(0.0,0.0,-5.0);
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
var lightPosition = vec3.fromValues(-2,0.0,-4.0);
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
var texturedUniformLoc;



var colorSamplerUniformLoc;

var vPosAttributeLoc;
var vNormAttribLoc;
var mMatrixUniformLoc;
var pvmMatrixUniformLoc;

var currModelIndex = null;

var grid;
var gridSize = 32;

var offset = -16.0;

const cube_vertices = [
    // Front face
    [0.0, 0.0,  0.0],
     [0.25, 0.0, 0.0],
     [0.25,  0.25,  0.0],
    [ 0.0,  0.25,  0.0],

    // Back face
    [0.0, 0.0, -0.25],
    [0.0,  0.25, -0.25],
     [0.25,  0.25, -0.25],
     [0.25, 0.0, -0.25],

    // Top face
    [0.0,  0.25, 0.0],
    [0.0,  0.25, -0.25],
     [0.25,  0.25, -0.25],
     [0.25,  0.25, 0.0],

    // Bottom face
    [0.0, 0.0, 0.0],
    [ 0.25, 0.0, 0.0],
    [ 0.25, 0.0, -0.25],
    [0.0, 0.0,  -0.25],

    // Right face
     [0.25, 0.0, 0.0],
     [0.25,  0.25, 0.0],
     [0.25,  0.25,  -0.25],
     [0.25, 0.0,  -0.25],

    // Left face
    [0.0, 0.0, 0.0],
    [0.0, 0.0, -0.25],
    [0.0,  0.25, -0.25],
    [0.0,  0.25, 0.0],
  ];
const cube_normals = [
	[0, 0, -1], [0, 0,-1], [0, 0,-1], [0, 0,-1], // front
	[0, 0, 1], [0, 0, 1], [0, 0, 1],[0, 0, 1], //back
	[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],// top
	[0, -1, 0], [0, -1,0], [0, -1,0], [0, -1,0],//bottom
	[1, 0, 0], [1, 0,0], [1, 0,0], [1, 0,0],  // right
	[-1, 0, 0], [-1, 0,0], [-1, 0,0],[-1, 0,0]// left
]

var uvs = [[0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0]
    ];
var cube_triangles = [
[0,  1,  2],      [0,  2,  3],    // front
[4,  5,  6],      [4,  6,  7],    // back
[8,  9,  10],     [8,  10, 11],   // top
[12, 13, 14],     [12, 14, 15],   // bottom
[16, 17, 18],     [16, 18, 19],   // right
[20, 21, 22],     [20, 22, 23],   // left
];

const wall_vertices = [
    // Front face
  [-8.0, 0.0,  0.0],
   [8.0, 0.0,  0.0],
   [8.0,  0.25,  0.0],
  [-8.0,  0.25,  0.0],

  // Back face
  [-8.0, 0.0, -0.25],
  [-8.0,  0.25, -0.25],
   [8.0,  0.25, -0.25],
   [8.0, 0.0, -0.25],

  // Top face
  [-8.0,  0.25, -0.25],
  [-8.0,  0.25,  0.0],
   [8.0,  0.25,  0.0],
   [8.0,  0.25, -0.25],

  // Bottom face
  [-8.0, 0.0, -0.25],
   [8.0, 0.0, -0.25],
   [8.0, 0.0,  0.0],
  [-8.0, 0.0,  0.0],

  // Right face
   [8.0, 0.0, -0.25],
   [8.0,  0.25, -0.25],
   [8.0,  0.25,  0.0],
   [8.0, 0.0,  0.0],

  // Left face
  [-8.0, 0.0, -0.25],
  [-8.0, 0.0,  0.0],
  [-8.0,  0.25,  0.0],
  [-8.0,  0.25, -0.25],
  ];

const wall_normals = [
	[0, 0, -1], [0, 0,-1], [0, 0,-1], [0, 0,-1], // front
	[0, 0, 1], [0, 0, 1], [0, 0, 1],[0, 0, 1], //back
	[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],// top
	[0, -1, 0], [0, -1,0], [0, -1,0], [0, -1,0],//bottom
	[1, 0, 0], [1, 0,0], [1, 0,0], [1, 0,0],  // right
	[-1, 0, 0], [-1, 0,0], [-1, 0,0],[-1, 0,0]// left
]

var wall_uvs = [
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0],
        [0,0], [0,1], [1,1], [1,0]
    ];
var wall_triangles = [
[0,  1,  2],      [0,  2,  3],    // front
[4,  5,  6],      [4,  6,  7],    // back
[8,  9,  10],     [8,  10, 11],   // top
[12, 13, 14],     [12, 14, 15],   // bottom
[16, 17, 18],     [16, 18, 19],   // right
[20, 21, 22],     [20, 22, 23],   // left
];

var cube = {
  "material": {"ambient": [0.1,0.1,0.1], "diffuse": [1.0, 1.0, 1.0], "specular": [0.3,0.3,0.3], "n": 29, "alpha": 1.0, "texture": ""},
  "vertices": cube_vertices,
  "normals": cube_normals,
  "uvs": uvs,
  "triangles": cube_triangles,
  "textured": true
};

var wall = {
    "material": {"ambient": [0.1,0.1,0.1], "diffuse": [1.0, 1.0, 1.0], "specular": [0.0,0.0,0.0], "n": 1, "alpha": 1.0, "texture": ""},
    "vertices": wall_vertices,
    "normals": wall_normals,
    "uvs": wall_uvs,
    "triangles": wall_triangles,
    "textured": false
}

var snake;
var enemy;
var enemyReset = false;
var enemySteps;
var food = [];
var walls = [clone(wall), clone(wall), clone(wall), clone(wall)];

var snakeDir = {"RIGHT":vec3.fromValues(-1,0,0), "LEFT":vec3.fromValues(1,0,0), "UP":vec3.fromValues(0,1,0), "DOWN":vec3.fromValues(0,-1,0)};
var currDir = snakeDir.RIGHT;
var enemyDir;

var snakeInterval;
var enemyInterval;
var cubeStartX = 15;
var cubeStartY = 16;
var foodCounter = 0;

function clone(obj) {
    var copy = {};
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
            copy[attr] = obj[attr];
    }
    return copy;
}

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
			//vec3.add(eye,eye,vec3.scale(temp,lookUp,viewDelta));
            currDir = snakeDir.UP;
            break;
        case "a":
			//vec3.add(eye,eye,vec3.scale(temp,viewRight,-viewDelta));
            currDir = snakeDir.LEFT;
            break;
        case "s":
			//vec3.add(eye,eye,vec3.scale(temp,lookUp,-viewDelta));
            currDir = snakeDir.DOWN;
            break;
        case "d":
			//vec3.add(eye,eye,vec3.scale(temp,viewRight,viewDelta));
            currDir = snakeDir.RIGHT;
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
            currModelIndex = (currModelIndex - 1 + snake.length) % snake.length;
            break;
        case "ArrowRight":
            currModelIndex = (currModelIndex + 1) % snake.length;
            break;
        case " ":
            //snake[currModelIndex].highlight = !snake[currModelIndex].highlight;
            continuousAdd = !continuousAdd;
            break;

        // change lighting
        case "b":
            lightOn = !lightOn;
            break;
        case "n":
            snake[currModelIndex].material.n = (snake[currModelIndex].material.n + 1) % 21;
            break;
        case "1":
            snake[currModelIndex].material.ambient[0] = (snake[currModelIndex].material.ambient[0] + 0.10).toFixed(2) % 1.1;
            snake[currModelIndex].material.ambient[1] = (snake[currModelIndex].material.ambient[1] + 0.10).toFixed(2) % 1.1;
            snake[currModelIndex].material.ambient[2] = (snake[currModelIndex].material.ambient[2] + 0.10).toFixed(2) % 1.1;
            break;
        case "2":
            snake[currModelIndex].material.diffuse[0] = (snake[currModelIndex].material.diffuse[0] + 0.10).toFixed(2) % 1.1;
            snake[currModelIndex].material.diffuse[1] = (snake[currModelIndex].material.diffuse[1] + 0.10).toFixed(2) % 1.1;
            snake[currModelIndex].material.diffuse[2] = (snake[currModelIndex].material.diffuse[2] + 0.10).toFixed(2) % 1.1;
            break;
        case "3":
            snake[currModelIndex].material.specular[0] = (snake[currModelIndex].material.specular[0] + 0.10).toFixed(2) % 1.1;
            snake[currModelIndex].material.specular[1] = (snake[currModelIndex].material.specular[1] + 0.10).toFixed(2) % 1.1;
            snake[currModelIndex].material.specular[2] = (snake[currModelIndex].material.specular[2] + 0.10).toFixed(2) % 1.1;
            break;
        case "k":
            vec3.add(snake[currModelIndex].translation, snake[currModelIndex].translation, vec3.scale(temp, right, speed));
            break;
        case ";":
            vec3.add(snake[currModelIndex].translation, snake[currModelIndex].translation, vec3.scale(temp, right, -speed));
            break;
        case "o":
            vec3.add(snake[currModelIndex].translation, snake[currModelIndex].translation, vec3.scale(temp, lookAt, speed));
            break;
        case "l":
            vec3.add(snake[currModelIndex].translation, snake[currModelIndex].translation, vec3.scale(temp, lookAt, -speed));
            break;
        case "i":
            vec3.add(snake[currModelIndex].translation, snake[currModelIndex].translation, vec3.scale(temp, lookUp, speed));
            break;
        case "p":
            vec3.add(snake[currModelIndex].translation, snake[currModelIndex].translation, vec3.scale(temp, lookUp, -speed));
            break;
        case "K":
			rotateModel(snake[currModelIndex], dir.left, yAxis);
			break;
		case ":":
			rotateModel(snake[currModelIndex], dir.right, yAxis);
			break;
        case "O":
			rotateModel(snake[currModelIndex], dir.forward, xAxis);
			break;
        case "L":
			rotateModel(snake[currModelIndex], dir.backward, xAxis);
			break;
        case "I":
			rotateModel(snake[currModelIndex], dir.cw, zAxis);
			break;
        case "P":
			rotateModel(snake[currModelIndex], dir.ccw, zAxis);
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
      bkgdImage.crossOrigin = null;
      bkgdImage.src = "unnamed.png";
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

function loadSnakeSegment(whichSnake, whichSet){
    var whichSetVert;
    var coordArray = []; // 1D array of vertex coords for WebGL
    var indexArray = []; // 1D array of vertex indices for triangles
    var normalArray = [];
    var uvsArray = [];
    var tri = vec3.create();

    triBufferSize[whichSet] = 0;

    // initialize initial translation, rotation, scale values
    whichSnake[whichSet].scale = vec3.create();
    whichSnake[whichSet].translation = vec3.fromValues(0,0,0);
    whichSnake[whichSet].xAxis = vec3.fromValues(1,0,0);
    whichSnake[whichSet].yAxis = vec3.fromValues(0,1,0);
    whichSnake[whichSet].zAxis = vec3.fromValues(0,0,1);
    whichSnake[whichSet].center = vec3.create();
    whichSnake[whichSet].highlight = false;

    // set up the vertex coord array
    for (whichSetVert=0; whichSetVert<whichSnake[whichSet].vertices.length; whichSetVert++){
        var vtx = whichSnake[whichSet].vertices[whichSetVert]
        coordArray = coordArray.concat(vtx);
        normalArray = normalArray.concat(whichSnake[whichSet].normals[whichSetVert]);
        uvsArray = uvsArray.concat(whichSnake[whichSet].uvs[whichSetVert])
        vec3.add(whichSnake[whichSet].center, whichSnake[whichSet].center, vtx);
    }
    vec3.scale(whichSnake[whichSet].center,whichSnake[whichSet].center,1/whichSnake[whichSet].vertices.length);
    // set up the triangle indicies array

    for (whichSetTri=0; whichSetTri<whichSnake[whichSet].triangles.length; whichSetTri++){
        indexArray = indexArray.concat(whichSnake[whichSet].triangles[whichSetTri]);
    }
    //vertexBufferSize += whichSnake[whichSet].vertices.length;
    triBufferSize[whichSet] += whichSnake[whichSet].triangles.length; // number of triangles

    triBufferSize[whichSet] *= 3; // total number of indices

    whichSnake[whichSet].coordArray = coordArray;
    whichSnake[whichSet].normalArray = normalArray;
    whichSnake[whichSet].uvsArray = uvsArray;
    whichSnake[whichSet].indexArray = indexArray;
    whichSnake[whichSet].triBufferSize = triBufferSize;

    // send the vertex coords to webGL
    whichSnake[whichSet].vertexBuffer = gl.createBuffer(); // init empty vertex coord buffer
    gl.bindBuffer(gl.ARRAY_BUFFER,whichSnake[whichSet].vertexBuffer); // activate that buffer
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(whichSnake[whichSet].coordArray),gl.STATIC_DRAW); // coords to that buffer

    // send normals to webGL
    whichSnake[whichSet].normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, whichSnake[whichSet].normalBuffer); // activate that buffer
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(whichSnake[whichSet].normalArray),gl.STATIC_DRAW); // coords to that buffer

    whichSnake[whichSet].textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, whichSnake[whichSet].textureBuffer); // activate that buffer
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(whichSnake[whichSet].uvsArray),gl.STATIC_DRAW);

    whichSnake[whichSet].triangleBuffer = [];
    //console.log( whichSnake[whichSet].triangles.length);
    for (var i = 0; i < whichSnake[whichSet].triangles.length; i++){
        // send the triangle coords to webGL
        whichSnake[whichSet].triangleBuffer[i] = gl.createBuffer(); // init empty vertex coord buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, whichSnake[whichSet].triangleBuffer[i]); // activate that buffer
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(whichSnake[whichSet].triangles[i]),gl.STATIC_DRAW); // coords to that buffer
    }

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      var r = Math.floor(Math.random() * 256),
          g = Math.floor(Math.random() * 256),
          b = Math.floor(Math.random() * 256),
          a = Math.floor(Math.random() * 64) + 192;
      const pixel = new Uint8Array([r, g, b, a]);  // opaque blue
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    width, height, border, srcFormat, srcType,
                    pixel);
    whichSnake[whichSet].texture = texture;

}

function loadFood(whichSet){
    var whichSetVert;
    var coordArray = []; // 1D array of vertex coords for WebGL
    var indexArray = []; // 1D array of vertex indices for triangles
    var normalArray = [];
    var uvsArray = [];
    var tri = vec3.create();

    triBufferSize[whichSet] = 0;

    // initialize initial translation, rotation, scale values
    food[whichSet].scale = vec3.create();
    food[whichSet].translation = vec3.fromValues(0,0,0);
    food[whichSet].xAxis = vec3.fromValues(1,0,0);
    food[whichSet].yAxis = vec3.fromValues(0,1,0);
    food[whichSet].zAxis = vec3.fromValues(0,0,1);
    food[whichSet].center = vec3.create();
    food[whichSet].highlight = false;

    // set up the vertex coord array
    for (whichSetVert=0; whichSetVert<food[whichSet].vertices.length; whichSetVert++){
        var vtx = food[whichSet].vertices[whichSetVert]
        coordArray = coordArray.concat(vtx);
        normalArray = normalArray.concat(food[whichSet].normals[whichSetVert]);
        uvsArray = uvsArray.concat(food[whichSet].uvs[whichSetVert])
        vec3.add(food[whichSet].center, food[whichSet].center, vtx);
    }
    vec3.scale(food[whichSet].center,food[whichSet].center,1/food[whichSet].vertices.length);
    // set up the triangle indicies array

    for (whichSetTri=0; whichSetTri<food[whichSet].triangles.length; whichSetTri++){
        indexArray = indexArray.concat(food[whichSet].triangles[whichSetTri]);
    }
    //vertexBufferSize += food[whichSet].vertices.length;
    triBufferSize[whichSet] += food[whichSet].triangles.length; // number of triangles

    triBufferSize[whichSet] *= 3; // total number of indices

    food[whichSet].coordArray = coordArray;
    food[whichSet].normalArray = normalArray;
    food[whichSet].uvsArray = uvsArray;
    food[whichSet].indexArray = indexArray;
    food[whichSet].triBufferSize = triBufferSize;

    // send the vertex coords to webGL
    food[whichSet].vertexBuffer = gl.createBuffer(); // init empty vertex coord buffer
    gl.bindBuffer(gl.ARRAY_BUFFER,food[whichSet].vertexBuffer); // activate that buffer
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(food[whichSet].coordArray),gl.STATIC_DRAW); // coords to that buffer

    // send normals to webGL
    food[whichSet].normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, food[whichSet].normalBuffer); // activate that buffer
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(food[whichSet].normalArray),gl.STATIC_DRAW); // coords to that buffer

    food[whichSet].textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, food[whichSet].textureBuffer); // activate that buffer
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(food[whichSet].uvsArray),gl.STATIC_DRAW);

    food[whichSet].triangleBuffer = [];
    //console.log( food[whichSet].triangles.length);
    for (var i = 0; i < food[whichSet].triangles.length; i++){
        // send the triangle coords to webGL
        food[whichSet].triangleBuffer[i] = gl.createBuffer(); // init empty vertex coord buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, food[whichSet].triangleBuffer[i]); // activate that buffer
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(food[whichSet].triangles[i]),gl.STATIC_DRAW); // coords to that buffer
    }

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([255, 0, 0, 255]);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    width, height, border, srcFormat, srcType,
                    pixel);
    food[whichSet].texture = texture;

}

// read triangles in, load them into webgl buffers
function loadTriangles() {
    //snake = getJSONFile(INPUT_TRIANGLES_URL,"triangles");
        var whichSetVert; // index of vertex in current triangle set
        var whichSetTri; // index of triangle in current triangle set
        //var vertexBufferSize = 0;
        if (numSets > 0)
            currModelIndex = 0;



        if (walls != String.null) {
            var whichSetVert; // index of vertex in current triangle set
            var whichSetTri; // index of triangle in current triangle set
            //var vertexBufferSize = 0;
            numSets = walls.length;
            if (numSets > 0)
                currModelIndex = 0;
    		for (var whichSet=0; whichSet < walls.length; whichSet++) {
                    var coordArray = []; // 1D array of vertex coords for WebGL
                    var indexArray = []; // 1D array of vertex indices for triangles
                    var normalArray = [];
                    var uvsArray = [];
                    var tri = vec3.create();

                    triBufferSize[whichSet] = 0;

        			// initialize initial translation, rotation, scale values
        			walls[whichSet].scale = vec3.create();
        			walls[whichSet].translation = vec3.fromValues(0,0,0);
        			walls[whichSet].xAxis = vec3.fromValues(1,0,0);
        			walls[whichSet].yAxis = vec3.fromValues(0,1,0);
        			walls[whichSet].zAxis = vec3.fromValues(0,0,1);
        			walls[whichSet].center = vec3.create();
                    walls[whichSet].highlight = false;

                    // set up the vertex coord array
                    for (whichSetVert=0; whichSetVert<walls[whichSet].vertices.length; whichSetVert++){
                        var vtx = walls[whichSet].vertices[whichSetVert]
        				coordArray = coordArray.concat(vtx);
                        normalArray = normalArray.concat(walls[whichSet].normals[whichSetVert]);
                        uvsArray = uvsArray.concat(walls[whichSet].uvs[whichSetVert])
        				vec3.add(walls[whichSet].center, walls[whichSet].center, vtx);
                    }
        			vec3.scale(walls[whichSet].center,walls[whichSet].center,1/walls[whichSet].vertices.length);
                    // set up the triangle indicies array
                    //console.log(walls[whichSet].center);
                    for (whichSetTri=0; whichSetTri<walls[whichSet].triangles.length; whichSetTri++){
                        indexArray = indexArray.concat(walls[whichSet].triangles[whichSetTri]);
                    }
                    //vertexBufferSize += walls[whichSet].vertices.length;
        			triBufferSize[whichSet] += walls[whichSet].triangles.length; // number of triangles

                    triBufferSize[whichSet] *= 3; // total number of indices

                    walls[whichSet].coordArray = coordArray;
                    walls[whichSet].normalArray = normalArray;
                    walls[whichSet].uvsArray = uvsArray;
                    walls[whichSet].indexArray = indexArray;
                    walls[whichSet].triBufferSize = triBufferSize;

                    // send the vertex coords to webGL
                    walls[whichSet].vertexBuffer = gl.createBuffer(); // init empty vertex coord buffer
                    gl.bindBuffer(gl.ARRAY_BUFFER,walls[whichSet].vertexBuffer); // activate that buffer
                    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(walls[whichSet].coordArray),gl.STATIC_DRAW); // coords to that buffer

                    // send normals to webGL
                    walls[whichSet].normalBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, walls[whichSet].normalBuffer); // activate that buffer
                    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(walls[whichSet].normalArray),gl.STATIC_DRAW); // coords to that buffer

                    walls[whichSet].textureBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, walls[whichSet].textureBuffer); // activate that buffer
                    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(walls[whichSet].uvsArray),gl.STATIC_DRAW);

                    walls[whichSet].triangleBuffer = [];
                    //console.log( walls[whichSet].triangles.length);
                    for (var i = 0; i < walls[whichSet].triangles.length; i++){
                        // send the triangle coords to webGL
                        walls[whichSet].triangleBuffer[i] = gl.createBuffer(); // init empty vertex coord buffer
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, walls[whichSet].triangleBuffer[i]); // activate that buffer
                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(walls[whichSet].triangles[i]),gl.STATIC_DRAW); // coords to that buffer
                    }
                }
            }
         // end for each triangle set

     // end if triangles found
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
        uniform bool textured;

        void main(void) {
            vec4 fragColor;

            if (textured){
                fragColor = texture2D(uColorSampler, vec2(vTextureCoord.s, vTextureCoord.t));
            } else {
                fragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }

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
                texturedUniformLoc = gl.getUniformLocation(shaderProgram, "textured");

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
	for (var i = 0; i < snake.length; i++){
		generateModelMatrixTransform(snake[i]);
	}

    for (var i = 0; i < walls.length; i++){
		generateModelMatrixTransform(walls[i]);
	}
	for (var i = 0; i < food.length; i++){
		generateModelMatrixTransform(food[i]);
	}
    if (!enemyReset){
        for (var i = 0; i < enemy.length; i++){
    		generateModelMatrixTransform(enemy[i]);
    	}
    }


    let render_triangles = [];

    // depth sorting: get all triangles and sort based on distance from eye-z to z value
    for (var i = 0; i < snake.length; i++){
        let currSet = snake[i];
        for (var t = 0; t < currSet.triangles.length; t++){
            var triangle = currSet.triangles[t];
            var center = (currSet.vertices[triangle[0]][2] + currSet.vertices[triangle[1]][2] + currSet.vertices[triangle[2]][2]) / 3;
            render_triangles.push({'setIndex': i, 'depth': currSet.mMatrix[14], 'z':center, "triangleIndex":t, 'type':"snake"})
        }

    }
    if (!enemyReset){
        for (var i = 0; i < enemy.length; i++){
            let currSet = enemy[i];
            for (var t = 0; t < currSet.triangles.length; t++){
                var triangle = currSet.triangles[t];
                var center = (currSet.vertices[triangle[0]][2] + currSet.vertices[triangle[1]][2] + currSet.vertices[triangle[2]][2]) / 3;
                render_triangles.push({'setIndex': i, 'depth': currSet.mMatrix[14], 'z':center, "triangleIndex":t, 'type':"enemy"})
            }

        }
    }


    for (var i = 0; i < walls.length; i++){
        let currSet = walls[i];
        for (var t = 0; t < currSet.triangles.length; t++){
            var triangle = currSet.triangles[t];
            var center = (currSet.vertices[triangle[0]][2] + currSet.vertices[triangle[1]][2] + currSet.vertices[triangle[2]][2]) / 3;
            render_triangles.push({'setIndex': i, 'depth': currSet.mMatrix[14], 'z':center, "triangleIndex":t, 'type':"wall"})
        }

    }

	for (var i = 0; i < food.length; i++){
        let currSet = food[i];
        for (var t = 0; t < currSet.triangles.length; t++){
            var triangle = currSet.triangles[t];
            var center = (currSet.vertices[triangle[0]][2] + currSet.vertices[triangle[1]][2] + currSet.vertices[triangle[2]][2]) / 3;
            render_triangles.push({'setIndex': i, 'depth': currSet.mMatrix[14], 'z':center, "triangleIndex":t, 'type':"food"})
        }

    }
	render_triangles.sort((x,y) => {
		return y.depth - x.depth;
	});

    // RENDER EVERYTHING!
    for ( var i = 0; i < render_triangles.length; i++){
        var type = render_triangles[i].type;
        let currSet;

        switch (type){
            case "snake":
                currSet = snake[render_triangles[i]['setIndex']];
                break;
            case "enemy":
                currSet = enemy[render_triangles[i]['setIndex']];
                break;
            case "wall":
                currSet = walls[render_triangles[i]['setIndex']];
                break;
			case "food":
                currSet = food[render_triangles[i]['setIndex']];
                break;
        }

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
        gl.uniform1i(texturedUniformLoc, currSet.textured);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, currSet.texture);

        // vertex buffer: activate and feed into vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, currSet.vertexBuffer); // activate
        gl.vertexAttribPointer(vertexPositionAttrib,3,gl.FLOAT,false,0,0); // feed

		gl.bindBuffer(gl.ARRAY_BUFFER, currSet.normalBuffer);
		gl.vertexAttribPointer(vertexNormalAttrib,3,gl.FLOAT,false,0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, currSet.textureBuffer);
        gl.vertexAttribPointer(textureCoordAttribute,2,gl.FLOAT,false,0,0);

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
        gl.bindTexture(gl.TEXTURE_2D, texture);
		const level = 0;
		  const internalFormat = gl.RGBA;
		  const width = 1;
		  const height = 1;
		  const border = 0;
		  const srcFormat = gl.RGBA;
		  const srcType = gl.UNSIGNED_BYTE;
		  const pixel = new Uint8Array([0, 255, 0, 255]);  // opaque blue
		  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
						width, height, border, srcFormat, srcType,
						pixel);
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
    /*
    for (var whichSet=0; whichSet < snake.length; whichSet++){
        snake[whichSet].texture = loadTexture(snake[whichSet].material.texture);
    }
    */
    for (var whichSet=0; whichSet < walls.length; whichSet++){
        walls[whichSet].texture = loadTexture(walls[whichSet].material.texture);
    }


}
function initSnake(){
    grid[cubeStartX][cubeStartY] = PLAYER;
    snake =  [clone(cube)];
    snake[0].x = cubeStartX;
    snake[0].y = cubeStartY;
    loadSnakeSegment(snake, 0);
    currDir = snakeDir.RIGHT;
}

function chooseEnemyDir(){
    // init to no direction
    enemyDir = vec3.create();
    var nextDir = vec3.create();
    var check = vec3.create();
    while (vec3.exactEquals(enemyDir, check)){
        var dirs = Object.keys(snakeDir);
        var randDir = Math.floor(Math.random() * dirs.length);
        nextDir = snakeDir[dirs[randDir]];
        if (enemy.length > 0)
            vec3.negate(check,nextDir);
        else
            enemyDir = nextDir;
    }
    enemyDir = nextDir;
}

function initEnemy(){
    enemyReset = true;
    enemy =  [clone(cube)];
    let spots = [];
    for (var i = 1; i < grid.length - 1; i++)
        for (var j = 1; j < grid[i].length - 1; j++)
            if (grid[i][j] == EMPTY)
                spots.push({'x':i, 'y': j})
    let spot = spots[Math.floor(Math.random() * spots.length)]
    grid[spot.x][spot.y] = ENEMY;
    enemy[0].x = spot.x;
    enemy[0].y = spot.y;
    loadSnakeSegment(enemy, 0);
    enemyDir = snakeDir.RIGHT;
    enemySteps = Math.floor(Math.random() * 5);
    var temp = vec3.create();

    // translate the enemy snake to spawn location
    var dest = vec3.create();
    vec3.subtract(dest, vec3.fromValues(gridSize - spot.x - 2, spot.y, 0), vec3.fromValues(cubeStartX,cubeStartY, 0));
	vec3.add(enemy[0].translation, enemy[0].translation, vec3.scale(temp, dest, speed));

    enemyReset = false;
}

function setupGame(){
    function rotateWall(model, axis, rotated){
		var rotation = mat4.create();

		mat4.fromRotation(rotation, rotated, axis);
		vec3.transformMat4(model.xAxis, model.xAxis, rotation);
		vec3.transformMat4(model.yAxis, model.yAxis, rotation);
		vec3.transformMat4(model.zAxis, model.zAxis, rotation);
    }

    grid = Array(gridSize).fill(EMPTY).map(() => Array(gridSize).fill(EMPTY));

    initSnake();

    initEnemy();

    console.log(enemy);
    var temp = vec3.create();

    vec3.add(walls[0].translation, walls[0].translation, vec3.scale(temp, lookUp, 3.75));
    vec3.add(walls[1].translation, walls[1].translation, vec3.scale(temp, lookUp, -4.0));

    rotateWall(walls[2], zAxis, Math.PI/2);
    rotateWall(walls[3], zAxis, Math.PI/2);
    vec3.add(walls[2].translation, walls[2].translation, vec3.scale(temp, right, 3.875));
    vec3.add(walls[3].translation, walls[3].translation, vec3.scale(temp, right, -3.875));

    for (var i = 0; i < grid.length; i++){
        grid[0][i] = WALL;
        grid[grid.length-1][i] = WALL;
        grid[i][0] = WALL;
        grid[i][grid.length-1] = WALL;
    }
    for (var i = 0; i < 20; i ++)
        spawnFood();
	foodInterval = setInterval(spawnFood, 3000);
    snakeInterval = setInterval(snakeMove, 100); // sets up game logic
    enemyInterval = setInterval(enemyMove, 100);
}

function spawnFood(){
    var spots = []
    for (var i = 1; i < grid.length - 1; i++)
        for (var j = 1; j < grid[i].length - 1; j++)
            if (grid[i][j] == EMPTY)
                spots.push({'x':i, 'y': j})

	//var x = Math.floor(Math.random() * (gridSize-2)) + 1;
	//var y = Math.floor(Math.random() * (gridSize-2)) + 1;
    var spot = spots[Math.floor(Math.random() * spots.length)];
	var newFood = clone(cube);
	food.push(newFood);
	var newIndex = food.length - 1;
    newFood.id = foodCounter++;
	loadFood(newIndex);
	food[newIndex].x = spot.x;
	food[newIndex].y = spot.y;
	var dest = vec3.create();
    var temp = vec3.create();
	vec3.subtract(dest, vec3.fromValues(gridSize - spot.x - 2, spot.y, 0), vec3.fromValues(cubeStartX,cubeStartY, 0));
	vec3.add(food[newIndex].translation, food[newIndex].translation, vec3.scale(temp, dest, speed));
	grid[spot.x][spot.y] = newFood.id;
}

function reset(){
    clearInterval(foodInterval);
    clearInterval(snakeInterval);
    clearInterval(enemyInterval);

    food = [];
    for (var i = 1; i < grid.length - 1; i++)
        for (var j = 1; j < grid[i].length - 1; j++)
            grid[i][j] = EMPTY;

    initSnake();
    initEnemy();
    spawnFood();
	foodInterval = setInterval(spawnFood, 3000);
    snakeInterval = setInterval(snakeMove, 100);
    enemyInterval = setInterval(enemyMove, 100);
}



function snakeMove(){
	var nextX = snake[0].x - currDir[0];
	var nextY = snake[0].y + currDir[1];
    var foundFood = false;
	if (grid[nextX][nextY] >= 0){
		foundFood = true;
        var id = grid[nextX][nextY];
		grid[nextX][nextY] = EMPTY;
        for (var i = 0; i < food.length; i++)
            if (id == food[i].id)
                food.splice(i, 1);

	}
	if (/*nextX >= gridSize || nextY >= gridSize || nextY < 0 || nextX < 0 || */grid[nextX][nextY] != EMPTY){
        reset();
		return;
	}

    var temp = vec3.create();
    // move snake in current direction
    var tail = clone(snake[snake.length - 1]);
    var tailTranslation = vec3.clone(tail.translation);
    var eaten = false;
	grid[tail.x][tail.y] = EMPTY;
    // move rest of snake
    for (var i = snake.length - 1; i > 0; i--){
        // get direction of previous snake segment
        //console.log(i, snake[i])
        var curr = vec3.fromValues(snake[i].x, snake[i].y, 0);
        var prev = vec3.fromValues(snake[i - 1].x, snake[i - 1].y, 0);
        var dirOfPrev = vec3.create();
        vec3.sub(dirOfPrev, prev, curr);
        dirOfPrev[0] *= -1; // flip the x
        //console.log(curr, prev, dirOfPrev);
        moveSegment(i, dirOfPrev, snake, PLAYER);
    }
    moveSegment(0, currDir, snake, PLAYER);
    if (foundFood){
        addSegment(tail.x, tail.y, tailTranslation, snake, PLAYER);
    }
	//console.log(grid);
}

function moveSegment(i, direction, whichSnake, type){
    dir = {"RIGHT":vec3.fromValues(-1,0,0), "LEFT":vec3.fromValues(1,0,0), "UP":vec3.fromValues(0,1,0), "DOWN":vec3.fromValues(0,-1,0)};
    var temp = vec3.create();
    vec3.add(whichSnake[i].translation, whichSnake[i].translation, vec3.scale(temp, direction, speed));
    whichSnake[i].x -= direction[0];
    whichSnake[i].y += direction[1];
    grid[whichSnake[i].x][whichSnake[i].y] = type;
}
function addSegment(x,y, translation, whichSnake, type){
    var newTail = clone(cube);
    whichSnake.push(newTail);
    var newIndex = whichSnake.length-1;
    loadSnakeSegment(whichSnake, newIndex);
    whichSnake[newIndex].x = x;
    whichSnake[newIndex].y = y;

    whichSnake[newIndex].translation = translation;
    grid[x][y] = type;
}

function enemyMove(){
    if (enemySteps-- <= 0)
        chooseEnemyDir();
        enemySteps = Math.floor(Math.random() * 5);
	var nextX = enemy[0].x - enemyDir[0];
	var nextY = enemy[0].y + enemyDir[1];
    var foundFood = false;
	if (grid[nextX][nextY] >= 0){
        console.log("found food");
		foundFood = true;
        var id = grid[nextX][nextY];
		grid[nextX][nextY] = EMPTY;
        for (var i = 0; i < food.length; i++)
            if (id == food[i].id)
                food.splice(i, 1);

	}

	if (/*nextX >= gridSize || nextY >= gridSize || nextY < 0 || nextX < 0 || */grid[nextX][nextY] != EMPTY){
        initEnemy();
		return;
	}

    var temp = vec3.create();
    // move snake in current direction
    var tail = clone(enemy[enemy.length - 1]);
    var tailTranslation = vec3.clone(tail.translation);
    var eaten = false;
	grid[tail.x][tail.y] = EMPTY;
    // move rest of enemy
    for (var i = enemy.length - 1; i > 0; i--){
        // get direction of previous enemy segment
        //console.log(i, enemy[i])
        var curr = vec3.fromValues(enemy[i].x, enemy[i].y, 0);
        var prev = vec3.fromValues(enemy[i - 1].x, enemy[i - 1].y, 0);
        var dirOfPrev = vec3.create();
        vec3.sub(dirOfPrev, prev, curr);
        dirOfPrev[0] *= -1; // flip the x
        //console.log(curr, prev, dirOfPrev);
        moveSegment(i, dirOfPrev, enemy, ENEMY);
    }
    moveSegment(0, enemyDir, enemy, ENEMY);
    if (foundFood){
        addSegment(tail.x, tail.y, tailTranslation, enemy, ENEMY);
    }
	//console.log(grid);
}


/* MAIN -- HERE is where execution begins after window load */

function main() {
  //document.onkeydown = handleKeyDown;

  setupWebGL(); // set up the webGL environment
  loadTriangles(); // load in the triangles from tri file
  loadTextures();
  setupShaders(); // setup the webGL shaders
  setupGame();
  renderTriangles(); // draw the triangles using webGL

} // end main
