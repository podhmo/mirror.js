var title = {};

title.vm = {};
title.vm.init = function(){
  this.title = m.prop("");
};

title.controller = function(){
  title.vm.init();
  this.bindTitle = function(prop){
    title.vm.title = prop;
  }.bind(this);
};

title.view = function(ctrl){
  return m("h1", title.vm.title());
};
