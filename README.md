# Store slides from slides.com as Pdf

## Description
This script can download presentation slides from slides.com into Pdf files, even with the slides on one sub level. I know it is possible to create transmissions and slides on more sub levels, but this script can only take care of one sub level exactly.<br />
Each slide will be saved as a PNG image file first into the `slides/png/` folder. Every slide will be put on a page in a new Pdf file, which will be saved into the `slides/` folder.<br />
The folders will be created if it doesn't exist.
After each start the directories will be cleared.


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


