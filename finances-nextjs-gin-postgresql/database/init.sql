-- Tabela users: Armazena as informações dos usuários. Cada usuário tem suas transações e categorias.
BEGIN;

CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  fullname VARCHAR(50) NOT NULL,
  email VARCHAR(75) NOT NULL UNIQUE,
  password_hash VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela type_transations define se ela é para receitas ou despesas. (income ou expense)
CREATE TABLE public.type_transations (
  id UUID PRIMARY KEY,
  type VARCHAR(10) NOT NULL
);

-- Tabela categories: Cada categoria pode ser associada a uma transação e o tipo de transação (income ou expense).
-- Categorias de transações, como alimentação, transporte, etc
CREATE TABLE public.categories (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES public.users(id),
  type_transation_id UUID REFERENCES public.type_transations(id)
);

-- Tabela transactions: Registra todas as receitas e despesas. 
-- Cada transação está associada a um usuário, uma categoria e um tipo de transação.
-- Transações financeiras, tanto receitas quanto despesas
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES public.users(id),
  type_transation_id UUID REFERENCES public.type_transations(id),
  category_id UUID REFERENCES public.categories(id)
);

-- Tabela budgets: Controla o orçamento definido para cada categoria em um mês específico,
-- permitindo que o usuário monitore os gastos.
-- Está associada a um usuário e uma categoria
-- Armazena os orçamentos mensais definidos pelos usuários.
CREATE TABLE budgets (
  id UUID PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  -- Mês e ano do Orçamento
  budget_month DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES public.users(id),
  category_id UUID REFERENCES public.categories(id)
);

END;