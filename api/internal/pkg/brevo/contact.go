package brevo

import (
	"context"
	"email-validator/internal/models"
	"email-validator/internal/pkg/utils"
	"errors"
	"time"

	"github.com/antihax/optional"
	brevo "github.com/getbrevo/brevo-go/lib"
)

func GetContacts(client *brevo.APIClient, limit, offset int64, modifiedSince, createdSince *time.Time) ([]models.BrevoContact, int64, error) {
	opts := &brevo.GetContactsOpts{
		Limit:  optional.NewInt64(limit),
		Offset: optional.NewInt64(offset),
	}
	if modifiedSince != nil {
		opts.ModifiedSince = optional.NewString(modifiedSince.String())
	}
	if createdSince != nil {
		opts.CreatedSince = optional.NewString(createdSince.String())
	}

	contacts, _, err := client.ContactsApi.GetContacts(context.Background(), opts)

	if err != nil {
		return nil, 0, err
	}

	brevoContacts := []models.BrevoContact{}
	for _, c := range contacts.Contacts {
		c, err = utils.InterfaceToStruct(c, &models.BrevoContact{})
		if err != nil {
			return nil, 0, err
		}
		contact, ok := c.(*models.BrevoContact)
		if !ok {
			return nil, 0, errors.New("error casting interface into Brevo contact")
		}

		brevoContacts = append(brevoContacts, *contact)
	}

	return brevoContacts, contacts.Count, nil
}
