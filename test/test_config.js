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
    it("schema format[email] -> form type[email]", function(){
      var attrs = {};
      var schema = {"type": "email"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "email");
    });
    it("schema format[date-time] -> form type[datetime-local]", function(){
      var attrs = {};
      var schema = {"type": "date-time"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "datetime-local");
    });
    it("schema format[uri] -> form type[url]", function(){
      var attrs = {};
      var schema = {"type": "uri"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "url");
    });
    it("schema format[date] -> form type[date]", function(){
      var attrs = {};
      var schema = {"type": "date"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "date");
    });
    it("schema format[time] -> form type[time]", function(){
      var attrs = {};
      var schema = {"type": "time"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "time");
    });
    it("schema format[color] -> form type[color]", function(){
      var attrs = {};
      var schema = {"type": "color"};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "color");
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
