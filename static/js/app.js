//test

var Schema = {
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string",
      "maxLength": 32
    },
    "surname": {
      "type": "string",
      "maxLength": 32
    },
    "gender": {
      "type": "string",
      "maxLength": 1,
      "enum": [
        "M",
        "F"
      ]
    },
    "birthday": {
      "type": "string",
      "format": "date"
    },
    "age": {
      "type": "integer"
    }
  },
  "type": "object",
  "title": "Person",
  "required": [
    "id",
    "name",
    "surname",
    "gender"
  ]
};

function Config(){
}
Config.prototype.string = function(schema, attrs){
  attrs.type = "text";
  if(schema.hasOwnProperty("maxLength")){
    attrs.maxlength = schema.maxLength;
  }
  return attrs;
};
Config.prototype.date_time = function(schema, attrs){
  attrs.type = "datetime-local";
  return attrs;
};
Config.prototype.integer = function(schema, attrs){
  attrs.type = "number";
  return attrs;
};
Config.prototype.putAttrs = function(schema, attrs){
  if(!!schema.format){
    var formatname = schema.format.replace("-", "_");
    if(!!this[formatname]){
      return this[formatname](schema, attrs);
    }
  }
  if(!!schema.type){
    var typename = schema.type.replace("-", "_");
    if(!!this[typename]){
      return this[typename](schema, attrs);
    }
  }
  return this.config.string(schema, attrs);
};

function Layout(config){
  this.config = config;
}
Layout.prototype.renderFieldOuter = function(k , core){
  return m("div", [m("label", [k, ":", core])]);
};
Layout.prototype.renderField = function(vm, schema, k){
  return this.renderFieldOuter(k, this.renderFieldCore(vm, schema, k));
};
Layout.prototype.renderFieldCore = function(vm, schema, k){
  var subschema = schema.properties[k];
  var attrs = {onchange: m.withAttr("value", vm[k]), value: vm[k]()};
  if(!!subschema.enum){
    var candidates = subschema.enum.map(function(e){
      return m("option", {value: e}, [e]);
    });
    return m("select", attrs, candidates);
  }else {
    this.config.putAttrs(subschema, attrs);
    if(!!schema.required){
      if(schema.required.indexOf(k) >= 0){
        attrs.required = "required";
      }
    }
    return m("input", attrs);
  }
};
Layout.prototype.renderForm = function(fields){
  return m("div", fields);
};

function Builder(layout){
  this.layout = layout;
}
Builder.prototype.buildViewModel = function(schema, defaults){
  var vm = {};
  vm.init = function(){
    for(var k in schema.properties){
      if(schema.properties.hasOwnProperty(k)){
        this[k] = m.prop(defaults[k] || "");
      }
    }
    return this;
  };
  vm.jsonify = function(){
    return JSON.stringify(vm, null, 2);
  };
  return vm;
};
Builder.prototype.buildView = function(schema){
  return function(ctrl){
    var vm = ctrl.vm;
    var fields = [];
    for(var k in schema.properties){
      if(schema.properties.hasOwnProperty(k)){
        fields.push(this.layout.renderField(vm, schema, k));
      }
    }
    return this.layout.renderForm(fields);
  }.bind(this);
};
Builder.prototype.buildController = function(vm){
  return function(){
    this.vm = vm.init();
  };
};
Builder.prototype.build = function(schema, defaults){
  var module = {vm: this.buildViewModel(schema, defaults), view: this.buildView(schema)};
  module.controller = this.buildController(module.vm);
  return module;
};

var defaults = {id: 1};
var app = new Builder(new Layout(new Config())).build(Schema, defaults);
var coreView = app.view;
app.view = function(ctrl){
  return m("div", [
    coreView(ctrl),
    m("pre", [ctrl.vm.jsonify()])
  ]);
};

m.module(
  document.querySelector("#app"), app
);

