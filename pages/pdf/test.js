import { animate, motion, useMotionValue } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useGesture } from "react-use-gesture";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Home() {
  let [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });

  return (
    <>
      <p className="mt-2 text-lg text-center">Image Cropper</p>

      <div className="p-8 mt-2">
        <ImageCropper
          src="https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2700&q=80"
          crop={crop}
          onCropChange={setCrop}
        />

        <div className="mt-6">
          <p>Crop X: {Math.round(crop.x)}</p>
          <p>Crop Y: {Math.round(crop.y)}</p>
          <p>Crop Scale: {Math.round(crop.scale * 100) / 100}</p>
        </div>
      </div>
    </>
  );
}

function ImageCropper({ src, crop, onCropChange }) {
  let x = useMotionValue(crop.x);
  let y = useMotionValue(crop.y);
  let scale = useMotionValue(crop.scale);
  let [isDragging, setIsDragging] = useState(false);
  let [isPinching, setIsPinching] = useState(false);

  let imageRef = useRef();
  let imageContainerRef = useRef();
  useGesture(
    {
      onDrag: ({ dragging, movement: [dx, dy] }) => {
        console.log([dx, dy]);
        setIsDragging(dragging);
        x.stop();
        y.stop();

        let imageBounds = imageRef.current.getBoundingClientRect();
        let containerBounds = imageContainerRef.current.getBoundingClientRect();
        let originalWidth = imageRef.current.clientWidth;
        let widthOverhang = (imageBounds.width - originalWidth) / 2;
        let originalHeight = imageRef.current.clientHeight;
        let heightOverhang = (imageBounds.height - originalHeight) / 2;
        let maxX = widthOverhang;
        let minX = -(imageBounds.width - containerBounds.width) + widthOverhang;
        let maxY = heightOverhang;
        let minY =
          -(imageBounds.height - containerBounds.height) + heightOverhang;

        x.set(dampen(dx, [minX, maxX]));
        y.set(dampen(dy, [minY, maxY]));
      },

      onPinch: ({
        pinching,
        event,
        memo,
        origin: [pinchOriginX, pinchOriginY],
        offset: [d],
      }) => {
        event.preventDefault();
        setIsPinching(pinching);
        x.stop();
        y.stop();

        memo ??= {
          bounds: imageRef.current.getBoundingClientRect(),
          crop: { x: x.get(), y: y.get(), scale: scale.get() },
        };

        let transformOriginX = memo.bounds.x + memo.bounds.width / 2;
        let transformOriginY = memo.bounds.y + memo.bounds.height / 2;

        let displacementX = (transformOriginX - pinchOriginX) / memo.crop.scale;
        let displacementY = (transformOriginY - pinchOriginY) / memo.crop.scale;

        let initialOffsetDistance = (memo.crop.scale - 1) * 200;
        let movementDistance = d - initialOffsetDistance;

        scale.set(1 + d / 200);
        x.set(memo.crop.x + (displacementX * movementDistance) / 200);
        y.set(memo.crop.y + (displacementY * movementDistance) / 200);

        return memo;
      },

      onDragEnd: maybeAdjustImage,
      onPinchEnd: maybeAdjustImage,
    },
    {
      drag: {
        initial: () => [x.get(), y.get()],
      },
      pinch: {
        distanceBounds: { min: 0 },
      },
      domTarget: imageRef,
      eventOptions: { passive: false },
    }
  );

  const onDocumentLoadSuccess = useCallback((data) => {
    setNumPages(data.numPages);
  }, []);

  const onDocumentLoadError = useCallback((data) => {
    console.log(data);
  }, []);

  function maybeAdjustImage() {
    let newCrop = { x: x.get(), y: y.get(), scale: scale.get() };
    let imageBounds = imageRef.current.getBoundingClientRect();
    let containerBounds = imageContainerRef.current.getBoundingClientRect();
    let originalWidth = imageRef.current.clientWidth;
    let widthOverhang = (imageBounds.width - originalWidth) / 2;
    let originalHeight = imageRef.current.clientHeight;
    let heightOverhang = (imageBounds.height - originalHeight) / 2;

    if (imageBounds.left > containerBounds.left) {
      newCrop.x = widthOverhang;
    } else if (imageBounds.right < containerBounds.right) {
      newCrop.x = -(imageBounds.width - containerBounds.width) + widthOverhang;
    }

    if (imageBounds.top > containerBounds.top) {
      newCrop.y = heightOverhang;
    } else if (imageBounds.bottom < containerBounds.bottom) {
      newCrop.y =
        -(imageBounds.height - containerBounds.height) + heightOverhang;
    }

    animate(x, newCrop.x, {
      type: "tween",
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    });
    animate(y, newCrop.y, {
      type: "tween",
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    });
    onCropChange(newCrop);
  }

  return (
    <>
      <div
        className={`relative overflow-hidden bg-black ring-4 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } ring-white aspect-w-4 aspect-h-5`}>
        <div ref={imageContainerRef}>
          <motion.img
            src={src}
            ref={imageRef}
            style={{
              x: x,
              y: y,
              scale: scale,
              touchAction: "none",
              userSelect: "none",
              MozUserSelect: "none",
              WebkitUserDrag: "none",
            }}
            className="relative w-auto h-full max-w-none max-h-none"
          />
          <Document
            className="flex flex-col items-center bg-red-500"
            file="https://storage.googleapis.com/mestredeobra-be796.appspot.com/Projeto%20do%20Sub/cartao_cidadao.pdf?GoogleAccessId=mestredeobra-be796%40appspot.gserviceaccount.com&Expires=4070908800&Signature=kk00GhppQI0r3s9PmRPC7frMBqgmuT0A0e8%2BZ8OvcK2auPxqqWjQ3Q08nyQred9UjJML3Vcfu%2FSzm8bo4zsyzjLdjzNxw%2FupjLBW%2BBIKI5nOUHwYs146wq18SOwqJ%2BL3EuZ%2FimtsBJ1tMWKNpPzE6Z4%2B%2FJffYYVb68PRnaIM45%2BGkwTxRjRJ%2BxUBCwaix6knzomU214wucTllCBUrk%2FW8RAL8Ly%2BhQ5gxMKo9oT8ggrF6RK4Qtd0Uo0MfJr6BdEeY5nt4znKOkqbPps%2FbUtxSzgK2EcbdBSFq2%2FBBhQ0up3umjRkqRKRycZ5ahV%2B%2F07xqTxKCpaH3SkAXHI0NDoSSw%3D%3D"
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}>
            <Page scale={1} pageNumber={1} className="" />
            {/* <Page scale={scale} pageNumber={page + 1} className="m-2" /> */}
          </Document>
          <div
            className={`pointer-events-none absolute inset-0 transition duration-300 ${
              isDragging || isPinching ? "opacity-100" : "opacity-0"
            }`}>
            <div className="absolute inset-0 flex flex-col">
              <div className="self-stretch flex-1 border-b border-gray-50 "></div>
              <div className="self-stretch flex-1 border-b border-gray-50 "></div>
              <div className="self-stretch flex-1"></div>
            </div>
            <div className="absolute inset-0 flex">
              <div className="self-stretch flex-1 border-r border-gray-50 "></div>
              <div className="self-stretch flex-1 border-r border-gray-50 "></div>
              <div className="self-stretch flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function dampen(val, [min, max]) {
  if (val > max) {
    let extra = val - max;
    let dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return max + dampenedExtra * 2;
  } else if (val < min) {
    let extra = val - min;
    let dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return min + dampenedExtra * 2;
  } else {
    return val;
  }
}
