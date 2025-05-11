<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Information\Magazine;
use App\Http\Requests\Information\StoreMagazineRequest;

class MagazineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $magazines = Magazine::all();
            if ($magazines->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron revistas',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'message' => 'Revistas obtenidas correctamente',
                'data' => $magazines], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las revistas',
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
    public function store(StoreMagazineRequest $request)
    {
        try {
            $magazine = Magazine::create($request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Revista creada correctamente',
                'data' => $magazine], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la revista',
                'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($magazineID)
    {
        try {
            $magazine = Magazine::findOrFail($magazineID);
            return response()->json([
                'success' => true,
                'message' => 'Revista obtenida correctamente',
                'data' => $magazine], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la revista',
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
    public function destroy($magazineID)
    {
        try {
            $magazine = Magazine::findOrFail($magazineID);
            $magazine->delete();
            return response()->json([
                'success' => true,
                'message' => 'Revista eliminada correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la revista',
                'error' => $e->getMessage()], 500);
        }
    }
}
