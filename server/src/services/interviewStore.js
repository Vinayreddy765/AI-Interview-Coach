const sessions = new Map();

export function createSession(session) {
  sessions.set(session.id, session);
  return session;
}

export function getSession(id) {
  return sessions.get(id);
}

export function updateSession(id, updater) {
  const session = sessions.get(id);
  if (!session) return null;
  const next = updater(session);
  sessions.set(id, next);
  return next;
}
