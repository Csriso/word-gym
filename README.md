![Logo](https://github.com/Csriso/word-gym/blob/main/public/images/banner.png?raw=true)

# Word GYM

Vocabulary pronunciation trainer, where you can see different words or collections of words so you can try to pronounce them and after that check if the pronunciation is correct.

## Screenshots

![App Screenshot](https://github.com/Csriso/word-gym/blob/main/public/images/brave_Vtu0dqn646.png?raw=true)
![App Screenshot](https://github.com/Csriso/word-gym/blob/main/public/images/brave_pHXP82mst0.png?raw=true)
![App Screenshot](https://github.com/Csriso/word-gym/blob/main/public/images/brave_nfXwpd5ba3.png?raw=true)

## MVP

- Three models: User, Word and Wordset (collection of words).

- Basic CRUD for Word and Wordset.

- Fetch the words from external API.

- Light and dark theme.

- Recorder to listen to your pronunciation in order to compare your voice with another audio.

## Backlog

- User counter of finished collections.

- Public and private collections

- Sounds

## Proyect layout

`config/ -> General express js config`

`db/ -> Database config`

`error-handling/ -> Multiple error handling apart of 404 and 500`

`middleware/ -> Middlewares for user logged, not logged, etc`

`models/ -> All app database models`

`public/ -> Static images, javascript and stylesheets`

`routes/ -> Expressjs routes`

`seeds/ -> Data to seed the DB`

`utils/ -> Multiple helper scripts`

`views/ -> All the app views`

## Routes reference

#### User Routes

```http
  GET /   INDEX PAGE
```

```http

  GET /login    POST /login
```

```http
  GET /register    POST /register
```

#### Word Routes

#### List all words

```http
  GET /word/
```

#### Word create

```http
  GET /word/create  POST /word/create
```

#### Word Details

```http
  GET /word/:id
```

#### Word edit

```http
  POST /word/:id/edit
```

#### Word delete

```http
  POST /word/:id/delete
```

#### Word Collection Routes

#### List all collections

```http
  GET /collection/
```

#### Collection create

```http
  GET /collection/create     POST /collection/create
```

#### Collection Details

```http
  GET /collection/:id
```

#### Collection edit

```http
  POST /collection/:id/edit
```

#### Collection delete

```http
  POST /collection/:id/delete
```

## Authors

- [@jferran](https://github.com/jferran)
- [@csriso](https://github.com/Csriso/)
