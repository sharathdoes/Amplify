import React, { useEffect } from 'react';
import { trefoil } from 'ldrs';

// Register the Web Component
trefoil.register();

function LoadingComponent(props) {
  useEffect(() => {
    // Ensure the custom element is registered
    trefoil.register();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <l-trefoil
        size={props.size || "100"} // Set a large size
        stroke={props.stroke || "4"}
        stroke-length={props.strokeLength || "0.15"}
        bg-opacity={props.bgOpacity || "0.1"}
        speed={props.speed || "1.4"}
        color={props.color || "black"}
      ></l-trefoil>
    </div>
  );
}

export default LoadingComponent;
