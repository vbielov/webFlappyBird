import { Animator } from "./Animator";
import { Bird } from "./Bird";
import { GameObject } from "./GameObject";
import { ParalaxBackground } from "./ParalaxBackground";
import { Pipes } from "./Pipes";
import { Rect } from "./Rect";
import { Score } from "./Score";

// Getting canvas to draw on it
export const canvas = <HTMLCanvasElement> document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
if(ctx === undefined || ctx === null) throw new Error("2D context isn't found");
ctx.imageSmoothingQuality = "low";
ctx.imageSmoothingEnabled = false;
export const renderScale = 2;
export const fps = 45;

export var background = new ParalaxBackground();
export var pipes = new Pipes();
export var bird = new Bird();
export var score = new Score(10, canvas.height - 26);

function Update()
{
    if(bird.IsAlive() === false) return;
    Render();
    bird.Update();
    pipes.Update();
    background.Update();
}

function Render()
{
    if(ctx === undefined || ctx === null) return;

    // Clearing canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.Render();
    pipes.Render();
    bird.Render();
    score.Render();
}

setInterval(() => Update(), 1 / fps * 1000);