package subscription

// On link generation:
// prevent 2 or more ongoing subscriptions at the same time except if (in that case cancel current one):
// - latest valid ongoing subscription is user's only subscription and is less than 7 days old (ongoing trial)
// - latest valid ongoing subscription = premium and NEW incoming subscription = enterprise
