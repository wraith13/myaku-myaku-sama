var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("script/url", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Url = void 0;
    //import config from "@resource/config.json";
    var Url;
    (function (Url) {
        Url.parseParameter = function (url) {
            var result = {};
            var urlObj = new URL(url.replace(/#/g, "?"));
            var params = urlObj.searchParams;
            params.forEach(function (value, key) { return result[key] = value; });
            return result;
        };
        Url.make = function (params) {
            var url = new URL(window.location.href.replace(/#/g, "?"));
            for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                url.searchParams.set(key, value);
            }
            return url.toString().replace(/\?/g, "#");
        };
        Url.addParameter = function (params, key, value) {
            params[key] = value;
            return params;
        };
        Url.initialize = function () {
        };
        Url.params = Url.parseParameter(window.location.href);
    })(Url || (exports.Url = Url = {}));
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
    "styles": {
        "regular": {
            "base": "#FFFFFF",
            "main": "#E50012",
            "accent": "#0068B6"
        },
        "monochrome": {
            "base": "#FFFFFF",
            "main": "#000000",
            "accent": "#72716F"
        },
        "splatoon": {
            "base": "#000000",
            "main": "#FD5900",
            "accent": "#0020FE"
        },
        "splatoon2": {
            "base": "#000000",
            "main": "#1AD71A",
            "accent": "#F32C7F"
        },
        "splatoon3": {
            "base": "#000000",
            "main": "#5F3BFE",
            "accent": "#EBFF37"
        }
    },
    "eye": {
        "appearRate": 0.12,
        "vanishRate": 0.1,
        "whiteRate": 0.3,
        "irisRate": 0.15
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
        },
        "eye": {
            "moveAnimation": {
                "period": {
                    "base": 500,
                    "pseudoGaussian": 2,
                    "range": 9000
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
            "appearAnimation": {
                "period": 500
            },
            "vanishAnimation": {
                "period": 500
            }
        }
    },
    "watch": {
        "alternate": {
            "span": 47000
        },
        "dateFormat": {
            "weekday": "long",
            "year": "numeric",
            "month": "long",
            "day": "numeric"
        },
        "timeFormat": {
            "hour": "2-digit",
            "minute": "2-digit",
            "second": "2-digit"
        },
        "firstDayOfWeek": 0
    }
});
define("script/model", ["require", "exports", "resource/config"], function (require, exports, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    config_json_1 = __importDefault(config_json_1);
    var Model;
    (function (Model) {
        var canvas = document.getElementById("canvas");
        Model.pseudoGaussian = function (samples) {
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
        Model.makeCircle = function (point, radius) {
            return ({
                x: point.x,
                y: point.y,
                radius: radius,
            });
        };
        ;
        ;
        ;
        Model.Data = {
            previousTimestamp: 0,
            width: 0,
            height: 0,
            accent: { units: [], lastMadeAt: 0, lastRemovedAt: 0, },
            main: { units: [], lastMadeAt: 0, lastRemovedAt: 0, },
        };
        Model.isOutOfCanvas = function (circle) {
            var marginRate = config_json_1.default.rendering.marginRate;
            var halfDiagonalLength = Math.hypot(canvas.width, canvas.height) / 2;
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var x = (circle.x * marginRate * halfDiagonalLength) + centerX;
            var y = (circle.y * marginRate * halfDiagonalLength) + centerY;
            return (x + circle.radius * halfDiagonalLength < 0 ||
                y + circle.radius * halfDiagonalLength < 0 ||
                canvas.width < x - circle.radius * halfDiagonalLength ||
                canvas.height < y - circle.radius * halfDiagonalLength);
        };
        Model.sumValidAreas = function (layer) {
            return layer.units
                .filter(function (unit) { return !Model.isOutOfCanvas(unit.body); })
                .reduce(function (sum, unit) { return sum + Math.PI * unit.body.radius * unit.body.radius; }, 0);
        };
        Model.sumAllAreas = function (layer) {
            return layer.units
                .reduce(function (sum, unit) { return sum + Math.PI * unit.body.radius * unit.body.radius; }, 0);
        };
        Model.calculateAnimationSineIntegral = function (animation, step) {
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
        Model.accumulateAnimationSineIntegral = function (animations, step) {
            return animations.reduce(function (sum, animation) { return sum + Model.calculateAnimationSineIntegral(animation, step); }, 0);
        };
        Model.accumulateAnimationSize = function (animations, step) {
            return animations.reduce(function (product, animation) {
                var phase = animation.phase + step;
                return product + Math.pow(Math.sin((phase / animation.period) * Math.PI), 2) * 0.5 * animation.scale;
            }, 0.0);
        };
        Model.updateAnimation = function (animation, step) {
            animation.phase += step;
            while (animation.period <= animation.phase) {
                animation.phase -= animation.period;
            }
        };
        Model.updateAnimations = function (animations, step) {
            return animations.forEach(function (animation) { return Model.updateAnimation(animation, step); });
        };
        Model.updateFloatAnimation = function (floatAnimation, step) {
            Model.updateAnimations(floatAnimation.x, step);
            Model.updateAnimations(floatAnimation.y, step);
        };
        Model.makeAnimation = function (specific, scaleRate) {
            var period = specific.period.base + (Model.pseudoGaussian(specific.period.pseudoGaussian) * specific.period.range);
            var phase = period * Math.random();
            var scale = (specific.scale.base + (Model.pseudoGaussian(specific.scale.pseudoGaussian) * specific.scale.range)) * scaleRate;
            return { phase: phase, period: period, scale: scale, };
        };
        Model.makeUnitAnimation = function () {
            // const shortSide = Math.min(window.innerWidth, window.innerHeight) *3.0;
            // const xRatio = window.innerWidth / shortSide;
            // const yRatio = window.innerHeight / shortSide;
            var xRatio = 1.0;
            var yRatio = 1.0;
            var result = {
                moveAnimation: {
                    x: config_json_1.default.Layer.unit.moveAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_1.default.Layer.unit.moveAnimation, i * xRatio); }),
                    y: config_json_1.default.Layer.unit.moveAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_1.default.Layer.unit.moveAnimation, i * yRatio); }),
                },
                sizeAnimation: config_json_1.default.Layer.unit.sizeAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_1.default.Layer.unit.sizeAnimation, i); }),
            };
            return result;
        };
        Model.makeUnit = function (point) {
            var body = Model.makeCircle(point, (Math.pow(Model.pseudoGaussian(4), 2) * 0.19) + 0.01);
            var result = {
                body: body,
                scale: body.radius,
                animation: Model.makeUnitAnimation(),
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
        Model.makeEye = function () {
            var point = { x: 0, y: 0, };
            var xRatio = 1.0;
            var yRatio = 1.0;
            var white = Model.makeCircle(point, config_json_1.default.eye.whiteRate);
            var iris = Model.makeCircle(point, config_json_1.default.eye.irisRate);
            var result = {
                white: white,
                iris: iris,
                animation: {
                    moveAnimation: {
                        x: config_json_1.default.Layer.eye.moveAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_1.default.Layer.eye.moveAnimation, i * xRatio); }),
                        y: config_json_1.default.Layer.eye.moveAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_1.default.Layer.eye.moveAnimation, i * yRatio); }),
                    }
                },
            };
            result.animation.appearAnimation =
                {
                    period: config_json_1.default.Layer.eye.appearAnimation.period,
                    phase: 0,
                    scale: config_json_1.default.eye.whiteRate,
                };
            return result;
        };
        var updateIris = function (eye) {
            eye.iris.x = eye.white.x + eye.white.x * (config_json_1.default.eye.whiteRate - config_json_1.default.eye.irisRate) / (1 - config_json_1.default.eye.whiteRate);
            eye.iris.y = eye.white.y + eye.white.y * (config_json_1.default.eye.whiteRate - config_json_1.default.eye.irisRate) / (1 - config_json_1.default.eye.whiteRate);
            eye.iris.radius = eye.white.radius * (config_json_1.default.eye.irisRate / config_json_1.default.eye.whiteRate);
        };
        var updateEye = function (unit, step) {
            var _a;
            if (unit.eye) {
                var eye = unit.eye;
                var rate = 0.005;
                eye.white.x += Model.accumulateAnimationSineIntegral(eye.animation.moveAnimation.x, step) * rate;
                eye.white.y += Model.accumulateAnimationSineIntegral(eye.animation.moveAnimation.y, step) * rate;
                var distance = Math.hypot(eye.white.x, eye.white.y);
                var maxDistance = 0.95;
                if (maxDistance < distance + config_json_1.default.eye.whiteRate) {
                    eye.white.x *= (maxDistance - config_json_1.default.eye.whiteRate) / distance;
                    eye.white.y *= (maxDistance - config_json_1.default.eye.whiteRate) / distance;
                }
                Model.updateAnimations(eye.animation.moveAnimation.x, step);
                Model.updateAnimations(eye.animation.moveAnimation.y, step);
                var transion = (_a = eye.animation.appearAnimation) !== null && _a !== void 0 ? _a : eye.animation.vanishAnimation;
                if (transion) {
                    transion.phase += step;
                    if (eye.animation.vanishAnimation) {
                        eye.white.radius = config_json_1.default.eye.whiteRate * (1.0 - (transion.phase / transion.period));
                        if (transion.period <= transion.phase) {
                            // eye.animation.vanishAnimation = undefined;
                            unit.eye = undefined;
                        }
                    }
                    else {
                        eye.white.radius = config_json_1.default.eye.whiteRate * (transion.phase / transion.period);
                        if (transion.period <= transion.phase) {
                            eye.animation.appearAnimation = undefined;
                        }
                    }
                }
                if (undefined !== unit.eye) {
                    updateIris(eye);
                }
            }
        };
        Model.updateUnit = function (layer, unit, step) {
            var _a;
            var rate = 0.0005;
            unit.body.x += Model.accumulateAnimationSineIntegral(unit.animation.moveAnimation.x, step) * rate;
            unit.body.y += Model.accumulateAnimationSineIntegral(unit.animation.moveAnimation.y, step) * rate;
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
            unit.body.radius = scale * (1 + (Model.accumulateAnimationSize(unit.animation.sizeAnimation, step) * 2.0));
            Model.updateFloatAnimation(unit.animation.moveAnimation, step);
            Model.updateAnimations(unit.animation.sizeAnimation, step);
            if (layer === Model.Data.main && !Model.isOutOfCanvas(unit.body)) {
                if (undefined === unit.eye && config_json_1.default.eye.appearRate <= unit.body.radius) {
                    unit.eye = Model.makeEye();
                }
            }
            if (undefined !== unit.eye && undefined === unit.eye.animation.vanishAnimation && unit.body.radius < config_json_1.default.eye.vanishRate) {
                unit.eye.animation.vanishAnimation =
                    {
                        period: config_json_1.default.Layer.eye.vanishAnimation.period,
                        phase: 0,
                        scale: unit.eye.white.radius,
                    };
            }
            updateEye(unit, step);
        };
        Model.updateLayer = function (layer, timestamp, step) {
            var shortSide = Math.min(window.innerWidth, window.innerHeight);
            var longSide = Math.max(window.innerWidth, window.innerHeight);
            var validVolume = Model.sumValidAreas(layer);
            var allVolume = Model.sumAllAreas(layer);
            var longSideRatio = 0 < shortSide ? longSide / shortSide : 0;
            var validAreaRatio = validVolume / (longSideRatio * 2.0);
            var allAreaRatio = allVolume / Math.min(longSideRatio * 2.0, validVolume);
            if (validAreaRatio < 0.5) {
                var makeUnitCooldown = 1000 * validAreaRatio;
                if (makeUnitCooldown <= timestamp - layer.lastMadeAt) {
                    layer.units.push(Model.makeUnit({ x: (Model.pseudoGaussian(1) - 0.5) * window.innerWidth / shortSide, y: (Model.pseudoGaussian(1) - 0.5) * window.innerHeight / shortSide, }));
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
            layer.units.forEach(function (unit) { return Model.updateUnit(layer, unit, step); });
            var gabages = layer.units.filter(function (unit) { return unit.body.radius <= 0; });
            gabages.forEach(function (garbage) {
                var index = layer.units.indexOf(garbage);
                if (0 <= index) {
                    layer.units.splice(index, 1);
                }
            });
        };
        Model.PixelRatioModeKeys = ["thirty-second", "sixteenth", "eighth", "quarter", "half", "regular", "full",];
        var pixelRatioMode = "regular";
        Model.togglePixelRatioMode = function (value) {
            if (typeof value === "boolean" || undefined === value) {
                var currentIndex = Model.PixelRatioModeKeys.indexOf(pixelRatioMode);
                var nextIndex = (Model.PixelRatioModeKeys.length + currentIndex + (false !== value ? 1 : -1)) % Model.PixelRatioModeKeys.length;
                pixelRatioMode = Model.PixelRatioModeKeys[nextIndex];
            }
            else {
                if (Model.PixelRatioModeKeys.includes(value)) {
                    pixelRatioMode = value;
                }
            }
            console.log("\uD83D\uDDA5\uFE0F Quality changed: ".concat(pixelRatioMode));
            Model.updateStretch();
        };
        Model.getPixcelRatioLevel = function () {
            switch (pixelRatioMode) {
                case "thirty-second":
                    return 1;
                case "sixteenth":
                    return 2;
                case "eighth":
                    return 3;
                case "quarter":
                    return 4;
                case "half":
                    return 5;
                case "regular":
                    return 6;
                case "full":
                    return 7;
            }
        };
        Model.getPixcelRatio = function () {
            var _a;
            switch (pixelRatioMode) {
                case "thirty-second":
                    return 0.03125;
                case "sixteenth":
                    return 0.0625;
                case "eighth":
                    return 0.125;
                case "quarter":
                    return 0.25;
                case "half":
                    return 0.5;
                case "regular":
                    return 1;
                case "full":
                    return (_a = window.devicePixelRatio) !== null && _a !== void 0 ? _a : 1;
            }
        };
        Model.updateStretch = function () {
            var devicePixelRatio = Model.getPixcelRatio();
            canvas.width = Model.Data.width = window.innerWidth * devicePixelRatio;
            canvas.height = Model.Data.height = window.innerHeight * devicePixelRatio;
        };
        Model.updateData = function (timestamp) {
            var devicePixelRatio = Model.getPixcelRatio();
            var step = 0 < Model.Data.previousTimestamp ? Math.min(timestamp - Model.Data.previousTimestamp, 500) : 0;
            if (window.innerWidth * devicePixelRatio !== Model.Data.width || window.innerHeight * devicePixelRatio !== Model.Data.height) {
                Model.updateStretch();
            }
            Model.updateLayer(Model.Data.accent, timestamp, step);
            Model.updateLayer(Model.Data.main, timestamp, step);
            Model.Data.previousTimestamp = timestamp;
        };
    })(Model || (exports.Model = Model = {}));
});
define("script/ui", ["require", "exports", "script/model", "resource/config"], function (require, exports, model_1, config_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UI = void 0;
    config_json_2 = __importDefault(config_json_2);
    var UI;
    (function (UI) {
        var getElementById = function (tag, id) {
            var element = document.getElementById(id);
            if (!element) {
                throw new Error("\uD83E\uDD8B FIXME: Element not found: ".concat(id));
            }
            if (tag !== element.tagName.toLowerCase()) {
                throw new Error("\uD83E\uDD8B FIXME: Element is not <".concat(tag, ">: ").concat(id));
            }
            return element;
        };
        UI.canvas = getElementById("canvas", "canvas");
        UI.overlayPanel = getElementById("div", "overlay-panel");
        UI.time = getElementById("time", "time");
        UI.date = getElementById("time", "date");
        UI.fpsDiv = getElementById("div", "fps");
        UI.stylesButton = getElementById("button", "styles-button");
        UI.hdButton = getElementById("button", "hd-button");
        UI.watchButton = getElementById("button", "watch-button");
        UI.fpsButton = getElementById("button", "fps-button");
        UI.fullscreenButton = getElementById("button", "fullscreen-button");
        UI.jumpOutButton = getElementById("button", "jump-out-button");
        UI.fullscreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled;
        UI.isInIframe = window.top !== window.self;
        UI.setAriaHidden = function (element, hidden) {
            var attributeKey = "aria-hidden";
            if (hidden) {
                var attribute = document.createAttribute(attributeKey);
                attribute.value = "true";
                element.attributes.setNamedItem(attribute);
            }
            else {
                if (element.attributes.getNamedItem(attributeKey)) {
                    element.attributes.removeNamedItem(attributeKey);
                }
            }
        };
        UI.WatchColorList = ["none", "white", "black", "raindom"];
        UI.watchColor = "none";
        UI.updateWatchVisibility = function () {
            if ("none" !== UI.watchColor) {
                UI.WatchColorList.forEach(function (color) { return UI.overlayPanel.classList.toggle(color, UI.watchColor === color); });
                UI.time.style.display = "block";
                UI.date.style.display = "block";
                UI.setAriaHidden(UI.time, false);
                UI.setAriaHidden(UI.date, false);
            }
            else {
                UI.time.style.display = "none";
                UI.date.style.display = "none";
                UI.setAriaHidden(UI.time, true);
                UI.setAriaHidden(UI.date, true);
            }
        };
        var watchRoundBarIndex = 0;
        UI.updateWatchRoundBar = function () {
            //stylesButton.style.setProperty("--low", `${watchRoundBarIndex /WatchColorList.length}`);
            if ("none" === UI.watchColor) {
                UI.watchButton.style.setProperty("--low", "".concat(1 / (UI.WatchColorList.length - 1)));
            }
            else {
                UI.watchButton.style.setProperty("--low", "0");
            }
            UI.watchButton.style.setProperty("--high", "".concat(1 / (UI.WatchColorList.length - 1)));
            UI.watchButton.style.setProperty("--rotate", "".concat((watchRoundBarIndex - Math.floor(watchRoundBarIndex / UI.WatchColorList.length) - 1) / (UI.WatchColorList.length - 1)));
        };
        UI.toggleWatchDisplay = function (value) {
            if (typeof value === "boolean" || undefined === value) {
                var currentIndex = UI.WatchColorList.indexOf(UI.watchColor);
                var nextIndex = (UI.WatchColorList.length + currentIndex + (false !== value ? 1 : -1)) % UI.WatchColorList.length;
                UI.watchColor = UI.WatchColorList[nextIndex];
                watchRoundBarIndex += false !== value ? 1 : -1;
            }
            else {
                if (UI.WatchColorList.includes(value)) {
                    UI.watchColor = value;
                    watchRoundBarIndex = UI.WatchColorList.indexOf(value);
                }
            }
            UI.updateWatchVisibility();
            UI.updateWatchRoundBar();
            console.log("\uD83D\uDD70\uFE0F Watch changed: ".concat(UI.watchColor));
        };
        UI.toggleFpsDisplay = function () {
            if ("none" === UI.fpsDiv.style.display) {
                UI.fpsDiv.style.display = "block";
                UI.fpsButton.classList.add("on");
            }
            else {
                UI.fpsDiv.style.display = "none";
                UI.fpsButton.classList.remove("on");
            }
        };
        UI.toggleFullScreen = function () {
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
        };
        UI.updateFullscreenState = function () {
            var isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
            UI.fullscreenButton.classList.toggle("on", Boolean(isFullscreen));
        };
        var styleRoundBarIndex = 0;
        UI.updateStyleRoundBar = function () {
            var keys = Object.keys(config_json_2.default.styles);
            //stylesButton.style.setProperty("--low", `${styleRoundBarIndex /keys.length}`);
            UI.stylesButton.style.setProperty("--high", "".concat(1 / keys.length));
            UI.stylesButton.style.setProperty("--rotate", "".concat(styleRoundBarIndex / keys.length));
        };
        UI.style = "regular";
        UI.toggleStyle = function (style) {
            var keys = Object.keys(config_json_2.default.styles);
            if (typeof style === "boolean" || undefined === style) {
                var currentIndex = keys.indexOf(UI.style);
                var nextIndex = (keys.length + currentIndex + (false !== style ? 1 : -1)) % keys.length;
                console.log({ currentIndex: currentIndex, nextIndex: nextIndex, keysLength: keys.length, style: style });
                UI.style = keys[nextIndex];
                styleRoundBarIndex += false !== style ? 1 : -1;
            }
            else {
                if (keys.includes(style)) {
                    UI.style = style;
                    styleRoundBarIndex = keys.indexOf(style);
                }
            }
            UI.updateStyleRoundBar();
            console.log("\uD83C\uDFA8 Style changed: ".concat(UI.style));
        };
        UI.updateHdRoundBar = function () {
            UI.hdButton.style.setProperty("--high", "".concat(model_1.Model.getPixcelRatioLevel() / model_1.Model.PixelRatioModeKeys.length));
        };
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
        UI.ToggleClassForWhileTimer = ToggleClassForWhileTimer;
        var mouseMoveTimer = new ToggleClassForWhileTimer();
        UI.mousemove = function () {
            return mouseMoveTimer.start(document.body, "mousemove", 3000);
        };
        UI.setTextContent = function (element, text) {
            if (element.textContent !== text) {
                element.textContent = text;
                return true;
            }
            return false;
        };
        UI.setAttribute = function (element, name, value) {
            var _a;
            if (((_a = element.getAttribute(name)) !== null && _a !== void 0 ? _a : "") !== (value !== null && value !== void 0 ? value : "")) {
                if (undefined === value || null === value) {
                    element.removeAttribute(name);
                }
                else {
                    element.setAttribute(name, value);
                }
                return true;
            }
            return false;
        };
        UI.setStyle = function (element, name, value) {
            var _a;
            if (((_a = element.style.getPropertyValue(name)) !== null && _a !== void 0 ? _a : "") !== (value !== null && value !== void 0 ? value : "")) {
                if (undefined === value || null === value || "" === value) {
                    element.style.removeProperty(name);
                }
                else {
                    element.style.setProperty(name, value);
                }
                return true;
            }
            return false;
        };
    })(UI || (exports.UI = UI = {}));
});
define("script/render", ["require", "exports", "script/model", "script/ui", "resource/config"], function (require, exports, model_2, ui_1, config_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Render = void 0;
    config_json_3 = __importDefault(config_json_3);
    var Render;
    (function (Render) {
        var getStyle = function () { return config_json_3.default.styles[ui_1.UI.style]; };
        var context = ui_1.UI.canvas.getContext("2d");
        var mappingCircle = function (parent, circle) {
            return ({
                x: (circle.x * parent.radius) + parent.x,
                y: (circle.y * parent.radius) + parent.y,
                radius: circle.radius * parent.radius,
            });
        };
        // const remappingCircle = (parent: Model.Circle, circle: Model.Circle): Model.Circle =>
        // ({
        //     x: (circle.x -parent.x) /parent.radius,
        //     y: (circle.y -parent.y) /parent.radius,
        //     radius: circle.radius /parent.radius,
        // });
        // export const remappingPoint = (parent: Model.Circle, point: Model.Point): Model.Point =>
        // ({
        //     x: (point.x -parent.x) /parent.radius,
        //     y: (point.y -parent.y) /parent.radius,
        // });
        Render.getCanvasCircle = function () {
            return ({
                x: ui_1.UI.canvas.width / 2,
                y: ui_1.UI.canvas.height / 2,
                radius: Math.hypot(ui_1.UI.canvas.width, ui_1.UI.canvas.height) / 2,
            });
        };
        var hasFusionPath = function (fusionStatus) {
            return ["none", "inclusion"].indexOf(fusionStatus) < 0;
        };
        var isContacted = function (fusionStatus) {
            return 0 <= ["overlap", "inclusion"].indexOf(fusionStatus);
        };
        var getFusionStatus = function (data) {
            if (data.fusionLimit < data.distance) {
                return "none";
            }
            if (data.sumRadius < data.distance) {
                return "near";
            }
            if (data.sumRadius - data.minRadius * 2 < data.distance) {
                return "overlap";
            }
            return "inclusion";
        };
        var fusionLimitRate = 3;
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
                    var dx = b.x - a.x;
                    var dy = b.y - a.y;
                    var angle = Math.atan2(dy, dx);
                    var distance = Math.hypot(dx, dy);
                    var fusionStatus = getFusionStatus({ sumRadius: sumRadius, minRadius: minRadius, fusionLimit: fusionLimit, distance: distance, });
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
                        // const cpRate = sumRadius +minRadius <= distance ? 0:
                        //     Math.min(1, (sumRadius +minRadius -distance) / (minRadius *2));
                        // const cp1: Model.Point =
                        // {
                        //     x: cp0.x *(1 -cpRate) + ((tp1.x +tp4.x) /2) *cpRate,
                        //     y: cp0.y *(1 -cpRate) + ((tp1.y +tp4.y) /2) *cpRate,
                        // };
                        // const cp2: Model.Point =
                        // {
                        //     x: cp0.x *(1 -cpRate) + ((tp2.x +tp3.x) /2) *cpRate,
                        //     y: cp0.y *(1 -cpRate) + ((tp2.y +tp3.y) /2) *cpRate,
                        // };
                        // // const contactDist = fusionLimit; //sumRadius +minRadius;
                        // // const surfaceDist = distance -sumRadius;
                        // // const fusionSurfaceLimit = fusionLimit -sumRadius;
                        // // const cpRate = contactDist <= distance ? 1:
                        // //     //Math.min(1, (contactDist -distance) / (minRadius *2));
                        // //     fusionSurfaceLimit /2 <= surfaceDist ?
                        // //         Math.min(1, (surfaceDist -(fusionSurfaceLimit /2)) / (fusionSurfaceLimit /2)):
                        // //         0;
                        var cpRate = 0;
                        ;
                        //const surfaceDist = distance -sumRadius;
                        //const fusionSurfaceLimit = fusionLimit -sumRadius;
                        switch (fusionStatus) {
                            case "near":
                                cpRate = sumRadius + minRadius <= distance ?
                                    -Math.min(1, (distance - (sumRadius + minRadius)) / (fusionLimit - (sumRadius + minRadius))) :
                                    Math.min(1, (sumRadius + minRadius - distance) / (minRadius * 2));
                                break;
                            case "overlap":
                                cpRate = Math.min(1, (sumRadius + minRadius - distance) / (minRadius * 2));
                                break;
                        }
                        var cp1 = {
                            x: 0 <= cpRate ?
                                cp0.x * (1 - cpRate) + ((tp1.x + tp4.x) / 2) * cpRate :
                                cp0.x * (1 + cpRate) + ((tp2.x + tp3.x) / 2) * -cpRate,
                            y: 0 <= cpRate ?
                                cp0.y * (1 - cpRate) + ((tp1.y + tp4.y) / 2) * cpRate :
                                cp0.y * (1 + cpRate) + ((tp2.y + tp3.y) / 2) * -cpRate,
                        };
                        var cp2 = {
                            x: 0 <= cpRate ?
                                cp0.x * (1 - cpRate) + ((tp2.x + tp3.x) / 2) * cpRate :
                                cp0.x * (1 + cpRate) + ((tp1.x + tp4.x) / 2) * -cpRate,
                            y: 0 <= cpRate ?
                                cp0.y * (1 - cpRate) + ((tp2.y + tp3.y) / 2) * cpRate :
                                cp0.y * (1 + cpRate) + ((tp1.y + tp4.y) / 2) * -cpRate,
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
                context.beginPath();
                context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                context.fillStyle = color;
                context.fill();
                context.closePath();
            }
        };
        var drawLayer = function (layer, color) {
            var canvasCircle = Render.getCanvasCircle();
            var bodies = layer.units.map(function (u) { return u.body; })
                .filter(function (c) { return !model_2.Model.isOutOfCanvas(c); })
                .map(function (c) { return mappingCircle(canvasCircle, c); });
            drawFusionPath(bodies, color);
            bodies.forEach(function (body) { return drawCircle(body, color); });
            if (layer === model_2.Model.Data.main) {
                var style_1 = getStyle();
                var whites = layer.units
                    .filter(function (u) { return undefined !== u.eye && !model_2.Model.isOutOfCanvas(u.body); })
                    .map(function (u) { return mappingCircle(mappingCircle(canvasCircle, u.body), u.eye.white); });
                drawFusionPath(whites, style_1.base);
                whites.forEach(function (white) { return drawCircle(white, style_1.base); });
                var irises = layer.units
                    .filter(function (u) { return undefined !== u.eye && !model_2.Model.isOutOfCanvas(u.body); })
                    .map(function (u) { return mappingCircle(mappingCircle(canvasCircle, u.body), u.eye.iris); });
                drawFusionPath(irises, style_1.accent);
                irises.forEach(function (iris) { return drawCircle(iris, style_1.accent); });
            }
        };
        Render.draw = function () {
            var style = getStyle();
            context.fillStyle = style.base;
            context.fillRect(0, 0, ui_1.UI.canvas.width, ui_1.UI.canvas.height);
            drawLayer(model_2.Model.Data.accent, style.accent);
            drawLayer(model_2.Model.Data.main, style.main);
        };
    })(Render || (exports.Render = Render = {}));
});
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
define("script/event", ["require", "exports", "script/model", "script/ui"], function (require, exports, model_3, ui_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Event = void 0;
    var Event;
    (function (Event) {
        Event.initialize = function () {
            document.addEventListener("keydown", function (event) {
                if ("s" === event.key.toLowerCase()) {
                    ui_2.UI.toggleFpsDisplay();
                }
            });
            if (ui_2.UI.fullscreenEnabled) {
                document.addEventListener("keydown", function (event) {
                    if ("f" === event.key.toLowerCase()) {
                        ui_2.UI.toggleFullScreen();
                    }
                });
            }
            ui_2.UI.stylesButton.addEventListener("click", function (event) {
                event.stopPropagation();
                ui_2.UI.toggleStyle(!event.shiftKey);
            });
            document.addEventListener("keydown", function (event) {
                if ("c" === event.key.toLowerCase()) {
                    ui_2.UI.toggleStyle(!event.shiftKey);
                }
            });
            ui_2.UI.hdButton.addEventListener("click", function (event) {
                event.stopPropagation();
                model_3.Model.togglePixelRatioMode(!event.shiftKey);
                ui_2.UI.updateHdRoundBar();
            });
            document.addEventListener("keydown", function (event) {
                if ("q" === event.key.toLowerCase()) {
                    model_3.Model.togglePixelRatioMode(!event.shiftKey);
                    ui_2.UI.updateHdRoundBar();
                }
            });
            ui_2.UI.watchButton.addEventListener("click", function (event) {
                event.stopPropagation();
                ui_2.UI.toggleWatchDisplay(!event.shiftKey);
            });
            document.addEventListener("keydown", function (event) {
                if ("w" === event.key.toLowerCase()) {
                    ui_2.UI.toggleWatchDisplay(!event.shiftKey);
                }
            });
            ui_2.UI.fpsButton.addEventListener("click", function (event) {
                event.stopPropagation();
                ui_2.UI.toggleFpsDisplay();
            });
            ui_2.UI.fullscreenButton.addEventListener("click", function (event) {
                event.stopPropagation();
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
            });
            document.addEventListener("fullscreenchange", ui_2.UI.updateFullscreenState);
            document.addEventListener("webkitfullscreenchange", ui_2.UI.updateFullscreenState);
            ui_2.UI.jumpOutButton.addEventListener("click", function (event) {
                event.stopPropagation();
                window.open(window.location.href, "_blank");
            });
            document.addEventListener("mousemove", function (_event) { return ui_2.UI.mousemove(); });
        };
    })(Event || (exports.Event = Event = {}));
});
define("script/watch", ["require", "exports", "script/url", "script/ui", "resource/config"], function (require, exports, url_1, ui_3, config_json_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Watch = void 0;
    config_json_4 = __importDefault(config_json_4);
    var Watch;
    (function (Watch) {
        Watch.locale = url_1.Url.params["locale"] || navigator.language;
        var phi = (1 + Math.sqrt(5)) / 2;
        Watch.makeDate = function (date, locale) {
            return date.toLocaleDateString(locale, config_json_4.default.watch.dateFormat);
        };
        Watch.makeTime = function (date, locale) {
            return date.toLocaleTimeString(locale, config_json_4.default.watch.timeFormat);
        };
        Watch.setColor = function (color) {
            ui_3.UI.setStyle(ui_3.UI.date, "color", color);
            ui_3.UI.setStyle(ui_3.UI.time, "color", color);
        };
        Watch.update = function () {
            if ("none" !== ui_3.UI.watchColor) {
                var date = new Date();
                ui_3.UI.setTextContent(ui_3.UI.time, Watch.makeTime(date, Watch.locale));
                ui_3.UI.setAttribute(ui_3.UI.time, "datatime", Watch.makeTime(date, "ja-JP"));
                ui_3.UI.setTextContent(ui_3.UI.date, Watch.makeDate(date, Watch.locale));
                ui_3.UI.setAttribute(ui_3.UI.date, "datatime", date.toISOString().slice(0, 10));
                switch (ui_3.UI.watchColor) {
                    case "white":
                        Watch.setColor("white");
                        break;
                    case "black":
                        Watch.setColor("black");
                        break;
                    case "raindom":
                        Watch.setColor("hsl(".concat((date.getTime() * 360) / (24000 * phi), ", 100%, 50%)"));
                        break;
                }
            }
            else {
                ui_3.UI.setTextContent(ui_3.UI.time, "");
                ui_3.UI.setAttribute(ui_3.UI.time, "datatime", undefined);
                ui_3.UI.setTextContent(ui_3.UI.date, "");
                ui_3.UI.setAttribute(ui_3.UI.date, "datatime", undefined);
            }
        };
    })(Watch || (exports.Watch = Watch = {}));
});
define("script/index", ["require", "exports", "script/url", "script/model", "script/render", "script/fps", "script/ui", "script/event", "script/watch"], function (require, exports, url_2, model_4, render_1, fps_1, ui_4, event_1, watch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    url_2.Url.initialize();
    event_1.Event.initialize();
    ui_4.UI.fpsDiv.style.display = "none";
    ui_4.UI.updateStyleRoundBar();
    ui_4.UI.updateHdRoundBar();
    ui_4.UI.updateWatchVisibility();
    ui_4.UI.fullscreenButton.style.display = ui_4.UI.fullscreenEnabled ? "block" : "none";
    ui_4.UI.setAriaHidden(ui_4.UI.fullscreenButton, !ui_4.UI.fullscreenEnabled);
    ui_4.UI.updateFullscreenState();
    ui_4.UI.jumpOutButton.style.display = ui_4.UI.isInIframe ? "block" : "none";
    ui_4.UI.setAriaHidden(ui_4.UI.jumpOutButton, ui_4.UI.isInIframe);
    var step = function (timestamp) {
        model_4.Model.updateData(timestamp);
        render_1.Render.draw();
        watch_1.Watch.update();
        if (ui_4.UI.fpsDiv.style.display !== "none") {
            fps_1.Fps.step(timestamp);
            ui_4.UI.fpsDiv.innerText = fps_1.Fps.getText();
        }
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
});
//# sourceMappingURL=index.js.map