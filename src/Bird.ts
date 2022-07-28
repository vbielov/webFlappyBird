import { Animator } from "./Animator";
import { GameObject } from "./GameObject";
import { canvas, fps, renderScale } from "./Main";
import { Rect } from "./Rect";

export class Bird extends GameObject
{
    yVelocity: number = 0;
    private alive: boolean = true;

    constructor()
    {
        var animator = new Animator(
            [
                {imageID: "bird_glide", stateName: "Glide"},
                {imageID: "bird_fall", stateName: "Fall"},
                {imageID: "bird_jump", stateName: "Jump"}
            ]
        )
        super("bird", new Rect(canvas.width / renderScale * 0.2 - 10, canvas.height / renderScale / 2 - 10, 20, 20), animator);
        const birdReference = this;
        document.addEventListener("keydown", (event) => Bird.OnKeyDown(event, birdReference), false);
        document.addEventListener("touchstart", () => birdReference.Jump(), false);
    }

    private static OnKeyDown(event, bird: Bird): void
    {
        if(event.key === " " || event.code === "Space" || event.keyCode === 32)
        {
            bird.Jump();
        }
    }

    jumped: boolean;

    private Jump(): void
    {
        this.yVelocity += 150;
        this.jumped = true;
    }

    lockedTill: number;
    currentState: string;

    IsAlive(): boolean
    {
        return this.alive;
    }

    Die(): void
    {
        this.alive = false;
    }

    Update(): void 
    {
        super.Update();

        // Position update
        this.rect.y = Math.max(0, this.rect.y + this.yVelocity * (1 / fps));
        this.rect.y = Math.min(canvas.height / renderScale - this.rect.height, this.rect.y);
        this.yVelocity -= 150 * (1 / fps);
        if(this.rect.y <= 0) this.yVelocity = 0;
        if(this.rect.y >= canvas.height / renderScale - this.rect.height) this.yVelocity = Math.min(0, this.yVelocity);

        // Rotation update
        const velocityRange = 70;
        var effect = this.yVelocity / velocityRange;
        effect = Bird.clamp(effect, -1, 1);

        const maxDegree = 20;
        this.rotation = effect * -maxDegree;

        // Animator update
        var state: string = this.GetState();
        if(state !== this.currentState)
        {
            this.animator.Play(state);
            this.currentState = state;
        }

        if(this.jumped === true) this.jumped = false;
    }

    private static clamp(number, min, max)
    {
        return Math.max(min, Math.min(number, max));
    }

    private GetState(): string
    {
        if(Date.now() / 1000 < this.lockedTill) return this.currentState;
        if(this.jumped === true) return this.LockState("Jump", 0.3);
        if(this.yVelocity < -20) return "Fall";
        return "Glide";
    }

    private LockState(state: string, time: number): string
    {
        this.lockedTill = Date.now() / 1000 + time;
        return state;
    }
}