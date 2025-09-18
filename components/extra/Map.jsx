import React from 'react';



const Map = ({ embedUrl }) => {
  return (
    <iframe
      src={embedUrl}
      width='full'
      height='full'
      className='rounded-lg shadow-lg '
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default Map;