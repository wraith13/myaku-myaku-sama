var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("resource/config", [], {
    "applicationTitle": "Myaku-myaku Sama",
    "repositoryUrl": "https://github.com/wraith13/myaku-myaku-sama/",
    "canonicalUrl": "https://wraith13.github.io/myaku-myaku-sama/",
    "description": "Myaku-myaku-sama's pattern animation ( this web app is for study )",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
    "coloring": {
        "regular": {
            "base": "#FFFFFF",
            "main": "red",
            "accent": "blue"
        },
        "monochrome": {
            "base": "#FFFFFF",
            "main": "#000000",
            "accent": "#777777"
        },
        "rene": {
            "base": "#FFFFFF",
            "main": "yallow",
            "accent": "#000000"
        }
    }
});
define("script/index", ["require", "exports", "resource/config"], function (require, exports, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    config_json_1 = __importDefault(config_json_1);
    console.log({ config: config_json_1.default });
    window.addEventListener("load", function () {
        console.log("Window loaded.");
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        if (context) {
            var style_1 = "regular";
            var drawCircle_1 = function (x, y, radius, color) {
                context.beginPath();
                context.arc(x, y, radius, 0, Math.PI * 2);
                context.fillStyle = color;
                context.fill();
                context.closePath();
            };
            var draw_1 = function () {
                context.fillStyle = config_json_1.default.coloring[style_1].base;
                context.fillRect(0, 0, canvas.width, canvas.height);
                var shortSide = Math.min(canvas.width, canvas.height);
                var centerX = canvas.width / 2;
                var centerY = canvas.height / 2;
                var radius = shortSide / 4;
                drawCircle_1(centerX, centerY, radius, config_json_1.default.coloring[style_1].main);
                drawCircle_1(centerX, centerY, radius * 0.5, config_json_1.default.coloring[style_1].base);
                drawCircle_1(centerX, centerY, radius * 0.25, config_json_1.default.coloring[style_1].accent);
            };
            var updateWindowSize_1 = function () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                draw_1();
            };
            updateWindowSize_1();
            window.addEventListener("resize", function () { return updateWindowSize_1(); });
            window.addEventListener("orientationchange", function () { return updateWindowSize_1(); });
        }
        else {
            console.error("Failed to get 2D context.");
            return;
        }
        console.log("Canvas initialized.");
    });
});
//# sourceMappingURL=index.js.map