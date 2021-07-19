import { Meta, Story } from '@storybook/react'
import React from 'react'

import App from '../example/todos/index'

const TodoStoryMeta: Meta = {
  component: App,
  title: 'Example/Todo'
}

export default TodoStoryMeta

const Template: Story = args => <App {...args} />

export const Primary = Template.bind({})

Primary.args = {
}
