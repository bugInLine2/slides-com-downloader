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

Each slide will be saved as PNG format into the `slides/png/` folder. 
The PDF file will be saved into the `slides/` folder.
The folders will be created if it doesn't exist.
After each start the directories will be cleared.
