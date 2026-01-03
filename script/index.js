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
    var fusionThreshold = 1.0; // 融合閾値 (r1 + r2) * this
    var useFusion = false; // トグル: trueで融合描画、falseで個別円
    var getTangentPoints = function (c1, c2) {
        var dx = c2.x - c1.x;
        var dy = c2.y - c1.y;
        var dist = Math.hypot(dx, dy);
        var sumR = c1.radius + c2.radius;
        var minR = Math.min(c1.radius, c2.radius);
        //const maxR = Math.max(c1.radius, c2.radius);
        if (dist > sumR + (minR * fusionThreshold) || dist < Math.abs(c1.radius - c2.radius))
            return null; // 遠すぎ/重なりすぎ
        //const d = Math.sqrt(dist ** 2 - (c1.radius - c2.radius) ** 2);  // タンジェント長
        var angle = Math.atan2(dy, dx);
        // const theta = Math.acos((c1.radius - c2.radius) / dist);
        var theta1 = Math.acos(dist / (c2.radius + sumR));
        var theta2 = Math.acos(dist / (c1.radius + sumR));
        var isC1Embedded = dist < c2.radius;
        var isC2Embedded = dist < c1.radius;
        // 左タンジェント (tp1 on c1, tp3 on c2)
        var tp1 = {
            x: c1.x + c1.radius * Math.cos(angle + (isC1Embedded ? (Math.PI - theta1) : theta1)),
            y: c1.y + c1.radius * Math.sin(angle + (isC1Embedded ? (Math.PI - theta1) : theta1))
        };
        var tp3 = {
            x: c2.x + c2.radius * Math.cos(angle + (isC2Embedded ? -theta2 : (Math.PI + theta2))),
            y: c2.y + c2.radius * Math.sin(angle + (isC2Embedded ? -theta2 : (Math.PI + theta2)))
        };
        // 右タンジェント (tp2 on c1, tp4 on c2)
        var tp2 = {
            x: c1.x + c1.radius * Math.cos(angle + (isC1Embedded ? (Math.PI + theta1) : -theta1)),
            y: c1.y + c1.radius * Math.sin(angle + (isC1Embedded ? (Math.PI + theta1) : -theta1))
        };
        var tp4 = {
            x: c2.x + c2.radius * Math.cos(angle + (isC2Embedded ? theta2 : (Math.PI - theta2))),
            y: c2.y + c2.radius * Math.sin(angle + (isC2Embedded ? theta2 : (Math.PI - theta2)))
        };
        // const cp1: Point =
        // {
        //     x: (tp1.x + tp4.x) / 2 + (tp4.y - tp1.y) * 0.2,
        //     y: (tp1.y + tp4.y) / 2 - (tp4.x - tp1.x) * 0.2,
        // };
        // const cp2: Point =
        // {
        //     x: (tp2.x + tp3.x) / 2 - (tp3.y - tp2.y) * 0.2,
        //     y: (tp2.y + tp3.y) / 2 + (tp3.x - tp2.x) * 0.2,
        // };
        var cp0 = {
            x: (tp1.x + tp2.x + tp3.x + tp4.x) / 4,
            y: (tp1.y + tp2.y + tp3.y + tp4.y) / 4,
        };
        var contactDist = sumR + minR;
        var cpRate = contactDist <= dist ? 0 :
            Math.min(1, (contactDist - dist) / (minR * 2));
        var cp1 = contactDist <= dist ?
            cp0 :
            {
                x: cp0.x * (1 - cpRate) + ((tp1.x + tp4.x) / 2) * cpRate,
                y: cp0.y * (1 - cpRate) + ((tp1.y + tp4.y) / 2) * cpRate,
            };
        var cp2 = contactDist <= dist ?
            cp0 :
            {
                x: cp0.x * (1 - cpRate) + ((tp2.x + tp3.x) / 2) * cpRate,
                y: cp0.y * (1 - cpRate) + ((tp2.y + tp3.y) / 2) * cpRate,
            };
        return { tp1: tp1, tp2: tp2, tp3: tp3, tp4: tp4, cp1: cp1, cp2: cp2, };
    };
    // const buildFusionPath = (layer: Layer): Path2D =>
    // {
    //     const path = new Path2D();
    //     const units = layer.units.filter(u => 0 < u.body.radius);  // 有効units
    //     // 融合グラフ構築 (連結成分)
    //     const graph: number[][] = Array.from({ length: units.length }, () => []);
    //     for (let i = 0; i < units.length; i++) {
    //         for (let j = i + 1; j < units.length; j++) {
    //             const dist = Math.hypot(units[i].body.x - units[j].body.x, units[i].body.y - units[j].body.y);
    //             if (dist < (units[i].body.radius + units[j].body.radius) * fusionThreshold) {
    //                 graph[i].push(j);
    //                 graph[j].push(i);
    //             }
    //         }
    //     }
    //     // 連結成分探索 (DFSでグループ化)
    //     const visited = new Array(units.length).fill(false);
    //     for (let i = 0; i < units.length; i++) {
    //         if (visited[i]) continue;
    //         const group: Unit[] = [];
    //         const stack = [i];
    //         while (stack.length) {
    //             const idx = stack.pop()!;
    //             if (!visited[idx]) {
    //                 visited[idx] = true;
    //                 group.push(units[idx]);
    //                 stack.push(...graph[idx]);
    //             }
    //         }
    //         if (group.length === 1) {
    //             // 孤立円: 単純arc
    //             const u = group[0];
    //             path.arc(u.body.x, u.body.y, u.body.radius, 0, Math.PI * 2);
    //         } else {
    //             // 融合グループ: ペアごとベジェ+arc
    //             for (let j = 0; j < group.length; j++) {
    //                 const u = group[j];
    //                 path.arc(u.body.x, u.body.y, u.body.radius, 0, Math.PI * 2);
    //                 for (let k = j + 1; k < group.length; k++) {
    //                     const tangents = getTangentPoints(group[j].body, group[k].body);
    //                     if (tangents) {
    //                         // 上側ベジェ: tp1 -> cp -> tp3 (cpは中点+オフセットで曲げ)
    //                         const cp1x = (tangents.tp1.x + tangents.tp3.x) / 2 + (tangents.tp3.y - tangents.tp1.y) * 0.2;  // オフセットでblob風曲げ (調整)
    //                         const cp1y = (tangents.tp1.y + tangents.tp3.y) / 2 - (tangents.tp3.x - tangents.tp1.x) * 0.2;
    //                         path.moveTo(tangents.tp1.x, tangents.tp1.y);
    //                         path.quadraticCurveTo(cp1x, cp1y, tangents.tp3.x, tangents.tp3.y);  // またはbezierCurveToでcubic
    //                         // 下側ベジェ: tp2 -> cp -> tp4
    //                         const cp2x = (tangents.tp2.x + tangents.tp4.x) / 2 - (tangents.tp4.y - tangents.tp2.y) * 0.2;
    //                         const cp2y = (tangents.tp2.y + tangents.tp4.y) / 2 + (tangents.tp4.x - tangents.tp2.x) * 0.2;
    //                         path.moveTo(tangents.tp2.x, tangents.tp2.y);
    //                         path.quadraticCurveTo(cp2x, cp2y, tangents.tp4.x, tangents.tp4.y);
    //                     }
    //                 }
    //                 // グループの各円の露出arcを追加 (融合部分以外)
    //                 // 簡略: 全円arcを追加し、compositeで重ね (or clip)だが、重なりでOKならスキップ
    //             }
    //             // 完全閉じ: グループ全体をconvex hullで囲む拡張可能だが、まずはベジェ+arcでテスト
    //         }
    //     }
    //     return path;
    // };
    var drawFusionPath = function (layer, color) {
        var units = layer.units.filter(function (u) { return 0 < u.body.radius; }); // 有効units
        // 融合グラフ構築 (連結成分)
        var graph = Array.from({ length: units.length }, function () { return []; });
        for (var i = 0; i < units.length; i++) {
            for (var j = i + 1; j < units.length; j++) {
                var dist = Math.hypot(units[i].body.x - units[j].body.x, units[i].body.y - units[j].body.y);
                if (dist < (units[i].body.radius + units[j].body.radius) + (Math.min(units[i].body.radius, units[j].body.radius) * fusionThreshold)) {
                    graph[i].push(j);
                    graph[j].push(i);
                }
            }
        }
        // 連結成分探索 (DFSでグループ化)
        var visited = new Array(units.length).fill(false);
        for (var i = 0; i < units.length; i++) {
            if (visited[i])
                continue;
            var group = [];
            var stack = [i];
            while (stack.length) {
                var idx = stack.pop();
                if (!visited[idx]) {
                    visited[idx] = true;
                    group.push(units[idx]);
                    stack.push.apply(stack, graph[idx]);
                }
            }
            if (group.length === 1) {
                // 孤立円: 単純arc
                var u = group[0];
                context.beginPath();
                context.arc(u.body.x, u.body.y, u.body.radius, 0, Math.PI * 2);
                context.fillStyle = color;
                // context.fillStyle = "#00000088";
                context.fill();
                context.closePath();
            }
            else {
                // 融合グループ: ペアごとベジェ+arc
                for (var j = 0; j < group.length; j++) {
                    var u = group[j];
                    context.beginPath();
                    context.arc(u.body.x, u.body.y, u.body.radius, 0, Math.PI * 2);
                    context.fillStyle = color;
                    // context.fillStyle = "#00000088";
                    context.fill();
                    context.closePath();
                    for (var k = j + 1; k < group.length; k++) {
                        var tangents = getTangentPoints(group[j].body, group[k].body);
                        if (tangents) {
                            context.beginPath();
                            // 上側ベジェ: tp1 -> cp -> tp3 (cpは中点+オフセットで曲げ)
                            context.moveTo(tangents.tp1.x, tangents.tp1.y);
                            context.quadraticCurveTo(tangents.cp1.x, tangents.cp1.y, tangents.tp4.x, tangents.tp4.y); // またはbezierCurveToでcubic
                            // 下側ベジェ: tp2 -> cp -> tp4
                            context.lineTo(tangents.tp3.x, tangents.tp3.y);
                            context.quadraticCurveTo(tangents.cp2.x, tangents.cp2.y, tangents.tp2.x, tangents.tp2.y);
                            context.lineTo(tangents.tp1.x, tangents.tp1.y);
                            context.fillStyle = color;
                            // context.fillStyle = "#00000088";
                            context.fill();
                            context.closePath();
                            // context.beginPath();
                            // context.arc(tangents.tp1.x, tangents.tp1.y, 4, 0, Math.PI * 2);
                            // context.arc(tangents.tp2.x, tangents.tp2.y, 4, 0, Math.PI * 2);
                            // context.arc(tangents.tp3.x, tangents.tp3.y, 4, 0, Math.PI * 2);
                            // context.arc(tangents.tp4.x, tangents.tp4.y, 4, 0, Math.PI * 2);
                            // context.fillStyle = "#00000088";
                            // context.fill();
                            // context.closePath();
                        }
                    }
                    // グループの各円の露出arcを追加 (融合部分以外)
                    // 簡略: 全円arcを追加し、compositeで重ね (or clip)だが、重なりでOKならスキップ
                }
                // 完全閉じ: グループ全体をconvex hullで囲む拡張可能だが、まずはベジェ+arcでテスト
            }
        }
        //return path;
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
    var drawEye = function (unit) {
        if (unit.eye) {
            drawCircle(makeCircle(addPoints(unit.body, unit.eye.white), unit.eye.white.radius), config_json_1.default.coloring[style].base);
            drawCircle(makeCircle(addPoints(unit.body, unit.eye.iris), unit.eye.iris.radius), config_json_1.default.coloring[style].accent);
        }
    };
    var drawLayer = function (layer, color) {
        if (useFusion) {
            var shortSide_1 = Math.min(canvas.width, canvas.height);
            var centerX_1 = canvas.width / 2;
            var centerY_1 = canvas.height / 2;
            // unitsの座標をCanvas単位に変換 (一時的)
            layer.units.forEach(function (u) {
                u.body.x = (u.body.x * shortSide_1) + centerX_1;
                u.body.y = (u.body.y * shortSide_1) + centerY_1;
                u.body.radius *= shortSide_1;
                // eyeも同様
            });
            // const path = buildFusionPath(layer);
            // context.fillStyle = color;
            // context.fill(path, 'nonzero');  // 塗りつぶし
            drawFusionPath(layer, color);
            // eye描画 (融合後重ね)
            layer.units.forEach(drawEye);
            // 元座標に戻す (必要なら)
            layer.units.forEach(function (u) {
                u.body.x = (u.body.x - centerX_1) / shortSide_1;
                u.body.y = (u.body.y - centerY_1) / shortSide_1;
                u.body.radius /= shortSide_1;
            });
            // layer.units.forEach
            // (
            //     (unit) =>
            //     {
            //         // drawCircle
            //         // (
            //         //     {
            //         //         x: unit.body.x,
            //         //         y: unit.body.y,
            //         //         radius: unit.body.radius *0.9,
            //         //     },
            //         //     color
            //         // );
            //         drawCircle(unit.body, "#88888888");
            //         drawEye(unit);
            //     }
            // );
        }
        else {
            layer.units.forEach(function (unit) {
                drawCircle(unit.body, color);
                drawEye(unit);
            });
        }
    };
    var draw = function () {
        context.fillStyle = config_json_1.default.coloring[style].base;
        //context.globalCompositeOperation = "destination-out";
        context.fillRect(0, 0, canvas.width, canvas.height);
        //context.globalCompositeOperation = "source-over";
        drawLayer(Data.accent, config_json_1.default.coloring[style].accent);
        drawLayer(Data.main, config_json_1.default.coloring[style].main);
        //drawCircle({ x: 0, y: 0, radius: 0.1, }, config.coloring[style].main);
        //drawCircle({ x: 0, y: 0, radius: 0.05, }, config.coloring[style].base);
        //drawCircle({ x: 0, y: 0, radius: 0.025, }, config.coloring[style].accent);
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
        // const keys = Object.keys(config.coloring) as (keyof typeof config["coloring"])[];
        // const currentIndex = keys.indexOf(style);
        // const nextIndex = (currentIndex + 1) %keys.length;
        // style = keys[nextIndex];
        useFusion = !useFusion;
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