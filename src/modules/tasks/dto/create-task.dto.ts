import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement biometric authentication' })
  @IsString()
  @IsNotEmpty({ message: 'Task title is required' })
  title: string;

  @ApiPropertyOptional({ example: 'Add FaceID and fingerprint scanner support via local_auth' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' })
  @IsOptional()
  @IsIn(['TODO', 'IN_PROGRESS', 'DONE'], { message: 'Status must be TODO, IN_PROGRESS, or DONE' })
  status?: string;

  @ApiPropertyOptional({ enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' })
  @IsOptional()
  @IsIn(['LOW', 'MEDIUM', 'HIGH'], { message: 'Priority must be LOW, MEDIUM, or HIGH' })
  priority?: string;

  @ApiPropertyOptional({ example: '2026-10-25T12:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  dueDate?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ example: 'uuid-project-id' })
  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;
}
