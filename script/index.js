var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
        Url.make = function () {
            var url = new URL(window.location.href.replace(/#/g, "?"));
            for (var _i = 0, _a = Object.entries(Url.params); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                url.searchParams.set(key, value);
            }
            return url.toString().replace(/\?/g, "#");
        };
        Url.addParameter = function (key, value) {
            Url.params[key] = value;
            pushUrl();
            return Url.params;
        };
        var pushUrl = function () {
            return window.history.replaceState({}, "", Url.make());
        };
        Url.initialize = function () {
        };
        Url.params = Url.parseParameter(window.location.href);
    })(Url || (exports.Url = Url = {}));
});
define("script/geometry", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Geometry = void 0;
    var Geometry;
    (function (Geometry) {
        ;
        Geometry.addPoints = function (a, b) {
            return ({
                x: a.x + b.x,
                y: a.y + b.y,
            });
        };
        Geometry.subPoints = function (a, b) {
            return ({
                x: a.x - b.x,
                y: a.y - b.y,
            });
        };
        Geometry.mulPoint = function (a, b) {
            return ({
                x: a.x * b,
                y: a.y * b,
            });
        };
        Geometry.averagePoints = function (points) {
            return Geometry.mulPoint(points.reduce(Geometry.addPoints, { x: 0, y: 0, }), 1 / points.length);
        };
    })(Geometry || (exports.Geometry = Geometry = {}));
});
define("script/random", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Random = void 0;
    var Random;
    (function (Random) {
        Random.makeInteger = function (size, random, index, prime) {
            if (random === void 0) { random = function () { return Math.random(); }; }
            return Math.floor(random(index, prime) * size);
        };
        Random.select = function (list, random, index, prime) {
            if (random === void 0) { random = Math.random; }
            return list[Random.makeInteger(list.length, random, index, prime)];
        };
        Random.pseudoGaussian = function (samples, random, index, prime) {
            if (samples === void 0) { samples = 6; }
            if (random === void 0) { random = Math.random; }
            var total = 0;
            for (var i = 0; i < samples; i++) {
                total += random(undefined === index ? index : (index + i), prime);
            }
            return total / samples;
        };
    })(Random || (exports.Random = Random = {}));
});
define("resource/config", [], {
    "applicationTitle": "Myaku-Myaku Sama",
    "repositoryUrl": "https://github.com/wraith13/myaku-myaku-sama/",
    "canonicalUrl": "https://wraith13.github.io/myaku-myaku-sama/",
    "description": "Myaku-Myaku Sama's pattern animation ( this web app is for study )",
    "noscriptMessage": "JavaScript is disabled. Please enable JavaScript.",
    "rendering": {
        "marginRate": 0.9,
        "coloringRegularFadeDuration": 500,
        "coloringRandomFadeDuration": 3000,
        "randomColoringUnitDuration": 60000,
        "antiDullnessBoost": 0.2
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
        },
        "silver-snow": {
            "base": "#FFFFFF",
            "main": "#C0C0C0",
            "accent": "#808080"
        },
        "cherry": {
            "base": "#FFFFFF",
            "main": "#FF69B4",
            "accent": "#FF1493"
        },
        "orchid-purple": {
            "base": "#FFFFFF",
            "main": "#800080",
            "accent": "#DA70D6"
        },
        "violet-night": {
            "base": "#FFFFFF",
            "main": "#4B0082",
            "accent": "#8A2BE2"
        },
        "sapphire-blue": {
            "base": "#FFFFFF",
            "main": "#0000FF",
            "accent": "#1E90FF"
        },
        "summer-sea": {
            "base": "#FFFFFF",
            "main": "#00CED1",
            "accent": "#20B2AA"
        },
        "lime-grass": {
            "base": "#FFFFFF",
            "main": "#32CD32",
            "accent": "#7CFC00"
        },
        "shining-sun": {
            "base": "#FFFFFF",
            "main": "#FFD700",
            "accent": "#FFA500"
        },
        "milk-chocolate": {
            "base": "#FFFFFF",
            "main": "#D2691E",
            "accent": "#8B4513"
        },
        "autumn-leaf": {
            "base": "#FFFFFF",
            "main": "#FF8C00",
            "accent": "#FF4500"
        },
        "crimzon-rose": {
            "base": "#FFFFFF",
            "main": "#DC143C",
            "accent": "#B22222"
        }
    },
    "quality": {
        "presets": {
            "thirty-second": 0.03125,
            "sixteenth": 0.0625,
            "eighth": 0.125,
            "quarter": 0.25,
            "half": 0.5,
            "regular": 1.0,
            "full": "devicePixelRatio"
        },
        "default": "regular"
    },
    "pitch": {
        "presets": [
            0,
            0.125,
            0.25,
            0.5,
            1.0,
            2.0,
            4.0,
            8.0
        ],
        "default": 1.0
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
        "firstDayOfWeek": 0,
        "patternSpan": 43000,
        "minPatternDepth": 0.000000001
    }
});
define("script/ui", ["require", "exports", "script/url", "resource/config"], function (require, exports, url_1, config_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UI = void 0;
    config_json_1 = __importDefault(config_json_1);
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
        UI.pattern = getElementById("div", "pattern");
        UI.fpsDiv = getElementById("div", "fps");
        UI.coloringButton = getElementById("button", "coloring-button");
        UI.qualityButton = getElementById("button", "quality-button");
        UI.pitchButton = getElementById("button", "pitch-button");
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
        UI.WatchColorList = ["none", "white", "black", "zebra", "rainbow"];
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
        UI.updateRoundBar = function (button, properties) {
            // console.log("updateRoundBar", button, properties);
            /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
            UI.setStyle(button, "--low", properties.low.toFixed(3));
            UI.setStyle(button, "--high", properties.high.toFixed(3));
            UI.setStyle(button, "--rotate", properties.rotate.toFixed(3));
        };
        var coloringRoundBarIndex = 0;
        var mod = function (n, m) { return ((n % m) + m) % m; };
        UI.updateColoringRoundBar = function () {
            var keys = Object.keys(config_json_1.default.coloring).concat("random");
            var max = keys.length - 1;
            UI.updateRoundBar(UI.coloringButton, max <= mod(coloringRoundBarIndex, keys.length) ?
                {
                    low: 0,
                    high: 1,
                    rotate: (coloringRoundBarIndex - Math.floor(coloringRoundBarIndex / keys.length)) / max,
                } :
                {
                    low: 0 / max,
                    high: 1 / max,
                    rotate: (coloringRoundBarIndex - Math.floor(coloringRoundBarIndex / keys.length)) / max,
                });
        };
        UI.coloring = "regular";
        UI.toggleColoring = function (style) {
            var keys = Object.keys(config_json_1.default.coloring).concat("random");
            if (typeof style === "boolean" || undefined === style) {
                var currentIndex = keys.indexOf(UI.coloring);
                var nextIndex = (keys.length + currentIndex + (false !== style ? 1 : -1)) % keys.length;
                console.log({ currentIndex: currentIndex, nextIndex: nextIndex, keysLength: keys.length, style: style });
                UI.coloring = keys[nextIndex];
                coloringRoundBarIndex += false !== style ? 1 : -1;
            }
            else {
                if (keys.includes(style)) {
                    UI.coloring = style;
                    coloringRoundBarIndex = keys.indexOf(style);
                }
            }
            UI.updateColoringRoundBar();
            url_1.Url.addParameter("coloring", UI.coloring);
            console.log("\uD83C\uDFA8 Coloring changed: ".concat(UI.coloring));
        };
        UI.PixelRatioModeKeys = Object.keys(config_json_1.default.quality.presets);
        var pixelRatioMode = config_json_1.default.quality.default;
        UI.updateQualityRoundBar = function () { return UI.updateRoundBar(UI.qualityButton, {
            low: 0 / UI.PixelRatioModeKeys.length,
            high: (UI.getPixcelRatioLevel() + 1) / UI.PixelRatioModeKeys.length,
            rotate: 0,
        }); };
        UI.toggleQuality = function (value) {
            if (typeof value === "boolean" || undefined === value) {
                var currentIndex = UI.PixelRatioModeKeys.indexOf(pixelRatioMode);
                var nextIndex = (UI.PixelRatioModeKeys.length + currentIndex + (false !== value ? 1 : -1)) % UI.PixelRatioModeKeys.length;
                pixelRatioMode = UI.PixelRatioModeKeys[nextIndex];
            }
            else {
                if (UI.PixelRatioModeKeys.includes(value)) {
                    pixelRatioMode = value;
                }
            }
            UI.updateQualityRoundBar();
            url_1.Url.addParameter("quality", pixelRatioMode);
            console.log("\uD83D\uDDA5\uFE0F Quality changed: ".concat(pixelRatioMode));
        };
        UI.getPixcelRatioLevel = function () {
            return UI.PixelRatioModeKeys.indexOf(pixelRatioMode);
        };
        UI.getPixcelRatio = function () {
            var _a;
            var value = config_json_1.default.quality.presets[pixelRatioMode];
            if ("devicePixelRatio" === value) {
                return (_a = window.devicePixelRatio) !== null && _a !== void 0 ? _a : 1;
            }
            else {
                return value;
            }
        };
        var pitch = config_json_1.default.pitch.default;
        UI.getPitch = function () {
            return pitch;
        };
        UI.updatePitchRoundBar = function () { return UI.updateRoundBar(UI.pitchButton, {
            low: 0 / config_json_1.default.pitch.presets.length,
            high: config_json_1.default.pitch.presets.indexOf(pitch) / (config_json_1.default.pitch.presets.length - 1),
            rotate: 0,
        }); };
        UI.togglePitch = function (value) {
            var presets = config_json_1.default.pitch.presets;
            if (typeof value === "boolean" || undefined === value) {
                var currentIndex = presets.indexOf(pitch);
                var nextIndex = (presets.length + currentIndex + (false !== value ? 1 : -1)) % presets.length;
                pitch = presets[nextIndex];
                // Model.setPitch(presets[nextIndex]);
            }
            else {
                // if (presets.includes(value))
                // {
                pitch = value;
                // }
            }
            UI.updatePitchRoundBar();
            url_1.Url.addParameter("pitch", pitch.toString());
            console.log("\uD83C\uDFB5 Pitch changed: ".concat(pitch));
        };
        var watchRoundBarIndex = 0;
        UI.updateWatchRoundBar = function () { return UI.updateRoundBar(UI.watchButton, {
            low: "none" === UI.watchColor ? 1 / (UI.WatchColorList.length - 1) : 0,
            high: 1 / (UI.WatchColorList.length - 1),
            rotate: (watchRoundBarIndex - Math.floor(watchRoundBarIndex / UI.WatchColorList.length) - 1) / (UI.WatchColorList.length - 1),
        }); };
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
            url_1.Url.addParameter("watch", UI.watchColor);
            console.log("\uD83D\uDD70\uFE0F Watch changed: ".concat(UI.watchColor));
        };
        UI.toggleFpsDisplay = function (value) {
            if ("none" === UI.fpsDiv.style.display || true === value) {
                UI.fpsDiv.style.display = "block";
                UI.fpsButton.classList.add("on");
            }
            else {
                UI.fpsDiv.style.display = "none";
                UI.fpsButton.classList.remove("on");
            }
            var showFps = "none" !== UI.fpsDiv.style.display ? "true" : "false";
            url_1.Url.addParameter("fps", showFps);
            console.log("\uD83D\uDCCA FPS display toggled: ".concat(showFps));
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
            UI.resize();
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
        UI.resize = function () {
            // Fallback for older environments
            UI.setStyle(document.documentElement, "--short-side", "".concat(Math.min(window.innerWidth, window.innerHeight) / 100, "px"));
            //console.log(`🔄 Resize: ${window.innerWidth}x${window.innerHeight}`);
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
define("script/model", ["require", "exports", "script/random", "script/ui", "resource/config"], function (require, exports, random_js_1, ui_js_1, config_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    config_json_2 = __importDefault(config_json_2);
    var Model;
    (function (Model) {
        var canvas = document.getElementById("canvas");
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
            previousPitchedTimestamp: 0,
            pitch: config_json_2.default.pitch.default,
            width: 0,
            height: 0,
            accent: { units: [], lastMadeAt: 0, lastRemovedAt: 0, },
            main: { units: [], lastMadeAt: 0, lastRemovedAt: 0, },
        };
        Model.setPitch = function (value) {
            Model.Data.pitch = value;
        };
        Model.isOutOfCanvas = function (circle) {
            var marginRate = config_json_2.default.rendering.marginRate;
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
            // return stepで積分した(Math.sin((animation.phase / animation.period) * Math.PI * 2));
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
            var period = specific.period.base + (random_js_1.Random.pseudoGaussian(specific.period.pseudoGaussian) * specific.period.range);
            var phase = period * Math.random();
            var scale = (specific.scale.base + (random_js_1.Random.pseudoGaussian(specific.scale.pseudoGaussian) * specific.scale.range)) * scaleRate;
            return { phase: phase, period: period, scale: scale, };
        };
        Model.makeUnitAnimation = function () {
            var result = {
                moveAnimation: {
                    x: config_json_2.default.Layer.unit.moveAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_2.default.Layer.unit.moveAnimation, i); }),
                    y: config_json_2.default.Layer.unit.moveAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_2.default.Layer.unit.moveAnimation, i); }),
                },
                sizeAnimation: config_json_2.default.Layer.unit.sizeAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_2.default.Layer.unit.sizeAnimation, i); }),
            };
            return result;
        };
        Model.makeUnit = function (point) {
            var body = Model.makeCircle(point, (Math.pow(random_js_1.Random.pseudoGaussian(4), 2) * 0.19) + 0.01);
            var result = {
                body: body,
                scale: body.radius,
                animation: Model.makeUnitAnimation(),
            };
            //updateUnit(result, Math.random() *10000);
            result.animation.appearAnimation =
                {
                    period: config_json_2.default.Layer.unit.appearAnimation.period,
                    phase: 0,
                    scale: result.scale,
                };
            return result;
        };
        Model.makeEye = function () {
            var point = { x: 0, y: 0, };
            var xRatio = 1.0;
            var yRatio = 1.0;
            var white = Model.makeCircle(point, config_json_2.default.eye.whiteRate);
            var iris = Model.makeCircle(point, config_json_2.default.eye.irisRate);
            var result = {
                white: white,
                iris: iris,
                animation: {
                    moveAnimation: {
                        x: config_json_2.default.Layer.eye.moveAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_2.default.Layer.eye.moveAnimation, i * xRatio); }),
                        y: config_json_2.default.Layer.eye.moveAnimation.elements.map(function (i) { return Model.makeAnimation(config_json_2.default.Layer.eye.moveAnimation, i * yRatio); }),
                    }
                },
            };
            result.animation.appearAnimation =
                {
                    period: config_json_2.default.Layer.eye.appearAnimation.period,
                    phase: 0,
                    scale: config_json_2.default.eye.whiteRate,
                };
            return result;
        };
        var updateIris = function (eye) {
            eye.iris.x = eye.white.x + eye.white.x * (config_json_2.default.eye.whiteRate - config_json_2.default.eye.irisRate) / (1 - config_json_2.default.eye.whiteRate);
            eye.iris.y = eye.white.y + eye.white.y * (config_json_2.default.eye.whiteRate - config_json_2.default.eye.irisRate) / (1 - config_json_2.default.eye.whiteRate);
            eye.iris.radius = eye.white.radius * (config_json_2.default.eye.irisRate / config_json_2.default.eye.whiteRate);
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
                if (maxDistance < distance + config_json_2.default.eye.whiteRate) {
                    eye.white.x *= (maxDistance - config_json_2.default.eye.whiteRate) / distance;
                    eye.white.y *= (maxDistance - config_json_2.default.eye.whiteRate) / distance;
                }
                Model.updateAnimations(eye.animation.moveAnimation.x, step);
                Model.updateAnimations(eye.animation.moveAnimation.y, step);
                var transion = (_a = eye.animation.appearAnimation) !== null && _a !== void 0 ? _a : eye.animation.vanishAnimation;
                if (transion) {
                    transion.phase += step;
                    if (eye.animation.vanishAnimation) {
                        eye.white.radius = config_json_2.default.eye.whiteRate * (1.0 - (transion.phase / transion.period));
                        if (transion.period <= transion.phase) {
                            // eye.animation.vanishAnimation = undefined;
                            unit.eye = undefined;
                        }
                    }
                    else {
                        eye.white.radius = config_json_2.default.eye.whiteRate * (transion.phase / transion.period);
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
                if (undefined === unit.eye && config_json_2.default.eye.appearRate <= unit.body.radius) {
                    unit.eye = Model.makeEye();
                }
            }
            if (undefined !== unit.eye && undefined === unit.eye.animation.vanishAnimation && unit.body.radius < config_json_2.default.eye.vanishRate) {
                unit.eye.animation.vanishAnimation =
                    {
                        period: config_json_2.default.Layer.eye.vanishAnimation.period,
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
                    layer.units.push(Model.makeUnit({ x: (random_js_1.Random.pseudoGaussian(1) - 0.5) * window.innerWidth / shortSide, y: (random_js_1.Random.pseudoGaussian(1) - 0.5) * window.innerHeight / shortSide, }));
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
                                period: config_json_2.default.Layer.unit.vanishAnimation.period,
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
        Model.updateStretch = function () {
            var devicePixelRatio = ui_js_1.UI.getPixcelRatio();
            canvas.width = Model.Data.width = window.innerWidth * devicePixelRatio;
            canvas.height = Model.Data.height = window.innerHeight * devicePixelRatio;
        };
        Model.updateData = function (rawTimestamp) {
            var result = false;
            var devicePixelRatio = ui_js_1.UI.getPixcelRatio();
            if (window.innerWidth * devicePixelRatio !== Model.Data.width || window.innerHeight * devicePixelRatio !== Model.Data.height) {
                Model.updateStretch();
                result = true;
            }
            var rawStep = 0 < Model.Data.previousTimestamp ? Math.min(rawTimestamp - Model.Data.previousTimestamp, 500) : 0;
            var step = rawStep * Model.Data.pitch;
            if (0 < step) {
                Model.Data.previousPitchedTimestamp += step;
                Model.updateLayer(Model.Data.accent, Model.Data.previousPitchedTimestamp, step);
                Model.updateLayer(Model.Data.main, Model.Data.previousPitchedTimestamp, step);
                result = true;
            }
            Model.Data.previousTimestamp = rawTimestamp;
            return result;
        };
    })(Model || (exports.Model = Model = {}));
});
define("script/color", ["require", "exports", "script/ui", "resource/config"], function (require, exports, ui_1, config_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Color = void 0;
    config_json_3 = __importDefault(config_json_3);
    var Color;
    (function (Color) {
        Color.isRandomColoring = function () {
            return undefined === config_json_3.default.coloring[ui_1.UI.coloring];
        };
        Color.getColoring = function () {
            if (Color.isRandomColoring()) {
                var index = Math.floor(Math.random() * Object.keys(config_json_3.default.coloring).length);
                var key = Object.keys(config_json_3.default.coloring)[index];
                var result = config_json_3.default.coloring[key];
                if (Color.isSameColoring(newColors, result)) {
                    index = (index + 1) % Object.keys(config_json_3.default.coloring).length;
                    key = Object.keys(config_json_3.default.coloring)[index];
                    result = config_json_3.default.coloring[key];
                }
                return result;
            }
            else {
                return config_json_3.default.coloring[ui_1.UI.coloring];
            }
        };
        var getColors = function () {
            var coloring = Color.getColoring();
            return { base: coloring.base, main: coloring.main, accent: coloring.accent, };
        };
        var changedColoringAt = 0;
        var oldColors = getColors();
        var newColors = getColors();
        Color.isExpiredRandomColoring = function () {
            return Color.isRandomColoring() &&
                config_json_3.default.rendering.randomColoringUnitDuration <= (performance.now() - changedColoringAt);
        };
        Color.previousColors = getColors();
        Color.isSameColoring = function (a, b) {
            return a.base === b.base && a.main === b.main && a.accent === b.accent;
        };
        Color.updateColoring = function () {
            var colors = getColors();
            if (!Color.isSameColoring(newColors, colors)) {
                oldColors = Color.getCurrentColors();
                newColors = colors;
                changedColoringAt = performance.now();
            }
        };
        var mixColor = function (oldColor, newColor, rate) {
            var boost = 1.0 + (config_json_3.default.rendering.antiDullnessBoost * Math.sin(Math.PI * rate)); // Adjustment to reduce dullness of intermediate colors
            var oldR = parseInt(oldColor.slice(1, 3), 16);
            var oldG = parseInt(oldColor.slice(3, 5), 16);
            var oldB = parseInt(oldColor.slice(5, 7), 16);
            var newR = parseInt(newColor.slice(1, 3), 16);
            var newG = parseInt(newColor.slice(3, 5), 16);
            var newB = parseInt(newColor.slice(5, 7), 16);
            var currR = Math.round(Math.min((oldR + (newR - oldR) * rate) * boost, 255));
            var currG = Math.round(Math.min((oldG + (newG - oldG) * rate) * boost, 255));
            var currB = Math.round(Math.min((oldB + (newB - oldB) * rate) * boost, 255));
            return "#".concat(currR.toString(16).padStart(2, "0")).concat(currG.toString(16).padStart(2, "0")).concat(currB.toString(16).padStart(2, "0"));
        };
        var mixColors = function (oldColors, newColors, rate) {
            return ({
                base: mixColor(oldColors.base, newColors.base, rate),
                main: mixColor(oldColors.main, newColors.main, rate),
                accent: mixColor(oldColors.accent, newColors.accent, rate),
            });
        };
        Color.getCurrentColors = function () {
            var now = performance.now();
            var span = Color.isRandomColoring() ?
                config_json_3.default.rendering.coloringRandomFadeDuration :
                config_json_3.default.rendering.coloringRegularFadeDuration;
            var rate = (now - changedColoringAt) / span;
            if (1.0 <= rate) {
                return newColors;
            }
            else if (rate <= 0.0) {
                return oldColors;
            }
            else {
                return mixColors(oldColors, newColors, rate);
            }
        };
    })(Color || (exports.Color = Color = {}));
});
define("script/render", ["require", "exports", "script/geometry", "script/color", "script/model", "script/ui"], function (require, exports, geometry_1, color_1, model_1, ui_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Render = void 0;
    var Render;
    (function (Render) {
        var context = ui_2.UI.canvas.getContext("2d");
        var mappingCircle = function (parent, circle) {
            return ({
                x: (circle.x * parent.radius) + parent.x,
                y: (circle.y * parent.radius) + parent.y,
                radius: circle.radius * parent.radius,
            });
        };
        Render.getCanvasCircle = function () {
            return ({
                x: ui_2.UI.canvas.width / 2,
                y: ui_2.UI.canvas.height / 2,
                radius: Math.hypot(ui_2.UI.canvas.width, ui_2.UI.canvas.height) / 2,
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
            if (data.wireLimit < data.distance) {
                return "wired";
            }
            if (data.sumRadius < data.distance) {
                return "near";
            }
            if (data.sumRadius - data.minRadius * 2 < data.distance) {
                return "overlap";
            }
            return "inclusion";
        };
        var fusionLimitRate = 1.0;
        var wireLimitRate = 0.7;
        var minCurveAngleRate = 1.0;
        var drawFusionPath = function (circles, color) {
            for (var i = 0; i < circles.length; i++) {
                for (var j = i + 1; j < circles.length; j++) {
                    var a = circles[i];
                    var b = circles[j];
                    var sumRadius = a.radius + b.radius;
                    var minRadius = Math.min(a.radius, b.radius);
                    var fusionLimit = sumRadius + (minRadius * fusionLimitRate);
                    var wireLimit = sumRadius + (fusionLimit - sumRadius) * wireLimitRate;
                    var dx = b.x - a.x;
                    var dy = b.y - a.y;
                    var angle = Math.atan2(dy, dx);
                    var distance = Math.hypot(dx, dy);
                    var fusionStatus = getFusionStatus({ sumRadius: sumRadius, minRadius: minRadius, wireLimit: wireLimit, fusionLimit: fusionLimit, distance: distance, });
                    if (hasFusionPath(fusionStatus)) {
                        var contactAngle = isContacted(fusionStatus) ? Math.acos(distance / sumRadius) : null;
                        var curveAngleRate = minCurveAngleRate *
                            (isContacted(fusionStatus) ? 1 :
                                Math.pow(((fusionLimit - sumRadius) - (distance - sumRadius)) / (fusionLimit - sumRadius), 0.3));
                        var minCurveAngle1 = curveAngleRate * minRadius / a.radius;
                        var minCurveAngle2 = curveAngleRate * minRadius / b.radius;
                        var theta1 = Math.min((contactAngle !== null && contactAngle !== void 0 ? contactAngle : 0) + minCurveAngle1, Math.PI - minCurveAngle1);
                        var theta2 = Math.min((contactAngle !== null && contactAngle !== void 0 ? contactAngle : 0) + minCurveAngle2, Math.PI - minCurveAngle2);
                        var tp1 = {
                            x: a.x + a.radius * Math.cos(angle + theta1),
                            y: a.y + a.radius * Math.sin(angle + theta1)
                        };
                        var tp3 = {
                            x: b.x + b.radius * Math.cos(angle + (Math.PI + theta2)),
                            y: b.y + b.radius * Math.sin(angle + (Math.PI + theta2))
                        };
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
                        var cpRate = 0;
                        ;
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
                        context.moveTo(tp1.x, tp1.y);
                        var wireLength = distance - wireLimit;
                        if (0 < wireLength) // == "wired" === fusionStatus
                         {
                            var wireWidthAdjustRate = 1.15; // This adjustment is probably necessary because something is wrong somewhere,
                            // but I won't actively investigate the cause this time. (This isn't the only place where the animation isn't smooth.)
                            // If you want to smooth out this and other parts, first implement a verification mode
                            // that renders only two Units whose distance can be adjusted by the user.
                            var wireWidthRate = 1 - (wireLength / (fusionLimit - wireLimit));
                            var spikeMinHight = (Math.hypot(tp1.x - tp2.x, tp1.y - tp2.y) + Math.hypot(tp3.x - tp4.x, tp3.y - tp4.y)) / 8;
                            var fusionLength = Math.hypot(tp1.x - tp4.x, tp1.y - tp4.y);
                            var wireLengthRate = ((fusionLength - spikeMinHight * 2) * (1 - wireWidthRate)) / fusionLength;
                            var mp0a = geometry_1.Geometry.averagePoints([geometry_1.Geometry.mulPoint(geometry_1.Geometry.averagePoints([tp1, tp4]), wireWidthRate * wireWidthAdjustRate), geometry_1.Geometry.mulPoint(cp1, 2 - (wireWidthRate * wireWidthAdjustRate))]);
                            var mp1 = geometry_1.Geometry.addPoints(mp0a, geometry_1.Geometry.mulPoint(geometry_1.Geometry.subPoints(tp1, tp4), wireLengthRate * 0.5));
                            var cxp1 = geometry_1.Geometry.addPoints(mp0a, geometry_1.Geometry.mulPoint(geometry_1.Geometry.subPoints(tp1, tp4), (2 - wireWidthRate) / 4));
                            var cxp2 = geometry_1.Geometry.addPoints(mp0a, geometry_1.Geometry.mulPoint(geometry_1.Geometry.subPoints(tp4, tp1), (2 - wireWidthRate) / 4));
                            var mp2 = geometry_1.Geometry.addPoints(mp0a, geometry_1.Geometry.mulPoint(geometry_1.Geometry.subPoints(tp4, tp1), wireLengthRate * 0.5));
                            context.quadraticCurveTo(cxp1.x, cxp1.y, mp1.x, mp1.y);
                            context.lineTo(mp2.x, mp2.y);
                            context.quadraticCurveTo(cxp2.x, cxp2.y, tp4.x, tp4.y);
                            context.lineTo(tp3.x, tp3.y);
                            var mp0b = geometry_1.Geometry.averagePoints([geometry_1.Geometry.mulPoint(geometry_1.Geometry.averagePoints([tp3, tp2]), wireWidthRate * wireWidthAdjustRate), geometry_1.Geometry.mulPoint(cp2, 2 - (wireWidthRate * wireWidthAdjustRate))]);
                            var mp3 = geometry_1.Geometry.addPoints(mp0b, geometry_1.Geometry.mulPoint(geometry_1.Geometry.subPoints(tp3, tp2), wireLengthRate * 0.5));
                            var cxp3 = geometry_1.Geometry.addPoints(mp0b, geometry_1.Geometry.mulPoint(geometry_1.Geometry.subPoints(tp3, tp2), (2 - wireWidthRate) / 4));
                            var cxp4 = geometry_1.Geometry.addPoints(mp0b, geometry_1.Geometry.mulPoint(geometry_1.Geometry.subPoints(tp2, tp3), (2 - wireWidthRate) / 4));
                            var mp4 = geometry_1.Geometry.addPoints(mp0b, geometry_1.Geometry.mulPoint(geometry_1.Geometry.subPoints(tp2, tp3), wireLengthRate * 0.5));
                            context.quadraticCurveTo(cxp3.x, cxp3.y, mp3.x, mp3.y);
                            context.lineTo(mp4.x, mp4.y);
                            context.quadraticCurveTo(cxp4.x, cxp4.y, tp2.x, tp2.y);
                            //console.log({ wireRate, wireLength, distance, mp0a, mp1, cxp1, cxp2, mp2, mp0b, mp3, cxp3, cxp4, mp4, });
                        }
                        else {
                            context.quadraticCurveTo(cp1.x, cp1.y, tp4.x, tp4.y);
                            context.lineTo(tp3.x, tp3.y);
                            context.quadraticCurveTo(cp2.x, cp2.y, tp2.x, tp2.y);
                        }
                        context.lineTo(tp1.x, tp1.y);
                        context.fillStyle = color;
                        context.fill();
                        context.closePath();
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
        var drawLayer = function (layer, color, coloring) {
            var canvasCircle = Render.getCanvasCircle();
            var bodies = layer.units.map(function (u) { return u.body; })
                .filter(function (c) { return !model_1.Model.isOutOfCanvas(c); })
                .map(function (c) { return mappingCircle(canvasCircle, c); });
            drawFusionPath(bodies, color);
            bodies.forEach(function (body) { return drawCircle(body, color); });
            if (layer === model_1.Model.Data.main) {
                var whites = layer.units
                    .filter(function (u) { return undefined !== u.eye && !model_1.Model.isOutOfCanvas(u.body); })
                    .map(function (u) { return mappingCircle(mappingCircle(canvasCircle, u.body), u.eye.white); });
                drawFusionPath(whites, coloring.base);
                whites.forEach(function (white) { return drawCircle(white, coloring.base); });
                var irises = layer.units
                    .filter(function (u) { return undefined !== u.eye && !model_1.Model.isOutOfCanvas(u.body); })
                    .map(function (u) { return mappingCircle(mappingCircle(canvasCircle, u.body), u.eye.iris); });
                drawFusionPath(irises, coloring.accent);
                irises.forEach(function (iris) { return drawCircle(iris, coloring.accent); });
            }
        };
        Render.draw = function (isUpdatedModel) {
            if (color_1.Color.isExpiredRandomColoring()) {
                color_1.Color.updateColoring();
            }
            var coloring = color_1.Color.getCurrentColors();
            var isColoringChanged = !color_1.Color.isSameColoring(color_1.Color.previousColors, coloring);
            if (isUpdatedModel || isColoringChanged) {
                color_1.Color.previousColors = coloring;
                context.fillStyle = coloring.base;
                context.fillRect(0, 0, ui_2.UI.canvas.width, ui_2.UI.canvas.height);
                drawLayer(model_1.Model.Data.accent, coloring.accent, coloring);
                drawLayer(model_1.Model.Data.main, coloring.main, coloring);
            }
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
define("script/event", ["require", "exports", "script/model", "script/color", "script/ui"], function (require, exports, model_2, color_2, ui_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Event = void 0;
    var Event;
    (function (Event) {
        Event.initialize = function () {
            window.addEventListener("resize", ui_3.UI.resize);
            window.addEventListener("orientationchange", ui_3.UI.resize);
            document.addEventListener("fullscreenchange", ui_3.UI.updateFullscreenState);
            document.addEventListener("webkitfullscreenchange", ui_3.UI.updateFullscreenState);
            document.addEventListener("mousemove", ui_3.UI.mousemove);
            var commandList = [
                {
                    key: "C",
                    button: ui_3.UI.coloringButton,
                    command: function (event) {
                        ui_3.UI.toggleColoring(!event.shiftKey);
                        color_2.Color.updateColoring();
                    }
                },
                {
                    key: "Q",
                    button: ui_3.UI.qualityButton,
                    command: function (event) {
                        ui_3.UI.toggleQuality(!event.shiftKey);
                        model_2.Model.updateStretch();
                    }
                },
                {
                    key: "P",
                    button: ui_3.UI.pitchButton,
                    command: function (event) {
                        ui_3.UI.togglePitch(!event.shiftKey);
                        model_2.Model.setPitch(ui_3.UI.getPitch());
                    },
                },
                {
                    key: "W",
                    button: ui_3.UI.watchButton,
                    command: function (event) { return ui_3.UI.toggleWatchDisplay(!event.shiftKey); }
                },
                {
                    key: "S",
                    button: ui_3.UI.fpsButton,
                    command: function () { return ui_3.UI.toggleFpsDisplay(); }
                },
                {
                    key: "F",
                    button: ui_3.UI.fullscreenButton,
                    command: function () { return ui_3.UI.toggleFullScreen(); }
                },
                {
                    button: ui_3.UI.jumpOutButton,
                    command: function () { return window.open(window.location.href, "_blank"); }
                }
            ];
            document.addEventListener("keydown", function (event) {
                if (!(event.metaKey || event.ctrlKey || event.altKey)) {
                    var command = commandList.find(function (cmd) { return cmd.key === event.key.toUpperCase(); });
                    if (command) {
                        event.preventDefault();
                        command.command(event);
                    }
                }
                ui_3.UI.mousemove();
            });
            commandList.forEach(function (command) {
                command.button.addEventListener("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    command.command(event);
                    ui_3.UI.mousemove();
                });
            });
        };
    })(Event || (exports.Event = Event = {}));
});
define("flounder.style.js/evil-type.ts/common/evil-type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EvilType = void 0;
    // Original: https://github.com/wraith13/evil-type.ts/blob/master/common/evil-type.ts
    // License: BSL-1.0 ( https://github.com/wraith13/evil-type.ts/blob/master/LICENSE_1_0.txt )
    var EvilType;
    (function (EvilType) {
        EvilType.comparer = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return function (a, b) {
                for (var i = 0; i < args.length; ++i) {
                    var focus_1 = args[i];
                    var af = focus_1(a);
                    var bf = focus_1(b);
                    if (af < bf) {
                        return -1;
                    }
                    if (bf < af) {
                        return 1;
                    }
                }
                return 0;
            };
        };
        EvilType.lazy = function (invoker) {
            return (function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return invoker().apply(void 0, args);
            });
        };
        var Error;
        (function (Error) {
            Error.makeListener = function (path) {
                if (path === void 0) { path = ""; }
                return ({
                    path: path,
                    matchRate: {},
                    errors: [],
                });
            };
            Error.nextListener = function (name, listner) {
                return (listner ?
                    {
                        path: Error.makePath(listner.path, name),
                        matchRate: listner.matchRate,
                        errors: listner.errors,
                    } :
                    undefined);
            };
            Error.makePath = function (path, name) {
                var base = path.includes("#") ? path : "".concat(path, "#");
                var separator = base.endsWith("#") || "string" !== typeof name ? "" : ".";
                var tail = "string" === typeof name ? name : "[".concat(name, "]");
                return base + separator + tail;
            };
            Error.getPathDepth = function (path) {
                var valuePath = path.replace(/\[(\d+)\]/g, ".$1");
                return valuePath.split(/[#\.]/).filter(function (i) { return 0 < i.length; }).length;
            };
            Error.getType = function (isType) {
                var transactionListner = Error.makeListener();
                isType(undefined, transactionListner);
                return transactionListner.errors
                    .map(function (i) { return i.requiredType.split(" | "); })
                    .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                    .filter(function (i, ix, list) { return ix === list.indexOf(i); });
            };
            Error.isMtached = function (matchRate) { return true === matchRate; };
            Error.matchRateToNumber = function (matchRate) {
                switch (matchRate) {
                    case false:
                        return 0;
                    case true:
                        return 1;
                    default:
                        return matchRate;
                }
            };
            Error.setMatchRate = function (listner, matchRate) {
                if (listner) {
                    listner.matchRate[listner.path] = matchRate;
                }
                return Error.isMtached(matchRate);
            };
            Error.getMatchRate = function (listner, path) {
                if (path === void 0) { path = listner.path; }
                if (path in listner.matchRate) {
                    return listner.matchRate[path];
                }
                return Error.calculateMatchRate(listner, path);
            };
            Error.calculateMatchRate = function (listner, path) {
                if (path === void 0) { path = listner.path; }
                var depth = Error.getPathDepth(path);
                var childrenKeys = Object.keys(listner.matchRate)
                    .filter(function (i) { return 0 === i.indexOf(path) && Error.getPathDepth(i) === depth + 1; });
                var length = childrenKeys.length;
                var sum = childrenKeys
                    .map(function (i) { return listner.matchRate[i]; })
                    .map(function (i) { return Error.matchRateToNumber(i); })
                    .reduce(function (a, b) { return a + b; }, 0.0);
                var result = 0 < length ? sum / length : true;
                if (true === result || 1.0 <= result) {
                    console.error("🦋 FIXME: \"MatchWithErrors\": " + JSON.stringify({ sum: sum, length: length, result: result, listner: listner }));
                }
                return listner.matchRate[path] = result;
            };
            Error.setMatch = function (listner) {
                if (listner) {
                    var paths = Object.keys(listner.matchRate)
                        .filter(function (path) { return 0 === path.indexOf(listner.path); });
                    if (paths.every(function (path) { return Error.isMtached(listner.matchRate[path]); })) {
                        paths.forEach(function (path) { return delete listner.matchRate[path]; });
                    }
                }
                Error.setMatchRate(listner, true);
            };
            Error.raiseError = function (listner, requiredType, actualValue) {
                if (listner) {
                    Error.setMatchRate(listner, false);
                    listner.errors.push({
                        type: "solid",
                        path: listner.path,
                        requiredType: "string" === typeof requiredType ? requiredType : requiredType(),
                        actualValue: Error.valueToString(actualValue),
                    });
                }
                return false;
            };
            Error.orErros = function (listner, modulus, errors, fullErrors) {
                var _a;
                var paths = errors.map(function (i) { return i.path; }).filter(function (i, ix, list) { return ix === list.indexOf(i); });
                (_a = listner.errors).push.apply(_a, paths.map(function (path) {
                    return ({
                        type: modulus <= fullErrors.filter(function (i) { return "solid" === i.type && i.path === path; }).length ?
                            "solid" :
                            "fragment",
                        path: path,
                        requiredType: errors
                            .filter(function (i) { return i.path === path; })
                            .map(function (i) { return i.requiredType; })
                            .map(function (i) { return i.split(" | "); })
                            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                            .filter(function (i, ix, list) { return ix === list.indexOf(i); })
                            .join(" | "),
                        actualValue: errors.filter(function (i) { return i.path === path; }).map(function (i) { return i.actualValue; })[0],
                    });
                }));
            };
            Error.andErros = function (listner, errors) {
                var _a;
                var paths = errors.map(function (i) { return i.path; }).filter(function (i, ix, list) { return ix === list.indexOf(i); });
                (_a = listner.errors).push.apply(_a, paths.map(function (path) {
                    return ({
                        type: errors.some(function (i) { return "solid" === i.type && i.path === path; }) ?
                            "solid" :
                            "fragment",
                        path: path,
                        requiredType: errors
                            .filter(function (i) { return i.path === path; })
                            .map(function (i) { return i.requiredType; })
                            .map(function (i) { return i.split(" & "); })
                            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                            .filter(function (i, ix, list) { return ix === list.indexOf(i); })
                            .join(" & "),
                        actualValue: errors.filter(function (i) { return i.path === path; }).map(function (i) { return i.actualValue; })[0],
                    });
                }));
            };
            Error.valueToString = function (value) {
                return undefined === value ? "undefined" : JSON.stringify(value);
            };
            Error.withErrorHandling = function (isMatchType, listner, requiredType, actualValue) {
                if (listner) {
                    if (isMatchType) {
                        Error.setMatch(listner);
                    }
                    else {
                        Error.raiseError(listner, requiredType, actualValue);
                    }
                }
                return isMatchType;
            };
        })(Error = EvilType.Error || (EvilType.Error = {}));
        var Validator;
        (function (Validator) {
            Validator.makeErrorListener = Error.makeListener;
            Validator.isJust = function (target) { return null !== target && "object" === typeof target ?
                function (value, listner) {
                    return Error.withErrorHandling(JSON.stringify(target) === JSON.stringify(value), listner, function () { return Error.valueToString(target); }, value);
                } :
                function (value, listner) {
                    return Error.withErrorHandling(target === value, listner, function () { return Error.valueToString(target); }, value);
                }; };
            Validator.isNever = function (value, listner) {
                return Error.withErrorHandling(false, listner, "never", value);
            };
            Validator.isUndefined = Validator.isJust(undefined);
            Validator.isUnknown = function (_value, _listner) { return true; };
            Validator.isAny = function (_value, _listner) { return true; };
            Validator.isNull = Validator.isJust(null);
            Validator.isBoolean = function (value, listner) {
                return Error.withErrorHandling("boolean" === typeof value, listner, "boolean", value);
            };
            Validator.isInteger = function (value, listner) {
                return Error.withErrorHandling(Number.isInteger(value), listner, "integer", value);
            };
            Validator.isSafeInteger = function (value, listner) {
                return Error.withErrorHandling(Number.isSafeInteger(value), listner, "safe-integer", value);
            };
            Validator.isDetailedInteger = function (data, safeInteger) {
                var base = "safe" === safeInteger ? Validator.isSafeInteger : Validator.isInteger;
                if ([data.minimum, data.exclusiveMinimum, data.maximum, data.exclusiveMaximum, data.multipleOf].every(function (i) { return undefined === i; })) {
                    return base;
                }
                else {
                    var result = function (value, listner) { return Error.withErrorHandling(base(value) &&
                        (undefined === data.minimum || data.minimum <= value) &&
                        (undefined === data.exclusiveMinimum || data.exclusiveMinimum < value) &&
                        (undefined === data.maximum || value <= data.maximum) &&
                        (undefined === data.exclusiveMaximum || value < data.exclusiveMaximum) &&
                        (undefined === data.multipleOf || 0 === value % data.multipleOf), listner, function () {
                        var details = [];
                        if (undefined !== data.minimum) {
                            details.push("minimum:".concat(data.minimum));
                        }
                        if (undefined !== data.exclusiveMinimum) {
                            details.push("exclusiveMinimum:".concat(data.exclusiveMinimum));
                        }
                        if (undefined !== data.maximum) {
                            details.push("maximum:".concat(data.maximum));
                        }
                        if (undefined !== data.exclusiveMaximum) {
                            details.push("exclusiveMaximum:".concat(data.exclusiveMaximum));
                        }
                        if (undefined !== data.multipleOf) {
                            details.push("multipleOf:".concat(data.multipleOf));
                        }
                        return "".concat("safe" === safeInteger ? "safe-integer" : "integer", "(").concat(details.join(","), ")");
                    }, value); };
                    return result;
                }
            };
            Validator.isNumber = function (value, listner) {
                return Error.withErrorHandling("number" === typeof value, listner, "number", value);
            };
            Validator.isSafeNumber = function (value, listner) {
                return Error.withErrorHandling(Number.isFinite(value), listner, "safe-number", value);
            };
            Validator.isDetailedNumber = function (data, safeNumber) {
                var base = "safe" === safeNumber ? Validator.isSafeNumber : Validator.isNumber;
                if ([data.minimum, data.exclusiveMinimum, data.maximum, data.exclusiveMaximum, data.multipleOf].every(function (i) { return undefined === i; })) {
                    return base;
                }
                else {
                    var result = function (value, listner) { return Error.withErrorHandling(base(value) &&
                        (undefined === data.minimum || data.minimum <= value) &&
                        (undefined === data.exclusiveMinimum || data.exclusiveMinimum < value) &&
                        (undefined === data.maximum || value <= data.maximum) &&
                        (undefined === data.exclusiveMaximum || value < data.exclusiveMaximum) &&
                        (undefined === data.multipleOf || 0 === value % data.multipleOf), listner, function () {
                        var details = [];
                        if (undefined !== data.minimum) {
                            details.push("minimum:".concat(data.minimum));
                        }
                        if (undefined !== data.exclusiveMinimum) {
                            details.push("exclusiveMinimum:".concat(data.exclusiveMinimum));
                        }
                        if (undefined !== data.maximum) {
                            details.push("maximum:".concat(data.maximum));
                        }
                        if (undefined !== data.exclusiveMaximum) {
                            details.push("exclusiveMaximum:".concat(data.exclusiveMaximum));
                        }
                        if (undefined !== data.multipleOf) {
                            details.push("multipleOf:".concat(data.multipleOf));
                        }
                        return "".concat("safe" === safeNumber ? "safe-number" : "number", "(").concat(details.join(","), ")");
                    }, value); };
                    return result;
                }
            };
            Validator.isString = function (value, listner) {
                return Error.withErrorHandling("string" === typeof value, listner, "string", value);
            };
            Validator.makeStringTypeName = function (data) {
                var details = [];
                if (undefined !== data.minLength) {
                    details.push("minLength:".concat(data.minLength));
                }
                if (undefined !== data.maxLength) {
                    details.push("maxLength:".concat(data.maxLength));
                }
                if (undefined !== data.format) {
                    details.push("format:".concat(data.format));
                }
                else if (undefined !== data.pattern) {
                    details.push("pattern:".concat(data.pattern));
                }
                if (undefined !== data.regexpFlags) {
                    details.push("regexpFlags:".concat(data.regexpFlags));
                }
                return "string(".concat(details.join(","), ")");
            };
            Validator.regexpTest = function (pattern, flags, text) {
                switch (pattern) {
                    case "^[[:regex:]]$":
                        try {
                            new RegExp(text, flags);
                            return true;
                        }
                        catch (_a) {
                            return false;
                        }
                    default:
                        return new RegExp(pattern, flags).test(text);
                }
            };
            Validator.isDetailedString = function (data, regexpFlags) {
                if ([data.minLength, data.maxLength, data.pattern, data.format].every(function (i) { return undefined === i; })) {
                    return Validator.isString;
                }
                var pattern = data.pattern;
                var result = function (value, listner) {
                    var _a, _b, _c;
                    return Error.withErrorHandling("string" === typeof value &&
                        (undefined === data.minLength || data.minLength <= value.length) &&
                        (undefined === data.maxLength || value.length <= data.maxLength) &&
                        (undefined === pattern || ((_a = data.regexpTest) !== null && _a !== void 0 ? _a : Validator.regexpTest)(pattern, (_c = (_b = data.regexpFlags) !== null && _b !== void 0 ? _b : regexpFlags) !== null && _c !== void 0 ? _c : "u", value)), listner, function () { return Validator.makeStringTypeName(data); }, value);
                };
                return result;
            };
            Validator.isObject = function (value) {
                return null !== value && "object" === typeof value && !Array.isArray(value);
            };
            Validator.isEnum = function (list) {
                return function (value, listner) {
                    return Error.withErrorHandling(list.includes(value), listner, function () { return list.map(function (i) { return Error.valueToString(i); }).join(" | "); }, value);
                };
            };
            Validator.isUniqueItems = function (list) {
                return list.map(function (i) { return JSON.stringify(i); }).every(function (i, ix, list) { return ix === list.indexOf(i); });
            };
            Validator.makeArrayTypeName = function (data) {
                var details = [];
                if (undefined !== (data === null || data === void 0 ? void 0 : data.minItems)) {
                    details.push("minItems:".concat(data.minItems));
                }
                if (undefined !== (data === null || data === void 0 ? void 0 : data.maxItems)) {
                    details.push("maxItems:".concat(data.maxItems));
                }
                if (true === (data === null || data === void 0 ? void 0 : data.uniqueItems)) {
                    details.push("uniqueItems:".concat(data.uniqueItems));
                }
                return details.length <= 0 ? "array" : "array(".concat(details.join(","), ")");
            };
            Validator.isArray = function (isType, data) {
                return function (value, listner) {
                    if (Array.isArray(value) &&
                        (undefined === (data === null || data === void 0 ? void 0 : data.minItems) || data.minItems <= value.length) &&
                        (undefined === (data === null || data === void 0 ? void 0 : data.maxItems) || value.length <= data.maxItems) &&
                        (true !== (data === null || data === void 0 ? void 0 : data.uniqueItems) || Validator.isUniqueItems(value))) {
                        var result = value.map(function (i) { return isType(i, listner); }).every(function (i) { return i; });
                        if (listner) {
                            if (result) {
                                Error.setMatch(listner);
                            }
                            else {
                                Error.calculateMatchRate(listner);
                            }
                        }
                        return result;
                    }
                    else {
                        return undefined !== listner && Error.raiseError(listner, function () { return Validator.makeArrayTypeName(data); }, value);
                    }
                };
            };
            Validator.makeOrTypeNameFromIsTypeList = function () {
                var isTypeList = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    isTypeList[_i] = arguments[_i];
                }
                return isTypeList.map(function (i) { return Error.getType(i); })
                    .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                    .filter(function (i, ix, list) { return ix === list.indexOf(i); });
            };
            Validator.getBestMatchErrors = function (listeners) {
                return listeners.map(function (listener) {
                    return ({
                        listener: listener,
                        matchRate: Error.getMatchRate(listener),
                    });
                })
                    .sort(EvilType.comparer(function (i) { return -Error.matchRateToNumber(i.matchRate); }))
                    .filter(function (i, _ix, list) { return i.matchRate === list[0].matchRate; })
                    .map(function (i) { return i.listener; });
            };
            Validator.isOr = function () {
                var isTypeList = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    isTypeList[_i] = arguments[_i];
                }
                return function (value, listner) {
                    if (listner) {
                        var resultList = isTypeList.map(function (i) {
                            var transactionListner = Error.makeListener(listner.path);
                            var result = {
                                transactionListner: transactionListner,
                                result: i(value, transactionListner),
                            };
                            return result;
                        });
                        var success = resultList.filter(function (i) { return i.result; })[0];
                        var result = Boolean(success);
                        if (result) {
                            Error.setMatch(listner);
                        }
                        else {
                            var requiredType = Validator.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                            if ((Validator.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                                var bestMatchErrors = Validator.getBestMatchErrors(resultList.map(function (i) { return i.transactionListner; }));
                                var errors = bestMatchErrors.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                                var fullErrors = resultList.map(function (i) { return i.transactionListner; }).map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                                Error.orErros(listner, isTypeList.length, errors, fullErrors);
                                if (errors.length <= 0) {
                                    console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                                }
                                if (0 < bestMatchErrors.length) {
                                    Object.entries(bestMatchErrors[0].matchRate).forEach(function (kv) { return listner.matchRate[kv[0]] = kv[1]; });
                                }
                            }
                            else {
                                Error.raiseError(listner, requiredType.join(" | "), value);
                            }
                        }
                        return result;
                    }
                    else {
                        return isTypeList.some(function (i) { return i(value); });
                    }
                };
            };
            Validator.isAnd = function () {
                var isTypeList = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    isTypeList[_i] = arguments[_i];
                }
                return function (value, listner) {
                    if (listner) {
                        var resultList = isTypeList.map(function (i) {
                            var transactionListner = Error.makeListener(listner.path);
                            var result = {
                                transactionListner: transactionListner,
                                result: i(value, transactionListner),
                            };
                            return result;
                        });
                        var result = resultList.every(function (i) { return i.result; });
                        if (result) {
                            Error.setMatch(listner);
                        }
                        else {
                            var requiredType = Validator.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                            if ((Validator.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                                var transactionListners_1 = resultList.map(function (i) { return i.transactionListner; });
                                var errors = transactionListners_1.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                                Error.andErros(listner, errors);
                                if (errors.length <= 0) {
                                    console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                                }
                                if (0 < transactionListners_1.length) {
                                    var paths = transactionListners_1
                                        .map(function (i) { return Object.keys(i.matchRate); })
                                        .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                                        .filter(function (i, ix, list) { return ix === list.indexOf(i); });
                                    paths.forEach(function (path) {
                                        var matchRates = transactionListners_1.map(function (i) { return i.matchRate[path]; })
                                            .filter(function (i) { return undefined !== i; });
                                        if (matchRates.every(function (i) { return true === i; })) {
                                            listner.matchRate[path] = true;
                                        }
                                        else {
                                            listner.matchRate[path] = matchRates
                                                .map(function (i) { return Error.matchRateToNumber(i); })
                                                .reduce(function (a, b) { return a + b; }, 0)
                                                / matchRates.length;
                                        }
                                    });
                                }
                            }
                            else {
                                Error.raiseError(listner, requiredType.join(" & "), value);
                            }
                        }
                        return result;
                    }
                    else {
                        return isTypeList.some(function (i) { return i(value); });
                    }
                };
            };
            Validator.isNeverTypeGuard = function (value, listner) {
                return Validator.isSpecificObject({
                    $type: Validator.isJust("never-type-guard"),
                })(value, listner);
            };
            Validator.isNeverMemberType = function (value, member, _neverTypeGuard, listner) {
                return !(member in value) || Validator.isNever(value[member], listner);
            };
            Validator.isOptionalTypeGuard = function (value, listner) {
                return Validator.isSpecificObject({
                    $type: Validator.isJust("optional-type-guard"),
                    isType: function (value, listner) {
                        return "function" === typeof value || (null !== value && "object" === typeof value) || (undefined !== listner && Error.raiseError(listner, "IsType<unknown> | ObjectValidator<unknown>", value));
                    },
                })(value, listner);
            };
            Validator.makeOptionalTypeGuard = function (isType) {
                return ({
                    $type: "optional-type-guard",
                    isType: isType,
                });
            };
            Validator.invokeIsType = function (isType) {
                return "function" === typeof isType ? isType : Validator.isSpecificObject(isType);
            };
            Validator.isOptional = Validator.makeOptionalTypeGuard;
            Validator.isOptionalMemberType = function (value, member, optionalTypeGuard, listner) {
                var result = !(member in value) || Validator.invokeIsType(optionalTypeGuard.isType)(value[member], listner);
                if (!result && listner) {
                    var error = listner.errors.filter(function (i) { return i.path === listner.path; })[0];
                    if (error) {
                        error.requiredType = "never | " + error.requiredType;
                    }
                    else {
                        // Not wrong, but noisy!
                        // listner.errors.filter(i => 0 === i.path.indexOf(listner.path) && "fragment" !== i.type).forEach(i => i.type = "fragment");
                        // listner.errors.push
                        // ({
                        //     type: "fragment",
                        //     path: listner.path,
                        //     requiredType: "never",
                        //     actualValue: Error.valueToString((value as ObjectType)[member]),
                        // });
                    }
                }
                return result;
            };
            Validator.isMemberType = function (value, member, isType, listner) {
                return Validator.isNeverTypeGuard(isType) ?
                    Validator.isNeverMemberType(value, member, isType, listner) :
                    Validator.isOptionalTypeGuard(isType) ?
                        Validator.isOptionalMemberType(value, member, isType, listner) :
                        Validator.invokeIsType(isType)(value[member], listner);
            };
            Validator.mergeObjectValidator = function (target) {
                var sources = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    sources[_i - 1] = arguments[_i];
                }
                return Object.assign.apply(Object, __spreadArray([{}, target], sources, true));
            };
            Validator.isSpecificObject = function (memberValidator, options) {
                return function (value, listner) {
                    if (Validator.isObject(value)) {
                        var result = Object.entries("function" === typeof memberValidator ? memberValidator() : memberValidator).map(function (kv) { return Validator.isMemberType(value, kv[0], kv[1], Error.nextListener(kv[0], listner)); })
                            .every(function (i) { return i; });
                        if (false === (options === null || options === void 0 ? void 0 : options.additionalProperties)) {
                            var regularKeys_1 = Object.keys(memberValidator);
                            var additionalKeys = Object.keys(value)
                                .filter(function (key) { return !regularKeys_1.includes(key); });
                            if (additionalKeys.some(function (_) { return true; })) {
                                additionalKeys.map(function (key) { return Error.raiseError(Error.nextListener(key, listner), "never", value[key]); });
                                result = false;
                            }
                        }
                        if (listner) {
                            if (result) {
                                Error.setMatch(listner);
                            }
                            else {
                                Error.calculateMatchRate(listner);
                            }
                        }
                        return result;
                    }
                    else {
                        return undefined !== listner && Error.raiseError(listner, "object", value);
                    }
                };
            };
            Validator.isDictionaryObject = function (isType, keys, options) {
                return function (value, listner) {
                    if (Validator.isObject(value)) {
                        var result = undefined === keys ?
                            Object.entries(value).map(function (kv) { return isType(kv[1], Error.nextListener(kv[0], listner)); }).every(function (i) { return i; }) :
                            keys.map(function (key) { return isType(value, Error.nextListener(key, listner)); }).every(function (i) { return i; });
                        if (undefined !== keys && false === (options === null || options === void 0 ? void 0 : options.additionalProperties)) {
                            var additionalKeys = Object.keys(value)
                                .filter(function (key) { return !keys.includes(key); });
                            if (additionalKeys.some(function (_) { return true; })) {
                                additionalKeys.map(function (key) { return Error.raiseError(Error.nextListener(key, listner), "never", value[key]); });
                                result = false;
                            }
                        }
                        if (listner) {
                            if (result) {
                                Error.setMatch(listner);
                            }
                            else {
                                Error.calculateMatchRate(listner);
                            }
                        }
                        return result;
                    }
                    else {
                        return undefined !== listner && Error.raiseError(listner, "object", value);
                    }
                };
            };
        })(Validator = EvilType.Validator || (EvilType.Validator = {}));
    })(EvilType || (exports.EvilType = EvilType = {}));
});
define("flounder.style.js/generated/type", ["require", "exports", "flounder.style.js/evil-type.ts/common/evil-type"], function (require, exports, evil_type_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Type = exports.EvilType = void 0;
    Object.defineProperty(exports, "EvilType", { enumerable: true, get: function () { return evil_type_1.EvilType; } });
    var Type;
    (function (Type) {
        Type.isFlounderType = evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isEnum(["trispot", "tetraspot"]), evil_type_1.EvilType.Validator.isEnum(["stripe", "diline", "triline"]));
        Type.isLayoutAngle = evil_type_1.EvilType.Validator.isEnum(["regular", "alternative"]);
        Type.isHexColor = evil_type_1.EvilType.Validator.isDetailedString({ pattern: "^#(?:[0-9A-Fa-f]){3,4,6,8}$", }, "u");
        Type.isNamedColor = evil_type_1.EvilType.Validator.isEnum(["black", "silver", "gray", "white", "maroon", "red",
            "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "aliceblue", "antiquewhite", "aquamarine", "azure", "beige",
            "bisque", "blanchedalmond", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk",
            "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen",
            "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet",
            "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold",
            "goldenrod", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen",
            "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon",
            "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "limegreen", "linen", "magenta",
            "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
            "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "olivedrab", "orange", "orangered", "orchid",
            "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "rebeccapurple",
            "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "skyblue", "slateblue", "slategray", "slategrey",
            "snow", "springgreen", "steelblue", "tan", "thistle", "tomato", "transparent", "turquoise", "violet", "wheat", "whitesmoke", "yellowgreen"]);
        Type.isColor = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isHexColor, Type.isNamedColor); });
        Type.isRate = evil_type_1.EvilType.Validator.isDetailedNumber({ minimum: 0, maximum: 1, });
        Type.isSignedRate = evil_type_1.EvilType.Validator.isDetailedNumber({ minimum: -1, maximum: 1, });
        Type.isPixel = evil_type_1.EvilType.Validator.isDetailedNumber({ minimum: 0, });
        Type.isSignedPixel = evil_type_1.EvilType.Validator.isNumber;
        Type.isCount = evil_type_1.EvilType.Validator.isDetailedInteger({ minimum: 0, });
        Type.isNamedDirectionAngle = evil_type_1.EvilType.Validator.isEnum(["right", "right-down", "down",
            "left-down", "left", "left-up", "up", "right-up"]);
        Type.isDirectionAngle = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isNamedDirectionAngle, Type.isSignedRate); });
        Type.isArgumentsBase = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.argumentsBaseValidatorObject, { additionalProperties: false }); });
        Type.isSpotArguments = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.spotArgumentsValidatorObject, { additionalProperties: false }); });
        Type.isLineArguments = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.lineArgumentsValidatorObject, { additionalProperties: false }); });
        Type.isArguments = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isSpotArguments, Type.isLineArguments); });
        Type.argumentsBaseValidatorObject = ({ $schema: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isJust("https://raw.githubusercontent.com/wraith13/flounder.style.js/master/generated/schema.json#")), type: Type.isFlounderType,
            layoutAngle: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(Type.isLayoutAngle, Type.isSignedRate)), offsetX: evil_type_1.EvilType.Validator.isOptional(Type.isSignedPixel), offsetY: evil_type_1.EvilType.Validator.isOptional(Type.isSignedPixel), foregroundColor: Type.isColor, backgroundColor: evil_type_1.EvilType.Validator.isOptional(Type.isColor), intervalSize: evil_type_1.EvilType.Validator.isOptional(Type.isPixel), depth: Type.isRate, blur: evil_type_1.EvilType.Validator.isOptional(Type.isPixel), maxPatternSize: evil_type_1.EvilType.Validator.isOptional(Type.isPixel), reverseRate: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(Type.isSignedRate, evil_type_1.EvilType.Validator.isJust("auto"), evil_type_1.EvilType.Validator.isJust("-auto"))), anglePerDepth: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(Type.isSignedRate, evil_type_1.EvilType.Validator.isJust("auto"), evil_type_1.EvilType.Validator.isJust("-auto"))), maximumFractionDigits: evil_type_1.EvilType.Validator.isOptional(Type.isCount), });
        Type.spotArgumentsValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.argumentsBaseValidatorObject, { type: evil_type_1.EvilType.Validator.isEnum(["trispot", "tetraspot"]), layoutAngle: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(Type.isLayoutAngle, evil_type_1.EvilType.Validator.isJust(0))), anglePerDepth: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isJust(0)), });
        Type.lineArgumentsValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.argumentsBaseValidatorObject, { type: evil_type_1.EvilType.Validator.isEnum(["stripe", "diline", "triline"]), });
    })(Type || (exports.Type = Type = {}));
});
define("flounder.style.js/config", [], {
    "defaultSpotIntervalSize": 24,
    "defaultBlur": 0.0,
    "defaultMaximumFractionDigits": 4
});
define("flounder.style.js/index", ["require", "exports", "flounder.style.js/generated/type", "flounder.style.js/config"], function (require, exports, type_1, config_json_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlounderStyle = exports.EvilType = void 0;
    config_json_4 = __importDefault(config_json_4);
    Object.defineProperty(exports, "EvilType", { enumerable: true, get: function () { return type_1.EvilType; } });
    var FlounderStyle;
    (function (FlounderStyle) {
        FlounderStyle.Type = type_1.Type;
        FlounderStyle.sin = function (rate) { return Math.sin(Math.PI * 2.0 * rate); };
        FlounderStyle.cos = function (rate) { return Math.cos(Math.PI * 2.0 * rate); };
        FlounderStyle.atan2 = function (direction) { return Math.atan2(direction.y, direction.x) / (Math.PI * 2.0); };
        FlounderStyle.styleToStylePropertyList = function (style) {
            return Object.keys(style).map(function (key) { return ({ key: key, value: style[key], }); });
        };
        FlounderStyle.setStyleProperty = function (element, style) {
            var current = element.style.getPropertyValue(style.key);
            if (current !== style.value) // for DOM rendering performance
             {
                if (undefined !== style.value) {
                    element.style.setProperty(style.key, style.value);
                }
                else {
                    element.style.removeProperty(style.key);
                }
            }
            return element;
        };
        FlounderStyle.makeSureStyle = function (styleOrArguments) {
            return FlounderStyle.isArguments(styleOrArguments) ? FlounderStyle.makeStyle(styleOrArguments) : styleOrArguments;
        };
        FlounderStyle.setStyle = function (element, styleOrArguments) {
            FlounderStyle.styleToStylePropertyList(FlounderStyle.makeSureStyle(styleOrArguments)).forEach(function (i) { return FlounderStyle.setStyleProperty(element, i); });
            return element;
        };
        FlounderStyle.stylePropertyToString = function (style) { var _a; return "".concat(style.key, ": ").concat((_a = style.value) !== null && _a !== void 0 ? _a : "inherit", ";"); };
        FlounderStyle.styleToString = function (styleOrArguments, separator) {
            if (separator === void 0) { separator = " "; }
            return FlounderStyle.styleToStylePropertyList(FlounderStyle.makeSureStyle(styleOrArguments))
                .filter(function (i) { return undefined !== i.value; })
                .map(function (i) { return FlounderStyle.stylePropertyToString(i); })
                .join(separator);
        };
        FlounderStyle.regulateRate = function (rate) {
            var result = rate % 1.0;
            if (result < -0.0000000000001) {
                result += 1.0;
            }
            return result;
        };
        FlounderStyle.directionAngleToRate = function (angle) {
            switch (angle) {
                case "right":
                    return 0.0 / 8.0;
                case "right-down":
                    return 1.0 / 8.0;
                case "down":
                    return 2.0 / 8.0;
                case "left-down":
                    return 3.0 / 8.0;
                case "left":
                    return 4.0 / 8.0;
                case "left-up":
                    return 5.0 / 8.0;
                case "up":
                    return 6.0 / 8.0;
                case "right-up":
                    return 7.0 / 8.0;
                default:
                    return FlounderStyle.regulateRate(angle);
            }
        };
        FlounderStyle.isArguments = function (value) {
            return null !== value &&
                "object" === typeof value &&
                "type" in value && "string" === typeof value.type &&
                "foregroundColor" in value && "string" === typeof value.foregroundColor &&
                "depth" in value && "number" === typeof value.depth;
        };
        FlounderStyle.getPatternType = function (data) { var _a; return (_a = data.type) !== null && _a !== void 0 ? _a : "trispot"; };
        FlounderStyle.getLayoutAngle = function (data) {
            var _a;
            if ("number" === typeof data.layoutAngle) {
                if (0 === data.layoutAngle) {
                    return "regular";
                }
                else {
                    throw new Error("When using ".concat(data.type, ", number cannot be used for layoutAngle."));
                }
            }
            if (undefined !== data.anglePerDepth && null !== data.anglePerDepth && 0 !== data.anglePerDepth) {
                throw new Error("anglePerDepth cannot be used when using ".concat(data.type, "."));
            }
            return (_a = data.layoutAngle) !== null && _a !== void 0 ? _a : "regular";
        };
        FlounderStyle.getActualLayoutAngle = function (data) {
            var _a;
            return "number" === typeof data.layoutAngle ? data.layoutAngle :
                "regular" === ((_a = data.layoutAngle) !== null && _a !== void 0 ? _a : "regular") ? 0.0 :
                    "stripe" === data.type ? 0.25 :
                        "tetraspot" === data.type ? 0.125 :
                            "diline" === data.type ? 0.125 :
                                "trispot" === data.type ? 0.25 :
                                    "triline" === data.type ? 0.25 :
                                        0.5;
        };
        FlounderStyle.getAutoAnglePerDepth = function (data) {
            return "stripe" === FlounderStyle.getPatternType(data) ? (1.0 / 2.0) :
                "diline" === FlounderStyle.getPatternType(data) ? (1.0 / 4.0) :
                    "triline" === FlounderStyle.getPatternType(data) ? (1.0 / 6.0) :
                        1.0;
        };
        FlounderStyle.getActualAnglePerDepth = function (data) {
            return "number" === typeof data.anglePerDepth ? data.anglePerDepth :
                "auto" === data.anglePerDepth ? FlounderStyle.getAutoAnglePerDepth(data) :
                    "-auto" === data.anglePerDepth ? -FlounderStyle.getAutoAnglePerDepth(data) :
                        0.0;
        };
        FlounderStyle.getAngleOffsetByDepth = function (data) {
            return FlounderStyle.getActualAnglePerDepth(data) * data.depth;
        };
        FlounderStyle.getAngleOffset = function (data) {
            return FlounderStyle.getActualLayoutAngle(data) + FlounderStyle.getAngleOffsetByDepth(data);
        };
        FlounderStyle.getBackgroundColor = function (data) { var _a; return (_a = data.backgroundColor) !== null && _a !== void 0 ? _a : "transparent"; };
        FlounderStyle.getIntervalSize = function (data) { var _a; return (_a = data.intervalSize) !== null && _a !== void 0 ? _a : config_json_4.default.defaultSpotIntervalSize; };
        FlounderStyle.getBlur = function (data) { var _a; return (_a = data.blur) !== null && _a !== void 0 ? _a : config_json_4.default.defaultBlur; };
        FlounderStyle.getActualReverseRate = function (data) {
            return "number" === typeof data.reverseRate ? data.reverseRate :
                ("auto" === data.reverseRate && "trispot" === FlounderStyle.getPatternType(data)) ? triPatternHalfRadiusSpotArea :
                    ("auto" === data.reverseRate && "tetraspot" === FlounderStyle.getPatternType(data)) ? TetraPatternHalfRadiusSpotArea :
                        ("auto" === data.reverseRate && "stripe" === FlounderStyle.getPatternType(data)) ? 0.0 :
                            ("auto" === data.reverseRate && "diline" === FlounderStyle.getPatternType(data)) ? 0.0 :
                                ("auto" === data.reverseRate && "triline" === FlounderStyle.getPatternType(data)) ? 0.0 :
                                    999;
        };
        FlounderStyle.getAbsoluteReverseRate = function (data) {
            return "number" === typeof data.reverseRate && data.reverseRate < 0.0 ? Math.abs(data.reverseRate) :
                "-auto" === data.reverseRate ? "auto" :
                    data.reverseRate;
        };
        var numberToString = function (data, value) { var _a; return value.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: (_a = data.maximumFractionDigits) !== null && _a !== void 0 ? _a : config_json_4.default.defaultMaximumFractionDigits, }); };
        var makeResult = function (_a) {
            var _b = _a.backgroundColor, backgroundColor = _b === void 0 ? undefined : _b, _c = _a.backgroundImage, backgroundImage = _c === void 0 ? undefined : _c, _d = _a.backgroundSize, backgroundSize = _d === void 0 ? undefined : _d, _e = _a.backgroundPosition, backgroundPosition = _e === void 0 ? undefined : _e;
            return ({
                "background-color": backgroundColor,
                "background-image": backgroundImage,
                "background-size": backgroundSize,
                "background-position": backgroundPosition,
            });
        };
        var makeAxis = function (data, value) {
            return "calc(".concat(numberToString(data, value), "px + 50%)");
        };
        var makeOffsetAxis = function (data, offset, value) {
            return makeAxis(data, value + offset);
        };
        var makeOffsetPosition = function (data, x, y) { var _a, _b; return "".concat(makeOffsetAxis(data, (_a = data.offsetX) !== null && _a !== void 0 ? _a : 0.0, x), " ").concat(makeOffsetAxis(data, (_b = data.offsetY) !== null && _b !== void 0 ? _b : 0.0, y)); };
        FlounderStyle.makeStyle = function (data) {
            switch (FlounderStyle.getPatternType(data)) {
                case "trispot":
                    return FlounderStyle.makeTrispotStyle(data);
                case "tetraspot":
                    return FlounderStyle.makeTetraspotStyle(data);
                case "stripe":
                    return FlounderStyle.makeStripeStyle(data);
                case "diline":
                    return FlounderStyle.makeDilineStyle(data);
                case "triline":
                    return FlounderStyle.makeTrilineStyle(data);
                default:
                    throw new Error("Unknown FlounderType: ".concat(data.type));
            }
        };
        var makeRadialGradientString = function (data, radius, blur) {
            if (blur === void 0) { blur = Math.min(radius, FlounderStyle.getBlur(data)) / 0.5; }
            return "radial-gradient(circle at center, ".concat(data.foregroundColor, " ").concat(numberToString(data, radius - blur), "px, transparent ").concat(numberToString(data, radius + blur), "px)");
        };
        var makeLinearGradientString = function (data, radius, intervalSize, angle, blur) {
            var _a, _b;
            if (blur === void 0) { blur = Math.min(intervalSize - radius, radius, FlounderStyle.getBlur(data)) / 0.5; }
            var deg = numberToString(data, 360.0 * angle);
            var offset = undefined === data.offsetX && undefined === data.offsetY ?
                0 : FlounderStyle.sin(angle) * ((_a = data.offsetX) !== null && _a !== void 0 ? _a : 0.0) - FlounderStyle.cos(angle) * ((_b = data.offsetY) !== null && _b !== void 0 ? _b : 0.0);
            var patternStart = 0 + offset;
            var a = Math.max(0, radius - blur) + offset;
            var b = Math.min(intervalSize * 0.5, radius + blur) + offset;
            var c = Math.max(intervalSize * 0.5, intervalSize - radius - blur) + offset;
            var d = Math.min(intervalSize, intervalSize - radius + blur) + offset;
            var patternEnd = intervalSize + offset;
            return "repeating-linear-gradient(".concat(deg, "deg, ").concat(data.foregroundColor, " ").concat(makeAxis(data, patternStart), ", ").concat(data.foregroundColor, " ").concat(makeAxis(data, a), ", transparent ").concat(makeAxis(data, b), ", transparent ").concat(makeAxis(data, c), ", ").concat(data.foregroundColor, " ").concat(makeAxis(data, d), ", ").concat(data.foregroundColor, " ").concat(makeAxis(data, patternEnd), ")");
        };
        var root2 = Math.sqrt(2.0);
        var root3 = Math.sqrt(3.0);
        var triPatternHalfRadiusSpotArea = Math.PI / (2 * root3);
        var TetraPatternHalfRadiusSpotArea = Math.PI / 4;
        FlounderStyle.makePlainStyleOrNull = function (data) {
            var _a;
            if (data.depth <= 0.0) {
                return makeResult({ backgroundColor: (_a = data.backgroundColor) !== null && _a !== void 0 ? _a : "transparent" });
            }
            else if (1.0 <= data.depth) {
                return makeResult({ backgroundColor: data.foregroundColor });
            }
            else {
                return null;
            }
        };
        var calculateMaxPatternSize = function (data, intervalSize, radius) {
            if (undefined !== data.maxPatternSize && data.maxPatternSize < radius) {
                intervalSize = intervalSize * data.maxPatternSize / radius;
                radius = data.maxPatternSize;
            }
            return { intervalSize: intervalSize, radius: radius, };
        };
        var calculateSpotSize = function (data, halfRadiusSpotArea, maxRadiusRate) {
            var radius;
            var intervalSize = FlounderStyle.getIntervalSize(data);
            if (data.depth <= halfRadiusSpotArea) {
                radius = Math.sqrt(data.depth / halfRadiusSpotArea) * (intervalSize * 0.5);
            }
            else {
                var minRadius = intervalSize * 0.5;
                var maxRadius = intervalSize * maxRadiusRate;
                var MaxRadiusWidth = maxRadius - minRadius;
                var minAreaRate = 1.0 - Math.sqrt(1.0 - halfRadiusSpotArea);
                var maxAreaRate = 1.0;
                var maxAreaRateWidth = minAreaRate - maxAreaRate;
                var areaRate = 1.0 - Math.sqrt(1.0 - data.depth);
                var areaRateWidth = areaRate - minAreaRate;
                radius = minRadius + (MaxRadiusWidth * Math.pow(areaRateWidth / maxAreaRateWidth, 2));
            }
            return calculateMaxPatternSize(data, intervalSize, radius);
        };
        var calculatePatternSize = function (data) {
            switch (FlounderStyle.getPatternType(data)) {
                case "trispot":
                    return calculateSpotSize(data, triPatternHalfRadiusSpotArea, 1.0 / root3);
                case "tetraspot":
                    return calculateSpotSize(data, TetraPatternHalfRadiusSpotArea, 0.5 * root2);
                case "stripe":
                    return calculateMaxPatternSize(data, FlounderStyle.getIntervalSize(data), data.depth * (FlounderStyle.getIntervalSize(data) / 2.0));
                case "diline":
                    return calculateMaxPatternSize(data, FlounderStyle.getIntervalSize(data), (1.0 - Math.sqrt(1.0 - data.depth)) * (FlounderStyle.getIntervalSize(data) / 2.0));
                case "triline":
                    return calculateMaxPatternSize(data, FlounderStyle.getIntervalSize(data), (1.0 - Math.sqrt(1.0 - data.depth)) * (FlounderStyle.getIntervalSize(data) / 3.0));
                default:
                    throw new Error("Unknown FlounderType: ".concat(data.type));
            }
        };
        FlounderStyle.simpleStructuredClone = (function (value) {
            if (undefined !== value && null !== value) {
                if (Array.isArray(value)) {
                    return value.map(function (i) { return FlounderStyle.simpleStructuredClone(i); });
                }
                if ("object" === typeof value) {
                    var result_1 = {};
                    Object.keys(value).forEach(function (key) { return result_1[key] = FlounderStyle.simpleStructuredClone(value[key]); });
                    return result_1;
                }
            }
            return value;
        });
        FlounderStyle.reverseArguments = function (data) {
            var result = FlounderStyle.simpleStructuredClone(data);
            result.foregroundColor = FlounderStyle.getBackgroundColor(data);
            result.backgroundColor = data.foregroundColor;
            if ("number" === typeof data.layoutAngle) {
                result.layoutAngle = FlounderStyle.getActualLayoutAngle(data) + FlounderStyle.getActualAnglePerDepth(data);
            }
            result.depth = 1.0 - data.depth;
            delete result.reverseRate;
            if ("number" === typeof data.anglePerDepth) {
                result.anglePerDepth = -data.anglePerDepth;
            }
            else if ("auto" === data.anglePerDepth) {
                result.anglePerDepth = "-auto";
            }
            else if ("-auto" === data.anglePerDepth) {
                result.anglePerDepth = "auto";
            }
            return result;
        };
        var makeStyleCommon = function (data, maker) {
            if ("transparent" === data.foregroundColor) {
                throw new Error("foregroundColor must be other than \"transparent\".");
            }
            var plain = FlounderStyle.makePlainStyleOrNull(data);
            if (null !== plain) {
                return plain;
            }
            var reverseRate = FlounderStyle.getAbsoluteReverseRate(data);
            if (reverseRate !== data.reverseRate) {
                if ("transparent" === FlounderStyle.getBackgroundColor(data)) {
                    throw new Error("When using reverseRate, backgroundColor must be other than \"transparent\".");
                }
                var absoulteData = FlounderStyle.reverseArguments(data);
                absoulteData.reverseRate = reverseRate;
                return maker(absoulteData);
            }
            else if (FlounderStyle.getActualReverseRate(data) < data.depth) {
                if ("transparent" === FlounderStyle.getBackgroundColor(data)) {
                    throw new Error("When using reverseRate, backgroundColor must be other than \"transparent\".");
                }
                return maker(FlounderStyle.reverseArguments(data));
            }
            else {
                return maker(data);
            }
        };
        FlounderStyle.makeTrispotStyle = function (data) { return makeStyleCommon(data, function (data) {
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var radialGradient = makeRadialGradientString(data, radius);
            var backgroundColor = FlounderStyle.getBackgroundColor(data);
            var backgroundImage = Array.from({ length: 4 }).map(function (_) { return radialGradient; }).join(", ");
            switch (FlounderStyle.getLayoutAngle(data)) {
                case "regular": // horizontal
                    {
                        var xUnit = intervalSize * 2.0;
                        var yUnit = intervalSize * root3;
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: backgroundImage,
                            backgroundSize: "".concat(numberToString(data, xUnit), "px ").concat(numberToString(data, yUnit), "px"),
                            backgroundPosition: "".concat(makeOffsetPosition(data, 0, 0), ", ").concat(makeOffsetPosition(data, intervalSize, 0), ", ").concat(makeOffsetPosition(data, intervalSize * 0.5, intervalSize * root3 * 0.5), ", ").concat(makeOffsetPosition(data, intervalSize * 1.5, intervalSize * root3 * 0.5)),
                        });
                    }
                case "alternative": // vertical
                    {
                        var xUnit = intervalSize * root3;
                        var yUnit = intervalSize * 2.0;
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: backgroundImage,
                            backgroundSize: "".concat(numberToString(data, xUnit), "px ").concat(numberToString(data, yUnit), "px"),
                            backgroundPosition: "".concat(makeOffsetPosition(data, 0, 0), ", ").concat(makeOffsetPosition(data, 0, intervalSize), ", ").concat(makeOffsetPosition(data, intervalSize * root3 * 0.5, intervalSize * 0.5), ", ").concat(makeOffsetPosition(data, intervalSize * root3 * 0.5, intervalSize * 1.5)),
                        });
                    }
                default:
                    throw new Error("Unknown LayoutAngle: ".concat(data.layoutAngle));
            }
        }); };
        FlounderStyle.makeTetraspotStyle = function (data) { return makeStyleCommon(data, function (data) {
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var radialGradient = makeRadialGradientString(data, radius);
            var backgroundColor = FlounderStyle.getBackgroundColor(data);
            switch (FlounderStyle.getLayoutAngle(data)) {
                case "regular": // straight
                    {
                        var xUnit = intervalSize;
                        var yUnit = intervalSize;
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: radialGradient,
                            backgroundSize: "".concat(numberToString(data, xUnit), "px ").concat(numberToString(data, yUnit), "px"),
                            backgroundPosition: makeOffsetPosition(data, 0, 0),
                        });
                    }
                case "alternative": // slant
                    {
                        var xUnit = (intervalSize * 2.0) / root2;
                        var yUnit = (intervalSize * 2.0) / root2;
                        return makeResult({
                            backgroundColor: backgroundColor,
                            backgroundImage: Array.from({ length: 2 }).map(function (_) { return radialGradient; }).join(", "),
                            backgroundSize: "".concat(numberToString(data, xUnit), "px ").concat(numberToString(data, yUnit), "px"),
                            backgroundPosition: "".concat(makeOffsetPosition(data, 0, 0), ", ").concat(makeOffsetPosition(data, intervalSize / root2, intervalSize / root2)),
                        });
                    }
                default:
                    throw new Error("Unknown LayoutAngle: ".concat(data.layoutAngle));
            }
        }); };
        FlounderStyle.makeStripeStyle = function (data) { return makeStyleCommon(data, function (data) {
            var backgroundColor = FlounderStyle.getBackgroundColor(data);
            var angleOffset = FlounderStyle.getAngleOffset(data);
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var angles = [
                FlounderStyle.regulateRate(angleOffset),
            ];
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: angles
                    .map(function (angle) { return makeLinearGradientString(data, radius, intervalSize, angle); })
                    .join(", ")
            });
        }); };
        FlounderStyle.makeDilineStyle = function (data) { return makeStyleCommon(data, function (data) {
            var backgroundColor = FlounderStyle.getBackgroundColor(data);
            var angleOffset = FlounderStyle.getAngleOffset(data);
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var angles = [
                FlounderStyle.regulateRate((0.0 / 4.0) + angleOffset),
                FlounderStyle.regulateRate((1.0 / 4.0) + angleOffset),
            ];
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: angles
                    .map(function (angle) { return makeLinearGradientString(data, radius, intervalSize, angle); })
                    .join(", ")
            });
        }); };
        FlounderStyle.makeTrilineStyle = function (data) { return makeStyleCommon(data, function (data) {
            var backgroundColor = FlounderStyle.getBackgroundColor(data);
            var angleOffset = FlounderStyle.getAngleOffset(data);
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var angles = [
                FlounderStyle.regulateRate((0.0 / 6.0) + angleOffset),
                FlounderStyle.regulateRate((1.0 / 6.0) + angleOffset),
                FlounderStyle.regulateRate((2.0 / 6.0) + angleOffset)
            ];
            return makeResult({
                backgroundColor: backgroundColor,
                backgroundImage: angles
                    .map(function (angle) { return makeLinearGradientString(data, radius, intervalSize, angle); })
                    .join(", ")
            });
        }); };
        FlounderStyle.calculateOffsetCoefficientDirections = function (data) {
            var calculateDirection = function (angleOffset, a, b) {
                return ({
                    x: a * FlounderStyle.cos(angleOffset + b),
                    y: a * FlounderStyle.sin(angleOffset + b),
                });
            };
            var makeAngleVariation = function (divisionCount, masterMaker) {
                var angleOffset = FlounderStyle.getAngleOffset(data);
                var base = Array.from({ length: divisionCount, }).map(function (_i, ix) { return masterMaker(angleOffset + (ix / (divisionCount * 2.0))); })
                    .reduce(function (a, b) { return a.concat(b); }, []);
                var result = base
                    .concat(base.map(function (i) { return ({ x: -i.x, y: -i.y, }); }))
                    .sort(FlounderStyle.makeComparer(function (i) { return FlounderStyle.regulateRate(FlounderStyle.atan2(i)); }));
                return result;
            };
            switch (FlounderStyle.getPatternType(data)) {
                case "stripe":
                    return makeAngleVariation(1, function (angleOffset) {
                        return [
                            calculateDirection(angleOffset, 1.0, 1.0 / 4.0),
                        ];
                    });
                case "tetraspot":
                case "diline":
                    return makeAngleVariation(2, function (angleOffset) {
                        return [
                            calculateDirection(angleOffset, 1.0, 0.0),
                            calculateDirection(angleOffset, root2, 1.0 / 8.0),
                        ];
                    });
                case "trispot":
                    return makeAngleVariation(3, function (angleOffset) {
                        return [
                            calculateDirection(angleOffset, 2.0, 0.0),
                            calculateDirection(angleOffset, 2.0 * root3, 1.0 / 4.0),
                        ];
                    });
                case "triline":
                    return makeAngleVariation(3, function (angleOffset) {
                        return [
                            calculateDirection(angleOffset, 2.0 / root3, 0.0),
                            calculateDirection(angleOffset, 2.0, 1.0 / 4.0),
                        ];
                    });
                default:
                    throw new Error("Unknown FlounderType: ".concat(data.type));
            }
        };
        FlounderStyle.calculateOffsetCoefficient = function (data) {
            var _a = calculatePatternSize(data), intervalSize = _a.intervalSize, radius = _a.radius;
            var result = {
                directions: FlounderStyle.calculateOffsetCoefficientDirections(data),
                intervalSize: intervalSize,
                radius: radius,
            };
            return result;
        };
        FlounderStyle.comparer = function (a, b) {
            return a < b ? -1 :
                b < a ? 1 :
                    0;
        };
        FlounderStyle.makeComparer = function (f) {
            return function (a, b) { return FlounderStyle.comparer(f(a), f(b)); };
        };
        FlounderStyle.compareAngles = function (a, b) {
            var result = (b - a) % 1.0;
            if (0.5 < result) {
                result -= 1.0;
            }
            else if (result < -0.5) {
                result += 1.0;
            }
            return result;
        };
        FlounderStyle.selectClosestAngleDirection = function (directions, angle) {
            var rate = FlounderStyle.directionAngleToRate(angle);
            return directions.sort(FlounderStyle.makeComparer(function (i) { return Math.abs(FlounderStyle.compareAngles(FlounderStyle.atan2(i), rate)); }))[0];
        };
    })(FlounderStyle || (exports.FlounderStyle = FlounderStyle = {}));
});
define("script/watch", ["require", "exports", "script/url", "script/ui", "script/random", "flounder.style.js/index", "resource/config"], function (require, exports, url_2, ui_4, random_1, flounder_style_js_1, config_json_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Watch = void 0;
    config_json_5 = __importDefault(config_json_5);
    var Watch;
    (function (Watch) {
        Watch.locale = url_2.Url.params["locale"] || navigator.language;
        var phi = (1 + Math.sqrt(5)) / 2;
        Watch.makeDate = function (date, locale) {
            return date.toLocaleDateString(locale, config_json_5.default.watch.dateFormat);
        };
        Watch.makeTime = function (date, locale) {
            return date.toLocaleTimeString(locale, config_json_5.default.watch.timeFormat);
        };
        var patternCount = 0;
        var currentPatternStartAt = 0;
        var currentPattern = null;
        Watch.makePattern = function (date) {
            var now = date.getTime();
            if (null === currentPattern || config_json_5.default.watch.patternSpan <= now - currentPatternStartAt) {
                var type = "stripe";
                var foregroundColor = "white";
                var diagonal = Math.hypot(window.innerWidth, window.innerHeight) / 100;
                var intervalSize = diagonal * (3 + random_1.Random.makeInteger(30));
                currentPattern =
                    {
                        type: type,
                        layoutAngle: Math.random(),
                        foregroundColor: foregroundColor,
                        intervalSize: intervalSize,
                        depth: 0.0,
                        maxPatternSize: random_1.Random.select([undefined, intervalSize / (2 + random_1.Random.makeInteger(9)),]),
                        anglePerDepth: random_1.Random.select([undefined, "auto", "-auto",]),
                        //maximumFractionDigits: getEnoughPatternFractionDigits(),
                    };
                ++patternCount;
                currentPatternStartAt = now;
            }
            var step = (now - currentPatternStartAt) / config_json_5.default.watch.patternSpan;
            // In flounder.style.js, when depth is 0 or 1 only the background-color is produced and no pattern is generated, so avoid 0.
            currentPattern.depth = Math.min(1 - config_json_5.default.watch.minPatternDepth, Math.max(config_json_5.default.watch.minPatternDepth, 1 === (patternCount % 2) ? step : 1 - step));
            return currentPattern;
        };
        Watch.backgroundToMask = function (backgroundStyle) {
            var maskStyle = {
                //"mask-color": backgroundStyle["background-color"],
                "mask-image": backgroundStyle["background-image"],
                "mask-size": backgroundStyle["background-size"],
                "mask-position": backgroundStyle["background-position"],
            };
            return maskStyle;
        };
        Watch.setColor = function (color) {
            ui_4.UI.setStyle(ui_4.UI.date, "color", color);
            ui_4.UI.setStyle(ui_4.UI.time, "color", color);
        };
        Watch.update = function () {
            if ("none" !== ui_4.UI.watchColor) {
                var date = new Date();
                ui_4.UI.setTextContent(ui_4.UI.time, Watch.makeTime(date, Watch.locale));
                ui_4.UI.setAttribute(ui_4.UI.time, "datatime", Watch.makeTime(date, "ja-JP"));
                ui_4.UI.setTextContent(ui_4.UI.date, Watch.makeDate(date, Watch.locale));
                ui_4.UI.setAttribute(ui_4.UI.date, "datatime", date.toISOString().slice(0, 10));
                switch (ui_4.UI.watchColor) {
                    case "white":
                        Watch.setColor("white");
                        break;
                    case "black":
                        Watch.setColor("black");
                        break;
                    case "zebra":
                        Watch.setColor("white");
                        flounder_style_js_1.FlounderStyle.setStyle(ui_4.UI.pattern, Watch.backgroundToMask(flounder_style_js_1.FlounderStyle.makeStyle(Watch.makePattern(date))));
                        break;
                    case "rainbow":
                        Watch.setColor("hsl(".concat(((date.getTime() * 360) / (24000 * phi)).toFixed(2), "deg, 100%, 61%)"));
                        Watch.setColor("oklch(70% 0.18 ".concat(((date.getTime() * 360) / (24000 * phi)).toFixed(2), "deg)"));
                        break;
                }
            }
            else {
                ui_4.UI.setTextContent(ui_4.UI.time, "");
                ui_4.UI.setAttribute(ui_4.UI.time, "datatime", undefined);
                ui_4.UI.setTextContent(ui_4.UI.date, "");
                ui_4.UI.setAttribute(ui_4.UI.date, "datatime", undefined);
            }
        };
    })(Watch || (exports.Watch = Watch = {}));
});
define("script/index", ["require", "exports", "script/url", "script/model", "script/color", "script/render", "script/fps", "script/ui", "script/event", "script/watch", "resource/config"], function (require, exports, url_3, model_3, color_3, render_1, fps_1, ui_5, event_1, watch_1, config_json_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    config_json_6 = __importDefault(config_json_6);
    url_3.Url.initialize();
    event_1.Event.initialize();
    //console.log("URL Parameters:", Url.params);
    if ("random" === url_3.Url.params["coloring"] || url_3.Url.params["coloring"] in config_json_6.default.coloring) {
        //console.log(`🎨 Coloring from URL parameter: ${Url.params["coloring"]}`);
        ui_5.UI.toggleColoring(url_3.Url.params["coloring"]);
        color_3.Color.updateColoring();
    }
    else {
        //console.log("🎨 Default coloring");
        ui_5.UI.updateColoringRoundBar();
    }
    if (ui_5.UI.PixelRatioModeKeys.includes(url_3.Url.params["quality"])) {
        //console.log(`🖼️ Quality from URL parameter: ${Url.params["quality"]}`);
        ui_5.UI.toggleQuality(url_3.Url.params["quality"]);
        model_3.Model.updateStretch();
    }
    else {
        //console.log("🖼️ Default quality");
        ui_5.UI.updateQualityRoundBar();
    }
    if (url_3.Url.params["pitch"] && !isNaN(Number(url_3.Url.params["pitch"]))) {
        //console.log(`🎵 Pitch from URL parameter: ${Url.params["pitch"]}`);
        ui_5.UI.togglePitch(Number(url_3.Url.params["pitch"]));
        model_3.Model.setPitch(ui_5.UI.getPitch());
    }
    else {
        //console.log("🎵 Default pitch");
        ui_5.UI.updatePitchRoundBar();
    }
    if (ui_5.UI.WatchColorList.includes(url_3.Url.params["watch"])) {
        //console.log(`⌚ Watch display from URL parameter: ${Url.params["watch"]}`);
        ui_5.UI.toggleWatchDisplay(url_3.Url.params["watch"]);
    }
    else {
        //console.log("⌚ Default watch display");
        ui_5.UI.updateWatchVisibility();
    }
    if ("true" === url_3.Url.params["fps"]) {
        //console.log("⚡ FPS display from URL parameter: true");
        ui_5.UI.toggleFpsDisplay(true);
    }
    else {
        //console.log("⚡ Default FPS display");
        ui_5.UI.fpsDiv.style.display = "none";
    }
    ui_5.UI.fullscreenButton.style.display = ui_5.UI.fullscreenEnabled ? "block" : "none";
    ui_5.UI.setAriaHidden(ui_5.UI.fullscreenButton, !ui_5.UI.fullscreenEnabled);
    ui_5.UI.updateFullscreenState();
    ui_5.UI.jumpOutButton.style.display = ui_5.UI.isInIframe ? "block" : "none";
    ui_5.UI.setAriaHidden(ui_5.UI.jumpOutButton, ui_5.UI.isInIframe);
    ui_5.UI.resize();
    var step = function (timestamp) {
        render_1.Render.draw(model_3.Model.updateData(timestamp));
        watch_1.Watch.update();
        if (ui_5.UI.fpsDiv.style.display !== "none") {
            fps_1.Fps.step(timestamp);
            ui_5.UI.fpsDiv.innerText = fps_1.Fps.getText();
        }
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
});
//# sourceMappingURL=index.js.map