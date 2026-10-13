import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const now = new Date();

    // Fetch projects with their tasks for this user
    const [projects, tasks] = await Promise.all([
      this.prisma.project.findMany({
        where: { ownerId: userId },
        include: {
          tasks: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.task.findMany({
        where: { userId },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todoTasks = tasks.filter((t) => t.status === 'TODO').length;

    // Overdue tasks: dueDate < now and status != DONE
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE',
    ).length;

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Priority breakdown
    const tasksByPriority = {
      low: tasks.filter((t) => t.priority === 'LOW').length,
      medium: tasks.filter((t) => t.priority === 'MEDIUM').length,
      high: tasks.filter((t) => t.priority === 'HIGH').length,
    };

    // Upcoming deadlines: non-done tasks with dueDate >= now, sorted by dueDate asc
    const upcomingDeadlines = tasks
      .filter((t) => t.dueDate && new Date(t.dueDate) >= now && t.status !== 'DONE')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
        status: t.status,
        projectName: t.project.name,
        projectColor: t.project.color,
      }));

    // Recent activities derived from recent tasks
    const recentActivities = tasks.slice(0, 6).map((t) => ({
      id: t.id,
      type: t.status === 'DONE' ? 'task_completed' : 'task_updated',
      title: t.title,
      timestamp: t.updatedAt,
      metadata: `Project: ${t.project.name} • Status: ${t.status}`,
    }));

    // Project summaries
    const projectSummaries = projects.map((p) => {
      const pTotal = p.tasks.length;
      const pCompleted = p.tasks.filter((t) => t.status === 'DONE').length;
      return {
        id: p.id,
        name: p.name,
        color: p.color,
        totalTasks: pTotal,
        completedTasks: pCompleted,
        progressPercentage:
          pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0,
      };
    });

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      completionRate,
      tasksByPriority,
      upcomingDeadlines,
      recentActivities,
      projectSummaries,
    };
  }
}
