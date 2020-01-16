import React, { FC } from "react"
import { animated, useTransition } from "react-spring"
import Card from "../Card/Card"
import { Flex } from "../Flex/Flex"
import { BoxProps } from "../Box/Box"

interface Props extends BoxProps {
  shown: boolean
}
export const Dialog: FC<Props> = ({ shown, ...componentProps }) => {
  const transition = useTransition(shown, null, {
    from: {
      position: "absolute",
      opacity: 0,
      zIndex: 1000001,
    },
    enter: { opacity: 1, marginBottom: 0 },
    leave: { opacity: 0, marginBottom: -100 },
  })

  const dialog = transition.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props}>
          <DialogElement {...componentProps} />
        </animated.div>
      )
  )
  return <>{dialog}</>
}

const DialogElement: FC<BoxProps> = props => (
  <Flex
    flexDirection="column-reverse"
    alignItems={["", "center"]}
    justifyContent={["", "center"]}
    backgroundColor="overlay"
    width="100%"
    height="100%"
    p={[0, 3]}
    sx={{ top: 0, left: 0, zIndex: 1000001, position: "fixed" }}
  >
    <Card
      backgroundColor="surface"
      maxWidth="maxWidth.sm"
      width="100%"
      borderRadius={[0, "default"]}
      {...props}
    />
  </Flex>
)

export default Dialog
