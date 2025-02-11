// SMTP.js
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const email = document.getElementById('email').value;

    Email.send({
        Host: "smtp.hostinger.com",
        Username: "contato@autozapi.com",
        Password: "4ut0Z@p1",
        To: 'contato@autozapi.com',
        From: 'contato@autozapi.com',
        Subject: "Novo Lead",
        Body: `Nome: ${name}<br>WhatsApp: ${whatsapp}<br>Email: ${email}`
    }).then(
        message => alert('Email enviado com sucesso!')
    ).catch(
        error => alert('Ocorreu um erro ao enviar o email.')
    );

    this.reset();
    closeModal();
});