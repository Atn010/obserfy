package postgres

import (
	"crypto/tls"
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"os"
	"time"
)

func Connect() *pg.DB {
	return pg.Connect(&pg.Options{
		User:      os.Getenv("DB_USERNAME"),
		Password:  os.Getenv("DB_PASSWORD"),
		Addr:      os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT"),
		Database:  "defaultdb",
		TLSConfig: &tls.Config{InsecureSkipVerify: true},
	})
}

func InitTables(db *pg.DB) (error interface {
	Error() string
}) {
	for _, model := range []interface{}{
		(*Student)(nil),

		// Curriculum related tables
		(*Curriculum)(nil),
		(*Area)(nil),
		(*Subject)(nil),
		(*Material)(nil),
		(*StudentMaterialProgress)(nil),

		(*School)(nil),
		(*Observation)(nil),
		(*User)(nil),
		(*Session)(nil),
		(*UserToSchool)(nil),
	} {
		err := db.CreateTable(model, &orm.CreateTableOptions{IfNotExists: true, FKConstraints: true})
		if err != nil {
			return error
		}
	}
	return nil
}

func Close(db *pg.DB) (error interface {
	Error() string
}) {
	err := db.Close()
	if err != nil {
		return error
	}
	return nil
}

type Session struct {
	Token  string `pg:",pk" pg:",type:uuid"`
	UserId string
}
type Curriculum struct {
	Id    string `pg:"type:uuid"`
	Name  string
	Areas []Area `pg:"fk:curriculum_id"`
}

type Area struct {
	Id           string `pg:"type:uuid"`
	CurriculumId string `pg:"type:uuid,on_delete:CASCADE"`
	Curriculum   Curriculum
	Name         string
	Subjects     []Subject `pg:"fk:area_id"`
}

type Subject struct {
	Id        string `pg:"type:uuid"`
	AreaId    string `pg:"type:uuid,on_delete:CASCADE"`
	Area      Area
	Name      string
	Materials []Material `pg:"fk:subject_id"`
	Order     int        `pg:",use_zero"`
}

type Material struct {
	Id        string `pg:"type:uuid"`
	SubjectId string `pg:"type:uuid,on_delete:CASCADE"`
	Subject   Subject
	Name      string
	Order     int `pg:",use_zero"`
}

type StudentMaterialProgress struct {
	MaterialId string `pg:",pk,type:uuid,on_delete:CASCADE"`
	Material   Material
	StudentId  string `pg:",pk,type:uuid,on_delete:CASCADE"`
	Student    Student
	Stage      int
	UpdatedAt  time.Time
}

type Student struct {
	Id          string `json:"id" pg:",type:uuid"`
	Name        string `json:"name"`
	SchoolId    string `pg:"type:uuid,on_delete:CASCADE"`
	School      School
	DateOfBirth *time.Time
}

type Observation struct {
	Id          string    `json:"id" pg:",type:uuid"`
	StudentId   string    `json:"studentId"`
	ShortDesc   string    `json:"shortDesc"`
	LongDesc    string    `json:"longDesc"`
	CategoryId  string    `json:"categoryId"`
	CreatedDate time.Time `json:"createdDate"`
}

type School struct {
	Id           string `json:"id" pg:",type:uuid"`
	Name         string `json:"name"`
	InviteCode   string `json:"inviteCode"`
	Users        []User `pg:"many2many:user_to_schools,joinFK:user_id"`
	CurriculumId string `pg:",type:uuid,on_delete:SET NULL"`
	Curriculum   Curriculum
}

type UserToSchool struct {
	SchoolId string `pg:",type:uuid"`
	UserId   string `pg:",type:uuid"`
}

type User struct {
	Id       string `json:"id" pg:",type:uuid"`
	Email    string `pg:",unique"`
	Name     string
	Password []byte
	Schools  []School `pg:"many2many:user_to_schools,joinFK:school_id"`
}

