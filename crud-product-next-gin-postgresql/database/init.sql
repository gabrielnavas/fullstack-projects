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
ALTER TABLE public.products OWNER TO postgres;
