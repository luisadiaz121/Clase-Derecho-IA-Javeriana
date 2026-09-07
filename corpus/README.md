# 📚 Corpus Normativo y Jurisprudencial de RutaSalud

Este directorio contiene el **corpus legal público y verificado** que alimenta el asistente inteligente **RutaSalud**, en cumplimiento del **Hito M3** del curso *Derecho e Inteligencia Artificial* (Pontificia Universidad Javeriana).

---

## 📂 Estructura de Fuentes del Corpus

| Archivo | Fuente Normativa / Jurisprudencial | Objeto y Criterio Jurídico |
| :--- | :--- | :--- |
| [`01_ley_1751_2015_estatutaria_salud.md`](01_ley_1751_2015_estatutaria_salud.md) | **Ley Estatutaria 1751 de 2015** | Consagra la salud como derecho fundamental autónomo, principios de continuidad, oportunidad e integralidad, prohibición de trabas administrativas (Art. 10c) y sujetos de especial protección (Art. 11). |
| [`02_constitucion_politica_arts_49_86.md`](02_constitucion_politica_arts_49_86.md) | **Constitución Política de Colombia** | Arts. 23 (Derecho de Petición), 44 (Derechos prevalentes de los niños), 49 (Servicio público de salud) y 86 (Acción de Tutela como mecanismo constitucional preferente y sumario). |
| [`03_decreto_2591_1991_reglamentario_tutela.md`](03_decreto_2591_1991_reglamentario_tutela.md) | **Decreto 2591 de 1991** | Trámite procesal de la tutela, procedencia contra particulares prestadores de salud (Art. 42 num. 2) y solicitud de Medidas Provisionales de protección inmediata en 48 horas (Art. 7). |
| [`04_supersalud_pqrd_procedimiento.md`](04_supersalud_pqrd_procedimiento.md) | **Superintendencia Nacional de Salud** | Procedimiento de Peticiones, Quejas, Reclamos y Denuncias (PQRD), facultades de inspección, vigilancia y control, y clasificación de riesgos (vital, prioritario y ordinario). |
| [`05_jurisprudencia_corte_constitucional.md`](05_jurisprudencia_corte_constitucional.md) | **Corte Constitucional** | Precedentes obligatorios: Sentencia T-760 de 2008 (sentencia estructural de salud) y Sentencia SU-508 de 2020 (Tratamiento Integral). |

---

## 🛡️ Reglas Anti-Alucinación Implementadas

1. **Cita taxativa:** Toda respuesta debe citar el número de la norma y el artículo específico de este corpus (ej. *"Ley 1751 de 2015, Art. 10 literal c"*).
2. **Rechazo a inventar hechos:** Si el usuario no suministra información médica suficiente, la herramienta no inventa diagnósticos ni tratamientos.
3. **Respeto a la subsidiariedad:** Si el caso no presenta riesgo inminente ni perjuicio irremediable, la herramienta remite a la vía ordinaria de la EPS o a la Supersalud, educando al ciudadano en el uso adecuado del aparato judicial.
