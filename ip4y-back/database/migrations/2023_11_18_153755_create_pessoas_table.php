<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePessoasTable extends Migration
{
    public function up()
    {
        Schema::create('pessoas', function (Blueprint $table) {
            $table->unsignedBigInteger('cpf')->primary();
            $table->string('nome');
            $table->string('sobrenome');
            $table->date('data_nascimento');
            $table->string('email');
            $table->string('genero');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pessoas');
    }
}
