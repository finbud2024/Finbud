DROP TABLE IF EXISTS bullet_tags, article_tags, summary_bullets, tags, articles;

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  fireant_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(100) NOT NULL,
  image_url TEXT,
  image_urls TEXT[],
  author TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_article_triple UNIQUE (title, fireant_url, original_url)
);

CREATE TABLE summary_bullets (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sentiment VARCHAR(20) NOT NULL
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE bullet_tags (
  bullet_id INTEGER REFERENCES summary_bullets(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (bullet_id, tag_id)
);