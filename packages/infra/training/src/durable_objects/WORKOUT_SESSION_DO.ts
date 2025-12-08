// // packages/infrastructure/src/durable-objects/agents/workout-session-agent.ts

// import type {
//   WorkoutSession,
//   createWorkoutSession,
//   startSession,
//   joinSession,
//   pauseSession,
//   resumeSession,
//   completeActivity,
//   abandonSession,
//   addChatMessage,
//   sendEncouragement,
// } from '@benefit/training-domain';

// /**
//  * WorkoutSessionAgent Durable Object
//  *
//  * Real-time multiplayer workout sessions using WebSockets
//  * Uses Cloudflare Agents API for simplified WebSocket handling
//  *
//  * Features:
//  * - Live participant tracking
//  * - Real-time activity updates
//  * - Chat and encouragement
//  * - Form check-ins from AI coach
//  * - Activity feed broadcasts
//  */
// export class WorkoutSessionAgent extends DurableObject {
//   private session: WorkoutSession | null = null;
//   private connections: Map<WebSocket, ParticipantConnection> = new Map();

//   constructor(ctx: DurableObjectState, env: Env) {
//     super(ctx, env);

//     ctx.blockConcurrencyWhile(async () => {
//       await this.hydrate();
//     });
//   }

//   async fetch(request: Request): Promise<Response> {
//     const url = new URL(request.url);
//     const method = request.method;

//     try {
//       // WebSocket endpoint
//       if (url.pathname === '/live') {
//         return this.handleWebSocket(request);
//       }

//       // REST endpoints
//       switch (url.pathname) {
//         case '/start':
//           return this.handleStart(method, request);
//         case '/join':
//           return this.handleJoin(method, request);
//         case '/pause':
//           return this.handlePause(method);
//         case '/resume':
//           return this.handleResume(method);
//         case '/complete':
//           return this.handleComplete(method, request);
//         case '/abandon':
//           return this.handleAbandon(method, request);
//         case '/status':
//           return this.handleStatus();
//         default:
//           return new Response('Not found', { status: 404 });
//       }
//     } catch (error) {
//       console.error('WorkoutSessionAgent error:', error);
//       return new Response(JSON.stringify({ error: String(error) }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   }

//   // ============================================================================
//   // WEBSOCKET HANDLING
//   // ============================================================================

//   private async handleWebSocket(request: Request): Promise<Response> {
//     // Verify WebSocket upgrade
//     const upgradeHeader = request.headers.get('Upgrade');
//     if (upgradeHeader !== 'websocket') {
//       return new Response('Expected Upgrade: websocket', { status: 426 });
//     }

//     // Extract auth info from headers
//     const userId = request.headers.get('X-User-Id');
//     const userName = request.headers.get('X-User-Name');

//     if (!userId || !userName) {
//       return new Response('Missing auth headers', { status: 401 });
//     }

//     // Create WebSocket pair
//     const pair = new WebSocketPair();
//     const [client, server] = Object.values(pair);

//     // Accept WebSocket
//     server.accept();

//     // Store connection
//     const connection: ParticipantConnection = {
//       userId,
//       userName,
//       socket: server,
//       joinedAt: new Date(),
//     };

//     this.connections.set(server, connection);

//     // Broadcast join event
//     this.broadcast(
//       {
//         type: 'participant_joined',
//         userId,
//         userName,
//         timestamp: Date.now(),
//       },
//       server,
//     ); // Exclude the joining user

//     // Send current state to new participant
//     server.send(
//       JSON.stringify({
//         type: 'session_state',
//         session: this.serializeSession(),
//         participants: this.getParticipantsList(),
//       }),
//     );

//     // Handle messages
//     server.addEventListener('message', (event) => {
//       this.handleWebSocketMessage(connection, event.data as string);
//     });

//     // Handle close
//     server.addEventListener('close', () => {
//       this.handleWebSocketClose(connection);
//     });

//     // Handle errors
//     server.addEventListener('error', (event) => {
//       console.error('WebSocket error:', event);
//       this.handleWebSocketClose(connection);
//     });

//     // Return WebSocket response
//     return new Response(null, {
//       status: 101,
//       webSocket: client,
//     });
//   }

//   private handleWebSocketMessage(
//     connection: ParticipantConnection,
//     data: string,
//   ): void {
//     try {
//       const message = JSON.parse(data);

//       switch (message.type) {
//         case 'activity_completed':
//           this.handleActivityCompletedMessage(connection, message.data);
//           break;

//         case 'activity_progress':
//           this.handleActivityProgressMessage(connection, message.data);
//           break;

//         case 'chat':
//           this.handleChatMessage(connection, message.text);
//           break;

//         case 'encouragement':
//           this.handleEncouragementMessage(connection, message);
//           break;

//         case 'pause':
//           this.handlePauseMessage(connection);
//           break;

//         case 'resume':
//           this.handleResumeMessage(connection);
//           break;

//         default:
//           console.warn('Unknown message type:', message.type);
//       }
//     } catch (error) {
//       console.error('Error handling WebSocket message:', error);
//       connection.socket.send(
//         JSON.stringify({
//           type: 'error',
//           error: 'Failed to process message',
//         }),
//       );
//     }
//   }

//   private handleWebSocketClose(connection: ParticipantConnection): void {
//     this.connections.delete(connection.socket);

//     // Broadcast leave event
//     this.broadcast({
//       type: 'participant_left',
//       userId: connection.userId,
//       userName: connection.userName,
//       timestamp: Date.now(),
//     });

//     // If no more participants, schedule cleanup
//     if (this.connections.size === 0 && this.session) {
//       this.scheduleCleanup();
//     }
//   }

//   // ============================================================================
//   // MESSAGE HANDLERS
//   // ============================================================================

//   private handleActivityCompletedMessage(
//     connection: ParticipantConnection,
//     data: any,
//   ): void {
//     if (!this.session) return;

//     // Update session state (domain logic)
//     // const result = completeActivity(this.session, data);
//     // if (result.isSuccess) {
//     //   this.session = result.value;
//     //   this.persist();
//     // }

//     // Broadcast to all
//     this.broadcast({
//       type: 'activity_completed',
//       userId: connection.userId,
//       userName: connection.userName,
//       activity: data.activityType,
//       timestamp: Date.now(),
//     });
//   }

//   private handleActivityProgressMessage(
//     connection: ParticipantConnection,
//     data: any,
//   ): void {
//     // Broadcast live progress updates
//     this.broadcast(
//       {
//         type: 'activity_progress',
//         userId: connection.userId,
//         progress: data,
//       },
//       connection.socket,
//     ); // Exclude sender
//   }

//   private handleChatMessage(connection: ParticipantConnection, text: string): void {
//     if (!this.session) return;

//     // Add to session (domain logic)
//     // const result = addChatMessage(this.session, connection.userId, connection.userName, text);
//     // if (result.isSuccess) {
//     //   this.session = result.value;
//     //   this.persist();
//     // }

//     // Broadcast to all
//     this.broadcast({
//       type: 'chat',
//       userId: connection.userId,
//       userName: connection.userName,
//       text,
//       timestamp: Date.now(),
//     });
//   }

//   private handleEncouragementMessage(
//     connection: ParticipantConnection,
//     message: any,
//   ): void {
//     if (!this.session) return;

//     // Add to session (domain logic)
//     // const result = sendEncouragement(this.session, connection.userId, connection.userName, message.targetUserId, message.text);

//     // Send to target user only
//     const targetConnection = Array.from(this.connections.values()).find(
//       (c) => c.userId === message.targetUserId,
//     );

//     if (targetConnection) {
//       targetConnection.socket.send(
//         JSON.stringify({
//           type: 'encouragement',
//           from: connection.userName,
//           fromUserId: connection.userId,
//           text: message.text,
//           timestamp: Date.now(),
//         }),
//       );
//     }

//     // Also broadcast to feed
//     this.broadcast({
//       type: 'encouragement_sent',
//       from: connection.userName,
//       to: message.targetUserId,
//       timestamp: Date.now(),
//     });
//   }

//   private handlePauseMessage(connection: ParticipantConnection): void {
//     if (!this.session || this.session.ownerId !== connection.userId) return;

//     // const result = pauseSession(this.session);
//     // if (result.isSuccess) {
//     //   this.session = result.value;
//     //   this.persist();
//     // }

//     this.broadcast({
//       type: 'session_paused',
//       timestamp: Date.now(),
//     });
//   }

//   private handleResumeMessage(connection: ParticipantConnection): void {
//     if (!this.session || this.session.ownerId !== connection.userId) return;

//     // const result = resumeSession(this.session);
//     // if (result.isSuccess) {
//     //   this.session = result.value;
//     //   this.persist();
//     // }

//     this.broadcast({
//       type: 'session_resumed',
//       timestamp: Date.now(),
//     });
//   }

//   // ============================================================================
//   // REST ENDPOINTS
//   // ============================================================================

//   private async handleStart(method: string, request: Request): Promise<Response> {
//     if (method !== 'POST') {
//       return new Response('Method not allowed', { status: 405 });
//     }

//     if (this.session) {
//       return new Response(JSON.stringify({ error: 'Session already started' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const data = await request.json();

//     // Create session (domain logic)
//     // const result = createWorkoutSession({
//     //   ownerId: data.userId,
//     //   workoutType: data.workoutType,
//     //   activities: data.activities,
//     //   isMultiplayer: data.isMultiplayer
//     // });

//     // if (result.isFailure) {
//     //   return new Response(result.error, { status: 400 });
//     // }

//     // const startedResult = startSession(result.value, data.userName, data.avatar);
//     // this.session = startedResult.value;

//     await this.persist();

//     return Response.json({
//       success: true,
//       sessionId: this.session?.id,
//     });
//   }

//   private async handleJoin(method: string, request: Request): Promise<Response> {
//     if (method !== 'POST') {
//       return new Response('Method not allowed', { status: 405 });
//     }

//     if (!this.session) {
//       return new Response(JSON.stringify({ error: 'Session not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const data = await request.json();

//     // Join session (domain logic)
//     // const result = joinSession(this.session, data.userId, data.userName, data.avatar);
//     // if (result.isFailure) {
//     //   return new Response(result.error, { status: 400 });
//     // }
//     // this.session = result.value;

//     await this.persist();

//     return Response.json({ success: true });
//   }

//   private async handlePause(method: string): Promise<Response> {
//     if (method !== 'POST') {
//       return new Response('Method not allowed', { status: 405 });
//     }

//     if (!this.session) {
//       return new Response(JSON.stringify({ error: 'Session not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // const result = pauseSession(this.session);
//     // if (result.isFailure) {
//     //   return new Response(result.error, { status: 400 });
//     // }
//     // this.session = result.value;

//     await this.persist();

//     this.broadcast({
//       type: 'session_paused',
//       timestamp: Date.now(),
//     });

//     return Response.json({ success: true });
//   }

//   private async handleResume(method: string): Promise<Response> {
//     if (method !== 'POST') {
//       return new Response('Method not allowed', { status: 405 });
//     }

//     if (!this.session) {
//       return new Response(JSON.stringify({ error: 'Session not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // const result = resumeSession(this.session);
//     // if (result.isFailure) {
//     //   return new Response(result.error, { status: 400 });
//     // }
//     // this.session = result.value;

//     await this.persist();

//     this.broadcast({
//       type: 'session_resumed',
//       timestamp: Date.now(),
//     });

//     return Response.json({ success: true });
//   }

//   private async handleComplete(method: string, request: Request): Promise<Response> {
//     if (method !== 'POST') {
//       return new Response('Method not allowed', { status: 405 });
//     }

//     if (!this.session) {
//       return new Response(JSON.stringify({ error: 'Session not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const data = await request.json();

//     // Mark as completed
//     this.session = {
//       ...this.session,
//       state: 'completed',
//       completedAt: new Date(),
//     };

//     await this.persist();

//     this.broadcast({
//       type: 'session_completed',
//       timestamp: Date.now(),
//     });

//     // Schedule cleanup (keep for 1 hour for replay)
//     await this.ctx.storage.setAlarm(Date.now() + 60 * 60 * 1000);

//     return Response.json({ success: true });
//   }

//   private async handleAbandon(method: string, request: Request): Promise<Response> {
//     if (method !== 'POST') {
//       return new Response('Method not allowed', { status: 405 });
//     }

//     if (!this.session) {
//       return new Response(JSON.stringify({ error: 'Session not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const data = await request.json();

//     // const result = abandonSession(this.session, data.reason);
//     // if (result.isSuccess) {
//     //   this.session = result.value;
//     // }

//     await this.persist();

//     this.broadcast({
//       type: 'session_abandoned',
//       reason: data.reason,
//       timestamp: Date.now(),
//     });

//     // Cleanup immediately
//     await this.ctx.storage.setAlarm(Date.now() + 5000);

//     return Response.json({ success: true });
//   }

//   private handleStatus(): Response {
//     return Response.json({
//       hasSession: this.session !== null,
//       state: this.session?.state || null,
//       participantCount: this.connections.size,
//       participants: this.getParticipantsList(),
//     });
//   }

//   // ============================================================================
//   // PERSISTENCE
//   // ============================================================================

//   private async hydrate(): Promise<void> {
//     const stored = await this.ctx.storage.get<WorkoutSession>('session');
//     this.session = stored || null;
//   }

//   private async persist(): Promise<void> {
//     if (this.session) {
//       await this.ctx.storage.put('session', this.session);
//     }
//   }

//   async alarm(): Promise<void> {
//     // Cleanup abandoned or completed sessions
//     if (
//       this.session &&
//       (this.session.state === 'completed' || this.session.state === 'abandoned')
//     ) {
//       await this.ctx.storage.deleteAll();

//       // Close all remaining connections
//       for (const connection of this.connections.values()) {
//         connection.socket.close();
//       }
//       this.connections.clear();
//     }
//   }

//   private scheduleCleanup(): void {
//     // Cleanup after 5 minutes of inactivity
//     this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1000);
//   }

//   // ============================================================================
//   // HELPERS
//   // ============================================================================

//   private broadcast(message: any, exclude?: WebSocket): void {
//     const json = JSON.stringify(message);

//     for (const connection of this.connections.values()) {
//       if (connection.socket !== exclude) {
//         try {
//           connection.socket.send(json);
//         } catch (error) {
//           console.error('Failed to send to client:', error);
//         }
//       }
//     }
//   }

//   private getParticipantsList(): Array<{
//     userId: string;
//     userName: string;
//     joinedAt: Date;
//   }> {
//     return Array.from(this.connections.values()).map((c) => ({
//       userId: c.userId,
//       userName: c.userName,
//       joinedAt: c.joinedAt,
//     }));
//   }

//   private serializeSession(): any {
//     if (!this.session) return null;

//     return {
//       id: this.session.id,
//       workoutType: this.session.workoutType,
//       state: this.session.state,
//       currentActivityIndex: this.session.currentActivityIndex,
//       activities: this.session.activities,
//       startedAt: this.session.startedAt,
//     };
//   }
// }

// // ============================================================================
// // TYPES
// // ============================================================================

// interface ParticipantConnection {
//   userId: string;
//   userName: string;
//   socket: WebSocket;
//   joinedAt: Date;
// }

// interface Env {
//   USER_AGENT: DurableObjectNamespace;
//   WORKOUT_SESSION_AGENT: DurableObjectNamespace;
//   DB: D1Database;
//   ANTHROPIC_API_KEY: string;
// }
