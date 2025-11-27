# Buba 🎓

Plataforma educativa interativa com foco em **inclusão e acessibilidade** para
crianças, especialmente aquelas com necessidades especiais de aprendizagem.

---

## 🎯 Sobre o projeto

**Buba** é uma aplicação web voltada a apoiar o processo de aprendizagem e 
comunicação de crianças em fase de alfabetização, com atenção
especial à educação inclusiva.

A plataforma combina:

- **Comunicação Alternativa e Aumentativa (CAA)** com pictogramas ARASAAC  
- **Atividades educativas gamificadas**  
- **Dashboard para tutores/educadores**, com gestão de aprendizes e tarefas  

**Público-alvo:**

- Crianças em fase de alfabetização  
- Crianças com necessidades especiais de aprendizagem  
- Educadores, terapeutas e tutores  
- Famílias que buscam apoio pedagógico em casa  

---

## ✨ Funcionalidades principais

### Para aprendizes

- **Dicionário interativo**
  - Categorias: letras, números, animais, objetos, cores, formas  
  - Pictogramas ARASAAC e síntese de voz (Web Speech API)

- **Atividades educativas**
  - Quiz sobre conceitos básicos  
  - Jogo de equações (adição e subtração)  
  - Jogo da memória com níveis de dificuldade

- **Comunicação**
  - Sistema CAA baseado em pictogramas  
  - Categorias organizadas para comunicação rápida  
  - Feedback auditivo via síntese de voz  

- **Tarefas e progresso**
  - Visualização de tarefas atribuídas  
  - Marcação de conclusão  
  - Acompanhamento visual do progresso  

- **Gamificação**
  - Estrelas por atividades concluídas  
  - Recordes pessoais (ex: jogo da memória)  
  - Indicadores visuais de conquistas  

### Para tutores

- **Dashboard administrativo**
  - Visão geral de aprendizes e atividades  
  - Navegação rápida pelos módulos da plataforma  

- **Gestão de aprendizes**
  - Cadastro com nome, idade, gênero, nível de suporte, parentesco  
  - Senha de acesso própria para cada criança  
  - Visualização de estrelas e progresso  

- **Controle de tarefas**
  - Criação e atribuição de tarefas a aprendizes específicos  
  - Rotinas (por dia da semana) e eventos pontuais  
  - Acompanhamento de conclusão  

- **Configurações de acessibilidade**
  - Tema claro/escuro  
  - Paletas de cores (delicadas/vivas)  
  - Controle de animações  
  - Ajustes de áudio/voz  

---

## 🧩 Tecnologias utilizadas

### Frontend

- React 18 + TypeScript  
- Vite  
- Tailwind CSS  
- [shadcn/ui](https://ui.shadcn.com)  
- React Router DOM  
- TanStack Query  
- React Hook Form + Zod  
- Recharts  
- Lucide React (ícones)  
- Web Speech API  
- Framer Motion (via shadcn/ui)

### Backend / Infra

- [Supabase](https://supabase.com)  
  - PostgreSQL  
  - Auth  
  - Storage  
  - Real-time  
  - Row-Level Security (RLS)

### Acessibilidade

- Pictogramas [ARASAAC](https://arasaac.org)  
- Interface responsiva e adaptativa  
- Temas com alto contraste  
- Opção para reduzir animações  

---

## 🔐 Arquitetura de segurança (resumo)

- **Autenticação dual:**
  - Tutores: Supabase Auth (email + senha)  
  - Aprendizes: login simplificado (usuário + senha numérica) com limite de tentativas  

- **RLS (Row-Level Security):**
  - Tutores só enxergam seus próprios aprendizes e tarefas  
  - Aprendizes acessam apenas seus próprios dados e progresso  

- **Proteção de rotas:**
  - `ProtectedRoute` para tutores  
  - `ApprenticeProtectedRoute` para aprendizes  

---

## 🗄️ Banco de dados (visão geral)

Principais entidades:

- **profiles** – perfis de usuários/tutores autenticados, vinculados a `auth.users.id` (email, nome completo, avatar, datas de criação/atualização).  
- **apprentices** – aprendizes vinculados a um tutor (`tutor_id → profiles.id`), com dados pessoais (nome, idade, gênero, nível de suporte, relação), credenciais simplificadas (`username`, `pin`), quantidade de estrelas e registro de desempenho (`memory_record`).  
- **routine_tasks** – tarefas de rotina associadas a um aprendiz (`apprentice_id`), com título, horário (`time`), indicação de feriado (`is_holiday`), status de conclusão (`completed`) e trilha de auditoria (`created_at`, `updated_at`).  
- **agenda_events** – eventos da agenda do aprendiz (`apprentice_id`), com título, descrição, data, horário (`time`), tipo de evento (`type`) e trilha de auditoria (`created_at`, `updated_at`).  

Toda a modelagem foi pensada para:

- Manter o isolamento entre tutores por meio do vínculo `apprentices.tutor_id → profiles.id` e das políticas de RLS.  
- Registrar rotinas e eventos de forma histórica, permitindo o acompanhamento do dia a dia do aprendiz.  
- Dar suporte à gamificação (estrelas e desempenho em jogos) diretamente na tabela de aprendizes.
---

## 💻 Requisitos

- Node.js **18.x ou superior**  
- `npm` ou `bun`  
- Conta no **Supabase** configurada  
- Navegador moderno com suporte a ES6+ e Web Speech API  
- Conexão com internet (para uso da API ARASAAC)

---

## 🚀 Instalação e configuração

1. **Clone o repositório**

  ```bash
   git clone https://github.com/VitorHFCorrea/buba-app.git
   cd buba-app
  ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   bun install
   ```

3. **Configure as variáveis de ambiente**

   Use o arquivo de exemplo como base:

   Copie o arquivo `.env.example` para `.env.local`:

   ```bash
   cp .env.example .env.local
   ```
   Depois, edite o arquivo .env.local e preencha com os valores reais:

   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_publica_supabase
   ```

4. **Configure o banco no Supabase**

   * Crie as tabelas necessárias (tutors, apprentices, tasks, etc.)
   * Ative RLS e configure as policies
   * Crie as stored procedures usadas na autenticação de aprendizes

5. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   # ou
   bun dev
   ```

   A aplicação ficará disponível em:
   [http://localhost:8080](http://localhost:8080)

---

## 🗂️ Estrutura do projeto (resumida)

```text
buba-app/
├── src/
│   ├── components/          # Componentes reutilizáveis (UI, dashboard, etc.)
│   ├── contexts/            # Contextos React (ex: SettingsContext)
│   ├── hooks/               # Hooks customizados (ex: useApprenticeStars)
│   ├── integrations/
│   │   └── supabase/        # Cliente Supabase
│   ├── pages/               # Páginas da aplicação (login, dashboard, jogos...)
│   ├── types/               # Tipos TypeScript
│   ├── lib/                 # Funções utilitárias
│   ├── App.tsx              # Componente raiz
│   └── main.tsx             # Entry point
├── public/                  # Arquivos estáticos
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌐 Deploy

### Vercel (recomendado)

* **Build command:** `npm run build`
* **Output directory:** `dist`
* Configure as variáveis de ambiente no painel da Vercel:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Outras opções possíveis: Netlify, GitHub Pages ou hospedagem tradicional
(servindo o conteúdo da pasta `dist` e redirecionando todas as rotas para
`index.html`).

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Faça um **fork** do repositório

2. Crie uma branch para sua feature:

   ```bash
   git checkout -b feature/minha-feature
   ```

3. Implemente e teste suas alterações

4. Faça commit:

   ```bash
   git commit -m "feat: adiciona minha nova funcionalidade"
   ```

5. Envie a branch:

   ```bash
   git push origin feature/minha-feature
   ```

6. Abra um **Pull Request** descrevendo claramente as mudanças

Diretrizes gerais:

* Priorize acessibilidade e usabilidade
* Mantenha consistência com o estilo de código existente
* Documente funcionalidades novas

---

## 🧭 Roadmap (resumo)

**Curto prazo**

* Novas categorias no dicionário
* Mais níveis e ajustes nos jogos
* Relatórios simples de progresso para tutores

**Médio e longo prazo**

* Modo offline (PWA)
* Relatórios avançados e gráficos de evolução
* Suporte a múltiplos idiomas
* App mobile (React Native)
* Recursos impulsionados por IA para personalização de conteúdo

---

## 📄 Licença

Este projeto é licenciado sob os termos da licença **MIT**.

Para mais detalhes, consulte o arquivo `LICENSE.md` na raiz do repositório.

### Créditos dos pictogramas (ARASAAC)

Os símbolos pictográficos utilizados neste projeto são propriedade do Governo de Aragão (Espanha) e foram criados por Sergio Palao para o ARASAAC (http://www.arasaac.org), que os distribui sob a licença Creative Commons Atribuição–NãoComercial–CompartilhaIgual (CC BY-NC-SA).

Autor dos pictogramas: Sergio Palao  
Origem: ARASAAC (http://www.arasaac.org)  
Proprietário: Governo de Aragão (Espanha)  
Licença: Creative Commons BY-NC-SA

---

## 👤 Autores e contato

**Autor:** Vitor Hugo Farias Correa

* GitHub: [https://github.com/VitorHFCorrea/](https://github.com/VitorHFCorrea/buba-app)
* Issues: [https://github.com/VitorHFCorrea/buba-app/issues](https://github.com/VitorHFCorrea/buba-app/issues)
* LinkedIn: [https://www.linkedin.com/in/vitorhfc](https://www.linkedin.com/in/vitorhfc)
* Email: [vitorhugo.fariasc04@gmail.com](mailto:vitorhugo.fariasc04@gmail.com)

**Autor:** Victor Sardinha Moura Felix

* LinkedIn: [https://www.linkedin.com/in/victor-sardinha-moura-felix](https://www.linkedin.com/in/victor-sardinha-moura-felix)
* Email: [victorsmfelix@hotmail.com](mailto:victorsmfelix@hotmail.com)

---

Obrigado por usar o **Buba**! ✨
Projeto desenvolvido com foco em **inclusão, acessibilidade e educação de
qualidade para todas as crianças**.