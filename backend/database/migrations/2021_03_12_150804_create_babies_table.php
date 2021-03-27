<?php

use App\Models\File;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBabiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('babies', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(new User(), 'attendee_id')->constrained((new User())->getTable());
            $table->string('sex');
            $table->string('name')->index();
            $table->string('nickname')->nullable()->index();
            $table->string('father')->index();
            $table->string('mother')->index();
            $table->string('type_of_birth')->index();
            $table->timestamp('date_of_birth');
            $table->boolean('complete_in_months')->default(true);
            $table->string('single_or_twin')->index();
            $table->string('blood_type');
            $table->string('weight');
            $table->string('length_of_body');
            $table->string('head_measurement');
            $table->string('chest_measurement');
            $table->string('order_of_birth');
            $table->timestamp('name_registration_date');
            $table->string('name_registration_location');
            $table->string('mishaps')->nullable()->index();
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
        Schema::dropIfExists('babies');
    }
}
