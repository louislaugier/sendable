package config

import (
	"sendable/internal/models"
	"math"
	"time"
)

const Infinity = math.MaxInt64

const (
	BaseRateLimiterRequestFrequency = time.Second

	UploadFileSizeLimit = 30 << 20 // 30MB

	GuestEmailValidationFrequency = time.Second * 30

	ConcurrentBulkValidationsLimit = 3
)

var (
	ConcurrentSingleValidationsLimits = map[models.SubscriptionType]int{
		models.FreePlan:               1,
		models.PremiumSubscription:    3,
		models.EnterpriseSubscription: Infinity,
	}

	MonthlyAppValidationsLimits = map[models.SubscriptionType]int{
		models.FreePlan:               500,
		models.PremiumSubscription:    10000,
		models.EnterpriseSubscription: Infinity,
	}

	MonthlyAPISingleValidationsLimits = map[models.SubscriptionType]int{
		models.FreePlan:               30,
		models.PremiumSubscription:    3000,
		models.EnterpriseSubscription: Infinity,
	}
)
