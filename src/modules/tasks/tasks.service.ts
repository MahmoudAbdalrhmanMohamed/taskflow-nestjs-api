import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: TaskQueryDto) {
    const where: any = { userId };

    if (query.projectId) {
      where.projectId = query.projectId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any[] = [];
    if (query.sortBy) {
      const orderDirection = query.sortOrder || 'asc';
      orderBy.push({ [query.sortBy]: orderDirection });
    } else {
      orderBy.push({ order: 'asc' });
      orderBy.push({ createdAt: 'desc' });
    }

    return this.prisma.task.findMany({
      where,
      orderBy,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    // Verify project ownership
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You cannot add tasks to a project you do not own');
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        order: dto.order ?? 0,
        projectId: dto.projectId,
        userId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('You do not have access to update this task');
    }

    if (dto.projectId && dto.projectId !== existing.projectId) {
      const newProject = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });
      if (!newProject || newProject.ownerId !== userId) {
        throw new ForbiddenException('Target project not found or not owned by you');
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.projectId && { projectId: dto.projectId }),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const existing = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('You do not have access to delete this task');
    }

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: 'Task deleted successfully', id };
  }
}
