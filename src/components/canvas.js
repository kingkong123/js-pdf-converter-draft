import React, { useRef, useEffect, useState } from 'react';

import * as pdfjsLib from 'pdfjs-dist/build/pdf';

const Canvas = ({
  file: base64, setImage, ...props
}) => {
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const task = pdfjsLib.getDocument({ data: atob(base64) });

    task.promise.then(async (pdf) => {
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 2 });

      setHeight(viewport.height / 4);
      setWidth(viewport.width / 2);

      const renderContext = {
        canvasContext: context,
        viewport
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;

      setImage(canvas.toDataURL());
    });
  }, []);

  return <canvas ref={canvasRef} {...props} height={height} width={width} />
}

export default Canvas;
