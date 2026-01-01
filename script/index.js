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
    ;
    var addPoints = function (a, b) {
        return ({
            x: a.x + b.x,
            y: a.y + b.y,
        });
    };
    ;
    ;
    ;
    ;
    ;
    var makeCircle = function (point, radius) {
        return ({
            x: point.x,
            y: point.y,
            radius: radius,
        });
    };
    ;
    ;
    var Data = {
        previousTimestamp: 0,
        width: 0,
        height: 0,
        accent: { units: [], },
        main: { units: [], },
    };
    var sumAreas = function (layer) {
        return layer.units.reduce(function (sum, unit) { return sum + Math.PI * unit.body.radius * unit.body.radius; }, 0);
    };
    var calculateAnimationSineIntegral = function (animation, step) {
        // return stepで積分(Math.sin((animation.phase / animation.period) * Math.PI * 2));
        if (animation.period <= 0 || 0 === step) {
            return 0;
        }
        else {
            var omega = (2 * Math.PI) / animation.period;
            // ∫0^step sin(omega*(phase + τ)) dτ = (cos(omega*phase) - cos(omega*(phase + step))) / omega
            var integral = (Math.cos(omega * animation.phase) - Math.cos(omega * (animation.phase + step))) / omega;
            return integral * animation.scale;
        }
    };
    var accumulateAnimationSineIntegral = function (animations, step) {
        return animations.reduce(function (sum, animation) { return sum + calculateAnimationSineIntegral(animation, step); }, 0);
    };
    var updateAnimation = function (animation, step) {
        animation.phase += step;
        while (animation.period <= animation.phase) {
            animation.phase -= animation.period;
        }
    };
    var updateAnimations = function (animations, step) {
        return animations.forEach(function (animation) { return updateAnimation(animation, step); });
    };
    var updateFloatAnimation = function (floatAnimation, step) {
        updateAnimations(floatAnimation.x, step);
        updateAnimations(floatAnimation.y, step);
    };
    var makeAnimation = function (scaleRate) {
        var phase = 500 + (Math.random() * 100000);
        var result = {
            period: phase * Math.random(),
            phase: phase,
            scale: (0.05 + Math.random() * 0.1) * scaleRate,
        };
        return result;
    };
    var makeUnitAnimation = function () {
        var result = {
            velocity: {
                x: 0,
                y: 0,
            },
            moveAnimation: {
                x: [makeAnimation(1.0), makeAnimation(0.5), makeAnimation(0.25), makeAnimation(0.125),],
                y: [makeAnimation(1.0), makeAnimation(0.5), makeAnimation(0.25), makeAnimation(0.125),],
            },
            sizeAnimation: [makeAnimation(1.0),],
        };
        return result;
    };
    var makeUnit = function (point) {
        var result = {
            body: makeCircle(point, (Math.random() * 0.19) + 0.01),
            animation: makeUnitAnimation(),
        };
        return result;
    };
    var updateUnit = function (unit, step) {
        unit.body.x += accumulateAnimationSineIntegral(unit.animation.moveAnimation.x, step / 2000);
        unit.body.y += accumulateAnimationSineIntegral(unit.animation.moveAnimation.y, step / 2000);
        updateFloatAnimation(unit.animation.moveAnimation, step);
    };
    var updateLayer = function (layer, step) {
        if (sumAreas(layer) < 2.0) {
            layer.units.push(makeUnit(
            // { x: Math.random() -0.5, y: Math.random() -0.5, }
            { x: 0, y: 0, }));
        }
        layer.units.forEach(function (unit) { return updateUnit(unit, step); });
    };
    var updateCircleStretch = function (circle) {
        var xScale = window.innerWidth / Data.width;
        var yScale = window.innerHeight / Data.height;
        var radiusScale = Math.hypot(window.innerWidth, window.innerHeight) / Math.hypot(Data.width, Data.height);
        circle.x *= xScale;
        circle.y *= yScale;
        circle.radius *= radiusScale;
    };
    var updateLayerStretch = function (layer) {
        layer.units.forEach(function (i) {
            updateCircleStretch(i.body);
            if (i.eye) {
                updateCircleStretch(i.eye.white);
                updateCircleStretch(i.eye.iris);
            }
        });
    };
    var updateStretch = function () {
        updateLayerStretch(Data.accent);
        updateLayerStretch(Data.main);
        canvas.width = Data.width = window.innerWidth;
        canvas.height = Data.height = window.innerHeight;
    };
    var updateData = function (timestamp) {
        var step = 0 < Data.previousTimestamp ? (timestamp - Data.previousTimestamp) : 0;
        if (window.innerWidth !== Data.width || window.innerHeight !== Data.height) {
            updateStretch();
        }
        updateLayer(Data.accent, step);
        updateLayer(Data.main, step);
        Data.previousTimestamp = timestamp;
    };
    console.log("Window loaded.");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    if (context) {
        var style_1 = "regular";
        var drawCircle_1 = function (circle, color) {
            var shortSide = Math.min(canvas.width, canvas.height);
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            context.beginPath();
            context.arc((circle.x * shortSide) + centerX, (circle.y * shortSide) + centerY, circle.radius * shortSide, 0, Math.PI * 2);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        };
        var drawEye_1 = function (unit) {
            if (unit.eye) {
                drawCircle_1(makeCircle(addPoints(unit.body, unit.eye.white), unit.eye.white.radius), config_json_1.default.coloring[style_1].base);
                drawCircle_1(makeCircle(addPoints(unit.body, unit.eye.iris), unit.eye.iris.radius), config_json_1.default.coloring[style_1].accent);
            }
        };
        var draw_1 = function () {
            context.fillStyle = config_json_1.default.coloring[style_1].base;
            context.fillRect(0, 0, canvas.width, canvas.height);
            Data.accent.units.forEach(function (unit) {
                drawCircle_1(unit.body, config_json_1.default.coloring[style_1].accent);
                drawEye_1(unit);
            });
            Data.main.units.forEach(function (unit) {
                drawCircle_1(unit.body, config_json_1.default.coloring[style_1].main);
                drawEye_1(unit);
            });
            //drawCircle({ x: 0, y: 0, radius: 0.25, }, config.coloring[style].main);
            drawCircle_1({ x: 0, y: 0, radius: 0.125, }, config_json_1.default.coloring[style_1].base);
            drawCircle_1({ x: 0, y: 0, radius: 0.0625, }, config_json_1.default.coloring[style_1].accent);
        };
        var step_1 = function (timestamp) {
            updateData(timestamp);
            draw_1();
            window.requestAnimationFrame(step_1);
        };
        window.requestAnimationFrame(step_1);
        console.log("Canvas initialized.");
    }
    else {
        console.error("Failed to get 2D context.");
    }
});
//# sourceMappingURL=index.js.map