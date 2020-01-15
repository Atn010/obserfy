import React, { FC, useContext } from "react"
import { PageRendererProps } from "gatsby"
import queryString from "query-string"
import { PageTitleContext } from "../../../../layouts"
import SEO from "../../../../components/seo"
import PageNewObservation from "../../../../components/PageNewObservation/PageNewObservation"

const NewObservation: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  let studentId: string
  if (Array.isArray(query?.studentId)) {
    studentId = query?.studentId[0] ?? ""
  } else {
    studentId = query?.studentId ?? ""
  }

  useContext(PageTitleContext).setTitle("New Observation")

  return (
    <>
      <SEO title="New Observation" />
      <PageNewObservation studentId={studentId} />
    </>
  )
}

export default NewObservation
