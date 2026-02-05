export interface Pos {
  x: number,
  y: number,
};

export interface Dim {
  width: number,
  height: number,
  offsetX?: number,
  offsetY?: number,
};

export type ObjectPositionValues = "cover" | "contain";

export type DragDirections = "x" | "y";