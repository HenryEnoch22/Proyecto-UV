<?php

namespace App\Http\Controllers;

use App\Http\Requests\BabyEvent\StoreBabyEventRequest;
use App\Models\Baby\Baby;
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
            $baby = Baby::find($babyId);
            if (!$baby) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bebé no encontrado',
                ], 404);
            }

            $babyEvents = BabyEvent::where('baby_id', $babyId)->get();
            if ($babyEvents->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron eventos para este bebé',
                ], 404);
            }
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
        $data = $request->validated();

        // 2) si vino un archivo, guárdalo en storage/app/public/album
        if ($request->hasFile('photo_path')) {
            $path = $request
                    ->file('photo_path')
                    ->store('album', 'public');  
            // $path === "album/1683356789_nombre.jpg"
            $data['photo_path'] = $path;
        }

        // 3) crea el evento con la ruta correcta
        $babyEvent = BabyEvent::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Evento creado correctamente',
            'data'    => $babyEvent
        ], 201);
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
                'message' => 'No se encontró el evento del bebé'
            ], 404);
        }
    }
}
