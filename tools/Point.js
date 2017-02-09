"use strict";
var Point = (function () {
    function Point(text) {
        if (text != null) {
            this.createFromStringInvY(text);
        }
        else {
            this.x = 0;
            this.y = 0;
        }
    }
    Point.prototype.createFromString = function (text) {
        var split = text.split(",", 2);
        if (split.length == 2) {
            this.x = parseFloat(split[0]);
            this.y = parseFloat(split[1]);
        }
    };
    Point.prototype.createFromStringInvY = function (text) {
        var split = text.split(",", 2);
        if (split.length == 2) {
            this.x = parseFloat(split[0]);
            this.y = parseFloat(split[1]) * -1.0;
        }
    };
    Point.prototype.add = function (other) {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
    };
    Point.prototype.getAsString = function () {
        return "[" + this.x + ", " + this.y + "]";
    };
    Point.prototype.log = function () {
        console.log("(" + this.x + "/" + this.y + ")");
    };
    return Point;
}());
exports.Point = Point;
