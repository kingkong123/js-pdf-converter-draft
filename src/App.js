import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { v4 } from 'uuid';

import CanvasToBase64 from './components/canvas-to-base64';

function App() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [showPrint, setShowPrint] = useState(false);

  const handleDropFiles = (_files) => {
    setFiles([]);
    setImages([]);
    setShowPrint(false);

    setTimeout(() => {
      setFiles(_files);
    }, [500]);
  };

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https:////unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    handleDropFiles(acceptedFiles.filter(({ type }) => (type === 'application/pdf')));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleSetImage = (dataUris) => {
    setImages(dataUris);

    setShowPrint(true);
  };

  return (
    <>
      <Box sx={{ display: 'block', displayPrint: 'none' }} {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </Box>
      {showPrint && <Box sx={{ display: 'block', displayPrint: 'block' }}>
        <Grid container spacing={0.5}>
          {images.map((src) => (
            <Grid size={6}>
              <img src={src} style={{ maxWidth: '100%' }} key={v4()} alt="" />
            </Grid>
          ))}
        </Grid>
      </Box>}
      <Box sx={{ visibility: 'hidden', height: '0' }}>
        {files.length > 0 && <CanvasToBase64 files={files} setImages={handleSetImage} />}
      </Box>
    </>
  );
}

export default App;
