import React from 'react'
import PropTypes from 'prop-types'
import StyledFilterList from './style'
import Input from 'components/Input'
import Filter from 'components/Filter'
import Select from 'components/Select'
import Option from 'components/Option'
import Button from 'components/Button'
import { Plus } from 'lucide-react'

function FilterList ({
    children,
    options,
    filterLabel = '列表排序',
    actionLabel,
    onSearch,
    ...rest
}) {
    return (
        <StyledFilterList {...rest}>
            <Input.Search onChange={(e) => onSearch && onSearch(e.target.value)} />
            <Filter style={{ padding: '20px 0' }}>
                {options && (
                    <Filter.Filters label='列表排序'>
                        <Select>
                            {options.map((option, index) => (
                                <Option key={index}>{option}</Option>
                            ))}
                        </Select>
                    </Filter.Filters>
                )}
                {actionLabel && (
                    <Filter.Action label='创建会话'>
                        <Button>
                            <Plus className="w-3 h-3" />
                        </Button>
                    </Filter.Action>
                )}
            </Filter>
            {children}
        </StyledFilterList>
    )
}

FilterList.propTypes = {
    children: PropTypes.any,
    options: PropTypes.array,
    filterLabel: PropTypes.string,
    actionLabel: PropTypes.string,
    onSearch: PropTypes.func,
}

export default FilterList

