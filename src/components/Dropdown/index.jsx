
import React from 'react'
import PropTypes from 'prop-types'
import StyledDropdown, { DropdownContainer } from './style'
import { useState } from 'react'

function Dropdown ({
    content,
    align = 'right',
    children,
    ...rest
}) {
    const [visible, setVisible] = useState(false)

    return (
        <StyledDropdown onClick={() => setVisible(!visible)} {...rest}>
            {content && (
                <DropdownContainer align={align} visible={visible}>
                    {content}
                </DropdownContainer>
            )}
            {children}
        </StyledDropdown>
    )
}

Dropdown.propTypes = {
    children: PropTypes.any,
    content: PropTypes.any,
    align: PropTypes.oneOf(['top', 'left', 'bottom', 'right'])
}

export default Dropdown


