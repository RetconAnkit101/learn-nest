import { DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { PropertyFeatureFactory } from "./propertyFeature.factory";
import { PropertyFactory } from "./property.factory";
import { UserFactory } from "./user.factory";
import { MainSeeder } from "./main.seeder";
import { DataSource } from "typeorm";
import dbConfig from "src/config/dbConfig";

 const options : DataSourceOptions & SeederOptions = {
    ...dbConfig(), 
    factories: [PropertyFactory, UserFactory, PropertyFeatureFactory],
    seeds: [MainSeeder]
 }

 const dataSource = new DataSource(options);
 dataSource.initialize().then(async ()=> {
    await dataSource.synchronize(true);
    await runSeeders(dataSource)
    process.exit();
 });