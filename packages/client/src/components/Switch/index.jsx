import React from 'react'
import PropTypes from 'prop-types'
import StyledSwitch, { Checkbox, Slider } from './style'

function Switch ({checked, onChange, children, ...rest}) {
    return (
        <StyledSwitch {...rest}>
            <Checkbox checked={checked} onChange={(e) => onChange && onChange(e.target.checked)} />
            <Slider />
        </StyledSwitch>
    )
}

Switch.propTypes = {
    children: PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func
}

export default Switch
