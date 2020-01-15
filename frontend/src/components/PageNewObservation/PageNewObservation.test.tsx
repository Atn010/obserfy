import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageNewObservation.stories"

describe("PageNewObservation", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
