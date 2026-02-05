"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockActionType = exports.clockStatus = void 0;
var clockStatus;
(function (clockStatus) {
    clockStatus["active"] = "active";
    clockStatus["inactive"] = "inactive";
    clockStatus["completed"] = "completed";
    clockStatus["cancelled"] = "cancelled";
})(clockStatus || (exports.clockStatus = clockStatus = {}));
var ClockActionType;
(function (ClockActionType) {
    ClockActionType["clock_out"] = "clock_out";
    ClockActionType["break_start"] = "break_start";
    ClockActionType["break_end"] = "break_end";
})(ClockActionType || (exports.ClockActionType = ClockActionType = {}));
