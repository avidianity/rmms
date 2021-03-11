<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePatientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->unsignedTinyInteger('age');
            $table->string('sex');
            $table->date('birthday');
            $table->string('address');
            $table->string('civil_status')->nullable();
            $table->string('membership_nh')->nullable();
            $table->string('membership_nn')->nullable();
            $table->string('philhealth_number')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('4ps')->nullable();
            $table->string('blood_type')->nullable();
            $table->string('religion')->nullable();
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
        Schema::dropIfExists('patients');
    }
}
