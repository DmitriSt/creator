import { INewImage } from '../interfaces/interfaces';

type ThumbnailsFunction = (a: INewImage[]) => void;

class ThumbnailManager {
  private readonly items: File[] = [];

  private uploading = false;

  public callback: ThumbnailsFunction = null;

  public setup(callback: ThumbnailsFunction) {
    this.callback = callback;
  }

  public add(files: File[]) {
    this.items.push(...files);
    this.processQueue();
  }

  private processQueue() {
    if (this.uploading) return;
    this.uploading = true;
    const newImages: INewImage[] = [];

    try {
      while (this.items.length) {
        const item = this.items.shift();
        const file = item;
        const reader = new FileReader();
        reader.onload = (function (file) {
          return function (e: any) {
            const newImg = { image: { fileName: file.name, thumbnailUrl: `${e.target.result}`, upload: true } };
            newImages.push(newImg);
          };
        })(file);
        reader.readAsDataURL(file);
        this.callback(newImages);
      }
    } finally {
      this.uploading = false;
    }
  }
}

export default new ThumbnailManager();
