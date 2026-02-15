import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import type { DragDirections, Pos } from 'src/types';

interface Props {
  dragElem: RefObject<HTMLElement | null>,
  boundElem?: RefObject<HTMLElement | null>,
  checkBounds?: ( dragElem: HTMLElement, pos: Pos, delta: Pos, boundElem?: HTMLElement | null ) => Pos,
  allowedDirections?: DragDirections[],
  startingPos?: Pos,
}

// @ts-expect-error - simplified default implementation
const checkBoundsDefault = ( dragElem: HTMLElement, pos: Pos ) => {
  return pos;
};

const useDrag = ({
  dragElem,
  boundElem,
  checkBounds = checkBoundsDefault,
  allowedDirections = [ "x", "y" ],
  startingPos,
}: Props) => {
  const [isDragging, isDraggingSet] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const mouseDownTransformRef = useRef<Pos>({x: 0, y:0});
  const mouseDownPosRef = useRef<Pos>({x: 0, y:0});
  const [transform, transformSet] = useState<Pos | null>(null);
  const transformRef = useRef<Pos>(transform || {x: 0, y: 0});
  const isInitializedRef = useRef<boolean>(false);

  // Keep ref in sync with state
  useEffect(() => {
    transformRef.current = transform || startingPos || {x: 0, y: 0};
  }, [transform, startingPos]);

  const handleMouseMove = useCallback(( e: MouseEvent | TouchEvent ) => {
    if( isDraggingRef.current ){
      if( dragElem && dragElem.current ){
        const delta: Pos = {
          x: mouseDownTransformRef.current.x - mouseDownPosRef.current.x,
          y: mouseDownTransformRef.current.y - mouseDownPosRef.current.y,
        };
        let clientX: number = 0;
        let clientY: number = 0;
        if( "clientX" in e ){
          clientX = e.clientX;
          clientY = e.clientY;
        } else if( "touches" in e ){
          e.preventDefault();
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
        const newPos = {
          x: allowedDirections.includes( "x" ) ? delta.x + clientX : mouseDownTransformRef.current.x,
          y: allowedDirections.includes( "y" ) ? delta.y + clientY : mouseDownTransformRef.current.y,
        };
        let finalPos = newPos;
        if( checkBounds ){
          finalPos = checkBounds( dragElem.current, newPos, delta, boundElem ? boundElem.current : null );
        }
        // Re-apply directional constraints after checkBounds to ensure locked directions stay locked
        finalPos = {
          x: allowedDirections.includes( "x" ) ? finalPos.x : mouseDownTransformRef.current.x,
          y: allowedDirections.includes( "y" ) ? finalPos.y : mouseDownTransformRef.current.y,
        };
        transformSet( finalPos );
      }
    }
  }, [dragElem, boundElem, checkBounds, allowedDirections]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    isDraggingSet(()=>false);
    dragElem.current?.classList.remove( "dragging" );
  }, [dragElem]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const handleMouseDown = useCallback(( e: MouseEvent | TouchEvent ) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    isDraggingSet(()=>true);
    if( "clientX" in e ){
      mouseDownPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    } else if( "touches" in e ){
      mouseDownPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
    mouseDownTransformRef.current = transformRef.current;
    dragElem.current?.classList.add( "dragging" );
  }, [dragElem]);

  const reset = () => {
    transformSet({x: 0, y: 0});
    isInitializedRef.current = false;
  };

  const setInitialTransforms = ( elem: HTMLElement ) => {
    const style = window.getComputedStyle( elem );
    const matrix = style.transform;
    let initialTransform = {x: 0, y: 0};

    if ( matrix && matrix !== 'none') {
      const matches = matrix.match(/matrix.*\((.+)\)/);
      if( matches ){
        const values = matches[1].split(', ');
        const translateX = parseFloat(values[4]); // X position
        const translateY = parseFloat(values[5]); // Y position
        initialTransform = {
          x: translateX,
          y: translateY,
        };
      }
    }

    // Defer state update to avoid cascading renders in React 19
    queueMicrotask(() => {
      transformSet(initialTransform);
    });
  };

  // Initialize transform from existing CSS transform (runs once)
  useLayoutEffect(() => {
    const element = dragElem.current;
    if (element && !isInitializedRef.current) {
      setInitialTransforms(element);
      isInitializedRef.current = true;
    }
  }, [dragElem]);

  // Setup event listeners
  useEffect(() => {
    const element = dragElem.current;
    if( element ){
      element.addEventListener( "mousedown", handleMouseDown );
      window.addEventListener( "mousemove", handleMouseMove );
      window.addEventListener( "mouseup", handleMouseUp );
      element.addEventListener( "touchstart", handleMouseDown, {passive: true} );
      element.addEventListener( "touchmove", handleMouseMove, {passive: false} );
      window.addEventListener( "touchend", handleMouseUp );
      window.addEventListener( "touchcancel", handleMouseUp );
      allowedDirections.forEach(( dir )=>{
        element.classList.add( `drag-elem` );
        element.classList.add( `drag-direction-${dir}` );
      });
    }
    return () => {
      if( element ){
        element.removeEventListener( "mousedown", handleMouseDown );
        window.removeEventListener( "mousemove", handleMouseMove );
        window.removeEventListener( "mouseup", handleMouseUp );
        element.removeEventListener( "touchstart", handleMouseDown );
        element.removeEventListener( "touchmove", handleMouseMove );
        window.removeEventListener( "touchend", handleMouseUp );
        window.removeEventListener( "touchcancel", handleMouseUp );
        allowedDirections.forEach(( dir )=>{
          element.classList.remove( `drag-elem` );
          element.classList.remove( `drag-direction-${dir}` );
        });
      }
    };
  }, [allowedDirections, dragElem, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    transform,
    reset,
    isDragging,
  };
};

export default useDrag;