import { QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"

export interface Area {
  id: string
  name: string
}
export function useGetArea(areaId: string): QueryResult<Area, {}> {
  const fetchArea = fetchApi<Area>(`/curriculum/areas/${areaId}`)
  return useQuery<Area, {}>(["areas", areaId], fetchArea)
}
