import { defaultSettings } from './enums.js'
import checkbox from '@inquirer/checkbox';
import { select, input } from '@inquirer/prompts';
import fse from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { scanDirsForSqlFiles } from './scanDirsForSqlFiles.js';


export const getSettings = async (currentDirectory) => {

  const settingsRcExists = fse.pathExistsSync(`${currentDirectory}/.easy-backup-toolrc`)
  let settings

  if(settingsRcExists) {
    const useFoundedSettings = await select({
      message: 'We found a .easy-backup-toolrc file, do you want to use it?',
      choices: [
        {
          name: 'Yes',
          value: true
        },
        {
          name: 'No',
          value: false
        }
      ]
    })

    if(!useFoundedSettings) {
      settings = await defineUserSettings(currentDirectory)
    } else {
      settings =  await fse.readJson(`${currentDirectory}/.easy-backup-toolrc`)
    }
  }

  saveSettings(currentDirectory, settings)
  
  return settings

}

export const saveSettings = async (currentDirectory, settings) => {
  fse.writeFileSync(`${currentDirectory}/.easy-backup-toolrc`, JSON.stringify(settings, null, 2))
}

export const defineUserSettings = async (currentDirectory) => {

  const settings = defaultSettings

  settings.useDocker = await select({
    message: 'Use docker?',
    choices: [
      {
        name: 'Yes',
        value: true
      },
      {
        name: 'No',
        value: false
      }
    ]
  })

  if(settings.useDocker) {
    settings.dockerContainerName = await input({
      message: 'Please enter the docker container name of the database to restore:',
    })
  }

  settings.dbEngine = await select({
    message: 'Database engine:',
    choices: [
      {
        name: 'postgres',
        value: 'postgres'
      },
      {
        name: 'mysql',
        value: 'mysql'
      },
    ]
  })

  settings.databaseName = await input({
    message: 'Please enter the database name:',
  })
  
  settings.databaseUser = await input({
    message: 'Please enter the database user:',
  })

  const fileExtension = await input({
    message: 'Please enter the backup file extension: (default: .sql)',
    default: '.sql'
  })


  let sqlFiles = []

  const scanDirs = await select({
    message: 'Scan directories for backup files?',
    choices: [
      {
        name: 'Yes',
        value: true
      },
      {
        name: 'No',
        value: false
      }
    ]
  })

  if(scanDirs) {
    sqlFiles = await scanDirsForSqlFiles(fileExtension, currentDirectory, 5)

    const choices = sqlFiles.map((item) => {
      return { name: item, value: item }
    })

    settings.backupFilePath = await select({
      message: 'Select the file to use as backup:',
      choices,
    })

  } else {
    settings.backupFilePath = await input({
      message: 'Please enter the path to the backup file:'
    })

  }

  return settings

}