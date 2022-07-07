import { DesignerProductCanvas } from '../../models/designer/designer.models';
import Canvas from '../elements/Canvas';

export default function convertToCanvas(canvas: DesignerProductCanvas, layoutId: string | null): Canvas {
  const { width, height } = canvas.size;
  return new Canvas(
    width,
    height,
    canvas.name,
    [],
    canvas.id,
    layoutId,
    canvas.position.left,
    canvas.position.top,
    canvas.bleed,
    true
  );
}
