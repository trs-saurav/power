import React from 'react';

const Map = ({ embedUrl }) => {
  return (
    <iframe
      src={embedUrl}
      className='w-full h-full rounded-lg shadow-lg border-0'
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default Map;
