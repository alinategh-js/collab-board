import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil'
import activeToolAtom from '../../atoms/activeToolAtom';
import { getToolByName, TOOLS } from '../../config/enums';
import Icon from '../iconMapper';
import { ToolboxWrapper, ToolboxCell } from './style';

interface ToolboxProps {

}

const ToolBox = ({

}) => {

    const [activeTool, setActiveTool] = useRecoilState(activeToolAtom)

    const handleChangeTool = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.currentTarget as HTMLDivElement
        // getting the target's value using data-attributes
        // https://reactjs.org/docs/faq-functions.html#example-passing-params-using-data-attributes
        const value = target.dataset.value as string;
        const tool = getToolByName(value)
        setActiveTool(tool)
    }

    useEffect(() => {

    }, [])

    return (
        <ToolboxWrapper>
            {TOOLS.map((tool, index) => {
                return (
                    // <Tooltip placement="bottom" title={text}>
                    <ToolboxCell
                        data-value={tool.name}
                        key={index}
                        selected={activeTool.name == tool.name}
                        onClick={handleChangeTool}
                    >
                        <Icon name={tool.icon} size={16} />
                    </ToolboxCell>
                    // </Tooltip>
                )
            })}
        </ToolboxWrapper>
    )
}

export default ToolBox;