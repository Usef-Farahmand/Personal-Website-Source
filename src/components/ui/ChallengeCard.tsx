import type { ProjectChallenge } from "@/content/types";

interface ChallengeCardProps {
  challenge: ProjectChallenge;
  labels: { problem: string; solution: string; outcome: string };
}

export function ChallengeCard({ challenge, labels }: ChallengeCardProps) {
  return (
    <div
      data-animate
      className="border-border bg-surface grid grid-cols-1 gap-5 rounded-lg border p-6 sm:grid-cols-3"
    >
      <div>
        <h3 className="text-caption text-text-secondary font-semibold tracking-wide uppercase">
          {labels.problem}
        </h3>
        <p className="text-small text-text-primary mt-1.5">
          {challenge.problem}
        </p>
      </div>
      <div>
        <h3 className="text-caption text-text-secondary font-semibold tracking-wide uppercase">
          {labels.solution}
        </h3>
        <p className="text-small text-text-primary mt-1.5">
          {challenge.solution}
        </p>
      </div>
      <div>
        <h3 className="text-caption text-accent font-semibold tracking-wide uppercase">
          {labels.outcome}
        </h3>
        <p className="text-small text-text-primary mt-1.5">
          {challenge.outcome}
        </p>
      </div>
    </div>
  );
}
