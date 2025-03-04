import {FindOptionsSelect} from "typeorm";
import {User} from '../entities/user.entity'

const userSelectProperties: FindOptionsSelect<User> = {
    id: true,
    email: true,
    fullName: false,
    password: false,
};

export {userSelectProperties}
