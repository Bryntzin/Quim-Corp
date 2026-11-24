-- QUIMTECH - Modelo inicial do banco de dados MySQL
-- Este arquivo é uma estrutura de estudo. O site ainda não está conectado ao MySQL.

CREATE DATABASE quimtech;
USE QuimCorp;

CREATE TABLE funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(80) NOT NULL,
    departamento VARCHAR(80) NOT NULL,
    salario DECIMAL(10,2) NOT NULL
);

CREATE TABLE financeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(150) NOT NULL,
    tipo ENUM('Receita', 'Despesa') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_lancamento DATE
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    quantidade INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0
);

CREATE TABLE producao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    data_producao DATE NOT NULL
);

CREATE TABLE maquinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    setor VARCHAR(80) NOT NULL,
    situacao VARCHAR(50) NOT NULL
);

CREATE TABLE turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    horario_entrada TIME NOT NULL,
    horario_saida TIME NOT NULL,
    equipe VARCHAR(100) NOT NULL
);

CREATE TABLE marketing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    canal VARCHAR(80) NOT NULL,
    data_campanha DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);
