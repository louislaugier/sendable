package config

import (
	"email-validator/internal/models"
	"math"
)

var ConcurrentSingleValidationsLimits = map[models.OrderType]int{
	models.FreePlan:        1,
	models.PremiumOrder:    3,
	models.EnterpriseOrder: math.MaxInt64, // Infinity
}

// Only enterprise accounts can bulk validate, no monthly limit
const ConcurrentBulkValidationsLimit = 3

var MonthlyAppValidationsLimits = map[models.OrderType]int{
	models.FreePlan:        500,
	models.PremiumOrder:    500000,
	models.EnterpriseOrder: math.MaxInt64, // Infinity
}

var MonthlyAPISingleValidationsLimits = map[models.OrderType]int{
	models.FreePlan:        30,
	models.PremiumOrder:    30000,
	models.EnterpriseOrder: math.MaxInt64, // Infinity
}
