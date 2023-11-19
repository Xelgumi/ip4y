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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
// Route::post('/adicionar-pessoa', 'App\Http\Controllers\PessoaController@adicionarPessoa');

// // No controlador ou arquivo de rota
// Route::options('/adicionar-pessoa', function () {
//     return response()->json()->header('Access-Control-Allow-Origin', '*')
//                              ->header('Access-Control-Allow-Methods', 'POST, OPTIONS')
//                              ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
// });

Route::middleware(['cors'])->group(function () {
    // Rotas que requerem CORS
    Route::post('/adicionar-pessoa', 'App\Http\Controllers\PessoaController@adicionarPessoa');
    Route::get('/lista-pessoas', 'App\Http\Controllers\PessoaController@listarPessoas');
});

//Route::post('/adicionar-pessoa', 'App\Http\Controllers\PessoaController@adicionarPessoa')->middleware('cors');
//Route::get('/listar-pessoas', 'App\Http\Controllers\PessoaController@listarPessoas');
//Route::post('/adicionar-pessoa', 'PessoaController@adicionarPessoa');
//Route::options('/adicionar-pessoa', 'PessoaController@adicionarPessoa');