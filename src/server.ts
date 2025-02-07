import express from 'express'

import { MongoConnect } from '@/config/db.config'
import { environments } from '@/config/environment.config'
import indexRoute from '@/routes'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/v1', indexRoute)

const mongoConnect = new MongoConnect()
mongoConnect.init()

const start = async () => {
	const mongoConnect = new MongoConnect()
	await mongoConnect.init()

	const port = environments.PORT

	app.listen(port, () => {
		console.log(`Server running on port ${port}`)
	})
}

start()
