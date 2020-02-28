package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"time"
)

type SchoolStore struct {
	*pg.DB
}

func (s SchoolStore) NewSchool(schoolName string, userId string) (*School, error) {
	id := uuid.New()
	inviteCode := uuid.New()
	school := School{
		Id:         id.String(),
		Name:       schoolName,
		InviteCode: inviteCode.String(),
	}
	userToSchoolRelation := UserToSchool{
		SchoolId: id.String(),
		UserId:   userId,
	}
	err := s.RunInTransaction(func(tx *pg.Tx) error {
		if err := s.Insert(&school); err != nil {
			return err
		}
		if err := s.Insert(&userToSchoolRelation); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return &school, nil
}

func (s SchoolStore) GetSchool(schoolId string) (*School, error) {
	var school School
	if err := s.Model(&school).
		Relation("Users").
		Where("id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}
	return &school, nil
}

func (s SchoolStore) GetStudents(schoolId string) ([]Student, error) {
	var students []Student
	if err := s.Model(&students).
		Where("school_id=?", schoolId).
		Order("name").
		Select(); err == pg.ErrNoRows {
		return make([]Student, 0), nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "Failed querying student")
	}
	return students, nil
}

func (s SchoolStore) NewStudent(schoolId string, name string, dob *time.Time) (*Student, error) {
	student := Student{
		Id:          uuid.New().String(),
		Name:        name,
		SchoolId:    schoolId,
		DateOfBirth: dob,
	}
	if err := s.Insert(&student); err != nil {
		return nil, nil
	}
	return &student, nil
}

func (s SchoolStore) RefreshInviteCode(schoolId string) (*School, error) {
	// TODO: This should be done in a single query
	var school School
	if err := s.Model(&school).
		Where("id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}

	// Update invite code
	school.InviteCode = uuid.New().String()
	if err := s.Update(&school); err != nil {
		return nil, err
	}
	return &school, nil
}

func (s SchoolStore) NewDefaultCurriculum(schoolId string) error {
	school, err := s.GetSchool(schoolId)
	if err != nil {
		return richErrors.Wrap(err, "Failed saving school")
	}

	c := createDefault()
	err = s.RunInTransaction(
		func(tx *pg.Tx) error {
			// Save the curriculum tree.
			if err := tx.Insert(&c); err != nil {
				return err
			}
			for _, area := range c.Areas {
				if err := tx.Insert(&area); err != nil {
					return err
				}
				for _, subject := range area.Subjects {
					if err := tx.Insert(&subject); err != nil {
						return err
					}
					for _, material := range subject.Materials {
						if err := tx.Insert(&material); err != nil {
							return err
						}
					}
				}
			}

			// Update the school with the new curriculum id
			school.CurriculumId = c.Id
			if err := tx.Update(school); err != nil {
				return err
			}
			return nil
		})
	if err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) DeleteCurriculum(schoolId string) error {
	school, err := s.GetSchool(schoolId)
	if err != nil {
		return err
	}
	if school.CurriculumId == "" {
		return EmptyCurriculumError{}
	}
	c := Curriculum{Id: school.CurriculumId}
	return s.Delete(&c)
}

func (s SchoolStore) GetCurriculum(schoolId string) (*Curriculum, error) {
	var school School
	err := s.Model(&school).
		Relation("Curriculum").
		Where("school.id=?", schoolId).
		Select()
	if err != nil {
		return nil, err
	}
	if school.CurriculumId == "" {
		return nil, EmptyCurriculumError{}
	}
	return &school.Curriculum, nil
}

func (s SchoolStore) GetCurriculumAreas(schoolId string) ([]Area, error) {
	var school School
	err := s.Model(&school).
		Relation("Curriculum").
		Relation("Curriculum.Areas").
		Where("school.id=?", schoolId).
		Select()
	if err != nil {
		return nil, err
	}
	if school.CurriculumId == "" {
		return nil, EmptyCurriculumError{}
	}
	return school.Curriculum.Areas, nil
}

type EmptyCurriculumError struct{}

func (e EmptyCurriculumError) Error() string {
	return "School doesn't have curriculum"
}