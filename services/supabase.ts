import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../constants';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* 
   ====== SQL PARA O SUPABASE (Copie o código abaixo e cole no SQL Editor) ======
   
   -- 1. Criação da Tabela de Produtos
   create table if not exists products (
     id serial primary key,
     title text not null,
     description text,
     price numeric not null,
     image_url text,
     category text
   );

   -- 2. Criação da Tabela de Pedidos
   create table if not exists orders (
     id uuid default gen_random_uuid() primary key,
     customer_name text,
     total_amount numeric,
     payment_method text,
     delivery_type text,
     address text,
     change_for text,
     delivery_fee numeric,
     status text default 'pending',
     items jsonb,
     created_at timestamp with time zone default now()
   );

   -- 3. Habilitar Segurança (RLS)
   alter table orders enable row level security;
   alter table products enable row level security;

   -- 4. Criar Políticas de Acesso (Policies)
   
   -- Permite que qualquer pessoa (mesmo anonima) crie pedidos
   create policy "Enable insert for all users" on orders for insert with check (true);
   
   -- Permite ler pedidos (opcional, para ver status)
   create policy "Enable select for all users" on orders for select using (true);
   
   -- Permite atualizar pedidos (para a loja marcar como pronto)
   create policy "Enable update for all users" on orders for update using (true);

   -- Permite ler produtos (para o cardápio carregar do banco)
   create policy "Enable read access for all users" on products for select using (true);

   
      ====== IMPORTANTE: ATIVAR REALTIME ======
      Para o painel da loja atualizar sozinho, você precisa ativar o Realtime na tabela 'orders':
      1. Vá no Painel do Supabase -> Database -> Replication
      2. Clique em "0 tables" (Source)
      3. Selecione a tabela 'orders' e ative o switch.
   
*/