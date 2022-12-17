/*
 * FakeFileSystem.js
 * https://github.com/SkwalExe/FakeFileSystem.js
 * LICENSE: MIT
 */

/**
 * @type Class
 */
 class FFS {
    constructor(Partition) {
      /**
       * Different errors that can be returned by the FFS.
       * @type {Object}
       */
      this.Errors = {
        NOT_FOUND: 'No such file or directory',
        NOT_A_REGULAR_FILE: 'Not a regular file',
        NOT_A_DIRECTORY: 'Not a directory',
        FILE_ALREADY_EXISTS: 'File or directory already exists',
        SAME_FILE: 'Source and destination are the same',
        INVALID_NAME: 'Invalid file name, must ba at least one character long and cannot contain \\ / : * ? " < > |',
        ROOT_PROHIBITED: 'You cannot perform this operation on the root directory',
        NO_FILENAME: 'Missing file or directory name'
      }
        /**
         * This class is returned by most of the FFS functions.
         * @typedef {Object} Result
         * @property {String} Result.error - The error message.
         * @property {Boolean} Result.success - True if the operation was successful.
         * @property {any} Result.result - The data returned by the operation.
         * @property {String} Result.errorCause - the file that caused the error.
         */
      this.Result = class {
        constructor() {
          this.success = false
          this.error = null
          this.result = null
          this.errorCause = null
        }
      }
        /** @property {Array} FFS.tree the file system tree, contains all files and directories */
      this.tree = [{
        /**
         * The type of the file - 'file' or 'directory'
         * @type {string}
         */
        type: 'directory',
        /**
         * The name of the file or directory, can't contain '/' except for the root directory
         * @type {string}
         */
        name: '/',
        /**
         * The timestamp of the last modification of the file or directory
         * @type {number}
         */
        modified: Date.now(),
        /**
         * The path of the parent directory
         * @type {string}
         */
        parent: '/',
    
        /**
         * The children if its a directory or the content of the file if its a regular file
         * @type {Array | string}
         */
        content: []
    }];
    this.Partition = Partition;
    if(localStorage["FileSystem_"+this.Partition] != undefined){
        this.tree = JSON.parse(localStorage["FileSystem_"+Partition])
    }
  
      /**
       * The current working directory
       * @type {string}
       * @default "/"
       */
      this.currentDirectory = '/' // The current directory
  
      /**
       * This functions returns the informations about a path
       * @returns {Result}
       *
       * @example
       * let file = FFS.getPath("/hello/test.txt")
       * if (!file.success)
       *     return console.log(file.error)
       *
       * file = file.result
       * console.log(file.type) // 'file'
       * console.log(file.name) // 'test.txt'
       * console.log(file.modified) // the last modified date of the file
       * console.log(file.parent) // '/hello'
       * console.log(file.content) // the content of the file
       * @param {string} path the path to the file or directory
       */
  
      this.getPath = function(path) {
        // The result is returned as a FFS.Result class
        const result = new this.Result()
  
        // Remove trailing slashes, and useless chars
        path = this.simplifyPath(path)
  
        // If the path is '/' return the root directory
        if (path === '/') {
          result.success = true
          result.result = this.tree[0]
          return result
        }
  
        // Remove the first '/' to avoit empty elements when splitting the path
        if (path.startsWith('/')) { path = path.substring(1) }
  
        // The current directory we are looking in
        let currentDirectory = this.tree[0]
  
        // Split the path into its parts
        const pathArr = path.split('/')
  
        // Loop through the path parts
        for (let i = 0; i < pathArr.length; i++) {
          // The file or directory we are looking for
          const file = pathArr[i]
  
          // If the current directory is not a directory, return an error
          if (currentDirectory.type === 'file') {
            result.error = this.Errors.NOT_A_DIRECTORY
            result.errorCause = currentDirectory.name
            return result
          }
  
          // If we are at the last directory of the path
          if (i === pathArr.length - 1) {
            // If the file is found return it else return an error
            if (currentDirectory.content.find(f => f.name === file)) {
              result.result = currentDirectory.content.find(f => f.name === file)
              result.success = true
            } else {
              result.error = this.Errors.NOT_FOUND
              result.errorCause = file
            }
            return result
          }
  
          // If the next directory to look in is not found, return an error
          if ((currentDirectory = currentDirectory.content.find(e => e.name === file)) === undefined) {
            result.error = this.Errors.NOT_FOUND
            result.errorCause = file
            return result
          }
        }
      }
  
      /**
       * Check if a file or directory exists
       * @param {string} path the path to the file or directory
       * @returns {boolean} - whether the file exists or not
       *
       * @example
       * FFS.fileExists("/test") // true
       * FFS.fileExists("/myDirectory/") // true
       * FFS.fileExists("/DOES_NOT_EXIST") // false
       */
      this.fileExists = function(path) {
        // Try to get the file
        const result = this.getPath(path)
          // Return whether the operation was successful or not
        return result.success
      }
  
      /**
       * Check if a file is a regular file (not a directory)
       * @param {string} path the path to the file
       * @returns {boolean} - whether the file is a regular file or not
       *
       * @example
       * FFS.isRegularFile("/test.txt") // true
       * FFS.isRegularFile("/directory/") // false
       * FFS.isRegularFile("/DOES_NOT_EXIST") // false
       * FFS.isRegularFile("/directory/test.txt") // true
       */
      this.isRegularFile = function(path) {
        // Try to get the file
        const result = this.getPath(path)
          /*
           * If the operation was successful
           * -> return whether the file is a regular file or not
           * else return false
           */
        if (result.success) { return result.result.type === 'file' }
        return false
      }
  
      /**
       * Check if a file is a directory (not a regular file)
       * @param {string} path the path to the directory
       * @returns {boolean} - whether the directory exists or not
       *
       * @example
       * FFS.isDir("/test.txt") // false
       * FFS.isDir("/myDirectory/") // true
       * FFS.isDir("/DOES_NOT_EXIST/") // false
       */
      this.isDir = function(path) {
          // Try to get the file
        const result = this.getPath(path)
            /*
             * If the operation was successful
             * -> return whether the file is a directory or not
             * else return false
             */
        if (result.success) { return result.result.type === 'directory' }
        return false
      }
        /**
         * Get the content of a regular file
         * @param {string} path the path to the file
         * @returns {Result}
         *
         * @example
         * let file = FFS.getFileContent("/test.txt")
         * if (!file.success)
         *    return console.log(file.error)
         * console.log(file.result) // the content of the file
         */
      this.getFileContent = function(path) {
        // We return the result as a FFS.Result class
        const result = new this.Result()
          /*
           * If the file is a regular file
           * return its content
           */
        if (this.isRegularFile(path)) {
          result.success = true
          result.result = this.getPath(path).result.content
          return result
        } else if (this.isDir(path)) {
          // If the file is a directory, return an error
          result.error = this.Errors.NOT_A_REGULAR_FILE
          result.errorCause = path
  
          return result
        } else {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = path
  
          return result
        }
      }
  
      /**
       * Get the content of a directory
       * @param {string} path the path to the directory
       * @returns {Result}
       *
       * @example
       * let directory = FFS.getDirContent("/myDirectory/")
       * if (!directory.success)
       *   return console.log(directory.error)
       * console.log(directory.result) // The content of the directory as an array
       */
      this.getDirContent = function(path) {
          // We return the result as a FFS.Result class
        const result = new this.Result()
            /*
             * If the file is a directory
             * return its content
             */
        if (this.isDir(path)) {
          result.success = true
          result.result = this.getPath(path).result.content
          return result
        } else if (this.isRegularFile(path)) {
            // If the file is a regular file and not a dir, return an error
          result.error = this.Errors.NOT_A_DIRECTORY
          result.errorCause = path
          return result
        } else {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = path
          return result
        }
      }
        /**
         * Writes content to a file
         *
         * Creates the file if it does not exist
         * @param {string} path the path to the file
         * @param {string} content the content to write to the file
         * @param {boolean} append whether to append to the file or not
         * @returns {Result} The file object
         *
         * @example
         *
         * let result = FFS.writeFile("/test.txt", "Hello World!")
         * console.log(result.result) // the file object
         */
      this.writeFile = function(path, content, append = false) {
          // We return the result as a FFS.Result class
        let result = new this.Result()
            // Check if the file exists
        if (this.fileExists(path)) {
            /*
             * If it exists
             * check if it is a regular file
             */
          if (this.isRegularFile(path)) {
            const file = this.getPath(path).result
  
            if (append) {
                // Append the content to the file
              file.content += content
            } else {
                // Overwrite the content of the file
              file.content = content
            }
              // Return the file object
            result.success = true
            result.result = file
            this.Save();
            return result
          } else {
              // If it is not a regular file, return an error
            result.error = this.Errors.NOT_A_REGULAR_FILE
            result.errorCause = path
            return result
          }
        } else {
            // Create the file
          result = this.createFile(this.getParentPath(path), this.basename(path), content)
          this.Save();
          return result
        }
      }
        /**
         * Creates a file
         * @param {string} path the directory to create the file in
         * @param {string} filename the name of the file
         * @param {string} content the content of the file
         * @returns {Result}
         *
         * @example
         *
         * let result = FFS.writeFile("/", "test.txt", "Hello World!")
         * if (!result.success)
         *   return console.log(result.error)
         * console.log(result.result) // the created file
         *
         * let result = FFS.writeFile("/DOES_NOT_EXIST/", "test.txt")
         * if (!result.success)
         *   return console.log(result.error) // no such file or directory
         *                                    // result.errorCause = "/DOES_NOT_EXIST/"
         * ...
         */
      this.createFile = function(path, filename, content = '') {
          // We return the result as a FFS.Result class
        const result = new this.Result()
  
        if (!filename) {
          result.error = this.Errors.NO_FILENAME
          return result
        }
  
        path = this.simplifyPath(path)
  
          // Check if file name is valid
        if (!this.isValidName(filename)) {
          result.error = this.Errors.INVALID_NAME
          result.errorCause = filename
          return result
        }
          // If the file already exists
        if (this.fileExists(path + '/' + filename)) {
          result.error = this.Errors.FILE_ALREADY_EXISTS
          result.errorCause = this.simplifyPath(path + '/' + filename)
          return result
        }
  
          // The data for our new file
        const file = {
          type: 'file',
          name: filename,
          modified: Date.now(),
          parent: path,
          content
        }
  
          /*
           * Check if the parent directory exists
           * and check if it is a directory
           */
        if (!this.fileExists(path)) {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = path
          return result
        } else if (!this.isDir(path)) {
          result.error = this.Errors.NOT_A_DIRECTORY
          result.errorCause = path
          return result
        }
  
          // Get the parent directory
        const parent = this.getPath(path).result
  
          // Push the new file to the parent directory
        parent.content.push(file)
  
        result.success = true
        result.result = file
        this.Save();
        return result
      }
        /**
         * Creates a directory
         * @param {string} path the directory to create the directory in
         * @param {string} dirname the name of the directory
         * @returns {Result}
         *
         * @example
         *
         * let result = FFS.createDirectory("/", "myDirectory")
         * if (!result.success)
         *   return console.log(result.error)
         * console.log(result.result) // the created directory
         */
      this.createDir = function(path, dirname) {
        // We return the result as a FFS.Result class
        const result = new this.Result()
  
        if (!dirname) {
          result.error = this.Errors.NO_FILENAME
          return result
        }
  
        path = this.simplifyPath(path)
  
        // Check if name is valid
        if (!this.isValidName(dirname)) {
          result.error = this.Errors.INVALID_NAME
          result.errorCause = dirname
          return result
        }
  
        // Check if a file already exists
        if (this.fileExists(path + '/' + dirname)) {
          result.error = this.Errors.FILE_ALREADY_EXISTS
          result.errorCause = this.simplifyPath(path + '/' + dirname)
          return result
        }
  
        // The data for our new directory
        const dir = {
          type: 'directory',
          name: dirname,
          modified: Date.now(),
          parent: path,
          content: []
        }
  
        /*
         * Check if the parent directory exists
         * and check if it is a directory
         */
        if (!this.fileExists(path)) {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = path
          return result
        } else if (!this.isDir(path)) {
          result.error = this.Errors.NOT_A_DIRECTORY
          result.errorCause = path
          return result
        }
  
        // Get the parent directory
        const parent = this.getPath(path).result
          // Push the new directory to the parent directory
        parent.content.push(dir)
  
        result.success = true
        result.result = dir
        this.Save();
        return result
      }
  
      /**
       * Simplifies a path
       * @param {string} path the path to simplify
       * @returns {string} the simplified path
       *
       * - Remove leading and trailing whitespace
       * - Removes the trailing slash
       * - parse the '.' and '..'
       * - replace all "//" by "/"
       * - ...
       *
       * @example
       *
       * "/myDirectory/../myDirectory/test.txt" -> "/myDirectory/test.txt"
       *
       * "  /myDirectory/././../myDirectory/./test.txt" -> "/myDirectory/test.txt"
       */
      this.simplifyPath = function(path) {
        // Remove trailing and leading whitespaces
        path = path.trim()
  
        // Return current path if it is empty
        if (path === '') { return this.currentDirectory }
  
        // Replace all "//" by "/"
        while (path.indexOf('//') !== -1) { path = path.replace(/\/\//g, '/') }
  
        // Return '/' if the path is '/'
        if (path === '/') { return '/' }
  
        // Remove the trailing slash
        if (path.endsWith('/')) { path = path.substring(0, path.length - 1) }
  
        // Replace leading './' with absolute path
        if (path.startsWith('./')) { path = this.simplifyPath(this.currentDirectory + '/' + path.substring(2)) }
  
        // Replace leading '../' with absolute path
        if (path.startsWith('../')) {
          const parent = this.getPath(this.currentDirectory).result
  
          path = this.simplifyPath(parent.parent + path.substring(2))
        }
  
        // Add current directory if the path does not start with '/'
        if (!path.startsWith('/')) { return this.simplifyPath(this.currentDirectory + '/' + path) }
  
        // Parse '.' and '..'
        let pathArr = path.split('/')
          // Remove ''
        pathArr = pathArr.filter(e => e !== '')
        const result = []
        for (let i = 0; i < pathArr.length; i++) {
          const file = pathArr[i]
          if (file === '.') { continue }
          if (file === '..') {
            if (result.length > 0) { result.pop() }
            continue
          }
  
          result.push(file)
        }
  
        return '/' + result.join('/')
      }
  
      /**
       * Deletes a file or directory
       *
       * @param {string} path
       * @returns {Result} The deleted file or directory
       *
       * @example
       *
       * let result = FFS.deleteFile("/myDirectory/test.txt")
       * if (!result.success)
       *     return console.log(result.error)
       * console.log(result.result) // the deleted file
       */
      this.delete = function(path) {
        // We return the result as a FFS.Result class
        const result = new this.Result()
  
        // Check if path is not root directory
        if (path === '/') {
          result.error = this.Errors.ROOT_PROHIBITED
          result.errorCause = path
          return result
        }
  
        // Check if the file exists
        if (!this.fileExists(path)) {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = path
          return result
        }
        // Get the file
        const file = this.getPath(path).result
  
        // Get the parent directory
        const parent = this.getPath(file.parent).result
  
        // Remove the file from the parent directory
        parent.content = parent.content.filter(e => e !== file)
  
        // Return the file data
        result.success = true
        result.result = file
        this.Save();
        return result
      }
  
      /**
       * Get parent directory
       * @param {string} path
       * @returns {Result}
       *
       * @example
       *
       * let result = FFS.getParent("/myDirectory/test.txt")
       * if (!result.success)
       *   return console.log(result.error)
       * console.log(result.result) // the parent directory {name: 'myDirectory'...}
       */
      this.getParent = function(path) {
        // We return the result as a FFS.Result class
        const result = new this.Result()
  
        // Simplify the path
        path = this.simplifyPath(path)
  
        // Remove everything after the last '/'
        path = this.getParentPath(path)
  
        if (path === '') { path = '/' }
  
        // If the parent directory does not exist
        if (!this.fileExists(path)) {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = path
          return result
        }
  
        // Check if the parent is a directory
        if (!this.isDir(path)) {
          result.error = this.Errors.NOT_A_DIRECTORY
          result.errorCause = path
          return result
        }
  
        // Get the parent directory
        result.result = this.getPath(path).result
  
        result.success = true
        return result
      }
  
      /**
       * Extract the base name of a path
       * @param {string} path
       * @returns {string} the base name
       *
       * @example
       *
       * FFS.getBaseName("/myDirectory/test.txt") -> "test.txt"
       * FFS.getBaseName("/myDirectory/") -> "myDirectory"
       * FFS.getBaseName("/") -> "/"
       */
      this.basename = function(path) {
        path = this.simplifyPath(path)
          // Check if the path is not root directory
        if (path === '/') { return '/' }
        return path.substring(path.lastIndexOf('/') + 1)
      }
  
      /**
       * Get the path of the parent directory of a file
       * @param {string} path
       * @returns {string} the path of the parent directory
       *
       * @example
       *
       * FFS.getParentPath("/myDirectory/test.txt") -> "/myDirectory"
       */
      this.getParentPath = function(path) {
        path = this.simplifyPath(path)
          // Check if the path is not root directory
        if (path === '/') { return '/' }
  
        return path.substring(0, path.lastIndexOf('/'))
      }
  
      /**
       * Get the full path of a file
       * @param {Object} file
       * @returns {string} the full path
       *
       * @example
       *
       * let file = FFS.getPath("/myDirectory/test.txt").result
       * console.log(FFS.getFullPath(file)) // the full path of the file
       */
      this.getFullPath = function(file) {
        return this.simplifyPath(file.parent + '/' + file.name)
      }
  
      /**
       * Checks if two path refer to the same file
       * @param {string} path1
       * @param {string} path2
       * @returns {boolean} true if the two paths refer to the same file
       *
       * @example
       *
       * FFS.isSameFile("/myDirectory/test.txt", "/myDirectory/test.txt") -> true
       * FFS.isSameFile("/myDirectory../myDirectory/test.txt", "/myDirectory/test.txt") -> true
       */
      this.isSameFile = function(path1, path2) {
        path1 = this.simplifyPath(path1)
        path2 = this.simplifyPath(path2)
  
        return path1 === path2
      }
  
      /**
       * Test whether a file name is valid or not
       * @param {string} name
       * @returns {boolean} true if the file name is valid
       *
       * - file name must not contain \ / : * ? " < > | " '
       * - file name must be at least one character long
       * - file name must not be '.' or '..'
       *
       * @example
       *
       * FFS.isValidName("test.txt") -> true
       * FFS.isValidName("test/test.txt") -> false
       * FFS.isValidName("test:test.txt") -> false
       * FFS.isValidName("test<test.txt") -> false
       * FFS.isValidName("test>test.txt") -> false
       * FFS.isValidName("test?test.txt") -> false
       * FFS.isValidName("test*test.txt") -> false
       * FFS.isValidName("test|test.txt") -> false
       * FFS.isValidName("test\"test.txt") -> false
       * FFS.isValidName("test\\test.txt") -> false
       * FFS.isValidName(" ") -> false
       * FFS.isValidName("") -> false
       * FFS.isValidName(".") -> false
       * FFS.isValidName("..") -> false
       *
       * ...
       */
      this.isValidName = function(name) {
        name = name.trim()
          // Check if the name is at least one character long
        if (!name.length > 0) { return false }
  
        // Check if the name is '.' or '..'
        if (name === '.' || name === '..') { return false }
  
        // Check if the name contains any of the following characters
        if (/[\\/:*?"<>|']/.test(name)) { return false }
  
        // If we reach this point, the name is valid
        return true
      }
  
      /**
       * Copy a file or directory
       * @param {string} source the file to copy
       * @param {string} destination the destination path
       * @returns {Result} the copied file or directory
       *
       * @example
       *
       * let result = FFS.copy("/myDirectory/test.txt", "/myDirectory/test2.txt")
       * console.log(FFS.getDirContent("/myDirectory")) /
       * // [
       * //     {name: 'test.txt', ...},
       * //     {name: 'test2.txt', ...}
       * // ]
       *
       */
      this.copy = function(source, destination) {
        // We return the result as a FFS.Result class
        const result = new this.Result()
  
        // Check if source is not the root directory
        if (this.simplifyPath(source) === '/') {
          result.error = this.Errors.ROOT_PROHIBITED
          result.errorCause = source
          return result
        }
  
        // Check if source file exists
        if (!this.fileExists(source)) {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = source
          return result
        }
  
        // Check if source and destination are the same
        if (this.isSameFile(source, destination)) {
          result.error = this.Errors.SAME_FILE
          result.errorCause = source
          return result
        }
  
        // Get source file
        const file = this.getPath(source).result
  
        // If the destination file does not exist
        if (!this.fileExists(destination)) {
          // If the parent of the destination file does not exist
          if (!this.getParent(destination).success) {
            result.error = this.Errors.NOT_FOUND
            result.errorCause = this.getParentPath(destination)
            return result
          }
  
          // If the parent of the destination file is not a directory
          if (!this.isDir(this.getParentPath(destination))) {
            result.error = this.Errors.NOT_A_DIRECTORY
            result.errorCause = this.getParentPath(destination)
            return result
          }
  
          /*
           * If the parent of the destination file is a directory
           * create the destination file inside it
           */
          const destinationParent = this.getParent(destination).result
  
          const newFile = {
            name: this.basename(destination),
            type: file.type,
            content: file.content,
            modified: Date.now(),
            parent: this.getFullPath(destinationParent)
          }
  
          destinationParent.content.push(newFile)
  
          result.success = true
          result.result = newFile
          return result
        } else {
          /*
           * If the destination file exists
           * if file is not a directory
           */
          if (!this.isDir(destination)) {
            result.error = this.Errors.NOT_A_DIRECTORY
            result.errorCause = destination
            return result
          }
  
          // If a file with the same name already exists in the destination directory
          if (this.fileExists(destination + '/' + file.name)) {
            result.error = this.Errors.FILE_ALREADY_EXISTS
            result.errorCause = destination + '/' + file.name
            return result
          }
  
          // Copy the file in the destination directory
          destination = this.getPath(destination).result
          const newFile = {
            name: file.name,
            type: file.type,
            content: file.content,
            parent: destination.parent + '/' + destination.name,
            modified: Date.now()
          }
  
          // Add the file to the destination directory
          destination.content.push(newFile)
  
          result.success = true
          result.result = newFile
          return result
        }
      }
  
      /**
       * Move a file or directory
       * @param {string} source the file to move
       * @param {string} destination the destination path
       * @returns {Result} the moved file or directory
       *
       * @example
       *
       * FFS.writeFile("/myDirectory", "test.txt")
       *
       * FFS.move("/myDirectory/test.txt", "/myDirectory/test2.txt")
       *
       * console.log(FFS.getDirContent("/myDirectory"))
       * // [
       * //     {name: 'test2.txt', ...}
       * // ]
       */
      this.move = function(source, destination) {
        const result = new this.Result()
        source = this.simplifyPath(source)
        destination = this.simplifyPath(destination)
  
        const operation = this.copy(source, destination)
  
        if (!operation.success) {
          result.error = operation.error
          result.errorCause = operation.errorCause
          return result
        }
  
        // Remove the source file
        this.delete(source)
  
        result.success = true
        result.result = operation.result
        this.Save();
        return result
      }
  
      /**
       * Changes the current working directory
       * @param {string} path the path to the new working directory
       * @returns {Result} the new working directory
       *
       * @example
       *
       * FFS.changeDir("/myDirectory")
       */
      this.changeDir = function(path) {
        const result = new this.Result()
        path = this.simplifyPath(path)
  
        // Check if the path exists
        if (!this.fileExists(path)) {
          result.error = this.Errors.NOT_FOUND
          result.errorCause = path
          return result
        }
  
        // Check if the path is a directory
        if (!this.isDir(path)) {
          result.error = this.Errors.NOT_A_DIRECTORY
          result.errorCause = path
          return result
        }
  
        // If the path is valid
        this.currentDirectory = path
        result.success = true
        result.result = path
        return result
  
      }
  
      /**
       * Get the current working directory
       * @returns {string} the current working directory
       * @example
       * FFS.changeDir("/myDirectory")
       * console.log(FFS.getCurrentDir()) // /myDirectory
       */
      this.CWD = () => {
        return this.simplifyPath(this.currentDirectory)
      }
  
      /**
       * Save the filesystem tree as JSON
       * @returns {string} the filesystem tree as JSON string
       * @example
       * FFS.writeFile("/myDirectory", "test.txt")
       * FFS.toJSON()
       * // {
       * //  "name": "",
       * //  "type": "directory",
       * //  "content": [
       * //    {
       * //       "name": "myDirectory",
       * //       "type": "directory",
       * //       "content": [],
       * //       "parent": "/",
       * //       "modified": 1589788983
       * //     },
       * //   ],
       * //   "parent": "/",
       * //   "modified": 1589788983
       * // }
       */
      
      this.toJSON = () => {
        return JSON.stringify(this.tree)
      }
  
      this.Save = () => {
        localStorage["FileSystem_"+Partition] = JSON.stringify(this.tree)
      }
  
      this.SyncToLocalStorage = () => {
        const result = new this.Result()
        this.tree = JSON.parse(localStorage["FileSystem_"+Partition])
        result.success = true
        result.result = this.tree
        return result
      }
  
      /**
       * Load the filesystem tree from JSON
       * @param {string} json the filesystem tree as JSON string
       * @returns {Result} the filesystem tree
       * @example
       *
       * FFS.loadFromJSON(FFS.toJSON())
       */
      this.loadFromJSON = (json) => {
        const result = new this.Result()
        this.tree = JSON.parse(json)
        result.success = true
        result.result = this.tree
        return result
      }
    }
  
  }
  
  if (typeof module !== 'undefined') {
    /**
     * @module FFS
     * @type {FFS}
     * @see {@link https://github.com/SkwalExe/FakeFileSystem.js}
     *
     * @example
     *
     * const FFS = require("ffs")
     *
     * var myFakeFileSystem = new FFS();
     */
    module.exports = FFS
  }
  