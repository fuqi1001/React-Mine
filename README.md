🧐🥳🥺

# Simple Minesweeper

This project is basically set up by the create-react-app, so the run step as below:

Step 1: yarn install

Step 2: yarn start

And the application is listening on port 3000, visit the localhost:3000

Using as many hooks as possible.

More detail documents are in each component and helper function as comments.

### Project Structure
```
├── README.md                    
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── index.css
│   ├── index.js                --- Root Component
│   ├── page
│   │   ├── App.css
│   │   ├── App.js              --- Container Component: contain <Board /> and <Setting />
│   │   ├── App.test.js
│   │   ├── Board
│   │   │   ├── Board.js        --- Main Game Board, Row and Cell is set up here
│   │   │   └── Board.scss
│   │   └── Setting
│   │       ├── Setting.js      --- Setting Component, inslude set size and mode
│   │       └── Setting.scss
│   ├── serviceWorker.js
│   ├── setupTests.js
│   └── utils
│       └── utils.js            --- utils, all helper function
└── yarn.lock
```

