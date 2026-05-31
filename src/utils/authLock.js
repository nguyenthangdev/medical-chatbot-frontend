export const getLoginLockRemainingSeconds = (lockedUntil) => {
  if (!lockedUntil) return 0;
  return Math.max(Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 1000), 0);
};

export const formatLoginLockRemaining = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (minutes <= 0) return `${restSeconds}s`;
  return `${minutes} phút ${restSeconds.toString().padStart(2, '0')}s`;
};
