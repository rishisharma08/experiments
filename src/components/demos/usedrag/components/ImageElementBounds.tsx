import { useRef } from 'react';
import useDrag from 'demos/usedrag/useDrag';
import checkBgBounds from 'demos/usedrag/checkbounds/checkBgBounds';
import PageSubHeading from 'src/components/general/PageSubHeading';

function ImageElementBounds() {
  const drag2Ref = useRef<HTMLImageElement>( null );
  const bound2Ref = useRef<HTMLDivElement>( null );

  const {
    transform: transform2
  } = useDrag({
    dragElem: drag2Ref,
    boundElem: bound2Ref,
    checkBounds: checkBgBounds,
  });

  const transform2String = transform2 ? `translateX(${transform2.x}px) translateY(${transform2.y}px)` : undefined;

  return (
    <div className="group">
      <PageSubHeading
        className="mt-8"
      >Image Element inside Bounds</PageSubHeading>
      <div
        className="bound mt-2"
        ref={bound2Ref}
      >
        <img
          className="dragme"
          ref={drag2Ref}
          src={`${import.meta.env.BASE_URL}attachment.jpg`}
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "none",
            display: "block",
            transform: transform2String,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export default ImageElementBounds;
