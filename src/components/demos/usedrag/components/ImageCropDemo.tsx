import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import useDrag from 'demos/usedrag/useDrag';
import Resize from 'demos/usedrag/Resize';
import { createCheckBoundsWithResize } from 'demos/usedrag/checkbounds/checkBoundsWithResize';
import type { Dim } from 'src/types';
import downloadCanvas from 'src/lib/downloadCanvas';
import Button from 'src/components/general/Button';
import PageSubHeading from 'src/components/general/PageSubHeading';

let initialCreateImageRan = false;

function ImageCropDemo() {
  const dragResizeRef = useRef<HTMLImageElement>( null );
  const boundResizeRef = useRef<HTMLDivElement>( null );
  const [dimension, dimensionSet] = useState<Dim>({width: 0, height: 0, offsetX: 0, offsetY: 0});
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDims, imageDimsSet] = useState<Record<string, Dim>>({
    natural: {
      width: 0,
      height: 0,
    },
    display: {
      width: 0,
      height: 0,
    },
  });

  const {
    transform: transformResize,
    isDragging = false,
  } = useDrag({
    dragElem: dragResizeRef,
    boundElem: boundResizeRef,
    checkBounds: createCheckBoundsWithResize(dimension),
  });
  const [isResizing, isResizingSet] = useState<boolean>( false );

  const updateIsResizing = ( newResizing: boolean ) => {
    isResizingSet( newResizing );
  };

  const imageOnLoad = () => {
    if( imageRef.current ){
      imageDimsSet({
        natural: {
          width: imageRef.current.naturalWidth,
          height: imageRef.current.naturalHeight,
        },
        display: {
          width: imageRef.current.width,
          height: imageRef.current.height,
        },
      });
    }
  };
  const isDraggingPrev = useRef<boolean>( isDragging );
  const isResizingPrev = useRef<boolean>( isResizing );

  const createImage = useCallback(() => {
    const canvas = canvasRef.current;
    if( canvas && imageRef.current ){
      const ctx = canvas.getContext('2d');
      const per = imageDims.natural.width / imageDims.display.width;
      canvas.width = dimension.width * per;
      canvas.height = dimension.height * per;
      canvas.style.transform = `scale(${1/per})`;
      canvas.style.transformOrigin = `left top`;
      let imageY = 0;
      let imageX = 0;
      if( transformResize ){
        imageY += transformResize.y;
        imageX += transformResize.x;
      }
      if( dimension.offsetY ){
        imageY += dimension.offsetY;
      }
      if( dimension.offsetX ){
        imageX += dimension.offsetX;
      }
      ctx?.drawImage(
        imageRef.current,
        imageX * per, imageY * per, dimension.width * per, dimension.height * per,  //source image
        0, 0, canvas.width,  canvas.height,  //canvas
      );
    }
  }, [ dimension.width, dimension.height, dimension.offsetX, dimension.offsetY, imageDims.natural.width, imageDims.display.width, transformResize ]);

  const handleDownload = () => {
    if( canvasRef.current ){
      downloadCanvas( canvasRef.current );
    }
  };

  // Store the latest createImage function in a ref
  const createImageRef = useRef(createImage);
  useEffect(() => {
    createImageRef.current = createImage;
  }, [createImage]);

  useEffect(()=>{
    if( ( isDraggingPrev.current && !isDragging ) || ( isResizingPrev.current && !isResizing ) ){
      createImageRef.current();
    }
    isDraggingPrev.current = isDragging;
    isResizingPrev.current = isResizing;
  }, [isDragging, isResizing]);

  useEffect(()=>{
    if( !initialCreateImageRan ){
      if( dimension.width && imageDims.natural.width ){
        initialCreateImageRan = true;
        createImage();
      }
    }
  }, [createImage, dimension, imageDims]);

  useEffect(()=>{
    return ()=>{
      initialCreateImageRan = false;
    };
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>( null );

  // console.log( transformResize );
  const backgroundPositionString = transformResize
    ? `${-transformResize.x - (dimension.offsetX || 0)}px ${-transformResize.y - (dimension.offsetY || 0)}px`
    : `${0 - (dimension?.offsetX || 0)}px ${0 - (dimension?.offsetY || 0)}px`;

  return (
    <div className="group">
      <PageSubHeading
        className="mt-8"
      >
        {`Original Image (${imageDims.natural.width}px x ${imageDims.natural.height}px)`}
      </PageSubHeading>
      <div
        className="mt-2"
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
          onLoad={imageOnLoad}
          src={`${import.meta.env.BASE_URL}attachment.jpg`}
          style={{
            inset: 0,
            width: "100%",
            height: "auto",
            display: "block",
            opacity: 0.4
          }}
          draggable={false}
          ref={imageRef}
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
        {imageDims.natural.width && <Resize
          parentRef={boundResizeRef as RefObject<HTMLElement>}
          ref={dragResizeRef}
          resizemeStyles={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 600,
            height: 600 * imageDims.natural.height / imageDims.natural.width,
            backgroundImage: `url("${import.meta.env.BASE_URL}attachment.jpg")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: backgroundPositionString,
            backgroundSize: "600px"
          }}
          updateDims={dimensionSet}
          updateIsResizing={updateIsResizing}
          parentTransform={transformResize || undefined}
        >
        </Resize>}
      </div>
      <PageSubHeading
        className="mt-8"
      >
        Final Image ({Math.ceil( dimension.width * (imageDims.natural.width / imageDims.display.width) )}px x {Math.ceil( dimension.height * (imageDims.natural.height / imageDims.display.height) )}px)
      </PageSubHeading>
      <div
        className="mt-0"
      >
        <Button
          className="rounded-b-none"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
      <div
        className="overflow-hidden"
        style={{
          width: `${dimension.width}px`,
          height: `${dimension.height}px`
        }}
      >
        <canvas
          className=""
          ref={canvasRef}
        />
      </div>
    </div>
  );
}

export default ImageCropDemo;
