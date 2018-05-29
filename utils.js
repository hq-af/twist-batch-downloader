const CryptoJS = require('crypto-js'),
      CONFIG   = require('./config'),
      fs       = require('fs'),
      colors   = require('colors');

module.exports = {
  /**
   * Decrypt URL
   * @param {string} encrypted encrypted URL
   */
  decryptURL(encrypted) {
    return CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(encrypted, CONFIG.AES_KEY)
    );
  },

  /**
   * Parse anime string format
   * @param {string} str anime string (ex: anime/3-4)
   * @return { {id: string, start: Number, end: Number} }
   */
  parseAnimeStr(str) {
    const matches = /([^\/]+)(?:\/(\d+)?(-(\d+)?)?)?$/.exec(str);
  
    if (!matches) {
      throw `Cannot parse '${str}'`;
    }
  
    const id = matches[1];
    const start = parseInt(matches[2]) || 1;
    const end = matches[3] ? (parseInt(matches[4]) || null) : matches[2] ? start : null;
    
    return {
      id,
      start,
      end
    };
  },
  /**
   * Creates directory if it doesnt exist
   * @param {string} folderPath folder path
   */
  mkdirIfNotExistSync(folderPath) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  },
  /**
   * Logs an error to the console
   * @param {string} err error message
   */
  logErr(err) {
    console.error(colors.red(err));
  },
  /**
   * Shows an error and exit with code 1
   * @param {string} err error message
   */
  exitErr(err) {
    this.logErr(err);
    process.exit(1);
  }
}
