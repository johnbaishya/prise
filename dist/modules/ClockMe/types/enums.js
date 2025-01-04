"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClockActionEnum = exports.clockStatusEnum = void 0;
var clockStatusEnum;
(function (clockStatusEnum) {
    clockStatusEnum["active"] = "active";
    clockStatusEnum["inactive"] = "inactive";
    clockStatusEnum["completed"] = "completed";
    clockStatusEnum["cancelled"] = "cancelled";
})(clockStatusEnum || (exports.clockStatusEnum = clockStatusEnum = {}));
var updateClockActionEnum;
(function (updateClockActionEnum) {
    updateClockActionEnum["clock_out"] = "clock_out";
    updateClockActionEnum["break_start"] = "break_start";
    updateClockActionEnum["break_end"] = "break_end";
})(updateClockActionEnum || (exports.updateClockActionEnum = updateClockActionEnum = {}));
