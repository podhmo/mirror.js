var complete = {};

complete.vm = {};
complete.vm.init = function(){
  this.val = m.prop(10);
  this.update = function(v){
    return this.val(Number.parseInt(v));
  }.bind(this);
};

complete.controller = function(){
  complete.vm.init();
};

complete.view = function(ctrl){
  return m("div", [
    m("input[type=number]", {onchange: m.withAttr("value", complete.vm.update), value: complete.vm.val()})
  ]);
};
