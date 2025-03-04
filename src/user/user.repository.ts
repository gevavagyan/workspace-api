import {DataSource, Repository} from 'typeorm';
import { User } from './entities/user.entity';
import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {userSelectProperties} from "./constants/query.constants";

@Injectable()
export class UserRepository extends Repository<User> {

    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(userDto: CreateUserDto): Promise<User> {
        const user = this.create(userDto);
        return await this.save(user);
    }

    async findByPK(id: number): Promise<User | null> {
        return this.findOne({where: {id}, select: userSelectProperties})
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }
}
