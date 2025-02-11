<?php
header('Content-Type: application/json');

// Configurações de email
$to = "news@autozapi.com";
$from = "news@autozapi.com";
$smtp = "smtp.hostinger.com";

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método inválido');
    }

    $subscriberEmail = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    if (!$subscriberEmail) {
        throw new Exception('Email inválido');
    }

    // Headers para o email
    $headers = "From: $from\r\n";
    $headers .= "Reply-To: $subscriberEmail\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // Email para você (notificação de nova inscrição)
    $subject = "Nova Inscrição Newsletter AutoZapi";
    $message = "
    <html>
    <body>
        <h2>Nova inscrição na newsletter</h2>
        <p><strong>Email:</strong> {$subscriberEmail}</p>
        <p><strong>Data:</strong> " . date('d/m/Y H:i:s') . "</p>
    </body>
    </html>";

    // Envia email de notificação
    $notificationSent = mail($to, $subject, $message, $headers);

    // Email de confirmação para o inscrito
    $confirmationSubject = "Bem-vindo à Newsletter AutoZapi";
    $confirmationMessage = "
    <html>
    <body>
        <h2>Obrigado por se inscrever em nossa newsletter!</h2>
        <p>Você receberá nossas novidades e atualizações diretamente no seu email.</p>
        <br>
        <p>Atenciosamente,<br>Equipe AutoZapi</p>
    
</body>
    
</html>";

    // Envia email de confirmação
    $confirmationSent = mail($subscriberEmail, $confirmationSubject, $confirmationMessage, $headers);

    if (!$notificationSent || !$confirmationSent) {
        throw new Exception('Erro ao enviar os emails');
    }

    echo json_encode(['success' => true, 'message' => 'Inscrição realizada com sucesso!']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao processar inscrição: ' . $e->getMessage()]);
}
?>