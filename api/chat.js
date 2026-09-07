export default async function handler(req, res) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido. Usa POST.' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // Si no hay API key configurada en Vercel, respondemos para que el frontend use el motor local
    if (!apiKey) {
        return res.status(200).json({
            success: false,
            message: 'OPENROUTER_API_KEY no configurada. Usando motor normativo local.'
        });
    }

    try {
        const { issueType, epsName, hasOrder, priorClaim, urgencyLevel, caseDetails } = req.body || {};

        const promptUsuario = `
Analiza el siguiente caso de salud en Colombia:
- Problema reportado: ${issueType}
- EPS o entidad: ${epsName || 'No especificada'}
- ¿Tiene orden médica?: ${hasOrder}
- Reclamación previa ante la EPS: ${priorClaim}
- Nivel de urgencia / Sujeto de especial protección: ${urgencyLevel}
- Detalles del caso descritos por el usuario: ${caseDetails}

Genera un objeto JSON estricto con la siguiente estructura:
{
  "routeType": "TUTELA" o "SUPERSALUD" o "EPS",
  "routeTitle": "Título de la ruta jurídica determinada",
  "routeSummary": "Resumen claro de 1 o 2 oraciones explicando por qué se eligió esta ruta",
  "docType": "Borrador de Acción de Tutela / PQRD Supersalud / Derecho de Petición EPS",
  "analysisHtml": "<p>Explicación jurídica fundamentada en la Ley 1751 de 2015...</p>",
  "citations": [
    { "norma": "Nombre de la norma y artículo", "descripcion": "Breve explicación de por qué aplica" }
  ],
  "steps": [
    { "title": "Paso 1", "desc": "Descripción del paso" },
    { "title": "Paso 2", "desc": "Descripción del paso" },
    { "title": "Paso 3", "desc": "Descripción del paso" }
  ],
  "documentDraft": "Texto completo del borrador formal listo para radicar, con espacios [ENTRE CORCHETES] para los datos personales."
}
`;

        const systemPrompt = `Eres un asistente legal especializado en el Sistema de Salud Colombiano (RutaSalud).
Tus respuestas deben estar estrictamente basadas en:
- Ley Estatutaria 1751 de 2015 (derecho fundamental a la salud, integralidad, continuidad, prohibición de barreras administrativas).
- Artículos 49 y 86 de la Constitución Política de Colombia.
- Decreto 2591 de 1991 (reglamentario de la acción de tutela).
- Circular Única y lineamientos de PQRD de la Superintendencia Nacional de Salud.

Reglas éticas obligatorias:
1. No inventes diagnósticos médicos ni hechos no proporcionados por el usuario.
2. Cita siempre el artículo específico de la norma aplicable.
3. Si el caso presenta riesgo inminente a la vida o salud, o es sujeto de especial protección y ya hubo negativa, prioriza la Acción de Tutela con solicitud de medida provisional.
4. Si la EPS no ha respondido en los términos de ley, prioriza la PQRD ante la Superintendencia Nacional de Salud.
5. Si es una primera reclamación ordinaria sin riesgo inminente, prioriza el Derecho de Petición ante la EPS.
6. Tu respuesta debe ser ÚNICAMENTE un bloque de código JSON válido, sin texto adicional antes ni después.`;

        const modelToUse = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://rutasalud.vercel.app',
                'X-Title': 'RutaSalud Javeriana'
            },
            body: JSON.stringify({
                model: modelToUse,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: promptUsuario }
                ],
                temperature: 0.2
            })
        });

        if (!openRouterResponse.ok) {
            const errText = await openRouterResponse.text();
            console.error('Error desde OpenRouter:', errText);
            return res.status(200).json({ success: false, error: 'Error en OpenRouter' });
        }

        const data = await openRouterResponse.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Limpieza de formato markdown de código si viene con ```json ... ```
        const cleaned = content.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsedJson = JSON.parse(cleaned);

        return res.status(200).json({
            success: true,
            data: parsedJson
        });

    } catch (err) {
        console.error('Error procesando solicitud:', err);
        return res.status(200).json({
            success: false,
            message: 'Error al procesar con IA. Se activará el motor local.'
        });
    }
}
