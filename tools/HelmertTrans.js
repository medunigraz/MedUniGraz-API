"use strict";
var Point_1 = require("./Point");
var HelmertTrans = (function () {
    function HelmertTrans() {
        this.basex = 1722130.949;
        this.basey = 5955420.891;
        this.a1 = 0.215704;
        this.b1 = -0.109056;
    }
    HelmertTrans.prototype.transformPoint = function (p) {
        var newPoint = new Point_1.Point();
        newPoint.x = this.basex + this.a1 * p.x - this.b1 * p.y;
        newPoint.y = this.basey + this.b1 * p.x + this.a1 * p.y;
        return newPoint;
    };
    return HelmertTrans;
}());
exports.HelmertTrans = HelmertTrans;
