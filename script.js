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
