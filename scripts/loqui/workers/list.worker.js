postMessage('Started LIST worker');

onmessage = function (e) {
  var [id, method, args] = e.data;
  var [success, result] = method in Class ? [true, Class[method].apply(self, args)] : [false, 'Unknown method'];
  console.log(result, method in Class, Class[method], args);
  postMessage({
    id: id,
    success: success,
    result: result
  });
};

var Class = {

  _element: function (arg) {
    return arg;
  }

}
