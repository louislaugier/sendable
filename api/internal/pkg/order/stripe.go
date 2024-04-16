package order

// On link generation:
// prevent 2 or more ongoing orders at the same time except if (in that case cancel current one):
// - latest valid ongoing order is user's only order and is less than 7 days old (ongoing trial)
// - latest valid ongoing order = premium and NEW incoming order = enterprise
