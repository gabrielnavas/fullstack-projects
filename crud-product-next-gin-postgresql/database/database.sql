-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 1.1.4
-- PostgreSQL version: 16.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- -- object: postgres | type: DATABASE --
-- -- DROP DATABASE IF EXISTS postgres;
-- CREATE DATABASE postgres
-- 	ENCODING = 'UTF8'
-- 	LC_COLLATE = 'en_US.utf8'
-- 	LC_CTYPE = 'en_US.utf8'
-- 	TABLESPACE = pg_default
-- 	OWNER = postgres;
-- -- ddl-end --
-- COMMENT ON DATABASE postgres IS E'default administrative connection database';
-- -- ddl-end --
-- 

-- object: public.products | type: TABLE --
-- DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE public.products (
	id uuid NOT NULL,
	name varchar(50),
	description varchar(100) NOT NULL,
	price decimal(9,2) NOT NULL,
	quantity integer NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz,
	CONSTRAINT products_pk PRIMARY KEY (id),
	CONSTRAINT product_name_unique UNIQUE (name)
);
-- ddl-end --
ALTER TABLE public.products OWNER TO postgres;
-- ddl-end --


