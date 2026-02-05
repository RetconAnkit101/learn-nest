import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as path from "path";
import { registerAs } from "@nestjs/config";

export default registerAs(
  "dbConfig.env",
  (): PostgresConnectionOptions => ({
    type: "postgres",
    url: process.env.url,
    entities: [path.join(__dirname, "..", "**", "*.entity{.ts,.js}")],
    synchronize: true,
  })
);
