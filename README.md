
# 🍇 Açaí da Tati - Web App de Delivery

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Aplicação web moderna para delivery de Açaí, permitindo aos clientes montarem seus copos com adicionais, realizarem pagamentos online (Pix/Cartão) e enviarem o pedido diretamente para o WhatsApp da loja.

Inclui um **Painel Administrativo em Tempo Real** para a cozinha acompanhar os pedidos instantaneamente.

🔗 **Demo Online:** [Acesse aqui](https://mhquintilhios.github.io/a-aidaTati/) _(Substitua pelo seu link final)_

---

## ✨ Funcionalidades

### 📱 Para o Cliente
*   **Cardápio Visual:** Produtos com fotos atrativas e preços claros.
*   **Personalização:** Seleção de adicionais (Granola, Leite em Pó, Nutella, etc.) e opção de colherzinha.
*   **Carrinho Dinâmico:** Cálculo automático de subtotal e taxa de entrega.
*   **Checkout Flexível:**
    *   **Pagamento Online:** Integração via Link do Mercado Pago (Pix e Cartão).
    *   **Dinheiro:** Opção de solicitar troco.
*   **Integração WhatsApp:** Gera uma mensagem formatada com todos os detalhes do pedido e envia para a loja.

### 👨‍🍳 Para a Loja (Admin)
*   **Painel KDS (Kitchen Display System):** Tela exclusiva para cozinha.
*   **Atualização em Tempo Real:** Novos pedidos aparecem na tela sem precisar recarregar (powered by Supabase Realtime).
*   **Alerta Sonoro:** Toca um som quando um novo pedido chega.
*   **Gestão de Status:** Marcar pedidos como "Pronto/Entregue" ou "Cancelado".

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** React 18 (TypeScript) + Vite
*   **Estilização:** Tailwind CSS (Via CDN para prototipagem rápida + Animações customizadas)
*   **Backend / Banco de Dados:** Supabase (PostgreSQL)
*   **Pagamentos:** Mercado Pago (Link de Pagamento)
*   **Hospedagem:** GitHub Pages (via GitHub Actions)

---

## 🚀 Como Rodar Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_USUARIO/a-aidaTati.git
    cd a-aidaTati
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Rodar o projeto:**
    ```bash
    npm run dev
    ```
    O app estará disponível em `http://localhost:5173`.

---

## 🗄️ Configuração do Banco de Dados (Supabase)

Para que o cardápio e os pedidos funcionem, você precisa configurar o Supabase:

1.  Crie um projeto em [supabase.com](https://supabase.com).
2.  Vá em **SQL Editor** e rode o script abaixo para criar as tabelas:

```sql
-- 1. Tabela de Produtos
create table if not exists products (
  id serial primary key,
  title text not null,
  description text,
  price numeric not null,
  image_url text,
  category text
);

-- 2. Tabela de Pedidos
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

-- 3. Políticas de Segurança (RLS) Simplificadas
alter table orders enable row level security;
alter table products enable row level security;

create policy "Enable insert for all users" on orders for insert with check (true);
create policy "Enable select for all users" on orders for select using (true);
create policy "Enable update for all users" on orders for update using (true);
create policy "Enable read access for all users" on products for select using (true);
```

3.  **Ativar Realtime (Importante para o Painel da Loja):**
    *   No menu do Supabase, vá em **Database** -> **Replication**.
    *   Clique em **0 tables** (Source).
    *   Selecione a tabela `orders` e ative o switch de **Realtime**.

4.  **Conectar ao Projeto:**
    *   Copie a `URL` e a `ANON KEY` do seu projeto Supabase.
    *   Cole no arquivo `src/constants.ts`.

---

## ⚙️ Personalização

Todas as configurações principais estão no arquivo `src/constants.ts`:

*   **`SUPABASE_URL` / `SUPABASE_KEY`**: Credenciais do banco.
*   **`MERCADO_PAGO_LINK`**: Seu link de pagamento (Bio ou Checkout).
*   **`STORE_WHATSAPP`**: Número para onde os pedidos serão enviados.
*   **`DELIVERY_FEE`**: Valor da taxa de entrega.
*   **`MOCK_PRODUCTS`**: Produtos padrão caso o banco esteja vazio.

---

## 📦 Deploy (Como colocar no ar)

Este projeto está configurado para deploy automático no **GitHub Pages**.

1.  Suba o código para o GitHub.
2.  Vá em **Settings > Pages**.
3.  Em **Source**, selecione **GitHub Actions**.
4.  O deploy começará automaticamente.
Deploy Correto Finalizado
---

Feito com 💜 por [Quintilhios_Tecnologia]
