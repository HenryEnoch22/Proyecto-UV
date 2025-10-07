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
        Schema::table('health_centers', function (Blueprint $table) {
            $table->string('type', 50)->nullable()->after('name');
            $table->decimal('latitude', 10, 6)->nullable()->after('phone_number');
            $table->decimal('longitude', 10, 6)->nullable()->after('latitude');
            $table->string('phone_number', 50)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('health_centers', function (Blueprint $table) {
            $table->dropColumn(['type', 'latitude', 'longitude']);
        });
    }
};
