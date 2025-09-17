import React from 'react';



const Map = ({ embedUrl }) => {
  return (
    <iframe
      src={embedUrl}
      width="200"
      height="180"
      className='rounded-lg shadow-lg '
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default Map;