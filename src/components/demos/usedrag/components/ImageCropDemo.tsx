import { useRef, useState } from 'react';
import useDrag from 'demos/usedrag/useDrag';
import Resize from 'demos/usedrag/Resize';
import { createCheckBoundsWithResize } from 'demos/usedrag/checkbounds/checkBoundsWithResize';
import type { Dim } from 'src/types';

function ImageCropDemo() {
  const dragResizeRef = useRef<HTMLImageElement>( null );
  const boundResizeRef = useRef<HTMLDivElement>( null );
  const [dimension, dimensionSet] = useState<Dim>({width: 0, height: 0, offsetX: 0, offsetY: 0});

  const {
    transform: transformResize,
  } = useDrag({
    dragElem: dragResizeRef,
    boundElem: boundResizeRef,
    checkBounds: createCheckBoundsWithResize(dimension),
  });

  const transformResizeString = transformResize ? `translateX(${transformResize.x}px) translateY(${transformResize.y}px)` : undefined;
  const backgroundPositionString = transformResize
    ? `${-transformResize.x - (dimension.offsetX || 0)}px ${-transformResize.y - (dimension.offsetY || 0)}px`
    : '0px 0px';

  return (
    <div className="group">
      <h3>Resize to crop the image.</h3>
      <div
        style={{
          width: 600,
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#000",
        }}
        ref={boundResizeRef}
      >
        <img
          // className="dragme"
          src="/attachment.webp"
          style={{
            inset: 0,
            width: "100%",
            height: "auto",
            display: "block",
            opacity: 0.4
          }}
          draggable={false}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur( 3px )"
          }}
        ></div>
        <Resize
          ref={dragResizeRef}
          resizemeStyles={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 200,
            height: 200,
            backgroundImage: `url("/attachment.webp")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: backgroundPositionString,
            backgroundSize: "600px",
            transform: transformResizeString
          }}
          updateDims={dimensionSet}
        >
        </Resize>
      </div>
    </div>
  );
}

export default ImageCropDemo;
