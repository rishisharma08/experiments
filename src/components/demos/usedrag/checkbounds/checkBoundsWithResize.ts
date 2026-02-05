import type { Dim, Pos } from 'src/types';

/**
 * Creates a bounds checking function that accounts for resize offsets
 * @param dimension - The current dimensions and offsets from the resize component
 * @returns A bounds checking function compatible with useDrag
 */
export const createCheckBoundsWithResize = (dimension: Dim) => {
  return (dragElem: HTMLElement, pos: Pos, _delta: Pos, boundElem?: HTMLElement | null): Pos => {
    if (!boundElem) {
      return pos;
    }

    const newPos = { ...pos };
    const offsetX = dimension.offsetX || 0;
    const offsetY = dimension.offsetY || 0;
    const width = dimension.width || dragElem.offsetWidth;
    const height = dimension.height || dragElem.offsetHeight;

    // Left boundary (accounting for resize offset)
    if (pos.x + offsetX < 0) {
      newPos.x = -offsetX;
    }

    // Top boundary (accounting for resize offset)
    if (pos.y + offsetY < 0) {
      newPos.y = -offsetY;
    }

    // Right boundary
    if (pos.x + offsetX + width > boundElem.offsetWidth) {
      newPos.x = boundElem.offsetWidth - width - offsetX;
    }

    // Bottom boundary
    if (pos.y + offsetY + height > boundElem.offsetHeight) {
      newPos.y = boundElem.offsetHeight - height - offsetY;
    }

    return newPos;
  };
};
