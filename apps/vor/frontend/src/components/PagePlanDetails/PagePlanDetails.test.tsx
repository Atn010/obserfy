import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PagePlanDetails.stories"

describe("PagePlanDetails", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
