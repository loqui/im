postMessage('Started PIC worker');

onmessage = function (e) {
  var [id, method, args] = e.data;
  if (method in Class) {
    Class[method].apply(self, args).then(function (result) {
      postMessage({
        id: id,
        success: true,
        result: result
      });
    },
    function (reject) {
      postMessage({
        id: id,
        success: false,
        result: reject
      });
    });    
  } else {
    postMessage({
      id: id,
      success: false,
      result: 'Unknown method'
    });
  } 
};

var Class = {

  reduce: function (blob, width, height) {
    var p = new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          var url = canvas.toDataURL('image/jpeg');
          resolve(url);
        }
        img.src = reader.result;
      }
      reader.onerror = function (e) {
        reject('READER ERROR');
      }
      reader.readAsDataURL(blob);      
    });
  },
  
  avatarize: function () {
    
  }

}
