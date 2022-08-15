import React from "react";
import "./App.css"
import Canvas from './components/canvas';
import ToolBox from './components/toolBox';

const App = () => {
  return (
    <div className='app-wrapper'>
      <ToolBox />
      <main>
        <Canvas />
      </main>
    </div>
  );
}

export default App;
