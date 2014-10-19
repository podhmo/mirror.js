var assert = require('power-assert');
var config = require('../src/config');
var renderer = require('../src/renderer');
var Collection = require('../src/collection');
var m = require("mithril");

var containsText = function(k, tree){
  if(!!tree.children){
    for(var i=0,j=tree.children.length; i<j; i++){
      if(containsText(k, tree.children[i])){
        return true;
      }
    }
    return false;
  } else {
    return k === tree;
  }
};

var containsTag = function(k, tree){
  if(tree.tag == k){
    return true;
  }
  if (!!tree.children) {
    for(var i=0,j=tree.children.length; i<j; i++){
      if(containsTag(k, tree.children[i])){
        return true;
      }
    }
  }
  return false;
};

var containsAttrs = function(k, v, tree){
  if (!!tree.attrs && tree.attrs[k] && tree.attrs[k] === v) {
    return true;
  }
  if (!!tree.children) {
    for(var i=0,j=tree.children.length; i<j; i++){
      if(containsAttrs(k, tree.children[i])){
        return true;
      }
    }
  }
  return false;
};

describe("Renderer", function(){
  beforeEach(function(){
    this.renderer = new renderer(new config());
  });
  describe("renderFieldOuter", function(){
    it("outer normal case", function(){
      var result = this.renderer.renderFieldOuter({propkey: "propkey", errors: {}, schema: {}}, "*content*");
      assert(containsText("propkey", result));
      assert(containsTag("label", result));
    });
    it("outer error case", function(){
      var result = this.renderer.renderFieldOuter({propkey: "propkey", errors: {"propkey": "*mismatch*"}, schema: {}}, "*content*");
      assert(containsText("propkey", result));
      assert(containsTag("label", result));
      assert(containsText("*mismatch*", result));
    });
  });
  describe("renderFieldInner", function(){
    it("with enum, in default, select element is used", function(){
      var vm = {"x": m.prop("")};
      var schema = {"properties": {"x": {"type": "string", "enum": ["a","b","c"]}}};
      var context = {props: vm, schema: schema, errors: {}, propkey: "x"};
      var result = this.renderer.renderFieldInner(context);

      assert(containsTag("select", result));
      assert(containsTag("option", result));
      assert(containsText("a", result));
      assert(containsText("b", result));
      assert(containsText("c", result));
    });
    it("with enum, widget[radio], select element is used", function(){
      var vm = {"x": m.prop("")};
      var schema = {"properties": {"x": {"type": "string", "enum": ["a","b","c"], "widget": "radio"}}};
      var context = {props: vm, schema: schema, errors: {}, propkey: "x"};
      var result = this.renderer.renderFieldInner(context);

      assert(containsTag("input", result));
      assert(containsText("a", result));
      assert(containsText("b", result));
      assert(containsText("c", result));
    });
    it("type[array], in default, select element is used(multiple)", function(){
      var vm = {"x": m.prop(new Collection([]))};
      var schema = {"properties": {"x": {"type": "array", "enum": ["a","b","c"]}}};
      var context = {props: vm, schema: schema, errors: {}, propkey: "x"};
      var result = this.renderer.renderFieldInner(context);
      assert(containsTag("select", result));
      assert(containsAttrs("multiple", "multiple", result));
      assert(containsTag("option", result));
      assert(containsText("a", result));
      assert(containsText("b", result));
      assert(containsText("c", result));
    });
    it("with enum, required", function(){
      var vm = {"x": m.prop(new Collection([]))};
      var schema = {"properties": {"x": {"type": "string", "enum": ["a","b","c"]}},
                    "required": ["x"]
                   };
      var context = {props: vm, schema: schema, errors: {}, propkey: "x"};
      var result = this.renderer.renderFieldInner(context);
      assert(result.attrs.required === "required");
    });
    it("normally, input is used", function(){
      var vm = {"x": m.prop("")};
      var schema = {"properties": {"x": {"type": "string"}}};
      var context = {props: vm, schema: schema, errors: {}, propkey: "x"};
      var result = this.renderer.renderFieldInner(context);
      assert(containsTag("input", result));
    });
    it("normally, required", function(){
      var vm = {"x": m.prop("")};
      var schema = {"properties": {"x": {"type": "string"}},
                   "required": ["x"]};
      var context = {props: vm, schema: schema, errors: {}, propkey: "x"};
      var result = this.renderer.renderFieldInner(context);
      assert(result.attrs.required == "required");
    });
  });
});
