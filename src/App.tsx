import React from "react";
import "./App.css"
import Canvas from './components/canvas';
import MapCanvas from "./components/mapCanvas";
import ToolBox from './components/toolBox';

const App = () => {
  return (
    <div className='app-wrapper'>
      <ToolBox />
      <main>
        <Canvas />
        {/* <MapCanvas /> */}
      </main>
    </div>
  );
}

export default App;
