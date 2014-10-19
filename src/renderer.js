function Renderer(config){
  this.config = config;
}

// bootstrap

Renderer.prototype.renderField = function(vm, schema, k){
  return this.renderFieldOuter(k, vm.errors, this.renderFieldInner(vm.attributes, schema, k));
};

Renderer.prototype.renderFieldOuter = function(k , errors, content){
  if(!!errors[k]){
    return m("div.form-group.has-error", [
      m("label.control-label", {"for": k}, [k]),
      m("div.has-feedback", [content]),
      m("span.form-control-feedback", {"style": {"position": "static"}}, [errors[k]])
    ]);
  }else {
    return m("div.form-group", [
      m("label.control-label", {"for": k}, [k]),
      m("div", [content])
    ]);
}
};

Renderer.prototype.renderFieldInput = function(attributes, subschema, k, attrs){
  return m("input.form-control", attrs);
};

Renderer.prototype.renderFieldSelect = function(attributes, subschema, k, attrs){
  var candidates = subschema.enum.map(function(e){
    return m("option", {value: e}, [e]);
  });
  return m("select", attrs, candidates);
};


Renderer.prototype.renderFieldInner = function(attributes, schema, k){
  var attrs = {onchange: m.withAttr("value", attributes[k]), value: attributes[k]()};
  if(!!schema.required){
    if(schema.required.indexOf(k) >= 0){
      attrs.required = "required";
    }
  }
  var subschema = schema.properties[k];
  if(!!subschema.enum){
    return this.renderFieldSelect(attributes, subschema, k, attrs);
  }else {
    this.config.putAttrs(subschema, attrs);
    return this.renderFieldInput(attributes, subschema, k, attrs);
  }
};

Renderer.prototype.renderForm = function(fields){
  return m("div", fields);
};

//for node.
if(typeof module != "undefined" && module !== null){
  var m = require("mithril");
  module.exports = Renderer;
}
