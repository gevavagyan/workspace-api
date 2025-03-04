import {IsNotEmpty, IsString} from "class-validator";

export class CreateWorkspaceDto {
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;
}
