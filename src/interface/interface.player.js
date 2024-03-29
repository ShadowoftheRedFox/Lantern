/// <reference path="../../ts/type.d.ts"/>

class GamePlayer extends GameInterfaces {
    /**
     * @param {GameScope} scope 
     */
    constructor(scope) {
        super({
            asOwnCanvas: true,
            zindex: ConfigConst.ZINDEX.ENTITIES,
            canvasGroup: "GameEntitiesGroup",
            activated: true,
            needsUpdate: true,
            resized: true
        }, scope);

        // pos in % relativ to the current dimension, not in px
        this.px = 0.2;
        this.py = 0.2;

        // pos in px
        this.x = 0;
        this.y = 0;

        this.diagonaleSpeed = Math.SQRT2 / 2 * 5;
        this.playerRadius = 10;

        /**@type {Light[]} */
        this.lightSources = [];
        /**@type {GameObject[]} */
        this.object = [];

        /**@type {number[]} */
        this.lightsSwitchedOff = [];
        /**@type {{[key:string]: number}} */
        this.timeOut = {
            b: 0
        };

        /**
         * Amount of pixels between two point around the light aura.
         * 
         * Must be a positiv integer and non zero!
         * @type {number}
         */
        this.graphicQuality = 3;

        this.debug = false;
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

        // render all objects
        this.object.forEach(object => {
            this.rotatePoints(object.points, this.degToradiant(1), object.x + object.w / 2, object.y + object.h / 2);
            ctx.fillStyle = object.color;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(object.points.last(0).x, object.points.last(0).y);
            object.points.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            if (this.debug) {
                object.points.forEach(point => {
                    this.circle(ctx, point.x, point.y);
                });
                this.circle(ctx, object.x, object.y);
            }
        });

        // render all light sources
        this.lightSources.forEach(light => {
            if (!this.lightsSwitchedOff.includes(light.id)) {
                const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
                gradient.addColorStop(0, light.color);
                gradient.addColorStop(1, this.debug ? "red" : "#ffb00000");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                if (light.render[0]) {
                    ctx.moveTo(light.render[0].x, light.render[0].y);
                } else {
                    ctx.moveTo(light.points[0].x, light.points[0].y);
                }
                for (let i = 0; i < light.points.length; i++) {
                    if (light.render[i]) {
                        ctx.lineTo(light.render[i].x, light.render[i].y);
                    } else {
                        ctx.lineTo(light.points[i].x, light.points[i].y);
                    }
                }
                if (light.render[0]) {
                    ctx.moveTo(light.render[0].x, light.render[0].y);
                } else {
                    ctx.moveTo(light.points[0].x, light.points[0].y);
                }
                ctx.fill();
                ctx.closePath();
            }

            if (this.debug) {
                for (let i = 0; i < light.points.length; i++) {
                    if (light.render[i]) {
                        this.circle(ctx, light.render[i].x, light.render[i].y);
                    } else {
                        this.circle(ctx, light.points[i].x, light.points[i].y);
                    }
                }
                this.circle(ctx, light.x, light.y);
            }
        });

        // render player
        ctx.fillStyle = "grey";
        if (this.debug) ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.playerRadius * 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;

        // things after this will be cleared once the condition is false
        this.needsUpdate = false;

        if (MouseTrackerManager.holding) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            const v = MouseTrackerManager.getCursorVector(0).normalize();
            const s = MouseTrackerManager.getClickSpawn(0);
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + v.getX() * 40, s.y + v.getY() * 40);
            ctx.stroke();
            ctx.closePath();
            this.needsUpdate = true;
        }
    }

    /**
     * @param {GameScope} scope 
     */
    update(scope) {
        if (this.resized === true) {
            // re position the player
            this.x = Math.floor(scope.w * this.px);
            this.y = Math.floor(scope.h * this.py);

            // re position every light sources
            this.lightSources.forEach(light => {
                this.moveLight(light, Math.floor(scope.w * light.px), Math.floor(scope.h * light.py));
                light.points.forEach((point, id) => {
                    light.render[id] = this.circleInter(light, point);
                });
            });

            // re position every objects
            this.object.forEach(obj => {
                this.moveObject(obj, Math.floor(scope.w * obj.px), Math.floor(scope.h * obj.py));
            });

            this.resized = false;
        }

        //TODO change to vectorial movement
        //TODO implement mobile movement
        // player movement
        let up = false, down = false, left = false, right = false, run = false;
        if (KeyboardTrackerManager.pressed(GameConfig.keyboard.run)) {
            run = true;
        }
        let speed = 5 * (run ? 2 : 1);
        if (KeyboardTrackerManager.pressed(GameConfig.keyboard.up)) {
            up = true;
        }
        if (KeyboardTrackerManager.pressed(GameConfig.keyboard.down)) {
            down = true;
        }
        if (KeyboardTrackerManager.pressed(GameConfig.keyboard.right)) {
            right = true;
        }
        if (KeyboardTrackerManager.pressed(GameConfig.keyboard.left)) {
            left = true;
        }
        if (this.xor(up, down) && this.xor(left, right)) {
            speed = this.diagonaleSpeed * (run ? 2 : 1);
        }
        if (KeyboardTrackerManager.pressed(["b"]) && this.timeOut.b + 500 <= Date.now()) {
            this.debug = !this.debug;
            this.timeOut.b = Date.now();
        }

        // do the mouse movement if not moving by keyboard
        if (MouseTrackerManager.holding && !(up || down || left || right)) {
            var v = MouseTrackerManager.getCursorVector(0);
            // make it so the speed increase the farthest the cursor is form the spawn
            let max = (v.length().clamp(0, 40)) / 40;
            v = v.normalize();
            let speedX = v.getX() * 5 * (run ? 2 : 1) * max;
            let lightMoveX = v.getX() * this.playerRadius * 3;
            let speedY = v.getY() * 5 * (run ? 2 : 1) * max;
            let lightMoveY = v.getY() * this.playerRadius * 3;
            this.x += speedX;
            this.y += speedY;

            // move the player light accordingly to the player
            const playerLight = this.getLightById(0);
            this.moveLight(playerLight, this.x + lightMoveX, this.y + lightMoveY);
            // update relativ pos of the player light
            playerLight.px = playerLight.x / scope.w;
            playerLight.py = playerLight.y / scope.h;

            this.needsUpdate = true;
        }

        if (up || down || left || right) {
            let speedX = 0;
            let speedY = 0;
            if (left) {
                this.x -= speed;
                speedX = - this.playerRadius * 3;
            }
            if (right) {
                this.x += speed;
                speedX = + this.playerRadius * 3;
            }
            if (up) {
                this.y -= speed;
                speedY = - this.playerRadius * 3;
            }
            if (down) {
                this.y += speed;
                speedY = + this.playerRadius * 3;
            }

            // move the player light accordingly to the player
            const playerLight = this.getLightById(0);
            this.moveLight(playerLight, this.x + speedX, this.y + speedY);
            // update relativ pos of the player light
            playerLight.px = playerLight.x / scope.w;
            playerLight.py = playerLight.y / scope.h;

            this.needsUpdate = true;

            //TODO make obstacle, that the player can't cross (or can), and light will be changed (can cross or not)
        }

        // put the first light
        if (this.lightSources.length === 0) {
            this.lightSources.push({
                x: this.x + this.playerRadius * 3,
                y: this.y + this.playerRadius * 3,
                px: 0.5,
                py: 0.5,
                radius: 150,
                color: "#ffe055b0",
                id: this.lightSources.length,
                points: this.getPointsPosInCircle(150, this.x + this.playerRadius * 3, this.y + this.playerRadius * 3),
                render: [],
                on: true
            });

            this.lightSources.push({
                x: scope.w / 2,
                y: scope.h / 2,
                px: 0.5,
                py: 0.5,
                radius: 150,
                color: "#ffe055b0",
                id: this.lightSources.length,
                points: this.getPointsPosInCircle(150, scope.w / 2, scope.h / 2),
                render: [],
                on: true
            });
        }

        // put the first object
        if (this.object.length === 0) {
            this.constructObject(4 * scope.w / 5, 4 * scope.h / 5, { size: 80, w: 100, h: 20 }, "rectangle", false, true, "grey", this.degToradiant(45));
        }

        // detect collision with player
        this.lightSources.forEach(light => {
            // only check close enough light
            if (light.on === true && this.argument(this.x, this.y, light.x, light.y) <= light.radius + this.playerRadius * 2) {
                //switch off the light is the player is on it
                if (this.pointArg(this, light) <= this.playerRadius * 1.5) {
                    this.lightsSwitchedOff.push(light.id);
                } else {
                    this.lightsSwitchedOff.splice(this.lightsSwitchedOff.indexOf(light.id), 1);
                    light.points.forEach((point, id) => {
                        light.render[id] = this.circleInter(light, point);
                    });
                }
            }
        });

        //TODO collisiosn with objects (light and player)

        // debugger;

        this.x = this.x.clamp(this.playerRadius * 2, scope.w - this.playerRadius * 2);
        this.y = this.y.clamp(this.playerRadius * 2, scope.h - this.playerRadius * 2);

        this.px = this.x / scope.w;
        this.py = this.y / scope.h;
    }

    /**
     * @param {number} id 
     * @returns {Light | null} 
     */
    getLightById(id) {
        for (let i = 0; i < this.lightSources.length; i++) {
            if (this.lightSources[i].id == id) {
                return this.lightSources[i];
            }
        }
        return null;
    }

    moveLight(light, x, y) {
        let shiftX = light.x - x;
        let shiftY = light.y - y;
        light.x = x;
        light.y = y;

        // move the points by the difference in coos
        light.points.forEach(point => {
            point.x -= shiftX;
            point.y -= shiftY;
        });
    }

    moveObject(object, x, y) {
        let shiftX = object.x - x;
        let shiftY = object.y - y;
        object.x = x;
        object.y = y;

        // move the points by the difference in coos
        object.points.forEach(point => {
            point.x -= shiftX;
            point.y -= shiftY;
        });
    }

    xor(a, b) {
        return (a || b) && !(a && b);
    }

    pointInTriangle(x1, y1, x2, y2, x3, y3, x, y) {
        var denominator = ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
        var a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
        var b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
        var c = 1 - a - b;

        return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
    }

    getPointNumberFromCircle(radius) {
        return (Math.PI * radius) / this.graphicQuality;
    }

    getPointNumberFromLine(x, y, xp, yp) {
        return this.argument(x, y, xp, yp) / this.graphicQuality;
    }

    /**@param {Point[]} points*/
    getPointNumberFromForm(points) {
        if (points.length < 3) return 0;
        let distance = 0;

        points.forEach((point, id) => {
            if (id === points.length - 1) {
                distance += this.argument(point.x, point.y, points[0].x, points[0].y);
            } else {
                distance += this.argument(point.x, point.y, points[id + 1].x, points[id + 1].y);
            }
        });

        return Math.ceil(distance / this.graphicQuality);
    }

    argument(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    pointArg(p1, p2) {
        return this.argument(p1.x, p1.y, p2.x, p2.y);
    }

    getPointsPosInCircle(radius, x, y) {
        const pointsNumber = this.getPointNumberFromCircle(radius);
        const angle = (Math.PI * 2) / pointsNumber;
        const points = [];

        for (let i = 0; i < pointsNumber; i++) {
            points.push({
                x: Math.cos(angle * i) * radius + x,
                y: Math.sin(angle * i) * radius + y
            });
        }

        return points;
    }

    getPointsPosInRectangle(x, y, w, h) {
        var offset;
        const points = [];

        // top
        // from top left to top right
        offset = this.argument(x, y, x + w, y) / this.getPointNumberFromLine(x, y, x + w, y);
        for (let i = 0; i < this.getPointNumberFromLine(x, y, x + w, y); i++) {
            points.push({
                x: x + i * offset,
                y: y
            });
        }
        // corner
        points.push({ x: x + w, y: y });
        // left
        // from top right to down right
        offset = this.argument(x + w, y, x + w, y + h) / this.getPointNumberFromLine(x + w, y, x + w, y + h);
        for (let i = 0; i < this.getPointNumberFromLine(x + w, y, x + w, y + h); i++) {
            points.push({
                x: x + w,
                y: y + i * offset
            });
        }
        // corner
        points.push({ x: x + w, y: y + h });
        // down
        // from down right to down left
        offset = this.argument(x + w, y + h, x, y + h) / this.getPointNumberFromLine(x + w, y + h, x, y + h);
        for (let i = this.getPointNumberFromLine(x + w, y, x + w, y + h); i > 0; i--) {
            points.push({
                x: x + w - i * offset,
                y: y + h
            });
        }
        // corner
        points.push({ x: x, y: y + h });
        // right
        // from down left to top left
        offset = this.argument(x, y + h, x, y) / this.getPointNumberFromLine(x, y + h, x, y);
        for (let i = this.getPointNumberFromLine(x, y + h, x, y); i > 0; i--) {
            points.push({
                x: x,
                y: y + h - i * offset
            });
        }
        // corner
        points.push({ x: x, y: y });

        return points;
    }

    circle(ctx, x, y, radius = 2) {
        const old = ctx.fillStyle, alpha = ctx.globalAlpha;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = old;
        ctx.globalAlpha = alpha;
    }

    /**
     * Check if the segment from home to dest is crossing the circle.
     * @param {Point} home 
     * @param {Point} dest 
     * @param {Point} circleCenter 
     * @param {number} circleDiameter 
     * @returns {Point}
     */
    circleInter(home, dest, circleCenter = { x: this.x, y: this.y }, circleDiameter = this.playerRadius * 2) {
        const a = Math.pow((dest.x - home.x), 2) + Math.pow((dest.y - home.y), 2);
        const b = 2 * (((dest.x - home.x) * (home.x - circleCenter.x)) + ((dest.y - home.y) * (home.y - circleCenter.y)));
        const c = Math.pow(circleCenter.x, 2) + Math.pow(circleCenter.y, 2) + Math.pow(home.x, 2) + Math.pow(home.y, 2) - (2 * ((circleCenter.x * home.x) + (circleCenter.y * home.y))) - Math.pow(circleDiameter, 2);
        const max = this.pointArg(home, dest);


        var coef = b * b - 4 * a * c;
        var k1 = 0;
        var k2 = 0;

        var ptA = { x: 0, y: 0 };
        var ptB = { x: 0, y: 0 };

        if (coef == 0) {
            k1 = -b / (2 * a);
        } else if (coef > 0) {
            k1 = (-b - Math.sqrt(coef)) / (2 * a);
            k2 = (-b + Math.sqrt(coef)) / (2 * a);
        }
        // Si coef < 0, no points

        // On retourne le point le plus proche de "home"
        if (k1 != 0) {
            ptA = { x: home.x + (k1 * (dest.x - home.x)), y: home.y + (k1 * (dest.y - home.y)) };
            var distA = this.pointArg(home, ptA);
            var distDestA = this.pointArg(dest, ptA);

            if (k2 != 0) {
                ptB = { x: home.x + (k2 * (dest.x - home.x)), y: home.y + (k2 * (dest.y - home.y)) };
                var distB = this.pointArg(home, ptB);
                var distDestB = this.pointArg(dest, ptB);

                if (distA > distB && distDestB <= max) return ptB;
            }
            if (distDestA <= max) return ptA;
        }

        return { x: dest.x, y: dest.y };
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {{ size: number, w: number, h: number }} data 
     * @param {"rectangle"|"triangle"|"circle"} form 
     * @param {boolean} transparent 
     * @param {boolean} physical 
     * @param {string} color
     * @param {number} rotation
     */
    constructObject(x = 0, y = 0, data = { size: 1, w: 0, h: 0 }, form = "rectangle", transparent = false, physical = false, color = "grey", rotation = 0) {
        const o = {
            x: x,
            y: y,
            physical: physical,
            transparent: transparent,
            points: [],
            px: x / window.game.w,
            py: y / window.game.h,
            id: this.object.length,
            color: color,
            form: form,
            rotation: rotation,
            size: data.size | 1,
            w: data.w | 0,
            h: data.h | 0,
        };

        switch (form) {
            case "circle":
                o.points = this.getPointsPosInCircle(o.size / 2, x, y);
                break;
            case "rectangle":
                o.points = this.getPointsPosInRectangle(x, y, o.w, o.h);
                break;
            case "triangle":
                break;
            default:
                WindowManager.fatal(new Error(`Unknown form "${form}"`));
                break;
        }

        this.rotatePoints(o.points, rotation, x + o.w / 2, y + o.h / 2);

        this.object.push(o);
    }

    /**
     * @param {{x:number, y:number}[]} points 
     * @param {number} angle in radiant 
     * @param {number} center_x
     * @param {number} center_y
     */
    rotatePoints(points, angle, center_x, center_y) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        let xnew = 0;
        let ynew = 0;
        points.forEach(p => {
            // translate point back to origin:
            p.x -= center_x;
            p.y -= center_y;

            // rotate point
            xnew = p.x * c - p.y * s;
            ynew = p.x * s + p.y * c;

            // translate point back:
            p.x = xnew + center_x;
            p.y = ynew + center_y;
        });
    }

    degToradiant(angle) {
        return (angle / 360) * Math.PI * 2;
    }

    randiantToDeg(angle) {
        return (angle / Math.PI * 2) * 360;
    }
}