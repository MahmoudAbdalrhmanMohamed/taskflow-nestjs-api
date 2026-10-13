import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskProjectSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;
}

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ['TODO', 'IN_PROGRESS', 'DONE'] })
  status: string;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH'] })
  priority: string;

  @ApiPropertyOptional()
  dueDate?: Date;

  @ApiProperty()
  order: number;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: TaskProjectSummaryDto })
  project?: TaskProjectSummaryDto;
}
