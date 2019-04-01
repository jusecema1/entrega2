const hbs = require('hbs');

hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
    return (nota1 + nota2 + nota3) / 3;
});

hbs.registerHelper('listar', () => {
    let texto = 'Lista de estudiantes <br><br> \
    <table> \
    <thead> \
    <th> Nombre </th> \
    <th> Matematicas </th>\
    <th> Ingles </th>\
    <th> Programacion </th>\
    </thead>\
    <tbody>';
    try {
        let listaEstudiantes = require('../listado.json');
        listaEstudiantes.forEach(estudiante => {
            texto += '<tr>' +
                '<td>' + estudiante.nombre + '</td>' +
                '<td>' + estudiante.matematicas + '</td>' +
                '<td>' + estudiante.ingles + '</td>' +
                '<td>' + estudiante.programacion + '</td>' +
                '</tr>';
        });
        texto += '</tbody></table>'
    } catch (error) {
        texto = 'No hay informacion datos!!!';
    }
    return texto;
});