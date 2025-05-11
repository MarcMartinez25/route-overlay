import { processGpxFile, processFitFile, processImageFile, GpsData } from './helpers';

interface HandlersProps {
  onGpsDataReceived: (data: GpsData[]) => void;
  onBackgroundImageReceived: (imageUrl: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setGpxFileName: (fileName: string | null) => void;
  setImageFileName: (fileName: string | null) => void;
}

export const createHandlers = ({
  onGpsDataReceived,
  onBackgroundImageReceived,
  setIsProcessing,
  setGpxFileName,
  setImageFileName,
}: HandlersProps) => {
  const handleGpsFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setGpxFileName(file.name);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (fileExtension === 'fit') {
        await processFitFile(file);
      } else if (fileExtension === 'gpx') {
        const gpsData = await processGpxFile(file);
        onGpsDataReceived(gpsData);
      } else {
        alert('Please upload a .fit or .gpx file');
        setGpxFileName(null);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred while processing the file');
      setGpxFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    try {
      const imageUrl = await processImageFile(file);
      onBackgroundImageReceived(imageUrl);
    } catch (error) {
      alert('An error occurred while processing the image');
      setImageFileName(null);
    }
  };

  const handleClear = () => {
    onGpsDataReceived([]);
    onBackgroundImageReceived('');
    setGpxFileName(null);
    setImageFileName(null);
    setIsProcessing(false);
  };

  return {
    handleGpsFileUpload,
    handleImageUpload,
    handleClear,
  };
}; 