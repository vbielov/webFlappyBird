import { Rect } from "./Rect";
import { TextUI } from "./TextUI";


export class Score extends TextUI
{
    private points: number = 0;
    constructor(x: number, y: number, points?: number)
    {
        super("score: 0", new Rect(x, y, 0, 0));
        this.points = points || this.points;
    }

    AddPoint()
    {
        this.points += 1;
        this.AssignText("score: " + this.points.toString());
    }

    GetScore()
    {
        return this.points;
    }
}