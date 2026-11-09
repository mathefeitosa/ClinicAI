# Smart ClinicAI

Censo da enfermaria como PWA: evolução, pendências, sinais vitais, exame físico, calculadoras clínicas e passagem de plantão SBAR.

- Funciona offline depois do primeiro acesso (service worker).
- Os dados ficam só no navegador de cada pessoa (localStorage). Nada é enviado a servidor.
- Use **Exportar Backup** com frequência: limpar os dados do navegador apaga os pacientes.

## Instalar no Android
Abra o site no Chrome → menu ⋮ → **Instalar app**.

## Atualizar
Ao mudar `index.html`, troque `VERSION` em `sw.js` para os aparelhos baixarem a nova versão.
