package lessonplan

import "time"

const (
	RepetitionNone = iota
	RepetitionDaily
	RepetitionWeekly
	RepetitionMonthly
)

type (
	RepetitionPattern struct {
		Type    int
		EndDate time.Time
	}

	LessonPlan struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		FileIds     []string
		Date        time.Time
		Repetition  *RepetitionPattern
		AreaId      string
		MaterialId  string
	}

	PlanData struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		FileIds     []string
		Date        time.Time
		Repetition  *RepetitionPattern
		AreaId      string
		MaterialId  string
		Students    []string
		SchoolId    string
	}

	UpdatePlanData struct {
		Id          string
		Title       *string
		Description *string
		Date        *time.Time
		Repetition  *RepetitionPattern
		AreaId      *string
		MaterialId  *string
		ClassId     *string
	}

	Store interface {
		UpdateLessonPlan(planData UpdatePlanData) (int, error)
		GetLessonPlan(planId string) (*LessonPlan, error)
		DeleteLessonPlan(planId string) error
		DeleteLessonPlanFile(planId, fileId string) error
	}
)
