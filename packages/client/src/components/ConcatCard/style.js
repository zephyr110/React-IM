import styled from 'styled-components'
import Paragraph from 'components/Paragraph'
import StyledAvatar from 'components/Avatar/style'
import { card } from 'utils/mixins'

const Name = styled(Paragraph).attrs({ size: 'large' })`
    grid-area: name;
`

const Intro = styled(Paragraph).attrs({ size: 'small', type: 'secondary' })`
    grid-area: intro;
`

const StyledConcatCard = styled.div`
    ${card()}
    display: grid;
    grid-template-areas: 
        'avatar name'
        'avatar intro';
    grid-template-columns: 62px auto;
     ${StyledAvatar}{
         grid-area: avatar;
     }
     margin: -70px 0;
     cursor: pointer;
     &:hover {
         background: ${({ theme }) => theme.gray2};
         border-radius: 8px;
     }
`

export default StyledConcatCard
export { Name, Intro }
