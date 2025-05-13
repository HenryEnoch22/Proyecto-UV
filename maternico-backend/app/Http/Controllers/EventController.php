<?php

namespace App\Http\Controllers;

use App\Http\Requests\Event\IndexEventRequest;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Models\Event\Event;
use Exception;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexEventRequest $request)
    {
        $request->validated();

        $events = Event::where('user_id', $request->user_id)
            ->whereYear('date', $request->year)
            ->whereMonth('date', $request->month)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Eventos obtenidos correctamente',
            'data' => $events,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request)
    {
        $event = $request->validated();
        $event = Event::create(
            [
                'user_id' => $event['user_id'],
                'event_title' => $event['event_title'],
                'type' => $event['type'] ,
                'date' => $event['date'],
                'time' => $event['time'],
                'notifiable' => $event['notifiable'] ? 1 : 0,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Evento creado correctamente',
            'data' => $event,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($eventId)
    {
        try{
            $event = Event::findOrFail($eventId);
        }catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Evento no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Evento obtenido correctamente',
            'data' => $event,
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, $eventId)
    {
        try{
            $event = Event::findOrFail($eventId);
        }
        catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Evento no encontrado',
            ], 404);
        }

        $event->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Evento actualizado correctamente',
            'data' => $event,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($eventId)
    {
        try{
            $event = Event::findOrFail($eventId);
        }
        catch (Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Evento no encontrado',
            ], 404);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Evento eliminado correctamente',
        ], 200);
    }

    public function getLastEvents($userID) {
        try {
            $events = Event::where('user_id', $userID)
                ->where('date', '>=', Carbon::now())
                ->orderBy('date', 'desc')
                ->take(5)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Eventos obtenidos correctamente',
                'data' => $events,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los eventos',
            ], 500);
        }
    }
}
