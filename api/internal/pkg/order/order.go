package order

import (
	"email-validator/internal/models"

	"github.com/google/uuid"
)

func GetOrder(orderID int) (*models.Order, error) {
	return &models.Order{}, nil
}

func GetOrders(userID uuid.UUID) ([]*models.Order, error) {
	return []*models.Order{}, nil
}

func IsUserPremium(userID uuid.UUID) (bool, error) {
	// GetOrders(userID)

	return false, nil
}
