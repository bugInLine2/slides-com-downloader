## Description
This script can download presentation slides from slides.com, even with the slides on one sub level. I know it is possible to create transmissions and slides on more sub levels, but this script can only take care of one sub level exactly.

## Usage
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

Each slide will be saved as a PNG image file into the `slides/png/` folder. 
The PDF file will be saved into the `slides/` folder.
The folders will be created if it doesn't exist.
After each start the directories will be cleared.
