package config

import (
	"email-validator/internal/models"
	"math"
	"time"
)

const (
	UploadFileSizeLimit = 30 << 20 // 30MB

	GuestEmailValidationFrequency  = time.Second * 30
	ConcurrentBulkValidationsLimit = 3
)

var (
	ConcurrentSingleValidationsLimits = map[models.SubscriptionType]int{
		models.FreePlan:               1,
		models.PremiumSubscription:    3,
		models.EnterpriseSubscription: math.MaxInt64, // Infinity
	}

	MonthlyAppValidationsLimits = map[models.SubscriptionType]int{
		models.FreePlan:               500,
		models.PremiumSubscription:    500000,
		models.EnterpriseSubscription: math.MaxInt64, // Infinity
	}

	MonthlyAPISingleValidationsLimits = map[models.SubscriptionType]int{
		models.FreePlan:               30,
		models.PremiumSubscription:    30000,
		models.EnterpriseSubscription: math.MaxInt64, // Infinity
	}
)
