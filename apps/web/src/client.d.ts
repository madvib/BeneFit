declare class ApiError extends Error {
    status: number;
    statusText: string;
    constructor(status: number, statusText: string, message: string);
}
export declare const client: {
    health: import('hono/client').ClientRequest<string, "/health", {
        $get: {
            input: {};
            output: {
                status: string;
                timestamp: string;
            };
            outputFormat: "json";
            status: import('hono/utils/http-status').ContentfulStatusCode;
        };
    }>;
} & {
    api: {
        auth: {
            "*": import('hono/client').ClientRequest<string, "/api/auth/*", {
                $get: {
                    input: {};
                    output: {};
                    outputFormat: string;
                    status: import('hono/utils/http-status').StatusCode;
                };
                $post: {
                    input: {};
                    output: {};
                    outputFormat: string;
                    status: import('hono/utils/http-status').StatusCode;
                };
            }>;
        };
    };
} & {
    health: import('hono/client').ClientRequest<string, "/health", {
        $get: {
            input: {};
            output: {
                status: string;
                timestamp: string;
            };
            outputFormat: "json";
            status: import('hono/utils/http-status').ContentfulStatusCode;
        };
    }>;
} & {
    api: {
        coach: {
            message: import('hono/client').ClientRequest<string, "/api/coach/message", {
                $post: {
                    input: {
                        json: {
                            message: string;
                            checkInId?: string | undefined;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            message: string;
                            checkInId?: string | undefined;
                        };
                    };
                    output: {
                        conversationId: string;
                        coachResponse: string;
                        actions?: {
                            type: string;
                            details: string;
                        }[] | undefined;
                        suggestedFollowUps?: string[] | undefined;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        coach: {
            summary: import('hono/client').ClientRequest<string, "/api/coach/summary", {
                $post: {
                    input: {};
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {};
                    output: {
                        summary: string;
                        highlights: string[];
                        suggestions: string[];
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        coach: {
            "check-in": {
                dismiss: import('hono/client').ClientRequest<string, "/api/coach/check-in/dismiss", {
                    $post: {
                        input: {
                            json: {
                                checkInId: string;
                            };
                        };
                        output: {
                            error: string;
                        };
                        outputFormat: "json";
                        status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                    } | {
                        input: {
                            json: {
                                checkInId: string;
                            };
                        };
                        output: {
                            conversationId: string;
                            dismissed: boolean;
                        };
                        outputFormat: "json";
                        status: import('hono/utils/http-status').ContentfulStatusCode;
                    };
                }>;
            };
        };
    };
} & {
    api: {
        coach: {
            "check-in": {
                respond: import('hono/client').ClientRequest<string, "/api/coach/check-in/respond", {
                    $post: {
                        input: {
                            json: {
                                checkInId: string;
                                response: string;
                            };
                        };
                        output: {
                            error: string;
                        };
                        outputFormat: "json";
                        status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                    } | {
                        input: {
                            json: {
                                checkInId: string;
                                response: string;
                            };
                        };
                        output: {
                            conversationId: string;
                            coachAnalysis: string;
                            actions: {
                                type: string;
                                details: string;
                            }[];
                        };
                        outputFormat: "json";
                        status: import('hono/utils/http-status').ContentfulStatusCode;
                    };
                }>;
            };
        };
    };
} & {
    api: {
        coach: {
            "check-in": {
                trigger: import('hono/client').ClientRequest<string, "/api/coach/check-in/trigger", {
                    $post: {
                        input: {};
                        output: {
                            error: string;
                        };
                        outputFormat: "json";
                        status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                    } | {
                        input: {};
                        output: {
                            checkInId: string;
                            question: string;
                            triggeredBy: string;
                        };
                        outputFormat: "json";
                        status: import('hono/utils/http-status').ContentfulStatusCode;
                    };
                }>;
            };
        };
    };
} & {
    health: import('hono/client').ClientRequest<string, "/health", {
        $get: {
            input: {};
            output: {
                status: string;
                timestamp: string;
            };
            outputFormat: "json";
            status: import('hono/utils/http-status').ContentfulStatusCode;
        };
    }>;
} & {
    api: {
        "fitness-plan": {
            active: import('hono/client').ClientRequest<string, "/api/fitness-plan/active", {
                $get: {
                    input: {};
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {};
                    output: {
                        hasPlan: boolean;
                        plan?: {
                            id: string;
                            title: string;
                            durationWeeks: number;
                            currentWeek: number;
                            status: "draft" | "active" | "paused" | "completed" | "abandoned";
                            weeks: {
                                weekNumber: number;
                                workouts: {
                                    id: string;
                                    type: string;
                                    dayOfWeek: number;
                                    status: "completed" | "scheduled" | "in_progress" | "skipped" | "rescheduled";
                                    durationMinutes?: number | undefined;
                                }[];
                            }[];
                            summary: {
                                total: number;
                                completed: number;
                            };
                            description?: string | undefined;
                            startedAt?: string | undefined;
                        } | undefined;
                        message?: string | undefined;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        "fitness-plan": {
            generate: import('hono/client').ClientRequest<string, "/api/fitness-plan/generate", {
                $post: {
                    input: {
                        json: {
                            goals: {
                                primary: string;
                                secondary: string[];
                                targetMetrics: {
                                    targetWeights?: {
                                        exercise: string;
                                        weight: number;
                                    }[] | undefined;
                                    targetDuration?: {
                                        activity: string;
                                        duration: number;
                                    } | undefined;
                                    targetPace?: number | undefined;
                                    targetDistance?: number | undefined;
                                    totalWorkouts?: number | undefined;
                                    minStreakDays?: number | undefined;
                                };
                                targetDate?: string | undefined;
                            };
                            customInstructions?: string | undefined;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            goals: {
                                primary: string;
                                secondary: string[];
                                targetMetrics: {
                                    targetWeights?: {
                                        exercise: string;
                                        weight: number;
                                    }[] | undefined;
                                    targetDuration?: {
                                        activity: string;
                                        duration: number;
                                    } | undefined;
                                    targetPace?: number | undefined;
                                    targetDistance?: number | undefined;
                                    totalWorkouts?: number | undefined;
                                    minStreakDays?: number | undefined;
                                };
                                targetDate?: string | undefined;
                            };
                            customInstructions?: string | undefined;
                        };
                    };
                    output: {
                        planId: string;
                        name: string;
                        durationWeeks: number;
                        workoutsPerWeek: number;
                        preview: {
                            weekNumber: number;
                            workouts: {
                                day: string;
                                type: string;
                                summary: string;
                            }[];
                        };
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        "fitness-plan": {
            activate: import('hono/client').ClientRequest<string, "/api/fitness-plan/activate", {
                $post: {
                    input: {
                        json: {
                            planId: string;
                            startDate?: Date | undefined;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            planId: string;
                            startDate?: Date | undefined;
                        };
                    };
                    output: {
                        planId: string;
                        status: string;
                        startDate: string;
                        todaysWorkout?: {
                            workoutId: string;
                            type: string;
                            durationMinutes: number;
                        } | undefined;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        "fitness-plan": {
            adjust: import('hono/client').ClientRequest<string, "/api/fitness-plan/adjust", {
                $post: {
                    input: {
                        json: {
                            planId: string;
                            feedback: string;
                            recentWorkouts: {
                                perceivedExertion: number;
                                enjoyment: number;
                                difficultyRating: "too_easy" | "just_right" | "too_hard";
                            }[];
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            planId: string;
                            feedback: string;
                            recentWorkouts: {
                                perceivedExertion: number;
                                enjoyment: number;
                                difficultyRating: "too_easy" | "just_right" | "too_hard";
                            }[];
                        };
                    };
                    output: {
                        planId: string;
                        adjustmentsMade: string[];
                        message: string;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        "fitness-plan": {
            pause: import('hono/client').ClientRequest<string, "/api/fitness-plan/pause", {
                $post: {
                    input: {
                        json: {
                            planId: string;
                            reason?: string | undefined;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            planId: string;
                            reason?: string | undefined;
                        };
                    };
                    output: {
                        planId: string;
                        status: string;
                        pausedAt: string;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    health: import('hono/client').ClientRequest<string, "/health", {
        $get: {
            input: {};
            output: {
                status: string;
                timestamp: string;
            };
            outputFormat: "json";
            status: import('hono/utils/http-status').ContentfulStatusCode;
        };
    }>;
} & {
    api: {
        integrations: {
            connect: import('hono/client').ClientRequest<string, "/api/integrations/connect", {
                $post: {
                    input: {
                        json: {
                            serviceType: "strava" | "garmin";
                            authorizationCode: string;
                            redirectUri: string;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            serviceType: "strava" | "garmin";
                            authorizationCode: string;
                            redirectUri: string;
                        };
                    };
                    output: {
                        serviceId: string;
                        serviceType: string;
                        connected: boolean;
                        permissions: import('hono/utils/types').JSONValue;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        integrations: {
            disconnect: import('hono/client').ClientRequest<string, "/api/integrations/disconnect", {
                $post: {
                    input: {
                        json: {
                            serviceId: string;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            serviceId: string;
                        };
                    };
                    output: {
                        serviceId: string;
                        disconnected: boolean;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        integrations: {
            connected: import('hono/client').ClientRequest<string, "/api/integrations/connected", {
                $get: {
                    input: {};
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {};
                    output: {
                        services: {
                            id: string;
                            serviceType: string;
                            isActive: boolean;
                            isPaused: boolean;
                            syncStatus: string;
                            lastSyncAt?: string | undefined;
                        }[];
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        integrations: {
            sync: import('hono/client').ClientRequest<string, "/api/integrations/sync", {
                $post: {
                    input: {};
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {};
                    output: {
                        serviceId: string;
                        success: boolean;
                        workoutsSynced: number;
                        activitiesSynced: number;
                        error?: string | undefined;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        profile: import('hono/client').ClientRequest<string, "/api/profile", {
            $get: {
                input: {};
                output: {
                    error: string;
                };
                outputFormat: "json";
                status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
            } | {
                input: {};
                output: {
                    userId: string;
                    displayName: string;
                    experienceLevel: string;
                    primaryGoal: string;
                    totalWorkouts: number;
                    currentStreak: number;
                    avatar?: string | undefined;
                    bio?: string | undefined;
                    location?: string | undefined;
                };
                outputFormat: "json";
                status: import('hono/utils/http-status').ContentfulStatusCode;
            };
            $post: {
                input: {
                    json: {
                        displayName: string;
                        timezone: string;
                        experienceProfile: {
                            level: "beginner" | "intermediate" | "advanced";
                            history: {
                                previousPrograms: string[];
                                sports: string[];
                                certifications: string[];
                                yearsTraining?: number | undefined;
                            };
                            capabilities: {
                                canDoFullPushup: boolean;
                                canDoFullPullup: boolean;
                                canRunMile: boolean;
                                canSquatBelowParallel: boolean;
                                estimatedMaxes?: {
                                    unit: "kg" | "lbs";
                                    squat?: number | undefined;
                                    bench?: number | undefined;
                                    deadlift?: number | undefined;
                                } | undefined;
                            };
                            lastAssessmentDate: string;
                        };
                        fitnessGoals: {
                            primary: "general_fitness" | "strength" | "hypertrophy" | "endurance" | "weight_loss" | "weight_gain" | "sport_specific" | "mobility" | "rehabilitation";
                            secondary: string[];
                            motivation: string;
                            successCriteria: string[];
                            targetWeight?: {
                                current: number;
                                target: number;
                                unit: "kg" | "lbs";
                            } | undefined;
                            targetBodyFat?: number | undefined;
                            targetDate?: string | undefined;
                        };
                        trainingConstraints: {
                            availableDays: string[];
                            availableEquipment: string[];
                            location: "gym" | "home" | "outdoor" | "mixed";
                            injuries?: {
                                bodyPart: string;
                                severity: "minor" | "moderate" | "serious";
                                avoidExercises: string[];
                                reportedDate: string;
                                notes?: string | undefined;
                            }[] | undefined;
                            preferredTime?: "morning" | "afternoon" | "evening" | undefined;
                            maxDuration?: number | undefined;
                        };
                        avatar?: string | undefined;
                        bio?: string | undefined;
                        location?: string | undefined;
                    };
                };
                output: {
                    error: string;
                };
                outputFormat: "json";
                status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
            } | {
                input: {
                    json: {
                        displayName: string;
                        timezone: string;
                        experienceProfile: {
                            level: "beginner" | "intermediate" | "advanced";
                            history: {
                                previousPrograms: string[];
                                sports: string[];
                                certifications: string[];
                                yearsTraining?: number | undefined;
                            };
                            capabilities: {
                                canDoFullPushup: boolean;
                                canDoFullPullup: boolean;
                                canRunMile: boolean;
                                canSquatBelowParallel: boolean;
                                estimatedMaxes?: {
                                    unit: "kg" | "lbs";
                                    squat?: number | undefined;
                                    bench?: number | undefined;
                                    deadlift?: number | undefined;
                                } | undefined;
                            };
                            lastAssessmentDate: string;
                        };
                        fitnessGoals: {
                            primary: "general_fitness" | "strength" | "hypertrophy" | "endurance" | "weight_loss" | "weight_gain" | "sport_specific" | "mobility" | "rehabilitation";
                            secondary: string[];
                            motivation: string;
                            successCriteria: string[];
                            targetWeight?: {
                                current: number;
                                target: number;
                                unit: "kg" | "lbs";
                            } | undefined;
                            targetBodyFat?: number | undefined;
                            targetDate?: string | undefined;
                        };
                        trainingConstraints: {
                            availableDays: string[];
                            availableEquipment: string[];
                            location: "gym" | "home" | "outdoor" | "mixed";
                            injuries?: {
                                bodyPart: string;
                                severity: "minor" | "moderate" | "serious";
                                avoidExercises: string[];
                                reportedDate: string;
                                notes?: string | undefined;
                            }[] | undefined;
                            preferredTime?: "morning" | "afternoon" | "evening" | undefined;
                            maxDuration?: number | undefined;
                        };
                        avatar?: string | undefined;
                        bio?: string | undefined;
                        location?: string | undefined;
                    };
                };
                output: {
                    userId: string;
                    displayName: string;
                    profileComplete: boolean;
                };
                outputFormat: "json";
                status: import('hono/utils/http-status').ContentfulStatusCode;
            };
        }>;
    };
} & {
    health: import('hono/client').ClientRequest<string, "/health", {
        $get: {
            input: {};
            output: {
                status: string;
                timestamp: string;
            };
            outputFormat: "json";
            status: import('hono/utils/http-status').ContentfulStatusCode;
        };
    }>;
} & {
    api: {
        profile: {
            goals: import('hono/client').ClientRequest<string, "/api/profile/goals", {
                $post: {
                    input: {
                        json: {
                            goals: {
                                primary: "general_fitness" | "strength" | "hypertrophy" | "endurance" | "weight_loss" | "weight_gain" | "sport_specific" | "mobility" | "rehabilitation";
                                secondary: string[];
                                motivation: string;
                                successCriteria: string[];
                                targetWeight?: {
                                    current: number;
                                    target: number;
                                    unit: "kg" | "lbs";
                                } | undefined;
                                targetBodyFat?: number | undefined;
                                targetDate?: string | undefined;
                            };
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            goals: {
                                primary: "general_fitness" | "strength" | "hypertrophy" | "endurance" | "weight_loss" | "weight_gain" | "sport_specific" | "mobility" | "rehabilitation";
                                secondary: string[];
                                motivation: string;
                                successCriteria: string[];
                                targetWeight?: {
                                    current: number;
                                    target: number;
                                    unit: "kg" | "lbs";
                                } | undefined;
                                targetBodyFat?: number | undefined;
                                targetDate?: string | undefined;
                            };
                        };
                    };
                    output: {
                        userId: string;
                        goals: {
                            primary: "general_fitness" | "strength" | "hypertrophy" | "endurance" | "weight_loss" | "weight_gain" | "sport_specific" | "mobility" | "rehabilitation";
                            secondary: string[];
                            motivation: string;
                            successCriteria: string[];
                            targetWeight?: {
                                current: number;
                                target: number;
                                unit: "kg" | "lbs";
                            } | undefined;
                            targetBodyFat?: number | undefined;
                            targetDate?: string | undefined;
                        };
                        suggestNewPlan: boolean;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        profile: {
            preferences: import('hono/client').ClientRequest<string, "/api/profile/preferences", {
                $post: {
                    input: {
                        json: {
                            preferences?: Record<string, unknown> | undefined;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            preferences?: Record<string, unknown> | undefined;
                        };
                    };
                    output: {
                        userId: string;
                        preferences: {
                            [x: string]: import('hono/utils/types').JSONValue;
                        };
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        profile: {
            stats: import('hono/client').ClientRequest<string, "/api/profile/stats", {
                $get: {
                    input: {};
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {};
                    output: {
                        totalWorkouts: number;
                        totalMinutes: number;
                        totalVolume: number;
                        currentStreak: number;
                        longestStreak: number;
                        achievements: {
                            id: string;
                            name: string;
                            earnedAt: string;
                        }[];
                        streakActive: boolean;
                        daysSinceLastWorkout: number | null;
                        lastWorkoutDate?: string | undefined;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        profile: {
            contraints: import('hono/client').ClientRequest<string, "/api/profile/contraints", {
                $post: {
                    input: {
                        json: {
                            constraints: {
                                availableDays: string[];
                                availableEquipment: string[];
                                location: "gym" | "home" | "outdoor" | "mixed";
                                injuries?: {
                                    bodyPart: string;
                                    severity: "minor" | "moderate" | "serious";
                                    avoidExercises: string[];
                                    reportedDate: string;
                                    notes?: string | undefined;
                                }[] | undefined;
                                preferredTime?: "morning" | "afternoon" | "evening" | undefined;
                                maxDuration?: number | undefined;
                            };
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            constraints: {
                                availableDays: string[];
                                availableEquipment: string[];
                                location: "gym" | "home" | "outdoor" | "mixed";
                                injuries?: {
                                    bodyPart: string;
                                    severity: "minor" | "moderate" | "serious";
                                    avoidExercises: string[];
                                    reportedDate: string;
                                    notes?: string | undefined;
                                }[] | undefined;
                                preferredTime?: "morning" | "afternoon" | "evening" | undefined;
                                maxDuration?: number | undefined;
                            };
                        };
                    };
                    output: {
                        userId: string;
                        constraints: {
                            availableDays: string[];
                            availableEquipment: string[];
                            location: "gym" | "home" | "outdoor" | "mixed";
                            injuries?: {
                                bodyPart: string;
                                severity: "minor" | "moderate" | "serious";
                                avoidExercises: string[];
                                reportedDate: string;
                                notes?: string | undefined;
                            }[] | undefined;
                            preferredTime?: "morning" | "afternoon" | "evening" | undefined;
                            maxDuration?: number | undefined;
                        };
                        shouldAdjustPlan: boolean;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    health: import('hono/client').ClientRequest<string, "/health", {
        $get: {
            input: {};
            output: {
                status: string;
                timestamp: string;
            };
            outputFormat: "json";
            status: import('hono/utils/http-status').ContentfulStatusCode;
        };
    }>;
} & {
    api: {
        workouts: {
            today: import('hono/client').ClientRequest<string, "/api/workouts/today", {
                $get: {
                    input: {};
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {};
                    output: {
                        hasWorkout: boolean;
                        workout?: {
                            workoutId: string;
                            planId: string;
                            type: string;
                            durationMinutes: number;
                            activities: {
                                type: "warmup" | "main" | "cooldown";
                                instructions: string;
                                durationMinutes: number;
                            }[];
                        } | undefined;
                        message?: string | undefined;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        workouts: {
            upcoming: import('hono/client').ClientRequest<string, "/api/workouts/upcoming", {
                $get: {
                    input: {
                        json: {
                            days?: number | undefined;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            days?: number | undefined;
                        };
                    };
                    output: {
                        workouts: {
                            workoutId: string;
                            day: string;
                            type: string;
                            durationMinutes: number;
                            status: string;
                        }[];
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        workouts: {
            history: import('hono/client').ClientRequest<string, "/api/workouts/history", {
                $get: {
                    input: {
                        json: {
                            limit?: number | undefined;
                            offset?: number | undefined;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            limit?: number | undefined;
                            offset?: number | undefined;
                        };
                    };
                    output: {
                        workouts: {
                            id: string;
                            type: string;
                            date: string;
                            durationMinutes: number;
                            perceivedExertion: number;
                            enjoyment: number;
                            verified: boolean;
                            reactionCount: number;
                        }[];
                        total: number;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        workouts: {
            skip: import('hono/client').ClientRequest<string, "/api/workouts/skip", {
                $post: {
                    input: {
                        json: {
                            planId: string;
                            workoutId: string;
                            reason: string;
                        };
                    };
                    output: {
                        error: string;
                    };
                    outputFormat: "json";
                    status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                } | {
                    input: {
                        json: {
                            planId: string;
                            workoutId: string;
                            reason: string;
                        };
                    };
                    output: {
                        planId: string;
                        skippedWorkoutId: string;
                        message: string;
                    };
                    outputFormat: "json";
                    status: import('hono/utils/http-status').ContentfulStatusCode;
                };
            }>;
        };
    };
} & {
    api: {
        workouts: {
            ":sessionId": {
                start: import('hono/client').ClientRequest<string, "/api/workouts/:sessionId/start", {
                    $post: {
                        input: {
                            json: {
                                userName: string;
                                userAvatar?: string | undefined;
                                fromPlan?: boolean | undefined;
                                workoutType?: string | undefined;
                                activities?: Readonly<{
                                    name: string;
                                    type: "warmup" | "main" | "cooldown" | "interval" | "circuit";
                                    order: number;
                                    structure?: unknown;
                                    instructions?: string[] | undefined;
                                    distance?: number | undefined;
                                    duration?: number | undefined;
                                    pace?: string | undefined;
                                    videoUrl?: string | undefined;
                                    equipment?: string[] | undefined;
                                    alternativeExercises?: string[] | undefined;
                                }>[] | undefined;
                                isMultiplayer?: boolean | undefined;
                                isPublic?: boolean | undefined;
                            };
                        } & {
                            param: {
                                sessionId: string;
                            };
                        };
                        output: {
                            error: string;
                        };
                        outputFormat: "json";
                        status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                    } | {
                        input: {
                            json: {
                                userName: string;
                                userAvatar?: string | undefined;
                                fromPlan?: boolean | undefined;
                                workoutType?: string | undefined;
                                activities?: Readonly<{
                                    name: string;
                                    type: "warmup" | "main" | "cooldown" | "interval" | "circuit";
                                    order: number;
                                    structure?: unknown;
                                    instructions?: string[] | undefined;
                                    distance?: number | undefined;
                                    duration?: number | undefined;
                                    pace?: string | undefined;
                                    videoUrl?: string | undefined;
                                    equipment?: string[] | undefined;
                                    alternativeExercises?: string[] | undefined;
                                }>[] | undefined;
                                isMultiplayer?: boolean | undefined;
                                isPublic?: boolean | undefined;
                            };
                        } & {
                            param: {
                                sessionId: string;
                            };
                        };
                        output: {
                            sessionId: string;
                            workoutType: string;
                            totalActivities: number;
                            estimatedDurationMinutes: number;
                            currentActivity: {
                                type: string;
                                instructions: string[];
                            };
                        };
                        outputFormat: "json";
                        status: import('hono/utils/http-status').ContentfulStatusCode;
                    };
                }>;
            };
        };
    };
} & {
    api: {
        workouts: {
            ":sessionId": {
                complete: import('hono/client').ClientRequest<string, "/api/workouts/:sessionId/complete", {
                    $post: {
                        input: {
                            json: {
                                sessionId: string;
                                performance: {
                                    completedAt: string;
                                    durationMinutes: number;
                                    perceivedExertion: number;
                                    enjoyment: number;
                                    activities: {
                                        activityId: string;
                                        perceivedExertion: number;
                                        enjoyment: number;
                                        difficultyRating: "too_easy" | "just_right" | "too_hard";
                                        exercises?: {
                                            name: string;
                                            setsCompleted: number;
                                            weight?: number[] | undefined;
                                            reps?: number[] | undefined;
                                            duration?: number | undefined;
                                            distance?: number | undefined;
                                            rpe?: number | undefined;
                                            rir?: number | undefined;
                                        }[] | undefined;
                                        duration?: number | undefined;
                                        notes?: string | undefined;
                                    }[];
                                    notes?: string | undefined;
                                };
                                verification: {
                                    method: "gps" | "photo" | "wearable" | "witness" | "gym_checkin" | "manual";
                                    verified: boolean;
                                    data: {
                                        timestamp: string;
                                        proof?: string | undefined;
                                        location?: {
                                            lat: number;
                                            lng: number;
                                            accuracy?: number | undefined;
                                        } | undefined;
                                        duration?: number | undefined;
                                    };
                                    verifiedAt: string;
                                    verifierId?: string | undefined;
                                    sponsorEligible?: boolean | undefined;
                                };
                                shareToFeed?: boolean | undefined;
                            };
                        } & {
                            param: {
                                sessionId: string;
                            };
                        };
                        output: {
                            error: string;
                        };
                        outputFormat: "json";
                        status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                    } | {
                        input: {
                            json: {
                                sessionId: string;
                                performance: {
                                    completedAt: string;
                                    durationMinutes: number;
                                    perceivedExertion: number;
                                    enjoyment: number;
                                    activities: {
                                        activityId: string;
                                        perceivedExertion: number;
                                        enjoyment: number;
                                        difficultyRating: "too_easy" | "just_right" | "too_hard";
                                        exercises?: {
                                            name: string;
                                            setsCompleted: number;
                                            weight?: number[] | undefined;
                                            reps?: number[] | undefined;
                                            duration?: number | undefined;
                                            distance?: number | undefined;
                                            rpe?: number | undefined;
                                            rir?: number | undefined;
                                        }[] | undefined;
                                        duration?: number | undefined;
                                        notes?: string | undefined;
                                    }[];
                                    notes?: string | undefined;
                                };
                                verification: {
                                    method: "gps" | "photo" | "wearable" | "witness" | "gym_checkin" | "manual";
                                    verified: boolean;
                                    data: {
                                        timestamp: string;
                                        proof?: string | undefined;
                                        location?: {
                                            lat: number;
                                            lng: number;
                                            accuracy?: number | undefined;
                                        } | undefined;
                                        duration?: number | undefined;
                                    };
                                    verifiedAt: string;
                                    verifierId?: string | undefined;
                                    sponsorEligible?: boolean | undefined;
                                };
                                shareToFeed?: boolean | undefined;
                            };
                        } & {
                            param: {
                                sessionId: string;
                            };
                        };
                        output: {
                            workoutId: string;
                            achievementsEarned: {
                                id: string;
                                name: string;
                                description: string;
                            }[];
                            stats: {
                                totalWorkouts: number;
                                totalVolume: number;
                                totalMinutes: number;
                            };
                            newStreak?: number | undefined;
                        };
                        outputFormat: "json";
                        status: import('hono/utils/http-status').ContentfulStatusCode;
                    };
                }>;
            };
        };
    };
} & {
    api: {
        workouts: {
            ":sessionId": {
                join: import('hono/client').ClientRequest<string, "/api/workouts/:sessionId/join", {
                    $post: {
                        input: {
                            json: {
                                userName: string;
                                sessionId: string;
                                userAvatar?: string | undefined;
                            };
                        } & {
                            param: {
                                sessionId: string;
                            };
                        };
                        output: {
                            error: string;
                        };
                        outputFormat: "json";
                        status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                    } | {
                        input: {
                            json: {
                                userName: string;
                                sessionId: string;
                                userAvatar?: string | undefined;
                            };
                        } & {
                            param: {
                                sessionId: string;
                            };
                        };
                        output: {
                            sessionId: string;
                            workoutType: string;
                            participants: {
                                userId: string;
                                userName: string;
                                status: string;
                            }[];
                            currentActivity: {
                                type: string;
                                instructions: string[];
                            };
                        };
                        outputFormat: "json";
                        status: import('hono/utils/http-status').ContentfulStatusCode;
                    };
                }>;
            };
        };
    };
} & {
    api: {
        workouts: {
            ":sessionId": {
                reaction: import('hono/client').ClientRequest<string, "/api/workouts/:sessionId/reaction", {
                    $post: {
                        input: {
                            json: {
                                workoutId: string;
                                reactionType: "fire" | "strong" | "clap" | "heart" | "smile";
                            };
                        } & {
                            param: {
                                sessionId: string;
                            };
                        };
                        output: {
                            error: string;
                        };
                        outputFormat: "json";
                        status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
                    } | {
                        input: {
                            json: {
                                workoutId: string;
                                reactionType: "fire" | "strong" | "clap" | "heart" | "smile";
                            };
                        } & {
                            param: {
                                sessionId: string;
                            };
                        };
                        output: {
                            workoutId: string;
                            totalReactions: number;
                        };
                        outputFormat: "json";
                        status: import('hono/utils/http-status').ContentfulStatusCode;
                    };
                }>;
            };
        };
    };
};
export type ApiClient = typeof client;
export { ApiError };
//# sourceMappingURL=client.d.ts.map