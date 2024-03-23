package config

func Load() {
	loadEnv()

	initDatabaseConnection()

	initTransactionalEmailsClient()
}
