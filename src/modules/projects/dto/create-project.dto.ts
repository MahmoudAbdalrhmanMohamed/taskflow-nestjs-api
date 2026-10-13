import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Mobile Banking Redesign' })
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @ApiPropertyOptional({ example: 'Complete overhaul of mobile application client experience' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#6366F1', default: '#6366F1' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'folder', default: 'folder' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 'active', default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}
