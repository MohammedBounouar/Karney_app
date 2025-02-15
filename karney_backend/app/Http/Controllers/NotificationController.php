<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class NotificationController extends Controller
{
    public function sendExpoNotification($expoPushToken, $message)
    {
        $client = new Client();

        try {
            $response = $client->post('https://exp.host/--/api/v2/push/send', [
                'json' => [
                    'to' => $expoPushToken,
                    'sound' => 'default',
                    'title' => 'Notification Title',
                    'body' => $message,
                ],
            ]);

            // Log the response for debugging purposes
            $responseBody = (string) $response->getBody();
            \Log::info('Push notification response: ' . $responseBody);

            return response()->json([
                'status' => 'success',
                'response' => json_decode($responseBody),
            ]);

        } catch (RequestException $e) {
            // Log the error for debugging purposes
            \Log::error('Push notification error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send notification',
            ], 500);
        }
    }

    public function notifyUser(Request $request)
    {
        $validated = $request->validate([
            'expoPushToken' => 'required|string',
            'message' => 'required|string',
        ]);

        $expoPushToken = $validated['expoPushToken'];
        $message = $validated['message'];

        return $this->sendExpoNotification($expoPushToken, $message);
    }
}
