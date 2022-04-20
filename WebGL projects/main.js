
const { mat4 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];

const coord = [
    [-0.4, 0, 0],
    [0, 0, -0.7],
    [0.5, -0.5, -0.7],
    [0, 0.8, -1],
    [-0.4, 0.5, 0],
    [0.4, 0, 0],
    [-0.4, -0.5, 0],
    [0.4, 0.6, 0],
    [0, -1, -2]
];

var cameraPosition = [0, 0, 2];
var cameraTarget = [0, 0, 0];
var cameraUp = [0, 1, 0];

let mouseMoving = false;
let mouseX = 0;
let mouseY = 0;

const moveRate = 0.01;

let gl = null;

var shapeNum = -1; 

const locations = {

    attributes: {

        vertexLocation: null,
        colorLocation: null

    }, uniforms: {

        transformationMatrix: null,
        projectionMatrix: null,
        viewMatrix: null

    }
}

window.onload = () => {

    /* --------- basic setup --------- */

    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");

    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    gl.clearColor(0.729, 0.764, 0.674, 1);

    const program = createShaderProgram("v-shader", "f-shader");
    gl.useProgram(program);

    /* --------- save attribute & uniform locations --------- */

    locations.attributes.vertexLocation = gl.getAttribLocation(program, "vertexPosition");
    locations.attributes.colorLocation = gl.getAttribLocation(program, "vertexColor");
    locations.uniforms.transformationMatrix = gl.getUniformLocation(program, "transformationMatrix");
    locations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
    locations.uniforms.viewMatrix = gl.getUniformLocation(program, "viewMatrix");

    /* --------- create & send projection matrix --------- */

    let projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);

    /* --------- create & send view matrix --------- */

    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, cameraUp);
    gl.uniformMatrix4fv(locations.uniforms.viewMatrix, gl.FALSE, viewMatrix);

    /* --------- create shapes and translate them away from each other --------- */

    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape());
    shapes.push(createShape2());
    shapes.push(createShape2());
    shapes.push(createShape2());
    shapes.push(createShape2());
    shapes.push(createShape2());

    for (let i = 0; i < 9; ++i) {
       shapes[i].translate(coord[i]);
    }

    /* --------- Attach event listener for keyboard events to the window --------- */

    window.addEventListener("keydown", (event) => {

        /* ----- this event contains all the information you will need to process user interaction ---- */

        if( event.key == 'ArrowRight' ) {
           console.log('Right');
           if( shapeNum < 0 )
               cameraPosition[0]++;
           else {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].translate([1,0,0]);
                   }
               } else {
                   shapes[shapeNum-1].translate([1,0,0]);
               }
           }
        }
        if( event.key == 'ArrowLeft' ) {
           console.log('Left');
           if( shapeNum < 0 )
               cameraPosition[0]--;
           else {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].translate([-1,0,0]);
                   }
               } else {
                   shapes[shapeNum-1].translate([-1,0,0]);
               }
           }

        }
        if( event.key == 'ArrowUp' ) {
           console.log('Up');
           if( shapeNum < 0 )
               cameraPosition[1]++;
           else {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].translate([0,1,0]);
                   }
               } else {
                   shapes[shapeNum-1].translate([0,1,0]);
               }
           }
        }
        if( event.key == 'ArrowDown' ) {
           console.log('Down');
           if( shapeNum < 0 )
               cameraPosition[1]--;
           else {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].translate([0,-1,0]);
                   }
               } else {
                   shapes[shapeNum-1].translate([0,-1,0]);
               }
           }        
        }

        if( event.key == ',' ) {
           if( shapeNum >= 0 ) {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].translate([0,0,1,]);
                   }
               } else {
                   shapes[shapeNum-1].translate([0,0,1]);
               }
           }
        }
        if( event.key == '.' ) {
           if( shapeNum >= 0 ) {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].translate([0,0,-1]);
                   }
               } else {
                   shapes[shapeNum-1].translate([0,0,-1]);
               }
           }        
        }
        if( event.key == 'i' ) {
           if( shapeNum >= 0 ) {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].rotate(0.2,[1,0,0]);
                   }
               } else {
                   shapes[shapeNum-1].rotate(0.2,[1,0,0]);
               }
           }        
        }
        if( event.key == 'k' ) {
           if( shapeNum >= 0 ) {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].rotate(-0.2,[1,0,0]);
                   }
               } else {
                   shapes[shapeNum-1].rotate(-0.2,[1,0,0]);
               }
           }        
        }        
        if( event.key == 'o' ) {
           if( shapeNum >= 0 ) {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].rotate(0.2,[0,1,0]);
                   }
               } else {
                   shapes[shapeNum-1].rotate(0.2,[0,1,0]);
               }
           }        
        }
        if( event.key == 'u' ) {
           if( shapeNum >= 0 ) {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].rotate(-0.2,[0,1,0]);
                   }
               } else {
                   shapes[shapeNum-1].rotate(-0.2,[0,1,0]);
               }
           }        
        }

        if( event.key == 'l' ) {
           if( shapeNum >= 0 ) {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].rotate(0.2,[0,0,1]);
                   }
               } else {
                   shapes[shapeNum-1].rotate(0.2,[0,0,1]);
               }
           }        
        }
        if( event.key == 'j' ) {
           if( shapeNum >= 0 ) {
               if( shapeNum == 0 ) {
                   for( let i = 0; i < 9; ++i ) {
                       shapes[i].rotate(-0.2,[0,0,1]);
                   }
               } else {
                   shapes[shapeNum-1].rotate(-0.2,[0,0,1]);
               }
           }        
        }

        if( event.keyCode >= 48 && event.keyCode <= 57 )
            shapeNum = event.keyCode - 48;
        if( event.key == "c" )
            shapeNum = -1;	

        console.log(event)

    })

    window.addEventListener('mousedown', e => {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        mouseMoving = true;
    })

    window.addEventListener('mousemove', e => {
        if (mouseMoving === true) {
            cameraPosition[0] += (e.offsetX-mouseX) * moveRate;
            cameraPosition[1] += (e.offsetY-mouseY) * moveRate;
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        }
    })

    window.addEventListener('mouseup', e => {
        if (mouseMoving === true) {
            mouseX = 0;
            mouseY = 0;
            mouseMoving = false;
        }
    })

    /* --------- start render loop --------- */

    requestAnimationFrame(render);

}

/* --------- simple example of loading external files --------- */

async function loadSomething() {

    const data = await fetch('Shape.js').then(result => result.text());
    console.log(data);

}


let then = 0;

function render(now) {


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, cameraUp);
    gl.uniformMatrix4fv(locations.uniforms.viewMatrix, gl.FALSE, viewMatrix);

    shapes.forEach(shape => {

        shape.draw();

    });

    requestAnimationFrame(render)

}


function createShape() {

    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */

    const vertices = [

        // X, Y, Z, W
        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1,

        -0.2, 0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // front face end

        -0.2, -0.2, -0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,

        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1, // left face end

        0.2, 0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1, // back face end

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1, // bottom face end

        0.2, 0.2, 0.2, 1,
        0.2, -0.2, -0.2, 1,
        0.2, 0.2, -0.2, 1,

        0.2, -0.2, -0.2, 1,
        0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // right face end

        0.2, 0.2, 0.2, 1,
        0.2, 0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1, // Top face end

    ];

    const colorData = [
        // R, G, B, Alpha
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    colorData.forEach(color => {

        for (let i = 0; i < 6; ++i) {

            colors.push(color);

        }

    });

    /* --------- create shape object and initialize data --------- */

    const cube = new Shape();

    cube.initData(vertices, colors)

    return cube;

}


function createShape2() {

    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */

    const vertices = [

        // X, Y, Z, W
        0.1, 0.1, 0.2, 1,
        -0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1,

        -0.2, 0.2, 0.2, 1,
        -0.1, -0.1, 0.2, 1,
        0.2, -0.2, 0.2, 1, // front face end

        -0.1, -0.1, -0.2, 1,
        -0.1, -0.1, 0.2, 1,
        -0.2, 0.2, 0.2, 1,

        -0.1, -0.1, -0.2, 1,
        -0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1, // left face end

        0.1, 0.1, -0.2, 1,
        -0.1, -0.1, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.1, 0.1, -0.2, 1,
        0.2, -0.2, -0.2, 1,
        -0.1, -0.1, -0.2, 1, // back face end

        0.2, -0.2, 0.2, 1,
        -0.1, -0.1, -0.2, 1,
        0.2, -0.2, -0.2, 1,

        0.2, -0.2, 0.2, 1,
        -0.1, -0.1, 0.2, 1,
        -0.1, -0.1, -0.2, 1, // bottom face end

        0.1, 0.1, 0.2, 1,
        0.2, -0.2, -0.2, 1,
        0.1, 0.1, -0.2, 1,

        0.2, -0.2, -0.2, 1,
        0.1, 0.1, 0.2, 1,
        0.2, -0.2, 0.2, 1, // right face end

        0.1, 0.1, 0.2, 1,
        0.1, 0.1, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.1, 0.1, 0.2, 1,
        -0.2, 0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1, // Top face end

    ];

    const colorData = [
        // R, G, B, Alpha
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    colorData.forEach(color => {

        for (let i = 0; i < 6; ++i) {

            colors.push(color);

        }

    });

    /* --------- create shape object and initialize data --------- */

    const sh2 = new Shape();

    sh2.initData(vertices, colors)

    return sh2;

}

