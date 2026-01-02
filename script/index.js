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
    var makeAnimation = function (scaleRate, phaseRate) {
        if (phaseRate === void 0) { phaseRate = Math.random(); }
        var period = 500 + (Math.pow(pseudoGaussian(1), 2) * 300000);
        var result = {
            period: period,
            phase: period * phaseRate,
            scale: (0.05 + (pseudoGaussian(4) * 0.1)) * scaleRate,
        };
        return result;
    };
    var makeUnitAnimation = function () {
        // const shortSide = Math.min(window.innerWidth, window.innerHeight) *3.0;
        // const xRatio = window.innerWidth / shortSide;
        // const yRatio = window.innerHeight / shortSide;
        var xRatio = 1.0;
        var yRatio = 1.0;
        var result = {
            moveAnimation: {
                x: [
                    makeAnimation(1.0 * xRatio),
                    makeAnimation(0.5 * xRatio),
                    makeAnimation(0.25 * xRatio),
                    makeAnimation(0.125 * xRatio),
                ],
                y: [
                    makeAnimation(1.0 * yRatio),
                    makeAnimation(0.5 * yRatio),
                    makeAnimation(0.25 * yRatio),
                    makeAnimation(0.125 * yRatio),
                ],
            },
            sizeAnimation: [
                makeAnimation(1.0),
                makeAnimation(1.0),
                makeAnimation(1.0),
                makeAnimation(1.0),
                makeAnimation(1.0),
            ],
        };
        result.sizeAnimation.forEach(function (i) {
            i.period += 250;
            //i.period *= 0.5;
            //i.phase *= 0.5;
        });
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
        result.animation.appearAnimation = { period: 3000, phase: 0, scale: result.scale, };
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
        var volume = sumAreas(layer);
        var longSideRatio = 0 < shortSide ? longSide / shortSide : 0;
        var areaRatio = volume / (longSideRatio * 2.0);
        if (areaRatio < 1.0) {
            var makeUnitCooldown = 1000 * areaRatio;
            if (makeUnitCooldown <= timestamp - layer.lastMadeAt) {
                layer.units.push(makeUnit({ x: (pseudoGaussian(1) - 0.5) * window.innerWidth / shortSide, y: (pseudoGaussian(1) - 0.5) * window.innerHeight / shortSide, }));
                layer.lastMadeAt = timestamp;
            }
        }
        else if (1.0 < areaRatio || (0.5 < areaRatio && layer.lastRemovedAt + 3000 < timestamp)) {
            var removeUnitCooldown = 1000 / areaRatio;
            if (removeUnitCooldown <= timestamp - layer.lastRemovedAt) {
                var target = layer.units
                    .filter(function (unit) { return undefined === unit.animation.vanishAnimation && undefined === unit.animation.vanishAnimation; })
                //.sort(Comparer.make([a => -Math.hypot(a.body.x, a.body.y), a => -a.body.radius]))[0];
                //.sort(Comparer.make(a => -a.body.radius))[0];
                [0];
                if (target) {
                    target.animation.vanishAnimation = { period: 1500, phase: 0, scale: target.scale, };
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
    var updateXAnimationStretch = function (animation, xScale) {
        animation.scale *= xScale;
    };
    var updateYAnimationStretch = function (animation, yScale) {
        animation.scale *= yScale;
    };
    var updateCircleStretch = function (circle, xScale, yScale) {
        var radiusScale = Data.width <= Data.height ?
            window.innerWidth / Data.width :
            window.innerHeight / Data.height;
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
        var drawEye_1 = function (unit) {
            if (unit.eye) {
                drawCircle_1(makeCircle(addPoints(unit.body, unit.eye.white), unit.eye.white.radius), config_json_1.default.coloring[style].base);
                drawCircle_1(makeCircle(addPoints(unit.body, unit.eye.iris), unit.eye.iris.radius), config_json_1.default.coloring[style].accent);
            }
        };
        var draw_1 = function () {
            context.fillStyle = config_json_1.default.coloring[style].base;
            //context.globalCompositeOperation = "destination-out";
            context.fillRect(0, 0, canvas.width, canvas.height);
            //context.globalCompositeOperation = "source-over";
            Data.accent.units.forEach(function (unit) {
                drawCircle_1(unit.body, config_json_1.default.coloring[style].accent);
                drawEye_1(unit);
            });
            Data.main.units.forEach(function (unit) {
                drawCircle_1(unit.body, config_json_1.default.coloring[style].main);
                drawEye_1(unit);
            });
            //drawCircle({ x: 0, y: 0, radius: 0.1, }, config.coloring[style].main);
            //drawCircle({ x: 0, y: 0, radius: 0.05, }, config.coloring[style].base);
            //drawCircle({ x: 0, y: 0, radius: 0.025, }, config.coloring[style].accent);
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