const CONFIG = require('./config.json'),
      ARGV   = require('minimist')(process.argv.slice(2)),
      colors = require('colors'),
      Utils  = require('./utils'),
      Net    = require('./net');


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


(async function() {

  let LIVE;

  try {
    LIVE = await Net.getLiveVersion();
  } catch (ex) {
    Utils.exitErr(ex);
  }

  if (CONFIG.VERSION !== LIVE.VERSION) {
    console.log((`>> New version is available (${colors.bold(LIVE.VERSION)})\n`.white).bgGreen);
  }

  if (ARGV._.length === 0){

    ARGV._ = await (() => {
      return new Promise((resolve) => {
        readline.question(`Anime(s) id(s) (read github documentation) : `, (args) => {
          readline.close();
          resolve(args.trim().split(' '));
        });
      })
    })();

  }

  const animes = [];

  ARGV._.forEach(str => {
    try {
      animes.push(Utils.parseAnimeStr(str));
    } catch (ex) {
      Utils.exitErr(ex);
    }
  });

  const destinationFolder = ARGV.destination && typeof(ARGV.destination) === 'string' ? ARGV.destination : CONFIG.DEFAULT_PATH;

  try {
    Utils.mkdirIfNotExistSync(destinationFolder);
  } catch (ex) {
    Utils.exitErr(ex);
  }

  const GStartTime = new Date();

  animeLoop:
  for (var i in animes) {

    const AStartTime = new Date();

    const anime = animes[i];

    console.log(`> [${Number(i)+1}/${animes.length}] Downloading '${colors.bold(anime.id)}'`.green);

    var sources;
    try {
      sources = await Net.getSources(anime.id, LIVE.ACCESS_TOKEN, LIVE.AES_KEY);
    } catch (ex) {
      Utils.logErr(`  - Error while fetching sources for '${colors.bold(anime.id)}' (${ex})`);
      continue animeLoop;
    }

    if (!anime.end)
      anime.end = sources.length;
    else if (anime.end < anime.start)
      anime.end = anime.start;

    console.log(`  + Queued episodes : ${anime.end == anime.start ? `EP${anime.start}` : `EP${anime.start} -> EP${anime.end}`}`);

    episodeLoop:
    for (var ep_i = anime.start-1; ep_i < Math.min(anime.end, sources.length); ep_i++) {
      const ep_url = sources[ep_i];

      try {
        console.log(`  - [${Number(ep_i)-Number(anime.start)+2}/${anime.end-anime.start+1}] Downloading EP${ep_i+1} : '${ep_url.substring(ep_url.lastIndexOf('/') + 1)}'`.gray);

        const folderPath = `${destinationFolder}/${anime.id}`;
        Utils.mkdirIfNotExistSync(folderPath);

        await Net.downloadFile(`http://twist.moe${ep_url}`, folderPath, (state) => {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(`      [${'='.repeat(Math.round(state.percent/100*20))}${' '.repeat(20 - Math.round(state.percent/100*20))}] ${state.current}/${state.total}kb (${state.percent}%) ${state.speed}kb/s ETA : ${state.eta}s`);
        });
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
      } catch (ex) {
        Utils.logErr(`  - Error while downloading '${colors.bold(ep_url)}' (${ex})`);
        continue episodeLoop;
      }
    }
    console.log(`  ${'√'.green} Finished in ${((new Date()) - AStartTime)/1000}s`);
  }
  console.log(`\n${'√'.green} All tasks completed in ${((new Date()) - GStartTime)/1000}s`.bold);
})();
