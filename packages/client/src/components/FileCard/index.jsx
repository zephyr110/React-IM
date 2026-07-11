
import React from 'react'
import PropTypes from 'prop-types'
import StyledFileCard, { FileIcon, FileName, FileSize, Options, Time} from './style'
import FileZip from 'assets/icons/fileZip.svg?react'
import FileExcel from 'assets/icons/fileExcel.svg?react'
import FileWord from 'assets/icons/fileWord.svg?react'
import FilePpt from 'assets/icons/filePpt.svg?react'
import FileImage from 'assets/icons/fileImage.svg?react'
import FilePdf from 'assets/icons/filePdf.svg?react'
import OptionsIcons from 'assets/icons/options.svg?react'
import Icon from 'components/Icon'

const fileIcons = {
    zip: FileZip,
    excel: FileExcel,
    word: FileWord,
    ppt: FilePpt,
    image: FileImage,
    pdf: FilePdf
}

function FileCard ({ children, ...rest }) {
    return (
        <StyledFileCard {...rest}>
            <FileIcon icon={fileIcons.zip} />
            <FileName>Source Code.zip</FileName>
            <FileSize>1.5M</FileSize>
            <Options>
                <Icon icon={OptionsIcons} opacity={0.3}/>
            </Options>
            <Time>2020.06.22</Time>
            {/* {children} */}
        </StyledFileCard>
    )
}

FileCard.propTypes = {
    children: PropTypes.any
}

export default FileCard


