import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import StyledInput, { InputContainer, Prefix, Suffix, StyledTextArea } from './style'
import { Search as SearchIcon } from 'lucide-react'
import InputText from './InputText'

const Input = forwardRef(function Input ({ placeholder = '请输入内容', prefix, suffix, multiline, ...rest }, ref) {
    return (
        <InputContainer>
            {prefix && <Prefix>{prefix}</Prefix>}
            {multiline ? (
                <StyledTextArea ref={ref} placeholder={placeholder} rows={1} {...rest} />
            ) : (
                <StyledInput ref={ref} placeholder={placeholder} {...rest} />
            )}
            {suffix && <Suffix>{suffix}</Suffix>}
        </InputContainer>
    )
})

function Search ({ placeholder = '请输入搜索内容', ...rest }) {
    return (
        <Input
            {...rest}
            placeholder={placeholder}
            prefix={<SearchIcon className="w-[18px] h-[18px] text-muted-foreground" />}
        />
    )
}

Input.Search = Search
Input.Text = InputText

Input.propTypes = {
    placeholder: PropTypes.string,
    prefix: PropTypes.any,
    suffix: PropTypes.any,
    multiline: PropTypes.bool,
}

export default Input
