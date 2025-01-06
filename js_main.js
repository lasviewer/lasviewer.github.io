
//const myPics = document.getElementById('myPics');
//const context = myPics.getContext('2d');

var htmlCanvas;
var context;
class GlobVars {
    mouseX = 0;
    mouseY = 0;
}
var gv = new GlobVars();

/*
var importObject = { imports: { i: arg => console.log(arg) } };

function instantiate(bytes, imports) {
    return WebAssembly.compile(bytes).then(m => new WebAssembly.Instance(m, imports));
}


function LoadWasm() {
    fetch("simple.wasm")
        .then(bytes => bytes.arrayBuffer())
        .then(bytes => instantiate(bytes, importObject))
        .then(instance => instance.exports.e());
}
*/

function callWasm1() {
    console.log("CallWasm");
    Module['canvas'] = document.getElementById('myPics');
    const result = Module.ccall('CallCFunc', 'number');
}

function Blah() {
    console.log("Hello TestMe5\n");
    //context.fillStyle = "red";
    //context.fillRect(100, 100, 100, 100);
    //callWasm1();
    toggleFullScreen();
}

function OnDraw() {
   // htmlCanvas = document.getElementById('canvas');
   // context = htmlCanvas.getContext('bitmaprenderer');
   // context.fillStyle = "black";
   // context.fillText("text", 30, 60);
}

function OnMouseMove(e) {
    
    gv.mouseX = e.offsetX;
    gv.mouseY = e.offsetY;
    OnDraw();
}

function OnFileSelected(input) {
    console.log("---fileSelected-- " + input.files[0].name);
    var file = input.files[0];
    if (!file) {
        console.log("NO FILE");
        return;
    }
    console.log("YES FILE size=" + input.files[0].size);
    var reader = new FileReader();
    reader.onload = function (e) {
        // binary data
        //console.log(e.target.result);
        console.log("done  reading");
    };
    reader.onerror = function (e) {
        // error occurred
        console.log('Error : ' + e.type);
    };
    reader.readAsArrayBuffer(input.files[0]);  
}

function OnFileOpen() {
    document.getElementById('attachment').click();
}


function resizeCanvas() {
    console.log("Resize w=" + window.innerWidth + " h=" + window.innerHeight);
    resize_cb = Module.cwrap('CallCFunc', 'number', ['number','number']);
    resize_cb(window.innerWidth, window.innerHeight);
   // const result = Module.ccall('CallCFunc', 'number');
}

function OnLoaded() {  
    // init canvas
    htmlCanvas = document.getElementById('myPics');
    context = htmlCanvas.getContext('2d');
    resizeCanvas();
 }

function OnStart()
{
    console.log("--OnStart---\n");
    //htmlCanvas = document.getElementById('canvas');
    //context = htmlCanvas.getContext('2d');
    console.log("w=" + window.innerWidth + " h=" + window.innerHeight);
    resizeCanvas();

   // window.addEventListener('mousemove', (e) => { OnMouseMove(e) });
   window.addEventListener('resize', resizeCanvas, false);
   // window.addEventListener('DOMContentLoaded', (e) => { OnLoaded() });
}

//OnStart();