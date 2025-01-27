import React, { useEffect, useState } from 'react';

import Canvas from './canvas';

const getReader = () => {
  const reader = new FileReader();
  reader.onabort = () => console.log('file reading was aborted');
  reader.onerror = () => console.log('file reading has failed');

  return reader;
};

const getBase64Image = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = getReader();

    reader.onload = () => {
      const [, base64] = reader.result.split('base64,');

      return resolve(base64);
    };

    reader.readAsDataURL(file);
  });
};

const CanvasToBase64 = (props) => {
  const { files, setImages: imagesResult } = props;

  const [idx, setIdx] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (files.length > 0) {
      getBase64Image(files[idx]).then((base64) => {
        setCurrentFile(base64);
        setIdx(idx + 1);
      });
    }
  }, []);

  useEffect(() => {
    if (files.length === images.length) {
      imagesResult(images);
    }
  }, [files, images]);

  const handleSetImage = (dataUri) => {
    setImages([...images, dataUri]);

    if (idx < files.length) {
      setCurrentFile(null);

      setTimeout(async () => {
        const base64 = await getBase64Image(files[idx]);

        setCurrentFile(base64);
        setIdx(idx + 1);
      }, 100);
    } else {
      setCurrentFile(null);
    }
  };

  if (currentFile !== null) {
    return <Canvas file={currentFile} setImage={handleSetImage} />;
  }

  return (<></>)
};

export default CanvasToBase64;
