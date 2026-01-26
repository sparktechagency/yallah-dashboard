import React from "react";

const Loader = () => {
  return (
    <div className="flex-center min-h-screen items-center">
      <section className="loader">
        <div className="slider" style={{ "--i": 0 }}></div>
        <div className="slider" style={{ "--i": 1 }}></div>
        <div className="slider" style={{ "--i": 2 }}></div>
        <div className="slider" style={{ "--i": 3 }}></div>
        <div className="slider" style={{ "--i": 4 }}></div>
      </section>
    </div>
  );
};

export default Loader;
