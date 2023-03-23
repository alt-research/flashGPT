export const STATUS = {
  INITIALIZING: 'STATUS_INITIALIZING',
  ACTIVE: 'STATUS_ACTIVE',
  TERMINATED: 'STATUS_TERMINATED',
  TERMINATING: 'STATUS_TERMINATING',
  FAILED: 'STATUS_FAILED',

  // UI ONLY
  PUBLIC: 'STATUS_PUBLIC',
};

export const getStatusLabel = deployment => {
  const deploymentStatus = deployment?.status;

  switch (deploymentStatus) {
    case STATUS.INITIALIZING: {
      return 'Deploying';
    }
    case STATUS.ACTIVE:
      return 'Active';
    case STATUS.TERMINATED:
      return 'Terminated';
    case STATUS.TERMINATING:
      return 'Terminating';
    case STATUS.FAILED:
      return 'Failed';
    default:
      return 'Unknown';
  }
};
