import React from 'react'
import PropTypes from 'prop-types'
import StyledInput, { InputContainer, Prefix, Suffix } from './style'
import Icon from 'components/Icon'
import SearchIcon from 'assets/icons/search.svg?react'
import { useTheme } from 'styled-components'
import InputText from './InputText'

function Input ({ placeholder = '请输入内容', prefix, suffix, ...rest }) {
    return (
        <InputContainer>
            {prefix && <Prefix>{prefix}</Prefix>}
            <StyledInput placeholder={placeholder} {...rest} />
            {suffix && <Suffix>{suffix}</Suffix>}
        </InputContainer>
    )
}

function Search ({ placeholder = '请输入搜索内容', ...rest }) {
    const theme = useTheme()
    return (
        <Input
            placeholder={placeholder}
            prefix={<Icon icon={SearchIcon} color={theme.gray3} width={18} height={18} />}
        />
    )
}

Input.Search = Search
Input.Text = InputText

Input.propTypes = {
    placeholder: PropTypes.string,
    prefix: PropTypes.any,
    suffix: PropTypes.any
}

export default Input


