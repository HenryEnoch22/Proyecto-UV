<?php

use App\Http\Controllers\BabyEventController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ForumController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BabyController;
use App\Http\Controllers\MagazineController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\ProfileController;

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

    Route::post('/become-premium/{userID}', [ProfileController::class, 'becomePremium']);

    Route::get('forum-responses/{userID}', [ForumController::class, 'getForumResponses']);
    Route::get('forum-responses/{userID}/{forumId}', [ForumController::class, 'markCommentsViewed']);

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


    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/videos/{videoId}', [VideoController::class, 'show']);
    Route::post('/videos', [VideoController::class, 'store']);
    Route::delete('/videos/{videoId}', [VideoController::class, 'destroy']);

    Route::get('/magazines', [MagazineController::class, 'index']);
    Route::get('/magazines/{magazineId}', [MagazineController::class, 'show']);
    Route::post('/magazines', [MagazineController::class, 'store']);
    Route::delete('/magazines/{magazineId}', [MagazineController::class, 'destroy']);
    


    Route::patch('/profile/{userId}', [ProfileController::class, 'update']);

});

require __DIR__.'/auth.php';
