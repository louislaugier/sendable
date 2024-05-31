package models

const (
	ReachabilitySafe    Reachability = "safe"
	ReachabilityRisky   Reachability = "risky"
	ReachabilityUnknown Reachability = "unknown"
	ReachabilityInvalid Reachability = "invalid"
)

type (
	Reachability string

	ReacherResponse struct {
		Input        string       `json:"input,omitempty" csv:"Email address"`
		Reachability Reachability `json:"is_reachable,omitempty" csv:"Reachability"`
		Misc         misc         `json:"misc,omitempty"`
		MX           mx           `json:"mx,omitempty"`
		SMTP         smtp         `json:"smtp,omitempty"`
		Syntax       Syntax       `json:"syntax,omitempty"`
	}

	misc struct {
		IsDisposable bool `json:"is_disposable" csv:"Disposable address"`

		// admin or noreply for example
		IsRoleAccount bool `json:"is_role_account" csv:"Role account"`

		GravatarURL    string `json:"gravatar_url"`
		HaveIBeenPwned bool   `json:"haveibeenpwned"`
	}

	mx struct {
		// Does the domain of the email address have valid MX DNS records?
		AcceptsMail bool     `json:"accepts_mail"`
		Records     []string `json:"records,omitempty"`
	}

	smtp struct {
		// Can the mail exchanger of the email address domain be contacted successfully?
		CanConnectSMTP bool `json:"can_connect_smtp"`

		HasFullInbox bool `json:"has_full_inbox" csv:"Inbox full"`

		// A catch-all address is meant to catch all emails sent to any non-existing email accounts on a domain
		IsCatchAll bool `json:"is_catch_all" csv:"Catch-all address"`

		// Is an email sent to this address deliverable?
		IsDeliverable bool `json:"is_deliverable"`
		IsDisabled    bool `json:"is_disabled" csv:"Disabled email account"`
	}

	Syntax struct {
		Domain        string `json:"domain,omitempty"`
		IsValidSyntax bool   `json:"is_valid_syntax" csv:"Syntax issues"`
		Username      string `json:"username,omitempty"`
		Suggestion    string `json:"suggestion,omitempty"`
	}
)
