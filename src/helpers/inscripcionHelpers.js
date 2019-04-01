const hbs = require('hbs');
const cursosCtrl = require('../../controllers/cursoController');

hbs.registerHelper('listarCursosDisponibles', () => {
    let listaDisponibles = cursosCtrl.getListaCursos().find((c) => { return c.estado === 'disponible'; });

    let respuesta = '';
    if (!listaDisponibles) {
        return 'No hay cursos disponibles';
    } else if (!Array.isArray(listaDisponibles)) {
        listaDisponibles = [listaDisponibles];
    }

    for (var i = 0; i < listaDisponibles.length; i++) {
        let idElement = 'collapse' + i;
        let card = '<div class="col-sd-6 col-lg-6"><p>' +
            '<strong>Nombre curso: </strong>' + listaDisponibles[i].nombre + '</br>' +
            '<strong>Descripcion: </strong>' + listaDisponibles[i].descripcion + '</br>' +
            '<strong>Valor: </strong>' + listaDisponibles[i].valor + '</br>' +
            '<a data-toggle="collapse" href="#' + idElement + '" role="button" aria-expanded="false" aria-controls="' + idElement + '">' +
            'ver más' +
            '</a>' +
            '</p>' +
            '<div class="collapse multi-collapse" id="' + idElement + '">' +
            '<div class="card card-body">' +
            '<div class="row-goup">' +
            '<span class="col-md-6">  ' +
            '<strong>Nombre: </strong>' + listaDisponibles[i].nombre +
            '</span>' +
            '<span class="col-md-6">            ' +
            '<strong>Descripcion: </strong>' + listaDisponibles[i].descripcion +
            '</span>' +
            '</div>' +
            '<div class="row-goup">' +
            '<span class="col-md-6">  ' +
            '<strong>Valor: </strong>' + listaDisponibles[i].valor +
            '</span>' +
            '<span class="col-md-6">            ' +
            '<strong>Modalidad: </strong>' + listaDisponibles[i].modalidad +
            '</span>' +
            '</div>' +
            '<div class="row-goup">' +
            '<span class="col-md-6">  ' +
            '<strong>Intensidad: </strong>' + listaDisponibles[i].intensidad +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        if (i % 2 === 0) {
            card = '<div class="row">' + card;
        } else {
            card += '</div>';
        }
        respuesta += card;
    }
    return respuesta;
});



hbs.registerHelper('selectCursosDisponibleIns', () => {
    let listaDisponibles = cursosCtrl.getListaCursos().find((c) => { return c.estado === 'disponible'; });
    if (!listaDisponibles) {
        return 'No hay cursos disponibles';
    } else if (!Array.isArray(listaDisponibles)) {
        listaDisponibles = [listaDisponibles];
    }
    let selectHtml = '<div class="col-sm-9"><select name="idCursoSelect" class="form-control" required><option value="" selected disabled hidden>Seleccionar...</option>';
    listaDisponibles.forEach(curso => {
        let optionHtml = '<option value="' + curso.id + '">' + curso.nombre + '</option>';
        selectHtml += optionHtml;
    });
    return selectHtml += "</select></div>";
});

hbs.registerHelper('selectPersonasCurso', (idCurso) => {
    let listaInscritosCurso = cursosCtrl.getListaPersonaCurso().find((c) => { return c.idCurso === idCurso; });
    let personas = [];
    console.log(listaInscritosCurso);
    if (!listaInscritosCurso) {
        return 'No hay personas inscritas';
    }

    console.log('aca',listaInscritosCurso);
    listaInscritosCurso.inscritos.forEach((ins) => {
        console.log(ins);
        personas.push(cursosCtrl.getListaPersonas().find((p) => { return p.documento === ins; }));
    });
    console.log(personas);
    let selectHtml = '<div class="col-sm-9"><select name="idPersonaSelect" class="form-control"><option value="" selected disabled hidden>Seleccionar...</option>';
    personas.forEach(persona => {
        let optionHtml = '<option value="' + persona.documento + '">' + persona.documento + ' - ' + persona.nombre + '</option>';
        selectHtml += optionHtml;
    });
    return selectHtml += "</select></div>";
});
