<?php

use App\Http\Controllers\BabyEventController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ForumController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BabyController;

//Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//    return $request->user();
//});
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('baby'); // Cargar la relación 'baby'
        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    });

    Route::post('/get-events', [EventController::class, 'index']); //ya
    Route::post('/events', [EventController::class, 'store']); //ya
    Route::get('/events/{eventId}', [EventController::class, 'show']); //todavia
    Route::patch('/events/{eventId}', [EventController::class, 'update']); //todavia
    Route::delete('/events/{eventId}', [EventController::class, 'destroy']); //ya

    Route::apiResource('forums', ForumController::class); // store y show
    Route::get('/forums/{forumId}/comments', [ForumController::class, 'comments']); //ya

    Route::post('/comments', [CommentController::class, 'store']); //ya
    Route::delete('/comments/{commentId}', [CommentController::class, 'destroy']); //todavia

    Route::get('/health-centers', function (){ // ya
        return response()->json([
            'success' => true,
            'message' => 'Centros de salud obtenidos correctamente',
            'data' => \App\Models\Health\HealthCenter::all(),
        ]);
    });
    Route::post('/babies', [BabyController::class, 'store']);
    Route::get('/babies/{babyId}', [BabyController::class, 'show']);
    Route::patch('/babies/{babyId}', [BabyController::class, 'update']); //TODO: Implementar el método update en BabyController

    Route::get('/baby-events-get/{babyId}', [BabyEventController::class, 'index']);
    Route::get('/baby-events/{babEventId}', [BabyEventController::class, 'show']);
    Route::post('/baby-events', [BabyEventController::class, 'store']);
    Route::delete('/baby-events/{babyEventId}', [BabyEventController::class, 'destroy']);


    Route::get('/videos/{videoId}', function ($videoId){
        return response()->json([
            'success' => true,
            'message' => 'Video obtenido correctamente',
            'data' => \App\Models\Information\Video::findOrFail($videoId),
        ]);
    });

    Route::get('/magazines/{magazineId}', function ($magazineId){
        return response()->json([
            'success' => true,
            'message' => 'Revista obtenida correctamente',
            'data' => \App\Models\Information\Magazine::findOrFail($magazineId),
        ]);
    });
    
    Route::get('/videos', function (){
        return response()->json([
            'success' => true,
            'message' => 'Video obtenido correctamente',
            'data' => \App\Models\Information\Video::all(),
        ]);
    });

    Route::get('/magazines', function (){
        return response()->json([
            'success' => true,
            'message' => 'Revista obtenida correctamente',
            'data' => \App\Models\Information\Magazine::all(),
        ]);
    });

    Route::patch('/profile/{userId}', [App\Http\Controllers\ProfileController::class, 'update']);

});

require __DIR__.'/auth.php';
