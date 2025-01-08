import React, { useState, useRef } from 'react';
import { inputTextStyle } from './inputStyles';
export function ImageField ({initialImage, name, onChange, textLabel="Imagen" }) {
  const [imageUrl, setImageUrl] = useState(initialImage); // URL inicial de la imagen
  const hiddenInputRef = useRef();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {

    const fileUrl = URL.createObjectURL(selectedFile);
    onChange(event)
    setImageUrl(fileUrl);
    }
  };

  const delegateClick = () => {
    hiddenInputRef.current.click();
  };
 

  return (
    <div className="image-uploader">
      {/* Mostrar la imagen solo si hay una URL */}
      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{textLabel}</span>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Selected"
          className="w-32 h-32 object-cover rounded-lg mb-3 shadow"
        />
      )}

      {/* Visible "input" for uplaod image */}
      <label
        onClick={delegateClick} 
        className="block cursor-pointer">
        <span className={inputTextStyle}>Seleccionar imagen</span>
      </label>

        <input
          ref={hiddenInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          name={name}
        />
    </div>
  );
};
