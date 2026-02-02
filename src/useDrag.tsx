import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { Pos } from './types';

interface Props {
  dragElem: RefObject<HTMLElement | null>,
  boundElem?: RefObject<HTMLElement | null>,
  checkBounds?: ( dragElem: HTMLElement, pos: Pos, delta: Pos, boundElem?: HTMLElement | null ) => Pos,
}

const checkBoundsDefault = ( dragElem: HTMLElement, pos: Pos, delta: Pos, boundElem?: HTMLElement | null ) => {
  return pos;
};

const useDrag = ({
  dragElem,
  boundElem,
  checkBounds = checkBoundsDefault,
}: Props) => {
  const isDraggingRef = useRef<boolean>(false);
  const mouseDownTransformRef = useRef<Pos>({x: 0, y:0});
  const mouseDownPosRef = useRef<Pos>({x: 0, y:0});
  const [transform, transformSet] = useState<Pos>({x: 0, y:0});
  const transformRef = useRef<Pos>(transform);

  // Keep ref in sync with state
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  const handleMouseMove = useCallback(( e: MouseEvent ) => {
    if( isDraggingRef.current ){
      if( dragElem && dragElem.current ){
        const delta: Pos = {
          x: mouseDownTransformRef.current.x - mouseDownPosRef.current.x,
          y: mouseDownTransformRef.current.y - mouseDownPosRef.current.y,
        };
        const newPos = {
          x: delta.x + e.clientX,
          y: delta.y + e.clientY,
        };
        if( checkBounds ){
          transformSet( checkBounds( dragElem.current, newPos, delta, boundElem ? boundElem.current : null ) );
        }else{
          transformSet( newPos );
        }
      }
    }
  }, [dragElem, boundElem, checkBounds]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    dragElem.current?.classList.remove( "dragging" );
  }, [dragElem.current?.classList]);

  const handleMouseDown = useCallback(( e: MouseEvent ) => {
    isDraggingRef.current = true;
    mouseDownPosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    mouseDownTransformRef.current = transformRef.current;
    dragElem.current?.classList.add( "dragging" );
  }, [dragElem.current?.classList]);

  const reset = () => {
    transformSet({x: 0, y: 0});
  };

  useEffect(() => {
    const element = dragElem.current;
    if( element ){
      element.addEventListener( "mousedown", handleMouseDown );
      window.addEventListener( "mousemove", handleMouseMove );
      window.addEventListener( "mouseup", handleMouseUp );
    }
    return () => {
      if( element ){
        element.removeEventListener( "mousedown", handleMouseDown );
        window.removeEventListener( "mousemove", handleMouseMove );
        window.removeEventListener( "mouseup", handleMouseUp );
      }
    };
  }, [dragElem, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    transform,
    reset
  };
};

export default useDrag;