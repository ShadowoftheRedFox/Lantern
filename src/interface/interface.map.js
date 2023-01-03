/// <reference path="../../ts/type.d.ts"/>

class GameMapInterface extends GameInterfaces {
    /**
     * @param {GameScope} scope
     */
    constructor(scope) {
        super({
            asOwnCanvas: true,
            zindex: ConfigConst.ZINDEX.MAP,
            canvasGroup: "GameMapGroup",
            activated: true
        }, scope);

        this.grideSquareSize = 40;
    }

    /**
     * @param {GameScope} scope
     */
    render(scope) {
        /**@type {CanvasRenderingContext2D} */
        const ctx = scope.cache.context[this.canvasGroup];
        const Width = scope.w | 0;
        const Height = scope.h | 0;

        ctx.clearRect(0, 0, Width, Height);

        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        for (let x = 0; x <= Width + this.grideSquareSize; x += this.grideSquareSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Height);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        for (let y = 0; y <= Height + this.grideSquareSize; y += this.grideSquareSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(Width, y);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        ctx.font = `${Math.floor(this.grideSquareSize / 4)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(this.grideSquareSize, this.grideSquareSize / 2, 1);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(this.grideSquareSize, 1, this.grideSquareSize / 2);

        this.needsUpdate = false;
    }

    /**
     * @param {GameScope} scope
     */
    update(scope) {
        return;
    }
}