import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as path from "path";
import { registerAs } from "@nestjs/config";

export default registerAs(
  'dbConfig.env',
  (): PostgresConnectionOptions => {
    // console.log('process.env.DATABASE_URL =', process.env.DATABASE_URL);

    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      port: Number(process.env.DATABASE_PORT),
      entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
      synchronize: true,
    };
  },
);