import { BriefcaseBusiness } from "lucide-react";

export function EmptyState({
  title,
  action,
  onAction
}: {
  title: string;
  action: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <BriefcaseBusiness size={26} />
      </div>
      <strong>{title}</strong>
      {onAction ? (
        <button className="secondary-button" onClick={onAction}>
          {action}
        </button>
      ) : (
        <span>{action}</span>
      )}
    </div>
  );
}
