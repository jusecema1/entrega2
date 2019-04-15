const hbs = require('hbs');
const cursosCtrl = require('../controllers/cursoController');

hbs.registerHelper('crearCurso', (curso) => {
    return cursosCtrl.crearCurso(curso);
});

hbs.registerHelper('cursosDisponible', () => {
    let selectHtml = '<div class="col-sm-10"><select name="idSelect" class="form-control"><option value="" selected disabled hidden>Seleccionar...</option>';
    cursosCtrl.getListaCursos().forEach(curso => {
        let optionHtml = '<option value="' + curso.id + '">' + curso.nombre + '</option>';
        selectHtml += optionHtml;
    });
    return selectHtml += "</select></div>";
});

hbs.registerHelper('listarCursos', () => {

    let texto = 'Lista de cursos <br><br> \
    <table class="table table-striped"> \
    <thead class="thead-dark"> \
    <th> Id </th> \
    <th> Nombre </th>\
    <th> Descripción </th>\
    <th> Modalidad </th>\
    <th> Intensidad </th>\
    <th> Valor </th>\
    <th> Estado </th>\
    </thead>\
    <tbody>';
    try {
        let listaCursos = cursosCtrl.getListaCursos();
        listaCursos.forEach(curso => {
            texto += '<tr>' +
                '<td>' + curso.id + '</td>' +
                '<td>' + curso.nombre + '</td>' +
                '<td>' + curso.descripcion + '</td>' +
                '<td>' + (!curso.modalidad ? curso.modalidad : '-') + '</td>' +
                '<td>' + (!curso.intensidad ? curso.intensidad : '-') + '</td>' +
                '<td>' + curso.valor + '</td>' +
                '<td>' + curso.estado + '</td>' +
                '</tr>';
        });
        texto += '</tbody></table>'
    } catch (error) {
        texto = 'No hay cursos!!!';
    }
    return texto;
});