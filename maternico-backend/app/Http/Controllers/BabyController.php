<?php

namespace App\Http\Controllers;

use App\Http\Requests\Baby\StoreBabyRequest;
use App\Models\Baby\Baby;
use Exception;
use Illuminate\Http\Request;

class BabyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBabyRequest $request)
    {
        try {
            $baby = Baby::create($request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Bebé creado correctamente',
                'data' => $baby
            ], 201);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el bebé',
                'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($babyId) //Recibe el id de la madre como parámetro
    {
        try{
            $baby = Baby::findOrFail($babyId);
            return response()->json([
                'success' => true,
                'message' => 'Datos del bebé obtenidos correctamente',
                'data' => $baby], 200);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos del bebé',]
            , 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $babyId)
    {
        try{
            $baby = Baby::findOrFail($babyId);
            $baby->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Bebé actualizado correctamente',
                'data' => $baby], 200);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el bebé',
                'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get the specified baby by mother id
     */
    public function getBabyByMother($motherID) {
        try {
            $baby = Baby::where('user_id', $motherID)->first();
            return response()->json([
                'success' => true,
                'message' => 'Bebé obtenido correctamente',
                'data' => $baby
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el bebé',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
