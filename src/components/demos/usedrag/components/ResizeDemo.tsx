import { useRef } from 'react';
import useDrag from 'demos/usedrag/useDrag';
import Resize from 'demos/usedrag/Resize';

function ResizeDemo() {
  const dragResizeRef = useRef<HTMLImageElement>( null );
  const boundResizeRef = useRef<HTMLDivElement>( null );

  const {
    transform: transformResize,
  } = useDrag({
    dragElem: dragResizeRef,
    boundElem: boundResizeRef,
  });

  const transformResizeString = transformResize ? `translateX(${transformResize.x}px) translateY(${transformResize.y}px)` : undefined;

  return (
    <div className="group">
      <h3>Resize</h3>
      <div
        ref={dragResizeRef}
        style={{
          width: 200,
          height: 200,
          transform: transformResizeString,
        }}
      >
        <Resize
          resizemeStyles={{
            width: 200,
            height: 200,
          }}
        >
          <div>Resize Me</div>
        </Resize>
      </div>
    </div>
  );
}

export default ResizeDemo;
