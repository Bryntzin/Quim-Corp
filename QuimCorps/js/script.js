// ============================================
// 1. DADOS DO LOGIN - ALTERE NESTE TRECHO
// ============================================
const emailCorreto = "0000111160468xsp@al.educacao.sp.gov.br"; // TROQUE PELO SEU E-MAIL
const senhaCorreta = "123456";             // TROQUE PELA SUA SENHA

// Verifica o e-mail e a senha digitados.
document.getElementById("formLogin").addEventListener("submit", function(evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email === emailCorreto && senha === senhaCorreta) {
        document.getElementById("login").hidden = true;
        document.getElementById("sistema").hidden = false;
        document.getElementById("erroLogin").textContent = "";
    } else {
        document.getElementById("erroLogin").textContent = "E-mail ou senha incorretos.";
    }
});

// Sai do sistema e volta para o login.
document.getElementById("sair").addEventListener("click", function() {
    document.getElementById("sistema").hidden = true;
    document.getElementById("login").hidden = false;
    document.getElementById("formLogin").reset();
});

// ============================================
// 2. DADOS SALVOS NO NAVEGADOR
// ============================================
const modulos = ["funcionarios", "financeiro", "produtos", "producao", "maquinas", "turnos", "marketing"];
const dados = {};

modulos.forEach(function(modulo) {
    dados[modulo] = JSON.parse(localStorage.getItem("quimcorp_" + modulo)) || [];
});

// ============================================
// 3. TROCA DE PÁGINAS
// ============================================
document.querySelectorAll("nav button").forEach(function(botao) {
    botao.addEventListener("click", function() {
        document.querySelectorAll(".pagina").forEach(pagina => pagina.classList.remove("ativa"));
        document.getElementById(botao.dataset.pagina).classList.add("ativa");
    });
});

// ============================================
// 4. FUNÇÕES DAS TABELAS
// ============================================
function dinheiro(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function salvar(modulo) {
    localStorage.setItem("quimtech_" + modulo, JSON.stringify(dados[modulo]));
    atualizarTudo();
}

function mostrarLista(modulo, id, colunas, formatar) {
    const tabela = document.getElementById(id);
    tabela.innerHTML = "";

    dados[modulo].forEach(function(registro, indice) {
        const linha = document.createElement("tr");

        colunas.forEach(function(coluna) {
            const celula = document.createElement("td");
            let valor = registro[coluna];
            if (formatar) valor = formatar(registro, coluna);
            celula.textContent = valor ?? "";
            linha.appendChild(celula);
        });

        const celula = document.createElement("td");
        const botao = document.createElement("button");
        botao.textContent = "Excluir";
        botao.className = "excluir";
        botao.type = "button";
        botao.addEventListener("click", function() {
            if (confirm("Deseja excluir este registro?")) {
                dados[modulo].splice(indice, 1);
                salvar(modulo);
            }
        });
        celula.appendChild(botao);
        linha.appendChild(celula);
        tabela.appendChild(linha);
    });
}

// ============================================
// 5. ATUALIZA AS TABELAS E OS RESUMOS
// ============================================
function atualizarTudo() {
    mostrarLista("funcionarios", "listaFuncionarios", ["nome", "cargo", "departamento", "salario"],
        (r, c) => c === "salario" ? dinheiro(r[c]) : r[c]);

    mostrarLista("financeiro", "listaFinanceiro", ["descricao", "tipo", "valor"],
        (r, c) => c === "valor" ? dinheiro(r[c]) : r[c]);

    mostrarLista("produtos", "listaProdutos", ["codigo", "nome", "quantidade", "minimo", "status"],
        (r, c) => c === "status" ? (Number(r.quantidade) <= Number(r.minimo) ? "Estoque baixo" : "Disponível") : r[c]);

    mostrarLista("producao", "listaProducao", ["produto", "quantidade", "data"]);
    mostrarLista("maquinas", "listaMaquinas", ["nome", "setor", "situacao"]);
    mostrarLista("turnos", "listaTurnos", ["nome", "entrada", "saida", "equipe"]);
    mostrarLista("marketing", "listaMarketing", ["nome", "canal", "data", "status"]);

    document.getElementById("totalFuncionarios").textContent = dados.funcionarios.length;
    document.getElementById("totalProdutos").textContent = dados.produtos.length;
    document.getElementById("totalMaquinas").textContent = dados.maquinas.length;
    document.getElementById("totalMarketing").textContent = dados.marketing.length;

    const receitas = dados.financeiro.filter(item => item.tipo === "Receita").reduce((soma, item) => soma + Number(item.valor), 0);
    const despesas = dados.financeiro.filter(item => item.tipo === "Despesa").reduce((soma, item) => soma + Number(item.valor), 0);

    document.getElementById("totalReceitas").textContent = dinheiro(receitas);
    document.getElementById("totalDespesas").textContent = dinheiro(despesas);
    document.getElementById("saldoFinanceiro").textContent = dinheiro(receitas - despesas);
}

// ============================================
// 6. CADASTRO DOS FORMULÁRIOS
// ============================================
function cadastrar(idFormulario, modulo, campos) {
    document.getElementById(idFormulario).addEventListener("submit", function(evento) {
        evento.preventDefault();
        const formulario = evento.target;
        const registro = {};

        campos.forEach(campo => {
            registro[campo] = new FormData(formulario).get(campo);
        });

        dados[modulo].push(registro);
        salvar(modulo);
        formulario.reset();
    });
}

cadastrar("formFuncionarios", "funcionarios", ["nome", "cargo", "departamento", "salario"]);
cadastrar("formFinanceiro", "financeiro", ["descricao", "tipo", "valor"]);
cadastrar("formProdutos", "produtos", ["nome", "codigo", "quantidade", "minimo"]);
cadastrar("formProducao", "producao", ["produto", "quantidade", "data"]);
cadastrar("formMaquinas", "maquinas", ["nome", "setor", "situacao"]);
cadastrar("formTurnos", "turnos", ["nome", "entrada", "saida", "equipe"]);
cadastrar("formMarketing", "marketing", ["nome", "canal", "data", "status"]);

atualizarTudo();
