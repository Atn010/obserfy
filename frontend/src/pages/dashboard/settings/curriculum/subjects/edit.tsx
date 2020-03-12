import React, { FC } from "react"
import SEO from "../../../../../components/seo"
import { useQueryString } from "../../../../../hooks/useQueryString"
import PageEditSubject from "../../../../../components/PageEditSubject/PageEditSubject"

export const EDIT_SUBJECT_URL = (areaId: string, subjectId: string): string =>
  `/dashboard/settings/curriculum/subjects/edit?subjectId=${subjectId}&areaId=${areaId}`

const EditSubject: FC = () => {
  const subjectId = useQueryString("subjectId")
  const areaId = useQueryString("areaId")

  return (
    <>
      <SEO title="Edit Material" />
      <PageEditSubject subjectId={subjectId} areaId={areaId} />
    </>
  )
}

export default EditSubject
