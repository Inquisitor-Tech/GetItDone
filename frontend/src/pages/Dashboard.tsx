import ProgressBar from "../components/ProgressBar";

const mockTasks = [
  {
    id: 1,
    title: "Apply to 3 jobs",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Read 20 pages",
    priority: "Medium",
    completed: true,
  },
  {
    id: 3,
    title: "Work on portfolio app",
    priority: "High",
    completed: false,
  },
];

const mockHabits = [
  {
    id: 1,
    metricName: "Pages read",
    currentValue: 10,
    targetValue: 20,
    frequency: "Daily",
  },
  {
    id: 2,
    metricName: "Km run",
    currentValue: 3,
    targetValue: 5,
    frequency: "Daily",
  },
  {
    id: 3,
    metricName: "Cold calls made",
    currentValue: 7,
    targetValue: 10,
    frequency: "Weekly",
  },
];

function Dashboard() {
  const completedTasks = mockTasks.filter((task) => task.completed).length;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Welcome back</p>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Track your tasks, habits, streaks, and progress in one place.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Current streak</p>
            <p className="mt-2 text-3xl font-bold">5 days</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Tasks completed</p>
            <p className="mt-2 text-3xl font-bold">
              {completedTasks}/{mockTasks.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Leaderboard rank</p>
            <p className="mt-2 text-3xl font-bold">#24</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Today’s tasks</h2>
              <button className="rounded-lg bg-black px-3 py-2 text-sm text-white">
                Add task
              </button>
            </div>

            <div className="space-y-3">
              {mockTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3"
                >
                  <div>
                    <p
                      className={`font-medium ${
                        task.completed ? "text-gray-400 line-through" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Priority: {task.priority}
                    </p>
                  </div>

                  <span className="text-sm">
                    {task.completed ? "Done" : "Open"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active habits</h2>
              <button className="rounded-lg bg-black px-3 py-2 text-sm text-white">
                Log progress
              </button>
            </div>

            <div className="space-y-4">
              {mockHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="rounded-xl border border-gray-200 p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{habit.metricName}</p>
                      <p className="text-sm text-gray-500">
                        {habit.frequency} goal
                      </p>
                    </div>
                  </div>

                  <ProgressBar
                    current={habit.currentValue}
                    target={habit.targetValue}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;