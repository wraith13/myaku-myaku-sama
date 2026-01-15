declare module "script/url" {
    export namespace Url {
        const parseParameter: (url: string) => Record<string, string>;
        const make: (params: Record<string, string>) => string;
        const addParameter: (params: Record<string, string>, key: string, value: string) => Record<string, string>;
        const initialize: () => void;
        const params: Record<string, string>;
    }
}
declare module "script/geometry" {
    export namespace Geometry {
        interface Point {
            x: number;
            y: number;
        }
        const addPoints: (a: Point, b: Point) => Point;
        const subPoints: (a: Point, b: Point) => Point;
        const mulPoint: (a: Point, b: number) => Point;
        const averagePoints: (points: Point[]) => Point;
    }
}
declare module "script/model" {
    import { Geometry } from "script/geometry";
    export namespace Model {
        const pseudoGaussian: (samples?: number) => number;
        interface Animation {
            period: number;
            phase: number;
            scale: number;
        }
        interface FloatAnimation {
            x: Animation[];
            y: Animation[];
        }
        interface UnitAnimation {
            moveAnimation: FloatAnimation;
            sizeAnimation: Animation[];
            appearAnimation?: Animation;
            vanishAnimation?: Animation;
        }
        interface EyeAnimation {
            moveAnimation: FloatAnimation;
            appearAnimation?: Animation;
            vanishAnimation?: Animation;
        }
        interface Circle extends Geometry.Point {
            radius: number;
        }
        const makeCircle: (point: Geometry.Point, radius: number) => Circle;
        interface Eye {
            white: Circle;
            iris: Circle;
            animation: EyeAnimation;
        }
        interface Unit {
            body: Circle;
            scale: number;
            animation: UnitAnimation;
            eye?: Eye;
        }
        interface Layer {
            units: Unit[];
            lastMadeAt: number;
            lastRemovedAt: number;
        }
        const Data: {
            previousTimestamp: number;
            previousPitchedTimestamp: number;
            pitch: number;
            width: number;
            height: number;
            accent: Layer;
            main: Layer;
        };
        const setPitch: (value: number) => void;
        const isOutOfCanvas: (circle: Circle) => boolean;
        const sumValidAreas: (layer: Layer) => number;
        const sumAllAreas: (layer: Layer) => number;
        const calculateAnimationSineIntegral: (animation: Animation, step: number) => number;
        const accumulateAnimationSineIntegral: (animations: Animation[], step: number) => number;
        const accumulateAnimationSize: (animations: Animation[], step: number) => number;
        const updateAnimation: (animation: Animation, step: number) => void;
        const updateAnimations: (animations: Animation[], step: number) => void;
        const updateFloatAnimation: (floatAnimation: FloatAnimation, step: number) => void;
        const makeAnimation: (specific: {
            period: {
                base: number;
                pseudoGaussian: number;
                range: number;
            };
            scale: {
                base: number;
                pseudoGaussian: number;
                range: number;
            };
        }, scaleRate: number) => Animation;
        const makeUnitAnimation: () => UnitAnimation;
        const makeUnit: (point: Geometry.Point) => Unit;
        const makeEye: () => Eye;
        const updateUnit: (layer: Layer, unit: Unit, step: number) => void;
        const updateLayer: (layer: Layer, timestamp: number, step: number) => void;
        const PixelRatioModeKeys: readonly ["thirty-second", "sixteenth", "eighth", "quarter", "half", "regular", "full"];
        type PixelRatioMode = typeof PixelRatioModeKeys[number];
        const togglePixelRatioMode: (value?: boolean | PixelRatioMode) => void;
        const getPixcelRatioLevel: () => number;
        const getPixcelRatio: () => number;
        const updateStretch: () => void;
        const updateData: (rawTimestamp: number) => boolean;
    }
}
declare module "script/ui" {
    import config from "resource/config";
    export namespace UI {
        const canvas: HTMLCanvasElement;
        const overlayPanel: HTMLDivElement;
        const time: HTMLTimeElement;
        const date: HTMLTimeElement;
        const pattern: HTMLDivElement;
        const fpsDiv: HTMLDivElement;
        const coloringButton: HTMLButtonElement;
        const hdButton: HTMLButtonElement;
        const pitchButton: HTMLButtonElement;
        const watchButton: HTMLButtonElement;
        const fpsButton: HTMLButtonElement;
        const fullscreenButton: HTMLButtonElement;
        const jumpOutButton: HTMLButtonElement;
        const fullscreenEnabled: any;
        const isInIframe: boolean;
        const setAriaHidden: (element: HTMLElement, hidden: boolean) => void;
        const WatchColorList: readonly ["none", "white", "black", "zebra", "rainbow"];
        type WatchColor = typeof WatchColorList[number];
        let watchColor: WatchColor;
        const updateWatchVisibility: () => void;
        const updateRoundBar: (button: HTMLButtonElement, properties: {
            low: number;
            high: number;
            rotate: number;
        }) => void;
        const updateColoringRoundBar: () => void;
        type ColoringType = keyof typeof config["coloring"] | "random";
        let coloring: ColoringType;
        const toggleColoring: (style?: boolean | keyof (typeof config)["coloring"]) => void;
        const updateHdRoundBar: () => void;
        const updatePitchRoundBar: () => void;
        const togglePitch: (value?: boolean | (typeof config.pitch.presets)[number]) => void;
        const updateWatchRoundBar: () => void;
        const toggleWatchDisplay: (value?: boolean | WatchColor) => void;
        const toggleFpsDisplay: () => void;
        const toggleFullScreen: () => void;
        const updateFullscreenState: () => void;
        class ToggleClassForWhileTimer {
            timer: ReturnType<typeof setTimeout> | undefined;
            constructor();
            start(element: HTMLElement, token: string, span: number, onEnd?: () => unknown): void;
            isInTimer: () => boolean;
        }
        const mousemove: () => void;
        const resize: () => void;
        const setTextContent: (element: HTMLElement, text: string) => boolean;
        const setAttribute: (element: HTMLElement, name: string, value: string | undefined) => boolean;
        const setStyle: (element: HTMLElement, name: string, value: string | undefined) => boolean;
    }
}
declare module "script/render" {
    import { Model } from "script/model";
    export namespace Render {
        const updateColoring: () => void;
        const getCanvasCircle: () => Model.Circle;
        const draw: (isUpdatedModel: boolean) => void;
    }
}
declare module "script/fps" {
    export namespace Fps {
        export class OnlineStandardDeviation {
            count: number;
            mean: number;
            m2: number;
            reset: () => void;
            update: (value: number) => void;
            isValid: () => boolean;
            getVariance: () => number;
            getStandardDeviation: () => number;
        }
        export const standardDeviation: OnlineStandardDeviation;
        interface FpsHistoryEntry {
            fps: number;
            now: number;
            text: string;
        }
        export let currentMaxFps: FpsHistoryEntry;
        export let currentNowFps: FpsHistoryEntry;
        export let currentMinFps: FpsHistoryEntry;
        export let fuseFps: number;
        export let isValid: boolean;
        export let averageFps: number;
        export const reset: () => void;
        export const step: (now: number) => void;
        export const getText: () => string;
        export const isUnderFuseFps: () => boolean;
        export {};
    }
}
declare module "script/event" {
    export namespace Event {
        const initialize: () => void;
    }
}
declare module "script/random" {
    export namespace Random {
        type Function = (index?: number, prime?: number) => number;
        const makeInteger: (size: number, random?: Function, index?: number, prime?: number) => number;
        const select: <T>(list: T[], random?: Function, index?: number, prime?: number) => T;
    }
}
declare module "flounder.style.js/evil-type.ts/common/evil-type" {
    export namespace EvilType {
        const comparer: <Item, T extends ((i: Item) => any)[]>(...args: T) => (a: Item, b: Item) => 0 | 1 | -1;
        const lazy: <T extends (...args: any[]) => any>(invoker: () => T) => T;
        namespace Error {
            interface Item {
                type: "solid" | "fragment";
                path: string;
                requiredType: string;
                actualValue: string;
            }
            interface Listener {
                path: string;
                matchRate: {
                    [path: string]: boolean | number;
                };
                errors: Item[];
            }
            const makeListener: (path?: string) => Listener;
            const nextListener: <T extends Listener | undefined>(name: string | number, listner: T) => T;
            const makePath: (path: string, name: string | number) => string;
            const getPathDepth: (path: string) => number;
            const getType: (isType: ((v: unknown, listner?: Listener) => boolean)) => string[];
            const isMtached: (matchRate: boolean | number) => matchRate is true;
            const matchRateToNumber: (matchRate: boolean | number) => number;
            const setMatchRate: (listner: Listener | undefined, matchRate: boolean | number) => matchRate is true;
            const getMatchRate: (listner: Listener, path?: string) => number | boolean;
            const calculateMatchRate: (listner: Listener, path?: string) => number | true;
            const setMatch: (listner: Listener | undefined) => void;
            const raiseError: (listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) => boolean;
            const orErros: (listner: Listener, modulus: number, errors: Item[], fullErrors: Item[]) => void;
            const andErros: (listner: Listener, errors: Item[]) => void;
            const valueToString: (value: unknown) => string;
            const withErrorHandling: (isMatchType: boolean, listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) => boolean;
        }
        namespace Validator {
            type ErrorListener = Error.Listener;
            const makeErrorListener: (path?: string) => Error.Listener;
            type IsType<T> = (value: unknown, listner?: ErrorListener) => value is T;
            const isJust: <T>(target: T) => (value: unknown, listner?: ErrorListener) => value is T;
            const isNever: (value: unknown, listner?: ErrorListener) => value is never;
            const isUndefined: (value: unknown, listner?: ErrorListener) => value is undefined;
            const isUnknown: (_value: unknown, _listner?: ErrorListener) => _value is unknown;
            const isAny: (_value: unknown, _listner?: ErrorListener) => _value is any;
            const isNull: (value: unknown, listner?: ErrorListener) => value is null;
            const isBoolean: (value: unknown, listner?: ErrorListener) => value is boolean;
            const isInteger: (value: unknown, listner?: ErrorListener) => value is number;
            const isSafeInteger: (value: unknown, listner?: ErrorListener) => value is number;
            const isDetailedInteger: (data: {
                minimum?: number;
                exclusiveMinimum?: number;
                maximum?: number;
                exclusiveMaximum?: number;
                multipleOf?: number;
            }, safeInteger?: "safe") => IsType<number>;
            const isNumber: (value: unknown, listner?: ErrorListener) => value is number;
            const isSafeNumber: (value: unknown, listner?: ErrorListener) => value is number;
            const isDetailedNumber: (data: {
                minimum?: number;
                exclusiveMinimum?: number;
                maximum?: number;
                exclusiveMaximum?: number;
                multipleOf?: number;
            }, safeNumber?: "safe") => IsType<number>;
            const isString: (value: unknown, listner?: ErrorListener) => value is string;
            const makeStringTypeName: (data: {
                minLength?: number;
                maxLength?: number;
                pattern?: string;
                format?: string;
                regexpFlags?: string;
            }) => string;
            const regexpTest: (pattern: string, flags: string, text: string) => boolean;
            const isDetailedString: <Type extends string = string>(data: {
                minLength?: number;
                maxLength?: number;
                pattern?: string;
                format?: string;
                regexpFlags?: string;
                regexpTest?: (pattern: string, flags: string, text: string) => boolean;
            }, regexpFlags?: string) => IsType<Type>;
            type ActualObject = Exclude<object, null>;
            const isObject: (value: unknown) => value is ActualObject;
            const isEnum: <T>(list: readonly T[]) => (value: unknown, listner?: ErrorListener) => value is T;
            const isUniqueItems: (list: unknown[]) => boolean;
            const makeArrayTypeName: (data?: {
                minItems?: number;
                maxItems?: number;
                uniqueItems?: boolean;
            }) => string;
            const isArray: <T>(isType: IsType<T>, data?: {
                minItems?: number;
                maxItems?: number;
                uniqueItems?: boolean;
            }) => (value: unknown, listner?: ErrorListener) => value is T[];
            const makeOrTypeNameFromIsTypeList: <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) => string[];
            const getBestMatchErrors: (listeners: ErrorListener[]) => Error.Listener[];
            const isOr: <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) => (value: unknown, listner?: ErrorListener) => value is T[number];
            type OrTypeToAndType<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
            const isAnd: <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) => (value: unknown, listner?: ErrorListener) => value is OrTypeToAndType<T[number]>;
            interface NeverTypeGuard {
                $type: "never-type-guard";
            }
            const isNeverTypeGuard: (value: unknown, listner?: ErrorListener) => value is NeverTypeGuard;
            const isNeverMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, _neverTypeGuard: NeverTypeGuard, listner?: ErrorListener) => boolean;
            interface OptionalTypeGuard<T> {
                $type: "optional-type-guard";
                isType: IsType<T> | ObjectValidator<T>;
            }
            const isOptionalTypeGuard: (value: unknown, listner?: ErrorListener) => value is OptionalTypeGuard<unknown>;
            const makeOptionalTypeGuard: <T>(isType: IsType<T> | ObjectValidator<T>) => OptionalTypeGuard<T>;
            const invokeIsType: <T>(isType: IsType<T> | ObjectValidator<T>) => IsType<T> | ((value: unknown, listner?: ErrorListener) => value is object);
            const isOptional: <T>(isType: IsType<T> | ObjectValidator<T>) => OptionalTypeGuard<T>;
            const isOptionalMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, optionalTypeGuard: OptionalTypeGuard<unknown>, listner?: ErrorListener) => boolean;
            const isMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: IsType<unknown> | OptionalTypeGuard<unknown>, listner?: ErrorListener) => boolean;
            type NeverKeys<T> = {
                [K in keyof T]: T[K] extends never ? K : never;
            }[keyof T];
            type OptionalKeys<T> = Exclude<{
                [K in keyof T]: T extends Record<K, T[K]> ? never : K;
            } extends {
                [_ in keyof T]: infer U;
            } ? U : never, NeverKeys<T>>;
            type OptionalType<T> = Required<Pick<T, OptionalKeys<T>>>;
            type NonOptionalKeys<T> = Exclude<keyof T, NeverKeys<T> | OptionalKeys<T>>;
            type NonOptionalType<T> = Pick<T, NonOptionalKeys<T>>;
            type ObjectValidator<ObjectType> = {
                [key in NeverKeys<ObjectType>]: NeverTypeGuard;
            } & {
                [key in NonOptionalKeys<ObjectType>]: IsType<ObjectType[key]> | ObjectValidator<ObjectType[key]>;
            } & {
                [key in OptionalKeys<ObjectType>]: OptionalTypeGuard<Exclude<ObjectType[key], undefined>>;
            };
            type MergeType<A, B> = Omit<A, keyof B> & B;
            type MergeMultipleType<A, B extends any[]> = B extends [infer Head, ...infer Tail] ? MergeMultipleType<MergeType<A, Head>, Tail> : B extends [infer Last] ? MergeType<A, Last> : A;
            const mergeObjectValidator: <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) => MergeMultipleType<ObjectValidator<A>, B>;
            const isSpecificObject: <ObjectType extends ActualObject>(memberValidator: ObjectValidator<ObjectType> | (() => ObjectValidator<ObjectType>), options?: {
                additionalProperties?: boolean;
            }) => (value: unknown, listner?: ErrorListener) => value is ObjectType;
            const isDictionaryObject: <MemberType, Keys extends string>(isType: IsType<MemberType>, keys?: Keys[], options?: {
                additionalProperties?: boolean;
            }) => (value: unknown, listner?: ErrorListener) => value is { [key in Keys]: MemberType; };
        }
    }
}
declare module "flounder.style.js/generated/type" {
    import { EvilType } from "flounder.style.js/evil-type.ts/common/evil-type";
    export { EvilType };
    export namespace Type {
        type FlounderType = Arguments["type"];
        type LayoutAngle = "regular" | "alternative";
        type HexColor = `#${string}`;
        type NamedColor = "black" | "silver" | "gray" | "white" | "maroon" | "red" | "purple" | "fuchsia" | "green" | "lime" | "olive" | "yellow" | "navy" | "blue" | "teal" | "aqua" | "aliceblue" | "antiquewhite" | "aquamarine" | "azure" | "beige" | "bisque" | "blanchedalmond" | "blueviolet" | "brown" | "burlywood" | "cadetblue" | "chartreuse" | "chocolate" | "coral" | "cornflowerblue" | "cornsilk" | "crimson" | "cyan" | "darkblue" | "darkcyan" | "darkgoldenrod" | "darkgray" | "darkgreen" | "darkgrey" | "darkkhaki" | "darkmagenta" | "darkolivegreen" | "darkorange" | "darkorchid" | "darkred" | "darksalmon" | "darkseagreen" | "darkslateblue" | "darkslategray" | "darkslategrey" | "darkturquoise" | "darkviolet" | "deeppink" | "deepskyblue" | "dimgray" | "dimgrey" | "dodgerblue" | "firebrick" | "floralwhite" | "forestgreen" | "gainsboro" | "ghostwhite" | "gold" | "goldenrod" | "greenyellow" | "grey" | "honeydew" | "hotpink" | "indianred" | "indigo" | "ivory" | "khaki" | "lavender" | "lavenderblush" | "lawngreen" | "lemonchiffon" | "lightblue" | "lightcoral" | "lightcyan" | "lightgoldenrodyellow" | "lightgray" | "lightgreen" | "lightgrey" | "lightpink" | "lightsalmon" | "lightseagreen" | "lightskyblue" | "lightslategray" | "lightslategrey" | "lightsteelblue" | "lightyellow" | "limegreen" | "linen" | "magenta" | "mediumaquamarine" | "mediumblue" | "mediumorchid" | "mediumpurple" | "mediumseagreen" | "mediumslateblue" | "mediumspringgreen" | "mediumturquoise" | "mediumvioletred" | "midnightblue" | "mintcream" | "mistyrose" | "moccasin" | "navajowhite" | "oldlace" | "olivedrab" | "orange" | "orangered" | "orchid" | "palegoldenrod" | "palegreen" | "paleturquoise" | "palevioletred" | "papayawhip" | "peachpuff" | "peru" | "pink" | "plum" | "powderblue" | "rebeccapurple" | "rosybrown" | "royalblue" | "saddlebrown" | "salmon" | "sandybrown" | "seagreen" | "seashell" | "sienna" | "skyblue" | "slateblue" | "slategray" | "slategrey" | "snow" | "springgreen" | "steelblue" | "tan" | "thistle" | "tomato" | "transparent" | "turquoise" | "violet" | "wheat" | "whitesmoke" | "yellowgreen";
        type Color = HexColor | NamedColor;
        type Rate = number;
        type SignedRate = number;
        type Pixel = number;
        type SignedPixel = number;
        type Count = number;
        type NamedDirectionAngle = "right" | "right-down" | "down" | "left-down" | "left" | "left-up" | "up" | "right-up";
        type DirectionAngle = NamedDirectionAngle | SignedRate;
        interface ArgumentsBase {
            $schema?: "https://raw.githubusercontent.com/wraith13/flounder.style.js/master/generated/schema.json#";
            type: FlounderType;
            layoutAngle?: LayoutAngle | SignedRate;
            offsetX?: SignedPixel;
            offsetY?: SignedPixel;
            foregroundColor: Color;
            backgroundColor?: Color;
            intervalSize?: Pixel;
            depth: Rate;
            blur?: Pixel;
            maxPatternSize?: Pixel;
            reverseRate?: SignedRate | "auto" | "-auto";
            anglePerDepth?: SignedRate | "auto" | "-auto";
            maximumFractionDigits?: Count;
        }
        interface SpotArguments extends ArgumentsBase {
            type: "trispot" | "tetraspot";
            layoutAngle?: LayoutAngle | 0;
            anglePerDepth?: 0;
        }
        interface LineArguments extends ArgumentsBase {
            type: "stripe" | "diline" | "triline";
        }
        type Arguments = SpotArguments | LineArguments;
        const isFlounderType: EvilType.Validator.IsType<FlounderType>;
        const isLayoutAngle: EvilType.Validator.IsType<LayoutAngle>;
        const isHexColor: EvilType.Validator.IsType<HexColor>;
        const isNamedColor: EvilType.Validator.IsType<NamedColor>;
        const isColor: EvilType.Validator.IsType<Color>;
        const isRate: EvilType.Validator.IsType<Rate>;
        const isSignedRate: EvilType.Validator.IsType<SignedRate>;
        const isPixel: EvilType.Validator.IsType<Pixel>;
        const isSignedPixel: EvilType.Validator.IsType<SignedPixel>;
        const isCount: EvilType.Validator.IsType<Count>;
        const isNamedDirectionAngle: EvilType.Validator.IsType<NamedDirectionAngle>;
        const isDirectionAngle: EvilType.Validator.IsType<DirectionAngle>;
        const isArgumentsBase: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ArgumentsBase;
        const isSpotArguments: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is SpotArguments;
        const isLineArguments: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is LineArguments;
        const isArguments: EvilType.Validator.IsType<Arguments>;
        const argumentsBaseValidatorObject: EvilType.Validator.ObjectValidator<ArgumentsBase>;
        const spotArgumentsValidatorObject: EvilType.Validator.ObjectValidator<SpotArguments>;
        const lineArgumentsValidatorObject: EvilType.Validator.ObjectValidator<LineArguments>;
    }
}
declare module "flounder.style.js/index" {
    import { EvilType, Type as GeneratedType } from "flounder.style.js/generated/type";
    export { EvilType };
    export namespace FlounderStyle {
        export import Type = GeneratedType;
        const sin: (rate: Type.SignedRate) => Type.SignedRate;
        const cos: (rate: Type.SignedRate) => Type.SignedRate;
        const atan2: (direction: {
            x: Type.SignedPixel;
            y: Type.SignedPixel;
        }) => Type.SignedRate;
        type StyleKey = string;
        type StyleValue = string | undefined;
        type StyleProperty = {
            key: StyleKey;
            value: StyleValue;
        };
        type Style = {
            [key: StyleKey]: StyleValue;
        };
        const styleToStylePropertyList: (style: Style) => StyleProperty[];
        const setStyleProperty: (element: HTMLElement, style: StyleProperty) => HTMLElement;
        const makeSureStyle: (styleOrArguments: Style | Type.Arguments) => Style;
        const setStyle: (element: HTMLElement, styleOrArguments: Style | Type.Arguments) => HTMLElement;
        const stylePropertyToString: (style: StyleProperty) => string;
        const styleToString: (styleOrArguments: Style | Type.Arguments, separator?: string) => string;
        const regulateRate: (rate: Type.SignedRate) => Type.Rate;
        const directionAngleToRate: (angle: Type.DirectionAngle) => Type.Rate;
        const isArguments: (value: unknown) => value is Type.Arguments;
        const getPatternType: (data: Type.Arguments) => Type.FlounderType;
        const getLayoutAngle: (data: Type.Arguments) => Type.LayoutAngle;
        const getActualLayoutAngle: (data: Type.Arguments) => number;
        const getAutoAnglePerDepth: (data: Type.Arguments) => number;
        const getActualAnglePerDepth: (data: Type.Arguments) => number;
        const getAngleOffsetByDepth: (data: Type.Arguments) => number;
        const getAngleOffset: (data: Type.Arguments) => number;
        const getBackgroundColor: (data: Type.Arguments) => Type.Color;
        const getIntervalSize: (data: Type.Arguments) => number;
        const getBlur: (data: Type.Arguments) => number;
        const getActualReverseRate: (data: Type.Arguments) => number;
        const getAbsoluteReverseRate: (data: Type.Arguments) => undefined | number | "auto";
        const makeStyle: (data: Type.Arguments) => Style;
        const makePlainStyleOrNull: (data: Type.Arguments) => Style | null;
        const simpleStructuredClone: <T>(value: T) => T;
        const reverseArguments: (data: Type.Arguments) => Type.Arguments;
        const makeTrispotStyle: (data: Type.Arguments) => Style;
        const makeTetraspotStyle: (data: Type.Arguments) => Style;
        const makeStripeStyle: (data: Type.Arguments) => Style;
        const makeDilineStyle: (data: Type.Arguments) => Style;
        const makeTrilineStyle: (data: Type.Arguments) => Style;
        interface OffsetCoefficientDirection {
            x: number;
            y: number;
        }
        interface OffsetCoefficient {
            directions: OffsetCoefficientDirection[];
            intervalSize: number;
            radius: number;
        }
        const calculateOffsetCoefficientDirections: (data: Type.Arguments) => OffsetCoefficientDirection[];
        const calculateOffsetCoefficient: (data: Type.Arguments) => OffsetCoefficient;
        const comparer: <valueT>(a: valueT, b: valueT) => 0 | 1 | -1;
        const makeComparer: <objectT, valueT>(f: (o: objectT) => valueT) => (a: objectT, b: objectT) => 0 | 1 | -1;
        const compareAngles: (a: Type.SignedRate, b: Type.SignedRate) => Type.SignedRate;
        const selectClosestAngleDirection: (directions: OffsetCoefficientDirection[], angle: Type.DirectionAngle) => OffsetCoefficientDirection;
    }
}
declare module "script/watch" {
    import { FlounderStyle } from "flounder.style.js/index";
    export namespace Watch {
        const locale: string;
        const makeDate: (date: Date, locale: string) => string;
        const makeTime: (date: Date, locale: string) => string;
        const makePattern: (date: Date) => FlounderStyle.Type.Arguments;
        const backgroundToMask: (backgroundStyle: FlounderStyle.Style) => FlounderStyle.Style;
        const setColor: (color: string | undefined) => void;
        const update: () => void;
    }
}
declare module "script/index" { }
