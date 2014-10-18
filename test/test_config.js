var assert = require('power-assert');
var config = require('../src/config');


describe("Config", function(){
  beforeEach(function(){
    this.config = new config();
  });
  describe("integer", function(){
    it("schema type[integer] -> form type[number]", function(){
      var attrs = {};
      var schema = {"type": "integer"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "number");
    });
  });
  describe("number", function(){
    it("schema type[number] -> form type[number]", function(){
      var attrs = {};
      var schema = {"type": "number"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "number");
    });
  });
  describe("boolean", function(){
    it("schema type[boolean] -> form type[checkbox]", function(){
      var attrs = {};
      var schema = {"type": "boolean"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "checkbox");
    });
  });
  describe("string", function(){
    it("schema type[string] -> form type[text]", function(){
      var attrs = {};
      var schema = {"type": "string"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "text");
    });
  });
  describe("default", function(){
    it("schema type[] -> form type[text]", function(){
      var attrs = {};
      var schema = {};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "text");
    });
  });
});
