import { useRef, useState, type ChangeEvent } from 'react';
import useDrag from 'demos/usedrag/useDrag';
import checkBgBounds from 'demos/usedrag/checkbounds/checkBgBounds';
import type { ObjectPositionValues } from 'src/types';
import PageSubHeading from 'src/components/general/PageSubHeading';
import Select from 'src/components/general/Select';

function ImageObjectPosition() {
  const drag3Ref = useRef<HTMLImageElement>( null );
  const bound3Ref = useRef<HTMLDivElement>( null );
  const [objectPosition, objectPositionSet] = useState<ObjectPositionValues>( "cover" );

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

  return (
    <div className="group">
      <PageSubHeading
        className="mt-8"
      >Image Element object-position {objectPosition} inside Bounds</PageSubHeading>
      <Select
        className="mt-2 mb-2"
        name="objectposition"
        value={objectPosition}
        onChange={objectPositionChange}
        style={{
          marginBottom: 10
        }}
      >
        <option value="cover">Cover</option>
        <option value="contain">Contain</option>
      </Select>
      <div
        className="bound"
        ref={bound3Ref}
      >
        <img
          className="dragme"
          ref={drag3Ref}
          src={`${import.meta.env.BASE_URL}attachment.jpg`}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: objectPosition,
            objectPosition: transform3 ? `${transform3.x}px ${transform3.y}px` : undefined
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export default ImageObjectPosition;
