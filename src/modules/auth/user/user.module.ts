import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/lib/entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";

@Module({
    imports:[ TypeOrmModule.forFeature([User])],
    controllers:[UserController],
    providers:[UserService,UserRepository]
})
export class UserModule {}