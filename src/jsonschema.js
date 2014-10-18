var GroupSchema = {
  "type": "object",
  "title": "Group",
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 255
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "id": {
      "type": "integer"
    }
  },
  "required": [
    "id"
  ]
};

var Params = function(data){
  this.id = m.prop(data.id);
  this.name = m.prop(data.name);
  this.created_at = m.prop(data.created_at);
};

var vm = {
};

vm.init = function(){
  this.params = new Params();
};

var controler = function(){
  vm.init();
};

function outer(content){
  return m("div", content);
}

function formView(ctrl){
  return m("div",[
    outer([
      m("label", ["id:", m("input[name='id'][type='number']", {value: vm.params.id()})])
    ]),
    outer([
      m("label", ["name:", m("input[name='name']", {value: vm.params.name()})])
    ]),
    outer([
      m("label", ["created_at:", m("input[name='created_at'][type='date-time']", {value: vm.params.created_at()})])
    ])
  ]);
}

m.render(
  document.querySelector("#app"), formView()
);
