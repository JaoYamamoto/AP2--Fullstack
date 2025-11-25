# AP2--Fullstack
Entrega da AP2 da matéria de fullstack

# O que é:
Uma ferramenta de tracking pessoal de animes assistidos, com uma função de dar nota à obra assistida. como uma síntese da experiência.

## A Quem se Destina:
Qualquer um que deseje ter uma ferramenta simples para manter uma lista de animes vistos, sem a necessidade de estar participando de alguma rede social, ter mais uma conta em mais um site diferente ou de ficar recebendo emails de publicidade do site.

## O que se pretende fazer

### Funcionalidades Frontend:
Buscar Animes: Integração com Jikan API para buscar animes por nome;
Visualizar Detalhes: Exibição de informações completas do anime;
Adicionar ao Diário: Registro de animes com nota pessoal de 1 a 10;
Gerenciar Diário: Visualizar, editar e remover animes;

### Funcionalidades Backend:
API REST em Flask com estrutura MVC;
Banco de dados SQLite;
Documentação Swagger;
Containerização com Docker;

## Stack e Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | 
|-----------|--------|
| React | 19.1.0 | 
| TypeScript | 5.6.3 | 
| Vite | 7.1.7 | 
| Tailwind CSS | 4.1.14 | 
| Wouter | 3.3.5 | 
| Lucide React | 0.453.0 |

### Ferramentas de Desenvolvimento
| Ferramenta | Versão |
|-----------|--------|
| Prettier | 3.6.2 |
| TypeScript Compiler | 5.6.3 |
| ESBuild | 0.25.0 | 
| pnpm | 10.15.1 | 
| Vitest | 2.1.4 | 

### APIs Externas
- **Jikan API (MyAnimeList):** Utilizada para fornecer dados de animes na DB do site MyAnimeList


### Instalação

**1. Clone o repositório:**
``` cmd
git clone https://github.com/JaoYamamoto/AP2--Fullstack
```

**2. Instale as dependências:**
```cmd
pnpm install
 ou
npm install
```

**3. Inicie o servidor de desenvolvimento:**
```cmd
pnpm run dev
 ou
npm run dev
```

**4. Acesse a aplicação:**
```cmd
ctrl + lmb no link disponível no cmd
```
