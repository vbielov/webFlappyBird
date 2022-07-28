import { Animator } from "./Animator";
import { canvas, ctx, renderScale } from "./Main";
import { Rect } from "./Rect";
import { Vector } from "./Vector";

export class GameObject
{
    name: string = "new GameObject";
    rect: Rect = null;
    animator: Animator = null;
    rotation: number = 0;

    constructor(name?: string, rect?: Rect, animator?: Animator)
    {
        this.name = name || this.name;
        this.rect = rect || this.rect;
        if(animator === undefined || animator === null) this.animator = null;
        else this.animator = animator;
    }

    Update(): void
    {
        // Not implemented;
    }

    Render(): void
    {
        if(this.animator === null || this.animator.currentImage === null) return;
        ctx.save();
        ctx.rotate(this.rotation * Math.PI / 180);
        var pos = new Vector(this.rect.x, canvas.height / renderScale - (this.rect.y + this.rect.height));
        var unRotatedPos = Vector.Rotate(pos, new Vector(-this.rect.width / 2, -this.rect.height / 2), -this.rotation);
        ctx.drawImage(this.animator.currentImage, unRotatedPos.x * renderScale, unRotatedPos.y * renderScale, this.rect.width * renderScale, this.rect.height * renderScale);
        ctx.restore();
    }
}