var params = new URLSearchParams(window.location.search)

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar')
var txtmensaje = $('#txtmensaje')
var divChatbox = $('#divChatbox')

function renderizarUsuarios(personas) {
    console.log('[socket-chat-jquery.js/renderizarUsuarios] - personas : ', personas);
    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (index = 0; index < personas.length; index++) {
        var element = personas[index];

        html += '<li>';
        html += '    <a data-id="' + element.id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + element.nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';

    }

    console.log('[socket-chat-jquery.js/renderizarUsuarios] - html : ', html);

    divUsuarios.html(html);
}

//listeners
divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id');

    if (id)
        console.log('[socket-chat-jquery.js/divUsuarios.on] - id : ', id);
})


formEnviar.on('submit', function (e) {
    e.preventDefault();

    if (txtmensaje.val().trim().length === 0)
        return;

    console.log('[socket-chat-jquery.js/formEnviar.on] - txtmensaje.val() : ', txtmensaje.val());


    // Enviar información
    socket.emit('crearMensaje', {
        nombre: usuario.nombre,
        mensaje: txtmensaje.val()
    }, function (resp) {
        console.log('[socket-chat-jquery.js/formEnviar.on] - resp : ', resp);
        txtmensaje.val('').focus();
        rederizarMensaje(resp, true);
    });


});

function rederizarMensaje(mensaje, iam) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (iam) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img">';
        html += '        <img src="assets/images/users/5.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    else {
        html += '<li class="animated fadeIn">';
        html += '    <div class="chat-img">';

        if (mensaje.nombre !== 'Administrador') {
            html += '        <img src="assets/images/users/1.jpg" alt="user" />';

        }

        html += '   </div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }



    divChatbox.append(html);

    scrollBottom();

}


function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}