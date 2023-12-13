
import { folderToExclude } from './enums.js'
import fse from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { getAboveDirPath } from './pathHelpers.js'

export const scanDirsForSqlFiles = async (fileExtension = '.sql', entryPath, deepth = 3) => {

  var currentPath = path.join(entryPath)

  try {
    const sqlFilesFounded = Array.from({ length: deepth }, (_, i) => i).reduce((acc, i) => {
      const foundSqlFiles = recursiveScanInsideDirs(currentPath, fileExtension, deepth)
        .filter((item) => !acc.includes(item))
      currentPath = getAboveDirPath(currentPath)
      return [ ...acc, ...foundSqlFiles]
    }, [])

    return sqlFilesFounded
    
  } catch (error) {
    console.error(chalk.red(`Error while scanDirsForSqlFiles ${currentPath}`), error.message)
  }

}


export const recursiveScanInsideDirs = (currentPath, fileExtension, currentDepth = 3, currentFiles = []) => {
  
  if (currentDepth <= 0) {
    return currentFiles;
  }

  try {
    const items = fse.readdirSync(currentPath)
    
    return items.reduce((acc, item) => {
      const itemPath = path.join(currentPath, item)
      if (fse.statSync(itemPath).isDirectory() && !folderToExclude.includes(item)) {
        const insideFolderSqlFiles = recursiveScanInsideDirs(itemPath, fileExtension, currentDepth - 1, currentFiles)
          .filter((item) => !acc.includes(path.join(currentPath, item)))
        return [...acc, ...insideFolderSqlFiles];
      }
      if(path.extname(itemPath) === fileExtension && !acc.includes(itemPath)) {
        return [...acc, itemPath]
      }
      return acc;
    }, [])
    
  } catch (error) {
    // console.error(chalk.red(`Error while scanning ${currentPath}`), error.message)
    return currentFiles
  }
  
}
