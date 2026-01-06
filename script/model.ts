import config from "@resource/config.json";
export namespace Model
{
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    export const pseudoGaussian = (samples: number = 6): number =>
    {
        let total = 0;
        for (let i = 0; i < samples; i++)
        {
            total += Math.random();
        }
        return total / samples;
    };
    export interface Point
    {
        x: number;
        y: number;
    };
    // const addPoints = (a: Point, b: Point): Point =>
    // ({
    //     x: a.x + b.x,
    //     y: a.y + b.y,
    // });
    export interface Animation
    {
        period: number;
        phase: number;
        scale: number;
    }
    export interface FloatAnimation
    {
        x: Animation[];
        y: Animation[];
    };
    export interface UnitAnimation
    {
        moveAnimation: FloatAnimation;
        sizeAnimation: Animation[];
        appearAnimation?: Animation;
        vanishAnimation?: Animation;
    };
    //type animationMode = "gaze" | "float";
    export interface EyeAnimation
    {
        //animationMode: animationMode;
        moveAnimation: FloatAnimation[];
        appearAnimation?: Animation;
        vanishAnimation?: Animation;
    };
    export interface Circle extends Point
    {
        radius: number;
    };
    export const makeCircle = (point: Point, radius: number): Circle =>
    ({
        x: point.x,
        y: point.y,
        radius,
    });
    export interface Unit
    {
        body: Circle;
        scale: number;
        animation: UnitAnimation;
        eye?:
        {
            white: Circle;
            iris: Circle;
            animation: EyeAnimation;
        };
    };
    export interface Layer
    {
        units: Unit[];
        lastMadeAt: number;
        lastRemovedAt: number;
    };
    export const Data =
    {
        previousTimestamp: 0,
        width: 0,
        height: 0,
        accent: { units: [], lastMadeAt: 0, lastRemovedAt: 0, } as Layer,
        main: { units: [], lastMadeAt: 0, lastRemovedAt: 0, } as Layer,
    };
    export const isOutOfCanvas = (circle: Circle) =>
    {
        const marginRate = config.rendering.marginRate;
        const shortSide = Math.min(canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const x = (circle.x *marginRate *shortSide) +centerX;
        const y = (circle.y *marginRate *shortSide) +centerY;
        return (x +circle.radius *shortSide < 0 ||
                y +circle.radius *shortSide < 0 ||
                canvas.width < x -circle.radius *shortSide ||
                canvas.height < y -circle.radius *shortSide);
    };
    export const sumValidAreas = (layer: Layer) =>
        layer.units
            .filter(unit => ! isOutOfCanvas(unit.body))
            .reduce((sum, unit) => sum + Math.PI * unit.body.radius * unit.body.radius, 0);
    export const sumAllAreas = (layer: Layer) =>
        layer.units
            .reduce((sum, unit) => sum + Math.PI * unit.body.radius * unit.body.radius, 0);
    export const calculateAnimationSineIntegral = (animation: Animation, step: number): number =>
    {
        // return stepで積分(Math.sin((animation.phase / animation.period) * Math.PI * 2));
        if (animation.period <= 0 || 0 === step)
        {
            return 0;
        }
        else
        {
            const omega = (2 * Math.PI) / animation.period;
            // ∫0^step sin(omega*(phase + τ)) dτ = (cos(omega*phase) - cos(omega*(phase + step))) / omega
            const integral = (Math.cos(omega * animation.phase) - Math.cos(omega * (animation.phase + step))) / omega;
            return integral * animation.scale;
        }
    };
    export const accumulateAnimationSineIntegral = (animations: Animation[], step: number): number =>
        animations.reduce((sum, animation) => sum + calculateAnimationSineIntegral(animation, step), 0);
    export const accumulateAnimationSize = (animations: Animation[], step: number): number =>
        animations.reduce
        (
            (product, animation) =>
            {
                const phase = animation.phase + step;
                return product +Math.pow(Math.sin((phase / animation.period) * Math.PI), 2) *0.5 *animation.scale;
            },
            0.0
        );
    export const updateAnimation = (animation: Animation, step: number) =>
    {
        animation.phase += step;
        while(animation.period <= animation.phase)
        {
            animation.phase -= animation.period;
        }
    };
    export const updateAnimations = (animations: Animation[] , step: number) =>
        animations.forEach((animation) => updateAnimation(animation, step));
    export const updateFloatAnimation = (floatAnimation: FloatAnimation, step: number) =>
    {
        updateAnimations(floatAnimation.x, step);
        updateAnimations(floatAnimation.y, step);
    };
    export const makeAnimation = (specific: { period: { base: number, pseudoGaussian: number, range: number }, scale: { base: number, pseudoGaussian: number, range: number } }, scaleRate: number): Animation =>
    {
        const period = specific.period.base +(pseudoGaussian(specific.period.pseudoGaussian) * specific.period.range);
        const phase = period *Math.random();
        const scale = (specific.scale.base +(pseudoGaussian(specific.scale.pseudoGaussian) * specific.scale.range)) *scaleRate;
        return { phase, period, scale, };
    };
    export const makeUnitAnimation = (): UnitAnimation =>
    {
        // const shortSide = Math.min(window.innerWidth, window.innerHeight) *3.0;
        // const xRatio = window.innerWidth / shortSide;
        // const yRatio = window.innerHeight / shortSide;
        const xRatio = 1.0;
        const yRatio = 1.0;
        const result: UnitAnimation =
        {
            moveAnimation:
            {
                x: config.Layer.unit.moveAnimation.elements.map(i => makeAnimation(config.Layer.unit.moveAnimation, i *xRatio)),
                y: config.Layer.unit.moveAnimation.elements.map(i => makeAnimation(config.Layer.unit.moveAnimation, i *yRatio)),
            },
            sizeAnimation:
                config.Layer.unit.sizeAnimation.elements.map(i => makeAnimation(config.Layer.unit.sizeAnimation, i)),
        };
        return result;
    };
    export const makeUnit = (point: Point): Unit =>
    {
        const body = makeCircle(point, (Math.pow(pseudoGaussian(4), 2) *0.19) +0.01);
        const result =
        {
            body,
            scale: body.radius,
            animation: makeUnitAnimation(),
        };
        //updateUnit(result, Math.random() *10000);
        result.animation.appearAnimation =
        {
            period: config.Layer.unit.appearAnimation.period,
            phase: 0,
            scale: result.scale,
        };
        return result;
    };
    export const updateUnit = (unit: Unit, step: number) =>
    {
        const rate = 0.0005;
        unit.body.x += accumulateAnimationSineIntegral(unit.animation.moveAnimation.x, step) *rate;
        unit.body.y += accumulateAnimationSineIntegral(unit.animation.moveAnimation.y, step) *rate;
        const transion = unit.animation.appearAnimation ?? unit.animation.vanishAnimation;
        if (transion)
        {
            transion.phase += step;
            if (unit.animation.vanishAnimation)
            {
                unit.body.radius = transion.scale *(1.0 - (transion.phase /transion.period));
                if (transion.period <= transion.phase)
                {
                    unit.animation.vanishAnimation = undefined;
                }
            }
            else
            {
                unit.body.radius = transion.scale *(transion.phase /transion.period);
                if (transion.period <= transion.phase)
                {
                    unit.animation.appearAnimation = undefined;
                }
            }
        }
        const scale = transion ? unit.body.radius: unit.scale;
        unit.body.radius = scale *(1 +(accumulateAnimationSize(unit.animation.sizeAnimation, step) *2.0));
        updateFloatAnimation(unit.animation.moveAnimation, step);
        updateAnimations(unit.animation.sizeAnimation, step);
    };
    export const updateLayer = (layer: Layer, timestamp: number, step: number) =>
    {
        const shortSide = Math.min(window.innerWidth, window.innerHeight);
        const longSide = Math.max(window.innerWidth, window.innerHeight);
        const validVolume = sumValidAreas(layer);
        const allVolume = sumAllAreas(layer);
        const longSideRatio = 0 < shortSide ? longSide / shortSide: 0;
        const validAreaRatio = validVolume /(longSideRatio *2.0);
        const allAreaRatio = allVolume /Math.min(longSideRatio *2.0, validVolume);
        if (validAreaRatio < 0.5)
        {
            const makeUnitCooldown = 1000 *validAreaRatio;
            if (makeUnitCooldown <= timestamp -layer.lastMadeAt)
            {
                layer.units.push(makeUnit({ x: (pseudoGaussian(1) -0.5) *window.innerWidth/ shortSide, y: (pseudoGaussian(1) -0.5) *window.innerHeight /shortSide, }));
                layer.lastMadeAt = timestamp;
            }
        }
        else
        if (1.0 < allAreaRatio || (0.5 < allAreaRatio && layer.lastRemovedAt +3000 < timestamp))
        {
            const removeUnitCooldown = 1000 /allAreaRatio;
            if (removeUnitCooldown <= timestamp -layer.lastRemovedAt)
            {
                const target = layer.units.filter((unit) => undefined === unit.animation.vanishAnimation)[0];
                if (target)
                {
                    target.animation.vanishAnimation =
                    {
                        period: config.Layer.unit.vanishAnimation.period,
                        phase: 0,
                        scale: target.scale,
                    };
                    layer.lastRemovedAt = timestamp;
                }
            }
        }
        layer.units.forEach((unit) => updateUnit(unit, step));
        const gabages = layer.units.filter((unit) => unit.body.radius <= 0);
        gabages.forEach
        (
            (garbage) =>
            {
                const index = layer.units.indexOf(garbage);
                if (0 <= index)
                {
                    layer.units.splice(index, 1);
                }
            }
        );
    };
    export const updateStretch = () =>
    {
        //const devicePixelRatio = window.devicePixelRatio ?? 1;
        const devicePixelRatio = 1;
        canvas.width = Data.width = window.innerWidth *devicePixelRatio;
        canvas.height = Data.height = window.innerHeight *devicePixelRatio;
    };
    export const updateData = (timestamp: number) =>
    {
        //const devicePixelRatio = window.devicePixelRatio ?? 1;
        const devicePixelRatio = 1;
        const step = 0 < Data.previousTimestamp ? Math.min(timestamp - Data.previousTimestamp, 500): 0;
        if (window.innerWidth *devicePixelRatio !== Data.width || window.innerHeight *devicePixelRatio !== Data.height)
        {
            updateStretch();
        }
        updateLayer(Data.accent, timestamp, step);
        updateLayer(Data.main, timestamp, step);
        Data.previousTimestamp = timestamp;
    };
}
