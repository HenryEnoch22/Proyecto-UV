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
        Schema::create('health_centers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('address', 255);
            $table->string('city', 50);
            $table->string('state', 50);
            $table->string('phone_number', 20);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_centers');
    }
};
