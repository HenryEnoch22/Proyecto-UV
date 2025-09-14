<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('localities', function (Blueprint $table) {
            $table->id();
            $table->string('state_name', 100);
            $table->string('municipality_name', 150);
            $table->string('locality_name', 150);
            $table->char('area_type', 1); // R = Rural, U = Urban
            $table->string('latitude', 50);   // formato en grados/minutos/segundos
            $table->string('longitude', 50);  // formato en grados/minutos/segundos
            $table->decimal('latitude_decimal', 10, 8);
            $table->decimal('longitude_decimal', 11, 8);
            $table->integer('elevation');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('localities');
    }
};
