var app = {};

app.controller = function(){
  this.title = new title.controller();
  this.complete = new complete.controller();

  this.title.bindTitle(complete.vm.val);
};

app.view = function(ctrl){
  return m("div",[
    title.view(ctrl.title),
    m("div#candidates", [
      complete.view(ctrl.complete)
    ])
  ]);
};
