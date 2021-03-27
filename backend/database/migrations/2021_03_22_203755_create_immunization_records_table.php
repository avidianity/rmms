<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImmunizationRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('immunization_records', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->timestamp('birthday');
            $table->string('outcome');
            $table->string('address')->index();
            $table->string('weight');
            $table->string('nbs');
            $table->string('mother')->index();
            $table->string('father')->index();
            $table->string('tt_injection');
            $table->string('time_of_del');
            $table->string('type_of_del');
            $table->string('place_of_del');
            $table->json('info');
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
        Schema::dropIfExists('immunization_records');
    }
}
