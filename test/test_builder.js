var assert = require('power-assert');
var builder = require('../src/builder');

var m = require("mithril");

describe("Renderer", function(){
  beforeEach(function(){
    var config = {};
    this.builder = new builder(config);
  });
  describe("buildViewModel", function(){
    it("building view model constructor", function(){
      var schema = {"properties": {"x": {"type": "string"}}};
      var result = this.builder.buildViewModel(schema, {"x": "xxxx"});
      result.init();
      assert(!!result.attributes.x);
      assert(result.jsonify() === JSON.stringify({"x": "xxxx"}, null, 2));
    });
    it("building view model constructor with enum attribute", function(){
      var schema = {"properties": {"x": {"type": "string", "enum": ["a", "b", "c"]}}};
      var result = this.builder.buildViewModel(schema, {});
      result.init();
      assert(result.jsonify() === JSON.stringify({"x": "a"}, null, 2));
    });
    it("building view model constructor with nested object", function(){
      var schema = {"properties": {"ob": {"type": "object", "properties": {"x": {"type": "string"}}}}};
      var result = this.builder.buildViewModel(schema, {"ob": {"x": "xxxx"}});
      result.init();
      assert(result.jsonify() === JSON.stringify({"ob": {"x": "xxxx"}}, null, 2));
    });
    it("building view model constructor with nested object2", function(){
      var schema = {"properties": {"ob": {"x": {"type": "string"}}}};
      var result = this.builder.buildViewModel(schema, {"ob": {"x": "xxxx"}});
      result.init();
      assert(result.jsonify() === JSON.stringify({"ob": {"x": "xxxx"}}, null, 2));
    });
    it("building view model constructor, array", function(){
      var schema = {"properties": {"xs": {"type": "array"}}};
      var result = this.builder.buildViewModel(schema, {"xs": ["xxxx"]});
      result.init();
      assert(result.jsonify() === JSON.stringify({"xs": ["xxxx"]}, null, 2));
    });
    it("building view model constructor, integer", function(){
      var schema = {"properties": {"x": {"type": "integer"}}};
      var result = this.builder.buildViewModel(schema, {"x": "10"});
      result.init();
      assert(result.jsonify() === JSON.stringify({"x": 10}, null, 2));
      result.attributes.x("300");
      assert(result.jsonify() === JSON.stringify({"x": 300}, null, 2));
    });
    it("building view model constructor, number", function(){
      var schema = {"properties": {"x": {"type": "number"}}};
      var result = this.builder.buildViewModel(schema, {"x": "10.1"});
      result.init();
      assert(result.jsonify() === JSON.stringify({"x": 10.1}, null, 2));
      result.attributes.x("300.1");
      assert(result.jsonify() === JSON.stringify({"x": 300.1}, null, 2));
    });
    it("building view model construct, with $ref and definitions", function(){
      var schema = {'definitions': {'Group': {'properties': {'id': {'description': 'primary key',
                                                                    'type': 'integer'},
                                                             'name': {'maxLength': 255,
                                                                      'type': 'string'}},
                                              'type': 'object'}},
                    'properties': {'id': {'description': 'primary key', 'type': 'integer'},
                                   'name': {'maxLength': 255, 'type': 'string'},
                                   'group': {'$ref': '#/definitions/Group'}},
                    'required': ['id'],
                    'title': 'User',
                    'type': 'object'};
      var result = this.builder.buildViewModel(schema);
      result.init();
      assert(result.jsonify() === JSON.stringify({"id": null, "name": "", "group": {"id": null, "name": ""}}, null, 2));
    });
    // it("struct flag check", function(){
    //   var schema = {"properties": {"ob": {"x": {"type": "string"}}}};
    //   var result = this.builder.buildViewModel(schema, {"ob": {"x": "xxxx"}});
    //   result.init();
    //   assert(!!result.ob.struct);
    // });
  });
});
