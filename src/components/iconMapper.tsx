import React from 'react';
import { Color, IIndexable } from '../config/types';
import * as FontAwesome from "react-icons/fa";

interface IconInterface {
    name: string,
    size: number,
    color?: Color,
    onClick?: () => any
}

const Icon = ({
    name,
    size,
    color,
    onClick
}: IconInterface) => {
    const icon = React.createElement((FontAwesome as IIndexable)[name]);
    return (
        <div 
            onClick={onClick} 
            style={{ 
                fontSize: size, 
                color: color,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>{icon}</div>
    );
}

export default Icon;