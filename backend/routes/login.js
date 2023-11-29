const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var con = mysql.createPool({
    host: 'db',
    user: 'root',
    password: '',
    database: 'dbentrada',
    connectionLimit: 50,
});

router.post('/', function (req, res) {
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const usuario = req.body.usuario;
        const senha = req.body.senha;

        const sql = 'SELECT * FROM login WHERE usuario = ?';
        con.query(sql, [usuario], function (erroComandoSQL, result) {
            conexao.release();
            if (erroComandoSQL) {
                console.error('Erro ao executar consulta:', erroComandoSQL);
                res.status(500).json({ auth: false, message: 'Erro do servidor' });
                return;
            }

            if (result.length === 0) {
                res.status(401).json({ auth: false, message: 'Credenciais inválidas' });
                return;
            }

            const user = result[0];

            bcrypt.compare(senha, user.senha, function (erro, result) {
                if (erro) {
                    console.error('Erro ao verificar senha:', erro);
                    res.status(500).json({ auth: false, message: 'Erro do servidor' });
                    return;
                }

                if (!result) {
                    res.status(401).json({ auth: false, message: 'Credenciais inválidas' });
                    return;
                }

                const token = jwt.sign({ usuario: user.usuario }, process.env.JWT_SEGREDO, { expiresIn: '1d' });
                const decodedToken = jwt.decode(token);
                const expiraEm = decodedToken.exp;

                res.status(200).json({ auth: true, message: 'Login bem-sucedido', token: token, expiraEm: expiraEm });
            });
        });
    });
});

router.post('/novo', function (req, res) {
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const usuario = req.body.usuario;
        const senha = req.body.senha;

        const sqlselect = 'SELECT * FROM login WHERE usuario = ?';
        con.query(sqlselect, [usuario], function (erroComandoSQL, result) {
            conexao.release();
            if (erroComandoSQL) {
                console.error('Erro ao executar consulta:', erroComandoSQL);
                res.status(500).send('Erro do servidor');
                return;
            }

            if (result.length > 0) {
                res.status(409).send('Login existente');
                return;
            }

            bcrypt.hash(senha, 10, function (erro, hash) {
                if (erro) {
                    console.error('Erro ao gerar hash:', erro);
                    res.status(500).send('Erro do servidor');
                    return;
                }

                const sqlinsert = 'INSERT INTO login(usuario, senha) VALUES (?, ?)';
                con.query(sqlinsert, [usuario, hash], function (erro) {
                    if (erro) {
                        console.error('Erro ao inserir novo login:', erro);
                        res.status(500).send('Erro do servidor');
                        return;
                    }

                    res.status(200).send('Login criado com sucesso');
                });
            });
        });
    });
});
module.exports = router;