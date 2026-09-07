# 🧪 Casos de Prueba Documentados — RutaSalud

**Proyecto:** RutaSalud — Asistente de Reclamaciones en Salud  
**Estudiante:** Luisa Fernanda Díaz Díaz  
**Curso:** Derecho e Inteligencia Artificial (Pontificia Universidad Javeriana · 2026-II)  
**Docente:** Pedro Ardila  
**Hito:** M2 — Casos de prueba documentados  
**Fecha:** Septiembre de 2026  

---

## 🎯 Objetivo de las Pruebas

El objetivo de este documento es evaluar y garantizar que el asistente **RutaSalud** resuelva de manera jurídicamente acertada y rigurosa diferentes situaciones de vulneración del derecho a la salud en Colombia, evitando los errores típicos de los modelos de IA genéricos (como alucinaciones jurídicas, confusión de normativas extranjeras o recomendación errónea de la vía procesal).

A continuación se presentan **5 casos de prueba sistemáticos**, documentando qué fallaba antes con un LLM genérico, cuál es el criterio legal correcto según el derecho colombiano y cómo responde **RutaSalud**.

---

## 📋 Caso de Prueba 1: Demora en entrega de medicamento para enfermedad crónica (Ruta EPS)

### 1. Datos de entrada
* **Problema reportado:** Demora en entrega de medicamentos esenciales (Losartán 50mg).
* **EPS involucrada:** Sanitas EPS.
* **Orden médica:** Sí cuenta con fórmula médica vigente expedida por el médico tratante.
* **Trámite previo:** No se ha presentado queja o reclamación formal previa ante la EPS.
* **Nivel de urgencia:** Riesgo moderado (deterioro progresivo, pero sin urgencia vital inmediata).
* **Hechos descritos:** *"Llevo 15 días yendo al dispensario de medicamentos y me dicen que no hay existencias. Es la primera vez que reclamo formalmente."*

### 2. ¿Dónde fallaba antes un modelo genérico de IA?
* **Fallo anterior:** Los modelos de IA convencionales solían redactar inmediatamente una Acción de Tutela, desconociendo el **principio de subsidiariedad** (Art. 86 CP) y el hecho de que no existía urgencia vital ni agotamiento previo ante la EPS, lo cual causaría que un juez constitucional declarara improcedente la tutela por falta de subsidiariedad.

### 3. Criterio jurídico correcto (Derecho Colombiano)
* Al no existir peligro inminente de daño irremediable y no haberse solicitado formalmente a la EPS, la vía procesal idónea es el **Derecho de Petición ante la EPS** (Art. 23 CP, Ley 1755 de 2015 y Art. 10 literal c de la Ley 1751 de 2015).
* La EPS tiene la obligación legal de suministrar el medicamento o garantizar su entrega a domicilio en un plazo máximo de 48 horas si está pendiente (Resolución 1604 de 2013).

### 4. Resultado obtenido en RutaSalud
* **Ruta asignada:** `Ruta 1: Reclamación Ordinaria / Derecho de Petición ante la EPS`.
* **Fundamento legal:** Art. 23 C.P.; Ley 1755 de 2015; Art. 10 literal c de la Ley 1751 de 2015 (prohibición de trasladar cargas administrativas al paciente).
* **Documento generado:** Borrador de Derecho de Petición en interés particular dirigido a Sanitas EPS, exigiendo la entrega efectiva y fijando término de respuesta.
* **Evaluación:** ✅ **Aprobado.** No salta prematuramente a la tutela y respeta el trámite ordinario.

---

## 📋 Caso de Prueba 2: Dilación injustificada en cita con especialista tras queja previa (Ruta Supersalud)

### 1. Datos de entrada
* **Problema reportado:** Cita médica con especialista (Neurología) no asignada.
* **EPS involucrada:** Nueva EPS.
* **Orden médica:** Sí, orden vigente desde hace más de 3 meses.
* **Trámite previo:** Sí, se radicó derecho de petición ante la EPS hace 20 días hábiles sin ninguna respuesta.
* **Nivel de urgencia:** Riesgo moderado.
* **Hechos descritos:** *"Radiqué petición formal hace casi un mes ante la Nueva EPS pidiendo la cita con el neurólogo y no me han dado respuesta ni fecha."*

### 2. ¿Dónde fallaba antes un modelo genérico de IA?
* **Fallo anterior:** Los modelos solían citar leyes de defensa del consumidor genéricas (como la Ley 1480 de 2011) o remitir a la Superintendencia de Industria y Comercio (SIC), órgano que carece de competencia en materia de habilitación y oportunidad del servicio público de salud en Colombia.

### 3. Criterio jurídico correcto (Derecho Colombiano)
* Ante el silencio de la EPS y la falta de oportunidad en la atención (Ley 1751 de 2015, Art. 6 literal c), corresponde acudir a la **Superintendencia Nacional de Salud (Supersalud)** mediante el trámite de **PQRD** (Circular Única de la Supersalud y Ley 1438 de 2011, Art. 126) como entidad de inspección, vigilancia y control para que conmine de oficio a la EPS.

### 4. Resultado obtenido en RutaSalud
* **Ruta asignada:** `Ruta 2: PQRD ante la Superintendencia Nacional de Salud`.
* **Fundamento legal:** Ley 1751 de 2015 (principios de oportunidad y accesibilidad); Circular Única de la Superintendencia Nacional de Salud; Art. 126 Ley 1438 de 2011.
* **Documento generado:** Borrador formal de PQRD ante la Supersalud con relación de hechos de silencio administrativo y solicitud de intervención coercitiva.
* **Evaluación:** ✅ **Aprobado.** Redirige al órgano de control sectorial competente con sustento normativo.

---

## 📋 Caso de Prueba 3: Negación de cirugía urgente con riesgo vital (Ruta Tutela con Medida Provisional)

### 1. Datos de entrada
* **Problema reportado:** Aplazamiento injustificado de cateterismo cardíaco / procedimiento quirúrgico urgente.
* **EPS involucrada:** Compensar EPS.
* **Orden médica:** Sí, orden prioritaria de cirujano cardiovascular.
* **Trámite previo:** La EPS informó informalmente que no tiene agenda disponible con la IPS adscrita.
* **Nivel de urgencia:** Riesgo inminente/vital (riesgo de infarto o muerte súbita).
* **Hechos descritos:** *"Mi médico tratante ordenó cateterismo urgente con riesgo vital y la EPS dice que no tiene convenio con la clínica y que debo esperar autorización sin fecha fija."*

### 2. ¿Dónde fallaba antes un modelo genérico de IA?
* **Fallo anterior:** Sugería trámites lentos de conciliación o peticiones ordinarias con 15 días de plazo, poniendo en peligro inminente la vida del paciente, o bien generaba tutelas sin solicitar la **Medida Cautelar Provisional** del artículo 7 del Decreto 2591 de 1991.

### 3. Criterio jurídico correcto (Derecho Colombiano)
* Al presentarse riesgo inminente a la vida e integridad personal (derecho fundamental autónomo, Art. 2 Ley 1751 de 2015 y Art. 11 CP), se configura la excepción al principio de subsidiariedad por **peligro de perjuicio irremediable**.
* Procede de inmediato la **Acción de Tutela (Art. 86 CP y Decreto 2591 de 1991)** solicitando expresamente **Medida Provisional** (Art. 7 Dcto 2591/91) para orden inmediata en 48 horas.

### 4. Resultado obtenido en RutaSalud
* **Ruta asignada:** `Ruta 3: Acción de Tutela con Medida Provisional`.
* **Fundamento legal:** Arts. 11, 49 y 86 de la Constitución Política; Ley 1751 de 2015 (Arts. 2, 6 y 8 — principio de integralidad y continuidad); Art. 7 del Decreto 2591 de 1991 (Medida Provisional).
* **Documento generado:** Acción de Tutela ante Juez de la República con acápite expreso de Medida Cautelar Provisional de cumplimiento inmediato en 48 horas y tratamiento integral.
* **Evaluación:** ✅ **Aprobado.** Activó la ruta constitucional de máxima protección e incorporó la medida provisional procesal requerida.

---

## 📋 Caso de Prueba 4: Sujeto de especial protección constitucional — Menor con discapacidad (Ruta Tutela)

### 1. Datos de entrada
* **Problema reportado:** Negación de terapias integrales (neurorehabilitación) y transporte especializado para niño con condición del espectro autista severo.
* **EPS involucrada:** Famisanar EPS.
* **Orden médica:** Sí, ordenada por junta médica neuropediátrica.
* **Trámite previo:** La EPS respondió que las terapias no están incluidas en su red básica del municipio.
* **Nivel de urgencia:** Sujeto de especial protección constitucional (menor de edad).
* **Hechos descritos:** *"Mi hijo de 6 años tiene diagnóstico de autismo severo. El neuropediatra le mandó terapias especializadas y la EPS se niega a autorizarlas diciendo que no hay convenio."*

### 2. ¿Dónde fallaba antes un modelo genérico de IA?
* **Fallo anterior:** Trataba al menor como un afiliado regular adulto y le exigía esperar respuestas de derecho de petición o acudir a demandas contenciosas ordinarias, desconociendo el **interés superior del menor** y el precedente de la Sentencia T-760 de 2008.

### 3. Criterio jurídico correcto (Derecho Colombiano)
* El **artículo 11 de la Ley 1751 de 2015** establece expresamente que los niños, niñas y adolescentes, así como las personas en condición de discapacidad, son **sujetos de especial protección**.
* Su atención integral no puede ser limitada ni condicionada por trabas administrativas ni falta de convenios de la EPS (precedente reiterado Corte Constitucional: Sentencia SU-508 de 2020 y T-020 de 2023).

### 4. Resultado obtenido en RutaSalud
* **Ruta asignada:** `Ruta 3: Acción de Tutela con Medida Provisional y Tratamiento Integral`.
* **Fundamento legal:** Art. 44 y 86 CP (derechos prevalentes de los niños); Art. 11 de la Ley 1751 de 2015 (sujetos de especial protección); Sentencia SU-508 de 2020 de la Corte Constitucional.
* **Documento generado:** Borrador de Tutela fundamentada en el principio del interés superior del menor y solicitud de orden de tratamiento integral y continuo.
* **Evaluación:** ✅ **Aprobado.** Reconoce el estatus de especial protección constitucional y la prevalencia de derechos.

---

## 📋 Caso de Prueba 5: Negación de atención en urgencias por mora o falta de carné (Ruta Constitucional Inmediata)

### 1. Datos de entrada
* **Problema reportado:** Negación de atención médica inicial en servicio de urgencias bajo el argumento de que el usuario figura con mora patronal o desafiliado en el ADRES.
* **EPS/IPS involucrada:** Clínica privada adscrita a EPS.
* **Orden médica:** No aplica por ser ingreso por urgencias.
* **Trámite previo:** Negativa verbal directa en la recepción de urgencias.
* **Nivel de urgencia:** Riesgo inminente/vital.
* **Hechos descritos:** *"Llegué a urgencias con dolor torácico agudo y en admisiones se negaron a atenderme porque en el sistema de mi EPS aparezco en estado suspendido por mora de mi empleador."*

### 2. ¿Dónde fallaba antes un modelo genérico de IA?
* **Fallo anterior:** Afirmaba que el paciente debía primero ponerse al día con los aportes o pagar un depósito en dinero antes de exigir la atención médica, desconociendo la prohibición absoluta del cobro o negación de urgencias en Colombia.

### 3. Criterio jurídico correcto (Derecho Colombiano)
* El **artículo 10 literal b y artículo 14 de la Ley Estatutaria 1751 de 2015** prohíben taxativamente la exigencia de pagos previos, cheques de garantía o copagos para la atención inicial de urgencias.
* El servicio de urgencias es de carácter obligatorio para **todas las entidades públicas y privadas** prestadoras de salud en el territorio nacional, con independencia de la capacidad de pago, afiliación o condición administrativa del paciente.

### 4. Resultado obtenido en RutaSalud
* **Ruta asignada:** `Ruta 3: Tutela Inmediata con Medida Cautelar y Denuncia ante Supersalud`.
* **Fundamento legal:** Arts. 10 (literal b) y 14 de la Ley 1751 de 2015; Art. 49 C.P.; Resolución 5596 de 2015 (Triage en urgencias).
* **Documento generado:** Acción de tutela con solicitud urgente de atención médica inmediata y advertencia de responsabilidad penal y administrativa a la clínica y a la EPS.
* **Evaluación:** ✅ **Aprobado.** Identifica la infracción flagrante a la ley de urgencias y redacta la orden inmediata de protección.

---

## 📊 Matriz Resumen de Resultados de las Pruebas

| Caso | Situación Jurídica | Nivel de Riesgo | Ruta Determinada | Marco Normativo Aplicado | Estado |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **1** | Falta de entrega de medicamentos crónicos | Moderado | **EPS** (Petición) | Art. 23 CP, Ley 1755/15, Ley 1751/15 Art. 10 | ✅ Conforme |
| **2** | Silencio de la EPS ante cita de especialista | Moderado | **Supersalud** (PQRD) | Ley 1751/15 Art. 6, Circular Única Supersalud | ✅ Conforme |
| **3** | Dilación de cirugía con peligro de infarto | Vital / Inminente | **Tutela** (Medida Prov.) | Art. 86 CP, Dcto 2591/91 Art. 7, Ley 1751/15 | ✅ Conforme |
| **4** | Terapias para menor con condición autista | Sujeto Especial | **Tutela** (Integralidad) | Art. 44 CP, Ley 1751/15 Art. 11, SU-508/20 | ✅ Conforme |
| **5** | Negación de atención en urgencias por mora | Inminente | **Tutela** + Supersalud | Ley 1751/15 Arts. 10b y 14, Art. 49 CP | ✅ Conforme |

---

## 🎓 Conclusiones de la Evaluación

1. **Evitación de alucinaciones:** La herramienta se limita a invocar fuentes vigentes del ordenamiento jurídico colombiano (Constitución Política, Ley Estatutaria 1751 de 2015, Decreto 2591 de 1991 y normatividad de la Supersalud).
2. **Respeto a la subsidiariedad:** No envía todo a tutela ciegamente; clasifica con criterio jurídico cuándo corresponde agotar la vía de la EPS o de la Supersalud y cuándo procede la tutela directa por riesgo inminente.
3. **Generación formal y ética:** Cada borrador cuenta con la debida fundamentación fáctica y jurídica, protegiendo los datos del usuario al no exigir información personal sensible y manteniendo la advertencia de no sustitución del abogado.
