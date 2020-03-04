import React, { FC, memo, useCallback, useMemo, useState } from "react"
import startOfDay from "date-fns/startOfDay"
import { FormattedDate } from "gatsby-plugin-intl3"
import differenceInDays from "date-fns/differenceInDays"
import isSameDay from "date-fns/isSameDay"
import { Observation, useGetObservations } from "../../api/useGetObservations"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import { STUDENT_DETAILS_PAGE_URL } from "../../pages/dashboard/observe/students/details"
import { categories } from "../../categories"
import Flex from "../Flex/Flex"
import Chip from "../Chip/Chip"
import Typography from "../Typography/Typography"
import Pill from "../Pill/Pill"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import Card from "../Card/Card"
import { useGetStudent } from "../../api/useGetStudent"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

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

  const showDeleteDialog = useCallback(observation => {
    setIsDeletingObservation(true)
    setTargetObservation(observation)
  }, [])

  const showEditDialog = useCallback(observation => {
    setIsEditingObservation(true)
    setTargetObservation(observation)
  }, [])

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto">
        <BackNavigation
          to={STUDENT_DETAILS_PAGE_URL(studentId)}
          text="Student Details"
        />
        {student.isFetching && !student.data && (
          <Box m={3}>
            <LoadingPlaceholder width="100%" height="5rem" />
            <LoadingPlaceholder width="90%%" height="5rem" mt={2} />
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
        <Flex pl={3} pr={2} py={2} flexWrap="wrap">
          {[allCategory, ...categories].map(category => {
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
        {observations.isFetching && !observations.data && (
          <Box mb={2}>
            <LoadingPlaceholder width="100%" height="20rem" mb={3} />
            <LoadingPlaceholder width="100%" height="20rem" mb={3} />
            <LoadingPlaceholder width="100%" height="20rem" mb={3} />
            <LoadingPlaceholder width="100%" height="20rem" mb={3} />
            <LoadingPlaceholder width="100%" height="20rem" mb={3} />
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
            startOfDay(Date.parse(createdDate ?? "")).toISOString()
          )
        ),
      ]?.sort((a, b) => differenceInDays(Date.parse(b), Date.parse(a))),
    [observations]
  )

  return (
    <Box m={[0, 3]}>
      {dates.map(date => {
        return (
          <Box>
            <Typography.Body
              as="div"
              data-cy="observation-short-desc"
              my={2}
              width="100%"
              textAlign="center"
            >
              <FormattedDate
                value={date}
                month="short"
                year="2-digit"
                day="2-digit"
              />
            </Typography.Body>
            {observations
              .filter(({ createdDate }) =>
                isSameDay(Date.parse(createdDate ?? ""), Date.parse(date))
              )
              .map(observation => {
                return (
                  <CompactObservationCard
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

const CompactObservationCard: FC<{
  observation: Observation
  onDelete: (value: Observation) => void
  onEdit: (value: Observation) => void
}> = memo(({ observation, onEdit, onDelete }) => {
  const category = categories[parseInt(observation.categoryId, 10)]

  return (
    <Card mb={2} key={observation.id} borderRadius={[0, "default"]}>
      <Typography.H6 mx={3} mt={3} mb={0} data-cy="observation-short-desc">
        {observation.shortDesc}
      </Typography.H6>
      {observation.longDesc && (
        <Typography.Body
          fontSize={1}
          mt={2}
          mx={3}
          mb={3}
          data-cy="observation-long-desc"
        >
          {observation.longDesc}
        </Typography.Body>
      )}
      <Flex
        p={2}
        alignItems="center"
        sx={{
          borderTopWidth: 1,
          borderTopStyle: observation.longDesc ? "solid" : "none",
          borderTopColor: "border",
        }}
      >
        <Pill
          ml={2}
          backgroundColor={category.color}
          text={category.name}
          color={category.onColor}
        />
        <Spacer />
        <Button
          variant="secondary"
          color="danger"
          data-cy="delete-observation"
          onClick={() => onDelete(observation)}
          fontSize={0}
        >
          delete
        </Button>
        <Button
          variant="secondary"
          data-cy="edit-observation"
          fontSize={0}
          onClick={() => onEdit(observation)}
        >
          Edit
        </Button>
      </Flex>
    </Card>
  )
})

export default PageAllObservations
