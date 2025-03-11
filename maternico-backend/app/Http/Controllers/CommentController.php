<?php

namespace App\Http\Controllers;

use App\Http\Requests\Forum\StoreCommentRequest;
use App\Models\Forum\Comment;
use Exception;

class CommentController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request)
    {
       try{
           $comment = Comment::create($request->validated());
           return response()->json([
               'success' => true,
               'message' => 'Comentario creado correctamente',
               'data' => $comment,
           ]);
       }catch (Exception $e){
           return response()->json([
               'success' => false,
               'message' => 'Error al crear el comentario',
           ], 400);
       }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($commentId)
    {
        try{
            $comment = Comment::find($commentId);
            $comment->delete();
            return response()->json([
                'success' => true,
                'message' => 'Comentario eliminado correctamente',
            ], 200);
        } catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Comentario no encontrado',
            ], 404);
        }
    }
}
