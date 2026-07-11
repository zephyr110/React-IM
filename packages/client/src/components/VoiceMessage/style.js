
import styled, { css } from 'styled-components'
import StyledButton from 'components/Button/style'
import StyledIcon from 'components/Icon/style'
import StyledText from 'components/Text/style'

const typeVariants = {
    mine: css`
        ${StyledButton} {
            background-color: #fff;
            
            ${StyledIcon} path{
                fill: ${({ theme }) => theme.primaryColor};
            }
        }

        & > ${StyledIcon} path{
            fill: #fff;
        }

        & > ${StyledText}{
            color: #fff;
        }
    `
}

const StyledVoiceMessage = styled.div`
    display: flex;
    align-items: center;

    & > *:first-child{
        flex-shrink: 0;
    }

    & > *:not(:first-child){
        margin-left: 16px;
    }

    ${({ type }) => type && typeVariants[type]}
`

export default StyledVoiceMessage

