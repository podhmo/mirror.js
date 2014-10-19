function Renderer(config){
  this.config = config;
}

Renderer.prototype.renderFieldOuter = function(k , core){
  return m("div", [m("label", [k, ":", core])]);
};

Renderer.prototype.renderField = function(vm, schema, k){
  return this.renderFieldOuter(k, this.renderFieldInner(vm, schema, k));
};

Renderer.prototype.renderFieldInput = function(vm, subschema, k, attrs){
  return m("input", attrs);
};

Renderer.prototype.renderFieldSelect = function(vm, subschema, k, attrs){
  var candidates = subschema.enum.map(function(e){
    return m("option", {value: e}, [e]);
  });
  return m("select", attrs, candidates);
};


Renderer.prototype.renderFieldInner = function(vm, schema, k){
  var attrs = {onchange: m.withAttr("value", vm[k]), value: vm[k]()};
  if(!!schema.required){
    if(schema.required.indexOf(k) >= 0){
      attrs.required = "required";
    }
  }
  var subschema = schema.properties[k];
  if(!!subschema.enum){
    return this.renderFieldSelect(vm, subschema, k, attrs);
  }else {
    this.config.putAttrs(subschema, attrs);
    return this.renderFieldInput(vm, subschema, k, attrs);
  }
};

Renderer.prototype.renderForm = function(fields){
  return m("div", fields);
};

//for node.
if(!!module && !!module.exports){
  var m = require("mithril");
  module.exports = Renderer;
}
