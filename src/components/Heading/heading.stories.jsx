
import React from 'react'
import Heading from '.';

export default {
    title: '排版/ Heading',
    component: Heading
}

export const Default = () => {
    return <Heading> Default </Heading>
}

export const H1 = () => {return <Heading level={1}> H1标题 </Heading>}

export const H2 = () => {return <Heading level={2}> H2标题 </Heading>}

export const H3 = () => {return <Heading level={3}> H3标题 </Heading>}

export const H4 = () => {return <Heading level={4}> H4标题 </Heading>}

export const H5 = () => {return <Heading level={5}> H5标题 </Heading>}

export const H6 = () => {return <Heading level={6}> H6标题 </Heading>}
