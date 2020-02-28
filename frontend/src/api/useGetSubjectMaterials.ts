import useOldApiHook from "./useOldApiHook"

export interface Material {
  id: string
  name: string
  order: number
}
export function useGetSubjectMaterials(
  subjectId: string
): [Material[], boolean, () => void] {
  const [material, loading, setOutdated] = useOldApiHook<Material[]>(
    `/curriculum/subjects/${subjectId}/materials`
  )
  return [material ?? [], loading, setOutdated]
}