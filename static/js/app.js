function Config(){
}

Config.prototype.string = function(schema, attrs){
  attrs.type = "text";
  if(!!schema.maxLength){
    attrs.maxlength = schema.maxLength;
  }
  if(schema.minLength){
    attrs.minlength = schema.minLength;
  }
  if(!!schema.pattern){
    attrs.pattern = schema.pattern;
  }
  return attrs;
};

Config.prototype.boolean = function(schema, attrs){
  attrs.type = "checkbox";
  return attrs;
};

Config.prototype.integer = function(schema, attrs){
  return this.number(schema, attrs);
};

Config.prototype.number = function(schema, attrs){
  attrs.type = "number";
  if(!!schema.multipleOf){
    attrs.step = schema.multipleOf;
  }
  if(!!schema.maximum){
    attrs.max = (!!schema.exclusiveMaximum)? schema.maximum-1 : schema.maximum;
  }
  if(!!schema.minimum){
    attrs.min = (!!schema.exclusiveMinimum)? schema.minimum+1 : schema.minimum;
  }
  return attrs;
};

Config.prototype.date_time = function(schema, attrs){
  attrs.type = "datetime-local";
  return attrs;
};

Config.prototype.email = function(schema, attrs){
  attrs.type = "email";
  return attrs;
};

//format: hostname,ipv4,ipv6

Config.prototype.uri = function(schema, attrs){
  attrs.type = "url";
  return attrs;
};

//extended-format: time, date, color, tel
Config.prototype.tel = function(schema, attrs){
  attrs.type = "tel";
  return attrs;
};

Config.prototype.time = function(schema, attrs){
  attrs.type = "time";
  return attrs;
};

Config.prototype.date = function(schema, attrs){
  attrs.type = "date";
  return attrs;
};

Config.prototype.color = function(schema, attrs){
  attrs.type = "color";
  return attrs;
};

Config.prototype.password = function(schema, attrs){
  attrs.type = "password";
  return attrs;
};

Config.prototype.putAttrsCommon = function(schema, attrs){
  if(!!schema.placeholder){
    attrs.placeholder = schema.placeholder;
  }
  return attrs;
};

Config.prototype.putAttrs = function(schema, attrs){
  attrs = this.putAttrsCommon(schema, attrs);
  if(!!schema.type){
    var typename = schema.type.replace("-", "_");
    if(!!this[typename]){
      attrs = this[typename](schema, attrs);
    }
  }else {
    attrs = this.string(schema, attrs);
  }
  if(!!schema.format){
    var formatname = schema.format.replace("-", "_");
    if(!!this[formatname]){
      return this[formatname](schema, attrs);
    }
  }
};

//for node.
if(typeof module != "undefined" && module !== null){
  module.exports = Config;
}

function Renderer(config){
  this.config = config;
}

// bootstrap

Renderer.prototype.renderField = function(vm, schema, k){
  var context = {
    props: vm.attributes,
    errors: vm.errors || {},
    propkey: k,
    schema: schema || {}
  };
  return this.renderFieldOuter(context, this.renderFieldInner(context));
};

Renderer.prototype.renderFieldOuter = function(ctx, content){
  var k = ctx.propkey;
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

Renderer.prototype.renderFieldUnit = function(ctx, subschema, attrs){
  if(!!subschema.widget){
    return this[subschema.widget](ctx, subschema, attrs);
  }else {
    return this.input(ctx, subschema, attrs);
  }
};

Renderer.prototype.input = function(ctx, subschema, attrs){
  if(subschema.type === "boolean"){
    return m("div.form-control", [m("input", attrs)]);
  }else{
    return m("input.form-control", attrs);
  }
};

Renderer.prototype.renderFieldCandidates = function(ctx, subschema, attrs){
  if(!!subschema.widget){
    return this[subschema.widget](ctx, subschema, attrs);
  }else {
    return this.select(ctx, subschema, attrs);
  }
};

Renderer.prototype.radio = function(ctx, subschema, attrs){
  var props = ctx.props;
  var k = ctx.propkey;
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

Renderer.prototype.select = function(ctx, subschema, attrs, multiple){
  var props = ctx.props;
  var k = ctx.propkey;
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


Renderer.prototype.renderFieldMultiple = function(ctx, subschema, attrs){
  if(!!subschema.widget){
    return this[subschema.widget](ctx, subschema, attrs,true);
  }else {
    return this.select(ctx, subschema, attrs,true);
  }
};

Renderer.prototype.check = function(ctx, subschema, attrs, multiple){
  var props = ctx.props;
  var k = ctx.propkey;
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
  var k = ctx.propkey;
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
    return this.renderFieldMultiple(ctx, subschema, attrs);
  }else if(!!subschema.enum){
    return this.renderFieldCandidates(ctx, subschema, attrs);
  }else {
    this.config.putAttrs(subschema, attrs);
    return this.renderFieldUnit(ctx, subschema, attrs);
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

function Collection(items){
  this.items = items;
}

Collection.prototype.toJSON = function(){
  return this.items.map(function(e){return !!e.toJSON? e.toJSON() : e;});
};

Collection.prototype.bind = function(e){
  e.toJSON = this.toJSON.bind(this);
};

Collection.prototype.add = function(e){
  if(this.items.indexOf(e) < 0){
    this.items.push(e);
  }
};

Collection.prototype.remove = function(e){
  this.items = this.items.filter(function(e2){return e !== e2;}); //xxx;
};

Collection.prototype.change = function(e, checked){
  if(checked){
    return this.add(e);
  }else{
    return this.remove(e);
  }
};
//for node.
if(typeof module != "undefined" && module !== null){
  module.exports = Collection;
}

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
