# Armazenamento local do Smart ClinicAI

Regras para atualizar o app sem perder os dados de quem já usa.

## Onde os dados ficam

| Lugar | Chave | O quê |
|---|---|---|
| IndexedDB `smart-clinicai-db`, store `kv` | `state` | Estado completo (principal) |
| localStorage | `SMART_CLINICAI_DB_V1` | Cópia do estado, para abrir o app na hora |
| IndexedDB, store `snap` | `dia-AAAA-MM-DD`, `antes-*`, `pre-v*` | Cópias automáticas |
| localStorage | `SMART_CLINICAI_AI` | Provedor, chaves e modelos de IA (fora do backup) |

Toda gravação vai para os dois lugares. Ao abrir, o app usa o localStorage e depois confere o IndexedDB: se o IndexedDB tiver um `savedAt` mais novo (por exemplo, localStorage cheio ou apagado), ele vence.

**Nunca renomeie** `SMART_CLINICAI_DB_V1`, `smart-clinicai-db` ou os stores `kv` e `snap`.

## Formato

```
{ schema: 2, savedAt: <ms>, perfil: 0, pts: [ paciente, ... ] }
```

Os campos de cada paciente e seus padrões estão em `PD()` no `index.html`.

## Como mudar o formato

1. **Campo novo:** acrescente em `PD()` com um valor padrão. `norm()` completa os dados antigos sozinho. Não precisa de migração.
2. **Renomear, mover, mudar tipo ou apagar campo:**
   - aumente `SCHEMA` (ex.: 2 → 3);
   - acrescente `MIG[2] = d => { ...; return d }`, que leva os dados da versão 2 para a 3;
   - **nunca altere um passo de migração já publicado**; só acrescente o próximo.
3. Antes de migrar, o app guarda uma cópia `pre-vN-…` com os dados originais.
4. Dados de uma versão **mais nova** que o app (alguém abriu um app antigo em cache) não são rebaixados: campos desconhecidos são mantidos e o app avisa para atualizar.
5. Mudança na estrutura do IndexedDB: aumente a versão em `indexedDB.open(DBN, N)` e crie os stores novos em `onupgradeneeded` sem apagar os antigos.
6. Troque `VERSION` em `sw.js` para os aparelhos baixarem a nova versão.

## Cópias automáticas

- Uma por dia de uso (as últimas 14) e outras antes de importar, excluir, restaurar ou migrar (as últimas 15).
- Restauração em **🛟 Cópias** na tela inicial. Restaurar também guarda uma cópia do estado atual antes.
- As cópias ficam só no navegador. Para trocar de aparelho, use **Exportar Backup**.

## Backup em arquivo

O arquivo exportado é o estado com `app` e `exportedAt` a mais. A importação aceita qualquer versão anterior (inclusive o formato sem `schema`) e passa pelas mesmas migrações.

## Testes

```
cd tests && npm install && npm test
```

Cobrem migração de dados antigos, recuperação pelo IndexedDB, localStorage cheio, dados de versão futura, importação, restauração e retenção das cópias.
