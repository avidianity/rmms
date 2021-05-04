<?php

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrenatalRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prenatal_records', function (Blueprint $table) {
            $table->id();
            $table->date('case_number')->index();
            $table->string('lmp')->nullable();
            $table->string('edc')->nullable();
            $table->string('aog')->nullable();
            $table->string('bp')->nullable();
            $table->string('wt')->nullable();
            $table->string('ht')->nullable();
            $table->string('fht')->nullable();
            $table->string('fh')->nullable();
            $table->string('toxoid')->nullable();
            $table->string('lab_requests')->nullable();
            $table->string('feso4')->nullable();
            $table->string('remarks')->nullable();
            $table->string('screened_syphilis')->nullable();
            $table->string('screened_hepatitis')->nullable();
            $table->string('screened_hiv')->nullable();
            $table->string('screened_gestational_diabetes')->nullable();
            $table->string('diagnosed_anemia')->nullable();
            $table->string('cbc_hgb_hct')->nullable();
            $table->string('deworming_dose')->nullable();
            $table->string('phic')->nullable();
            $table->string('bmi')->nullable();
            $table->string('delivery_status')->nullable();
            $table->string('delivery_outcome')->nullable();
            $table->string('status')->index();
            $table->string('husband')->nullable();
            $table->foreignIdFor(new User(), 'attendee_id')->constrained((new User())->getTable());
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
        Schema::dropIfExists('prenatal_records');
    }
}
