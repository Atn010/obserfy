import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Chip.stories"

describe("Chip", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
