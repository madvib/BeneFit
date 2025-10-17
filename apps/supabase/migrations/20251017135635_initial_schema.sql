create table "public"."activity_items" (
    "id" bigint not null,
    "type" text not null,
    "title" text not null,
    "description" text not null,
    "timestamp" timestamp with time zone not null,
    "user" text not null,
    "avatar" text not null,
    "duration" text,
    "calories" integer,
    "value" numeric,
    "goal" numeric
);


alter table "public"."activity_items" enable row level security;

create table "public"."blog_posts" (
    "id" bigint not null,
    "title" text not null,
    "excerpt" text not null,
    "date" date not null,
    "author" text not null,
    "read_time" text not null,
    "category" text not null,
    "image" text not null
);


alter table "public"."blog_posts" enable row level security;

create table "public"."chart_data" (
    "date" date not null,
    "value" numeric not null
);


alter table "public"."chart_data" enable row level security;

create table "public"."chats" (
    "id" bigint not null,
    "title" text not null,
    "last_message" text not null,
    "timestamp" timestamp with time zone not null,
    "unread" boolean not null default false
);


alter table "public"."chats" enable row level security;

create table "public"."goals" (
    "id" bigint not null,
    "title" text not null,
    "description" text not null,
    "target_value" numeric not null,
    "current_value" numeric not null,
    "unit" text not null,
    "deadline" date not null,
    "status" text not null
);


alter table "public"."goals" enable row level security;

create table "public"."messages" (
    "id" bigint not null,
    "content" text not null,
    "sender" text not null,
    "timestamp" timestamp with time zone not null
);


alter table "public"."messages" enable row level security;

create table "public"."plan_suggestions" (
    "id" bigint not null,
    "name" text not null,
    "difficulty" text not null,
    "duration" text not null,
    "category" text not null
);


alter table "public"."plan_suggestions" enable row level security;

create table "public"."plans" (
    "id" bigint not null,
    "name" text not null,
    "description" text not null,
    "duration" text not null,
    "difficulty" text not null,
    "category" text not null,
    "progress" numeric not null
);


alter table "public"."plans" enable row level security;

create table "public"."recommendations" (
    "id" bigint not null,
    "title" text not null,
    "description" text not null,
    "category" text not null
);


alter table "public"."recommendations" enable row level security;

create table "public"."service_connections" (
    "id" bigint not null,
    "name" text not null,
    "description" text not null,
    "connected" boolean not null default false,
    "logo" text not null,
    "last_sync" timestamp with time zone,
    "data_type" text[] not null
);


alter table "public"."service_connections" enable row level security;

create table "public"."workout_plans" (
    "id" bigint not null,
    "day" text not null,
    "date" date not null,
    "exercise" text not null,
    "sets" integer not null,
    "reps" integer not null,
    "duration" text,
    "completed" boolean not null default false
);


alter table "public"."workout_plans" enable row level security;

create table "public"."workouts" (
    "id" bigint not null,
    "date" date not null,
    "type" text not null,
    "duration" text not null,
    "distance" text,
    "sets" integer,
    "laps" integer,
    "calories" integer not null
);


alter table "public"."workouts" enable row level security;

CREATE UNIQUE INDEX activity_items_pkey ON public.activity_items USING btree (id);

CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id);

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE UNIQUE INDEX goals_pkey ON public.goals USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX plan_suggestions_pkey ON public.plan_suggestions USING btree (id);

CREATE UNIQUE INDEX plans_pkey ON public.plans USING btree (id);

CREATE UNIQUE INDEX recommendations_pkey ON public.recommendations USING btree (id);

CREATE UNIQUE INDEX service_connections_pkey ON public.service_connections USING btree (id);

CREATE UNIQUE INDEX workout_plans_pkey ON public.workout_plans USING btree (id);

CREATE UNIQUE INDEX workouts_pkey ON public.workouts USING btree (id);

alter table "public"."activity_items" add constraint "activity_items_pkey" PRIMARY KEY using index "activity_items_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_pkey" PRIMARY KEY using index "blog_posts_pkey";

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."goals" add constraint "goals_pkey" PRIMARY KEY using index "goals_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."plan_suggestions" add constraint "plan_suggestions_pkey" PRIMARY KEY using index "plan_suggestions_pkey";

alter table "public"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "public"."recommendations" add constraint "recommendations_pkey" PRIMARY KEY using index "recommendations_pkey";

alter table "public"."service_connections" add constraint "service_connections_pkey" PRIMARY KEY using index "service_connections_pkey";

alter table "public"."workout_plans" add constraint "workout_plans_pkey" PRIMARY KEY using index "workout_plans_pkey";

alter table "public"."workouts" add constraint "workouts_pkey" PRIMARY KEY using index "workouts_pkey";

alter table "public"."activity_items" add constraint "activity_items_type_check" CHECK ((type = ANY (ARRAY['workout'::text, 'nutrition'::text, 'goal'::text, 'achievement'::text, 'progress'::text]))) not valid;

alter table "public"."activity_items" validate constraint "activity_items_type_check";

alter table "public"."goals" add constraint "goals_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'overdue'::text]))) not valid;

alter table "public"."goals" validate constraint "goals_status_check";

alter table "public"."messages" add constraint "messages_sender_check" CHECK ((sender = ANY (ARRAY['user'::text, 'coach'::text]))) not valid;

alter table "public"."messages" validate constraint "messages_sender_check";

alter table "public"."plan_suggestions" add constraint "plan_suggestions_difficulty_check" CHECK ((difficulty = ANY (ARRAY['Beginner'::text, 'Intermediate'::text, 'Advanced'::text]))) not valid;

alter table "public"."plan_suggestions" validate constraint "plan_suggestions_difficulty_check";

alter table "public"."plans" add constraint "plans_difficulty_check" CHECK ((difficulty = ANY (ARRAY['Beginner'::text, 'Intermediate'::text, 'Advanced'::text]))) not valid;

alter table "public"."plans" validate constraint "plans_difficulty_check";

grant delete on table "public"."activity_items" to "anon";

grant insert on table "public"."activity_items" to "anon";

grant references on table "public"."activity_items" to "anon";

grant select on table "public"."activity_items" to "anon";

grant trigger on table "public"."activity_items" to "anon";

grant truncate on table "public"."activity_items" to "anon";

grant update on table "public"."activity_items" to "anon";

grant delete on table "public"."activity_items" to "authenticated";

grant insert on table "public"."activity_items" to "authenticated";

grant references on table "public"."activity_items" to "authenticated";

grant select on table "public"."activity_items" to "authenticated";

grant trigger on table "public"."activity_items" to "authenticated";

grant truncate on table "public"."activity_items" to "authenticated";

grant update on table "public"."activity_items" to "authenticated";

grant delete on table "public"."activity_items" to "service_role";

grant insert on table "public"."activity_items" to "service_role";

grant references on table "public"."activity_items" to "service_role";

grant select on table "public"."activity_items" to "service_role";

grant trigger on table "public"."activity_items" to "service_role";

grant truncate on table "public"."activity_items" to "service_role";

grant update on table "public"."activity_items" to "service_role";

grant delete on table "public"."blog_posts" to "anon";

grant insert on table "public"."blog_posts" to "anon";

grant references on table "public"."blog_posts" to "anon";

grant select on table "public"."blog_posts" to "anon";

grant trigger on table "public"."blog_posts" to "anon";

grant truncate on table "public"."blog_posts" to "anon";

grant update on table "public"."blog_posts" to "anon";

grant delete on table "public"."blog_posts" to "authenticated";

grant insert on table "public"."blog_posts" to "authenticated";

grant references on table "public"."blog_posts" to "authenticated";

grant select on table "public"."blog_posts" to "authenticated";

grant trigger on table "public"."blog_posts" to "authenticated";

grant truncate on table "public"."blog_posts" to "authenticated";

grant update on table "public"."blog_posts" to "authenticated";

grant delete on table "public"."blog_posts" to "service_role";

grant insert on table "public"."blog_posts" to "service_role";

grant references on table "public"."blog_posts" to "service_role";

grant select on table "public"."blog_posts" to "service_role";

grant trigger on table "public"."blog_posts" to "service_role";

grant truncate on table "public"."blog_posts" to "service_role";

grant update on table "public"."blog_posts" to "service_role";

grant delete on table "public"."chart_data" to "anon";

grant insert on table "public"."chart_data" to "anon";

grant references on table "public"."chart_data" to "anon";

grant select on table "public"."chart_data" to "anon";

grant trigger on table "public"."chart_data" to "anon";

grant truncate on table "public"."chart_data" to "anon";

grant update on table "public"."chart_data" to "anon";

grant delete on table "public"."chart_data" to "authenticated";

grant insert on table "public"."chart_data" to "authenticated";

grant references on table "public"."chart_data" to "authenticated";

grant select on table "public"."chart_data" to "authenticated";

grant trigger on table "public"."chart_data" to "authenticated";

grant truncate on table "public"."chart_data" to "authenticated";

grant update on table "public"."chart_data" to "authenticated";

grant delete on table "public"."chart_data" to "service_role";

grant insert on table "public"."chart_data" to "service_role";

grant references on table "public"."chart_data" to "service_role";

grant select on table "public"."chart_data" to "service_role";

grant trigger on table "public"."chart_data" to "service_role";

grant truncate on table "public"."chart_data" to "service_role";

grant update on table "public"."chart_data" to "service_role";

grant delete on table "public"."chats" to "anon";

grant insert on table "public"."chats" to "anon";

grant references on table "public"."chats" to "anon";

grant select on table "public"."chats" to "anon";

grant trigger on table "public"."chats" to "anon";

grant truncate on table "public"."chats" to "anon";

grant update on table "public"."chats" to "anon";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";

grant delete on table "public"."goals" to "anon";

grant insert on table "public"."goals" to "anon";

grant references on table "public"."goals" to "anon";

grant select on table "public"."goals" to "anon";

grant trigger on table "public"."goals" to "anon";

grant truncate on table "public"."goals" to "anon";

grant update on table "public"."goals" to "anon";

grant delete on table "public"."goals" to "authenticated";

grant insert on table "public"."goals" to "authenticated";

grant references on table "public"."goals" to "authenticated";

grant select on table "public"."goals" to "authenticated";

grant trigger on table "public"."goals" to "authenticated";

grant truncate on table "public"."goals" to "authenticated";

grant update on table "public"."goals" to "authenticated";

grant delete on table "public"."goals" to "service_role";

grant insert on table "public"."goals" to "service_role";

grant references on table "public"."goals" to "service_role";

grant select on table "public"."goals" to "service_role";

grant trigger on table "public"."goals" to "service_role";

grant truncate on table "public"."goals" to "service_role";

grant update on table "public"."goals" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."plan_suggestions" to "anon";

grant insert on table "public"."plan_suggestions" to "anon";

grant references on table "public"."plan_suggestions" to "anon";

grant select on table "public"."plan_suggestions" to "anon";

grant trigger on table "public"."plan_suggestions" to "anon";

grant truncate on table "public"."plan_suggestions" to "anon";

grant update on table "public"."plan_suggestions" to "anon";

grant delete on table "public"."plan_suggestions" to "authenticated";

grant insert on table "public"."plan_suggestions" to "authenticated";

grant references on table "public"."plan_suggestions" to "authenticated";

grant select on table "public"."plan_suggestions" to "authenticated";

grant trigger on table "public"."plan_suggestions" to "authenticated";

grant truncate on table "public"."plan_suggestions" to "authenticated";

grant update on table "public"."plan_suggestions" to "authenticated";

grant delete on table "public"."plan_suggestions" to "service_role";

grant insert on table "public"."plan_suggestions" to "service_role";

grant references on table "public"."plan_suggestions" to "service_role";

grant select on table "public"."plan_suggestions" to "service_role";

grant trigger on table "public"."plan_suggestions" to "service_role";

grant truncate on table "public"."plan_suggestions" to "service_role";

grant update on table "public"."plan_suggestions" to "service_role";

grant delete on table "public"."plans" to "anon";

grant insert on table "public"."plans" to "anon";

grant references on table "public"."plans" to "anon";

grant select on table "public"."plans" to "anon";

grant trigger on table "public"."plans" to "anon";

grant truncate on table "public"."plans" to "anon";

grant update on table "public"."plans" to "anon";

grant delete on table "public"."plans" to "authenticated";

grant insert on table "public"."plans" to "authenticated";

grant references on table "public"."plans" to "authenticated";

grant select on table "public"."plans" to "authenticated";

grant trigger on table "public"."plans" to "authenticated";

grant truncate on table "public"."plans" to "authenticated";

grant update on table "public"."plans" to "authenticated";

grant delete on table "public"."plans" to "service_role";

grant insert on table "public"."plans" to "service_role";

grant references on table "public"."plans" to "service_role";

grant select on table "public"."plans" to "service_role";

grant trigger on table "public"."plans" to "service_role";

grant truncate on table "public"."plans" to "service_role";

grant update on table "public"."plans" to "service_role";

grant delete on table "public"."recommendations" to "anon";

grant insert on table "public"."recommendations" to "anon";

grant references on table "public"."recommendations" to "anon";

grant select on table "public"."recommendations" to "anon";

grant trigger on table "public"."recommendations" to "anon";

grant truncate on table "public"."recommendations" to "anon";

grant update on table "public"."recommendations" to "anon";

grant delete on table "public"."recommendations" to "authenticated";

grant insert on table "public"."recommendations" to "authenticated";

grant references on table "public"."recommendations" to "authenticated";

grant select on table "public"."recommendations" to "authenticated";

grant trigger on table "public"."recommendations" to "authenticated";

grant truncate on table "public"."recommendations" to "authenticated";

grant update on table "public"."recommendations" to "authenticated";

grant delete on table "public"."recommendations" to "service_role";

grant insert on table "public"."recommendations" to "service_role";

grant references on table "public"."recommendations" to "service_role";

grant select on table "public"."recommendations" to "service_role";

grant trigger on table "public"."recommendations" to "service_role";

grant truncate on table "public"."recommendations" to "service_role";

grant update on table "public"."recommendations" to "service_role";

grant delete on table "public"."service_connections" to "anon";

grant insert on table "public"."service_connections" to "anon";

grant references on table "public"."service_connections" to "anon";

grant select on table "public"."service_connections" to "anon";

grant trigger on table "public"."service_connections" to "anon";

grant truncate on table "public"."service_connections" to "anon";

grant update on table "public"."service_connections" to "anon";

grant delete on table "public"."service_connections" to "authenticated";

grant insert on table "public"."service_connections" to "authenticated";

grant references on table "public"."service_connections" to "authenticated";

grant select on table "public"."service_connections" to "authenticated";

grant trigger on table "public"."service_connections" to "authenticated";

grant truncate on table "public"."service_connections" to "authenticated";

grant update on table "public"."service_connections" to "authenticated";

grant delete on table "public"."service_connections" to "service_role";

grant insert on table "public"."service_connections" to "service_role";

grant references on table "public"."service_connections" to "service_role";

grant select on table "public"."service_connections" to "service_role";

grant trigger on table "public"."service_connections" to "service_role";

grant truncate on table "public"."service_connections" to "service_role";

grant update on table "public"."service_connections" to "service_role";

grant delete on table "public"."workout_plans" to "anon";

grant insert on table "public"."workout_plans" to "anon";

grant references on table "public"."workout_plans" to "anon";

grant select on table "public"."workout_plans" to "anon";

grant trigger on table "public"."workout_plans" to "anon";

grant truncate on table "public"."workout_plans" to "anon";

grant update on table "public"."workout_plans" to "anon";

grant delete on table "public"."workout_plans" to "authenticated";

grant insert on table "public"."workout_plans" to "authenticated";

grant references on table "public"."workout_plans" to "authenticated";

grant select on table "public"."workout_plans" to "authenticated";

grant trigger on table "public"."workout_plans" to "authenticated";

grant truncate on table "public"."workout_plans" to "authenticated";

grant update on table "public"."workout_plans" to "authenticated";

grant delete on table "public"."workout_plans" to "service_role";

grant insert on table "public"."workout_plans" to "service_role";

grant references on table "public"."workout_plans" to "service_role";

grant select on table "public"."workout_plans" to "service_role";

grant trigger on table "public"."workout_plans" to "service_role";

grant truncate on table "public"."workout_plans" to "service_role";

grant update on table "public"."workout_plans" to "service_role";

grant delete on table "public"."workouts" to "anon";

grant insert on table "public"."workouts" to "anon";

grant references on table "public"."workouts" to "anon";

grant select on table "public"."workouts" to "anon";

grant trigger on table "public"."workouts" to "anon";

grant truncate on table "public"."workouts" to "anon";

grant update on table "public"."workouts" to "anon";

grant delete on table "public"."workouts" to "authenticated";

grant insert on table "public"."workouts" to "authenticated";

grant references on table "public"."workouts" to "authenticated";

grant select on table "public"."workouts" to "authenticated";

grant trigger on table "public"."workouts" to "authenticated";

grant truncate on table "public"."workouts" to "authenticated";

grant update on table "public"."workouts" to "authenticated";

grant delete on table "public"."workouts" to "service_role";

grant insert on table "public"."workouts" to "service_role";

grant references on table "public"."workouts" to "service_role";

grant select on table "public"."workouts" to "service_role";

grant trigger on table "public"."workouts" to "service_role";

grant truncate on table "public"."workouts" to "service_role";

grant update on table "public"."workouts" to "service_role";

create policy "Public activity items are viewable by everyone."
on "public"."activity_items"
as permissive
for select
to public
using (true);


create policy "Public blog posts are viewable by everyone."
on "public"."blog_posts"
as permissive
for select
to public
using (true);


create policy "Public chart data is viewable by everyone."
on "public"."chart_data"
as permissive
for select
to public
using (true);


create policy "Public chats are viewable by everyone."
on "public"."chats"
as permissive
for select
to public
using (true);


create policy "Public goals are viewable by everyone."
on "public"."goals"
as permissive
for select
to public
using (true);


create policy "Public messages are viewable by everyone."
on "public"."messages"
as permissive
for select
to public
using (true);


create policy "Public plan suggestions are viewable by everyone."
on "public"."plan_suggestions"
as permissive
for select
to public
using (true);


create policy "Public plans are viewable by everyone."
on "public"."plans"
as permissive
for select
to public
using (true);


create policy "Public recommendations are viewable by everyone."
on "public"."recommendations"
as permissive
for select
to public
using (true);


create policy "Public service connections are viewable by everyone."
on "public"."service_connections"
as permissive
for select
to public
using (true);


create policy "Public workout plans are viewable by everyone."
on "public"."workout_plans"
as permissive
for select
to public
using (true);


create policy "Public workouts are viewable by everyone."
on "public"."workouts"
as permissive
for select
to public
using (true);



