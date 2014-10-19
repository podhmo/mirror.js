var assert = require('power-assert');
var Collection = require('../src/collection');

var m = require("mithril");

describe("Collection", function(){
  describe("toJSON", function(){
    it("members of props are also jsonized", function(){
      var arr = [{"id": m.prop(1)}, {"id": m.prop(2)}];
      var target = new Collection(arr);

      assert(JSON.stringify(target) === JSON.stringify([{"id": 1}, {"id": 2}]));
    });
  });
  describe("add", function(){
    it("unique", function(){
      var arr = [1,2,3];
      var target = new Collection(arr);
      target.add(1);

      assert(target.items.length === [1,2,3].length);
      assert(target.items[0] === [1,2,3][0]);
      assert(target.items[1] === [1,2,3][1]);
      assert(target.items[2] === [1,2,3][2]);
    });
  });
});
