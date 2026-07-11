
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import StyledDropdown, { DropdownContainer } from './style'

function Dropdown ({ content, align = 'right', children, ...rest }) {
    const [visible, setVisible] = useState(false)

    const handleToggle = () => setVisible(!visible)

    const handleClose = () => setVisible(false)

    return (
        <StyledDropdown onClick={handleToggle} {...rest}>
            {content && (
                <DropdownContainer align={align} visible={visible} onClick={handleClose}>
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
