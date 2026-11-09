# Sistema visual do Smart ClinicAI

Objetivo: aparência sóbria e previsível, em que a cor só aparece para indicar **estado clínico** ou **ação principal**. Tudo é definido por variáveis CSS no início do `<style>` do `index.html`, com versão clara e escura.

## Princípios

1. **Neutro por padrão.** Cartões, gavetas, chips e caixas de texto usam só tons de cinza frio.
2. **Uma cor de destaque.** O azul-petróleo (`--ac`) marca ação principal, seleção e leito avaliado. Não existe outra cor “de marca”.
3. **Cor semântica só para estado.** Vermelho = perigo, âmbar = atenção, verde = normal. Nunca para decorar.
4. **Sem emojis na interface.** Os únicos símbolos são ✓ (feito), ✕ (remover), ✎ (editar), ⚠ (alerta) e setas.
5. **Toda cor vem de uma variável.** Nada de hexadecimal solto nos templates (exceção abaixo).

## Paleta

| Variável | Claro | Escuro | Uso |
|---|---|---|---|
| `--bg` | `#F3F5F8` | `#0E141B` | Fundo da página |
| `--c` | `#FFFFFF` | `#151D27` | Cartões, cabeçalhos, campos |
| `--sf` | `#F7F9FB` | `#111821` | Superfícies secundárias: gavetas, caixas internas, leito não avaliado |
| `--tx` | `#17202B` | `#E6EBF1` | Texto principal |
| `--tx2` | `#3D4A5C` | `#C3CCD7` | Títulos de seção, rótulos |
| `--mu` | `#5F6B7A` | `#93A0AF` | Texto auxiliar |
| `--ln` | `#DDE2E8` | `#263241` | Bordas de cartões |
| `--ln2` | `#C3CCD6` | `#344355` | Bordas de campos, botões secundários e chips |
| `--ac` | `#1F5A7A` | `#78AFCC` | Destaque: botão principal, chip marcado, seleção, leito avaliado |
| `--acH` | `#174760` | `#93C2DA` | Destaque ao passar o mouse |
| `--acS` | `#E7EFF4` | `#172A3A` | Fundo suave do destaque: paciente selecionado, resultados de cálculo, escores fixados |
| `--acT` | `#FFFFFF` | `#0B1218` | Texto sobre `--ac` |
| `--dn` / `--dnS` | `#B42318` / `#FCEDEB` | `#F08A80` / `#3A1715` | **Perigo**: alergia, achado alterado no exame, nefrotóxico, excluir |
| `--wn` / `--wnS` | `#8A5300` / `#FDF3E1` | `#E3B467` / `#33260F` | **Atenção**: pendências, ajuste renal, ECOG 2–3 |
| `--ok` / `--okS` | `#2B6A4C` / `#E8F2EC` | `#7CC3A0` / `#13281E` | **Normal**: nega alergias, ECOG 0–1 |

Os pares texto/fundo foram escolhidos para contraste de leitura (WCAG AA) nos dois temas.

## Texto

Todos os tamanhos são relativos (`rem`) e saem de uma escala única. Não use `px` para tamanho de fonte.

| Variável | Tamanho no padrão | Uso |
|---|---|---|
| `--fs-xs` | 12px | Etiquetas pequenas, títulos de seção em maiúsculas |
| `--fs-sm` | 14px | Botões, chips, rótulos de campo, texto auxiliar |
| `--fs-md` | 16px | Texto corrido, campos de digitação |
| `--fs-lg` | 18px | Títulos de bloco (`h2`) |
| `--fs-xl` | 22px | Título do app (`h1`) |

Campos de digitação nunca ficam abaixo de 16px, para o celular não dar zoom ao tocar.

**Redação:** só a primeira letra maiúscula (“Exportar backup”, não “Exportar Backup”), exceto siglas. Rótulos curtos, com o verbo da ação. Títulos de seção numerados na ordem da visita.

### Tamanho do texto ajustável

O botão **Aa** (tela inicial e cabeçalho do paciente) muda o tamanho de tudo: Pequeno 90%, Padrão 100%, Grande 115%, Muito grande 130%, Máximo 145%. Funciona porque toda a interface usa `rem`: o app só muda o tamanho da fonte do `<html>`. A escolha fica salva no aparelho (`SMART_CLINICAI_UI` no localStorage) e não entra no backup. Ao criar algo novo, confira no tamanho Máximo em 390px: nada pode sair da tela; o conteúdo deve quebrar linha.

## Controles

| Variável | Tamanho no padrão | Uso |
|---|---|---|
| `--bh` | 44px (2,75rem) | Altura de **todos** os botões e campos de uma linha |
| `--chh` | 36px (2,25rem) | Altura dos chips |

Existe um só tamanho de botão. O que muda é o papel (principal, secundário, exclusão), não o tamanho. A classe `.mc` foi mantida só por compatibilidade e não altera nada.

## Avisos

Os avisos curtos (“Salvo!”, “Copiado!”) aparecem logo abaixo do cabeçalho fixo, somem em cerca de 3 segundos e não bloqueiam toques (`pointer-events: none`). No desktop ficam no canto superior direito. Mostram no máximo dois de cada vez.

Confirmações de ações destrutivas não usam aviso: acontecem no próprio botão. Exemplo: “Excluir paciente” vira “Toque de novo para excluir” (vermelho) por 4 segundos.

## Forma

| Variável | Valor | Uso |
|---|---|---|
| `--r` | 10px | Botões, campos, gavetas, caixas |
| `--rc` | 14px | Cartões |
| chips e etiquetas | 8px / 6px | Chips do exame, rótulo do leito / etiquetas pequenas |
| `--sh` | sombra de 1–2px (sem sombra no escuro) | Cartões |

Fonte: a do sistema (`system-ui`, Roboto no Android). Números de sinais vitais usam algarismos de largura fixa.

## Componentes

| Componente | Classe | Aparência |
|---|---|---|
| Botão principal | `.b` (ou `.b.t`) | Fundo `--ac`, texto `--acT` |
| Botão secundário | `.b.g` | Fundo `--c`, borda `--ln2`, texto `--tx2` |
| Botão de exclusão | `.danger .b` | Contorno neutro, texto `--dn`, afastado de “Salvar” |
| Chip | `.ch` / `.ch.on` / `.ch.bad` | Neutro / marcado (`--ac`) / achado alterado marcado (`--dn`) |
| Gaveta | `.dash` | Superfície `--sf` com borda `--ln` |
| Gaveta de alergia | `.dash.tRd` / `.dash.tOk` | Perigo se houver alergia; neutra com texto verde se negar |
| Pendências na lista | `.pd` | Atenção (âmbar) |
| Alergia na lista | `.al` | Perigo, sólido |
| Leito | `.lb` | Avaliado hoje: sólido `--ac` com ✓. Não avaliado: contorno neutro |
| Resultado de cálculo | `.res.tIx` | Fundo `--acS` |
| Etiquetas de medicamento | `.tg` | “Checar ajuste renal” = atenção; “Nefrotóxico” = perigo |

As classes `tBl`, `tVi`, `tSb`, `tGn` são nomes antigos mantidos por compatibilidade e hoje resultam todas em superfície neutra.

## Exceção

O **mapa de territórios do AVC** (`AV` no código) usa uma cor por território arterial (ACM, ACA, ACP, vertebrobasilar). Ali a cor identifica a anatomia e não é decoração.

## Como acrescentar algo novo

- Precisa de cor? Use uma variável da tabela. Se nenhuma servir, crie uma nova em `:root` **e** nos dois blocos escuros, e acrescente aqui.
- Estado novo: escolha entre perigo, atenção e normal. Não crie uma quarta cor semântica.
- Confira nos temas claro e escuro, no celular (390px) e no desktop (1440px).
