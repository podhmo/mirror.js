function Renderer(config){
  this.config = config;
}

// bootstrap

Renderer.prototype.renderField = function(vm, schema, k){
  var context = {
    props: vm.attributes,
    errors: vm.errors || {},
    attrname: k,
    schema: schema || {}
  };
  return this.renderFieldOuter(context, this.renderFieldInner(context));
};

Renderer.prototype.renderFieldOuter = function(ctx, content){
  var k = ctx.attrname;
  var label = [k];
  if(!!ctx.schema.required && ctx.schema.required.indexOf(k) >= 0){
    label.push(m("span", ["*"]));
  }
  var errors = ctx.errors;
  if(!!errors[k]){
    return m("div.form-group.has-error", [
      m("label.control-label", {"for": k}, label),
      m("div.has-feedback", [content]),
      m("span.form-control-feedback", {"style": {"position": "static"}}, [errors[k]])
    ]);
  }else {
    return m("div.form-group", [
      m("label.control-label", {"for": k}, label),
      m("div", [content])
    ]);
  }
};

Renderer.prototype.renderFieldUnit = function(props, subschema, k, attrs){
  if(!!subschema.widget){
    return this[subschema.widget](props, subschema, k, attrs);
  }else {
    return this.input(props, subschema, k, attrs);
  }
};

Renderer.prototype.input = function(props, subschema, k, attrs){
  if(subschema.type === "boolean"){
    return m("div.form-control", [m("input", attrs)]);
  }else{
    return m("input.form-control", attrs);
  }
};

Renderer.prototype.renderFieldCandidates = function(props, subschema, k, attrs){
  if(!!subschema.widget){
    return this[subschema.widget](props, subschema, k, attrs);
  }else {
    return this.select(props, subschema, k, attrs);
  }
};

Renderer.prototype.radio = function(props, subschema, k, attrs){
  var default_value = props[k]();
  var candidates = subschema.enum.map(function(e){
    var cattrs = {type:"radio", value: e, name: k, onclick: m.withAttr("value", props[k])};
    if(default_value === e){
      cattrs.checked = "checked";
    }
    return m("label", [e, m("input", cattrs)]);
  });
  return m("div.form-control", candidates);
};

Renderer.prototype.select = function(props, subschema, k, attrs, multiple){
  var candidates;
  var default_value;
  if(multiple){
    attrs.multiple = "multiple";
    default_value = props[k]().items;
    candidates = subschema.enum.map(function(e){
      var cattrs = {value: e};
      if(default_value.indexOf(e) >= 0){
        cattrs.selected = "selected";
      }
      return m("option", cattrs, [e]);
    });
  }else{
    default_value = props[k]();
    candidates = subschema.enum.map(function(e){
      var cattrs = {value: e};
      if(default_value === e){
        cattrs.selected = "selected";
      }
      return m("option", cattrs, [e]);
    });
  }
  return m("select.form-control", attrs, candidates);
};


Renderer.prototype.renderFieldMultiple = function(props, subschema, k, attrs){
  if(!!subschema.widget){
    return this[subschema.widget](props, subschema, k, attrs, true);
  }else {
    return this.select(props, subschema, k, attrs, true);
  }
};

Renderer.prototype.check = function(props, subschema, k, attrs, multiple){
  var addfn = function(e){
    var prop = props[k]();
    prop.change(e.currentTarget.value, e.currentTarget.checked);
  };
  var default_value = props[k]().items;
  var candidates = subschema.enum.map(function(e){
    var cattrs = {type:"checkbox", value: e, name: k, onclick: addfn};
    if(default_value.indexOf(e) >= 0){
      cattrs.checked = "checked";
    }
    return m("label", [e, m("input", cattrs)]);
  });
  return m("div.form-control", candidates);
};

Renderer.prototype.renderFieldInner = function(ctx){
  var k = ctx.attrname;
  var props = ctx.props;
  var schema = ctx.schema;
  var attrs = {onchange: m.withAttr("value", props[k]), value: props[k]()};
  if(!!schema.required){
    if(schema.required.indexOf(k) >= 0){
      attrs.required = "required";
    }
  }
  var subschema = schema.properties[k];
  if(!!subschema.type && subschema.type === "array"){
    return this.renderFieldMultiple(props, subschema, k, attrs);
  }else if(!!subschema.enum){
    return this.renderFieldCandidates(props, subschema, k, attrs);
  }else {
    this.config.putAttrs(subschema, attrs);
    return this.renderFieldUnit(props, subschema, k, attrs);
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
