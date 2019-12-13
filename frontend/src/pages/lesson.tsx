import React, { FC, useContext, useState } from "react"
import queryString from "query-string"
import { PageRendererProps } from "gatsby"
import { Text } from "rebass"
import { FormattedDate } from "gatsby-plugin-intl3"
import Spacer from "../components/Spacer/Spacer"
import { PageTitleContext } from "../layouts"
import SEO from "../components/seo"
import Typography from "../components/Typography/Typography"
import Box from "../components/Box/Box"
import { BackNavigation } from "../components/BackNavigation/BackNavigation"
import Flex from "../components/Flex/Flex"
import Card from "../components/Card/Card"
import Pill from "../components/Pill/Pill"
import { ReactComponent as RightArrowIcon } from "../icons/next-arrow.svg"
import Icon from "../components/Icon/Icon"
import ScrollableDialog from "../components/ScrollableDialog/ScrollableDialog"

const curriculum = [
  {
    name: "GEOGRAPHY",
    materials: [
      "Sandpaper Globe",
      "Continent Globe",
      "Puzzle map of The world",
      "Puzzle Map of Asia",
      "Puzzle Map of Africa",
      "Puzzle Map of Europe",
      "Puzzle Map of North America",
      "Puzzle Map of South America",
      "Puzzle Map of Australia",
      "Animals of the World",
      "Puzzle Map of Indonesia",
      "Puzzle Map of Indonesia Provence",
      "Introduction of the Three Elements; Land, water and Air",
      "Land and Water Forms",
      "Land and Water Form Cards",
      "Land and Water Definitions",
      "Flags",
    ],
  },
  {
    name: "HISTORY",
    materials: [
      "Daily Calendar",
      "Sequence Cards",
      "Birthday Celebration",
      "Time Line of Child's Life",
      "History Stories",
    ],
  },
  {
    name: "ZOOLOGY",
    materials: [
      "Body part of animals",
      "Classified Nomenclature Cards",
      "Animal Puzzle",
      "Animals of the World",
      "Vertebrate and Invertebrate",
      "Animal Sorting Game",
    ],
  },
  {
    name: "BOTANY",
    materials: [
      "Preparing the outdoor environment",
      "Preparing the indoor environment",
      "Nature Table",
      "Classified Cards",
      "Parts of the Tree",
      "Botany Cabinet",
      "Definitions of the Parts of the Tree",
      "Leaf Cabinet",
      "Gathering Seeds1",
    ],
  },
  {
    name: "SCIENCE",
    materials: [
      "The Human Body",
      "Use of a Magnifying Glass",
      "Use of a Magnet",
      "Feeling Box",
      "Sink and Float",
      "Living and Non-Living Things",
      "Raising Water Level with Washers",
      "Mixing colors",
    ],
  },
]

const Lesson: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  const [isEditingLesson, setIsEditingLesson] = useState(false)
  let id: string
  if (Array.isArray(query?.id)) {
    id = query?.id[0] ?? ""
  } else {
    id = query?.id ?? ""
  }

  const pageTitle = useContext(PageTitleContext)
  pageTitle.setTitle("Student Details")

  return (
    <>
      <SEO title="lesson" />
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        <BackNavigation text="Details" to="../" />
        <Typography.H3 m={3} sx={{ wordWrap: "break-word" }} pr={24}>
          <Text as="span" color="textDisabled">
            Zara Myesha Tjandra
          </Text>{" "}
          Cultural Lessons Progress
        </Typography.H3>
        {curriculum.map(lesson => (
          <>
            <SectionHeader>{lesson.name}</SectionHeader>
            {lesson.materials.map((material, idx) => {
              let sx = {}
              if (idx < 3) {
                sx = {
                  borderLeftColor: "primary",
                  borderLeftStyle: "solid",
                  borderLeftWidth: 2,
                  opacity: 0.6,
                }
              } else if (idx < 4) {
                sx = {
                  borderLeftColor: "orange",
                  borderLeftStyle: "solid",
                  borderLeftWidth: 2,
                }
              }
              return (
                <Card
                  mx={3}
                  my={2}
                  sx={sx}
                  onClick={() => setIsEditingLesson(true)}
                >
                  <Flex
                    mx={3}
                    my={2}
                    alignItems="center"
                    sx={{ flexShrink: 0 }}
                  >
                    <Typography.Body text="textMediumEmphasis">
                      {material}
                    </Typography.Body>
                    <Spacer />
                    {idx < 3 && (
                      <Pill
                        text="Mastered"
                        mt={1}
                        mr={2}
                        sx={{ flexShrink: 0, alignSelf: "start" }}
                        backgroundColor="primary"
                        color="onPrimary"
                      />
                    )}
                    {idx === 3 && (
                      <Pill
                        text="Presented"
                        mt={1}
                        mr={2}
                        sx={{ flexShrink: 0, alignSelf: "start" }}
                        backgroundColor="orange"
                        color="black"
                      />
                    )}
                    <Icon as={RightArrowIcon} m={0} />
                  </Flex>
                </Card>
              )
            })}
          </>
        ))}
      </Box>
      {isEditingLesson && (
        <LessonDetailDialog onDismiss={() => setIsEditingLesson(false)} />
      )}
    </>
  )
}

const SectionHeader: FC = props => (
  <Typography.H5
    mb={3}
    mt={5}
    mx={3}
    fontWeight="normal"
    color="textMediumEmphasis"
    letterSpacing={3}
    {...props}
  />
)

export interface Lesson {
  datePresented: number
  name: string
}
const LessonDetailDialog: FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const lesson: Lesson = {
    name: "Puzzle map of Africa",
    datePresented: Date.now(),
  }
  return (
    <ScrollableDialog
      title={lesson.name}
      positiveText="Set as Presented"
      onDismiss={onDismiss}
      onPositiveClick={onDismiss}
    >
      <Typography.Body mx={3} mt={3} fontSize={0} letterSpacing={1.5}>
        DATE PRESENTED
      </Typography.Body>
      <Typography.Body mx={3} mb={3}>
        <FormattedDate
          value={lesson.datePresented}
          month="short"
          day="2-digit"
          weekday="long"
        />
      </Typography.Body>
    </ScrollableDialog>
  )
}

export default Lesson
