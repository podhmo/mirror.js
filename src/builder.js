function Builder(renderer){
  this.renderer = renderer;
}

function propWrap(parse, prop){
  var wrap = function(){
    if(arguments.length === 0){
      return prop();
    }else {
      return prop(parse(arguments[0]));
    }
  };
  wrap.toJSON = function(){
    return prop.toJSON();
  };
  return wrap;
}

Builder.prototype.buildViewModelFromDefinition = function(vm, schema, defaults, ref){
  // supports only #/definitions/foo
  var nodes = ref.substr(2, ref.length).split("/");
  var subschema = schema;
  for(var i=0,j=nodes.length; i<j; i++){
    subschema = subschema[nodes[i]];
  }
  var result = this.buildViewModelObject(vm, subschema, defaults);
  return result;
};

function tobool(x){return !!x;}

Builder.prototype.buildViewModelObject = function(vm, schema, defaults){
  defaults = defaults || {};
  for(var k in schema.properties){
    if(schema.properties.hasOwnProperty(k)){
      var subschema = schema.properties[k];
      if(!!subschema.properties){
        vm[k] = this.buildViewModelObject({}, subschema, defaults[k]);
      }else{
        var typ = subschema.type;
        if(typ === "array"){
          vm[k] = m.prop(new Collection(defaults[k] || [])); //xxx;
          vm[k]().bind(vm[k]);
        }else if(typ === "boolean"){
          vm[k] = propWrap(tobool, m.prop(tobool(defaults[k])));
        }else if(typ === "integer"){
          vm[k] = propWrap(parseInt, m.prop(parseInt(defaults[k])));
        }else if(typ === "number"){
          vm[k] = propWrap(parseFloat, m.prop(parseFloat(defaults[k])));
        }else if(typ === "object"){
          if(!!subschema.$ref){
            vm[k] = this.buildViewModelFromDefinition({}, schema, defaults, subschema.$ref);
          }else {
            vm[k] = this.buildViewModelObject({}, subschema, defaults[k]);
          }
        }else if(!subschema.type){
          if(!!subschema.$ref){
            vm[k] = this.buildViewModelFromDefinition({}, schema, defaults, subschema.$ref);
          }else {
            vm[k] = this.buildViewModelObject({}, {"properties": subschema}, defaults[k]);
          }
        }else {
          vm[k] = m.prop(defaults[k] || "");
        }
        // xxx:
        if(!!subschema.enum && subschema.type !== "array"){
          vm[k](vm[k]() || subschema.enum[0]);
        }
      }
    }
  }
  return vm;
};

Builder.prototype.buildViewModel = function(schema, defaults, errors){
  var vm = {};
  vm.init = function(){
    vm.errors = errors;
    vm.attributes = this.buildViewModelObject({}, schema, defaults);
    return vm;
  }.bind(this);
  vm.jsonify = function(){
    return JSON.stringify(vm.attributes, null, 2);
  };
  return vm;
};

Builder.prototype.buildView = function(schema){
  return function(ctrl){
    var vm = ctrl.vm;
    var fields = [];
    for(var k in schema.properties){
      if(schema.properties.hasOwnProperty(k)){
        fields.push(this.renderer.renderField(vm, schema, k));
      }
    }
    return this.renderer.renderForm(fields);
  }.bind(this);
};

Builder.prototype.buildController = function(vm){
  return function(){
    this.vm = vm.init();
  };
};

Builder.prototype.build = function(schema, defaults, errors){
  var module = {vm: this.buildViewModel(schema, defaults, errors), view: this.buildView(schema)};
  module.controller = this.buildController(module.vm);
  return module;
};

//for node.
if(typeof module != "undefined" && module !== null){
  Collection = require("./collection");
  module.exports = Builder;
}
