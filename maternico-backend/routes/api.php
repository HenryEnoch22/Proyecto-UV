<?php

use App\Http\Controllers\EventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    });

    Route::post('/get-events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{eventId}', [EventController::class, 'show']);
    Route::patch('/events/{eventId}', [EventController::class, 'update']);
    Route::delete('/events/{eventId}', [EventController::class, 'destroy']);

});




require __DIR__.'/auth.php';
