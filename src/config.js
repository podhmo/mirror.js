function Config(){
}

Config.prototype.string = function(schema, attrs){
  attrs.type = "text";
  if(schema.hasOwnProperty("maxLength")){
    attrs.maxlength = schema.maxLength;
  }
  return attrs;
};

Config.prototype.boolean = function(schema, attrs){
  attrs.type = "checkbox";
  return attrs;
};

Config.prototype.integer = function(schema, attrs){
  attrs.type = "number";
  return attrs;
};

Config.prototype.number = function(schema, attrs){
  attrs.type = "number";
  return attrs;
};

Config.prototype.date_time = function(schema, attrs){
  attrs.type = "datetime-local";
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
  return this.string(schema, attrs);
};

module.exports = Config;
