import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

ConfigModule.forRoot({
    envFilePath: '.env',
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
    type: 'postgres',
    host: configService.get('DB_HOST'), // TODO: Corregir el reconocimiento del HOST de Docker del local
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASS'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
}
/*
    * En Windows, el comando export(LINUX) se reemplaza por set
    * Ver como solucionar el DB_HOST, ya que dentro de docker reconoce
       host.docker.internal, y fuera de este, como localhost
    * Ver cómo corregir el error dentro de docker de ../../ por src/
*/
export const AppDS = new DataSource(DataSourceConfig);