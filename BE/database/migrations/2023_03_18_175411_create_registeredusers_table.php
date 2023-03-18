<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('registeredusers')){
            Schema::create('registeredusers', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger("gender_id");
                $table->text("name");
                $table->text("email");
                $table->text("password");
                $table->text("phone_number");
                $table->text("biography");
                $table->text("profile");
                $table->text("location");
                $table->date("dob");
                $table->timestamps();

                $table->dropPrimary('id'); 
                $table->foreign("gender_id")->references("id")->on("genders")->onDelete("cascade");
                $table->primary('id'); 

            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registeredusers');
    }
};
