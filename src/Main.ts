import { Animator } from "./Animator";
import { Bird } from "./Bird";
import { GameObject } from "./GameObject";
import { Pipes } from "./Pipes";
import { Rect } from "./Rect";

// Getting canvas to draw on it
export const canvas = <HTMLCanvasElement> document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
if(ctx === undefined || ctx === null) throw new Error("2D context isn't found");
ctx.imageSmoothingQuality = "low";
ctx.imageSmoothingEnabled = false;
export const renderScale = 2;
export const fps = 45;

var background = new GameObject("background", new Rect(0, 0, canvas.width / renderScale, canvas.height / renderScale), new Animator([{imageID: "background", stateName: "Day"}]));
var pipes = new Pipes();
export var bird = new Bird();

function Update()
{
    if(bird.IsAlive() === false) return;
    Render();
    bird.Update();
    pipes.Update();
}

function Render()
{
    if(ctx === undefined || ctx === null) return;

    // Clearing canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.Render();
    pipes.Render();
    bird.Render();
}

setInterval(() => Update(), 1 / fps * 1000);