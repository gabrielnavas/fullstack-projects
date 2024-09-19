-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;

CREATE TABLE IF NOT EXISTS public.posts
(
    id uuid NOT NULL,
    description character varying(120) NOT NULL,
    likes_count bigint NOT NULL,
    views_count bigint NOT NULL,
    created_at timestamp(3) with time zone NOT NULL,
    updated_at timestamp(3) with time zone,
    deleted_at timestamp(3) with time zone,
    owner_id uuid NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."users"
(
    id uuid NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(500) NOT NULL,
    created_at timestamp(3) with time zone NOT NULL,
    updated_at timestamp(3) with time zone,
    deleted_at timestamp(3) with time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.likes
(
    id uuid NOT NULL,
    post_id uuid NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp(3) with time zone NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.views
(
    id uuid NOT NULL,
    post_id uuid NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp(3) with time zone NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.posts
    ADD FOREIGN KEY (owner_id)
    REFERENCES public."users" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.likes
    ADD FOREIGN KEY (post_id)
    REFERENCES public.posts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.likes
    ADD FOREIGN KEY (owner_id)
    REFERENCES public."users" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.views
    ADD FOREIGN KEY (post_id)
    REFERENCES public.posts (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.views
    ADD FOREIGN KEY (owner_id)
    REFERENCES public."users" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;