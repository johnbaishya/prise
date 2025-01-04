"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/page", (req, res) => {
    res.send("this is page 1 of get meal");
});
const getMealRoutes = router;
exports.default = getMealRoutes;
