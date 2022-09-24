import React from "react";
import "./App.css"
import Canvas from './components/canvas/canvas';
import MapCanvas from "./components/mapCanvas";
import ToolBox from './components/toolbox/toolBox';

const App = () => {
  return (
    <div className='app-wrapper'>
      <div className="toolbox-wrapper">
        <ToolBox />
      </div>
      <main>
        <Canvas />
        <MapCanvas />
      </main>
    </div>
  );
}

export default App;
