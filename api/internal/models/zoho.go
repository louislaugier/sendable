package models

type (
	ZohoAuthRequest struct {
		Code string `json:"code"`
	}

	ZohoSetEmailRequest struct {
		Email string `json:"email"`
	}

	ZohoUsersResponse struct {
		Users []ZohoUser `json:"users"`
	}

	ZohoUser struct {
		Email string `json:"email"`
	}

	ZohoProspect struct {
		Email string `json:"Email"`
	}

	ZohoContactsResponse struct {
		Data []ZohoContact `json:"data"`
	}

	ZohoContact struct {
		ZohoProspect
	}

	ZohoLeadsResponse struct {
		Data []ZohoLead `json:"data"`
	}

	ZohoLead struct {
		ZohoProspect
	}

	ZohoVendorsResponse struct {
		Data []ZohoVendor `json:"data"`
	}

	ZohoVendor struct {
		ZohoProspect
	}
)
