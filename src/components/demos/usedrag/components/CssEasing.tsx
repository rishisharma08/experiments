import { useEffect, useMemo, useRef, useState } from "react";
import PageSubHeading from "src/components/general/PageSubHeading";
import useDrag from "../useDrag";
import type { Dim, Pos } from "src/types";
import Select from "src/components/general/Select";
const size = 400;

function DragHandle(){
  return <div
    className="size-full bg-black -translate-x-1/2 -translate-y-1/2 border border-white"
  />;
}

function CssEasing(){
  const boundRef = useRef<HTMLDivElement>( null );
  const drag1Ref = useRef<HTMLDivElement>( null );
  const drag2Ref = useRef<HTMLDivElement>( null );
  const cp1: Pos = {
    x: 0,
    y: size,
  };
  const cp2: Pos = {
    x: size,
    y: 0
  };
  const {
    transform: transform1,
    isDragging: isDragging1,
  } = useDrag({
    dragElem: drag1Ref,
    boundElem: boundRef,
    // checkBounds: checkBounds,
  });
  const {
    transform: transform2,
    isDragging: isDragging2,
  } = useDrag({
    dragElem: drag2Ref,
    boundElem: boundRef,
    // checkBounds: checkBounds,
  });
  const [property, propertySet] = useState( "transform" );
  const sampleDivRef = useRef<HTMLDivElement>( null );
  const [sampleDivDims, sampleDivDimsSet] = useState<Dim>({
    width: 0, height: 0
  });
  const isDragging = isDragging1 || isDragging2;
  const transformString1 = transform1 ? `translateX(${transform1.x}px) translateY(${transform1.y}px)` : `translateX(${cp1.x}px) translateY(${cp1.y}px)`;
  const transformString2 = transform2 ? `translateX(${transform2.x}px) translateY(${transform2.y}px)` : `translateX(${cp2.x}px) translateY(${cp2.y}px)`;

  const transitionTimingFunction = useMemo(()=>{
    return `cubic-bezier(${( ( transform1 ? transform1.x : cp1.x ) / size ).toFixed(2)}, ${( ( size - ( transform1 ? transform1.y : cp1.y ) ) / size ).toFixed(2)}, ${( ( transform2 ? transform2.x : cp2.x ) / size ).toFixed(2)}, ${( ( size - ( transform2 ? transform2.y : cp2.y ) ) / size ).toFixed(2)})`;
  }, [ isDragging ]);

  useEffect(()=>{
    if( sampleDivRef.current ){
      sampleDivDimsSet({
        width: sampleDivRef.current.offsetWidth,
        height: sampleDivRef.current.offsetHeight,
      });
    }
  }, [sampleDivRef]);

  return (
    <div className="group">
      <PageSubHeading
        className="mt-8"
      >
        Use Drag Handles to make your CSS cubic-besier curve
      </PageSubHeading>
      <div className="space-y-2 mt-2">
        <div
          style={{
            width: size
          }}
          className={`aspect-square relative`}
          ref={boundRef}
        >
          <div
            className="w-2 aspect-square select-none cursor-pointer absolute top-0 left-0"
            ref={drag1Ref}
            style={{
              transform: transformString1,
            }}
          >
            <DragHandle />
          </div>
          <div
            className="w-2 aspect-square select-none cursor-pointer absolute top-0 left-0"
            ref={drag2Ref}
            style={{
              transform: transformString2,
            }}
          >
            <DragHandle />
          </div>
          <svg
            className="size-full absolute -z-1 pointer-events-none overflow-visible dark:bg-white"
          >
            <path
              className="stroke-accent-color"
              d={`M ${cp1.x} ${cp1.y} C ${transform1 ? transform1.x :  cp1.x} ${transform1 ? transform1.y : cp1.y}, ${transform2 ? transform2.x : cp2.x} ${transform2 ? transform2.y : cp2.y}, ${cp2.x} ${cp2.y}`}
              // stroke="black"
              fill="none"
            />
            <path
              d={`M ${cp1.x} ${cp1.y} L ${transform1 ? transform1.x : cp1.x} ${transform1 ? transform1.y : cp1.y}`}
              stroke="black"
              strokeWidth={0.25}
            />
            <path
              d={`M ${transform2 ? transform2.x : cp2.x} ${transform2 ? transform2.y : cp2.y} L ${cp2.x} ${cp2.y}`}
              stroke="black"
              strokeWidth={0.25}
            />
            <path
              d={`M 0 0 L 0 ${size} L ${size} ${size}`}
              stroke="black"
              strokeWidth={0.25}
              fill="none"
            />
          </svg>
        </div>
        <div>
          {transitionTimingFunction}
        </div>
        <div>
          <p className="text-xs">Select a Property to see a demo</p>
          <Select
            // className="select-styled"
            onChange={( e )=>{
              propertySet( e.target.value )
            }}
          >
            <option value="transform">Transform</option>
            <option value="opacity">Opacity</option>
          </Select>
        </div>
        <div
          ref={sampleDivRef}
          className="size-20 bg-gray-300 border border-white"
          style={{
            transitionProperty: isDragging ? "none" : property,
            transitionDuration: "1000ms",
            transitionTimingFunction: transitionTimingFunction,
            ...( property === "transform" ? {transform: `translateX(${isDragging ? 0 : size - sampleDivDims.width}px)`} :{} ),
            ...( property === "opacity" ? {opacity: `${isDragging ? 0 : 1}`} :{} ),
          }}
        />
      </div>
    </div>
  );
}

export default CssEasing;