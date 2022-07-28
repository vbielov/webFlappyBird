import { Animator } from "./Animator";
import { GameObject } from "./GameObject";
import { bird, canvas, fps, renderScale, score } from "./Main";
import { Rect } from "./Rect";

const maxHole = 175;
const minHole = 175;

export class Pipes extends GameObject
{
    private pipesObjects: GameObject[] = [];

    constructor()
    {
        super("Pipes");
        this.GeneratePipe();
    }

    GeneratePipe()
    {
        var bottomPipe = new GameObject("Bottom pipe", new Rect(canvas.width / renderScale, 0, 39, 240), new Animator([{imageID: "pipe_up", stateName: "Static"}]));
        var topPipe = new GameObject("Top pipe", new Rect(canvas.width / renderScale, 0, 38, 240), new Animator([{imageID: "pipe_down", stateName: "Static"}]));

        var randomHeight = Math.random() * (maxHole - minHole) + minHole;
		var randomY = Math.random() * (canvas.height / renderScale - randomHeight);

        bottomPipe.rect.y = randomY - bottomPipe.rect.height;
        topPipe.rect.y = randomHeight + randomY;

        this.pipesObjects.push(bottomPipe);
        this.pipesObjects.push(topPipe);
    }

    Update(): void 
    {
        for(var i = 0; i < this.pipesObjects.length; i++)
        {
            this.pipesObjects[i].rect.x -= this.GetCurrentSpeed() * (1 / fps);

            if(this.pipesObjects[i].rect.AABBCollision(bird.rect) === true)
            {
                bird.Die();
            }
        }

        if(this.pipesObjects[0].rect.x + this.pipesObjects[0].rect.width < 0)
        {
            this.pipesObjects.shift();
            this.pipesObjects.shift();
            score.AddPoint();
            this.GeneratePipe();
        }
    }

    GetCurrentSpeed(): number
    {
        const speedDouble = 1; 
        return 100 + (2 / speedDouble) * score.GetScore();
    }

    Render(): void 
    {
        for(var i = 0; i < this.pipesObjects.length; i++)
        {
            this.pipesObjects[i].Render();
        }
    }
}