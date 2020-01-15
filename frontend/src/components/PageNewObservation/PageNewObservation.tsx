import React, { FC, useEffect, useMemo, useState } from "react"
import differenceInCalendarDays from "date-fns/differenceInCalendarDays"
import { useIntl } from "gatsby-plugin-intl3"
import isToday from "date-fns/isToday"
import Box from "../Box/Box"
import { categories } from "../../categories"
import Select from "../Select/Select"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import BackNavigation from "../BackNavigation/BackNavigation"
import { useQueryStudentDetails } from "../../hooks/students/useQueryStudentDetails"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import {
  Observation,
  useQueryStudentObservations,
} from "../../hooks/students/useQueryStudentObservations"
import Typography from "../Typography/Typography"
import { getAnalytics } from "../../analytics"
import Pill from "../Pill/Pill"
import Card from "../Card/Card"

interface Props {
  studentId: string
}
export const PageNewObservation: FC<Props> = ({ studentId }) => {
  const [shortDesc, setShortDesc] = useState("")
  const [longDesc, setLongDesc] = useState("")
  const [categoryId, setCategoryId] = useState(categories[0].id)
  const [student] = useQueryStudentDetails(studentId)
  const [
    observations,
    setObservationOutdated,
  ] = useQueryStudentObservations(studentId)

  const [showSuccess, setShowSuccess] = useState(false)
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (showSuccess) {
        setShowSuccess(false)
      }
    }, 2000)
    return () => clearTimeout(timeOut)
  }, [showSuccess])

  const relatedObservation = useMemo(
    () =>
      observations
        ?.filter(({ createdDate }) => isToday(Date.parse(createdDate ?? "")))
        ?.sort(
          (a, b) => parseInt(a.categoryId, 10) - parseInt(b.categoryId, 10)
        ),
    [observations]
  )

  async function submitAddObservation(observation: Observation): Promise<void> {
    const baseUrl = "/api/v1"
    const response = await fetch(
      `${baseUrl}/students/${studentId}/observations`,
      {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(observation),
      }
    )
    if (response.status === 201) {
      setObservationOutdated()
      setShortDesc("")
      setLongDesc("")
      setShowSuccess(true)
      setCategoryId(categories[0].id)
    }
    getAnalytics()?.track("Observation Created", {
      responseStatus: response.status,
      observationId: observation.id,
    })
  }

  return (
    <Box maxWidth="maxWidth.md" m="auto">
      <BackNavigation
        to={`/dashboard/students/details?id=${studentId}`}
        text={student?.name ?? ""}
      />
      <Box m={3}>
        <Select
          mb={3}
          label="Category"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
        >
          {categories.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
        <Input
          label="Short Description"
          width="100%"
          placeholder="What have you found?"
          onChange={e => setShortDesc(e.target.value)}
          value={shortDesc}
          mb={3}
        />
        <TextArea
          label="Details"
          width="100%"
          fontSize={2}
          height={150}
          placeholder="Tell us about what you observed"
          onChange={e => setLongDesc(e.target.value)}
          value={longDesc}
        />
      </Box>
      <Flex m={3} alignItems="center">
        <Typography.Body
          color="textPrimary"
          opacity={showSuccess ? 1 : 0}
          sx={{
            transition: "opacity 100ms",
          }}
        >
          Observation added!!
        </Typography.Body>
        <Spacer />
        <Button
          onClick={() => {
            submitAddObservation({ longDesc, shortDesc, categoryId })
          }}
        >
          Save
        </Button>
      </Flex>
      <Box m={3}>
        <Typography.H6 mb={3}>Today&apos;s Observations</Typography.H6>
        {relatedObservation?.map(observation => (
          <RelatedObservation key={observation.id} observation={observation} />
        ))}
      </Box>
    </Box>
  )
}

const RelatedObservation: FC<{ observation: Observation }> = ({
  observation,
}) => {
  const category = categories[parseInt(observation.categoryId, 10)]
  const dateDifference = differenceInCalendarDays(
    Date.parse(observation.createdDate ?? ""),
    Date.now()
  )
  const intl = useIntl()
  let date: string
  if (dateDifference > 2) {
    date = intl.formatRelativeTime(dateDifference, "day", { numeric: "auto" })
  } else {
    date = intl.formatDate(observation.createdDate, {
      month: "short",
      year: "numeric",
      weekday: "short",
      day: "numeric",
    })
  }

  return (
    <Card mb={3}>
      <Box mx={3} my={2}>
        <Typography.Body mb={2}>{observation.shortDesc}</Typography.Body>
        <Flex mb={2}>
          <Pill
            backgroundColor={category.color}
            text={category.name}
            color={category.onColor}
          />
          <Pill ml={2} text={date} color="text" />
        </Flex>
        <Typography.Body>{observation.longDesc}</Typography.Body>
      </Box>
    </Card>
  )
}

export default PageNewObservation
