import { ApiProperty } from '@nestjs/swagger';

export class PriorityStatsDto {
  @ApiProperty()
  low: number;

  @ApiProperty()
  medium: number;

  @ApiProperty()
  high: number;
}

export class ProjectSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  totalTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  progressPercentage: number;
}

export class UpcomingDeadlineDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  projectName: string;

  @ApiProperty()
  projectColor: string;
}

export class RecentActivityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string; // 'task_created' | 'task_completed' | 'project_created'

  @ApiProperty()
  title: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  metadata?: string;
}

export class DashboardStatsDto {
  @ApiProperty()
  totalProjects: number;

  @ApiProperty()
  totalTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  inProgressTasks: number;

  @ApiProperty()
  todoTasks: number;

  @ApiProperty()
  overdueTasks: number;

  @ApiProperty()
  completionRate: number;

  @ApiProperty({ type: PriorityStatsDto })
  tasksByPriority: PriorityStatsDto;

  @ApiProperty({ type: [UpcomingDeadlineDto] })
  upcomingDeadlines: UpcomingDeadlineDto[];

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivities: RecentActivityDto[];

  @ApiProperty({ type: [ProjectSummaryDto] })
  projectSummaries: ProjectSummaryDto[];
}
