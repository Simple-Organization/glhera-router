# glhera-router

**glhera-router** faz parte da **stack do glhera**, sendo um router simples

## Usando o router

```ts
const router = glheraRouter({
  url: location.href,
  base: '/glhera',
  testing: false, // Não usa o history.pushState se for true, default: false
  parser: (query) => query,
});

router.push('/users?id=1');
router.pathname.value; // /users
router.query.value; // { id: '1' }

router.replace('/users', { id: 1 });
router.pathname.value; // /users
router.query.value; // { id: 1 }
```

### Tipagem para query params com `parser`

A tipagem do `query params` será o retorno do `parser`

O `parser` será sempre chamado para validar todos os `query params`

A abordagem que o **glhera-router** usa é de validar todos os `query params` de todas as páginas junto em um mesmo schema para simplificar o processo

```ts
// Exemplo usando zod
const schema = z.object({
  client_id: z.number().min(1).nullish().catch(null),
});

const router = glheraRouter({
  url: location.href,
  parser: (query) => schema.parse(query),
});
```

Nesse exemplo, a tipagem do query será

```ts
type Q = {
  client_id?: number | null;
};
```

É recomendável usar algum tipo de `.catch()` em todas as propriedades, para evitar bugs

É importante notar que os métodos `push` e `replace` não chamam o parser, mas o método `setURL` chama, isso é para salvar performance em operações comuns, o `setURL` é necessário para `onpopstate` e por isso ele precisa chamar o `parser`

### `push` e `replace`

O método `push` e `replace` são praticamente indenticos, o que muda é o `history.pushState` ou `history.replaceState` que será chamado

Se chamar com uma URL como `router.push('/users?id=1')`, ele converterá os `query params` de maneira apropriada

Exemplo com `push`

```ts
const router = glheraRouter();

router.push('/custumers?custumer_id=1');
router.pathname.value; // /custumers
router.query.value; // { id: '1' }

router.push('/custumers', { id: '1' });
router.pathname.value; // /users
router.query.value; // { id: '1' }

// Ficará errada
router.push('/custumers?custumer_id=1'), { id: '2' };
router.pathname.value; // /custumers?custumer_id=1
router.query.value; // { id: '2' }
```

### `setURL`

O método `setURL` é o método usado pelo `onpopstate`, ele não muda o `history api` em momento algum

Exemplo

```ts
const router = glheraRouter();

router.setURL('/custumers?custumer_id=1');
router.pathname.value; // /custumers
router.query.value; // { id: '1' }
```

### Configurando window.onpopstate

O **glhera-router** define o método `router.subWinPopState()` para subscrever no `window.onpopstate`

Se `testing = true` o `router.subWinPopState()` será ignorado

Dependendo do framework que você estiver usando, você deve colocar o window popstate no `onMount` ou `useEffect`

#### Exemplo no React com context api

```tsx
const routerContext = React.createContext<GLHeraRouter>();

export function SomeComponent() {
  const router = useContext(routerContext);

  useEffect(router.subWinPopState, []);

  return <div>...</div>;
}
```

## Filosofia por trás de não dar suporte aos params da URL

A maioria dos routers normalmente dão suporte a **params** no `pathname` como por exemplo `/ghera/client/:id`

Porém o suporte para **params** introduz diversos tipos de complexidade da construção do app, e também costuma ter um suporte péssimo ao **TypeScript** precisando fazer coisas como `pushRoute('/ghera/client/:id', { id: 1 })`

No nosso exemplo ele usa um objeto para definir os params, mas não estamos definindo `query params`

E esse tipo de arquitetura acaba não abusando de `query params` como parte principal do `state` da aplicação

Mostrando o exemplo anterior com `query params`

`pushRoute('/ghera/client/:id', { id: 1 }, { tab: 'compras' })`

Com **params** você acaba tendo que validar e criar tipagem para os **params** e também validar e criar a tipagem para os `query params`

Sem contar que para dar suporte para **params** tem que seguimentar a rota e fazer um `pattern matching` adicional

## Configurando reatividade (signals)

Essa lib usa [signal-factory](https://github.com/Simple-Organization/signal-factory) para configurar a reatividade entre `React`, `Preact`. `Svelte`, `Vue`, `Solid`, entre outros recomendo que leia a [documentação do signal-factory](https://github.com/Simple-Organization/signal-factory)

### Acessando a reatividade

```ts
// Só chamar .value
router.pathname.value;
router.query.value;
```
