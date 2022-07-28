export class Animator
{
    currentImage: HTMLImageElement = null;
    private images: { [name: string]: HTMLImageElement } = {};

    constructor(imageIDs: { imageID: string, stateName: string}[])
    {
        for(var i = 0; i < imageIDs.length; i++)
        {
            this.images[imageIDs[i].stateName] = Animator.LoadImage(imageIDs[i].imageID);
        }
        this.currentImage = this.images[imageIDs[0].stateName];
    }

    static LoadImage(imageID: string): HTMLImageElement
    {
        return <HTMLImageElement> document.getElementById(imageID);
    }

    Play(name: string): void
    {
        this.currentImage = this.images[name];
    }
}