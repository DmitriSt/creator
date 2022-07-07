import { SVGCanvasDTO, SVGPageDTO } from '../../models/designer/designer.models';
import { IPage } from '../interfaces/interfaces';
import Canvas from './Canvas';

export default class Page implements IPage {
  private _name = '';
  private _id: number | null = null;
  private _width = 0;
  private _height = 0;
  private _backgroundUrl = '';
  private _overlayUrl = '';
  private _canvases: Canvas[] = [];

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get id(): number | null {
    return this._id;
  }

  public get width(): number {
    return this._width;
  }

  public set width(width: number) {
    if (width > 0 && width < Infinity) {
      this._width = width;
    }
  }

  public get height(): number {
    return this._height;
  }

  public set height(height: number) {
    if (height > 0 && height < Infinity) {
      this._height = height;
    }
  }

  public get backgroundUrl(): string {
    return this._backgroundUrl;
  }

  public set backgroundUrl(backgroundUrl: string) {
    this._backgroundUrl = backgroundUrl;
  }

  public get overlayUrl(): string {
    return this._overlayUrl;
  }

  public set overlayUrl(overlayUrl: string) {
    this._overlayUrl = overlayUrl;
  }

  public get canvases(): Canvas[] {
    return this._canvases;
  }

  public set canvases(canvases: Canvas[]) {
    this._canvases = canvases;
  }

  public getSVG(): SVGPageDTO {
    const svgCanvasList: string[] = [];
    const svgCanvasDTOList: SVGCanvasDTO[] = [];
    this.canvases.forEach((canvas) => {
      if (canvas.disabled) return;
      const canvasSVG = canvas.getSVG();
      const dto: SVGCanvasDTO = {
        svg: canvasSVG,
        pageId: this.id,
        canvasName: canvas.name,
        canvasId: canvas.canvasId,
      };
      svgCanvasList.push(canvasSVG);
      svgCanvasDTOList.push(dto);
    });
    let bgImage = '';
    if (this.backgroundUrl) {
      bgImage = `&lt;image preserveAspectRatio=&quot;xMidYMin slice&quot; x=&quot;0&quot; y=&quot;0&quot; href=&quot;${this.backgroundUrl}&quot; width=&quot;${this.width}&quot; height=&quot;${this.height}&quot;/&gt;`;
    }
    const content = `${bgImage}${svgCanvasList.join('')}`;
    const pageSvg = `&lt;svg width=&quot;100%&quot; height=&quot;100%&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 ${this.width} ${this.height}&quot;&gt;${content}&lt;/svg&gt;`;
    return {
      svg: pageSvg,
      pageId: this.id,
      pageName: this.name,
      canvasId: -1,
      canvasSVGList: svgCanvasDTOList,
    };
  }

  constructor(
    name: string,
    width: number,
    height: number,
    backgroundUrl: string,
    overlayUrl: string,
    id: number,
    canvases: Canvas[]
  ) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.backgroundUrl = backgroundUrl;
    this.overlayUrl = overlayUrl;
    this._id = id;
    this.canvases = canvases;
  }
}
