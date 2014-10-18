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
  describe("default", function(){
    it("schema type[] -> form type[text]", function(){
      var attrs = {};
      var schema = {};

      this.config.putAttrs(schema, attrs);
      assert(attrs.type === "text");
    });
  });
});
// describe('Array', function () {
//     beforeEach(function () {
//         this.ary = [1, 2, 3];
//     });
//     describe('#indexOf()', function () {
//         it('should return index when the value is present', function () {
//             var zero = 0, two = 2;
//             assert(this.ary.indexOf(zero) === two);
//         });
//     });
// });
