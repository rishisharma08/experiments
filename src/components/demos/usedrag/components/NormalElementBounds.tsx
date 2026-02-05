import { useRef, useState, type ChangeEvent } from 'react';
import useDrag from 'demos/usedrag/useDrag';
import checkBounds from 'demos/usedrag/checkbounds/checkBounds';
import type { DragDirections } from 'src/types';

function NormalElementBounds() {
  const dragRef = useRef<HTMLDivElement>( null );
  const boundRef = useRef<HTMLDivElement>( null );
  const [allowedDirections, allowedDirectionsSet] = useState<DragDirections[]>([ "x", "y" ]);

  const {
    transform
  } = useDrag({
    dragElem: dragRef,
    boundElem: boundRef,
    checkBounds: checkBounds,
    allowedDirections,
  });

  const allowedDirectionsChange = ( e: ChangeEvent<HTMLSelectElement> ) => {
    const options = e.target.options;
    const values:DragDirections[] = [];
    for( let i = 0; i < options.length; i++ ){
      if( options[ i ].selected ){
        values.push( options[ i ].value as DragDirections );
      }
    }
    allowedDirectionsSet( values );
  };

  const transformString = transform ? `translateX(${transform.x}px) translateY(${transform.y}px)` : undefined;

  return (
    <div className="group">
      <h3>Normal Element inside Bounds. Movement restricted to {allowedDirections.join( ", ")} Axis</h3>
      <select
        name="allowedDirections"
        className="select-styled"
        value={allowedDirections}
        onChange={allowedDirectionsChange}
        multiple
        style={{
          marginBottom: 10
        }}
        size={3}
      >
        <optgroup label="Drag Directions">
          <option value="x">X Axis</option>
          <option value="y">Y Axis</option>
        </optgroup>
      </select>
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
  );
}

export default NormalElementBounds;
