package main

import (
	"context"
	"github.com/google/uuid"
	"time"
)

type OTP struct {
	Key     string
	Created time.Time
}
type RetentionMap map[string]OTP

func NewRetentionMap(ctx context.Context, retentionPeriod time.Duration) RetentionMap {
	rm := make(RetentionMap)
	return rm
}
func (rm RetentionMap) NewOTP() OTP {
	o := OTP{
		Key:     uuid.NewString(),
		Created: time.Now(),
	}
	return o
}
