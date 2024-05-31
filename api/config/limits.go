package config

import (
	"email-validator/internal/models"
	"math"
)

const UploadFileSizeLimitMegaBytes = 30

var ConcurrentSingleValidationsLimits = map[models.SubscriptionType]int{
	models.FreePlan:               1,
	models.PremiumSubscription:    3,
	models.EnterpriseSubscription: math.MaxInt64, // Infinity
}

// Only enterprise accounts can bulk validate, no monthly limit

const ConcurrentBulkValidationsLimit = 3

var MonthlyAppValidationsLimits = map[models.SubscriptionType]int{
	models.FreePlan:               500,
	models.PremiumSubscription:    500000,
	models.EnterpriseSubscription: math.MaxInt64, // Infinity
}

var MonthlyAPISingleValidationsLimits = map[models.SubscriptionType]int{
	models.FreePlan:               30,
	models.PremiumSubscription:    30000,
	models.EnterpriseSubscription: math.MaxInt64, // Infinity
}
