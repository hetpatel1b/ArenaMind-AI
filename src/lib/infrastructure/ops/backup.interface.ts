export interface SnapshotMetadata {
  id: string;
  createdAt: string;
  sizeBytes: number;
  checksum: string;
}

export interface IBackupProvider {
  createSnapshot(resourceId: string): Promise<SnapshotMetadata>;
  restoreFromSnapshot(snapshotId: string): Promise<boolean>;
  listSnapshots(): Promise<SnapshotMetadata[]>;
}
