<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Information\Video;
use App\Http\Requests\Information\StoreVideoRequest;

class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $videos = Video::all();
            if ($videos->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron videos',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'message' => 'Videos obtenidos correctamente',
                'data' => $videos], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los videos',
                'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVideoRequest $request)
    {
        try {
            $video = Video::create($request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Video creado correctamente',
                'data' => $video], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el video',
                'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($videoID)
    {
        try {
            $video = Video::find($videoID);
            if (!$video) {
                return response()->json([
                    'success' => false,
                    'message' => 'Video no encontrado',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'message' => 'Video obtenido correctamente',
                'data' => $video], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el video',
                'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($videoID)
    {
        try {
            $video = Video::find($videoID);
            if (!$video) {
                return response()->json([
                    'success' => false,
                    'message' => 'Video no encontrado',
                ], 404);
            }
            $video->delete();
            return response()->json([
                'success' => true,
                'message' => 'Video eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el video',
                'error' => $e->getMessage()], 500);
        }
    }
}
