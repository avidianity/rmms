<?php

use App\Models\Baby;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBabyVaccinationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('baby_vaccinations', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(new Baby())->constrained();
            $table->string('name');
            $table->string('doses');
            $table->timestamp('date');
            $table->string('remarks');
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
        Schema::dropIfExists('baby_vaccinations');
    }
}
