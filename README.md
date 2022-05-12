![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)

# Word Trainer

Vocabulary pronunciation trainer, where you can see different words or collections of words so you can try to pronounce them and after that check if the pronunciation is correct.

## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## MVP

- Three models: User, Word and Wordset (collection of words).

- Basic CRUD for Word and Wordset.

- Fetch the words from external API and save them on MongoDB.

## Backlog

- User level that increases finishing collections.

- Public and private collections

- Sounds

## Proyect layout

`models/ -> All models`

`routes/ -> All routes`

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
