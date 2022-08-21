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
define("ParalaxBackground", ["require", "exports", "Animator", "GameObject", "Main", "Rect"], function (require, exports, Animator_1, GameObject_1, Main_1, Rect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParalaxBackground = void 0;
    class ParalaxBackground extends GameObject_1.GameObject {
        constructor() {
            super("ParalaxBackground", null, null);
            this.backgrounds = [];
            this.position = 0;
            this.Init();
        }
        Init() {
            const amountOfBackgrounds = 2;
            for (var i = 0; i < amountOfBackgrounds; i++) {
                this.backgrounds.push(new GameObject_1.GameObject("Background: " + i, new Rect_1.Rect(i * Main_1.canvas.width / Main_1.renderScale, 0, Main_1.canvas.width / Main_1.renderScale * 1.3, Main_1.canvas.height / Main_1.renderScale * 1.3), new Animator_1.Animator([{ imageID: "background", stateName: "Day" }])));
            }
        }
        Update() {
            const paralaxScale = 0.3;
            for (var i = 0; i < this.backgrounds.length; i++) {
                this.backgrounds[i].rect.x -= (Main_1.pipes.GetCurrentSpeed() * paralaxScale * (1 / Main_1.fps));
            }
            for (var i = 0; i < this.backgrounds.length; i++) {
                if (this.backgrounds[i].rect.x + this.backgrounds[i].rect.width < 0) {
                    var maxPos = -99999999999;
                    for (var p = 0; p < this.backgrounds.length; p++) {
                        maxPos = Math.max(this.backgrounds[p].rect.x + this.backgrounds[p].rect.width, maxPos);
                    }
                    this.backgrounds[i].rect.x = Math.floor(maxPos);
                }
            }
        }
        Render() {
            for (var i = 0; i < this.backgrounds.length; i++) {
                this.backgrounds[i].Render();
            }
        }
    }
    exports.ParalaxBackground = ParalaxBackground;
});
define("Pipes", ["require", "exports", "Animator", "GameObject", "Main", "Rect"], function (require, exports, Animator_2, GameObject_2, Main_2, Rect_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pipes = void 0;
    const maxHole = 175;
    const minHole = 175;
    class Pipes extends GameObject_2.GameObject {
        constructor() {
            super("Pipes");
            this.pipesObjects = [];
            this.GeneratePipe();
        }
        GeneratePipe() {
            var bottomPipe = new GameObject_2.GameObject("Bottom pipe", new Rect_2.Rect(Main_2.canvas.width / Main_2.renderScale, 0, 39, 240), new Animator_2.Animator([{ imageID: "pipe_up", stateName: "Static" }]));
            var topPipe = new GameObject_2.GameObject("Top pipe", new Rect_2.Rect(Main_2.canvas.width / Main_2.renderScale, 0, 38, 240), new Animator_2.Animator([{ imageID: "pipe_down", stateName: "Static" }]));
            var randomHeight = Math.random() * (maxHole - minHole) + minHole;
            var randomY = Math.random() * (Main_2.canvas.height / Main_2.renderScale - randomHeight);
            bottomPipe.rect.y = randomY - bottomPipe.rect.height;
            topPipe.rect.y = randomHeight + randomY;
            this.pipesObjects.push(bottomPipe);
            this.pipesObjects.push(topPipe);
        }
        Update() {
            for (var i = 0; i < this.pipesObjects.length; i++) {
                this.pipesObjects[i].rect.x -= this.GetCurrentSpeed() * (1 / Main_2.fps);
                if (this.pipesObjects[i].rect.AABBCollision(Main_2.bird.rect) === true) {
                    Main_2.bird.Die();
                }
            }
            if (this.pipesObjects[0].rect.x + this.pipesObjects[0].rect.width < 0) {
                this.pipesObjects.shift();
                this.pipesObjects.shift();
                Main_2.score.AddPoint();
                this.GeneratePipe();
            }
        }
        GetCurrentSpeed() {
            if ((0, Main_2.GetGameState)() == Main_2.GameState.Waiting)
                return 0;
            const speedDouble = 1;
            return 100 + (2 / speedDouble) * Main_2.score.GetScore();
        }
        Render() {
            for (var i = 0; i < this.pipesObjects.length; i++) {
                this.pipesObjects[i].Render();
            }
        }
    }
    exports.Pipes = Pipes;
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
define("TextUI", ["require", "exports", "GameObject", "Main", "Vector"], function (require, exports, GameObject_3, Main_3, Vector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextUI = void 0;
    var fontImage = document.getElementById("font");
    const letterWidth = 14;
    const letterHeight = 16;
    const spaceLetterWidth = 18;
    const spaceLetterHeight = 3;
    const lettersInRow = 10;
    const charString = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,?!:-+♥';
    const charArr = charString.split('');
    class TextUI extends GameObject_3.GameObject {
        constructor(text, rect) {
            super("TextUI", rect, null);
            this.AssignText(text);
        }
        AssignText(text) {
            var tempText = text.split(/\r?\n/);
            this.text = new Array(tempText.length);
            for (var i = 0; i < tempText.length; i++) {
                this.text[i] = tempText[i].split('');
            }
        }
        Render() {
            var textHeight = 0;
            for (var y = 0; y < this.text.length; y++) {
                var textLine = this.text[y];
                textHeight = (letterHeight + spaceLetterHeight) * y;
                var textWidth = 0;
                for (var x = 0; x < textLine.length; x++) {
                    var index = charArr.findIndex((char) => char === textLine[x]);
                    if (textLine[x] === " ") {
                        textWidth += spaceLetterWidth;
                        continue;
                    }
                    if (index === -1)
                        index = 64;
                    var charPosition = new Vector_1.Vector((index % lettersInRow) * (letterWidth + spaceLetterWidth), Math.floor(index / lettersInRow) * (letterHeight + spaceLetterHeight));
                    this.RenderLetter(charPosition, Vector_1.Vector.Add(new Vector_1.Vector(textWidth, textHeight), new Vector_1.Vector(this.rect.x, this.rect.y)));
                    textWidth += letterWidth + 1;
                }
            }
        }
        RenderLetter(charImagePosition, charCanvasPosition) {
            Main_3.ctx.drawImage(fontImage, charImagePosition.x, charImagePosition.y, letterWidth, letterHeight, charCanvasPosition.x, Main_3.ctx.canvas.height - charCanvasPosition.y - letterHeight, letterWidth, letterHeight);
        }
        Update() { }
    }
    exports.TextUI = TextUI;
});
define("Score", ["require", "exports", "Rect", "TextUI"], function (require, exports, Rect_3, TextUI_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Score = void 0;
    class Score extends TextUI_1.TextUI {
        constructor(x, y, points) {
            super("score: 0", new Rect_3.Rect(x, y, 0, 0));
            this.points = 0;
            this.points = points || this.points;
        }
        AddPoint() {
            this.points += 1;
            this.AssignText("score: " + this.points.toString());
        }
        GetScore() {
            return this.points;
        }
    }
    exports.Score = Score;
});
define("Main", ["require", "exports", "Bird", "ParalaxBackground", "Pipes", "Score"], function (require, exports, Bird_1, ParalaxBackground_1, Pipes_1, Score_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StopGame = exports.StartGame = exports.GetGameState = exports.GameState = exports.score = exports.bird = exports.pipes = exports.background = exports.fps = exports.renderScale = exports.ctx = exports.canvas = void 0;
    exports.canvas = document.getElementById("canvas");
    exports.ctx = exports.canvas.getContext("2d");
    if (exports.ctx === undefined || exports.ctx === null)
        throw new Error("2D context isn't found");
    exports.ctx.imageSmoothingQuality = "low";
    exports.ctx.imageSmoothingEnabled = false;
    exports.renderScale = 2;
    exports.fps = 45;
    exports.background = new ParalaxBackground_1.ParalaxBackground();
    exports.pipes = new Pipes_1.Pipes();
    exports.bird = new Bird_1.Bird();
    exports.score = new Score_1.Score(10, exports.canvas.height - 26);
    var GameState;
    (function (GameState) {
        GameState[GameState["Waiting"] = 0] = "Waiting";
        GameState[GameState["Flying"] = 1] = "Flying";
    })(GameState = exports.GameState || (exports.GameState = {}));
    var gameState = GameState.Waiting;
    function GetGameState() { return gameState; }
    exports.GetGameState = GetGameState;
    function StartGame() {
        exports.bird = new Bird_1.Bird();
        exports.pipes = new Pipes_1.Pipes();
        exports.score = new Score_1.Score(10, exports.canvas.height - 26);
        gameState = GameState.Flying;
    }
    exports.StartGame = StartGame;
    function StopGame() { gameState = GameState.Waiting; }
    exports.StopGame = StopGame;
    function Update() {
        Render();
        exports.bird.Update();
        exports.pipes.Update();
        exports.background.Update();
    }
    function Render() {
        if (exports.ctx === undefined || exports.ctx === null)
            return;
        exports.ctx.clearRect(0, 0, exports.canvas.width, exports.canvas.height);
        exports.background.Render();
        exports.pipes.Render();
        exports.bird.Render();
        exports.score.Render();
    }
    setInterval(() => Update(), 1 / exports.fps * 1000);
});
define("GameObject", ["require", "exports", "Main", "Vector"], function (require, exports, Main_4, Vector_2) {
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
            Main_4.ctx.save();
            Main_4.ctx.rotate(this.rotation * Math.PI / 180);
            var pos = new Vector_2.Vector(this.rect.x, Main_4.canvas.height / Main_4.renderScale - (this.rect.y + this.rect.height));
            var unRotatedPos = Vector_2.Vector.Rotate(pos, new Vector_2.Vector(-this.rect.width / 2, -this.rect.height / 2), -this.rotation);
            Main_4.ctx.drawImage(this.animator.currentImage, unRotatedPos.x * Main_4.renderScale, unRotatedPos.y * Main_4.renderScale, this.rect.width * Main_4.renderScale, this.rect.height * Main_4.renderScale);
            Main_4.ctx.restore();
        }
    }
    exports.GameObject = GameObject;
});
define("Bird", ["require", "exports", "Animator", "GameObject", "Main", "Rect"], function (require, exports, Animator_3, GameObject_4, Main_5, Rect_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bird = void 0;
    class Bird extends GameObject_4.GameObject {
        constructor() {
            var animator = new Animator_3.Animator([
                { imageID: "bird_glide", stateName: "Glide" },
                { imageID: "bird_fall", stateName: "Fall" },
                { imageID: "bird_jump", stateName: "Jump" }
            ]);
            super("bird", new Rect_4.Rect(Main_5.canvas.width / Main_5.renderScale * 0.2 - 10, Main_5.canvas.height / Main_5.renderScale / 2 - 10, 20, 20), animator);
            this.yVelocity = 0;
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
            if ((0, Main_5.GetGameState)() == Main_5.GameState.Waiting)
                (0, Main_5.StartGame)();
            this.yVelocity += 150;
            this.jumped = true;
        }
        Die() {
            (0, Main_5.StopGame)();
        }
        Update() {
            super.Update();
            if ((0, Main_5.GetGameState)() == Main_5.GameState.Waiting)
                return;
            this.rect.y = Math.max(0, this.rect.y + this.yVelocity * (1 / Main_5.fps));
            this.rect.y = Math.min(Main_5.canvas.height / Main_5.renderScale - this.rect.height, this.rect.y);
            this.yVelocity -= 150 * (1 / Main_5.fps);
            if (this.rect.y <= 0)
                this.yVelocity = 0;
            if (this.rect.y >= Main_5.canvas.height / Main_5.renderScale - this.rect.height)
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
