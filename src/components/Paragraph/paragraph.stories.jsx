
import React from 'react'
import Paragraph from '.';

export default {
    title: '排版/ Paragraph',
    component: Paragraph
}

export const Default = () => (
    <>
        <Paragraph> This is the first paragraph </Paragraph>
        <Paragraph type='secondary'> This is the second paragraph (secondary color) </Paragraph>
        <Paragraph type='danger'> This is the third paragraph (danger color) </Paragraph>
    </>
)

export const Ellipsis = () => (
    <Paragraph ellipsis> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae ut aliquam molestias eaque consectetur incidunt tempore explicabo porro numquam voluptatum fugit, rerum reprehenderit asperiores! Iure quibusdam obcaecati tempore delectus quos quas velit, laudantium laborum nihil accusamus non tenetur cupiditate dolorem eum repudiandae. Provident quam aperiam porro, illum officia sunt dolor, veniam magni eligendi, inventore nisi voluptates pariatur maiores. Assumenda minus dolorem facere nobis sapiente accusantium fugiat porro, neque aliquid tempore expedita ab quia qui, nemo dicta. Autem possimus eligendi laboriosam numquam esse, debitis quae assumenda deleniti quod praesentium aspernatur! Quis dolor iste quidem ullam cum architecto eos nostrum doloremque magni? </Paragraph>
)
