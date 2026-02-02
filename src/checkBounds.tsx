import type { Pos } from "./types";

const checkBounds = ( dragElem: HTMLElement, pos: Pos, delta: Pos, boundElem?: HTMLElement | null ): Pos => {
  if( !boundElem ){
    return pos;
  }
  const boundRect = boundElem.getBoundingClientRect();
  const dragRect = dragElem.getBoundingClientRect();
  const newPos = Object.assign( {}, pos );
  if( dragRect.x + pos.x < boundRect.x ){
    newPos.x = 0;
  }
  if( dragRect.y + pos.y < boundRect.y ){
    newPos.y = 0;
  }
  if( pos.x + dragElem.offsetWidth > boundElem.offsetWidth ){
    newPos.x = boundElem.offsetWidth - dragElem.offsetWidth;
  }
  if( pos.y + dragElem.offsetHeight > boundElem.offsetHeight ){
    newPos.y = boundElem.offsetHeight - dragElem.offsetHeight;
  }
  return newPos;
};

export default checkBounds;