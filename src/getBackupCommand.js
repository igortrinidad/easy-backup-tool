
import path from 'path'

export const getRestoreCommand = (settings) => {

  let command = ''
  if(settings.useDocker) {
    command += `docker exec -i ${ settings.dockerContainerName } `
  }

  command += `${ settings.dbEngine === 'postgres' ? 'psql' : 'mysql' } -U ${ settings.databaseUser } -p ${ settings.databaseName } < ${ settings.backupFilePath }`
  return command
}

export const getBackupCommand = (settings) => {

  let command = ''
  if(settings.useDocker) {
    command += `docker exec -i ${ settings.dockerContainerName } `
  }

  const backupFilePath = path.join(`${ settings.databaseName }-${ new Date().toISOString().replace(/:/g, '-') }.sql`)

  command += `${ settings.dbEngine === 'postgres' ? 'pg_dump' : 'mysqldump' } -U ${ settings.databaseUser } -p ${ settings.databaseName } > ${ backupFilePath }`
  return command

}
