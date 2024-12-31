import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ImageCanvas } from './components/ImageCanvas';
import { FilterControls } from './components/FilterControls';
import { Dropzone } from './components/Dropzone';
import { Toolbar } from './components/Toolbar';
import { ImageState, Crop } from './types';
import AdditionalImage from './additional-image.png';
import 'tailwindcss/tailwind.css';

const defaultFilters: ImageState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
  grayscale: 0,
  hueRotate: 0,
  opacity: 100,
  vibrance: 0,
  exposure: 0,
  sharpen: 0,
  noise: 0,
  pixelate: 1,
  temperature: 0,
  tint: 0,
};

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<ImageState>(defaultFilters);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  //.......estados para rotación...
  const [rotation, setRotation] = useState(0); //....grados

  //.......funciones de rotación...
  const handleRotateLeft = () => {
    if (!image) {
      toast.error('Please upload an image to start.');
      return;
    }
    setRotation(prev => prev - 90);
    toast.success('Image rotated 90° to the right.');
  };

  const handleRotateRight = () => {
    if (!image) {
      toast.error('Please upload an image to start.');
      return;
    }
    setRotation(prev => prev + 90);
    toast.success('Image rotated 90° to the left.');
  };

  const handleImageUpload = (imageData: string) => {
    setImage(imageData);
    setOriginalImage(imageData); 
    toast.success('Image uploaded successfully!');
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      toast.error('Canvas not found for download.');
      return;
    }

    const link = document.createElement('a');
    link.download = 'imagen-editada.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Your Image downloaded successfully!');
  };

  const handleReset = () => {
    if (!image) {
      toast.error('Please upload an image to start.');
      return;
    }
    if (originalImage) {
      setImage(originalImage);        //....Restaurar la imagen original
    }
    setFilters(defaultFilters);
    setZoom(1);
    setCrop(null);
    setIsCropping(false);
    setRotation(0);
    toast.success('Settings have been reset to default values.');
  };

  const handleZoomIn = () => {
    if (!image) {
      toast.error('Please upload an image to start.');
      return;
    }
    setZoom(prev => Math.min(prev + 0.1, 3));
  }
  const handleZoomOut = () => {
    if (!image) {
      toast.error('Please upload an image to start.');
      return;
    }
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  }

  const toggleCrop = () => {
    if (!image) {
      toast.error('Please upload an image to start.');
      return;
    }
    setIsCropping(prev => !prev);
    if (!isCropping) {
      setCrop(null);
    }
  };

  const handleCropComplete = (newCrop: Crop) => {
    //....Actualizar la imagen con la porción recortada
    setImage(newCrop.image);
    setCrop(newCrop);
    setIsCropping(false);
    toast.success('Crop was successful!');
  };

  const handleRestart = () => {
    handleReset();
    setImage(null);
    toast.success('Now you can upload a new image.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet"></link>
      <div className="container mx-auto">
        {/* ...encabezado con botones de herramientas... */}
        <header className="header flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img src={AdditionalImage} alt="Additional Image" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-gray-900">FECODITOR (Free & Simple Image Editor)</h1>
          </div>
          <div className="flex space-x-2">
            <button className="button-primary" onClick={handleDownload}>Download your image</button>
            <button className="button-secondary" onClick={handleRestart}>Reset image selection</button>
          </div>
        </header>
        
        {/* ...separador... */}
        <hr className="separator mb-6" />

        {/* ...texto de información... */}
        <div className="text text-gray-500 mb-2">
        Your image is not saved in any server, it is only stored in your browser's memory while you are using the editor.
        </div>
        <hr className="separator mb-6" />

        {/* ...contenido main... */}
        <main className="flex flex-col lg:flex-row lg:space-x-8">
          {/* ...área de la img... */}
          <div className="flex-1 mb-6 lg:mb-0">
            {!image ? (
              <Dropzone onImageUpload={handleImageUpload} />
            ) : (
              <ImageCanvas
                rotation={rotation}
                image={image}
                filters={filters}
                crop={crop}
                zoom={zoom}
                isCropping={isCropping}
                onCropComplete={handleCropComplete}
                flipHorizontal={false}
                flipVertical={false}
              />
            )}
          </div>

          {/* ...controles... */}
          <aside className="w-full lg:w-1/3">
            <Toolbar
              onRotateLeft={handleRotateLeft}
              onRotateRight={handleRotateRight}
              onReset={handleReset}
              onDownload={handleDownload}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onToggleCrop={toggleCrop}
              isCropping={isCropping}
            />

            <hr className="separator my-6" />

            <FilterControls
              filters={filters}
              onChange={setFilters}
            />
          </aside>
        </main>

        <hr className="separator my-6" />

        {/* ...pie de página... */}
        <footer className="footer text-center text-gray-500">
          <p>&copy; 2024 FECODITOR. Desarrollado por Felipe Alexander Correa Rodríguez. Todos los derechos reservados.</p>
        </footer>
      </div>
      <Toaster position="bottom-left" />
    </div>
  );
}

export default App;