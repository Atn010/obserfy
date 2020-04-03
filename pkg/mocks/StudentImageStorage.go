// Code generated by mockery v1.0.0. DO NOT EDIT.

package mocks

import (
	multipart "mime/multipart"

	mock "github.com/stretchr/testify/mock"
)

// StudentImageStorage is an autogenerated mock type for the StudentImageStorage type
type StudentImageStorage struct {
	mock.Mock
}

// SaveProfilePicture provides a mock function with given fields: studentId, pic, size
func (_m *StudentImageStorage) SaveProfilePicture(studentId string, pic multipart.File, size int64) (string, error) {
	ret := _m.Called(studentId, pic, size)

	var r0 string
	if rf, ok := ret.Get(0).(func(string, multipart.File, int64) string); ok {
		r0 = rf(studentId, pic, size)
	} else {
		r0 = ret.Get(0).(string)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string, multipart.File, int64) error); ok {
		r1 = rf(studentId, pic, size)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
