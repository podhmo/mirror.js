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

//extended-format: time, date, color
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
