import { combineChunks, postUploads, uploadChunk } from '../../services/designer/uploadImage.service';

async function uploadItem(file: File, callback: ProgressFunction, uploadId: string, designId: string) {
  const chunkSize = 4194304; // 4mb;
  let beginingOfTheChunk = 0;
  let endOfTheChunk = chunkSize;
  let counter = 0;
  const totalCount = file.size % chunkSize === 0 ? file.size / chunkSize : Math.floor(file.size / chunkSize) + 1;

  for (let i = 0; i < totalCount; i++) {
    counter++;
    const chunk = file.slice(beginingOfTheChunk, endOfTheChunk);
    if (counter === totalCount) {
      // 'Process is complete, counter);
      counter = 0;

      /* eslint-disable no-await-in-loop */

      await uploadChunk(uploadId, chunk, beginingOfTheChunk, designId);
      const imageData = await combineChunks(uploadId);
      if (imageData.messages[0] !== 0) {
        callback(100, null);
      } else {
        callback(100, imageData);
      }

      /* eslint-disable no-await-in-loop */
    } else {
      /* eslint-disable no-await-in-loop */

      await uploadChunk(uploadId, chunk, beginingOfTheChunk, designId);
      beginingOfTheChunk = endOfTheChunk;
      endOfTheChunk += chunkSize;

      /* eslint-disable no-await-in-loop */

      const percentage = (counter / totalCount) * 100;
      callback(percentage);
    }
  }
}

type ProgressFunction = (percentage: number, fileIndex?: number) => void;
type ChunksCountFunction = (chunks: number, finish?: boolean) => void;

class FilesManager {
  private readonly items: File[] = [];

  private uploading = false;

  private chunksCount = 0;

  private designId: string = null;

  public callback: ProgressFunction = null;

  public allChunksCount: ChunksCountFunction = null;

  public setup(callback: ProgressFunction): void {
    this.callback = callback;
  }

  public allChunksCountCallback(callback: ChunksCountFunction) {
    this.allChunksCount = callback;
  }

  public add(files: File[], designId: string): void {
    this.items.push(...files);
    this.designId = designId;
    files.forEach((file) => {
      const chunkSize = 4194304; // 4mb;
      const totalCount = file.size % chunkSize === 0 ? file.size / chunkSize : Math.floor(file.size / chunkSize) + 1;
      this.chunksCount += totalCount;
    });
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.uploading || !this.callback) return;
    this.uploading = true;
    this.allChunksCount(this.chunksCount);

    try {
      /* eslint-disable no-await-in-loop */
      while (this.items.length) {
        const item = this.items.shift();
        const uploadData = await postUploads(this.designId, item.name, item.size);

        await uploadItem(item, this.callback, uploadData.uploadId, this.designId);
      }
      /* eslint-disable no-await-in-loop */
    } finally {
      this.uploading = false;
      this.allChunksCount(0, true);
      this.chunksCount = 0;
    }
  }
}

export default new FilesManager();
