
import React from 'react'
import PropTypes from 'prop-types'
import StyledFileCard, { FileName, FileSize, Time} from './style'
import { FileArchive, FileSpreadsheet, FileText, FileImage, MoreHorizontal } from 'lucide-react'

const fileIcons = {
    zip: FileArchive,
    excel: FileSpreadsheet,
    word: FileText,
    ppt: FileText,
    image: FileImage,
    pdf: FileText
}

function FileCard ({ children, ...rest }) {
    const IconComponent = fileIcons.zip
    return (
        <StyledFileCard {...rest}>
            <div style={{ gridArea: 'icon', justifySelf: 'start' }}>
                <IconComponent className="w-[60px] h-[60px] text-muted-foreground" />
            </div>
            <FileName>Source Code.zip</FileName>
            <FileSize>1.5M</FileSize>
            <div style={{ gridArea: 'option', justifySelf: 'end', alignSelf: 'center' }}>
                <MoreHorizontal className="w-5 h-5 opacity-30" />
            </div>
            <Time>2020.06.22</Time>
        </StyledFileCard>
    )
}

FileCard.propTypes = {
    children: PropTypes.any
}

export default FileCard


