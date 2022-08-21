import { Animator } from "./Animator";
import { GameObject } from "./GameObject";
import { bird, canvas, fps, GameState, GetGameState, pipes, renderScale } from "./Main";
import { Rect } from "./Rect";

export class ParalaxBackground extends GameObject
{
    private backgrounds: GameObject[] = [];
    private position: number = 0;

    constructor()
    {
        super("ParalaxBackground", null, null);
        this.Init();
    }

    Init(): void
    {
        const amountOfBackgrounds = 2;
        for(var i = 0; i < amountOfBackgrounds; i++)
        {
            this.backgrounds.push(new GameObject("Background: " + i, new Rect(i * canvas.width / renderScale, 0, canvas.width / renderScale * 1.3, canvas.height / renderScale * 1.3), new Animator([{imageID: "background", stateName: "Day"}])));
        }
    }

    Update(): void 
    {
        const paralaxScale = 0.3;

        for(var i = 0; i < this.backgrounds.length; i++)
        {
            this.backgrounds[i].rect.x -= (pipes.GetCurrentSpeed() * paralaxScale * (1 / fps));
            // random numbers....
            // this.backgrounds[i].rect.y = -(bird.rect.y - canvas.height / 2 / renderScale) * 0.1 - 50;
        }

        for(var i = 0; i < this.backgrounds.length; i++)
        {
            if(this.backgrounds[i].rect.x + this.backgrounds[i].rect.width < 0)
            {
                var maxPos = -99999999999;
                for(var p = 0; p < this.backgrounds.length; p++)
                {
                    maxPos = Math.max(this.backgrounds[p].rect.x + this.backgrounds[p].rect.width, maxPos);
                }
                this.backgrounds[i].rect.x = Math.floor(maxPos);
            }
        }
    }

    Render(): void 
    {
        for(var i = 0; i < this.backgrounds.length; i++)
        {
            this.backgrounds[i].Render();
        }
    }
}