document.addEventListener('DOMContentLoaded', () => {
    const caseForm = document.getElementById('case-form');
    const btnAnalyze = document.getElementById('btn-analyze');
    const spinner = document.getElementById('spinner');
    const placeholderView = document.getElementById('placeholder-view');
    const resultsView = document.getElementById('results-view');

    // Elementos de resultados
    const routeCategoryBadge = document.getElementById('route-category-badge');
    const routeTitleText = document.getElementById('route-title-text');
    const routeSummaryText = document.getElementById('route-summary-text');
    const legalAnalysisBox = document.getElementById('legal-analysis-box');
    const citationsList = document.getElementById('citations-list');
    const docTypeLabel = document.getElementById('doc-type-label');
    const documentText = document.getElementById('document-text');
    const stepsTimeline = document.getElementById('steps-timeline');
    const btnCopyDoc = document.getElementById('btn-copy-doc');
    const btnDownloadDoc = document.getElementById('btn-download-doc');

    // Navegación de pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // Envío del Formulario
    caseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            issueType: document.getElementById('issue-type').value,
            epsName: document.getElementById('eps-name').value.trim(),
            hasOrder: document.getElementById('has-order').value,
            priorClaim: document.getElementById('prior-claim').value,
            urgencyLevel: document.getElementById('urgency-level').value,
            caseDetails: document.getElementById('case-details').value.trim()
        };

        // Estado de carga
        btnAnalyze.disabled = true;
        spinner.classList.remove('hidden');
        btnAnalyze.querySelector('.btn-text').textContent = 'Analizando normatividad y jurisprudencia...';

        try {
            // 1. Intentar llamar al backend serverless en /api/chat
            let resultData = null;
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const json = await response.json();
                    if (json && json.success && json.data) {
                        resultData = json.data;
                    }
                }
            } catch (err) {
                console.log('API de OpenRouter no disponible, usando motor normativo local:', err);
            }

            // 2. Si no hay respuesta de la API (o no se configuró clave en Vercel aún),
            // usar el motor normativo jurídico local para que NUNCA falle la demo
            if (!resultData) {
                resultData = generarAnalisisJuridicoLocal(formData);
            }

            // Renderizar resultados en pantalla
            renderizarResultados(resultData, formData);

        } catch (error) {
            console.error('Error general:', error);
            alert('Ocurrió un error al procesar la solicitud. Por favor intenta de nuevo.');
        } finally {
            btnAnalyze.disabled = false;
            spinner.classList.add('hidden');
            btnAnalyze.querySelector('.btn-text').textContent = 'Analizar Caso y Determinar Ruta Jurídica 🔍';
        }
    });

    // Función para renderizar los resultados en la interfaz
    function renderizarResultados(data, formData) {
        placeholderView.classList.add('hidden');
        resultsView.classList.remove('hidden');

        // Badge y categoría
        routeCategoryBadge.className = 'route-tag';
        if (data.routeType === 'TUTELA') {
            routeCategoryBadge.classList.add('tag-tutela');
            routeCategoryBadge.textContent = 'Ruta 3: Acción de Tutela';
        } else if (data.routeType === 'SUPERSALUD') {
            routeCategoryBadge.classList.add('tag-supersalud');
            routeCategoryBadge.textContent = 'Ruta 2: PQRD Supersalud';
        } else {
            routeCategoryBadge.classList.add('tag-eps');
            routeCategoryBadge.textContent = 'Ruta 1: Reclamación EPS';
        }

        routeTitleText.textContent = data.routeTitle;
        routeSummaryText.textContent = data.routeSummary;

        // Análisis Jurídico
        legalAnalysisBox.innerHTML = data.analysisHtml;

        // Citas Normativas
        citationsList.innerHTML = '';
        data.citations.forEach(c => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${c.norma}:</strong> ${c.descripcion}`;
            citationsList.appendChild(li);
        });

        // Borrador de Documento
        docTypeLabel.textContent = data.docType;
        documentText.textContent = data.documentDraft;

        // Pasos a seguir
        stepsTimeline.innerHTML = '';
        data.steps.forEach((step, idx) => {
            const card = document.createElement('div');
            card.className = 'step-card';
            card.innerHTML = `
                <div class="step-number">${idx + 1}</div>
                <div class="step-info">
                    <h5>${step.title}</h5>
                    <p>${step.desc}</p>
                </div>
            `;
            stepsTimeline.appendChild(card);
        });

        // Scroll suave al resultado
        document.getElementById('results-panel').scrollIntoView({ behavior: 'smooth' });
    }

    // Copiar al portapapeles
    btnCopyDoc.addEventListener('click', async () => {
        const text = documentText.textContent;
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            const originalText = btnCopyDoc.textContent;
            btnCopyDoc.textContent = '✅ ¡Copiado!';
            setTimeout(() => { btnCopyDoc.textContent = originalText; }, 2000);
        } catch (err) {
            alert('No se pudo copiar automáticamente. Puedes seleccionar el texto y presionar Ctrl+C.');
        }
    });

    // Descargar como archivo .txt
    btnDownloadDoc.addEventListener('click', () => {
        const text = documentText.textContent;
        if (!text) return;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Borrador_${docTypeLabel.textContent.replace(/\s+/g, '_')}_RutaSalud.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // MOTOR JURÍDICO BASADO EN LEY 1751 DE 2015 Y PRECEDENTES CORTE CONSTITUCIONAL
    function generarAnalisisJuridicoLocal(data) {
        const isUrgent = data.urgencyLevel === 'inminente' || data.urgencyLevel === 'sujeto_especial';
        const hasClaimedBefore = data.priorClaim === 'si_sin_respuesta' || data.priorClaim === 'si_negada';

        let routeType = 'EPS';
        let routeTitle = '';
        let routeSummary = '';
        let docType = 'Derecho de Petición en Salud';
        let analysisHtml = '';
        let citations = [];
        let steps = [];

        // Reglas de decisión procedimental en salud colombiana
        if (isUrgent || (hasClaimedBefore && data.priorClaim === 'si_negada')) {
            routeType = 'TUTELA';
            routeTitle = 'Procedencia Inmediata: Acción de Tutela con Medida Provisional';
            routeSummary = 'Dada la inminencia de daño a la salud/vida o la negativa injustificada de la entidad, procede la tutela como mecanismo constitucional preferente y sumario.';
            docType = 'Acción de Tutela en Salud';

            analysisHtml = `
                <p>El derecho fundamental a la salud es autónomo e irrenunciable según el <strong>artículo 2 de la Ley Estatutaria 1751 de 2015</strong>. Conforme al principio de <em>oportunidad, integralidad y continuidad</em> (Art. 6 y 8), las entidades no pueden suspender ni demorar tratamientos indispensables.</p>
                <p>Al existir una situación de <strong>${data.urgencyLevel === 'sujeto_especial' ? 'Sujeto de Especial Protección Constitucional' : 'Riesgo inminente para la salud o la vida digna'}</strong>, el requisito de subsidiariedad ordinario cede ante el peligro de perjuicio irremediable, haciendo procedente la <strong>Acción de Tutela (Art. 86 CP y Decreto 2591 de 1991)</strong> con solicitud de medida cautelar provisional.</p>
            `;

            citations = [
                { norma: 'Ley Estatutaria 1751 de 2015, Arts. 2, 6, 8 y 10', descripcion: 'Consagra la salud como derecho fundamental autónomo, principio de integralidad y prohibición de barreras administrativas.' },
                { norma: 'Constitución Política de Colombia, Arts. 49 y 86', descripcion: 'Atención en salud obligatoria y mecanismo preferente y sumario de tutela ante vulneración o amenaza inminente.' },
                { norma: 'Decreto 2591 de 1991, Art. 7', descripcion: 'Facultad del juez para ordenar medidas provisionales de protección inmediata mientras resuelve el fallo.' }
            ];

            steps = [
                { title: 'Diligencia los datos personales', desc: 'Reemplaza en el borrador tus nombres, cédula, dirección y teléfono para notificaciones.' },
                { title: 'Anexa las pruebas clave', desc: 'Adjunta copia de tu cédula, la orden médica o historia clínica y los comprobantes de radicación previa.' },
                { title: 'Radicación electrónica o presencial', desc: 'Radica la tutela a través de la plataforma web de la Rama Judicial (tutelas en línea) o en el reparto judicial de tu municipio.' },
                { title: 'Término de fallo', desc: 'El juez constitucional tiene un término perentorio de diez (10) días hábiles para emitir la sentencia.' }
            ];

        } else if (data.priorClaim === 'si_sin_respuesta') {
            routeType = 'SUPERSALUD';
            routeTitle = 'Vía Administrativa de Inspección: PQRD ante la Superintendencia Nacional de Salud';
            routeSummary = 'La EPS ya ha incurrido en dilación injustificada frente a tu requerimiento previo. Corresponde escalar la denuncia ante el órgano de control y vigilancia.';
            docType = 'PQRD ante Supersalud';

            analysisHtml = `
                <p>La <strong>EPS ${data.epsName || 'seleccionada'}</strong> tiene el deber legal de responder y prestar los servicios oportunamente. Al haber transcurrido los términos legales sin solución efectiva, se configura una falta de oportunidad y accesibilidad al servicio de salud (Ley 1751 de 2015, Art. 6).</p>
                <p>La vía procedente consiste en radicar una <strong>Petición, Queja, Reclamo o Denuncia (PQRD)</strong> ante la <strong>Superintendencia Nacional de Salud</strong>, solicitando su intervención inmediata para conminar a la EPS a garantizar el servicio de salud requerido.</p>
            `;

            citations = [
                { norma: 'Ley 1751 de 2015, Art. 6 y 10', descripcion: 'Garantía de oportunidad, eficiencia y calidad en la prestación de los servicios de salud.' },
                { norma: 'Circular Única de la Superintendencia Nacional de Salud', descripcion: 'Régimen de inspección, vigilancia y control, y trámite expedito de PQRD en riesgo de salud.' },
                { norma: 'Ley 1438 de 2011, Art. 126', descripcion: 'Facultades sancionatorias y de conciliación y vigilancia de la Supersalud frente a las EPS.' }
            ];

            steps = [
                { title: 'Ingresa al portal de la Supersalud', desc: 'Accede a www.supersalud.gov.co en la sección "Reclamos y PQRD" o llama a la línea gratuita nacional 018000513700.' },
                { title: 'Copia el texto del reclamo', desc: 'Pega el borrador generado en el campo de descripción de la plataforma de la Supersalud.' },
                { title: 'Guarda el número de radicado', desc: 'La Supersalud asigna un código de seguimiento que te permitirá monitorear la respuesta obligatoria de la EPS.' }
            ];

        } else {
            routeType = 'EPS';
            routeTitle = 'Ruta Ordinaria: Reclamación Formal / Derecho de Petición ante la EPS';
            routeSummary = 'Al no haberse presentado solicitud previa y no existir peligro inminente de muerte o daño irreparable, se debe radicar en primer lugar el reclamo formal ante la EPS.';
            docType = 'Derecho de Petición ante EPS';

            analysisHtml = `
                <p>En el sistema de salud colombiano, la <strong>EPS ${data.epsName || 'afiliadora'}</strong> es la principal obligada a organizar y prestar los servicios médicos derivados de órdenes facultativas.</p>
                <p>Para agotar el trámite ordinario y dejar constancia formal del incumplimiento, es necesario presentar un <strong>Derecho de Petición en Salud (Art. 23 CP y Art. 14 de la Ley 1755 de 2015)</strong>, el cual debe ser atendido prioritariamente por la entidad promotora de salud.</p>
            `;

            citations = [
                { norma: 'Constitución Política de Colombia, Art. 23', descripcion: 'Derecho fundamental a presentar peticiones respetuosas y obtener pronta resolución.' },
                { norma: 'Ley 1755 de 2015 (Regulatoria del Derecho de Petición)', descripcion: 'Plazos de respuesta y deber de resolver de fondo las peticiones de los ciudadanos.' },
                { norma: 'Ley Estatutaria 1751 de 2015, Art. 10 Literal c', descripcion: 'Derecho del usuario a no soportar cargas administrativas que le correspondan a las EPS.' }
            ];

            steps = [
                { title: 'Radicar ante la EPS', desc: 'Radica el documento por correo electrónico de atención al usuario de tu EPS o en la oficina de atención presencial.' },
                { title: 'Exigir el número de radicado', desc: 'Asegúrate de conservar copia con sello de recibido o correo de confirmación con fecha y hora.' },
                { title: 'Término de espera', desc: 'Si en un plazo razonable (5 a 15 días según urgencia) la EPS no soluciona, podrás activar inmediatamente la Tutela o Supersalud.' }
            ];
        }

        // Generación del Borrador
        const documentDraft = construirBorradorDocumento(routeType, data);

        return {
            routeType,
            routeTitle,
            routeSummary,
            docType,
            analysisHtml,
            citations,
            steps,
            documentDraft
        };
    }

    function construirBorradorDocumento(routeType, data) {
        const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
        const eps = data.epsName || '[NOMBRE DE TU EPS]';

        if (routeType === 'TUTELA') {
            return `SEÑOR(A)
JUEZ DE LA REPÚBLICA DE COLOMBIA (REPARTO)
E. S. D.

ASUNTO: ACCIÓN DE TUTELA PARA LA PROTECCIÓN DEL DERECHO FUNDAMENTAL A LA SALUD Y LA VIDA DIGNA
ACCIONANTE: [ESCRIBE AQUÍ TU NOMBRE COMPLETO]
C.C. No.: [NÚMERO DE CÉDULA] de [CIUDAD DE EXPEDICIÓN]
ACCIONADO: ${eps.toUpperCase()}

Yo, [ESCRIBE AQUÍ TU NOMBRE COMPLETO], mayor de edad, domiciliado(a) en la ciudad de [CIUDAD], identificado(a) como aparece al pie de mi firma, actuando en nombre propio, acudo respetuosamente ante su despacho para interponer ACCIÓN DE TUTELA de conformidad con el artículo 86 de la Constitución Política y el Decreto 2591 de 1991, en contra de ${eps.toUpperCase()}, con fundamento en los siguientes:

I. HECHOS
1. Me encuentro válidamente afiliado(a) al Sistema General de Seguridad Social en Salud a través de la EPS ${eps.toUpperCase()}.
2. Cuento con prescripción y criterio médico que requiere la prestación oportuna del servicio de salud consistente en: ${data.issueType.replace('_', ' ').toUpperCase()} (${data.caseDetails}).
3. A la fecha, la entidad accionada ${eps.toUpperCase()} ha dilatado, negado u omitido autorizar y suministrar efectivamente dicho requerimiento médico.
4. Dicha omisión compromete de manera directa mi calidad de vida, integridad física y salud, configurando un riesgo inminente dada la gravedad y necesidad del servicio.

II. MEDIDA PROVISIONAL (ARTÍCULO 7 DEL DECRETO 2591 DE 1991)
Solicito a su despacho ordenar inmediatamente y de forma PROVISIONAL a ${eps.toUpperCase()} que proceda a la autorización y entrega inmediata de lo ordenado, en tanto la demora adicional puede causar un perjuicio irremediable a mi salud.

III. PETICIONES
1. TUTELAR mis derechos fundamentales a la SALUD, a la VIDA DIGNA y a la INTEGRIDAD FÍSICA.
2. ORDENAR a ${eps.toUpperCase()} que en un término perentorio de 48 horas autorice, programe y haga entrega efectiva del servicio o medicamento requerido.
3. ORDENAR a la accionada brindar TRATAMIENTO INTEGRAL derivado de mi patología para evitar futuras interrupciones injustificadas.

IV. FUNDAMENTOS DE DERECHO
Fundamento esta acción en los artículos 49 y 86 de la Constitución Política; la Ley Estatutaria 1751 de 2015 (artículos 2, 6, 8 y 10) que consagra la salud como derecho fundamental autónomo e integral; y el Decreto 2591 de 1991.

V. PRUEBAS
- Copia de documento de identidad del(la) accionante.
- Copia de orden médica o historia clínica relevante.
- Constancia de reclamación o solicitud ante la EPS (si aplica).

VI. NOTIFICACIONES
- Accionante: Correo electrónico: [TU CORREO] | Teléfono: [TU TELÉFONO] | Dirección: [TU DIRECCIÓN].
- Accionado: ${eps.toUpperCase()} en su canal oficial para notificaciones judiciales.

Atentamente,

___________________________________
[ESCRIBE AQUÍ TU NOMBRE COMPLETO]
C.C. No. [NÚMERO DE CÉDULA]
`;
        } else if (routeType === 'SUPERSALUD') {
            return `FECHA: ${fecha}
SEÑORES:
SUPERINTENDENCIA NACIONAL DE SALUD (SUPERSALUD)
ASUNTO: PETICIÓN, QUEJA, RECLAMO O DENUNCIA (PQRD) EN SALUD
ENTIDAD AFECTADA / VIGILADA: ${eps.toUpperCase()}

DATOS DEL AFILIADO/USUARIO:
Nombre completo: [ESCRIBE AQUÍ TU NOMBRE COMPLETO]
Cédula de Ciudadanía: [NÚMERO DE CÉDULA]
Teléfono / WhatsApp: [TU NÚMERO]
Correo Electrónico: [TU CORREO]
Dirección de Residencia: [CIUDAD Y DIRECCIÓN]

I. MOTIVO DE LA RECLAMACIÓN:
Por medio del presente documento formulo PQRD formal en contra de la EPS ${eps.toUpperCase()} por la presunta vulneración del derecho fundamental a la salud (Ley 1751 de 2015) y la falta de oportunidad en el servicio, debido a:

II. RELACIÓN DE LOS HECHOS:
1. Soy afiliado(a) a ${eps.toUpperCase()}.
2. Con fecha [FECHA DE LA ORDEN], el médico tratante ordenó: ${data.issueType.replace('_', ' ')}.
3. He radicado la solicitud correspondiente ante la EPS sin que a la fecha se haya brindado una solución de fondo ni la entrega efectiva.
4. Detalle de la situación: ${data.caseDetails}.

III. SOLICITUD A LA SUPERSALUD:
Solicito respetuosamente a la Superintendencia Nacional de Salud intervenir y conminar de manera inmediata a la EPS ${eps.toUpperCase()} para que autorice y garantice la entrega o realización del servicio médico solicitado, garantizando el principio de oportunidad y continuidad consagrado en el artículo 6 de la Ley 1751 de 2015.

Adjunto copia de las órdenes médicas y soportes de radicación previa.

Cordialmente,

[ESCRIBE AQUÍ TU NOMBRE COMPLETO]
C.C. [NÚMERO DE CÉDULA]
`;
        } else {
            return `CIUDAD Y FECHA: [CIUDAD], ${fecha}

SEÑORES:
${eps.toUpperCase()} - ÁREA DE ATENCIÓN AL USUARIO Y PQRS
E. S. D.

ASUNTO: DERECHO DE PETICIÓN EN INTERÉS PARTICULAR (ART. 23 C.P. Y LEY 1755 DE 2015) - SOLICITUD DE PRESTACIÓN EFECTIVA DE SERVICIOS DE SALUD

Yo, [ESCRIBE AQUÍ TU NOMBRE COMPLETO], mayor de edad, identificado(a) con Cédula de Ciudadanía No. [NÚMERO DE CÉDULA], afiliado(a) a esta EPS en calidad de [COTIZANTE / BENEFICIARIO], en ejercicio del derecho fundamental de petición, me dirijo respetuosamente a ustedes con base en los siguientes:

I. HECHOS
1. Me encuentro afiliado(a) activo(a) a la EPS ${eps.toUpperCase()}.
2. El médico tratante adscrito a su red me formuló y prescribió: ${data.issueType.replace('_', ' ')}.
3. Pese a las gestiones realizadas, el servicio no ha sido prestado oportunamente, incurriendo en demoras injustificadas.
4. Descripción de la situación: ${data.caseDetails}.

II. FUNDAMENTOS DE DERECHO
Fundamento esta petición en el artículo 23 de la Constitución Política; el artículo 14 de la Ley 1755 de 2015; y los artículos 2, 6, 8 y 10 de la Ley Estatutaria de Salud (Ley 1751 de 2015), que prohíben a las EPS imponer trabas administrativas y exigen garantizar la integralidad y continuidad en la atención médica.

III. PETICIONES
1. Se autorice, programe y entregue de manera inmediata y sin más dilaciones el servicio/medicamento ordenado por el médico tratante.
2. Se me informe de manera clara y por escrito la fecha, lugar y prestador asignado para recibir dicho servicio.

IV. NOTIFICACIONES
Recibiré respuesta a esta petición en:
Correo electrónico: [TU CORREO ELECTRÓNICO]
Teléfono: [TU TELÉFONO]
Dirección física: [TU DIRECCIÓN]

Atentamente,

___________________________________
[ESCRIBE AQUÍ TU NOMBRE COMPLETO]
C.C. No. [NÚMERO DE CÉDULA]
`;
        }
    }
});
