// ============================================================
// EQUI LIBRIO
// JAVASCRIPT PRINCIPAL
// ============================================================


// ============================================================
// FILTRO DE CASOS
// ============================================================

const filterButtons = document.querySelectorAll(".filter-btn");
const caseCards = document.querySelectorAll(".case-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        caseCards.forEach(card => {

            const category = card.dataset.category;

            if (filter === "todos" || category === filter) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }

        });

    });

});


// ============================================================
// EVALUADOR DE PROPUESTAS DE CASOS
// ============================================================

const proposalButtons = document.querySelectorAll(".evaluate-proposal");

proposalButtons.forEach(button => {

    button.addEventListener("click", () => {

        const caseCard = button.closest(".case-card");

        if (!caseCard) return;

        const textarea = caseCard.querySelector(".case-proposal");
        const result = caseCard.querySelector(".proposal-result");

        if (!textarea || !result) return;

        const text = textarea.value.trim().toLowerCase();

        if (text.length < 20) {

            result.innerHTML = `
                <div class="proposal-warning">
                    ⚠️ Escribe una propuesta un poco más desarrollada
                    para poder evaluarla.
                </div>
            `;

            result.classList.add("show");

            return;
        }


        // ----------------------------------------------------
        // PALABRAS CLAVE
        // ----------------------------------------------------

        const positiveWords = [
            "dialogar",
            "escuchar",
            "respeto",
            "respetar",
            "igualdad",
            "justicia",
            "imparcial",
            "imparcialidad",
            "evidencia",
            "pruebas",
            "verificar",
            "investigar",
            "acuerdo",
            "acuerdos",
            "responsabilidad",
            "responsabilidades",
            "derechos",
            "privacidad",
            "orientador",
            "orientadora",
            "maestro",
            "maestra",
            "profesor",
            "profesora",
            "autoridades",
            "ayuda",
            "apoyo",
            "incluir",
            "inclusión",
            "participar",
            "solución",
            "dialogo",
            "comunicar"
        ];

        const negativeWords = [
            "golpear",
            "insultar",
            "humillar",
            "amenazar",
            "vengarse",
            "venganza",
            "excluir",
            "discriminar",
            "rumor",
            "rumores",
            "publicar",
            "exponer",
            "difundir",
            "ignorar",
            "obligar",
            "castigar",
            "culpar",
            "odio",
            "pelear",
            "agredir",
            "molestar",
            "burlarse"
        ];


        let positiveScore = 0;
        let negativeScore = 0;

        const foundPositive = [];
        const foundNegative = [];


        // ----------------------------------------------------
        // ANALIZAR PALABRAS
        // ----------------------------------------------------

        positiveWords.forEach(word => {

            if (text.includes(word)) {

                positiveScore++;

                if (!foundPositive.includes(word)) {
                    foundPositive.push(word);
                }

            }

        });


        negativeWords.forEach(word => {

            if (text.includes(word)) {

                negativeScore++;

                if (!foundNegative.includes(word)) {
                    foundNegative.push(word);
                }

            }

        });


        // ----------------------------------------------------
        // EVALUACIÓN BASE
        // ----------------------------------------------------

        let score = 50;


        // Palabras positivas
        score += positiveScore * 7;

        // Palabras negativas
        score -= negativeScore * 10;


        // ----------------------------------------------------
        // EXTENSIÓN DE LA RESPUESTA
        // ----------------------------------------------------

        if (text.length >= 80) {
            score += 5;
        }

        if (text.length >= 150) {
            score += 5;
        }


        // ----------------------------------------------------
        // ELEMENTOS IMPORTANTES
        // ----------------------------------------------------

        const hasReason =
            text.includes("porque") ||
            text.includes("para que") ||
            text.includes("ya que");

        const hasAction =
            text.includes("haría") ||
            text.includes("hacer") ||
            text.includes("hablar") ||
            text.includes("buscar") ||
            text.includes("pedir") ||
            text.includes("informar");

        if (hasReason) score += 5;

        if (hasAction) score += 5;


        // Limitar entre 0 y 100

        score = Math.max(0, Math.min(100, score));


        // ----------------------------------------------------
        // NIVEL
        // ----------------------------------------------------

        let level = "";
        let emoji = "";

        if (score >= 85) {

            level = "Excelente";
            emoji = "🌟";

        } else if (score >= 70) {

            level = "Muy buena";
            emoji = "🟢";

        } else if (score >= 50) {

            level = "Aceptable";
            emoji = "🟡";

        } else {

            level = "Por mejorar";
            emoji = "🔴";

        }


        // ----------------------------------------------------
        // RECOMENDACIONES
        // ----------------------------------------------------

        let recommendations = [];

        if (positiveScore === 0) {

            recommendations.push(
                "Intenta incluir una acción basada en el diálogo, respeto o igualdad."
            );

        }

        if (!hasReason) {

            recommendations.push(
                "Explica por qué consideras adecuada tu propuesta."
            );

        }

        if (!hasAction) {

            recommendations.push(
                "Indica claramente qué harías ante la situación."
            );

        }

        if (negativeScore > 0) {

            recommendations.push(
                "Evita soluciones basadas en agresiones, humillaciones, rumores o discriminación."
            );

        }

        if (recommendations.length === 0) {

            recommendations.push(
                "Tu propuesta contiene varios elementos relacionados con una solución responsable."
            );

        }


        // ----------------------------------------------------
        // MOSTRAR RESULTADO
        // ----------------------------------------------------

        result.innerHTML = `

            <div class="proposal-score">

                <div class="proposal-score-number">
                    ${emoji} ${score}/100
                </div>

                <h4>${level}</h4>

                <div class="proposal-meter">
                    <div class="proposal-meter-bar"
                         style="width:${score}%">
                    </div>
                </div>

            </div>


            <div class="proposal-analysis">

                <strong>🔎 Análisis de tu propuesta</strong>

                <p>
                    La evaluación toma en cuenta aspectos como
                    respeto, diálogo, igualdad, responsabilidad,
                    búsqueda de información y formas de resolver
                    el conflicto.
                </p>

                ${
                    foundPositive.length > 0
                    ?
                    `
                    <p class="positive-analysis">
                        ✓ Aspectos positivos detectados:
                        ${foundPositive.join(", ")}.
                    </p>
                    `
                    :
                    ""
                }

                ${
                    foundNegative.length > 0
                    ?
                    `
                    <p class="negative-analysis">
                        ⚠️ Aspectos que conviene revisar:
                        ${foundNegative.join(", ")}.
                    </p>
                    `
                    :
                    ""
                }

            </div>


            <div class="proposal-recommendations">

                <strong>💡 Para mejorar:</strong>

                <ul>
                    ${recommendations
                        .map(item => `<li>${item}</li>`)
                        .join("")}
                </ul>

            </div>

        `;

        result.classList.add("show");

    });

});


// ============================================================
// DINÁMICA: ¿QUÉ HARÍAS TÚ?
// ============================================================

const scenarios = [

    {
        question:
            "En un equipo escolar, una persona no quiere cumplir sus tareas y espera que los demás hagan todo.",

        options: [
            "Aceptar que los demás hagan todo.",
            "Dialogar y establecer responsabilidades equitativas.",
            "Excluir a esa persona sin escucharla."
        ],

        correct: 1,

        explanation:
            "El diálogo permite establecer acuerdos y distribuir el trabajo de forma justa."
    },

    {
        question:
            "Una estudiante informa sobre una conducta inapropiada, pero todavía no se han revisado los hechos.",

        options: [
            "Ignorar la situación.",
            "Difundir rumores sobre las personas involucradas.",
            "Atender la situación y revisar los hechos con imparcialidad."
        ],

        correct: 2,

        explanation:
            "Es importante escuchar, proteger la privacidad y respetar el debido proceso."
    },

    {
        question:
            "En clase, alguien dice que una profesión solamente corresponde a hombres o mujeres.",

        options: [
            "Recordar que las capacidades no dependen del género.",
            "Aceptar el estereotipo.",
            "Impedir que otras personas participen."
        ],

        correct: 0,

        explanation:
            "Las oportunidades deben estar abiertas a todas las personas."
    },

    {
        question:
            "Una persona comparte en redes una acusación que no ha verificado.",

        options: [
            "Compartirla para que más personas la vean.",
            "Verificar la información y evitar difundir rumores.",
            "Agregar comentarios ofensivos."
        ],

        correct: 1,

        explanation:
            "Verificar información ayuda a evitar daños y conclusiones precipitadas."
    },

    {
        question:
            "Dos personas tienen un conflicto y cada una presenta una versión diferente.",

        options: [
            "Elegir automáticamente a quien conocemos.",
            "Suponer que una persona miente por su género.",
            "Escuchar a ambas partes y revisar la información disponible."
        ],

        correct: 2,

        explanation:
            "La imparcialidad exige analizar los hechos sin prejuicios."
    }

];

let scenarioIndex = 0;
let activityScore = 0;
let activityAnswered = false;

const scenarioElement =
    document.getElementById("scenario");

const optionsElement =
    document.getElementById("activityOptions");

const feedbackElement =
    document.getElementById("activityFeedback");

const nextScenarioButton =
    document.getElementById("nextScenario");

const stepElement =
    document.getElementById("activityStep");

const activityScoreElement =
    document.getElementById("activityScore");

const activityProgressBar =
    document.getElementById("activityProgressBar");

const activityResult =
    document.getElementById("activityResult");


function loadScenario() {

    if (!scenarioElement) return;

    const current = scenarios[scenarioIndex];

    activityAnswered = false;

    stepElement.textContent =
        `SITUACIÓN ${scenarioIndex + 1} DE ${scenarios.length}`;

    activityScoreElement.textContent =
        `Puntos: ${activityScore}`;

    activityProgressBar.style.width =
        `${(scenarioIndex / scenarios.length) * 100}%`;

    scenarioElement.textContent =
        current.question;

    feedbackElement.textContent = "";

    nextScenarioButton.hidden = true;

    activityResult.hidden = true;

    scenarioElement.hidden = false;

    optionsElement.hidden = false;

    optionsElement.innerHTML = "";


    current.options.forEach((option, index) => {

        const button =
            document.createElement("button");

        button.className =
            "activity-option";

        button.textContent =
            option;

        button.addEventListener("click", () => {

            answerScenario(index);

        });

        optionsElement.appendChild(button);

    });

}


function answerScenario(selected) {

    if (activityAnswered) return;

    activityAnswered = true;

    const current =
        scenarios[scenarioIndex];

    const buttons =
        optionsElement.querySelectorAll("button");


    buttons.forEach((button, index) => {

        button.disabled = true;

        if (index === current.correct) {
            button.classList.add("correct");
        }

        if (
            index === selected &&
            selected !== current.correct
        ) {
            button.classList.add("incorrect");
        }

    });


    if (selected === current.correct) {

        activityScore++;

        feedbackElement.textContent =
            "✓ ¡Correcto! " +
            current.explanation;

    } else {

        feedbackElement.textContent =
            "La opción más adecuada está marcada en verde. " +
            current.explanation;
    }


    activityScoreElement.textContent =
        `Puntos: ${activityScore}`;

    nextScenarioButton.hidden = false;

    nextScenarioButton.textContent =
        scenarioIndex === scenarios.length - 1
            ? "Ver resultado"
            : "Siguiente situación →";

}


function showActivityResult() {

    scenarioElement.hidden = true;

    optionsElement.hidden = true;

    nextScenarioButton.hidden = true;

    feedbackElement.textContent = "";

    activityProgressBar.style.width = "100%";

    activityResult.hidden = false;


    document.getElementById(
        "activityFinalScore"
    ).textContent =
        `Obtuviste ${activityScore} de ${scenarios.length} puntos.`;


    let message;


    if (activityScore === 5) {

        message =
            "¡Excelente! Tus decisiones reflejan respeto, imparcialidad y responsabilidad.";

    } else if (activityScore >= 3) {

        message =
            "¡Buen trabajo! Puedes volver a practicar para reforzar tus decisiones.";

    } else {

        message =
            "Sigue aprendiendo. Recuerda escuchar, verificar información y evitar prejuicios.";

    }


    document.getElementById(
        "activityFinalMessage"
    ).textContent = message;

}


if (nextScenarioButton) {

    nextScenarioButton.addEventListener(
        "click",
        () => {

            if (
                scenarioIndex <
                scenarios.length - 1
            ) {

                scenarioIndex++;

                loadScenario();

            } else {

                showActivityResult();

            }

        }
    );

}


const restartActivity =
    document.getElementById("restartActivity");


if (restartActivity) {

    restartActivity.addEventListener(
        "click",
        () => {

            scenarioIndex = 0;

            activityScore = 0;

            loadScenario();

        }
    );

}


loadScenario();


// ============================================================
// EJERCICIO 1: VERDADERO O FALSO
// ============================================================

document.querySelectorAll(".tf-button")
.forEach(button => {

    button.addEventListener("click", () => {

        const isCorrect =
            button.dataset.correct === "true";

        const target =
            document.getElementById(
                button.dataset.target
            );


        if (isCorrect) {

            target.textContent =
                "✓ ¡Correcto! La igualdad contempla derechos, oportunidades y responsabilidades.";

            target.style.color =
                "#238653";

        } else {

            target.textContent =
                "No exactamente. La afirmación es verdadera: los derechos también implican responsabilidades.";

            target.style.color =
                "#b34c4c";
        }

    });

});


// ============================================================
// EJERCICIO 2: SELECCIÓN
// ============================================================

const checkSelect =
    document.getElementById("checkSelect");


if (checkSelect) {

    checkSelect.addEventListener("click", () => {

        const answer =
            document.getElementById(
                "exerciseSelect"
            ).value;

        const feedback =
            document.getElementById(
                "exercise2"
            );


        if (answer === "igualdad") {

            feedback.textContent =
                "✓ ¡Muy bien! Es igualdad de oportunidades.";

            feedback.style.color =
                "#238653";

        } else if (answer === "") {

            feedback.textContent =
                "Selecciona una opción antes de comprobar.";

            feedback.style.color =
                "#b34c4c";

        } else {

            feedback.textContent =
                "Inténtalo de nuevo. Piensa en el derecho de todas las personas a participar.";

            feedback.style.color =
                "#b34c4c";
        }

    });

}


// ============================================================
// EJERCICIO 3: ORDEN
// ============================================================

const checkOrder =
    document.getElementById("checkOrder");


if (checkOrder) {

    checkOrder.addEventListener("click", () => {

        const answer =
            document.getElementById(
                "orderSelect"
            ).value;

        const feedback =
            document.getElementById(
                "exercise4"
            );


        if (answer === "a") {

            feedback.textContent =
                "✓ Correcto. Escuchar, revisar los hechos y actuar de manera imparcial es un orden razonable.";

            feedback.style.color =
                "#238653";

        } else if (answer === "") {

            feedback.textContent =
                "Selecciona una respuesta.";

            feedback.style.color =
                "#b34c4c";

        } else {

            feedback.textContent =
                "No es el orden adecuado. Primero se debe escuchar y revisar la información.";

            feedback.style.color =
                "#b34c4c";
        }

    });

}


// ============================================================
// EJERCICIO 4: REFLEXIÓN
// ============================================================

const checkReflection =
    document.getElementById(
        "checkReflection"
    );


if (checkReflection) {

    checkReflection.addEventListener(
        "click",
        () => {

            const answer =
                document.getElementById(
                    "reflection"
                ).value.trim();

            const feedback =
                document.getElementById(
                    "exercise3"
                );


            if (answer.length < 20) {

                feedback.textContent =
                    "Escribe una respuesta un poco más desarrollada.";

                feedback.style.color =
                    "#b34c4c";

                return;
            }


            feedback.textContent =
                "✓ Reflexión registrada. Una respuesta completa puede mencionar imparcialidad, evidencia, derecho a ser escuchado y respeto.";

            feedback.style.color =
                "#238653";

        }
    );

}


// ============================================================
// NOTAS Y EXPERIENCIAS
// ============================================================

const notesForm =
    document.getElementById("notesForm");

const noteInput =
    document.getElementById("noteInput");

const notesList =
    document.getElementById("notesList");

const emptyNotes =
    document.getElementById("emptyNotes");

const clearNotes =
    document.getElementById("clearNotes");


// Recuperar notas

let savedNotes =
    JSON.parse(
        localStorage.getItem("equiLibrioNotes")
    ) || [];


// Mostrar notas

function renderNotes() {

    if (!notesList) return;

    notesList.innerHTML = "";


    if (savedNotes.length === 0) {

        if (emptyNotes) {
            emptyNotes.hidden = false;
        }

        return;

    }


    if (emptyNotes) {
        emptyNotes.hidden = true;
    }


    savedNotes.forEach((note, index) => {

        const article =
            document.createElement("article");

        article.className =
            "saved-note";


        article.innerHTML = `

            <div class="note-header">

                <strong>
                    📝 Mi experiencia
                </strong>

                <span>
                    ${note.date}
                </span>

            </div>

            <p>
                ${escapeHTML(note.text)}
            </p>

            <button
                class="delete-note"
                data-index="${index}">
                🗑️ Eliminar
            </button>

        `;


        notesList.appendChild(article);

    });


    // Botones eliminar

    document
        .querySelectorAll(".delete-note")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    savedNotes.splice(
                        index,
                        1
                    );

                    localStorage.setItem(
                        "equiLibrioNotes",
                        JSON.stringify(
                            savedNotes
                        )
                    );

                    renderNotes();

                }
            );

        });

}


// Evitar insertar HTML escrito por el usuario

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Guardar nueva nota

if (notesForm) {

    notesForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const text =
                noteInput.value.trim();


            if (text.length < 5) {

                alert(
                    "Escribe una experiencia o reflexión un poco más completa."
                );

                return;

            }


            const newNote = {

                text: text,

                date:
                    new Date().toLocaleDateString(
                        "es-MX",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    )

            };


            savedNotes.unshift(
                newNote
            );


            localStorage.setItem(
                "equiLibrioNotes",
                JSON.stringify(
                    savedNotes
                )
            );


            noteInput.value = "";

            renderNotes();

        }
    );

}


// Borrar todas las notas

if (clearNotes) {

    clearNotes.addEventListener(
        "click",
        () => {

            if (
                savedNotes.length === 0
            ) {

                return;

            }


            const confirmDelete =
                confirm(
                    "¿Seguro que quieres eliminar todas tus notas?"
                );


            if (confirmDelete) {

                savedNotes = [];

                localStorage.removeItem(
                    "equiLibrioNotes"
                );

                renderNotes();

            }

        }
    );

}


renderNotes();


// ============================================================
// QUIZ DE 10 PREGUNTAS
// ============================================================

const questions = [

    {
        question:
            "¿Qué busca la igualdad de género?",

        answers: [
            "Que un género tenga más derechos.",
            "Que todas las personas tengan derechos y oportunidades.",
            "Que todas las personas sean idénticas."
        ],

        correct: 1,

        explanation:
            "La igualdad reconoce la misma dignidad y derechos, respetando las diferencias individuales."
    },


    {
        question:
            "¿Qué debe hacerse ante una denuncia?",

        answers: [
            "Ignorarla.",
            "Difundirla en redes sociales.",
            "Atenderla y revisar los hechos con imparcialidad."
        ],

        correct: 2,

        explanation:
            "Se debe atender con seriedad, cuidar la privacidad y respetar los procedimientos."
    },


    {
        question:
            "¿Qué significa compartir responsabilidades?",

        answers: [
            "Distribuir las tareas de forma justa.",
            "Que una persona haga todo.",
            "Asignar tareas según estereotipos."
        ],

        correct: 0,

        explanation:
            "La corresponsabilidad implica colaborar y cumplir acuerdos."
    },


    {
        question:
            "¿Cuál es un ejemplo de estereotipo?",

        answers: [
            "Todas las personas pueden estudiar tecnología.",
            "Los hombres no deben participar en actividades artísticas.",
            "Todas las opiniones deben escucharse."
        ],

        correct: 1,

        explanation:
            "Los estereotipos limitan intereses y capacidades por el género."
    },


    {
        question:
            "¿Qué significa debido proceso?",

        answers: [
            "Determinar responsabilidades sin escuchar.",
            "Aceptar cualquier rumor.",
            "Revisar los hechos y respetar los derechos de las partes."
        ],

        correct: 2,

        explanation:
            "Implica procedimientos justos y garantías para las personas involucradas."
    },


    {
        question:
            "¿Cuál acción favorece la igualdad?",

        answers: [
            "Resolver conflictos con diálogo y respeto.",
            "Excluir a alguien por su género.",
            "Suponer que alguien miente por su género."
        ],

        correct: 0,

        explanation:
            "La igualdad requiere evitar prejuicios y analizar cada situación."
    },


    {
        question:
            "¿Una experiencia individual representa a todo un género?",

        answers: [
            "Sí, siempre.",
            "No, cada caso debe analizarse individualmente.",
            "Solamente si se comparte en redes."
        ],

        correct: 1,

        explanation:
            "Generalizar puede producir prejuicios y conclusiones incorrectas."
    },


    {
        question:
            "¿Qué debe hacerse antes de compartir una acusación en internet?",

        answers: [
            "Agregar comentarios ofensivos.",
            "Compartirla rápidamente.",
            "Verificar la información y cuidar la privacidad."
        ],

        correct: 2,

        explanation:
            "Verificar evita difundir información falsa y causar daños."
    },


    {
        question:
            "¿Cuál es una responsabilidad en una relación?",

        answers: [
            "Respetar límites y decisiones.",
            "Controlar el teléfono de la otra persona.",
            "Imponer decisiones."
        ],

        correct: 0,

        explanation:
            "El respeto y los límites son importantes en cualquier relación."
    },


    {
        question:
            "¿Qué principio debe orientar la aplicación de normas?",

        answers: [
            "Los prejuicios personales.",
            "La imparcialidad y el respeto a los derechos.",
            "La popularidad de las personas involucradas."
        ],

        correct: 1,

        explanation:
            "Las decisiones deben basarse en procedimientos y criterios justos."
    }

];


let questionIndex = 0;
let score = 0;
let quizAnswered = false;


const questionElement =
    document.getElementById("question");

const answersElement =
    document.getElementById("answers");

const questionNumber =
    document.getElementById("questionNumber");

const scoreLabel =
    document.getElementById("scoreLabel");

const quizFeedback =
    document.getElementById("quizFeedback");

const nextQuestionButton =
    document.getElementById("nextQuestion");

const quizProgress =
    document.getElementById("quizProgress");

const quizResult =
    document.getElementById("quizResult");


function loadQuestion() {

    if (!questionElement) return;

    const current =
        questions[questionIndex];

    quizAnswered = false;

    questionElement.textContent =
        current.question;

    questionNumber.textContent =
        `Pregunta ${questionIndex + 1} de ${questions.length}`;

    scoreLabel.textContent =
        `Puntos: ${score}`;

    quizProgress.style.width =
        `${(questionIndex / questions.length) * 100}%`;

    quizFeedback.textContent = "";

    nextQuestionButton.hidden = true;

    quizResult.hidden = true;

    questionElement.hidden = false;

    answersElement.hidden = false;

    answersElement.innerHTML = "";


    current.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement("button");

            button.className =
                "answer-option";

            button.textContent =
                answer;

            button.addEventListener(
                "click",
                () => {

                    selectAnswer(index);

                }
            );

            answersElement.appendChild(
                button
            );

        }
    );

}


function selectAnswer(selected) {

    if (quizAnswered) return;

    quizAnswered = true;

    const current =
        questions[questionIndex];

    const buttons =
        answersElement.querySelectorAll(
            "button"
        );


    buttons.forEach(
        (button, index) => {

            button.disabled = true;

            if (
                index === current.correct
            ) {

                button.classList.add(
                    "correct"
                );

            }

            if (
                index === selected &&
                selected !== current.correct
            ) {

                button.classList.add(
                    "incorrect"
                );

            }

        }
    );


    if (
        selected === current.correct
    ) {

        score++;

        quizFeedback.textContent =
            "✓ ¡Correcto! " +
            current.explanation;

    } else {

        quizFeedback.textContent =
            "Respuesta correcta: " +
            current.answers[
                current.correct
            ] +
            ". " +
            current.explanation;

    }


    scoreLabel.textContent =
        `Puntos: ${score}`;

    nextQuestionButton.hidden = false;

    nextQuestionButton.textContent =
        questionIndex ===
        questions.length - 1
            ? "Ver resultado"
            : "Siguiente pregunta →";

}


function showQuizResult() {

    questionElement.hidden = true;

    answersElement.hidden = true;

    nextQuestionButton.hidden = true;

    quizFeedback.textContent = "";

    quizProgress.style.width = "100%";

    quizResult.hidden = false;


    document.getElementById(
        "finalScore"
    ).textContent =
        `Obtuviste ${score} de ${questions.length} respuestas correctas.`;


    document.getElementById(
        "resultMeterBar"
    ).style.width =
        `${(score / questions.length) * 100}%`;


    let message;


    if (score === 10) {

        message =
            "¡Excelente! Comprendiste los principios de igualdad, respeto y justicia.";

    } else if (score >= 7) {

        message =
            "¡Muy buen trabajo! Tienes una buena comprensión del tema.";

    } else if (score >= 5) {

        message =
            "Vas por buen camino. Repasa los conceptos y vuelve a intentarlo.";

    } else {

        message =
            "Sigue practicando. Aprender a analizar situaciones con respeto requiere reflexión.";

    }


    document.getElementById(
        "resultMessage"
    ).textContent =
        message;


    // Mensaje especial para compartir

    const shareMessage =
        document.getElementById(
            "quizShareMessage"
        );


    if (shareMessage) {

        shareMessage.textContent =
            `Obtuve ${score}/10 en EQUI LIBRIO. La igualdad no es competir, es tener las mismas oportunidades. ¿Cuánto sacas tú?`;

    }

}


if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        () => {

            if (
                questionIndex <
                questions.length - 1
            ) {

                questionIndex++;

                loadQuestion();

            } else {

                showQuizResult();

            }

        }
    );

}


const restartQuiz =
    document.getElementById(
        "restartQuiz"
    );


if (restartQuiz) {

    restartQuiz.addEventListener(
        "click",
        () => {

            questionIndex = 0;

            score = 0;

            loadQuestion();

        }
    );

}


loadQuestion();



// ============================================================
// MEJORAS V2
// INTERACCIÓN, AYUDA, MITOS Y REALIDADES, SEMÁFORO, COMPROMISO
// ============================================================

(function () {

    "use strict";

    const $ = (selector, ctx = document) => ctx.querySelector(selector);
    const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const safe = text => {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    };


    // --------------------------------------------------------
    // AVISOS (TOAST)
    // --------------------------------------------------------

    const toastEl = $("#toast");
    let toastTimer;

    function toast(message) {

        if (!toastEl) return;

        toastEl.textContent = message;
        toastEl.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toastEl.classList.remove("show");
        }, 2400);

    }


    // --------------------------------------------------------
    // CONFETI
    // --------------------------------------------------------

    const confettiCanvas = $("#confetti");
    const confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;

    let confettiParts = [];
    let confettiFrame = null;

    function resizeConfetti() {

        if (!confettiCanvas) return;

        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

    }

    resizeConfetti();
    window.addEventListener("resize", resizeConfetti);

    function confettiLoop() {

        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confettiParts.forEach(p => {

            p.vy += 0.35;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.99;
            p.rot += p.vr;
            p.life++;

            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate(p.rot);
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
            confettiCtx.restore();

        });

        confettiParts = confettiParts.filter(
            p => p.y < confettiCanvas.height + 20 && p.life < 260
        );

        if (confettiParts.length) {
            confettiFrame = requestAnimationFrame(confettiLoop);
        } else {
            confettiFrame = null;
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }

    }

    function confetti(amount = 140) {

        if (reduceMotion || !confettiCtx) return;

        const colors = ["#7654e8", "#f16ca6", "#55a9ed", "#ffad65", "#4930a7"];

        for (let i = 0; i < amount; i++) {

            confettiParts.push({
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 240,
                y: window.innerHeight * 0.65,
                vx: (Math.random() - 0.5) * 15,
                vy: -Math.random() * 16 - 4,
                size: Math.random() * 8 + 5,
                color: colors[i % colors.length],
                rot: Math.random() * 6,
                vr: (Math.random() - 0.5) * 0.3,
                life: 0
            });

        }

        if (!confettiFrame) confettiLoop();

    }

    // Confeti cuando el quiz o la dinámica terminan con buen resultado

    function watchResult(id, isGood) {

        const element = document.getElementById(id);

        if (!element) return;

        new MutationObserver(() => {

            if (!element.hidden && isGood()) {
                confetti();
            }

        }).observe(element, { attributes: true, attributeFilter: ["hidden"] });

    }

    watchResult("quizResult", () => typeof score !== "undefined" && score >= 7);
    watchResult("activityResult", () => typeof activityScore !== "undefined" && activityScore >= 3);


    // --------------------------------------------------------
    // PROGRESO DE LECTURA, MENÚ ACTIVO Y BOTÓN PARA SUBIR
    // --------------------------------------------------------

    const progressBar = $("#scrollProgress");
    const navbar = $(".navbar");
    const backTop = $("#backToTop");

    function onScroll() {

        const root = document.documentElement;
        const max = root.scrollHeight - root.clientHeight;

        if (progressBar) {
            progressBar.style.width = (max > 0 ? (root.scrollTop / max) * 100 : 0) + "%";
        }

        if (navbar) navbar.classList.toggle("scrolled", root.scrollTop > 10);
        if (backTop) backTop.classList.toggle("show", root.scrollTop > 600);

    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backTop) {
        backTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const navLinks = $$(".nav-links a");
    const linkById = new Map(
        navLinks.map(a => [a.getAttribute("href").slice(1), a])
    );

    const spy = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            navLinks.forEach(l => l.classList.remove("active"));

            const link = linkById.get(entry.target.id);

            if (link) {
                link.classList.add("active");

                // En pantallas pequeñas, mantiene visible el enlace activo
                link.scrollIntoView({ block: "nearest", inline: "center" });
            }

        });

    }, { rootMargin: "-45% 0px -50% 0px" });

    linkById.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) spy.observe(section);
    });


    // --------------------------------------------------------
    // APARICIÓN AL HACER SCROLL
    // --------------------------------------------------------

    const revealSelector = [
        ".section-heading", ".info-card", ".law-banner", ".law-card",
        ".notice", ".case-card", ".case-summary", ".school-content",
        ".school-image", ".exercise-card", ".activity-intro",
        ".activity-box", ".quiz-card", ".notes-form", ".notes-saved",
        ".stat", ".urgent-card", ".help-card", ".route-wrap", ".safety-bar",
        ".sem-card", ".sem-check", ".pledge-card", ".closing-content",
        ".myth-toggle"
    ].join(",");

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");

            setTimeout(() => entry.target.classList.add("done"), 900);

            observer.unobserve(entry.target);

            if (entry.target.classList.contains("stat")) {
                countUp($("strong", entry.target));
            }

        });

    }, { threshold: 0.12 });

    $$(revealSelector).forEach(element => {

        element.classList.add("reveal");

        const index = Array.from(element.parentElement.children).indexOf(element);

        element.style.setProperty("--d", Math.min(index, 5) * 0.08 + "s");

        if (reduceMotion) {
            element.classList.add("visible", "done");
            if (element.classList.contains("stat")) countUp($("strong", element));
        } else {
            revealObserver.observe(element);
        }

    });


    // --------------------------------------------------------
    // CONTADORES ANIMADOS
    // --------------------------------------------------------

    function countUp(element) {

        if (!element) return;

        const target = Number(element.dataset.count) || 0;
        const duration = reduceMotion ? 1 : 1400;
        const start = performance.now();

        function step(now) {

            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            element.textContent = Math.round(target * eased);

            if (progress < 1) requestAnimationFrame(step);

        }

        requestAnimationFrame(step);

    }


    // --------------------------------------------------------
    // PORTADA: PARALLAX Y PALABRA ROTATIVA
    // --------------------------------------------------------

    const hero = $(".hero");

    if (hero && !reduceMotion && window.matchMedia("(hover: hover)").matches) {

        const heroImage = $(".hero-image", hero);

        hero.addEventListener("mousemove", event => {

            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            $$(".hero-orb", hero).forEach((orb, i) => {
                const k = (i + 1) * 30;
                orb.style.transform = `translate(${x * k}px, ${y * k}px)`;
            });

            if (heroImage) {
                heroImage.style.transform =
                    `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
            }

        });

        hero.addEventListener("mouseleave", () => {

            $$(".hero-orb", hero).forEach(orb => {
                orb.style.transform = "";
            });

            if (heroImage) heroImage.style.transform = "";

        });

    }

    const rotator = $("#rotator");

    if (rotator && !reduceMotion) {

        const words = ["respeto", "equidad", "justicia", "dignidad", "diálogo", "inclusión"];
        let wordIndex = 0;

        setInterval(() => {

            rotator.classList.add("swap");

            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                rotator.textContent = words[wordIndex];
                rotator.classList.remove("swap");
            }, 300);

        }, 2300);

    }


    // --------------------------------------------------------
    // INCLINACIÓN 3D EN TARJETAS
    // --------------------------------------------------------

    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {

        $$(".info-card, .law-card, .sem-card").forEach(card => {

            card.addEventListener("mousemove", event => {

                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                card.style.transform =
                    `perspective(800px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-6px)`;

            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });

        });

    }


    // --------------------------------------------------------
    // EFECTO DE ONDA EN BOTONES
    // --------------------------------------------------------

    document.addEventListener("click", event => {

        const button = event.target.closest(
            ".btn, .toggle-btn, .filter-btn, .help-tab, .route-btn, .answer-option"
        );

        if (!button || reduceMotion) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const wave = document.createElement("span");

        wave.className = "ripple";
        wave.style.cssText =
            `width:${size}px;height:${size}px;` +
            `left:${event.clientX - rect.left - size / 2}px;` +
            `top:${event.clientY - rect.top - size / 2}px;`;

        button.appendChild(wave);

        setTimeout(() => wave.remove(), 600);

    });


    // --------------------------------------------------------
    // MITOS Y REALIDADES
    // --------------------------------------------------------

    const MYTHS = [

        {
            m: "Solo un género puede sufrir injusticias.",
            t: "Cualquier persona puede ser víctima",
            d: "Cualquier persona puede experimentar discriminación, trato injusto o violencia. Reconocerlo no le quita importancia a las desigualdades que afectan más a ciertos grupos."
        },
        {
            m: "Escuchar a una persona significa creer todo sin revisar.",
            t: "Escuchar y verificar van juntos",
            d: "Escuchar con respeto y analizar la evidencia pueden coexistir: cada denuncia se toma en serio y se investiga con imparcialidad."
        },
        {
            m: "La igualdad elimina las diferencias.",
            t: "Igualdad no es uniformidad",
            d: "Reconoce la diversidad y busca que las diferencias no sean motivo de discriminación ni de pérdida de oportunidades."
        },
        {
            m: "Tener derechos significa no tener obligaciones.",
            t: "Derechos y responsabilidades van juntos",
            d: "La convivencia requiere respetar los derechos de los demás y cumplir los acuerdos."
        },
        {
            m: "Solo es violencia si hay golpes.",
            t: "La violencia tiene muchas formas",
            d: "También puede ser psicológica, sexual, económica, patrimonial o digital: humillar, controlar, aislar o amenazar también es violencia."
        },
        {
            m: "Los celos y el control son pruebas de amor.",
            t: "Controlar no es cuidar",
            d: "Revisar el teléfono, vigilar o prohibir amistades son señales de alerta. El amor sano se basa en confianza y respeto a los límites."
        },
        {
            m: "La igualdad de género es cosa de mujeres.",
            t: "La igualdad nos involucra a todas las personas",
            d: "Beneficia a toda la sociedad: permite compartir las tareas de cuidado, expresar emociones sin estigma y ampliar oportunidades para todos."
        },
        {
            m: "Ya hay igualdad porque la ley lo establece.",
            t: "Igualdad en la ley no siempre es igualdad en la práctica",
            d: "Aunque las leyes reconocen la igualdad, aún existen brechas, estereotipos y violencia que requieren acciones cotidianas para cambiar."
        },
        {
            m: "Si alguien no denuncia, es que no pasó nada.",
            t: "Callar no significa que no haya ocurrido",
            d: "Muchas personas no denuncian por miedo, vergüenza, dependencia o desconfianza. Escuchar sin juzgar facilita que pidan ayuda."
        },
        {
            m: "Los estereotipos son solo bromas inofensivas.",
            t: "Los estereotipos sí tienen consecuencias",
            d: "Frases como «eso es de hombres» o «eso es de mujeres» limitan intereses, oportunidades y la confianza de las personas."
        },
        {
            m: "Si alguien vive violencia, se puede ir cuando quiera.",
            t: "Salir no siempre es tan fácil",
            d: "El miedo, las amenazas, la dependencia económica o emocional y la falta de apoyo dificultan salir. Culpar a la víctima no ayuda; acompañar sí."
        },
        {
            m: "Denunciar es exagerar o hacer drama.",
            t: "Denunciar es un derecho",
            d: "Pedir ayuda o denunciar permite que los hechos se investiguen con debido proceso, protegiendo tanto a quien denuncia como a las personas señaladas."
        },
        {
            m: "Compartir fotos íntimas sin permiso es solo una broma.",
            t: "Es violencia digital",
            d: "Difundir contenido íntimo sin consentimiento causa daño real. En México existen reformas conocidas como Ley Olimpia que lo sancionan."
        },
        {
            m: "Los hombres no deben pedir ayuda ni mostrar emociones.",
            t: "Pedir ayuda es una muestra de fortaleza",
            d: "Los estereotipos de género también afectan a los hombres. Expresar emociones y buscar apoyo mejora la salud y las relaciones."
        }

    ];

    const mythGrid = $("#mythGrid");
    const mythToggle = $("#mythToggle");
    const mythCount = $("#mythCount");

    let mythMode = "mitos";

    function mythFace(item, index, side) {

        const number = String(index + 1).padStart(2, "0");

        if (side === "mitos") {
            return `
                <span class="myth-label">✕ MITO ${number}</span>
                <h3>“${safe(item.m)}”</h3>
                <p class="myth-hint">Toca para descubrir la realidad ↻</p>
            `;
        }

        return `
            <span class="myth-label">✓ REALIDAD ${number}</span>
            <h3>${safe(item.t)}</h3>
            <p>${safe(item.d)}</p>
            <p class="myth-hint">Toca para ver el mito que desmiente ↻</p>
        `;

    }

    function setFace(card, side) {

        const index = Number(card.dataset.index);

        card.dataset.side = side;
        card.className = "myth-card " + (side === "mitos" ? "is-myth" : "is-reality");
        card.innerHTML = mythFace(MYTHS[index], index, side);

    }

    function flipCard(card) {

        const next = card.dataset.side === "mitos" ? "realidades" : "mitos";

        if (reduceMotion) {
            setFace(card, next);
            return;
        }

        card.classList.add("flipping");

        setTimeout(() => {
            setFace(card, next);
            card.style.animation = "none";
        }, 190);

    }

    function renderMyths() {

        if (!mythGrid) return;

        mythGrid.innerHTML = "";

        MYTHS.forEach((item, index) => {

            const card = document.createElement("article");

            card.dataset.index = index;
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.style.setProperty("--i", index);

            setFace(card, mythMode);

            mythGrid.appendChild(card);

        });

        if (mythCount) {
            mythCount.textContent =
                `Mostrando ${MYTHS.length} ` +
                (mythMode === "mitos" ? "mitos" : "realidades") +
                " · toca una tarjeta para voltearla";
        }

    }

    if (mythGrid) {

        mythGrid.addEventListener("click", event => {

            const card = event.target.closest(".myth-card");

            if (card) flipCard(card);

        });

        mythGrid.addEventListener("keydown", event => {

            if (event.key !== "Enter" && event.key !== " ") return;

            const card = event.target.closest(".myth-card");

            if (!card) return;

            event.preventDefault();
            flipCard(card);

        });

    }

    if (mythToggle) {

        $$(".toggle-btn", mythToggle).forEach(button => {

            button.addEventListener("click", () => {

                if (button.dataset.mode === mythMode) return;

                mythMode = button.dataset.mode;

                mythToggle.dataset.mode = mythMode;

                $$(".toggle-btn", mythToggle).forEach(b => {
                    const active = b === button;
                    b.classList.toggle("active", active);
                    b.setAttribute("aria-pressed", active);
                });

                renderMyths();

            });

        });

    }

    renderMyths();

    const statMyths = $("#statMyths");
    if (statMyths) statMyths.dataset.count = MYTHS.length;


    // --------------------------------------------------------
    // LÍNEAS DE AYUDA: FILTROS, COPIAR Y SALIDA RÁPIDA
    // --------------------------------------------------------

    const statHelp = $("#statHelp");

    if (statHelp) {
        statHelp.dataset.count = $$(".urgent-card, .help-call").length;
    }

    $$(".help-tab").forEach(tab => {

        tab.addEventListener("click", () => {

            const filter = tab.dataset.filter;

            $$(".help-tab").forEach(t => t.classList.toggle("active", t === tab));

            $$(".help-card").forEach(card => {

                const tags = card.dataset.tags.split(" ");

                card.classList.toggle(
                    "hide",
                    filter !== "todas" && !tags.includes(filter)
                );

            });

        });

    });

    function copyText(text) {

        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise((resolve, reject) => {

            const area = document.createElement("textarea");

            area.value = text;
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();

            try {
                document.execCommand("copy") ? resolve() : reject();
            } catch (error) {
                reject(error);
            }

            area.remove();

        });

    }

    document.addEventListener("click", event => {

        const button = event.target.closest(".copy-btn");

        if (!button) return;

        copyText(button.dataset.copy)
            .then(() => toast("Número copiado: " + button.dataset.copy))
            .catch(() => toast("No se pudo copiar. Selecciona el número manualmente."));

    });

    function quickExit() {
        window.location.replace("https://www.google.com.mx");
    }

    const quickExitButton = $("#quickExit");

    if (quickExitButton) quickExitButton.addEventListener("click", quickExit);

    let lastEscape = 0;

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        const now = Date.now();

        if (now - lastEscape < 800) quickExit();

        lastEscape = now;

    });


    // --------------------------------------------------------
    // RUTAS DE ACCIÓN
    // --------------------------------------------------------

    const ROUTES = {

        peligro: {
            title: "Estoy en peligro ahora",
            steps: [
                "Si puedes hacerlo con seguridad, aléjate del riesgo y ve a un lugar con gente: una tienda, casa de vecinos o un lugar con vigilancia.",
                "Llama al <a href='tel:911'>911</a>. Da tu ubicación o referencias. Si no puedes hablar, no cuelgues y mantén la línea abierta.",
                "Si eres mujer y vives violencia, también puedes marcar al <a href='tel:079'>079, opción 1</a> (Línea de las Mujeres).",
                "Avisa a una persona de confianza para que te acompañe o sepa dónde estás.",
                "Cuando estés a salvo, busca atención médica si la necesitas y conserva mensajes, fotos y registros como evidencia. No los borres."
            ]
        },

        violencia: {
            title: "Viví o vi violencia o acoso",
            steps: [
                "Reconoce lo ocurrido: lo que viviste importa y no es tu culpa.",
                "Habla con una persona de confianza: familia, amistades, docente o tutor.",
                "Guarda evidencias: capturas de pantalla, fechas, lugares, nombres de testigos. Respáldalas fuera de dispositivos que otra persona pueda revisar.",
                "Pide orientación gratuita y confidencial: <a href='tel:079'>079, opción 1</a>, la <a href='tel:8007152000'>CNDH</a> o el Centro de Justicia para las Mujeres.",
                "Si deseas denunciar, acude al Ministerio Público. Puedes ir acompañada o acompañado y pedir que se registre tu declaración.",
                "En tu escuela, reporta por escrito y solicita medidas de protección. Pide que se escuche a todas las partes con imparcialidad."
            ]
        },

        discriminacion: {
            title: "Me discriminaron o trataron injustamente",
            steps: [
                "Anota qué ocurrió, cuándo, dónde, quién participó y si hubo testigos.",
                "Reúne pruebas: mensajes, correos, fotografías, documentos o grabaciones permitidas.",
                "Si ocurrió en la escuela o el trabajo, presenta una queja por escrito ante la instancia correspondiente y conserva el acuse.",
                "Pide orientación a <a href='tel:8005430033'>CONAPRED</a> y, si la conducta fue de una autoridad, a la <a href='tel:8007152000'>CNDH</a>.",
                "Si fue en tu trabajo o prácticas, solicita asesoría gratuita a <a href='tel:8009117877'>PROFEDET</a>.",
                "Cuida tu bienestar emocional: habla con alguien de confianza o con la <a href='tel:8009112000'>Línea de la Vida</a>."
            ]
        },

        ayudar: {
            title: "Quiero ayudar a alguien",
            steps: [
                "Escucha con calma y sin juzgar. Evita preguntas como “¿por qué no te fuiste?”.",
                "Respeta su ritmo y sus decisiones. No difundas lo que te contó ni lo publiques.",
                "Comparte información sobre las líneas de ayuda y ofrece acompañarle si lo desea.",
                "Si hay peligro inmediato, llama al <a href='tel:911'>911</a>.",
                "Cuida también tu seguridad y tu bienestar: puedes pedir orientación para ti en el <a href='tel:079'>079</a> o con una persona profesional."
            ]
        }

    };

    const routeTitle = $("#routeTitle");
    const routeSteps = $("#routeSteps");
    const routeCount = $("#routeCount");
    const routeBar = $("#routeBar");

    function updateRouteProgress() {

        if (!routeSteps) return;

        const total = $$(".route-step", routeSteps).length;
        const done = $$(".route-step.done", routeSteps).length;

        routeCount.textContent = `${done} de ${total} pasos`;
        routeBar.style.width = total ? (done / total) * 100 + "%" : "0";

        if (done === total && total > 0) {
            toast("¡Completaste esta ruta! Cuidarte es lo más importante 💜");
        }

    }

    function showRoute(key) {

        const route = ROUTES[key];

        if (!route || !routeSteps) return;

        routeTitle.textContent = route.title;

        routeSteps.innerHTML = route.steps.map((step, i) => `
            <li class="route-step" style="--i:${i}" tabindex="0">
                <span class="step-num">${i + 1}</span>
                <span class="step-text">${step}</span>
            </li>
        `).join("");

        updateRouteProgress();

    }

    $$(".route-btn").forEach(button => {

        button.addEventListener("click", () => {

            $$(".route-btn").forEach(b => b.classList.toggle("active", b === button));

            showRoute(button.dataset.route);

        });

    });

    if (routeSteps) {

        routeSteps.addEventListener("click", event => {

            if (event.target.closest("a")) return;

            const step = event.target.closest(".route-step");

            if (!step) return;

            step.classList.toggle("done");

            updateRouteProgress();

        });

        routeSteps.addEventListener("keydown", event => {

            if (event.key !== "Enter" && event.key !== " ") return;

            const step = event.target.closest(".route-step");

            if (!step) return;

            event.preventDefault();

            step.classList.toggle("done");

            updateRouteProgress();

        });

    }

    showRoute("peligro");


    // --------------------------------------------------------
    // SEMÁFORO DE RELACIONES
    // --------------------------------------------------------

    $$(".sem-card").forEach(card => {

        function toggleCard() {

            const open = card.classList.toggle("open");

            card.setAttribute("aria-expanded", open);

        }

        card.addEventListener("click", toggleCard);

        card.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleCard();
            }

        });

    });

    const semItems = $$("#semItems input");
    const semResult = $("#semResult");

    function evaluateSemaforo() {

        if (!semResult) return;

        const checked = semItems.filter(input => input.checked);

        const total = checked.reduce((sum, input) => sum + Number(input.dataset.w), 0);
        const hasRed = checked.some(input => Number(input.dataset.w) === 3);

        semResult.className = "sem-result";

        if (checked.length === 0) {

            semResult.innerHTML =
                "<p>Marca las opciones que reconozcas para ver una orientación.</p>";

        } else if (hasRed) {

            semResult.classList.add("r-red");

            semResult.innerHTML = `
                <strong>🔴 Hay señales de peligro</strong>
                Lo que marcaste puede ser violencia. No es tu culpa y no tienes que
                enfrentarlo a solas. Si estás en riesgo, llama al 911.
                <br><a href="#ayuda">Ver líneas de ayuda →</a>
            `;

        } else if (total >= 3) {

            semResult.classList.add("r-yellow");

            semResult.innerHTML = `
                <strong>🟡 Varias señales de alerta</strong>
                Son conductas que no deben normalizarse. Habla con alguien de confianza,
                pon límites claros y busca orientación antes de que escalen.
                <br><a href="#ayuda">Ver dónde pedir orientación →</a>
            `;

        } else {

            semResult.classList.add("r-yellow");

            semResult.innerHTML = `
                <strong>🟡 Una señal de alerta</strong>
                Conviene hablar sobre ello y poner límites. Observa si se repite o aumenta.
            `;

        }

    }

    semItems.forEach(input => input.addEventListener("change", evaluateSemaforo));


    // --------------------------------------------------------
    // TARJETA DE COMPROMISO (CANVAS)
    // --------------------------------------------------------

    const pledgeForm = $("#pledgeForm");
    const pledgeCanvas = $("#pledgeCanvas");
    const pledgeOutput = $("#pledgeOutput");
    const pledgeDownload = $("#pledgeDownload");

    function roundRect(ctx, x, y, w, h, r) {

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();

    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {

        const words = text.split(" ");
        let line = "";

        words.forEach(word => {

            const test = line ? line + " " + word : word;

            if (ctx.measureText(test).width > maxWidth && line) {
                ctx.fillText(line, x, y);
                line = word;
                y += lineHeight;
            } else {
                line = test;
            }

        });

        ctx.fillText(line, x, y);

        return y + lineHeight;

    }

    function drawPledge(name, picks) {

        const ctx = pledgeCanvas.getContext("2d");
        const W = pledgeCanvas.width;
        const H = pledgeCanvas.height;

        const bg = ctx.createLinearGradient(0, 0, W, H);

        bg.addColorStop(0, "#4930a7");
        bg.addColorStop(0.55, "#7654e8");
        bg.addColorStop(1, "#f16ca6");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Círculos decorativos
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath(); ctx.arc(W - 80, 120, 220, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, H - 100, 260, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#ffad65";
        ctx.beginPath(); ctx.arc(W - 150, H - 170, 38, 0, Math.PI * 2); ctx.fill();

        // Tarjeta blanca
        ctx.fillStyle = "#ffffff";
        roundRect(ctx, 70, 230, W - 140, H - 400, 44);
        ctx.fill();

        // Encabezado
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 54px Poppins, sans-serif";
        ctx.fillText("EQUILIBRIO.", W / 2, 130);

        ctx.font = "700 26px 'DM Sans', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText("RESPETO · EQUIDAD · JUSTICIA", W / 2, 180);

        // Contenido
        ctx.fillStyle = "#7654e8";
        ctx.font = "800 30px 'DM Sans', sans-serif";
        ctx.fillText("MI COMPROMISO POR LA IGUALDAD", W / 2, 320);

        ctx.fillStyle = "#201b32";
        ctx.font = "800 66px Poppins, sans-serif";

        let displayName = name;

        while (ctx.measureText(displayName).width > W - 260 && displayName.length > 3) {
            displayName = displayName.slice(0, -1);
        }

        ctx.fillText(displayName, W / 2, 410);

        ctx.fillStyle = "#625e70";
        ctx.font = "500 30px 'DM Sans', sans-serif";
        ctx.fillText("me comprometo a:", W / 2, 465);

        ctx.textAlign = "left";

        let y = 545;

        picks.slice(0, 6).forEach(pick => {

            ctx.fillStyle = "#f16ca6";
            ctx.beginPath();
            ctx.arc(135, y - 11, 18, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "800 22px 'DM Sans', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("✓", 135, y - 3);

            ctx.textAlign = "left";
            ctx.fillStyle = "#201b32";
            ctx.font = "600 31px 'DM Sans', sans-serif";

            y = wrapText(ctx, pick, 175, y, W - 340, 42) + 24;

        });

        // Pie
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "600 28px 'DM Sans', sans-serif";
        ctx.fillText(
            new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }),
            W / 2,
            H - 110
        );

        ctx.font = "700 24px 'DM Sans', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText("La justicia no tiene género. El respeto tampoco.", W / 2, H - 65);

    }

    if (pledgeForm) {

        pledgeForm.addEventListener("submit", async event => {

            event.preventDefault();

            const name = ($("#pledgeName").value.trim() || "Yo").slice(0, 30);

            const picks = $$("input[name='pledge']:checked", pledgeForm)
                .map(input => input.value);

            if (picks.length === 0) {
                toast("Elige al menos un compromiso");
                return;
            }

            try {
                await Promise.all([
                    document.fonts.load("800 60px Poppins"),
                    document.fonts.load("600 30px 'DM Sans'")
                ]);
            } catch (error) {
                // Si las fuentes no cargan se usa una fuente de respaldo
            }

            drawPledge(name, picks);

            pledgeDownload.href = pledgeCanvas.toDataURL("image/png");

            pledgeOutput.hidden = false;

            pledgeOutput.scrollIntoView({ behavior: "smooth", block: "center" });

            confetti(120);

        });

    }

})();
