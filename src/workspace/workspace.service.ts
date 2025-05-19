import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import {WorkspaceRepository} from "./workspace.repository";

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository,) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, user: number) {
    return this.workspaceRepository.createWorkspace({...createWorkspaceDto}, user);
  }

  async findOne(id: number) {
    return this.workspaceRepository.findByPK(id);
  }

  async findOneBySlug(slug: string) {
    return this.workspaceRepository.findBySlug(slug);
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspaceRepository.updateWorkspace(id, updateWorkspaceDto);
  }

  async remove(id: number) {
   return  this.workspaceRepository.deleteWorkspace(id);
  }

  async checkSlugAvailability(slug: string): Promise<{ isAvailable: boolean; slugOptions?: string[] }> {
    const existingWorkspace = await this.workspaceRepository.findBySlug(slug);

    if (!existingWorkspace) {
      return { isAvailable: true };
    }

    const slugOptions = await this.workspaceRepository.generateSlugSuggestions(slug);
    return { isAvailable: false, slugOptions };
  }

}
