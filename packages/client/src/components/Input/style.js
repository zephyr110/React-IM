
import styled from 'styled-components'

const StyledInput = styled.input`
    outline: none;
    width: 100%;
    height: 48px;
    border: none;
    background: none;
    color: ${({ theme }) => theme.grayDark};
    font-size: ${({ theme }) => theme.medium};
    display: block;
    &::placeholder{
        color: ${({ theme }) => theme.gray3};
    }
`

const StyledTextArea = styled.textarea`
    outline: none;
    width: 100%;
    min-height: 48px;
    max-height: 120px;
    border: none;
    background: none;
    color: ${({ theme }) => theme.grayDark};
    font-size: ${({ theme }) => theme.medium};
    display: block;
    resize: none;
    padding: 12px 0;
    font-family: inherit;
    line-height: 1.5;
    &::placeholder {
        color: ${({ theme }) => theme.gray3};
    }
`

const Prefix = styled.div`
    margin-right: 16px;
`

const Suffix = styled.div`
    margin-left: 16px;
`

const InputContainer = styled.div`
   display: flex;
   align-items: center;
   background: ${({ theme }) => theme.gray2};
   border-radius: 24px;
   padding: 0 30px; 
`

export default StyledInput

export { Prefix, Suffix, InputContainer, StyledTextArea }
