export class Rect
{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    AABBCollision(rect: Rect): boolean
    {
        if( this.x + this.width > rect.x &&
            this.x < rect.x + rect.width &&
            this.y + this.height > rect.y &&
            this.y < rect.y + rect.height
        ) return true;
        return false;
    }
}