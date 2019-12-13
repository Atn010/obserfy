import React, { FC } from "react"
import Box, { BoxProps } from "../Box/Box"
import Typography from "../Typography/Typography"

interface Props extends BoxProps {
  text: string
}
export const Pill: FC<Props> = ({ sx, color, text, ...props }) => {
  let sxStyle = sx
  sxStyle = Object.assign(sxStyle || {}, {
    borderColor: "border",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: "circle",
  })
  return (
    <Box py={1} px={2} sx={sxStyle} {...props}>
      <Typography.Body
        lineHeight="1em"
        fontSize={0}
        color={color}
        sx={{ textTransform: "capitalize" }}
      >
        {text}
      </Typography.Body>
    </Box>
  )
}

export default Pill
