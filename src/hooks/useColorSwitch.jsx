import React, { useState } from 'react';
function useColorSwitch (initColor = '#fff', curColor = '#000') { 
    const [color, setColor] = useState(initColor);

    const handleClick = () => {
        console.log('this is a button')
        setColor(curColor)
    };
    return [color, handleClick]
}

export default useColorSwitch
