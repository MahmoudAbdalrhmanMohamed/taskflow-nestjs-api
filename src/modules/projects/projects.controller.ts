import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user projects with statistics' })
  @ApiResponse({ status: 200, type: [ProjectResponseDto] })
  async findAll(@CurrentUser('id') userId: string) {
    return this.projectsService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, type: ProjectResponseDto })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID with its tasks' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.delete(id, userId);
  }
}
