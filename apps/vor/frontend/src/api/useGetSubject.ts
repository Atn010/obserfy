import { QueryOptions, QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"
import { Subject } from "./useGetAreaSubjects"

export function useGetSubject(
  subjectId: string,
  option: QueryOptions<Subject>
): QueryResult<Subject> {
  const fetchSubjectMaterials = fetchApi<Subject>(
    `/curriculum/subjects/${subjectId}`
  )
  return useQuery(["subject", subjectId], fetchSubjectMaterials, option)
}