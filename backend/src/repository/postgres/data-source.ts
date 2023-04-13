import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { DB_URI } from '../../config'
import { entities } from './entities'

const uri = new URL(DB_URI)

export const AppDataSource = new DataSource({
	// @ts-ignore
	type: uri.protocol.slice(0, -1),
	host: uri.hostname,
	port: +(uri.port || 5432),
	username: uri.username,
	password: uri.password || undefined,
	database: uri.pathname.slice(1),
	synchronize: false,
	logging: process.env.LOG_SQL === '1' ? true : ['error'],
	entities,
	migrations: ['src/repository/postgres/migrations/*.ts'],
	extra: { connectionLimit: 2 },
	namingStrategy: new SnakeNamingStrategy()
})