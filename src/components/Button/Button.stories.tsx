import React, { FC } from "react"

import Button from "./Button"
import Box from "../Box/Box"

export default {
  title: "Core|Button",
  component: Button,
  parameters: {
    order: 2,
    componentSubtitle: "Just a simple Button"
  }
}

export const All: FC = () => (
  <Box backgroundColor="white">
    <Primary />
    <Outline />
    <Secondary />
  </Box>
)
export const Primary: FC = () => <Button variant="primary">Primary</Button>
export const Secondary: FC = () => (
  <Button variant="secondary">Secondary</Button>
)
export const Outline: FC = () => <Button variant="outline">Outline</Button>
