import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectStatsDto {
  @ApiProperty()
  totalTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  inProgressTasks: number;

  @ApiProperty()
  todoTasks: number;

  @ApiProperty()
  progressPercentage: number;
}

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  color: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: ProjectStatsDto })
  stats?: ProjectStatsDto;
}
