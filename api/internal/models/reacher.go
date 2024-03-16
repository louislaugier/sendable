package models

type Reachability string

const (
	// We guarantee a hard bounce rate lower than 3%. Bounce rates may still happen, because we connect to the email's SMTP server from a different IP address than you, and yours might be blacklisted.
	ReachabilitySafe Reachability = "safe"

	// The email address appears to exist, but has quality issues that may result in low engagement or a bounce. We don't recommend sending to these emails, and don't commit on an accuracy rate.
	// An email is considered risky when at least one of the following is true:
	//   - is a disposable email address (DEA),
	//   - is a role account (e.g. support@ or admin@),
	//   - is a catch-all address,
	//   - has full inbox.
	ReachabilityRisky Reachability = "risky"

	// It might happen on rare occasions that the email provider doesn't allow real-time verification of emails. In this case, there's unfortunately nothing Reacher can do. Please let us know if this happens, we're working on finding ways to solve these issues, which in most occasions are solved on a case-by-case basis.
	// In most cases, this error happens on timeout, when port 25 is closed. On some occasions, it might also happen that the email provider doesn't allow real-time verification of emails (for example, Hotmail). In this case, there's unfortunately nothing Reacher can do. Please let us know if this happens, we're working on finding clever ways to work around these issues.
	ReachabilityUnknown Reachability = "unknown"

	// We guarantee with a confidence of 99% that this email is not deliverable.
	ReachabilityInvalid Reachability = "invalid"
)

type ReacherResponse struct {
	Input        string       `json:"input,omitempty" csv:"Email"`
	Reachability Reachability `json:"is_reachable,omitempty" csv:"Reachability"`
	Misc         misc         `json:"misc,omitempty"`
	MX           mx           `json:"mx,omitempty"`
	SMTP         smtp         `json:"smtp,omitempty"`
	Syntax       Syntax       `json:"syntax,omitempty"`
}

type misc struct {
	IsDisposable bool `json:"is_disposable" csv:"Disposable"`

	// admin or noreply for example
	IsRoleAccount bool `json:"is_role_account" csv:"Role account"`

	GravatarURL    string `json:"gravatar_url"`
	HaveIBeenPwned bool   `json:"haveibeenpwned"`
}

type mx struct {
	// Does the domain of the email address have valid MX DNS records?
	AcceptsMail bool     `json:"accepts_mail"`
	Records     []string `json:"records,omitempty"`
}

type smtp struct {
	// Can the mail exchanger of the email address domain be contacted successfully?
	CanConnectSMTP bool `json:"can_connect_smtp"`

	HasFullInbox bool `json:"has_full_inbox" csv:"Inbox full"`

	// A catch-all address is meant to catch all emails sent to any non-existing email accounts on a domain
	IsCatchAll bool `json:"is_catch_all" csv:"Catch-all address"`

	// Is an email sent to this address deliverable?
	IsDeliverable bool `json:"is_deliverable"`
	IsDisabled    bool `json:"is_disabled" csv:"Disabled email account"`
}

type Syntax struct {
	Domain        string `json:"domain,omitempty"`
	IsValidSyntax bool   `json:"is_valid_syntax" csv:"Syntax issues"`
	Username      string `json:"username,omitempty"`
	Suggestion    string `json:"suggestion,omitempty"`
}
