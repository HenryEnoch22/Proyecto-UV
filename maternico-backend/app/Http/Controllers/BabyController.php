<?php

namespace App\Http\Controllers;

use App\Http\Requests\Baby\StoreBabyRequest;
use App\Models\Baby\Baby;
use App\Models\Event\Event;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            $existingBaby = Baby::where('user_id', $request->user_id)->first();
            if ($existingBaby) {
                throw new Exception('La madre ya tiene un bebé registrado.');
            }
            $baby = null;
            $birthDate = \Carbon\Carbon::parse($request->birth_date);
            DB::transaction(function () use ($request, &$baby, $birthDate) {
                $baby = Baby::create($request->validated());

                Event::insert([
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Segunda dosis de Hepatitis B recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(1),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Tercera dosis de Hepatitis B recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(6),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Primera dosis de Rotavirus recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(2),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Segunda dosis de Rotavirus recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(4),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Tercera dosis de Rotavirus recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(6),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Primera dosis de la vacuna DTaP (Difteria, Tétanos y Tos Ferina) recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(2),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Segunda dosis de la vacuna DTaP (Difteria, Tétanos y Tos Ferina) recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(4),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Tercera dosis de la vacuna DTaP (Difteria, Tétanos y Tos Ferina) recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(6),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Cuarta dosis de la vacuna DTaP (Difteria, Tétanos y Tos Ferina) recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(15),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Quinta dosis de la vacuna DTaP (Difteria, Tétanos y Tos Ferina) recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(48),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Primera dosis de la vacuna Antipoliomelítica recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(2),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Segunda dosis de la vacuna Antipoliomelítica recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(4),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Tercera dosis de la vacuna Antipoliomelítica recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(6),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Primera dosis de la vacuna Antineumocócica recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(2),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Segunda dosis de la vacuna Antineumocócica recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(4),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Tercera dosis de la vacuna Antineumocócica recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(6),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Cuarta dosis de la vacuna Antineumocócica recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addYear(1),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Primera dosis de Varicela recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addYear(1),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Segunda dosis de Varicela recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addYear(4),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Primera dosis de Hepatitis A recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addYear(1),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Segunda dosis de Hepatitis A recomendada',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(18),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Recomendación: Asegurate de que tu bebé tenga entre 11 y 14 horas de sueño',
                        'type' => 'Desarrollo',
                        'date' => $birthDate->copy()->addYear(2),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Recomendación: Realiza actividades sensoriales con tu bebé',
                        'type' => 'Desarrollo',
                        'date' => $birthDate->copy()->addYear(3),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                    [
                        'user_id' => $request->user_id,
                        'event_title' => 'Recomendación: Vacunación contra la Influenza y COVID-19',
                        'type' => 'Vacunación',
                        'date' => $birthDate->copy()->addMonth(36),
                        'notifiable' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ],
                ]);

            });
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
