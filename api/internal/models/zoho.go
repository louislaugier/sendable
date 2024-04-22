package models

type ZohoAuthRequest struct {
	Code string `json:"code"`
}

type ZohoConfirmEmailRequest struct {
	Email string `json:"email"`
}

type ZohoUsersResponse struct {
	Users []ZohoUser `json:"users"`
}

type ZohoUser struct {
	Email string `json:"email"`
}

type ZohoProspect struct {
	Email string `json:"Email"`
}

type ZohoContactsResponse struct {
	Data []ZohoContact `json:"data"`
}

type ZohoContact struct {
	ZohoProspect
}

type ZohoLeadsResponse struct {
	Data []ZohoLead `json:"data"`
}

type ZohoLead struct {
	ZohoProspect
}

type ZohoVendorsResponse struct {
	Data []ZohoVendor `json:"data"`
}

type ZohoVendor struct {
	ZohoProspect
}
