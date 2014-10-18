//test

var Schema = {
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
  var attrs = {onchange: m.withAttr("value", vm[k]), value: vm[k]()};
  var subschema = schema.properties[k];
  this.config.putAttrs(subschema, attrs);
  if(!!schema.required){
    if(schema.required.indexOf(k) >= 0){
      attrs.required = "required";
    }
  }
  return m("input", attrs);
};
Layout.prototype.renderForm = function(fields){
  return m("div", fields);
};

function Builder(layout){
  this.layout = layout;
}
Builder.prototype.buildVM = function(schema){
  var vm = {};
  vm.init = function(){
    for(var k in schema.properties){
      if(schema.properties.hasOwnProperty(k)){
        this[k] = m.prop("");
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
Builder.prototype.buildC = function(vm){
  return function(){
    this.vm = vm.init();
  };
};
Builder.prototype.build = function(schema){
  var module = {vm: this.buildVM(schema), view: this.buildView(schema)};
  module.controller = this.buildC(module.vm);
  return module;
};

var app = new Builder(new Layout(new Config())).build(Schema);
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

