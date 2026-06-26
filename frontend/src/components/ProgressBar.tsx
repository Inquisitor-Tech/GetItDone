type ProgressBarProps = {
  current: number;
  target: number;
};

function ProgressBar({ current, target }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-sm text-gray-600">
        <span>
          {current} / {target}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>

      <div className="h-3 w-full rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-black"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;