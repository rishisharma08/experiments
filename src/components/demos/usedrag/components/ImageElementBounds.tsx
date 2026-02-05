import { useRef } from 'react';
import useDrag from 'demos/usedrag/useDrag';
import checkBgBounds from 'demos/usedrag/checkbounds/checkBgBounds';

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
      <h3>Image Element inside Bounds</h3>
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
