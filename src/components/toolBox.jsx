import React, { useEffect } from 'react';
import "./toolBox.css"
import { useRecoilState } from 'recoil'
import activeToolAtom from '../atoms/activeToolAtom';
import { TOOLS } from '../utils/enums';

const test = "test"

const ToolBox = ({

}) => {
    const [activeTool, setActiveTool] = useRecoilState(activeToolAtom)

    const handleChangeTool = (event) => {
        const value = event.target.value;
        setActiveTool(value)
    }

    useEffect(() => {
        
    }, [])

    return (
        <div className='toolbox-wrapper'>
            {TOOLS.map((tool, index) => {
                return (
                    <button
                        value={tool.name}
                        key={index}
                        style={{
                            backgroundColor: activeTool == tool.name ? 'green' : ''
                        }}
                        onClick={handleChangeTool}
                    >
                        {tool.name}
                    </button>
                )
            })}
        </div>
    )
}

export default ToolBox;