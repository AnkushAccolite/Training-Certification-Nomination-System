import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const UploadWidget = ({ setUrl, setFilename }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const [uploadedFileName, setUploadedFileName] = useState('');

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET
      },
      function (error, result) {
        if (result.event === 'queues-end') {
          setUrl(result.data.info.files[0].uploadInfo.secure_url);
          setFilename(result.data.info.files[0].name);
          setUploadedFileName(result.data.info.files[0].name);
        }
      }
    );
  }, []);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
  }, []);
  return (
    <div style={{ margin: '20px auto', textAlign: 'center' }}>
      <Button onClick={() => widgetRef.current.open()} variant="contained" color="primary" component="span" style={{ margin: 'auto' }}>
        Choose File
      </Button>
      <span style={{ marginLeft: '10px' }}>
        <b>{uploadedFileName}</b>
      </span>
    </div>
  );
};

export default UploadWidget;
