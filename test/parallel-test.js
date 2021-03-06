var crudlet = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {
  it("can be run", function(next) {

    var i = 0;
    var j = 0;

    var startTime = Date.now();

    var db1 = function(name, properties) {
      i++;
      expect(Date.now() - startTime).to.be.lessThan(5);
      return _([{ name: "a"}, { name: "a"}, { name: "a" }]).pipe(through.obj(function(data, enc, next) {
        this.push(data);
        setTimeout(next, 3);
      }));
    };

    var db2 = function() {
      i++;
      expect(Date.now() - startTime).to.be.lessThan(5);
      return _([{ name: "a"}, { name: "a"}, { name: "a" }]).pipe(through.obj(function(data, enc, next) {
        this.push(data);
        setTimeout(next, 3);
      }));
    };

    var db3 = crudlet.parallel(db1, db2);
    db3("insert").on("data", function() {
      j++;
    }).on("end", function() {
      expect(i).to.be(2);
      expect(j).to.be(6);
      next();
    });
  });
});
