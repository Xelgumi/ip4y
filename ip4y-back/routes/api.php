<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['cors'])->group(function () {
    // Rotas que requerem CORS
    Route::post('/adicionar-pessoa', 'App\Http\Controllers\PessoaController@adicionarPessoa');
    Route::get('/lista-pessoas', 'App\Http\Controllers\PessoaController@listarPessoas');
    Route::put('/atualizar-pessoas/{cpf}', 'App\Http\Controllers\PessoaController@atualizarPessoa');
    Route::delete('/deletar-pessoa/{cpf}', 'App\Http\Controllers\PessoaController@deletarPessoa');
});