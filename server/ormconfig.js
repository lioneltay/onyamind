module.exports = {
  type: "postgres",
  host: `localhost`,
  port: 5432,
  username: "lioneltay",
  password: "password",
  database: "tekktekk_notes",
  synchronize: false,
  logging: false,
  entities: ["./src/services/db/entities/index.ts"],
  migrations: ["./src/services/db/migrations/**/*.ts"],
  subscribers: ["./src/services/db/subscribers/**/*.ts"],
  cli: {
    migrationsDir: "src/services/db/migrations",
  },
}
