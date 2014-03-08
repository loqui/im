postMessage('Started TEST worker');

onmessage = function (e) {

  var [id, method, args] = e.data;
  postMessage({
    id: id,
    success: true,
    result: 'Hi, ' + args[0]
  });
  
};
