import { ACTION, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case ACTION.CREATE:
      return `Criou ${entityType.toLowerCase()} ${entityTitle}`;
    case ACTION.UPDATE:
      return `Atualizou ${entityType.toLowerCase()} ${entityTitle}`;
    case ACTION.DELETE:
      return `Deletou ${entityType.toLowerCase()} ${entityTitle}`;
    default:
      return `Realizou uma ação em ${entityType.toLowerCase()} ${entityTitle}`;
  }
}