"use client";

import { useMemo, useState } from "react";
import { useDrivesOverTime, useDrivesByCourseBWeek } from "@/hooks/useV2Data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";

export function DrivesOverTimeSection() {
  const { data: drivesData, loading: drivesLoading } = useDrivesOverTime();
  const { data: drivesByCourseData, loading: drivesCourseLoading } =
    useDrivesByCourseBWeek();
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  // Process drives data based on view mode
  const processedDrivesData = useMemo(() => {
    if (viewMode === "day") {
      return drivesData.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
    } else {
      // Group by week
      const grouped: Record<string, number> = {};
      drivesData.forEach((item) => {
        grouped[item.week_label] =
          (grouped[item.week_label] || 0) + item.drives;
      });
      return Object.entries(grouped).map(([week, drives]) => ({
        week_label: week,
        drives,
      }));
    }
  }, [drivesData, viewMode]);

  // Process drives by course data
  const processedCourseData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};
    drivesByCourseData.forEach((item) => {
      if (!grouped[item.week_label]) {
        grouped[item.week_label] = {};
      }
      grouped[item.week_label][item.course] = item.drives;
    });

    return Object.entries(grouped).map(([week, courses]) => ({
      week_label: week,
      ...courses,
    }));
  }, [drivesByCourseData]);

  const courses = useMemo(
    () => [...new Set(drivesByCourseData.map((item) => item.course))],
    [drivesByCourseData],
  );

  if (drivesLoading || drivesCourseLoading) {
    return <Skeleton className="h-96 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Drives Over Time with toggle */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                Drives Over Time
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Unique companies
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("day")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "day"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "week"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Week
              </button>
            </div>
          </div>
          <ChartContainer config={{}} className="h-64 w-full" key={viewMode}>
            <LineChart data={processedDrivesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey={viewMode === "day" ? "date" : "week_label"}
                stroke="#999"
              />
              <YAxis stroke="#999" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="drives"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Chart 2: Drives by Course by Week */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">
              Drives by Course by Week
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Unique Company-course
            </p>
          </div>

          <ChartContainer config={{}} className="h-64 w-full">
            <BarChart data={processedCourseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="week_label" stroke="#999" />
              <YAxis stroke="#999" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {courses.map((course, idx) => (
                <Bar
                  key={course}
                  dataKey={course}
                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                  isAnimationActive
                />
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
