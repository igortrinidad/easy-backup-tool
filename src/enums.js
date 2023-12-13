

export const folderToExclude = [
  'node_modules',
  'vendor',
  '.git',
  'dist',
  'public',
  'output',
  'docker-volumes',
  'docker_volumes',
  '.history',
  '.lh',
  '.vscode',
  '.github',
  '.nvm',
  '.npm'
]

export const defaultSettings = {
  dbEngine: 'postgres', // 'mysql' | 'postgres
  useDocker: false,
  dockerContainerName: '',
  databaseName: '',
  databaseUser: '',
  backupFilePath: '',
}