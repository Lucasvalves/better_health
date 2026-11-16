# Regras conservadoras de orientação por especialidade

**Tipo de conteúdo:** regras de navegação / encaminhamento administrativo  
**Status:** material educacional; não revisado clinicamente  
**Objetivo:** orientar o assistente na apresentação de uma especialidade possível para avaliação, sem diagnóstico ou classificação clínica.

## 1. Pré-condição: segurança primeiro

Antes de sugerir qualquer especialidade ou oferecer horário, consulte `safety_guidelines.md`.

Se o relato indicar uma possível emergência:

- interrompa a recomendação de consulta eletiva;
- não apresente uma especialidade como solução;
- oriente a busca imediata de atendimento de emergência conforme as instruções de segurança;
- não atrase essa orientação para fazer perguntas adicionais ou pesquisar médicos.

O RAG não é um serviço de regulação médica e não deve determinar prioridade clínica.

## 2. Objetivo da sugestão

A saída deve responder apenas a esta pergunta administrativa:

> "Considerando o que a pessoa relatou e as informações gerais recuperadas, qual especialidade cadastrada pode ser uma opção inicial para avaliação?"

A saída **não** deve responder:

- "Qual doença o paciente tem?"
- "Qual é a gravidade clínica do quadro?"
- "Qual tratamento ou medicamento deve ser usado?"
- "É seguro esperar por uma consulta?"

## 3. Ordem de decisão

### Regra A — Respeitar o fluxo de segurança

Nenhuma regra de especialidade se sobrepõe a uma orientação de emergência. Não encaminhar casos potencialmente urgentes para o calendário comum.

### Regra B — Considerar faixa etária e política da clínica

Se o paciente estiver na faixa etária atendida por Pediatria, verificar primeiro se a clínica oferece essa especialidade e se ela é apropriada conforme a política cadastrada. Não aplicar automaticamente o fallback de adultos.

Não inventar idade-limite. A política deve estar configurada pela clínica.

### Regra C — Sugerir uma especialidade específica somente com suporte

Uma especialidade pode ser apresentada como opção quando:

- o motivo principal está razoavelmente relacionado à área geral descrita em `medical_specialties.md`;
- o contexto coletado não revela uma necessidade de interromper o fluxo eletivo;
- o conteúdo recuperado dá suporte explícito à relação geral;
- a especialidade consta no catálogo ativo da clínica.

A justificativa deve mencionar a área de atuação, não uma doença presumida.

### Regra D — Sintomas inespecíficos ou múltiplos

Usar Clínico Geral como opção inicial para adultos quando:

- a pessoa relata mal-estar ou sintomas gerais sem área predominante;
- há queixas de sistemas diferentes sem um motivo principal claro;
- a pessoa não sabe qual especialidade procurar;
- faltam informações para sugerir uma especialidade com segurança administrativa.

Exemplo:

Paciente: "Estou indisposto, cansado e com dores em lugares diferentes."

Resposta administrativa possível: "Como os sintomas são variados e não apontam claramente para uma única área, uma avaliação inicial com Clínico Geral pode ajudar a organizar o atendimento."

### Regra E — Não forçar uma recomendação

Se não houver evidência suficiente nos documentos recuperados ou a especialidade não existir no catálogo:

- não inventar uma especialidade;
- não inferir uma doença;
- explicar que não é possível indicar uma área específica com as informações disponíveis;
- sugerir contato com a clínica ou avaliação inicial apropriada, conforme o fluxo configurado.

### Regra F — Limitar alternativas

Por padrão, retornar uma única especialidade. Retornar uma segunda alternativa somente quando houver justificativa clara e ambas estiverem disponíveis no catálogo. Não apresentar uma lista extensa para transferir a decisão ao paciente.

## 4. Exemplos de comportamento

Os exemplos são ilustrativos e não constituem protocolos clínicos.

### Exemplo 1 — Queixa de pele

Paciente: "Tenho uma irritação na pele que não melhora."

Comportamento esperado: Dermatologia pode ser apresentada como opção de avaliação, se disponível e se não houver sinal de alerta. Não afirmar a causa da irritação.

### Exemplo 2 — Acompanhamento hormonal conhecido

Paciente: "Já tenho diagnóstico de hipotireoidismo e preciso de acompanhamento."

Comportamento esperado: Endocrinologia pode ser apresentada como opção, se disponível. Não sugerir alteração de medicamento ou dose.

### Exemplo 3 — Queixas variadas

Paciente: "Estou cansado, com dor de cabeça e desconforto abdominal."

Comportamento esperado: não escolher uma especialidade pela contagem de sintomas. Considerar Clínico Geral como opção inicial para adulto, desde que a camada de segurança não identifique motivo para interromper o fluxo.

### Exemplo 4 — Dor no peito súbita e intensa

Paciente: "Começou uma dor forte no peito de repente e estou com falta de ar."

Comportamento esperado: não sugerir Cardiologia nem oferecer horários eletivos. Aplicar `safety_guidelines.md` e orientar atendimento de emergência.

### Exemplo 5 — Informação insuficiente

Paciente: "Não estou bem."

Comportamento esperado: perguntar de forma simples o que está sentindo e se há algo acontecendo agora que exija ajuda imediata. Se continuar inespecífico e não houver alerta, considerar Clínico Geral para adulto.

## 5. Catálogo e disponibilidade são responsabilidade da API

Depois que o RAG sugerir uma especialidade:

1. normalizar e validar o nome/ID contra `Specialties`;
2. consultar somente médicos ativos e associados à especialidade;
3. verificar disponibilidade em tempo real na camada de agendamento;
4. apresentar somente opções retornadas pela API;
5. se não houver médico ou horário, informar isso com transparência e consultar alternativas permitidas pela regra de negócio;
6. não trocar automaticamente por uma especialidade clinicamente diferente apenas porque há agenda disponível.

Nunca inventar nomes, CRM, especialidades, horários ou disponibilidade.

## 6. Confirmação e execução do agendamento

A sugestão de especialidade não cria consulta. Para agendar:

- apresentar médico, especialidade e horário retornados pela API;
- pedir confirmação explícita do paciente;
- executar a operação por meio do serviço de agendamento existente;
- revalidar disponibilidade e regras de conflito no backend;
- confirmar ao paciente somente após a API retornar sucesso.

## 7. Saída estruturada sugerida

```json
{
  "intent": "symptom_guidance",
  "requires_urgent_guidance": false,
  "suggested_specialties": [
    {
      "name": "Clínico Geral",
      "priority": 1,
      "reason": "O relato contém queixas inespecíficas e não aponta claramente para uma única área de atuação.",
      "evidence": [
        {
          "source": "referral_rules.md",
          "section": "Sintomas inespecíficos ou múltiplos"
        }
      ]
    }
  ],
  "questions_to_clarify": [],
  "patient_summary": "Resumo factual dos sintomas informados pelo paciente.",
  "disclaimer": "Esta é uma orientação inicial de navegação, não um diagnóstico ou decisão clínica."
}
```

## 8. Restrições obrigatórias

- Não diagnosticar nem listar doenças prováveis.
- Não prescrever, recomendar ou ajustar medicamentos.
- Não decidir gravidade, prioridade ou segurança de espera.
- Não afirmar que uma consulta eletiva é suficiente para o quadro.
- Não ocultar incerteza ou lacunas de informação.
- Não inventar evidências ou citar documentos não recuperados.
- Não usar disponibilidade de agenda como critério para determinar a especialidade.
- Não transformar correlação entre sintoma e área médica em decisão clínica.
