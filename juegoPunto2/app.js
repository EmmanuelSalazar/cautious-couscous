const prompt = require('prompt');

// Configuración de prompt
prompt.start();

// Función para obtener las notas de una materia
function getSubjectGrades(subjectName) {
  return new Promise((resolve, reject) => {
    const grades = [];
    function getGrade(index) {
      prompt.get({
        properties: {
          grade: {
            description: `Ingrese la nota ${index} para ${subjectName} (0-5):`,
            type: 'number',
            required: true,
            message: 'La nota debe ser un número entre 0 y 5',
            conform: function(value) {
              return value >= 0 && value <= 5;
            }
          }
        }
      }, function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        grades.push(result.grade);
        if (grades.length < 3) {
          getGrade(grades.length + 1);
        } else {
          resolve(grades);
        }
      });
    }
    getGrade(1);
  });
}

// Función para calcular el promedio de las notas
function calculateAverage(grades) {
  return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
}

// Función principal
async function calculateResults() {
  const subjects = ['Materia 1', 'Materia 2', 'Materia 3'];
  let totalFailedGrades = 0;
  let failedSubjects = 0;
  let results = '';

  for (const subject of subjects) {
    const grades = await getSubjectGrades(subject);
    const average = calculateAverage(grades);
    const failedGradesCount = grades.filter(grade => grade < 3).length;
    const subjectPassed = average >= 3;

    totalFailedGrades += failedGradesCount;
    if (!subjectPassed) failedSubjects++;

    results += `${subject}:\n`;
    results += `  Notas: ${grades.join(', ')}\n`;
    results += `  Promedio: ${average.toFixed(2)}\n`;
    results += `  Estado: ${subjectPassed ? 'APROBADA' : 'REPROBADA'}\n\n`;
  }

  const passedYear = failedSubjects < 3;

  results += `Resumen:\n`;
  results += `Notas perdidas: ${totalFailedGrades}\n`;
  results += `Materias perdidas: ${failedSubjects}\n`;
  results += `Estado del año: ${passedYear ? 'APROBADO' : 'REPROBADO'}`;

  console.log(results);
}

// Iniciar el proceso
calculateResults().then(() => {
  console.log('Proceso completado.');
}).catch((error) => {
  console.error('Ocurrió un error:', error);
});