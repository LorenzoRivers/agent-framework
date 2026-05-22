# risk-review — Pre-mortem su qualsiasi output

**Trigger:** User dice "analizza i rischi", "quali sono i rischi?", "puoi migliorarlo?", "cosa manca?", "pre-mortem", o simili — su un task, un piano, una struttura, un'architettura, o qualsiasi output complesso.

**Cosa fa:** Claude passa dalla modalità generativa alla modalità critica sullo stesso output. Identifica rischi, lacune e semplificazioni possibili, poi produce una versione migliorata o un elenco di fix da applicare.

**Quando usarla:**
- Su un TASK file prima di approvarlo a Gate 1
- Su un piano di block prima di iniziarlo
- Su un'architettura o decisione tecnica importante
- Su qualsiasi risposta di Claude che ti sembra troppo ottimista

---

## Esecuzione

### Step 1 — Identifica l'oggetto della critica

Se l'utente non specifica, usa l'ultimo output di Claude nella conversazione.

### Step 2 — Pre-mortem in tre domande

Rispondi a ognuna concretamente, non in astratto:

**1. Rischi — "Immagina che questo sia già andato storto. Cos'è successo?"**
- Regressioni non coperte: quali comportamenti esistenti potrebbero rompersi?
- Assunzioni silenti: cosa deve essere vero perché questo funzioni, e non è esplicitato?
- Edge case: quali input o stati inattesi non sono gestiti?
- Dipendenze nascoste: questo task dipende da qualcosa che non è ancora fatto?

**2. Lacune — "Cosa dovrebbe indovinare chi implementa questo?"**
- File in scope incompleti: manca qualcosa che sarà sicuramente toccato?
- Criteri ambigui: un acceptance criterion che due persone interpreterebbero diversamente?
- Comportamenti non specificati: cosa succede in caso di errore? Di stato vuoto? Di input invalido?
- Contraddizioni interne: qualcosa nel task si contraddict con qualcos'altro?

**3. Semplificazione — "Esiste un modo più semplice per ottenere lo stesso risultato?"**
- Scope necessario vs scope aggiunto per abitudine: ogni elemento del task è indispensabile per Block 1?
- Astrazione prematura: si sta costruendo flessibilità per un caso d'uso che non esiste ancora?
- Sequenza sbagliata: questo andrebbe fatto dopo qualcos'altro invece che ora?

### Step 3 — Output

Presenta i risultati in questo formato:

```
## Pre-mortem — [oggetto analizzato]

### Rischi
- [rischio 1] — impatto: alto / medio / basso
- [rischio 2] — impatto: alto / medio / basso

### Lacune
- [lacuna 1]
- [lacuna 2]

### Semplificazioni possibili
- [semplificazione 1]

### Versione migliorata
[Se l'oggetto è un TASK o un piano: riscrivi la sezione specifica che richiede fix.
 Se l'oggetto è un'architettura: elenca le modifiche da applicare.
 Se i fix sono minimi: elenca solo i delta, non riscrivere tutto.]
```

### Regola di escalation

Se la critica rivela un'ambiguità che richiede una decisione dell'utente (non solo un miglioramento che Claude può applicare autonomamente), surfaciala con il formato standard:

```
❓ Domanda: [ambiguità trovata]
💡 Proposta: [risposta raccomandata da Claude]
📎 Allineata con: [fonte]
```
