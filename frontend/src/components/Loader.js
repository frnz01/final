import React, { useState, CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";

function Loader() {
  let [loading, setLoading] = useState(true);

  return (
    <div style={{marginTop: '150px' ,marginLeft: '150px'}}>
      <div className="sweet-loading text-center">
        <RingLoader
          color='#000'
          loading={loading}
          css=''
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}

export default Loader;
