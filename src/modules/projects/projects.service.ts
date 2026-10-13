import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { ownerId: userId },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter((t) => t.status === 'DONE').length;
      const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length;
      const progressPercentage =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const { tasks, ...rest } = project;
      return {
        ...rest,
        stats: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          progressPercentage,
        },
      };
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === 'DONE').length;
    const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length;
    const progressPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      ...project,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        progressPercentage,
      },
    };
  }

  async create(userId: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        color: dto.color || '#6366F1',
        icon: dto.icon || 'folder',
        status: dto.status || 'active',
        ownerId: userId,
      },
    });

    return {
      ...project,
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        progressPercentage: 0,
      },
    };
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (existing.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.color && { color: dto.color }),
        ...(dto.icon && { icon: dto.icon }),
        ...(dto.status && { status: dto.status }),
      },
      include: {
        tasks: {
          select: { id: true, status: true },
        },
      },
    });

    const totalTasks = updated.tasks.length;
    const completedTasks = updated.tasks.filter((t) => t.status === 'DONE').length;
    const inProgressTasks = updated.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todoTasks = updated.tasks.filter((t) => t.status === 'TODO').length;
    const progressPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const { tasks, ...rest } = updated;
    return {
      ...rest,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        progressPercentage,
      },
    };
  }

  async delete(id: string, userId: string) {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (existing.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully', id };
  }
}
