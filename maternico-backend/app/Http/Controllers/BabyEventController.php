<?php

namespace App\Http\Controllers;

use App\Http\Requests\BabyEvent\StoreBabyEventRequest;
use App\Models\Baby\BabyEvent;
use Exception;
use Illuminate\Http\Request;

class BabyEventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($babyId)
    {
        try{
            $babyEvents = BabyEvent::where('baby_id', $babyId)->get();
            return response()->json([
                'success' => true,
                'message' => 'Eventos del bebé obtenidos correctamente',
                'data' => $babyEvents], 200);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los eventos del bebé',
                'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBabyEventRequest $request)
    {
        try{
            $babyEvent = BabyEvent::create($request->validated());
            return response()->json([
                'success' => true,
                'message' => 'Evento del bebé creado correctamente',
                'data' => $babyEvent], 201);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el evento del bebé',
                'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($babyId)
    {
        try{
            $babyEvents = BabyEvent::findORFail($babyId);
            return response()->json([
                'success' => true,
                'message' => 'Eventos del bebé obtenidos correctamente',
                'data' => $babyEvents], 200);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los eventos del bebé',
                'error' => $e->getMessage()], 500);
        }
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
    public function destroy($babyEventId)
    {
        try{
            $babyEvent = BabyEvent::findOrFail($babyEventId);
            $babyEvent->delete();
            return response()->json([
                'success' => true,
                'message' => 'Evento del bebé eliminado correctamente',
            ], 200);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el evento del bebé',
                'error' => $e->getMessage()], 500);
        }
    }
}
