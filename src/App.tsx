import { useRef, useState, type ChangeEvent } from 'react';
import './App.css';
import useDrag from './useDrag';
import checkBounds from './checkBounds';
import checkBgBounds from './checkBgBounds';
import type { ObjectPositionValues } from './types';


function App() {
  const dragRef = useRef<HTMLDivElement>( null );
  const boundRef = useRef<HTMLDivElement>( null );
  const drag2Ref = useRef<HTMLImageElement>( null );
  const bound2Ref = useRef<HTMLDivElement>( null );
  const drag3Ref = useRef<HTMLImageElement>( null );
  const bound3Ref = useRef<HTMLDivElement>( null );

  const [objectPosition, objectPositionSet] = useState<ObjectPositionValues>( "cover" );
  
  const {
    transform
  } = useDrag({
    dragElem: dragRef,
    boundElem: boundRef,
    checkBounds: checkBounds,
  });
  const {
    transform: transform2
  } = useDrag({
    dragElem: drag2Ref,
    boundElem: bound2Ref,
    checkBounds: checkBgBounds,
  });
  const {
    transform: transform3,
    reset: reset3
  } = useDrag({
    dragElem: drag3Ref,
    boundElem: bound3Ref,
    checkBounds: checkBgBounds,
  });

  const objectPositionChange = ( e: ChangeEvent<HTMLSelectElement> ) => {
    objectPositionSet( e.target.value as ObjectPositionValues );
    reset3();
  };

  const transformString = `translateX(${transform.x}px) translateY(${transform.y}px)`;
  const transform2String = `translateX(${transform2.x}px) translateY(${transform2.y}px)`;

  return (
    <div id="app">
      <div className="group">
        <h3>useDrag hook</h3>
      </div>
      <div className="group">
        <h5>Normal Element inside Bounds</h5>
        <div className="bound" ref={boundRef}>
          <div
            className="dragme"
            ref={dragRef}
            style={{
              transform: transformString,
              display: "flex",
              placeContent: "center",
              placeItems: "center",
            }}
          >
            drag me
          </div>
        </div>
      </div>
      <div className="group">
        <h5>Image Element inside Bounds</h5>
        <div
          className="bound"
          ref={bound2Ref}
        >
          <img
            className="dragme"
            ref={drag2Ref}
            src="/attachment.webp"
            style={{
              width: "auto",
              height: "auto",
              display: "block",
              transform: transform2String,
            }}
            draggable={false}
          />
        </div>
      </div>
      <div className="group">
        <h5>Image Element object-position {objectPosition} inside Bounds</h5>
        <select
          name="objectposition"
          value={objectPosition}
          onChange={objectPositionChange}
          style={{
            marginBottom: 10
          }}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
        <div
          className="bound"
          ref={bound3Ref}
        >
          <img
            className="dragme"
            ref={drag3Ref}
            src="/attachment.webp"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: objectPosition,
              objectPosition: `${transform3.x}px ${transform3.y}px`
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}

export default App
