
# Twist.moe CLI Batch Downloader

  

Grab the latest build [here](https://github.com/hq-af/twist-batch-downloader/releases) (windows only)

  

    twist-batch-downloader.exe animeID

  

*OR* (requires [NPM](https://www.npmjs.com/)/Yarn and [Node 8.x](https://nodejs.org/))

  

    git clone https://github.com/hq-af/twist-batch-downloader.git
    cd twist-batch-downloader
    npm i
    node index.js animeID

 

*animeID : https://twist.moe/a/[animeID]/8*

  

## Command line options

  

### Multiple animes

  

    twist-batch-downloader.exe animeID1 animeID2...

  

*Example :*


    twist-batch-downloader.exe noragami kotoura-san

  

### Specific episode / range

  

    twist-batch-downloader.exe noragami

*will download all episodes*

    twist-batch-downloader.exe noragami/2

*will only download episode 2*

    twist-batch-downloader.exe noragami/4-10

*episode 4 -> 10*

    twist-batch-downloader.exe noragami/4-

*episode 4 -> last episode*

  

### Destination folder

  

    twist-batch-downloader.exe animeID1 animeID2 --destination myFolder

*files will be put inside 'myFolder' folder (created if not found) default is './downloads', note that each anime will have a subfolder*

  
  
 
**Licensed under MIT license**

