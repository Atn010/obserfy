export const NEW_STUDENT_URL = "/dashboard/observe/students/new"
export const SETTINGS_URL = "/dashboard/settings"
export const NEW_CLASS_URL = "/dashboard/settings/class/new"
export const CLASS_SETTINGS_URL = "/dashboard/settings/class"
export const OBSERVE_PAGE_URL = "/dashboard/observe"

export const CURRICULUM_AREA_URL = (areaId: string): string =>
  `/dashboard/settings/curriculum/area?id=${areaId}`

export const NEW_SUBJECT_URL = (areaId: string): string =>
  `/dashboard/settings/curriculum/subjects/new?areaId=${areaId}`

export const EDIT_SUBJECT_URL = (areaId: string, subjectId: string): string =>
  `/dashboard/settings/curriculum/subjects/edit?subjectId=${subjectId}&areaId=${areaId}`

export const EDIT_CLASS_URL = (classId: string): string =>
  `/dashboard/settings/class/edit?classId=${classId}`

export const STUDENT_DETAILS_PAGE_URL = (studentId: string): string =>
  `/dashboard/observe/students/details?id=${studentId}`

export const ALL_OBSERVATIONS_PAGE_URL = (studentId: string): string =>
  `/dashboard/observe/students/observations/all?studentId=${studentId}`

export const PICK_GUARDIAN_URL = "/dashboard/observe/students/guardians/pick"