define("Animator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Animator = void 0;
    class Animator {
        constructor(imageIDs) {
            this.currentImage = null;
            this.images = {};
            for (var i = 0; i < imageIDs.length; i++) {
                this.images[imageIDs[i].stateName] = Animator.LoadImage(imageIDs[i].imageID);
            }
            this.currentImage = this.images[imageIDs[0].stateName];
        }
        static LoadImage(imageID) {
            return document.getElementById(imageID);
        }
        Play(name) {
            this.currentImage = this.images[name];
        }
    }
    exports.Animator = Animator;
});
define("Rect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rect = void 0;
    class Rect {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        AABBCollision(rect) {
            if (this.x + this.width > rect.x &&
                this.x < rect.x + rect.width &&
                this.y + this.height > rect.y &&
                this.y < rect.y + rect.height)
                return true;
            return false;
        }
    }
    exports.Rect = Rect;
});
define("Pipes", ["require", "exports", "Animator", "GameObject", "Main", "Rect"], function (require, exports, Animator_1, GameObject_1, Main_1, Rect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pipes = void 0;
    const maxHole = 175;
    const minHole = 175;
    const speed = 100;
    class Pipes extends GameObject_1.GameObject {
        constructor() {
            super("Pipes");
            this.pipesObjects = [];
            this.GeneratePipe();
        }
        GeneratePipe() {
            var bottomPipe = new GameObject_1.GameObject("Bottom pipe", new Rect_1.Rect(Main_1.canvas.width / Main_1.renderScale, 0, 39, 240), new Animator_1.Animator([{ imageID: "pipe_up", stateName: "Static" }]));
            var topPipe = new GameObject_1.GameObject("Top pipe", new Rect_1.Rect(Main_1.canvas.width / Main_1.renderScale, 0, 38, 240), new Animator_1.Animator([{ imageID: "pipe_down", stateName: "Static" }]));
            var randomHeight = Math.random() * (maxHole - minHole) + minHole;
            var randomY = Math.random() * (Main_1.canvas.height / Main_1.renderScale - randomHeight);
            bottomPipe.rect.y = randomY - bottomPipe.rect.height;
            topPipe.rect.y = randomHeight + randomY;
            this.pipesObjects.push(bottomPipe);
            this.pipesObjects.push(topPipe);
        }
        Update() {
            for (var i = 0; i < this.pipesObjects.length; i++) {
                this.pipesObjects[i].rect.x -= speed * (1 / Main_1.fps);
                if (this.pipesObjects[i].rect.AABBCollision(Main_1.bird.rect) === true) {
                    Main_1.bird.Die();
                }
            }
            if (this.pipesObjects[0].rect.x + this.pipesObjects[0].rect.width < 0) {
                this.pipesObjects.shift();
                this.pipesObjects.shift();
                this.GeneratePipe();
            }
        }
        Render() {
            for (var i = 0; i < this.pipesObjects.length; i++) {
                this.pipesObjects[i].Render();
            }
        }
    }
    exports.Pipes = Pipes;
});
define("Main", ["require", "exports", "Animator", "Bird", "GameObject", "Pipes", "Rect"], function (require, exports, Animator_2, Bird_1, GameObject_2, Pipes_1, Rect_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bird = exports.fps = exports.renderScale = exports.ctx = exports.canvas = void 0;
    exports.canvas = document.getElementById("canvas");
    exports.ctx = exports.canvas.getContext("2d");
    if (exports.ctx === undefined || exports.ctx === null)
        throw new Error("2D context isn't found");
    exports.ctx.imageSmoothingQuality = "low";
    exports.ctx.imageSmoothingEnabled = false;
    exports.renderScale = 2;
    exports.fps = 45;
    var background = new GameObject_2.GameObject("background", new Rect_2.Rect(0, 0, exports.canvas.width / exports.renderScale, exports.canvas.height / exports.renderScale), new Animator_2.Animator([{ imageID: "background", stateName: "Day" }]));
    var pipes = new Pipes_1.Pipes();
    exports.bird = new Bird_1.Bird();
    function Update() {
        if (exports.bird.IsAlive() === false)
            return;
        Render();
        exports.bird.Update();
        pipes.Update();
    }
    function Render() {
        if (exports.ctx === undefined || exports.ctx === null)
            return;
        exports.ctx.clearRect(0, 0, exports.canvas.width, exports.canvas.height);
        background.Render();
        pipes.Render();
        exports.bird.Render();
    }
    setInterval(() => Update(), 1 / exports.fps * 1000);
});
define("Vector", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector = void 0;
    class Vector {
        constructor(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
        static Add(v1, v2) {
            return new Vector(v1.x + v2.x, v1.y + v2.y);
        }
        static Sub(v1, v2) {
            return new Vector(v1.x - v2.x, v1.y - v2.y);
        }
        static Multiply(vector, value) {
            return new Vector(vector.x * value, vector.y * value);
        }
        static Divide(vector, value) {
            return new Vector(vector.x / value, vector.y / value);
        }
        static DotProduct(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        }
        static Length(vector) {
            return Math.sqrt(this.DotProduct(vector, vector));
        }
        static Normilized(vector) {
            return this.Divide(vector, this.Length(vector));
        }
        static Distance(v1, v2) {
            return this.Length(this.Sub(v1, v2));
        }
        static Lerp(a, b, t) {
            return this.Add(a, this.Multiply(this.Sub(b, a), this.Clamp01(t)));
        }
        static Clamp01(n) {
            n = Math.max(0, n);
            return Math.min(n, 1);
        }
        toString() {
            return "x: " + Math.floor(this.x) + " y: " + Math.floor(this.y);
        }
        static Rotate(v, origin, degree) {
            var rad = degree * Math.PI / 180;
            var vec = Vector.Sub(v, origin);
            return new Vector(vec.x * Math.cos(rad) - vec.y * Math.sin(rad) + origin.x, vec.x * Math.sin(rad) + vec.y * Math.cos(rad) + origin.y);
        }
    }
    exports.Vector = Vector;
});
define("GameObject", ["require", "exports", "Main", "Vector"], function (require, exports, Main_2, Vector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GameObject = void 0;
    class GameObject {
        constructor(name, rect, animator) {
            this.name = "new GameObject";
            this.rect = null;
            this.animator = null;
            this.rotation = 0;
            this.name = name || this.name;
            this.rect = rect || this.rect;
            if (animator === undefined || animator === null)
                this.animator = null;
            else
                this.animator = animator;
        }
        Update() {
        }
        Render() {
            if (this.animator === null || this.animator.currentImage === null)
                return;
            Main_2.ctx.save();
            Main_2.ctx.rotate(this.rotation * Math.PI / 180);
            var pos = new Vector_1.Vector(this.rect.x, Main_2.canvas.height / Main_2.renderScale - (this.rect.y + this.rect.height));
            var unRotatedPos = Vector_1.Vector.Rotate(pos, new Vector_1.Vector(-this.rect.width / 2, -this.rect.height / 2), -this.rotation);
            Main_2.ctx.drawImage(this.animator.currentImage, unRotatedPos.x * Main_2.renderScale, unRotatedPos.y * Main_2.renderScale, this.rect.width * Main_2.renderScale, this.rect.height * Main_2.renderScale);
            Main_2.ctx.restore();
        }
    }
    exports.GameObject = GameObject;
});
define("Bird", ["require", "exports", "Animator", "GameObject", "Main", "Rect"], function (require, exports, Animator_3, GameObject_3, Main_3, Rect_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bird = void 0;
    class Bird extends GameObject_3.GameObject {
        constructor() {
            var animator = new Animator_3.Animator([
                { imageID: "bird_glide", stateName: "Glide" },
                { imageID: "bird_fall", stateName: "Fall" },
                { imageID: "bird_jump", stateName: "Jump" }
            ]);
            super("bird", new Rect_3.Rect(Main_3.canvas.width / Main_3.renderScale * 0.2 - 10, Main_3.canvas.height / Main_3.renderScale / 2 - 10, 20, 20), animator);
            this.yVelocity = 0;
            this.alive = true;
            const birdReference = this;
            document.addEventListener("keydown", (event) => Bird.OnKeyDown(event, birdReference), false);
            document.addEventListener("touchstart", () => birdReference.Jump(), false);
        }
        static OnKeyDown(event, bird) {
            if (event.key === " " || event.code === "Space" || event.keyCode === 32) {
                bird.Jump();
            }
        }
        Jump() {
            this.yVelocity += 150;
            this.jumped = true;
        }
        IsAlive() {
            return this.alive;
        }
        Die() {
            this.alive = false;
        }
        Update() {
            super.Update();
            this.rect.y = Math.max(0, this.rect.y + this.yVelocity * (1 / Main_3.fps));
            this.rect.y = Math.min(Main_3.canvas.height / Main_3.renderScale - this.rect.height, this.rect.y);
            this.yVelocity -= 150 * (1 / Main_3.fps);
            if (this.rect.y <= 0)
                this.yVelocity = 0;
            if (this.rect.y >= Main_3.canvas.height / Main_3.renderScale - this.rect.height)
                this.yVelocity = Math.min(0, this.yVelocity);
            const velocityRange = 70;
            var effect = this.yVelocity / velocityRange;
            effect = Bird.clamp(effect, -1, 1);
            const maxDegree = 20;
            this.rotation = effect * -maxDegree;
            var state = this.GetState();
            if (state !== this.currentState) {
                this.animator.Play(state);
                this.currentState = state;
            }
            if (this.jumped === true)
                this.jumped = false;
        }
        static clamp(number, min, max) {
            return Math.max(min, Math.min(number, max));
        }
        GetState() {
            if (Date.now() / 1000 < this.lockedTill)
                return this.currentState;
            if (this.jumped === true)
                return this.LockState("Jump", 0.3);
            if (this.yVelocity < -20)
                return "Fall";
            return "Glide";
        }
        LockState(state, time) {
            this.lockedTill = Date.now() / 1000 + time;
            return state;
        }
    }
    exports.Bird = Bird;
});
define("ParalaxBackground", ["require", "exports", "GameObject"], function (require, exports, GameObject_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParalaxBackground = void 0;
    class ParalaxBackground extends GameObject_4.GameObject {
    }
    exports.ParalaxBackground = ParalaxBackground;
});
