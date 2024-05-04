package config

const APIVersionPrefix = "/v1"

func Load() {
	loadEnv()

	initDatabaseConnection()

	initTransactionalEmailsClient()
}
