import { Animator } from "./Animator";
import { GameObject } from "./GameObject";
import { ctx } from "./Main";
import { Rect } from "./Rect";
import { Vector } from "./Vector";

// Image settings
var fontImage = <HTMLImageElement> document.getElementById("font");
const letterWidth = 14;
const letterHeight = 16;
const spaceLetterWidth = 18;
const spaceLetterHeight = 3;
const lettersInRow = 10;

// Image chars
const charString: string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,?!:-+♥';
const charArr: string[] = charString.split('');

export class TextUI extends GameObject
{
    text: string[][];

    constructor(text: string, rect: Rect)
    {
        super("TextUI", rect, null);
        this.AssignText(text);
    }
    rect: Rect;
    animator: Animator;
    rotation: number;

    AssignText(text: string): void
    {
        var tempText = text.split(/\r?\n/);
        this.text = new Array(tempText.length);
        for(var i = 0; i < tempText.length; i++)
        {
            this.text[i] = tempText[i].split('');
        }
    }

    Render(): void
    {
        var textHeight = 0;

        for(var y = 0; y < this.text.length; y++)
        {
            var textLine = this.text[y];
            textHeight = (letterHeight + spaceLetterHeight) * y;
            var textWidth = 0;
            for(var x = 0; x < textLine.length; x++)
            {
                var index = charArr.findIndex((char) => char === textLine[x]);
                if(textLine[x] === " ")
                {
                    textWidth += spaceLetterWidth;
                    continue;
                }
                if(index === -1) index = 64;
                var charPosition = new Vector
                (
                    (index % lettersInRow) * (letterWidth + spaceLetterWidth), 
                    Math.floor(index / lettersInRow) * (letterHeight + spaceLetterHeight)
                );
                this.RenderLetter(charPosition, Vector.Add(new Vector(textWidth, textHeight), new Vector(this.rect.x, this.rect.y)));
                textWidth += letterWidth + 1;
            }
        }
    }

    
    RenderLetter(charImagePosition: Vector, charCanvasPosition: Vector): void
    {
        ctx.drawImage(
            fontImage,
            charImagePosition.x, charImagePosition.y,
            letterWidth, letterHeight,
            charCanvasPosition.x, ctx.canvas.height - charCanvasPosition.y - letterHeight,
            letterWidth, letterHeight
        )
    }

    Update(): void {}
}