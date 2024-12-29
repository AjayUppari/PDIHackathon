import React, { useEffect } from 'react';

function EventHeader({ eventName }) {
  // const {name}=eventName;
  // useEffect(()=>console.log("Event Name",eventName),[])
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{eventName}</h1>
    </div>
  );
}

export default EventHeader;