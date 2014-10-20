var app = {};

var Person = function(data){
  this.name = m.prop(data.name || "");
  this.age = m.prop(data.age || 0);
};

var People = Array;

var vm = {};
vm.init = function(){
  this.people = new People();

  this.add = function(){
    this.people.push(new Person({}));
  }.bind(this);

  this.remove = function(e0){
    this.people = this.people.filter(function(e1){return e0 !== e1;});
  }.bind(this);

  this.jsonify = function(){
    return JSON.stringify(this);
  }.bind(this);
};

app.controller = function(){
  vm.init();
};

app.view = function(ctrl){
  return m("div", [
    m("pre", [vm.jsonify()]),
    m("div",
      vm.people.map(function(e, i){
        return m("div.group", {style: {"padding": "10px"}},[
          m("div", [m("label", ["name:", m("input", {value: e.name(), onchange: m.withAttr("value", e.name)})])]),
          m("div", [m("label", ["age:", m("input", {value: e.age(), onchange: m.withAttr("value", e.age), type: "number", min: 0})])]),
          m("button", {onclick: vm.remove.bind(vm, e)}, ["remove"])
        ]);
      })
     ),
    m("button", {onclick: vm.add}, ["add"]),
  ]);
};


