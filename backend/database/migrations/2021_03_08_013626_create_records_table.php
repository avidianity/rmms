<?php

use App\Models\Patient;
use App\Models\Record;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('records', function (Blueprint $table) {
            $table->id();
            $table->date('case_number')->index();
            $table->string('diagnosis')->nullable();
            $table->string('status')->index();
            $table->string('chief_complaint');
            $table->foreignIdFor(new User(), 'doctor_id')->constrained((new User())->getTable());
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
        Schema::dropIfExists('records');
    }
}
