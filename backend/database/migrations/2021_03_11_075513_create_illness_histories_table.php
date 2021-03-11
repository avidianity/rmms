<?php

use App\Models\Patient;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIllnessHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('illness_histories', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date');
            $table->string('description')->index();
            $table->json('physical_exams');
            $table->text('assessment');
            $table->text('treatment');
            $table->foreignIdFor(new Patient())->constrained();
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
        Schema::dropIfExists('illness_histories');
    }
}
