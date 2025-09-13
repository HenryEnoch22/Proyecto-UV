<?php

namespace App\Http\Controllers;

use App\Http\Requests\Forum\StoreForumRequest;
use App\Http\Requests\Forum\UpdateForumRequest;
use App\Models\Forum\Comment;
use App\Models\Forum\Forum;
use Exception;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ForumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $forums =  Forum::all();
        $forums->load('owner');
        $forums->load('comments');

        return response()->json([
            'success' => true,
            'message' => 'Foros obtenidos correctamente',
            'forums' => $forums,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreForumRequest $request)
    {
        $forum = Forum::create($request->validated());
        return response()->json([
           'success' => true,
            'message' => 'Foro creado correctamente',
            'data' => $forum,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($forumId)
    {
        try{
            $forum = Forum::findOrFail($forumId);
            $forum->load('owner');
            $forum->load('comments');
            
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Foro no encontrado',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Foro obtenido correctamente',
            'data' => $forum,
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateForumRequest $request, $forumId)
    {
        try{
            $forum = Forum::findOrFail($forumId);
        }
        catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Foro no encontrado',
            ], 404);
        }
        $forum->update($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Foro actualizado correctamente',
            'data' => $forum,
        ], 200);
    }

    public function comments($forumId)
    {
        try{
            $comments = Comment::where('forum_id', $forumId)->get();
            $comments->load('owner');
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Foro no encontrado: ' . $e->getMessage(),
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Comentarios obtenidos correctamente',
            'data' => $comments,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($forumUd)
    {
        try{
            $forum = Forum::findOrFail($forumUd);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Foro no encontrado',
            ], 404);
        }
        $forum->delete();
        return response()->json([
            'success' => true,
            'message' => 'Foro eliminado correctamente',
        ], 200);
    }

    /**
     * Get how many responses the user has in the forum
     * @param int $userID
     */
    public function getForumResponses($userID)
    {
        $forums = Forum::where('user_id', $userID)->get();
        
        if ($forums->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'El usuario no tiene foros',
                'data' => 0,
            ], 200);
        }

        $responses = 0;
        foreach ($forums as $forum) {
            $forum->load('comments');
            foreach ($forum->comments as $comment) {
                if ($comment->seen == 0) {
                    $responses++;
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Foros obtenidos correctamente',
            'data' => $responses,
        ], 200);
    }

    /**
     * Mark comments as viewed by the user
     * @param int $userID
     * @param int $forumID
     */
    public function markCommentsViewed($userID, $forumID)
    {
        $comments = Comment::where('forum_id', $forumID)
            ->where('created_at', '<=', Carbon::now())
            ->get();

        if ($comments->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No hay comentarios para marcar como vistos',
            ], 200);
        }

        foreach ($comments as $comment) {
            $comment->load('forum');
            if ($comment->forum->user_id == $userID) {
                $comment->update([
                    'seen' => 1,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Comentarios vistos por el usuario',
            'data' => $comments,
        ], 200);

    }
}
