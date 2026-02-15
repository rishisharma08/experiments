import type { Pos } from "src/types";

// @ts-expect-error - simplified default implementation
const checkBgBounds = ( dragElem: HTMLElement, pos: Pos, delta: Pos, boundElem?: HTMLElement | null ): Pos => {
  if( !boundElem ){
    return pos;
  }

  const dragRect = dragElem.getBoundingClientRect();
  const boundRect = boundElem.getBoundingClientRect();
  const newPos = Object.assign( {}, pos );
  const styles = getComputedStyle( dragElem );
  // const {backgroundPositionX, backgroundPositionY} = getComputedStyle( dragElem );
  // const posX = parseInt( styles.backgroundPositionX.replace( "px", "" ) );
  // const posY = parseInt( styles.backgroundPositionY.replace( "px", "" ) );
  const boundWidth = boundElem.offsetWidth;
  const boundHeight = boundElem.offsetHeight;
  let width = dragElem.offsetWidth;
  let height = dragElem.offsetHeight;
  let dragRectX = dragRect.x;
  let dragRectY = dragRect.y;

  if( dragElem.tagName === "IMG" && ( dragElem as HTMLImageElement ).src ){
    const naturalWidth = ( dragElem as HTMLImageElement ).naturalWidth;
    const naturalHeight = ( dragElem as HTMLImageElement ).naturalHeight;
    if( styles.objectFit === "cover" ){
      if( naturalWidth < naturalHeight ){
        width = boundWidth;
        height = width * naturalHeight / naturalWidth;
      }else if( naturalWidth > naturalHeight ){
        height = boundHeight;
        width = height * naturalWidth / naturalHeight;
      }
    }else if( styles.objectFit === "contain" ){
      if( naturalWidth < naturalHeight ){
        height = boundHeight;
        width = height * naturalWidth / naturalHeight;
        dragRectX = boundRect.x;
      }else if( naturalWidth > naturalHeight ){
        width = boundWidth;
        height = width * naturalHeight / naturalWidth;
        dragRectY = boundRect.y;
      }
    }
  }

  const minX = boundWidth - width;
  const minY = boundHeight - height;

  // Constrain to right/top edges (prevent dragging past top-left corner)
  // console.log( dragRect.right, boundRect.right, pos );
  if( width > boundWidth ){
    if( pos.x > 0 ){
      newPos.x = 0;
    }
    if( pos.x < minX ){
      newPos.x = minX;
    }
  }else{
    if( dragRectX + pos.x < boundRect.x ){
      newPos.x = 0;
    }
    if( pos.x + width > boundWidth ){
      newPos.x = boundWidth - width;
    }
  }
  if( height > boundHeight ){
    if( pos.y > 0 ){
      newPos.y = 0;
    }
    if( pos.y < minY ){
      newPos.y = minY;
    }
  }else{
    if( dragRectY + pos.y < boundRect.y ){
      newPos.y = 0;
    }
    if( pos.y + height > boundHeight ){
      newPos.y = boundHeight - height;
    }
  }

  return newPos;
};

export default checkBgBounds;