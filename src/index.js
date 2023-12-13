
import { scanDirsForSqlFiles } from './scanDirsForSqlFiles.js';
import checkbox from '@inquirer/checkbox';
import { select, input } from '@inquirer/prompts';
import fse from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { getSettings } from './settings.js'
import { getRestoreCommand, getBackupCommand } from './getBackupCommand.js'

export default async (currentDirectory) => {

  const settings = await getSettings(currentDirectory)

  const backupCommand = getBackupCommand(settings)
  const restoreCommand = getRestoreCommand(settings)

  console.log(chalk.cyan('Backup command:'))
  console.log(`"${ chalk.green(backupCommand) }"`)
  
  console.log(chalk.cyan('Restore command:'))
  console.log(`"${ chalk.green(restoreCommand) }"`)

}