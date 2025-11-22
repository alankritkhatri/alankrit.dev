import { useEffect, useState } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import "react-activity-calendar/tooltips.css";

const GitHubGraph = () => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://github-contributions-api.jogruber.de/v4/alankritkhatri?y=last"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }
        const json = await response.json();
        setData(json.contributions);

        // Calculate total
        const total = json.contributions.reduce(
          (acc: number, curr: Activity) => acc + curr.count,
          0
        );
        setTotalContributions(total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-neutral-500 animate-pulse">
        Loading activity...
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full border border-[#131313] rounded-xl p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-normal">
          {totalContributions.toLocaleString()} contributions in the last year
        </h2>
      </div>

      <div className="w-full flex justify-center">
        <ActivityCalendar
          data={data}
          theme={{
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
          colorScheme="dark"
          blockSize={9}
          blockMargin={2}
          blockRadius={2}
          fontSize={10}
          showTotalCount={false}
          showColorLegend={false}
          showWeekdayLabels
        />
      </div>
    </div>
  );
};

export default GitHubGraph;
