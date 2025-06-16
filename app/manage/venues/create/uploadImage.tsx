import { useRef, useState, useEffect } from 'react';

export default function UploadImage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <div>
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64 w-full max-w-md mx-auto">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected"
            className="max-h-full max-w-full object-contain mx-auto"
          />
        ) : (
          <p className="text-gray-500 mx-2">
            {selectedFile ? selectedFile.name : 'No image uploaded'}
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleButtonClick}
          className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Choose File
        </button>
      </div>
    </div>
  );
}
