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
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    });

    Route::post('/get-events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{eventId}', [EventController::class, 'show']);
    Route::patch('/events/{eventId}', [EventController::class, 'update']);
    Route::delete('/events/{eventId}', [EventController::class, 'destroy']);

    Route::apiResource('forums', ForumController::class);
    Route::get('/forums/{forumId}/comments', [ForumController::class, 'comments']);

    Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{commentId}', [CommentController::class, 'destroy']);

    Route::get('/health-centers', function (){
        return response()->json([
            'success' => true,
            'message' => 'Centros de salud obtenidos correctamente',
            'data' => \App\Models\Health\HealthCenter::all(),
        ]);
    });
    Route::post('/babies', [BabyController::class, 'store']);
    Route::get('/babies/{babyId}', [BabyController::class, 'show']);
    Route::get('/baby-mother/{mother}', [BabyController::class, 'getBabyByMother']);
    Route::patch('/babies/{babyId}', [BabyController::class, 'update']);

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
