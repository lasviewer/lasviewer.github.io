
function OnLoadFile(input,fType) {
  var fileNdx_ = 0;
  var numFiles_ = input.files.length;
  document.getElementById('GFG').innerHTML = 'Reading ... ' + numFiles_;
  console.log("OnLoadLas");
  var file = input.files[fileNdx_];
  if (!file) {
      console.log("NO FILE");
      return;
  }
  var readMemBlock = null;
  var chunkSz_ = 1024*1024;
  var currSz_ = 0;
  var fType_ = fType;
 // var ext = input.files[fileNdx].name.split('.').pop();
  var totSz_ = input.files[fileNdx_].size; 
  load_file_cb = Module.cwrap('LdLasCppJS', 'number', ['arrayPointer', 'number', 'number','number']);
  post_proc_file_cb = Module.cwrap('PostProcessDataJS', 'number', ['number', 'number']);
  var s_action_chunk = Module._malloc(128);
  Module.HEAPU8.set(new TextEncoder().encode("datchunk"), s_action_chunk); 

  var readerOnLoad =  function (e) {    
      var data = e.target.result;
      var dtsize = e.target.result.byteLength;
      var array = new Uint8Array(data);
      var res_ptr = Module._malloc(dtsize);
      Module.HEAPU8.set(array, res_ptr);  
      chunkSz_ = load_file_cb(res_ptr, 1, fType, totSz_); 
      Module._free(res_ptr);
      currSz_ +=  dtsize;
  };

  var readerDoneLoad = function (e) {
      if(chunkSz_=== 0){
          fileNdx_ = fileNdx_ + 1;
          if(fileNdx_ === numFiles_){
              post_proc_file_cb(fType,0);
              return ;
           }
          else{
              // Start reading new file
              totSz_ = input.files[fileNdx_].size; 
              currSz_ = 0;
              chunkSz_ = load_file_cb(s_action_chunk, 0, fType_,totSz_); 
          }
      }
      if(chunkSz_=== -1){
          post_proc_file_cb(fType,0);
          return ;
      }
      var rdp = Math.floor(100* currSz_/totSz_);
      document.getElementById('GFG').innerHTML = "Reading " + fileNdx_ + " from " + numFiles_+ " " + rdp + "%";
      readMemBlock(currSz_,chunkSz_);
  }

  var readerOnError = function (e) {
      console.log('Error : ' + e.type);
  };

  readMemBlock = function(_offset, length){
      var reader = new FileReader();
      reader.onload = readerOnLoad;
      reader.onloadend  = readerDoneLoad;
      reader.onerror = readerOnError;    
      var blob = input.files[fileNdx_].slice(_offset, length + _offset);
      reader.readAsArrayBuffer(blob);
  }
  
  // Start reading
  chunkSz_ = load_file_cb(s_action_chunk, 0, fType_, totSz_); 
  readMemBlock(currSz_, chunkSz_);  
} //OnLoadFile


function OnFileSelected(input,fType) {
  clear_scene_cb = Module.cwrap('ClearSceneJS', 'number', ['number']);
  clear_scene_cb(0);
  OnLoadFile(input,fType);
} //OnFileSelected
