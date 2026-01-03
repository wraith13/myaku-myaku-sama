//import { Comparer } from "./comparer";
import { Fps } from "./fps";
import config from "@resource/config.json";
const fpsDiv = document.getElementById("fps");
const pseudoGaussian = (samples: number = 6): number =>
{
    let total = 0;
    for (let i = 0; i < samples; i++)
    {
        total += Math.random();
    }
    return total / samples;
};
interface Point
{
    x: number;
    y: number;
};
const addPoints = (a: Point, b: Point): Point =>
({
    x: a.x + b.x,
    y: a.y + b.y,
});
interface Animation
{
    period: number;
    phase: number;
    scale: number;
}
interface FloatAnimation
{
    x: Animation[];
    y: Animation[];
};
interface UnitAnimation
{
    moveAnimation: FloatAnimation;
    sizeAnimation: Animation[];
    appearAnimation?: Animation;
    vanishAnimation?: Animation;
};
//type animationMode = "gaze" | "float";
interface EyeAnimation
{
    //animationMode: animationMode;
    moveAnimation: FloatAnimation[];
    appearAnimation?: Animation;
    vanishAnimation?: Animation;
};
interface Circle extends Point
{
    radius: number;
};
const makeCircle = (point: Point, radius: number): Circle =>
({
    x: point.x,
    y: point.y,
    radius,
});
interface Unit
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
interface Layer
{
    units: Unit[];
    lastMadeAt: number;
    lastRemovedAt: number;
};
const Data =
{
    previousTimestamp: 0,
    width: 0,
    height: 0,
    accent: { units: [], lastMadeAt: 0, lastRemovedAt: 0, } as Layer,
    main: { units: [], lastMadeAt: 0, lastRemovedAt: 0, } as Layer,
};
const sumAreas = (layer: Layer) =>
    layer.units.reduce((sum, unit) => sum + Math.PI * unit.body.radius * unit.body.radius, 0);
const calculateAnimationSineIntegral = (animation: Animation, step: number): number =>
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
const accumulateAnimationSineIntegral = (animations: Animation[], step: number): number =>
    animations.reduce((sum, animation) => sum + calculateAnimationSineIntegral(animation, step), 0);
const accumulateAnimationSize = (animations: Animation[], step: number): number =>
    animations.reduce
    (
        (product, animation) =>
        {
            const phase = animation.phase + step;
            return product +Math.pow(Math.sin((phase / animation.period) * Math.PI), 2) *0.5 *animation.scale;
        },
        0.0
    );
const updateAnimation = (animation: Animation, step: number) =>
{
    animation.phase += step;
    while(animation.period <= animation.phase)
    {
        animation.phase -= animation.period;
    }
};
const updateAnimations = (animations: Animation[] , step: number) =>
    animations.forEach((animation) => updateAnimation(animation, step));
const updateFloatAnimation = (floatAnimation: FloatAnimation, step: number) =>
{
    updateAnimations(floatAnimation.x, step);
    updateAnimations(floatAnimation.y, step);
};
const makeAnimation = (specific: { period: { base: number, pseudoGaussian: number, range: number }, scale: { base: number, pseudoGaussian: number, range: number } }, scaleRate: number): Animation =>
{
    const period = specific.period.base +(pseudoGaussian(specific.period.pseudoGaussian) * specific.period.range);
    const phase = period *Math.random();
    const scale = (specific.scale.base +(pseudoGaussian(specific.scale.pseudoGaussian) * specific.scale.range)) *scaleRate;
    return { phase, period, scale, };
};
const makeUnitAnimation = (): UnitAnimation =>
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
const makeUnit = (point: Point): Unit =>
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
const updateUnit = (unit: Unit, step: number) =>
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
const updateLayer = (layer: Layer, timestamp: number, step: number) =>
{
    const shortSide = Math.min(window.innerWidth, window.innerHeight);
    const longSide = Math.max(window.innerWidth, window.innerHeight);
    const volume = sumAreas(layer);
    const longSideRatio = 0 < shortSide ? longSide / shortSide: 0;
    const areaRatio = volume /(longSideRatio *2.0);
    if (areaRatio < 1.0)
    {
        const makeUnitCooldown = 1000 *areaRatio;
        if (makeUnitCooldown <= timestamp -layer.lastMadeAt)
        {
            layer.units.push(makeUnit({ x: (pseudoGaussian(1) -0.5) *window.innerWidth/ shortSide, y: (pseudoGaussian(1) -0.5) *window.innerHeight /shortSide, }));
            layer.lastMadeAt = timestamp;
        }
    }
    else
    if (1.0 < areaRatio || (0.5 < areaRatio && layer.lastRemovedAt +3000 < timestamp))
    {
        const removeUnitCooldown = 1000 /areaRatio;
        if (removeUnitCooldown <= timestamp -layer.lastRemovedAt)
        {
            const target = layer.units
                .filter((unit) => undefined === unit.animation.vanishAnimation && undefined === unit.animation.vanishAnimation)
                //.sort(Comparer.make([a => -Math.hypot(a.body.x, a.body.y), a => -a.body.radius]))[0];
                //.sort(Comparer.make(a => -a.body.radius))[0];
                [0];
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
const updateXAnimationStretch = (animation: Animation, xScale: number) =>
{
    animation.scale *= xScale;
};
const updateYAnimationStretch = (animation: Animation, yScale: number) =>
{
    animation.scale *= yScale;
};
const updateCircleStretch = (circle: Circle, xScale: number, yScale: number) =>
{
    const radiusScale = Data.width <= Data.height ?
        window.innerWidth / Data.width:
        window.innerHeight / Data.height;
    circle.x *= xScale;
    circle.y *= yScale;
    circle.radius *= radiusScale;
};
const updateLayerStretch = (layer: Layer) =>
{
    const xScale = window.innerWidth / Data.width;
    const yScale = window.innerHeight / Data.height;
    layer.units.forEach
    (
        i =>
        {
            updateCircleStretch(i.body, xScale, yScale);
            i.animation.moveAnimation.x.forEach(a => updateXAnimationStretch(a, xScale));
            i.animation.moveAnimation.y.forEach(a => updateYAnimationStretch(a, yScale));
            if (i.eye)
            {
                updateCircleStretch(i.eye.white, xScale, yScale);
                updateCircleStretch(i.eye.iris, xScale, yScale);
            }
        }
    );
}
const updateStretch = () =>
{
    updateLayerStretch(Data.accent);
    updateLayerStretch(Data.main);
    canvas.width = Data.width = window.innerWidth;
    canvas.height = Data.height = window.innerHeight;
};
const updateData = (timestamp: number) =>
{
    const step = 0 < Data.previousTimestamp ? Math.min(timestamp - Data.previousTimestamp, 500): 0;
    if (window.innerWidth !== Data.width || window.innerHeight !== Data.height)
    {
        updateStretch();
    }
    updateLayer(Data.accent, timestamp, step);
    updateLayer(Data.main, timestamp, step);
    Data.previousTimestamp = timestamp;
};
console.log("Window loaded.");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
let style = "regular" as keyof typeof config["coloring"];

const fusionThreshold = 1;  // 融合閾値 (r1 + r2) * this
let useFusion = false;  // トグル: trueで融合描画、falseで個別円
const getTangentPoints = (c1: Circle, c2: Circle): { tp1: Point; tp2: Point; tp3: Point; tp4: Point } | null =>
{
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const dist = Math.hypot(dx, dy);
    const sumR = c1.radius + c2.radius;
    if (dist > sumR +(Math.min(c1.radius, c2.radius) *fusionThreshold) || dist < Math.abs(c1.radius - c2.radius)) return null;  // 遠すぎ/重なりすぎ

    //const d = Math.sqrt(dist ** 2 - (c1.radius - c2.radius) ** 2);  // タンジェント長
    const angle = Math.atan2(dy, dx);
    // const theta = Math.acos(c1.radius - c2.radius / dist);
    const theta1 = Math.atan2(c2.radius, c1.radius);
    const theta2 = Math.atan2(c1.radius, c2.radius);

    // 左タンジェント (tp1 on c1, tp3 on c2)
    const tp1: Point = {
        x: c1.x + c1.radius * Math.cos(angle + theta1),
        y: c1.y + c1.radius * Math.sin(angle + theta1)
    };
    const tp3: Point = {
        x: c2.x + c2.radius * Math.cos(angle + theta2 + Math.PI),
        y: c2.y + c2.radius * Math.sin(angle + theta2 + Math.PI)
    };

    // 右タンジェント (tp2 on c1, tp4 on c2)
    const tp2: Point = {
        x: c1.x + c1.radius * Math.cos(angle - theta1),
        y: c1.y + c1.radius * Math.sin(angle - theta1)
    };
    const tp4: Point = {
        x: c2.x + c2.radius * Math.cos(angle - theta2 + Math.PI),
        y: c2.y + c2.radius * Math.sin(angle - theta2 + Math.PI)
    };

    return { tp1, tp2, tp3, tp4 };
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
const drawFusionPath = (layer: Layer, color: string) =>
{
    const units = layer.units.filter(u => 0 < u.body.radius);  // 有効units

    // 融合グラフ構築 (連結成分)
    const graph: number[][] = Array.from({ length: units.length }, () => []);
    for (let i = 0; i < units.length; i++) {
        for (let j = i + 1; j < units.length; j++) {
            const dist = Math.hypot(units[i].body.x - units[j].body.x, units[i].body.y - units[j].body.y);
            if (dist < (units[i].body.radius + units[j].body.radius) + (Math.min(units[i].body.radius, units[j].body.radius) *fusionThreshold)) {
                graph[i].push(j);
                graph[j].push(i);
            }
        }
    }

    // 連結成分探索 (DFSでグループ化)
    const visited = new Array(units.length).fill(false);
    for (let i = 0; i < units.length; i++) {
        if (visited[i]) continue;
        const group: Unit[] = [];
        const stack = [i];
        while (stack.length) {
            const idx = stack.pop()!;
            if (!visited[idx]) {
                visited[idx] = true;
                group.push(units[idx]);
                stack.push(...graph[idx]);
            }
        }

        if (group.length === 1) {
            // 孤立円: 単純arc
            const u = group[0];
            context.beginPath();
            context.arc(u.body.x, u.body.y, u.body.radius, 0, Math.PI * 2);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        } else {
            // 融合グループ: ペアごとベジェ+arc
            for (let j = 0; j < group.length; j++) {
                const u = group[j];
                context.beginPath();
                context.arc(u.body.x, u.body.y, u.body.radius, 0, Math.PI * 2);
                context.fillStyle = color;
                context.fill();
                context.closePath();
                for (let k = j + 1; k < group.length; k++) {
                    const tangents = getTangentPoints(group[j].body, group[k].body);
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
                        const cp1x = (tangents.tp1.x +tangents.tp2.x + tangents.tp3.x + tangents.tp4.x) /4
                        const cp1y = (tangents.tp1.y +tangents.tp2.y + tangents.tp3.y + tangents.tp4.y) /4;
                        context.moveTo(tangents.tp1.x, tangents.tp1.y);
                        context.quadraticCurveTo(cp1x, cp1y, tangents.tp4.x, tangents.tp4.y);  // またはbezierCurveToでcubic

                        // 下側ベジェ: tp2 -> cp -> tp4
                        const cp2x = (tangents.tp1.x +tangents.tp2.x + tangents.tp3.x + tangents.tp4.x) /4
                        const cp2y = (tangents.tp1.y +tangents.tp2.y + tangents.tp3.y + tangents.tp4.y) /4;
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



let useMetaball = false;  // トグル: trueでメタボール描画、falseで個別円描画（デバッグ用）
const drawCircle = (circle: Circle, color: string) =>
{
    if (0 <= circle.radius)
    {
        const shortSide = Math.min(canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        context.beginPath();
        context.arc((circle.x *shortSide) +centerX, (circle.y *shortSide) +centerY, circle.radius *shortSide, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.closePath();
    }
};
const drawEye = (unit: Unit) =>
{
    if (unit.eye)
    {
        drawCircle(makeCircle(addPoints(unit.body, unit.eye.white), unit.eye.white.radius), config.coloring[style].base);
        drawCircle(makeCircle(addPoints(unit.body, unit.eye.iris), unit.eye.iris.radius), config.coloring[style].accent);
    }
};
const getPotential = (layer: Layer, x: number, y: number): number =>
{
    const shortSide = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let sum = 0;
    let maxRadius = 0;
    let maxRadiusDistSq = Infinity;
    layer.units.forEach
    (
        unit =>
        {
            if (0 < unit.body.radius)
            {
                const dx = x - ((unit.body.x * shortSide) + centerX);  // 描画座標に変換（drawCircleのロジックに合わせ）
                const dy = y - ((unit.body.y * shortSide) + centerY);
                const distSq = dx * dx + dy * dy;
                const radius = unit.body.radius * shortSide;
                if (distSq < radius ** 2 && distSq < maxRadiusDistSq)
                {
                    maxRadius = Math.max(maxRadius, radius);
                    maxRadiusDistSq = distSq;
                }
                sum += (radius ** 2) / Math.max(distSq, 1);  // ポテンシャル式（調整可能: **2 でシャープ、**1 でソフト）
            }
        }
    );
    drawLineCount = Math.max(drawLineCount, sum);
    sum = Math.min(sum, maxRadius);  // 最大ポテンシャル制限（重なり過ぎ防止）
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
let drawLineCount = 0;
const gridSize = 10;  // グリッド解像度（小さいほど滑らかだが重い。20-50で調整）
const threshold = 4.0;  // ポテンシャル閾値（低いと融合しやすくなる。0.5-2.0で調整）
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
const drawMetaballLayer = (layer: Layer, color: string) =>
{
    context.beginPath();  // Pathを蓄積
    for (let gy = 0; gy <= canvas.height; gy += gridSize) {
        for (let gx = 0; gx <= canvas.width; gx += gridSize) {
            const potential = getPotential(layer, gx, gy);
            if (threshold <= potential && potential < threshold * 1.75)  // 閾値以上のみ描画
            {
                context.beginPath();
                context.arc(gx +(gridSize /2), gy +(gridSize /2), potential *2, 0, Math.PI * 2);
                context.fillStyle = color;
                context.fill();
                context.closePath();
            }
        }
    }
    context.strokeStyle = color;  // 輪郭線（テスト用。fillで塗りつぶしに変更）
    context.fillStyle = color;
    context.stroke();
    // 塗りつぶし版: context.fillStyle = color; context.fill(); だが、複数形状対応のためPath2Dを使う拡張を推奨
};
const drawLayer = (layer: Layer, color: string) =>
{
    if (useFusion) {
        const shortSide = Math.min(canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        // unitsの座標をCanvas単位に変換 (一時的)
        layer.units.forEach(u => {
            u.body.x = (u.body.x * shortSide) + centerX;
            u.body.y = (u.body.y * shortSide) + centerY;
            u.body.radius *= shortSide;
            // eyeも同様
        });

        // const path = buildFusionPath(layer);
        // context.fillStyle = color;
        // context.fill(path, 'nonzero');  // 塗りつぶし

        drawFusionPath(layer, color);

        // eye描画 (融合後重ね)
        layer.units.forEach(drawEye);

        // 元座標に戻す (必要なら)
        layer.units.forEach(u => {
            u.body.x = (u.body.x - centerX) / shortSide;
            u.body.y = (u.body.y - centerY) / shortSide;
            u.body.radius /= shortSide;
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
    } else {
        if (useMetaball)
        {
            drawLineCount = 0;
            drawMetaballLayer(layer, color);
            console.log(`Metaball lines drawn: ${drawLineCount}`);
            layer.units.forEach
            (
                (unit) =>
                {
                    drawCircle
                    (
                        {
                            x: unit.body.x,
                            y: unit.body.y,
                            radius: unit.body.radius *0.9,
                        },
                        color
                    );
                    //drawCircle(unit.body, "#88888888");
                    drawEye(unit);
                }
            );
        }
        else
        {
            layer.units.forEach
            (
                (unit) =>
                {
                    drawCircle(unit.body, color);
                    drawEye(unit);
                }
            );
        }
    }
};
const draw = () =>
{
    context.fillStyle = config.coloring[style].base;
    //context.globalCompositeOperation = "destination-out";
    context.fillRect(0, 0, canvas.width, canvas.height);
    //context.globalCompositeOperation = "source-over";
    drawLayer(Data.accent, config.coloring[style].accent);
    drawLayer(Data.main, config.coloring[style].main);
    //drawCircle({ x: 0, y: 0, radius: 0.1, }, config.coloring[style].main);
    //drawCircle({ x: 0, y: 0, radius: 0.05, }, config.coloring[style].base);
    //drawCircle({ x: 0, y: 0, radius: 0.025, }, config.coloring[style].accent);
};
if (context)
{
    const step = (timestamp: number) =>
    {
        updateData(timestamp);
        draw();
        if (fpsDiv && fpsDiv.style.display !== "none")
        {
            Fps.step(timestamp);
            fpsDiv.innerText = Fps.getText();
        }
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
    console.log("Canvas initialized.");
}
else
{
    console.error("Failed to get 2D context.");
}
if (document.fullscreenEnabled || (<any>document).webkitFullscreenEnabled)
{
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("f" === event.key.toLowerCase())
            {
                const elem = document.documentElement;
                if (document.fullscreenEnabled)
                {
                    if ( ! document.fullscreenElement)
                    {
                        elem.requestFullscreen();
                    }
                    else
                    {
                        document.exitFullscreen();
                    }
                }
                else
                {
                    if ((<any>document).webkitFullscreenEnabled)
                    {
                        if ( ! (<any>document).webkitFullscreenElement)
                        {
                            (<any>elem).webkitRequestFullscreen();
                        }
                        else
                        {
                            (<any>document).webkitExitFullscreen();
                        }
                    }
                }
            }
        }
    );
}
if (fpsDiv)
{
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("s" === event.key.toLowerCase())
            {
                if ("none" === fpsDiv.style.display)
                {
                    fpsDiv.style.display = "block";
                }
                else
                {
                    fpsDiv.style.display = "none";
                }
            }
        }
    );
}
document.addEventListener
(
    "click",
    () =>
    {
        // const keys = Object.keys(config.coloring) as (keyof typeof config["coloring"])[];
        // const currentIndex = keys.indexOf(style);
        // const nextIndex = (currentIndex + 1) %keys.length;
        // style = keys[nextIndex];
        if ( ! useFusion && ! useMetaball)
        {
            useFusion = true;
        }
        else
        if (useFusion)
        {
            useFusion = false;
            useMetaball = true;
        }
        else
        {
            useMetaball = false;
        }
    }
);
export class ToggleClassForWhileTimer
{
    timer: ReturnType<typeof setTimeout> | undefined;
    constructor()
    {
        this.timer = undefined;
    }
    start(element: HTMLElement, token: string, span: number, onEnd?: () => unknown)
    {
        if (this.isInTimer())
        {
            clearTimeout(this.timer);
        }
        element.classList.toggle(token, true);
        this.timer = setTimeout
        (
            () =>
            {
                // if (config.log["ToggleClassForWhileTimer.Timeout"])
                // {
                //     console.log("⌛️ ToggleClassForWhileTimer.Timeout", element, token, span);
                // }
                this.timer = undefined;
                element.classList.toggle(token, false);
                onEnd?.();
            },
            span
        );
    }
    isInTimer = () => undefined !== this.timer;
}
const mouseMoveTimer = new ToggleClassForWhileTimer();
export const mousemove = () =>
    mouseMoveTimer.start(document.body, "mousemove", 3000);
document.addEventListener
(
    "mousemove",
    (_event) =>
    {
        mousemove();
    }
);
