import React, { FC, useState } from "react"
import { Button, Flex, Box, Card } from "theme-ui"
import { Link } from "../Link/Link"
import Spacer from "../Spacer/Spacer"
import Typography from "../Typography/Typography"

import Tab from "../Tab/Tab"
import StudentMaterialProgressDialog from "../StudentMaterialProgressDialog/StudentMaterialProgressDialog"

import InformationalCard from "../InformationalCard/InformationalCard"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import {
  MaterialProgress,
  MaterialProgressStage,
  useGetStudentMaterialProgress,
} from "../../api/useGetStudentMaterialProgress"
import MaterialProgressItem from "./MaterialProgressItem"

interface Props {
  studentId: string
}
export const StudentProgressSummaryCard: FC<Props> = ({ studentId }) => {
  const [tab, setTab] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [selected, setSelected] = useState<MaterialProgress>()
  const areas = useGetCurriculumAreas()
  const progress = useGetStudentMaterialProgress(studentId)

  // Derived state
  const selectedAreaId = areas.data?.[tab]?.id
  const inSelectedArea = progress.data?.filter(
    (p) => p.areaId === selectedAreaId
  )
  const inProgress = inSelectedArea?.filter(
    ({ stage }) =>
      stage >= MaterialProgressStage.PRESENTED &&
      stage < MaterialProgressStage.MASTERED
  )
  const recentlyMastered = inSelectedArea?.filter(
    ({ stage }) => stage === MaterialProgressStage.MASTERED
  )

  const isFetchingData =
    areas.status === "loading" || progress.status === "loading"
  const isAreaEmpty = (areas.data?.length ?? 0) < 1
  const isProgressEmpty = (inProgress?.length ?? 0) === 0

  // Loading view
  if (isFetchingData && isAreaEmpty) {
    return (
      <Box mt={3}>
        <LoadingPlaceholder
          sx={{ height: "17rem", width: "100%", borderRadius: [0, "default"] }}
        />
      </Box>
    )
  }

  // Disabled curriculum view
  if (!isFetchingData && isAreaEmpty) {
    return (
      <Box mx={[0, 3]}>
        <InformationalCard
          message="You can enable the curriculum feature to track student progress in your curriculum."
          buttonText=" Go to Curriculum "
          to="/dashboard/settings/curriculum"
        />
      </Box>
    )
  }

  // Fully functional view
  const emptyProgressPlaceholder = isProgressEmpty && (
    <Typography.Body
      my={4}
      sx={{
        fontSize: 1,
        width: "100%",
        textAlign: "center",
      }}
      color="textMediumEmphasis"
    >
      No materials in progress.
    </Typography.Body>
  )

  const listOfInProgress = inProgress?.map((item) => (
    <MaterialProgressItem
      key={item.materialId}
      value={item}
      onClick={() => {
        setSelected(item)
        setIsEditing(true)
      }}
    />
  ))

  const listOfMastered = recentlyMastered
    ?.slice(0, 3)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .map((item) => (
      <MaterialProgressItem
        key={item.materialId}
        value={item}
        onClick={() => {
          setSelected(item)
          setIsEditing(true)
        }}
      />
    ))

  const footer = (
    <Flex
      p={2}
      sx={{
        alignItems: "center",
        borderTopWidth: "1px",
        borderTopColor: "border",
        borderTopStyle: "solid",
      }}
    >
      <Spacer />
      <Link
        to={`/dashboard/observe/students/progress?studentId=${studentId}&areaId=${selectedAreaId}`}
      >
        <Button variant="secondary" sx={{ fontSize: 0 }}>
          See All {areas.data?.[tab]?.name} Progress
        </Button>
      </Link>
    </Flex>
  )

  const materialProgressDialog = isEditing && selected && (
    <StudentMaterialProgressDialog
      studentId={studentId}
      lastUpdated={selected?.updatedAt}
      stage={selected?.stage}
      materialName={selected?.materialName}
      materialId={selected?.materialId}
      onDismiss={() => setIsEditing(false)}
      onSubmitted={async () => {
        await progress.refetch()
        setIsEditing(false)
      }}
    />
  )

  return (
    <>
      <Card
        sx={{ borderRadius: [0, "default"], overflow: "inherit" }}
        mx={[0, 3]}
      >
        <Typography.H6 px={3} pt={3} pb={2}>
          Curriculum Progress
        </Typography.H6>
        <Tab
          small
          items={areas.data?.map(({ name }) => name) ?? []}
          onTabClick={setTab}
          selectedItemIdx={tab}
        />
        <Box my={2}>
          {(inProgress?.length ?? 0) > 0 && (
            <Typography.Body
              mt={3}
              mx={3}
              sx={{
                fontSize: 0,
                letterSpacing: 1.2,
              }}
            >
              IN PROGRESS
            </Typography.Body>
          )}
          {listOfInProgress}
          {emptyProgressPlaceholder}
          {(listOfMastered?.length ?? 0) > 0 && (
            <Typography.Body
              mt={3}
              mx={3}
              sx={{
                fontSize: 0,
                letterSpacing: 1.2,
              }}
            >
              RECENTLY MASTERED
            </Typography.Body>
          )}
          {listOfMastered}
        </Box>
        {footer}
      </Card>
      {materialProgressDialog}
    </>
  )
}

export default StudentProgressSummaryCard
