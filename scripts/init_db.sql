CREATE DATABASE myanimelist;

\c myanimelist

CREATE TABLE genre
(
  id   integer PRIMARY KEY NOT NULL,
  name text    NOT NULL
);

CREATE TABLE period
(
  id     SERIAL    PRIMARY KEY NOT NULL,
  year   integer NOT NULL,
  season text    NOT NULL
);

CREATE TABLE anime
(
  id                integer   PRIMARY KEY NOT NULL,
  title             text      NOT NULL,
  mean              integer   NOT NULL,
  rank              integer   NOT NULL,
  popularity        integer   NOT NULL,
  num_scoring_users integer   NOT NULL,
  media_type        text      NOT NULL,
  status            text      NOT NULL,
  genre             integer[] NOT NULL
);