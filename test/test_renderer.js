var assert = require('power-assert');
var config = require('../src/config');
var renderer = require('../src/renderer');

// dummy
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
  for(var i=0,j=tree.children.length; i<j; i++){
    if(containsTag(k, tree.children[i])){
      return true;
    }
  }
  return false;
};

describe("Renderer", function(){
  beforeEach(function(){
    this.renderer = new renderer(new config());
  });
  describe("renderFieldOuter", function(){
    it("outer", function(){
      var result = this.renderer.renderFieldOuter("attrname", "*content*");
      assert(containsText("attrname", result));
      assert(containsTag("label", result));
    });
  });
  describe("renderFieldInner", function(){
    it("with enum, select element is used", function(){
      var vm = {"x": m.prop("")};
      var schema = {"properties": {"x": {"type": "string", "enum": ["a","b","c"]}}};
      var result = this.renderer.renderFieldInner(vm, schema, "x");

      assert(containsTag("select", result));
      assert(containsTag("option", result));
      assert(containsText("a", result));
      assert(containsText("b", result));
      assert(containsText("c", result));
    });
    it("with enum, required", function(){
      var vm = {"x": m.prop("")};
      var schema = {"properties": {"x": {"type": "string", "enum": ["a","b","c"]}},
                    "required": ["x"]
                   };
      var result = this.renderer.renderFieldInner(vm, schema, "x");
      assert(result.attrs.required === "required");
    });
    it("normally, input is used", function(){
      var vm = {"x": m.prop("")};
      var schema = {"properties": {"x": {"type": "string"}}};
      var result = this.renderer.renderFieldInner(vm, schema, "x");
      assert(containsTag("input", result));
    });
    it("normally, required", function(){
      var vm = {"x": m.prop("")};
      var schema = {"properties": {"x": {"type": "string"}},
                   "required": ["x"]};
      var result = this.renderer.renderFieldInner(vm, schema, "x");
      assert(result.attrs.required == "required");
    });
  });
});
