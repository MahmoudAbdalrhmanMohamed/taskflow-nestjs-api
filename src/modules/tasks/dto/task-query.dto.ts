import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class TaskQueryDto {
  @ApiPropertyOptional({ description: 'Filter tasks by project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ enum: ['TODO', 'IN_PROGRESS', 'DONE'] })
  @IsOptional()
  @IsIn(['TODO', 'IN_PROGRESS', 'DONE'])
  status?: string;

  @ApiPropertyOptional({ enum: ['LOW', 'MEDIUM', 'HIGH'] })
  @IsOptional()
  @IsIn(['LOW', 'MEDIUM', 'HIGH'])
  priority?: string;

  @ApiPropertyOptional({ description: 'Search query for title and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['dueDate', 'createdAt', 'priority', 'order', 'title'] })
  @IsOptional()
  @IsIn(['dueDate', 'createdAt', 'priority', 'order', 'title'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
