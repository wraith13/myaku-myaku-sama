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
    "applicationTitle": "Myaku-myaku Sama",
    "repositoryUrl": "https://github.com/wraith13/myaku-myaku-sama/",
    "canonicalUrl": "https://wraith13.github.io/myaku-myaku-sama/",
    "description": "Myaku-myaku-sama's pattern animation ( this web app is for study )",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
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
    }
});
define("script/index", ["require", "exports", "script/fps", "resource/config"], function (require, exports, fps_1, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        accent: { units: [], lastMadeAt: 0, },
        main: { units: [], lastMadeAt: 0, },
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
    var makeAnimation = function (scaleRate, phaseRate) {
        if (phaseRate === void 0) { phaseRate = Math.random(); }
        var period = 500 + (pseudoGaussian(4) * 200000);
        var result = {
            period: period,
            phase: period * phaseRate,
            scale: (0.05 + (pseudoGaussian(4) * 0.1)) * scaleRate,
        };
        return result;
    };
    var makeUnitAnimation = function () {
        var shortSide = Math.min(window.innerWidth, window.innerHeight);
        var xRatio = window.innerWidth / shortSide;
        var yRatio = window.innerHeight / shortSide;
        var result = {
            velocity: {
                x: 0,
                y: 0,
            },
            moveAnimation: {
                x: [makeAnimation(1.0 * xRatio), makeAnimation(0.5 * xRatio), makeAnimation(0.25 * xRatio), makeAnimation(0.125 * xRatio),],
                y: [makeAnimation(1.0 * yRatio), makeAnimation(0.5 * yRatio), makeAnimation(0.25 * yRatio), makeAnimation(0.125 * yRatio),],
            },
            sizeAnimation: [makeAnimation(1.0),],
        };
        return result;
    };
    var makeUnit = function (point) {
        var result = {
            body: makeCircle(point, (Math.pow(pseudoGaussian(4), 2) * 0.19) + 0.01),
            animation: makeUnitAnimation(),
        };
        return result;
    };
    var updateUnit = function (unit, step) {
        var rate = 0.0005;
        unit.body.x += accumulateAnimationSineIntegral(unit.animation.moveAnimation.x, step) * rate;
        unit.body.y += accumulateAnimationSineIntegral(unit.animation.moveAnimation.y, step) * rate;
        updateFloatAnimation(unit.animation.moveAnimation, step);
    };
    var updateLayer = function (layer, timestamp, step) {
        var makeUnitCooldown = 100;
        if (makeUnitCooldown <= timestamp - layer.lastMadeAt) {
            var shortSide = Math.min(window.innerWidth, window.innerHeight);
            var longSide = Math.max(window.innerWidth, window.innerHeight);
            var longSideRatio = longSide / shortSide;
            if (sumAreas(layer) < (1.5 * longSideRatio)) {
                layer.units.push(makeUnit(
                // { x: Math.random() -0.5, y: Math.random() -0.5, }
                { x: 0, y: 0, }));
                layer.lastMadeAt = timestamp;
            }
        }
        layer.units.forEach(function (unit) { return updateUnit(unit, step); });
    };
    var updateXAnimationStretch = function (animation, xScale) {
        animation.scale *= xScale;
    };
    var updateYAnimationStretch = function (animation, yScale) {
        animation.scale *= yScale;
    };
    var updateCircleStretch = function (circle, xScale, yScale) {
        var oldShortSide = Math.min(Data.width, Data.height);
        var newShortSide = Math.min(window.innerWidth, window.innerHeight);
        var radiusScale = newShortSide / oldShortSide;
        circle.x *= xScale;
        circle.y *= yScale;
        circle.radius *= radiusScale;
    };
    var updateLayerStretch = function (layer) {
        var xScale = window.innerWidth / Data.width;
        var yScale = window.innerHeight / Data.height;
        layer.units.forEach(function (i) {
            updateCircleStretch(i.body, xScale, yScale);
            i.animation.moveAnimation.x.forEach(function (a) { return updateXAnimationStretch(a, xScale); });
            i.animation.moveAnimation.y.forEach(function (a) { return updateYAnimationStretch(a, yScale); });
            if (i.eye) {
                updateCircleStretch(i.eye.white, xScale, yScale);
                updateCircleStretch(i.eye.iris, xScale, yScale);
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
    if (context) {
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
                drawCircle_1(makeCircle(addPoints(unit.body, unit.eye.white), unit.eye.white.radius), config_json_1.default.coloring[style].base);
                drawCircle_1(makeCircle(addPoints(unit.body, unit.eye.iris), unit.eye.iris.radius), config_json_1.default.coloring[style].accent);
            }
        };
        var draw_1 = function () {
            context.fillStyle = config_json_1.default.coloring[style].base;
            context.fillRect(0, 0, canvas.width, canvas.height);
            Data.accent.units.forEach(function (unit) {
                drawCircle_1(unit.body, config_json_1.default.coloring[style].accent);
                drawEye_1(unit);
            });
            Data.main.units.forEach(function (unit) {
                drawCircle_1(unit.body, config_json_1.default.coloring[style].main);
                drawEye_1(unit);
            });
            //drawCircle({ x: 0, y: 0, radius: 0.25, }, config.coloring[style].main);
            drawCircle_1({ x: 0, y: 0, radius: 0.125, }, config_json_1.default.coloring[style].base);
            drawCircle_1({ x: 0, y: 0, radius: 0.0625, }, config_json_1.default.coloring[style].accent);
        };
        var step_1 = function (timestamp) {
            updateData(timestamp);
            draw_1();
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
        console.error("Failed to get 2D context.");
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
});
//# sourceMappingURL=index.js.map