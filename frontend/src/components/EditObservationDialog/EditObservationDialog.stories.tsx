import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import EditObservationDialog from "./EditObservationDialog"

export default {
  title: "Core|EditObservationDialog",
  component: EditObservationDialog,
  parameters: {
    componentSubtitle: "Just a simple EditObservationDialog",
  },
}

export const Basic: FC = () => (
  <EditObservationDialog
    onCancel={action("cancel")}
    onConfirm={action("confirm")}
  />
)