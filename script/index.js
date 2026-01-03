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
                var target = layer.units
                    .filter(function (unit) { return undefined === unit.animation.vanishAnimation && undefined === unit.animation.vanishAnimation; })
                //.sort(Comparer.make([a => -Math.hypot(a.body.x, a.body.y), a => -a.body.radius]))[0];
                //.sort(Comparer.make(a => -a.body.radius))[0];
                [0];
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
    var fusionThreshold = 1; // 融合閾値 (r1 + r2) * this
    var useFusion = false; // トグル: trueで融合描画、falseで個別円
    var getTangentPoints = function (c1, c2) {
        var dx = c2.x - c1.x;
        var dy = c2.y - c1.y;
        var dist = Math.hypot(dx, dy);
        var sumR = c1.radius + c2.radius;
        if (dist > sumR + (Math.min(c1.radius, c2.radius) * fusionThreshold) || dist < Math.abs(c1.radius - c2.radius))
            return null; // 遠すぎ/重なりすぎ
        //const d = Math.sqrt(dist ** 2 - (c1.radius - c2.radius) ** 2);  // タンジェント長
        var angle = Math.atan2(dy, dx);
        // const theta = Math.acos(c1.radius - c2.radius / dist);
        var theta1 = Math.atan2(c2.radius, c1.radius);
        var theta2 = Math.atan2(c1.radius, c2.radius);
        // 左タンジェント (tp1 on c1, tp3 on c2)
        var tp1 = {
            x: c1.x + c1.radius * Math.cos(angle + theta1),
            y: c1.y + c1.radius * Math.sin(angle + theta1)
        };
        var tp3 = {
            x: c2.x + c2.radius * Math.cos(angle + theta2 + Math.PI),
            y: c2.y + c2.radius * Math.sin(angle + theta2 + Math.PI)
        };
        // 右タンジェント (tp2 on c1, tp4 on c2)
        var tp2 = {
            x: c1.x + c1.radius * Math.cos(angle - theta1),
            y: c1.y + c1.radius * Math.sin(angle - theta1)
        };
        var tp4 = {
            x: c2.x + c2.radius * Math.cos(angle - theta2 + Math.PI),
            y: c2.y + c2.radius * Math.sin(angle - theta2 + Math.PI)
        };
        return { tp1: tp1, tp2: tp2, tp3: tp3, tp4: tp4 };
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
                    context.fill();
                    context.closePath();
                    for (var k = j + 1; k < group.length; k++) {
                        var tangents = getTangentPoints(group[j].body, group[k].body);
                        if (tangents) {
                            context.beginPath();
                            // // 上側ベジェ: tp1 -> cp -> tp3 (cpは中点+オフセットで曲げ)
                            // const cp1x = (tangents.tp1.x + tangents.tp4.x) / 2 + (tangents.tp4.y - tangents.tp1.y) * 0.2;  // オフセットでblob風曲げ (調整)
                            // const cp1y = (tangents.tp1.y + tangents.tp4.y) / 2 - (tangents.tp4.x - tangents.tp1.x) * 0.2;
                            // context.moveTo(tangents.tp1.x, tangents.tp1.y);
                            // context.quadraticCurveTo(cp1x, cp1y, tangents.tp4.x, tangents.tp4.y);  // またはbezierCurveToでcubic
                            // // 下側ベジェ: tp2 -> cp -> tp4
                            // const cp2x = (tangents.tp2.x + tangents.tp3.x) / 2 - (tangents.tp3.y - tangents.tp2.y) * 0.2;
                            // const cp2y = (tangents.tp2.y + tangents.tp3.y) / 2 + (tangents.tp3.x - tangents.tp2.x) * 0.2;
                            // context.lineTo(tangents.tp3.x, tangents.tp3.y);
                            // context.quadraticCurveTo(cp2x, cp2y, tangents.tp2.x, tangents.tp2.y);
                            // context.lineTo(tangents.tp1.x, tangents.tp1.y);
                            // 上側ベジェ: tp1 -> cp -> tp3 (cpは中点+オフセットで曲げ)
                            var cp1x = (tangents.tp1.x + tangents.tp2.x + tangents.tp3.x + tangents.tp4.x) / 4;
                            var cp1y = (tangents.tp1.y + tangents.tp2.y + tangents.tp3.y + tangents.tp4.y) / 4;
                            context.moveTo(tangents.tp1.x, tangents.tp1.y);
                            context.quadraticCurveTo(cp1x, cp1y, tangents.tp4.x, tangents.tp4.y); // またはbezierCurveToでcubic
                            // 下側ベジェ: tp2 -> cp -> tp4
                            var cp2x = (tangents.tp1.x + tangents.tp2.x + tangents.tp3.x + tangents.tp4.x) / 4;
                            var cp2y = (tangents.tp1.y + tangents.tp2.y + tangents.tp3.y + tangents.tp4.y) / 4;
                            context.lineTo(tangents.tp3.x, tangents.tp3.y);
                            context.quadraticCurveTo(cp2x, cp2y, tangents.tp2.x, tangents.tp2.y);
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
    var useMetaball = false; // トグル: trueでメタボール描画、falseで個別円描画（デバッグ用）
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
    var getPotential = function (layer, x, y) {
        var shortSide = Math.min(canvas.width, canvas.height);
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var sum = 0;
        var maxRadius = 0;
        var maxRadiusDistSq = Infinity;
        layer.units.forEach(function (unit) {
            if (0 < unit.body.radius) {
                var dx = x - ((unit.body.x * shortSide) + centerX); // 描画座標に変換（drawCircleのロジックに合わせ）
                var dy = y - ((unit.body.y * shortSide) + centerY);
                var distSq = dx * dx + dy * dy;
                var radius = unit.body.radius * shortSide;
                if (distSq < Math.pow(radius, 2) && distSq < maxRadiusDistSq) {
                    maxRadius = Math.max(maxRadius, radius);
                    maxRadiusDistSq = distSq;
                }
                sum += (Math.pow(radius, 2)) / Math.max(distSq, 1); // ポテンシャル式（調整可能: **2 でシャープ、**1 でソフト）
            }
        });
        drawLineCount = Math.max(drawLineCount, sum);
        sum = Math.min(sum, maxRadius); // 最大ポテンシャル制限（重なり過ぎ防止）
        return sum;
    };
    // // Marching Squaresの線分テーブル（配列index=0-15で、セル状態に対応）
    // const marchingTable: number[][] = [  // [x1,y1, x2,y2] の線分（0-1で正規化）
    //     [],                                                                 // 0: 0000 - なし
    //     [0, 0.5, 0.5, 0],                                                 // 1: 0001
    //     [0.5, 0, 1, 0.5],                                                 // 2: 0010
    //     [0, 0.5, 1, 0.5],                                                 // 3: 0011
    //     [0.5, 1, 1, 0.5],                                                 // 4: 0100
    //     [0, 0.5, 0.5, 0, 0.5, 1, 1, 0.5],                               // 5: 0101
    //     [0.5, 0, 0.5, 1],                                                 // 6: 0110
    //     [0, 0.5, 0.5, 1],                                                 // 7: 0111
    //     [0, 0.5, 0.5, 1],                                                 // 8: 1000
    //     [0.5, 0, 0.5, 1],                                                 // 9: 1001
    //     [0, 0.5, 0.5, 0, 0.5, 1, 1, 0.5],                               // 10: 1010
    //     [0.5, 0, 1, 0.5],                                                 // 11: 1011
    //     [0, 0.5, 1, 0.5],                                                 // 12: 1100
    //     [0.5, 1, 1, 0.5],                                                 // 13: 1101
    //     [0.5, 0, 0.5, 1],                                                 // 14: 1110
    //     []                                                                  // 15: 1111 - なし（全部内部）
    // ];
    var drawLineCount = 0;
    var gridSize = 10; // グリッド解像度（小さいほど滑らかだが重い。20-50で調整）
    var threshold = 4.0; // ポテンシャル閾値（低いと融合しやすくなる。0.5-2.0で調整）
    // const drawMetaballLayer = (layer: Layer, color: string) =>
    // {
    //     context.beginPath();  // Pathを蓄積
    //     for (let gy = 0; gy < canvas.height; gy += gridSize) {
    //         for (let gx = 0; gx < canvas.width; gx += gridSize) {
    //             // 4隅のポテンシャル（> threshold で1）
    //             const a = getPotential(layer, gx, gy) > threshold ? 1 : 0;
    //             const b = getPotential(layer, gx + gridSize, gy) > threshold ? 1 : 0;
    //             const c = getPotential(layer, gx + gridSize, gy + gridSize) > threshold ? 1 : 0;
    //             const d = getPotential(layer, gx, gy + gridSize) > threshold ? 1 : 0;
    //             const index = a + (b << 1) + (c << 2) + (d << 3);  // 0-15
    //             const lines = marchingTable[index];
    //             if (lines) {
    //                 for (let i = 0; i < lines.length; i += 4) {
    //                     const x1 = gx + lines[i] * gridSize;
    //                     const y1 = gy + lines[i + 1] * gridSize;
    //                     const x2 = gx + lines[i + 2] * gridSize;
    //                     const y2 = gy + lines[i + 3] * gridSize;
    //                     context.moveTo(x1, y1);
    //                     context.lineTo(x2, y2);  // 直線。曲線練習: quadraticCurveToで補間
    //                 }
    //             }
    //         }
    //     }
    //     context.strokeStyle = color;  // 輪郭線（テスト用。fillで塗りつぶしに変更）
    //     context.fillStyle = color;
    //     context.stroke();
    //     // 塗りつぶし版: context.fillStyle = color; context.fill(); だが、複数形状対応のためPath2Dを使う拡張を推奨
    // };
    var drawMetaballLayer = function (layer, color) {
        context.beginPath(); // Pathを蓄積
        for (var gy = 0; gy <= canvas.height; gy += gridSize) {
            for (var gx = 0; gx <= canvas.width; gx += gridSize) {
                var potential = getPotential(layer, gx, gy);
                if (threshold <= potential && potential < threshold * 1.75) // 閾値以上のみ描画
                 {
                    context.beginPath();
                    context.arc(gx + (gridSize / 2), gy + (gridSize / 2), potential * 2, 0, Math.PI * 2);
                    context.fillStyle = color;
                    context.fill();
                    context.closePath();
                }
            }
        }
        context.strokeStyle = color; // 輪郭線（テスト用。fillで塗りつぶしに変更）
        context.fillStyle = color;
        context.stroke();
        // 塗りつぶし版: context.fillStyle = color; context.fill(); だが、複数形状対応のためPath2Dを使う拡張を推奨
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
            if (useMetaball) {
                drawLineCount = 0;
                drawMetaballLayer(layer, color);
                console.log("Metaball lines drawn: ".concat(drawLineCount));
                layer.units.forEach(function (unit) {
                    drawCircle({
                        x: unit.body.x,
                        y: unit.body.y,
                        radius: unit.body.radius * 0.9,
                    }, color);
                    //drawCircle(unit.body, "#88888888");
                    drawEye(unit);
                });
            }
            else {
                layer.units.forEach(function (unit) {
                    drawCircle(unit.body, color);
                    drawEye(unit);
                });
            }
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
        if (!useFusion && !useMetaball) {
            useFusion = true;
        }
        else if (useFusion) {
            useFusion = false;
            useMetaball = true;
        }
        else {
            useMetaball = false;
        }
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