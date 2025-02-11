// scripts.js

// Inicialização do AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Configurações dos CTAs
    const headerCTA = document.getElementById('header-cta');
    if (headerCTA) {
        headerCTA.addEventListener('click', function() {
            document.getElementById('plans').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    const finalCTA = document.getElementById('final-cta');
    if (finalCTA) {
        finalCTA.addEventListener('click', function() {
            openModal('Teste 4 dias grátis');
        });
    }

    // Configuração dos CTAs dos planos
    const planButtons = document.querySelectorAll('.plan-card button');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('onclick').match(/openModal\('(.+?)'\)/)[1];
            openModal(plan);
        });
    });

    // Animação dos números
    function animateNumber(element) {
        const final = parseInt(element.getAttribute('data-value'));
        let current = 0;
        const increment = Math.ceil(final / 50);

        const timer = setInterval(() => {
            current += increment;
            if (current >= final) {
                current = final;
                clearInterval(timer);
                if (element.nextElementSibling.textContent.includes('dos')) {
                    element.textContent = `${current}%`;
                } else {
                    element.textContent = current;
                }
            } else {
                element.textContent = current;
            }
        }, 30);
    }

    // Configuração do Observer
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                numberObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('.stat-number').forEach(number => {
        numberObserver.observe(number);
    });

    // Funções do Modal
    window.openModal = function(plan) {
        document.getElementById('leadModal').style.display = 'block';
        document.getElementById('plan').value = plan;
    };

    window.closeModal = function() {
        document.getElementById('leadModal').style.display = 'none';
    };

    // Fechar modal ao clicar fora
    window.onclick = function(event) {
        if (event.target == document.getElementById('leadModal')) {
            closeModal();
        }
    };

    // Fechar modal ao clicar no X superior direito
    document.querySelector('.close-modal').addEventListener('click', function() {
        closeModal();
    });

    // Envio do formulário
    document.getElementById('leadForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value.toUpperCase();
        const email = document.getElementById('email').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const plan = document.getElementById('plan').value.toUpperCase();
        
        // Número do WhatsApp que receberá as mensagens (substitua pelo número correto)
        const adminWhatsapp = "5517991616242"; // Substitua pelo seu número
        
        // Formata a mensagem como um "card"
        const message = `🚀 Novo Contato do Site Autozapi
        ---------------------------------------------------
        👤 Olá! Sou *${name}*
        📧 Este é meu e-mail: ${email}
        📱 E este é meu WhatsApp: ${whatsapp}
        📋 Estou interessado no plano: *${plan}*
        💡 Aguardarei o contato do Especialista. Obrigado!
        ---------------------------------------------------
        Origem: Site AutoZapi`;

        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Cria o link do WhatsApp
        const whatsappLink = `https://api.whatsapp.com/send?phone=${adminWhatsapp}&text=${encodedMessage}`;
        
        // Limpa o formulário e fecha o modal
        event.target.reset();
        closeModal();
        
        // Abre o WhatsApp em uma nova aba
        window.open(whatsappLink, '_blank');
    });

    // Máscara para o campo de telefone
    document.getElementById('whatsapp').addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });

    // FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Fecha todos os itens
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Abre o item clicado se não estava ativo
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Script do Newsletter
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const form = this;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Desabilita o botão durante o envio
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        const formData = new FormData();
        formData.append('email', form.querySelector('input[name="email"]').value);

        fetch('newsletter.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Inscrição realizada com sucesso! Verifique seu email.');
                form.reset();
            } else {
                alert(data.message || 'Erro ao processar inscrição. Tente novamente.');
            }
        })
        .catch(error => {
            alert('Erro ao processar inscrição. Tente novamente.');
            console.error('Erro:', error);
        })
        .finally(() => {
            // Reativa o botão após o processamento
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    });
});