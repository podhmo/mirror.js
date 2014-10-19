function Builder(layout){
  this.layout = layout;
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

Builder.prototype.buildViewModelObject = function(vm, schema, defaults){
  defaults = defaults || {};
  for(var k in schema.properties){
    if(!!schema.properties[k]){
      if(!!schema.properties[k].properties){
        vm[k] = this.buildViewModelObject({}, schema.properties[k], defaults[k]);
      }else{
        var typ = schema.properties[k].type;
        if(typ === "arary"){
          vm[k] = m.prop(defaults[k] || []);
        }else if(typ === "integer"){
          vm[k] = propWrap(Number.parseInt, m.prop(Number.parseInt(defaults[k])));
        }else if(typ === "number"){
          vm[k] = propWrap(Number.parseFloat, m.prop(Number.parseFloat(defaults[k])));
        }else if(!schema.properties[k].type){
          vm[k] = this.buildViewModelObject({}, {"properties": schema.properties[k]}, defaults[k]);
        }else {
          vm[k] = m.prop(defaults[k] || "");
        }
      }
    }
  }
  return vm;
};

Builder.prototype.buildViewModel = function(schema, defaults){
  var vm = {};
  vm.init = function(){
    return this.buildViewModelObject(vm, schema, defaults);
  }.bind(this);
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

//for node.
if(!!module && !!module.exports){
  module.exports = Builder;
  Number.parseInt = function(n){return +n;};
  Number.parseFloat = function(n){return +n;};
}
