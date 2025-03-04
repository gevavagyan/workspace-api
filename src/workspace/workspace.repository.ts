import {DataSource, InsertResult, Repository, UpdateResult} from 'typeorm';
import {Injectable} from "@nestjs/common";
import {Workspace} from "./entities/workspace.entity";
import {CreateWorkspaceDto} from "./dto/create-workspace.dto";
import {UpdateWorkspaceDto} from "./dto/update-workspace.dto";

@Injectable()
export class WorkspaceRepository extends Repository<Workspace> {
    constructor(private dataSource: DataSource) {
        super(Workspace, dataSource.createEntityManager());
    }

    async createWorkspace(workspaceDto: CreateWorkspaceDto, user): Promise<InsertResult> {
            return this.createQueryBuilder()
            .insert()
            .into(Workspace)
            .values({
                user,
                ...workspaceDto
            })
            .returning('*')
            .execute();
    }

    async updateWorkspace(workspaceId: number, workspaceDto: UpdateWorkspaceDto): Promise<UpdateResult> {
       return await this.update({id: workspaceId}, workspaceDto);
    }

    async deleteWorkspace(workspaceId: number): Promise<any> {
        return this.delete(workspaceId);
    }

    async findByPK(id: number) {
        return this.findOne({where: {id}})
    }

    async findBySlug(slug: string) {
        return this.findOne({where: {slug}})
    }

    async getUserWorkspaces(userId: number) {
        return this.createQueryBuilder('workspace')
            .leftJoinAndSelect('workspace.user', 'user')
            .where('user.id = :userId', { userId })
            .getMany();
    }

    async generateSlugSuggestions(baseSlug: string): Promise<string[]> {
        const similarSlugs = await this
            .createQueryBuilder('workspace')
            .where('workspace.slug ILIKE :slugPattern', { slugPattern: `${baseSlug}%` })
            .select('workspace.slug')
            .getMany();

        const slugsSet = new Set(similarSlugs.map((w) => w.slug));

        const suggestions: string[] = [];

        let i = 1;
        while (suggestions.length < 4) {
            const newSlug = `${baseSlug}${i}`;
            if (!slugsSet.has(newSlug)) {
                suggestions.push(newSlug);
            }
            ++i;
        }

        return suggestions;
    }
}
