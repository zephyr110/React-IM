import styled from 'styled-components'
import Heading from 'components/Heading'
import Paragraph from 'components/Paragraph'
import { card } from 'utils/mixins'

const FileName = styled(Heading).attrs({ level: 2 })`
    grid-area: name;
    align-self: center;
`

const FileSize = styled(Paragraph).attrs({ type: 'secondary', size: 'small' })`
    grid-area: size;
`

const Time = styled(Paragraph).attrs({ type: 'secondary', size: 'small' })`
    grid-area: time;
    justify-self: end;
`

const StyledFileCard = styled.div`
    ${card()}
    display: grid;
    grid-template-areas:
        'icon name option'
        'icon size time';
        grid-template-columns: 74px 1fr 1fr;
`

export default StyledFileCard
export { FileName, FileSize, Time }
