<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedicinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('description')->index();
            $table->unsignedBigInteger('number_of_units');
            $table->string('unit_of_issue');
            $table->unsignedBigInteger('estimated_unit_cost');
            $table->unsignedBigInteger('quantity');
            $table->timestamp('date_delivered')->nullable();
            $table->timestamp('expiry_date');
            $table->unsignedBigInteger('critical_value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('medicines');
    }
}
