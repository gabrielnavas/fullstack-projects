-- Tabela users: Armazena as informações dos usuários. Cada usuário tem suas transações e categorias.
BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  fullname VARCHAR(50) NOT NULL,
  email VARCHAR(75) NOT NULL UNIQUE,
  password_hash VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela type_transactions define se ela é para receitas ou despesas. (income ou expense)
CREATE TABLE public.type_transactions (
  id UUID PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE
);

-- Tabela categories: Cada categoria pode ser associada a uma transação e o tipo de transação (income ou expense).
-- Categorias de transações, como alimentação, transporte, etc
CREATE TABLE public.categories (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  type_transaction_id UUID REFERENCES public.type_transactions(id) NOT NULL
); 

-- Tabela transactions: Registra todas as receitas e despesas. 
-- Cada transação está associada a um usuário, uma categoria e um tipo de transação.
-- Transações financeiras, tanto receitas quanto despesas
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAT(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES public.users(id)  NOT NULL,
  type_transaction_id UUID REFERENCES public.type_transactions(id)  NOT NULL,
  category_id UUID REFERENCES public.categories(id)  NOT NULL
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES public.users(id)  NOT NULL,
  category_id UUID REFERENCES public.categories(id)  NOT NULL
);

-- ###################### INSERTS ##############################

-- type_transactions income or expense
INSERT INTO public.type_transactions(id, name)
VALUES
(uuid_generate_v4(), 'income'), -- renda
(uuid_generate_v4(), 'expense'); -- despesa

-- categories incomes
INSERT INTO public.categories(
  id, name, description, created_at, updated_at, deleted_at, type_transaction_id
) VALUES 
( uuid_generate_v4(), 'Salário', 'O valor que o usuário recebe de seu emprego ou de atividades profissionais regulares.', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income')),
( uuid_generate_v4(), 'Freelance', 'Para usuários que recebem de trabalhos esporádicos ou autônomos.', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income')),
( uuid_generate_v4(), 'Venda de Produtos', 'Dinheiro recebido pela venda de itens pessoais ou produtos comerciais.', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income')),
( uuid_generate_v4(), 'Investimentos', 'Ganhos provenientes de investimentos (juros, dividendos, etc.).', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income')),
( uuid_generate_v4(), 'Aluguel', 'Dinheiro recebido por alugar um imóvel ou outro bem.', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income')),
( uuid_generate_v4(), 'Prêmios', 'Valores ganhos em sorteios, competições ou outras premiações.', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income')),
( uuid_generate_v4(), 'Reembolso', 'Valores recebidos de volta após uma compra ou pagamento feito anteriormente.', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income')),
( uuid_generate_v4(), 'Pensão', 'Entradas regulares relacionadas a pensão.', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income')),
( uuid_generate_v4(), 'Aposentadoria', 'Entradas regulares relacionadas a aposentadoria.', now(), null, null, (SELECT id FROM public.type_transactions WHERE name = 'income'));

-- -- categories expenses
INSERT INTO public.categories(
  id, name, description, created_at, updated_at, deleted_at, type_transaction_id
) VALUES 
( uuid_generate_v4(), 'Alimentação', 'Gastos com supermercados, restaurantes, fast food, etc.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Moradia', 'Pagamentos relacionados a aluguel, hipoteca, condomínio, e manutenções.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Transporte', ' Gastos com combustível, transporte público, manutenção de veículos, pedágio, etc.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Educação', 'Pagamentos de mensalidades escolares, cursos, livros, material didático, etc.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Saúde', 'Consultas médicas, medicamentos, planos de saúde, tratamentos.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Entretenimento', ' Gastos com lazer, como cinema, shows, eventos esportivos, jogos, assinaturas de streaming.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Contas e Serviços', 'Pagamentos de contas mensais, como água, luz, internet, telefone.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Vestuário', 'Compras de roupas e calçados.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Doações', 'Qualquer doação feita a instituições de caridade ou causas sociais.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Seguros', 'Prêmios de seguros (carro, casa, vida).', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense')),
( uuid_generate_v4(), 'Impostos', 'Pagamento de impostos e taxas governamentais.', now(), null,null, (SELECT id FROM public.type_transactions WHERE name = 'expense'));

COMMIT;

END;