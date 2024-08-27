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

func GetContacts(client *brevo.APIClient, modifiedSince, createdSince *time.Time) ([]models.BrevoContact, error) {
	var allContacts []models.BrevoContact
	var offset int64 = 0
	const limit int64 = 50 // You can adjust this limit based on API constraints or preferences

	for {
		contacts, _, err := GetContactsPaginated(client, limit, offset, modifiedSince, createdSince)
		if err != nil {
			return nil, err
		}

		allContacts = append(allContacts, contacts...)

		// If the number of contacts retrieved is less than the limit, we've reached the end
		if int64(len(contacts)) < limit {
			break
		}

		// Increment the offset for the next batch
		offset += limit
	}

	return allContacts, nil
}

func GetContactsPaginated(client *brevo.APIClient, limit, offset int64, modifiedSince, createdSince *time.Time) ([]models.BrevoContact, int, error) {
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

	return brevoContacts, int(contacts.Count), nil
}
