
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
import * as path from "path";

export default ():PostgresConnectionOptions => ({
    // url should be in .env
    url: process.env.DATABASE_URL,
    type: "postgres",
    port: Number(process.env.DATABASE_PORT),
    entities: [path.resolve(__dirname), '..' + '/**/*.entity{.ts,.js}'],  //__dirname is a global variable that can access the whole current directory
    synchronize: false, // should be false in production
});