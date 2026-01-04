var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("script/fps", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Fps = void 0;
    var Fps;
    (function (Fps) {
        var OnlineStandardDeviation = /** @class */ (function () {
            function OnlineStandardDeviation() {
                var _this = this;
                this.count = 0;
                this.mean = 0;
                this.m2 = 0;
                this.reset = function () {
                    _this.count = 0;
                    _this.mean = 0;
                    _this.m2 = 0;
                };
                this.update = function (value) {
                    _this.count += 1;
                    var delta = value - _this.mean;
                    _this.mean += delta / _this.count;
                    var delta2 = value - _this.mean;
                    _this.m2 += delta * delta2;
                };
                this.isValid = function () { return 1 < _this.count; };
                this.getVariance = function () {
                    return _this.isValid() ? _this.m2 / (_this.count - 1) : 0;
                };
                this.getStandardDeviation = function () {
                    return Math.sqrt(_this.getVariance());
                };
            }
            return OnlineStandardDeviation;
        }());
        Fps.OnlineStandardDeviation = OnlineStandardDeviation;
        Fps.standardDeviation = new OnlineStandardDeviation();
        var fpsWindow = 1000; // ms
        var frameTimings = [];
        var fpsHistory = [];
        Fps.averageFps = NaN; // Stores the average FPS over the most recent 1 second
        var makeInvalidFpsHistoryEntry = function () {
            return ({
                fps: NaN,
                now: NaN,
                text: "N/A FPS",
            });
        };
        Fps.reset = function () {
            Fps.isValid = false;
            frameTimings = [];
            fpsHistory = [];
            Fps.currentMaxFps = Fps.currentNowFps = Fps.currentMinFps =
                makeInvalidFpsHistoryEntry();
            Fps.standardDeviation.reset();
            Fps.averageFps = NaN; // リセット時に初期化
        };
        Fps.step = function (now) {
            frameTimings.push(now);
            Fps.isValid = 2 <= frameTimings.length;
            if (Fps.isValid) {
                while (2 < frameTimings.length && fpsWindow < now - frameTimings[0]) {
                    frameTimings.shift();
                }
                var timeSpan = Math.max(now - frameTimings[0], 0.001); // max for avoid 0 div
                var frameCount = frameTimings.length - 1;
                var fps = (frameCount * 1000) / timeSpan;
                Fps.standardDeviation.update(fps);
                Fps.currentNowFps =
                    {
                        fps: fps,
                        now: now,
                        text: makeFpsText(fps),
                    };
                var expiredAt = now - fpsWindow;
                while (0 < fpsHistory.length && fpsHistory[0].now < expiredAt) {
                    fpsHistory.shift();
                }
                fpsHistory.push(Fps.currentNowFps);
                Fps.currentMaxFps = Fps.currentNowFps;
                Fps.currentMinFps = Fps.currentNowFps;
                fpsHistory.forEach(function (i) {
                    if (Fps.currentMaxFps.fps < i.fps) {
                        Fps.currentMaxFps = i;
                    }
                    if (i.fps < Fps.currentMinFps.fps) {
                        Fps.currentMinFps = i;
                    }
                });
                var totalFps = fpsHistory.map(function (i) { return i.fps; }).reduce(function (a, v) { return a + v; }, 0);
                Fps.averageFps = totalFps / fpsHistory.length;
                if (Fps.isUnderFuseFps()) {
                    console.error("❌ UnderFuseFps:", {
                        fuseFps: Fps.fuseFps,
                        maxFps: Fps.currentMaxFps.fps,
                        nowFps: Fps.currentMaxFps.fps,
                        minFps: Fps.currentMinFps.fps,
                        averageFps: Fps.averageFps,
                    });
                }
            }
        };
        var makeFpsText = function (fps) {
            return "".concat(fps.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 2, minimumFractionDigits: 2, }), " FPS");
        };
        Fps.getText = function () {
            var _a, _b;
            return ((_a = Fps.currentMaxFps === null || Fps.currentMaxFps === void 0 ? void 0 : Fps.currentMaxFps.text) !== null && _a !== void 0 ? _a : "N/A") + " (Max)\n"
                + "".concat(Fps.averageFps.toFixed(2), " FPS (Avg)\n")
                //+currentNowFps.text + " (Now)\n"
                + ((_b = Fps.currentMinFps === null || Fps.currentMinFps === void 0 ? void 0 : Fps.currentMinFps.text) !== null && _b !== void 0 ? _b : "N/A") + " (Min)";
        };
        Fps.isUnderFuseFps = function () { return Fps.isValid && Fps.currentMaxFps.fps < Fps.fuseFps; };
    })(Fps || (exports.Fps = Fps = {}));
});
define("resource/config", [], {
    "applicationTitle": "Myaku-Myaku Sama",
    "repositoryUrl": "https://github.com/wraith13/myaku-myaku-sama/",
    "canonicalUrl": "https://wraith13.github.io/myaku-myaku-sama/",
    "description": "Myaku-Myaku Sama's pattern animation ( this web app is for study )",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
    "rendering": {
        "marginRate": 0.9
    },
    "coloring": {
        "regular": {
            "base": "#FFFFFF",
            "main": "#E50012",
            "accent": "#0068B6"
        },
        "monochrome": {
            "base": "#FFFFFF",
            "main": "#000000",
            "accent": "#72716F"
        }
    },
    "eye": {
        "appearRate": 0.12,
        "vanishRate": 0.1,
        "whiteRate": 0.4,
        "irisRate": 0.2
    },
    "Layer": {
        "unit": {
            "moveAnimation": {
                "period": {
                    "base": 500,
                    "pseudoGaussian": 2,
                    "range": 300000
                },
                "scale": {
                    "base": 0.05,
                    "pseudoGaussian": 4,
                    "range": 0.1
                },
                "elements": [
                    1.0,
                    0.5,
                    0.25,
                    0.125
                ]
            },
            "sizeAnimation": {
                "period": {
                    "base": 750,
                    "pseudoGaussian": 2,
                    "range": 300000
                },
                "scale": {
                    "base": 0.05,
                    "pseudoGaussian": 4,
                    "range": 0.1
                },
                "elements": [
                    1.0,
                    1.0,
                    1.0,
                    1.0,
                    1.0
                ]
            },
            "appearAnimation": {
                "period": 3000
            },
            "vanishAnimation": {
                "period": 1500
            }
        }
    }
});
define("script/index", ["require", "exports", "script/fps", "resource/config"], function (require, exports, fps_1, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mousemove = exports.ToggleClassForWhileTimer = void 0;
    config_json_1 = __importDefault(config_json_1);
    var fpsDiv = document.getElementById("fps");
    var pseudoGaussian = function (samples) {
        if (samples === void 0) { samples = 6; }
        var total = 0;
        for (var i = 0; i < samples; i++) {
            total += Math.random();
        }
        return total / samples;
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
        accent: { units: [], lastMadeAt: 0, lastRemovedAt: 0, },
        main: { units: [], lastMadeAt: 0, lastRemovedAt: 0, },
    };
    var isOutOfCanvas = function (circle) {
        var marginRate = config_json_1.default.rendering.marginRate;
        var shortSide = Math.min(canvas.width, canvas.height);
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var x = (circle.x * marginRate * shortSide) + centerX;
        var y = (circle.y * marginRate * shortSide) + centerY;
        return (x + circle.radius * shortSide < 0 ||
            y + circle.radius * shortSide < 0 ||
            canvas.width < x - circle.radius * shortSide ||
            canvas.height < y - circle.radius * shortSide);
    };
    var sumValidAreas = function (layer) {
        return layer.units
            .filter(function (unit) { return !isOutOfCanvas(unit.body); })
            .reduce(function (sum, unit) { return sum + Math.PI * unit.body.radius * unit.body.radius; }, 0);
    };
    var sumAllAreas = function (layer) {
        return layer.units
            .reduce(function (sum, unit) { return sum + Math.PI * unit.body.radius * unit.body.radius; }, 0);
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
    var accumulateAnimationSize = function (animations, step) {
        return animations.reduce(function (product, animation) {
            var phase = animation.phase + step;
            return product + Math.pow(Math.sin((phase / animation.period) * Math.PI), 2) * 0.5 * animation.scale;
        }, 0.0);
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
    var makeAnimation = function (specific, scaleRate) {
        var period = specific.period.base + (pseudoGaussian(specific.period.pseudoGaussian) * specific.period.range);
        var phase = period * Math.random();
        var scale = (specific.scale.base + (pseudoGaussian(specific.scale.pseudoGaussian) * specific.scale.range)) * scaleRate;
        return { phase: phase, period: period, scale: scale, };
    };
    var makeUnitAnimation = function () {
        // const shortSide = Math.min(window.innerWidth, window.innerHeight) *3.0;
        // const xRatio = window.innerWidth / shortSide;
        // const yRatio = window.innerHeight / shortSide;
        var xRatio = 1.0;
        var yRatio = 1.0;
        var result = {
            moveAnimation: {
                x: config_json_1.default.Layer.unit.moveAnimation.elements.map(function (i) { return makeAnimation(config_json_1.default.Layer.unit.moveAnimation, i * xRatio); }),
                y: config_json_1.default.Layer.unit.moveAnimation.elements.map(function (i) { return makeAnimation(config_json_1.default.Layer.unit.moveAnimation, i * yRatio); }),
            },
            sizeAnimation: config_json_1.default.Layer.unit.sizeAnimation.elements.map(function (i) { return makeAnimation(config_json_1.default.Layer.unit.sizeAnimation, i); }),
        };
        return result;
    };
    var makeUnit = function (point) {
        var body = makeCircle(point, (Math.pow(pseudoGaussian(4), 2) * 0.19) + 0.01);
        var result = {
            body: body,
            scale: body.radius,
            animation: makeUnitAnimation(),
        };
        //updateUnit(result, Math.random() *10000);
        result.animation.appearAnimation =
            {
                period: config_json_1.default.Layer.unit.appearAnimation.period,
                phase: 0,
                scale: result.scale,
            };
        return result;
    };
    var updateUnit = function (unit, step) {
        var _a;
        var rate = 0.0005;
        unit.body.x += accumulateAnimationSineIntegral(unit.animation.moveAnimation.x, step) * rate;
        unit.body.y += accumulateAnimationSineIntegral(unit.animation.moveAnimation.y, step) * rate;
        var transion = (_a = unit.animation.appearAnimation) !== null && _a !== void 0 ? _a : unit.animation.vanishAnimation;
        if (transion) {
            transion.phase += step;
            if (unit.animation.vanishAnimation) {
                unit.body.radius = transion.scale * (1.0 - (transion.phase / transion.period));
                if (transion.period <= transion.phase) {
                    unit.animation.vanishAnimation = undefined;
                }
            }
            else {
                unit.body.radius = transion.scale * (transion.phase / transion.period);
                if (transion.period <= transion.phase) {
                    unit.animation.appearAnimation = undefined;
                }
            }
        }
        var scale = transion ? unit.body.radius : unit.scale;
        unit.body.radius = scale * (1 + (accumulateAnimationSize(unit.animation.sizeAnimation, step) * 2.0));
        updateFloatAnimation(unit.animation.moveAnimation, step);
        updateAnimations(unit.animation.sizeAnimation, step);
    };
    var updateLayer = function (layer, timestamp, step) {
        var shortSide = Math.min(window.innerWidth, window.innerHeight);
        var longSide = Math.max(window.innerWidth, window.innerHeight);
        var validVolume = sumValidAreas(layer);
        var allVolume = sumAllAreas(layer);
        var longSideRatio = 0 < shortSide ? longSide / shortSide : 0;
        var validAreaRatio = validVolume / (longSideRatio * 2.0);
        var allAreaRatio = allVolume / Math.min(longSideRatio * 2.0, validVolume);
        if (validAreaRatio < 0.5) {
            var makeUnitCooldown = 1000 * validAreaRatio;
            if (makeUnitCooldown <= timestamp - layer.lastMadeAt) {
                layer.units.push(makeUnit({ x: (pseudoGaussian(1) - 0.5) * window.innerWidth / shortSide, y: (pseudoGaussian(1) - 0.5) * window.innerHeight / shortSide, }));
                layer.lastMadeAt = timestamp;
            }
        }
        else if (1.0 < allAreaRatio || (0.5 < allAreaRatio && layer.lastRemovedAt + 3000 < timestamp)) {
            var removeUnitCooldown = 1000 / allAreaRatio;
            if (removeUnitCooldown <= timestamp - layer.lastRemovedAt) {
                var target = layer.units.filter(function (unit) { return undefined === unit.animation.vanishAnimation; })[0];
                if (target) {
                    target.animation.vanishAnimation =
                        {
                            period: config_json_1.default.Layer.unit.vanishAnimation.period,
                            phase: 0,
                            scale: target.scale,
                        };
                    layer.lastRemovedAt = timestamp;
                }
            }
        }
        layer.units.forEach(function (unit) { return updateUnit(unit, step); });
        var gabages = layer.units.filter(function (unit) { return unit.body.radius <= 0; });
        gabages.forEach(function (garbage) {
            var index = layer.units.indexOf(garbage);
            if (0 <= index) {
                layer.units.splice(index, 1);
            }
        });
    };
    var updateStretch = function () {
        canvas.width = Data.width = window.innerWidth;
        canvas.height = Data.height = window.innerHeight;
    };
    var updateData = function (timestamp) {
        var step = 0 < Data.previousTimestamp ? Math.min(timestamp - Data.previousTimestamp, 500) : 0;
        if (window.innerWidth !== Data.width || window.innerHeight !== Data.height) {
            updateStretch();
        }
        updateLayer(Data.accent, timestamp, step);
        updateLayer(Data.main, timestamp, step);
        Data.previousTimestamp = timestamp;
    };
    console.log("Window loaded.");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var style = "regular";
    var hasFusionPath = function (fusionStatus) {
        return ["none", "inclusion"].indexOf(fusionStatus) < 0;
    };
    var isContacted = function (fusionStatus) {
        return 0 <= ["contact", "inclusion"].indexOf(fusionStatus);
    };
    var getFusionStatus = function (data) {
        if (data.fusionLimit < data.distance) {
            return "none";
        }
        if (data.sumRadius + data.fusionDelta * 2 <= data.distance) {
            return "wired";
        }
        if (data.sumRadius < data.distance) {
            return "proximity";
        }
        if (data.sumRadius - data.minRadius * 2 < data.distance) {
            return "contact";
        }
        return "inclusion";
    };
    var fusionLimitRate = 3;
    var fusionDeltaRate = 0.1;
    var minCurveAngleRate = 1.0;
    var drawFusionPath = function (circles, color) {
        for (var i = 0; i < circles.length; i++) {
            for (var j = i + 1; j < circles.length; j++) {
                var a = circles[i];
                var b = circles[j];
                var sumRadius = a.radius + b.radius;
                var minRadius = Math.min(a.radius, b.radius);
                var maxRadius = Math.min(a.radius, b.radius);
                var fusionLimit = sumRadius + Math.min(minRadius * fusionLimitRate, maxRadius);
                var fusionDelta = minRadius * fusionDeltaRate;
                var dx = b.x - a.x;
                var dy = b.y - a.y;
                var angle = Math.atan2(dy, dx);
                var distance = Math.hypot(dx, dy);
                var fusionStatus = getFusionStatus({ sumRadius: sumRadius, minRadius: minRadius, fusionLimit: fusionLimit, fusionDelta: fusionDelta, distance: distance, });
                if (hasFusionPath(fusionStatus)) {
                    var contactAngle = isContacted(fusionStatus) ? Math.acos(distance / sumRadius) : null;
                    var curveAngleRate = minCurveAngleRate *
                        (isContacted(fusionStatus) ? 1 :
                            Math.pow(((fusionLimit - sumRadius) - (distance - sumRadius)) / (fusionLimit - sumRadius), 0.3));
                    var minCurveAngle1 = curveAngleRate * minRadius / a.radius;
                    var minCurveAngle2 = curveAngleRate * minRadius / b.radius;
                    var theta1 = Math.min((contactAngle !== null && contactAngle !== void 0 ? contactAngle : 0) + minCurveAngle1, Math.PI - minCurveAngle1);
                    var theta2 = Math.min((contactAngle !== null && contactAngle !== void 0 ? contactAngle : 0) + minCurveAngle2, Math.PI - minCurveAngle2);
                    // 左タンジェント (tp1 on c1, tp3 on c2)
                    var tp1 = {
                        x: a.x + a.radius * Math.cos(angle + theta1),
                        y: a.y + a.radius * Math.sin(angle + theta1)
                    };
                    var tp3 = {
                        x: b.x + b.radius * Math.cos(angle + (Math.PI + theta2)),
                        y: b.y + b.radius * Math.sin(angle + (Math.PI + theta2))
                    };
                    // 右タンジェント (tp2 on c1, tp4 on c2)
                    var tp2 = {
                        x: a.x + a.radius * Math.cos(angle - theta1),
                        y: a.y + a.radius * Math.sin(angle - theta1)
                    };
                    var tp4 = {
                        x: b.x + b.radius * Math.cos(angle + (Math.PI - theta2)),
                        y: b.y + b.radius * Math.sin(angle + (Math.PI - theta2))
                    };
                    var cp0 = {
                        x: (tp1.x + tp2.x + tp3.x + tp4.x) / 4,
                        y: (tp1.y + tp2.y + tp3.y + tp4.y) / 4,
                    };
                    var contactDist = sumRadius + minRadius;
                    var cpRate = contactDist <= distance ? 0 :
                        Math.min(1, (contactDist - distance) / (minRadius * 2));
                    var cp1 = contactDist <= distance ?
                        cp0 :
                        {
                            x: cp0.x * (1 - cpRate) + ((tp1.x + tp4.x) / 2) * cpRate,
                            y: cp0.y * (1 - cpRate) + ((tp1.y + tp4.y) / 2) * cpRate,
                        };
                    var cp2 = contactDist <= distance ?
                        cp0 :
                        {
                            x: cp0.x * (1 - cpRate) + ((tp2.x + tp3.x) / 2) * cpRate,
                            y: cp0.y * (1 - cpRate) + ((tp2.y + tp3.y) / 2) * cpRate,
                        };
                    context.beginPath();
                    // 上側ベジェ: tp1 -> cp -> tp3 (cpは中点+オフセットで曲げ)
                    context.moveTo(tp1.x, tp1.y);
                    context.quadraticCurveTo(cp1.x, cp1.y, tp4.x, tp4.y); // またはbezierCurveToでcubic
                    // 下側ベジェ: tp2 -> cp -> tp4
                    context.lineTo(tp3.x, tp3.y);
                    context.quadraticCurveTo(cp2.x, cp2.y, tp2.x, tp2.y);
                    context.lineTo(tp1.x, tp1.y);
                    context.fillStyle = color;
                    // connection.fillStyle = "#00000088";
                    context.fill();
                    context.closePath();
                    // connection.beginPath();
                    // connection.arc(tangents.tp1.x, tangents.tp1.y, 4, 0, Math.PI * 2);
                    // connection.arc(tangents.tp2.x, tangents.tp2.y, 4, 0, Math.PI * 2);
                    // connection.arc(tangents.tp3.x, tangents.tp3.y, 4, 0, Math.PI * 2);
                    // connection.arc(tangents.tp4.x, tangents.tp4.y, 4, 0, Math.PI * 2);
                    // connection.fillStyle = "#00000088";
                    // connection.fill();
                    // connection.closePath();
                }
            }
        }
    };
    var drawCircle = function (circle, color) {
        if (0 <= circle.radius) {
            var shortSide = Math.min(canvas.width, canvas.height);
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            context.beginPath();
            context.arc((circle.x * shortSide) + centerX, (circle.y * shortSide) + centerY, circle.radius * shortSide, 0, Math.PI * 2);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        }
    };
    var drawLayer = function (layer, color) {
        var shortSide = Math.min(canvas.width, canvas.height);
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        drawFusionPath(layer.units.map(function (u) { return u.body; })
            // .concat([ { x: 0, y: 0, radius: 0.1, } ])
            .filter(function (c) { return !isOutOfCanvas(c); })
            .map(function (c) {
            return ({
                x: (c.x * shortSide) + centerX,
                y: (c.y * shortSide) + centerY,
                radius: c.radius * shortSide,
            });
        }), color);
        layer.units.forEach(function (unit) {
            drawCircle(unit.body, color);
        });
        if (layer === Data.main) {
            drawFusionPath(layer.units.map(function (u) { return u.body; })
                .filter(function (c) { return config_json_1.default.eye.appearRate <= c.radius; })
                .filter(function (c) { return !isOutOfCanvas(c); })
                .map(function (c) {
                return ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius * shortSide * config_json_1.default.eye.whiteRate,
                });
            }), config_json_1.default.coloring[style].base);
            drawFusionPath(layer.units.map(function (u) { var _a; return (_a = u.eye) === null || _a === void 0 ? void 0 : _a.white; })
                .filter(function (c) { return undefined !== c; })
                .filter(function (c) { return !isOutOfCanvas(c); })
                .map(function (c) {
                return ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius * shortSide,
                });
            }), config_json_1.default.coloring[style].base);
            layer.units.forEach(function (unit) {
                if (config_json_1.default.eye.appearRate <= unit.body.radius && !isOutOfCanvas(unit.body)) {
                    drawCircle({ x: unit.body.x, y: unit.body.y, radius: unit.body.radius * config_json_1.default.eye.whiteRate, }, config_json_1.default.coloring[style].base);
                }
            });
            drawFusionPath(layer.units.map(function (u) { return u.body; })
                .filter(function (c) { return config_json_1.default.eye.appearRate <= c.radius; })
                .filter(function (c) { return !isOutOfCanvas(c); })
                .map(function (c) {
                return ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius * shortSide * config_json_1.default.eye.irisRate,
                });
            }), config_json_1.default.coloring[style].accent);
            drawFusionPath(layer.units.map(function (u) { var _a; return (_a = u.eye) === null || _a === void 0 ? void 0 : _a.iris; })
                .filter(function (c) { return undefined !== c; })
                .filter(function (c) { return !isOutOfCanvas(c); })
                .map(function (c) {
                return ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius * shortSide,
                });
            }), config_json_1.default.coloring[style].accent);
            layer.units.forEach(function (unit) {
                if (config_json_1.default.eye.appearRate <= unit.body.radius && !isOutOfCanvas(unit.body)) {
                    drawCircle({ x: unit.body.x, y: unit.body.y, radius: unit.body.radius * config_json_1.default.eye.irisRate, }, config_json_1.default.coloring[style].accent);
                }
            });
        }
    };
    var draw = function () {
        context.fillStyle = config_json_1.default.coloring[style].base;
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawLayer(Data.accent, config_json_1.default.coloring[style].accent);
        drawLayer(Data.main, config_json_1.default.coloring[style].main);
        // const body = 0.1;
        // drawCircle({ x: 0, y: 0, radius: body, }, config.coloring[style].main);
        // drawCircle({ x: 0, y: 0, radius: body *config.eye.whiteRate, }, config.coloring[style].base);
        // drawCircle({ x: 0, y: 0, radius: body *config.eye.irisRate, }, config.coloring[style].accent);
    };
    if (context) {
        var step_1 = function (timestamp) {
            updateData(timestamp);
            draw();
            if (fpsDiv && fpsDiv.style.display !== "none") {
                fps_1.Fps.step(timestamp);
                fpsDiv.innerText = fps_1.Fps.getText();
            }
            window.requestAnimationFrame(step_1);
        };
        window.requestAnimationFrame(step_1);
        console.log("Canvas initialized.");
    }
    else {
        console.error("Failed to get 2D connection.");
    }
    if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
        document.addEventListener("keydown", function (event) {
            if ("f" === event.key.toLowerCase()) {
                var elem = document.documentElement;
                if (document.fullscreenEnabled) {
                    if (!document.fullscreenElement) {
                        elem.requestFullscreen();
                    }
                    else {
                        document.exitFullscreen();
                    }
                }
                else {
                    if (document.webkitFullscreenEnabled) {
                        if (!document.webkitFullscreenElement) {
                            elem.webkitRequestFullscreen();
                        }
                        else {
                            document.webkitExitFullscreen();
                        }
                    }
                }
            }
        });
    }
    if (fpsDiv) {
        //fpsDiv.style.display = "none";
        document.addEventListener("keydown", function (event) {
            if ("s" === event.key.toLowerCase()) {
                if ("none" === fpsDiv.style.display) {
                    fpsDiv.style.display = "block";
                }
                else {
                    fpsDiv.style.display = "none";
                }
            }
        });
    }
    document.addEventListener("click", function () {
        var keys = Object.keys(config_json_1.default.coloring);
        var currentIndex = keys.indexOf(style);
        var nextIndex = (currentIndex + 1) % keys.length;
        style = keys[nextIndex];
    });
    var ToggleClassForWhileTimer = /** @class */ (function () {
        function ToggleClassForWhileTimer() {
            var _this = this;
            this.isInTimer = function () { return undefined !== _this.timer; };
            this.timer = undefined;
        }
        ToggleClassForWhileTimer.prototype.start = function (element, token, span, onEnd) {
            var _this = this;
            if (this.isInTimer()) {
                clearTimeout(this.timer);
            }
            element.classList.toggle(token, true);
            this.timer = setTimeout(function () {
                // if (config.log["ToggleClassForWhileTimer.Timeout"])
                // {
                //     console.log("⌛️ ToggleClassForWhileTimer.Timeout", element, token, span);
                // }
                _this.timer = undefined;
                element.classList.toggle(token, false);
                onEnd === null || onEnd === void 0 ? void 0 : onEnd();
            }, span);
        };
        return ToggleClassForWhileTimer;
    }());
    exports.ToggleClassForWhileTimer = ToggleClassForWhileTimer;
    var mouseMoveTimer = new ToggleClassForWhileTimer();
    var mousemove = function () {
        return mouseMoveTimer.start(document.body, "mousemove", 3000);
    };
    exports.mousemove = mousemove;
    document.addEventListener("mousemove", function (_event) {
        (0, exports.mousemove)();
    });
});
//# sourceMappingURL=index.js.map