import React, { FC } from "react"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Dialog from "../Dialog/Dialog"

interface Props {
  onDismiss: () => void
  onAccept: () => void
  title: string
  description: string
  loading?: boolean
}
export const WarningDialog: FC<Props> = ({
  onDismiss,
  title,
  description,
  onAccept,
  loading,
}) => (
  <Dialog maxWidth={["", "maxWidth.xsm"]}>
    <Flex
      alignItems="center"
      backgroundColor="surface"
      sx={{
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Typography.H6
        width="100%"
        sx={{
          position: "absolute",
          pointerEvents: "none",
          textAlign: "center",
          alignContent: "center",
        }}
      >
        {title}
      </Typography.H6>
      <Button
        variant="outline"
        m={2}
        onClick={onDismiss}
        sx={{ flexShrink: 0 }}
      >
        Cancel
      </Button>
      <Spacer />
      <Button m={2} backgroundColor="danger" onClick={onAccept}>
        {loading && <LoadingIndicator />}
        Yes
      </Button>
    </Flex>
    <Typography.Body
      p={3}
      sx={{
        borderBottomColor: "border",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
      }}
    >
      {description}
    </Typography.Body>
  </Dialog>
)

export default WarningDialog
