import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Flex.stories"

describe("Flex", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
