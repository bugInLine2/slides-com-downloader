# Store slides from slides.com as pdf

## Description
<p>This script can download presentation slides from slides.com into a pdf file.</p>
<p>It can handle slides on the main level and on one sub level. I know it is possible to create transmissions and slides on more than one sub level, but this script can only handle one.</p>

## How it works
1. All folders will be created if they don't exist. After each start the directories will be cleared.
2. The number of (main) slides and the number of sub slides will be determined.
3. Then every slide will be screenshoted and saved as a png file into the `slides/png/` folder.
3. Each screenshot will be put on a single page into a newly created pdf document, which will be saved into the `slides/` folder.

## How to use
### Install the dependencies
```sh
$ npm i
```

### Run
```sh
$ node index.js <SLIDES.COM LINK> <NAME OF TARGET-PDF FILE>
```

i.e.

```sh
$ node index.js https://slides.com/lucianomammino/your-lambdas-in-rust-codemotion-milan-2023 your-lambdas-in-rust.pdf
```


