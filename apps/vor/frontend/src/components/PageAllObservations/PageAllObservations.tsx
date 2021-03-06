import React, { FC, memo, useCallback, useMemo, useState } from "react"
import { Box, Flex } from "theme-ui"
import { Observation, useGetObservations } from "../../api/useGetObservations"
import BackNavigation from "../BackNavigation/BackNavigation"
import { STUDENT_OVERVIEW_PAGE_URL } from "../../routes"
import { categories } from "../../categories"

import Chip from "../Chip/Chip"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import ObservationCard from "../ObservationCard/ObservationCard"
import dayjs from "../../dayjs"

const allCategory = {
  id: "-1",
  name: "All",
  color: "primary",
  onColor: "onPrimary",
}

interface Props {
  studentId: string
}
export const PageAllObservations: FC<Props> = ({ studentId }) => {
  const [selectedCategory, setSelectedCategory] = useState("0")
  const [isEditingObservation, setIsEditingObservation] = useState(false)
  const [isDeletingObservation, setIsDeletingObservation] = useState(false)
  const [targetObservation, setTargetObservation] = useState<Observation>()
  const observations = useGetObservations(studentId)
  const student = useGetStudent(studentId)

  const filteredObservation = useMemo(
    () =>
      observations.data?.filter(({ categoryId }) => {
        if (selectedCategory === allCategory.id) return true
        return categoryId === selectedCategory
      }) ?? [],
    [observations.data, selectedCategory]
  )

  // Group observations by dates

  const showDeleteDialog = useCallback((observation) => {
    setIsDeletingObservation(true)
    setTargetObservation(observation)
  }, [])

  const showEditDialog = useCallback((observation) => {
    setIsEditingObservation(true)
    setTargetObservation(observation)
  }, [])

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
        <BackNavigation
          to={STUDENT_OVERVIEW_PAGE_URL(studentId)}
          text="Student Details"
        />
        {student.status === "loading" && !student.data && (
          <Box m={3}>
            <LoadingPlaceholder sx={{ width: "100%", height: "5rem" }} />
            <LoadingPlaceholder sx={{ width: "90%%", height: "5rem" }} mt={2} />
          </Box>
        )}
        <Box m={3} mb={4}>
          <Typography.H3 sx={{ wordWrap: "break-word" }}>
            <Box as="span" color="textDisabled">
              {student.data?.name}
            </Box>
            {` Observations`}
          </Typography.H3>
        </Box>
        <Flex
          pl={3}
          pr={2}
          py={2}
          sx={{
            flexWrap: "wrap",
          }}
        >
          {[allCategory, ...categories].map((category) => {
            let observationCount = 0
            if (category.id === allCategory.id) {
              observationCount = observations.data?.length ?? 0
            } else {
              observations.data?.forEach(({ categoryId }) => {
                if (categoryId === category.id) observationCount += 1
              })
            }
            return (
              <Chip
                key={category.id}
                isActive={category.id === selectedCategory}
                activeBackground={category.color}
                text={`${category.name} (${observationCount})`}
                onClick={() => setSelectedCategory(category.id)}
              />
            )
          })}
        </Flex>
        {observations.status === "loading" && !observations.data && (
          <Box mb={2}>
            <LoadingPlaceholder
              sx={{ width: "100%", height: "20rem" }}
              mb={3}
            />
            <LoadingPlaceholder
              sx={{ width: "100%", height: "20rem" }}
              mb={3}
            />
            <LoadingPlaceholder
              sx={{ width: "100%", height: "20rem" }}
              mb={3}
            />
            <LoadingPlaceholder
              sx={{ width: "100%", height: "20rem" }}
              mb={3}
            />
            <LoadingPlaceholder
              sx={{ width: "100%", height: "20rem" }}
              mb={3}
            />
          </Box>
        )}
        <ObservationList
          observations={filteredObservation}
          showDeleteDialog={showDeleteDialog}
          showEditDialog={showEditDialog}
        />
      </Box>
      {isEditingObservation && (
        <EditObservationDialog
          defaultValue={targetObservation}
          onDismiss={() => setIsEditingObservation(false)}
          onSaved={() => {
            setIsEditingObservation(false)
            observations.refetch()
          }}
        />
      )}
      {isDeletingObservation && targetObservation && (
        <DeleteObservationDialog
          observationId={targetObservation.id ?? ""}
          shortDesc={targetObservation?.shortDesc}
          onDismiss={() => setIsDeletingObservation(false)}
          onDeleted={() => {
            observations.refetch()
            setIsDeletingObservation(false)
          }}
        />
      )}
    </>
  )
}

const ObservationList: FC<{
  observations: Observation[]
  showDeleteDialog: (observation: Observation) => void
  showEditDialog: (observation: Observation) => void
}> = memo(({ showDeleteDialog, observations, showEditDialog }) => {
  const dates = useMemo(
    () =>
      [
        ...new Set(
          observations.map(({ createdDate }) =>
            dayjs(Date.parse(createdDate ?? ""))
              .startOf("day")
              .toISOString()
          )
        ),
      ]?.sort((a, b) => dayjs(b).diff(a)),
    [observations]
  )

  return (
    <Box m={[0, 3]}>
      {dates.map((date) => {
        return (
          <Box>
            <Typography.Body
              as="div"
              data-cy="observation-short-desc"
              my={2}
              sx={{
                width: "100%",
                textAlign: "center",
                fontSize: 1,
              }}
              color="textMediumEmphasis"
            >
              {dayjs(date).format("D MMMM 'YY")}
            </Typography.Body>
            {observations
              .filter(({ createdDate }) =>
                dayjs(createdDate ?? "").isSame(date, "day")
              )
              .map((observation) => {
                return (
                  <ObservationCard
                    key={observation.id}
                    observation={observation}
                    onDelete={showDeleteDialog}
                    onEdit={showEditDialog}
                  />
                )
              })}
          </Box>
        )
      })}
    </Box>
  )
})

export default PageAllObservations
